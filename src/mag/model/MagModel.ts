/// <reference path='../../../lib/illa/EventHandler.ts'/>

/// <reference path='AppcacheModel.ts'/>
/// <reference path='DatabaseModel.ts'/>
/// <reference path='LocalStorageModel.ts'/>

module mag.model {
	export class MagModel extends illa.EventHandler {
		
		static EVENT_SELECTED_WORDLIST_CHANGED = 'mag_Main_EVENT_SELECTED_WORDLIST_CHANGED';
		
		static PRACTICE_COUNT_DEFAULT = 1;
		static PRACTICE_COUNT_MAX = 3;
		
		private debugModeEnabled = false;
		
		private appcacheModel: AppcacheModel;
		private databaseModel: DatabaseModel;
		private localStorageModel: LocalStorageModel;
		
		private selectedWordistId: number;
		
		constructor() {
			super();
			
			this.localStorageModel = new LocalStorageModel();
			
			this.appcacheModel = new AppcacheModel();
			this.appcacheModel.addEventCallback(AppcacheModel.EVENT_READY, this.onAppcacheModelReady, this);
			
			this.databaseModel = new DatabaseModel(this.debugModeEnabled);
			
			this.appcacheModel.init();
		}
		
		onAppcacheModelReady(e: illa.Event): void {
			this.databaseModel.init();
		}
		
		onDatabaseModelReady(e: illa.Event): void {
			this.startNotifications.removeAll();
			
			if (this.hasNewVersion) {
				this.startNotifications.message(['span',
					'Letöltöttem egy új verziómat, ',
					['a', {onclick: 'window.location.reload()', href: ''}, 'kattints ide'],
					' hogy elindítsd!'
				], 'gift');
			} else if (this.hasUpdateError) {
				this.startNotifications.error(['span',
					'Jaj, nem tudtam letölteni az új verziómat! ',
					['a', {onclick: 'window.location.reload()', href: ''}, 'Kattints ide'],
					' hogy újra próbálhassam!'
				]);
			}
			
			if (this.supportsAppCache) {
				this.startNotifications.warning('Internet nélkül is működöm! Jelölj be kedvencnek!', 'star');
			} else {
				this.startNotifications.error('Ez a böngésző nem támogatja az internet nélküli módot!');
			}
			
			this.newWordlistForm = new presenter.NewWordlistForm();
			this.newWordlistForm.addEventCallback(presenter.NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this.onNewWordlistCreated, this);
			
			this.editWordlistForm = new presenter.EditWordlistForm();
			
			this.learningForm = new presenter.LearningForm();
			this.learningForm.addEventCallback(presenter.LearningForm.EVENT_STATE_CHANGED, this.onLearningFormStateChanged, this);
			
			this.addEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
			this.refreshWordlists();
		}
		
		getSelectedWordlist(): data.Wordlist {
			var result: data.Wordlist = null;
			var id = this.localStorageModel.getSelectedWordlistId();
			if (!isNaN(id)) {
				for (var i = 0, n = this.wordlists.length; i < n; i++) {
					var wordlist = this.wordlists[i];
					if (wordlist.id == id) {
						result = wordlist;
						break;
					}
				}
			}
			return result;
		}
		
		getWordlists() {
			return this.databaseModel.getWordlists();
		}
		
		getSelectedWordlistId(): number {
			return this.selectedWordistId;
		}
		
		setSelectedWordistId(id: number): void {
			this.localStorageModel.setSelectedWordistId(id);
			new illa.Event(MagModel.EVENT_SELECTED_WORDLIST_CHANGED, this).dispatch();
		}
	}
}