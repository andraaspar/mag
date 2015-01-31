/// <reference path='../../lib/adat/Database.ts'/>
/// <reference path='../../lib/adat/RequestAdd.ts'/>
/// <reference path='../../lib/adat/RequestIndexCursor.ts'/>
/// <reference path='../../lib/adat/RequestIndexGet.ts'/>
/// <reference path='../../lib/adat/Transaction.ts'/>

/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='model/MagModel.ts'/>

/// <reference path='presenter/MagPresenter.ts'/>

module mag {
	export class Main extends illa.EventHandler {
		
		private static instance = new Main();
		
		private model: model.MagModel;
		private presenter: presenter.MagPresenter;
		
		private debugModeEnabled = window.location.hash == '#debug';
		
		constructor() {
			super();
			
			if (this.debugModeEnabled) {
				illa.Log.info('Debug mode enabled.');
			}
			
			jQuery(window).on('load', illa.bind(this.onWindowLoaded, this));
		}
		
		onWindowLoaded(): void {
			illa.Log.info('DOM loaded.');
			
			this.model = new model.MagModel();
			this.presenter = new presenter.MagPresenter();
		}
		
		static getModel() { return this.instance.model }
		static getPresenter() { return this.instance.presenter }
		static getDebugModeEnabled() { return this.instance.debugModeEnabled }
		
		static getInstance() { return this.instance }
	}
}