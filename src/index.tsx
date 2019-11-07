import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { AppComp } from './comp/AppComp'
import './index.css'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
	<HashRouter>
		<AppComp />
	</HashRouter>,
	document.getElementById('root'),
)

serviceWorker.register()
