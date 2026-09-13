/*
 * kathmaxxing service worker.
 *
 * Every page except history is static or pure client-side arithmetic, so the
 * whole shelf is worth keeping offline. Only the history tab needs the network,
 * and it degrades to its own error state when the request fails.
 */

const VERSION = "kathmaxxing-v4";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

// The subject shelf and every lesson are prerendered, so an install can hold
// the whole app rather than only the page the user happened to land on.
const PRECACHE = [
  "/",
  "/computer-science",
  "/algebra",
  "/algebra/integer-exponents",
  "/algebra/rational-exponents",
  "/algebra/radicals",
  "/algebra/factoring",
  "/algebra/calculator",
  "/calculus",
  "/calculus/lines",
  "/calculus/functions",
  "/calculus/graphs",
  "/calculus/graphing-calculator",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // A single missing entry must not fail the whole install.
      .then((cache) => Promise.allSettled(PRECACHE.map((path) => cache.add(path))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== SHELL && key !== RUNTIME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Server actions and any other POST-like traffic never reach here, but skip
  // Next's data endpoints explicitly so history always reflects the database.
  if (url.pathname.startsWith("/api/")) return;

  // Hashed build output is immutable, so cache it on first sight.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Pages come from the network when it is there, and from the shell when it
  // is not, so an installed app still opens on a plane. Each page is cached
  // under its own URL - storing every navigation under "/" would leave the
  // offline home page showing whichever lesson was opened last.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(SHELL).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit ?? caches.match("/"))),
    );
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((hit) => hit ?? Response.error())),
  );
});
