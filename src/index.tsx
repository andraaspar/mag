import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AppComp } from './comp/AppComp'
import './css/index.css'

const root = createRoot(document.getElementById('root')!)
root.render(
	<HashRouter>
		<AppComp />
	</HashRouter>,
)

// window.addEventListener('load', async () => {
// 	try {
// 		const reg = await navigator.serviceWorker.register(
// 			new URL('./service-worker.js', import.meta.url),
// 			{ type: 'module', updateViaCache: 'none' },
// 		)
// 		console.log(`[t2n45k] Service worker registered.`)
// 		reg.update()
// 	} catch (e) {
// 		console.error(`[t2n45m]`, e)
// 	}
// })
