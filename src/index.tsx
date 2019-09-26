import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { AppComp } from './comp/AppComp'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
	<MemoryRouter>
		<AppComp />
	</MemoryRouter>,
	document.getElementById('root'),
)

serviceWorker.register()
