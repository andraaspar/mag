import { VitePWA } from 'vite-plugin-pwa'

/** @type {import('vite').UserConfig} */
export default {
	base: '',
	define: {
		__BUILD_DATE__: JSON.stringify(new Date().toLocaleString('hu')),
		__BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
	},
	plugins: [
		VitePWA({
			strategies: 'injectManifest',
			injectRegister: false,
			srcDir: 'src',
			filename: 'service-worker.ts',
		}),
	],
}
