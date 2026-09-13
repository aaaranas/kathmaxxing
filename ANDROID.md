# Building the Android app

The app ships as a **Trusted Web Activity** — a thin native wrapper around
<https://kathmaxxing.vercel.app>. The APK holds the icon, the name and the
window; the app itself is still the deployed site, which means an update is a
`git push` rather than a reinstall.

Two routes to the same APK. Neither can run in a Claude Code web session,
because `dl.google.com` — where the Android SDK lives — is blocked by the
sandbox's network policy.

## Route 1 — PWABuilder, no toolchain needed

1. Open <https://www.pwabuilder.com> and enter `https://kathmaxxing.vercel.app`.
2. **Package for stores → Android**.
3. Set the package ID to `app.vercel.kathmaxxing.twa`, matching
   `twa-manifest.json`. Choose **create a new signing key** and keep the
   `.keystore` file it gives you somewhere safe — without it you can never ship
   an update to the same app.
4. Download the zip. Use `app-release-signed.apk` for sideloading; the `.aab`
   is for Google Play only and **cannot be installed directly**.

## Route 2 — Bubblewrap, on a machine with the Android SDK

`twa-manifest.json` in this repo is the Bubblewrap config, so there is no
interactive setup to sit through.

```bash
npm install -g @bubblewrap/cli
bubblewrap build          # writes app-release-signed.apk
bubblewrap fingerprint list
```

Needs JDK 17 or newer and the Android SDK. `bubblewrap doctor` reports what is
missing, and `bubblewrap init --manifest https://kathmaxxing.vercel.app/manifest.webmanifest`
regenerates the config from scratch if it ever drifts.

## Then: stop the address bar appearing

Out of the box the wrapper shows Chrome's address bar across the top, because
Android has no reason yet to believe the app and the site belong together. The
site has to vouch for the app.

1. Find the SHA-256 fingerprint of the signing key — it is in the
   `assetlinks.json` that PWABuilder includes in the zip, or from
   `bubblewrap fingerprint list`. It looks like
   `AB:CD:EF:...` , 32 pairs long.
2. In the Vercel project, add an environment variable:

   | Name | Value |
   | --- | --- |
   | `ANDROID_CERT_FINGERPRINT` | the fingerprint from step 1 |

3. **Redeploy.** Vercel does not apply a new environment variable to a running
   deployment, and this value is read at build time.
4. Check it took: `https://kathmaxxing.vercel.app/.well-known/assetlinks.json`
   should list the package and fingerprint rather than `[]`.
5. Reinstall the APK. The address bar should be gone.

If you change the package ID from the default, set `ANDROID_PACKAGE_NAME` in
Vercel to match.

## Installing on the phone

Send the `.apk` to the phone and open it. Android will ask for permission to
install from that source the first time — this is expected for anything not
coming from Play.

## Worth knowing before you publish

- **The package ID is permanent.** Once `app.vercel.kathmaxxing.twa` is on
  Google Play it can never be changed, and nor can the signing key.
- **The APK needs the network for a first load.** After that the service worker
  serves the whole shelf offline, but a wrapper around a URL is not the same as
  an app with the site baked inside it. If you want one that works with no
  connection at all, that is a Capacitor build — and the History tab would have
  to go, because it runs on Server Actions and Neon.
- **No APK needed at all**, if you would rather skip this: on Android, Chrome's
  "Install app" on the site gives a home-screen icon, its own window and the
  same offline behaviour.
