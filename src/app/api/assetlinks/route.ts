/**
 * Digital Asset Links, for the Android wrapper.
 *
 * A Trusted Web Activity only runs without Chrome's address bar across the top
 * if the site vouches for the app: this file has to name the app's package and
 * the SHA-256 fingerprint of the key it was signed with, and the two have to
 * match what is inside the APK.
 *
 * The fingerprint does not exist until the signing key does, so it is read from
 * the environment rather than committed. Once the APK is built, set
 * ANDROID_CERT_FINGERPRINT in the Vercel project and redeploy - no code change.
 * Until then this correctly vouches for nobody.
 *
 * Served at /.well-known/assetlinks.json via a rewrite in next.config.ts,
 * because Next skips app-router folders whose name begins with a dot.
 */
export const dynamic = "force-static";

const PACKAGE_NAME = process.env.ANDROID_PACKAGE_NAME ?? "app.vercel.kathmaxxing.twa";

export function GET() {
  const fingerprint = process.env.ANDROID_CERT_FINGERPRINT?.trim();

  const statements = fingerprint
    ? [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: PACKAGE_NAME,
            sha256_cert_fingerprints: [fingerprint],
          },
        },
      ]
    : [];

  return new Response(JSON.stringify(statements, null, 2), {
    headers: {
      "content-type": "application/json",
      // Android re-checks this, and a stale copy is what leaves the address
      // bar showing long after the fingerprint was fixed.
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
