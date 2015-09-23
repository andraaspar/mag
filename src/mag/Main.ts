/// <reference path='../../lib/adat/Database.ts'/>
/// <reference path='../../lib/adat/RequestAdd.ts'/>
/// <reference path='../../lib/adat/RequestIndexCursor.ts'/>
/// <reference path='../../lib/adat/RequestIndexGet.ts'/>
/// <reference path='../../lib/adat/Transaction.ts'/>

/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='../../lib/berek/Widget.ts'/>

/// <reference path='../lodash.d.ts'/>

/// <reference path='AppcacheModel.ts'/>
/// <reference path='DatabaseModel.ts'/>
/// <reference path='MainPresenter.ts'/>
/// <reference path='StartPresenter.ts'/>

module mag {
	export class Main extends illa.EventHandler {
		
		private static instance = new Main();
		
		private debugModeEnabled = window.location.hash == '#debug';
		
		private appcacheModel: AppcacheModel;
		private databaseModel: DatabaseModel;
		
		private mainPresenter: MainPresenter;
		
		private nextId = 0;
		
		constructor() {
			super();
			
			if (this.debugModeEnabled) {
				illa.Log.info('Debug mode enabled.');
			}
			
			jQuery(window).on('load', illa.bind(this.onWindowLoaded, this));
		}
		
		protected onWindowLoaded(): void {
			illa.Log.info('DOM loaded.');
			
			this.appcacheModel = new AppcacheModel();
			this.appcacheModel.addEventCallback(AppcacheModel.EVENT_READY, this.onAppcacheReady, this);
			this.appcacheModel.init();
		}
		
		protected onAppcacheReady(e: illa.Event): void {
			illa.Log.info('Appcache ready.');
			
			this.mainPresenter = new MainPresenter(null, jQuery('body'));
			
			this.databaseModel = new DatabaseModel();
			this.databaseModel.addEventCallback(DatabaseModel.EVENT_READY, this.onDatabaseModelReady, this);
			this.databaseModel.init();
		}
		
		protected onDatabaseModelReady(e: illa.Event): void {
			illa.Log.info('Database model ready.');
			
			
		}
		
		static getDebugModeEnabled() { return this.instance.debugModeEnabled }
		
		static getId(): string {
			return 'mag-id-' + (this.instance.nextId++);
		}
	}
}