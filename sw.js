const CACHE_NAME = 'v1';
const urlsToCache = [
	'/404.html',
	'/index.html',
	'/devlog/index.html',
	'/tags/index.html',
	'/css/normalize.min.css',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(urlsToCache))
			.then(() => self.skipWaiting())
			.catch(console.error));
});

self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME];

	e.waitUntil(
		caches
			.keys()
			.then((cacheNames) => Promise.all(cacheNames.map((cacheName) => {
				if (!cacheWhitelist.includes(cacheName)) {
					return caches.delete(cacheName)
				}
			})))
			.catch(console.error));
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}

				return fetch(event.request)
					.then((response) => {
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}

						const responseToCache = response.clone()

						caches
							.open(CACHE_NAME)
							.then((cache) => {
								cache.put(event.request, responseToCache);
							})
							.catch(console.error)

						return response;
					})
					.catch(console.error);
			})
			.catch(console.error));
})
