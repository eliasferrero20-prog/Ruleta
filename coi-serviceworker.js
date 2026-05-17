const coop = "same-origin";
const coep = "require-corp";

if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (event) => {
        if (event.request.method === "GET" && event.request.url.startsWith(self.location.origin)) {
            event.respondWith(
                fetch(event.request)
                    .then((response) => {
                        if (response.status === 0) return response;
                        const newHeaders = new Headers(response.headers);
                        newHeaders.set("Cross-Origin-Opener-Policy", coop);
                        newHeaders.set("Cross-Origin-Embedder-Policy", coep);
                        return new Response(response.body, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: newHeaders,
                        });
                    })
                    .catch((e) => console.error(e))
            );
        }
    });
} else {
    if (window.crossOriginIsolated === false && "serviceWorker" in navigator) {
        navigator.serviceWorker.register(window.document.currentScript.src).then((registration) => {
            registration.addEventListener("updatefound", () => {
                window.location.reload();
            });
            if (registration.active && !navigator.serviceWorker.controller) {
                window.location.reload();
            }
        });
    }
}