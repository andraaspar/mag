const SW_SELF = self as any as ServiceWorkerGlobalScope
const cacheName = `tools-${__BUILD_TIMESTAMP__}`
const manifest = (self as any).__WB_MANIFEST as {
	revision: string | null
	url: string
}[]

SW_SELF.addEventListener('install', (event) => {
	console.log(`[rc6ig4] [INSTALL] ${__BUILD_TIMESTAMP__}`, manifest)
	event.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName)
			for (const { url } of manifest) {
				const response = await fetch(url, {
					cache: 'reload',
				})
				await cache.put(url, response)
			}
		})(),
	)
})
SW_SELF.addEventListener('activate', (event) => {
	console.log(`[rc6if6] [ACTIVATE] ${__BUILD_TIMESTAMP__}`)
	event.waitUntil(
		(async () => {
			const keys = await caches.keys()
			await Promise.all(
				keys.map((key) => key !== cacheName && caches.delete(key)),
			)
		})(),
	)
})
SW_SELF.addEventListener('fetch', (event) => {
	event.respondWith(
		(async () => {
			const requestPath = event.request.url.replace(
				SW_SELF.registration.scope,
				'',
			)

			const responseFromCache =
				requestPath === ''
					? await caches.match('index.html')
					: await caches.match(event.request)
			if (responseFromCache) {
				console.log(
					`[rc1cz1] [CACHE] ${__BUILD_TIMESTAMP__} ${event.request.url}`,
				)
				return responseFromCache
			} else {
				console.log(
					`[rc1d3c] [FETCH] ${__BUILD_TIMESTAMP__} ${event.request.url}`,
				)
				return fetch(event.request)
			}
		})(),
	)
})

console.log(`[rc6ie5] Service Worker initialized.`)
