//From  https://www.freecodecamp.org/news/build-a-pwa-from-scratch-with-html-css-and-javascript/
const staticDevCoffee = "staticDevCoffee string";
const assets = [
  "/static/index.html",
  "/static/css/style.css",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      //cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
