/// <reference path='../../lib/adat/Database.ts'/>
/// <reference path='../../lib/adat/RequestAdd.ts'/>
/// <reference path='../../lib/adat/RequestIndexCursor.ts'/>
/// <reference path='../../lib/adat/RequestIndexGet.ts'/>
/// <reference path='../../lib/adat/Transaction.ts'/>

/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='../../lib/jQuery.d.ts'/>

/// <reference path='data/Wordlist.ts'/>
/// <reference path='ui/EditWordlistForm.ts'/>
/// <reference path='ui/LearningForm.ts'/>
/// <reference path='ui/MainTabs.ts'/>
/// <reference path='ui/NewWordlistForm.ts'/>
/// <reference path='ui/Notifications.ts'/>

module mag {
	export class Main extends illa.EventHandler {
		
		static LS_KEY_SELECTION_ID = 'mag_Main_selectedWordlistId';
		
		static EVENT_WORDLISTS_LOAD_START = 'mag_Main_EVENT_WORDLISTS_LOAD_START';
		static EVENT_WORDLISTS_LOADED = 'mag_Main_EVENT_WORDLISTS_LOADED';
		static EVENT_SELECTED_WORDLIST_CHANGED = 'mag_Main_EVENT_SELECTED_WORDLIST_CHANGED';
		
		static PRACTICE_COUNT_DEFAULT = 1;
		static PRACTICE_COUNT_MAX = 3;
		
		private static instance = new Main();
		
		private mainTabs: ui.MainTabs;
		private startNotifications: ui.Notifications;
		
		private newWordlistForm: ui.NewWordlistForm;
		private editWordlistForm: ui.EditWordlistForm;
		private learningForm: ui.LearningForm;
		
		private supportsAppCache: boolean;
		private hasNewVersion = false;
		private hasUpdateError = false;
		private debugModeEnabled = window.location.hash == '#debug';
		
		private database: adat.Database;
		private dbWordlistsDesc: adat.ObjectStoreDescriptor<number, data.Wordlist>;
		private dbWordlistsNameIndexDesc: adat.IndexDescriptor<number, data.Wordlist>;
		
		private wordlists: data.Wordlist[] = [];
		private loadListsTransaction: adat.Transaction;
		
		constructor() {
			super();
			
			if (this.debugModeEnabled) {
				illa.Log.info('Debug mode enabled.');
			}
			
			this.supportsAppCache = !!window.applicationCache;
			
			jQuery(window).on('load', illa.bind(this.onWindowLoaded, this));
		}
		
		onWindowLoaded(): void {
			illa.Log.info('DOM loaded.');
			
			this.mainTabs = new ui.MainTabs();
			
			this.startNotifications = new ui.Notifications(jQuery('#notifications-start'));
			
			if (this.supportsAppCache) {
				this.startNotifications.message('Kérlek várj, amíg teljesen betöltődöm...', 'time');
				window.applicationCache.addEventListener('cached', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('noupdate', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('updateready', illa.bind(this.onUpdateReady, this));
			} else {
				this.onAfterCache();
			}
		}
		
		onCached(e: Event): void {
			this.onAfterCache();
		}
		
		onNoUpdate(e: Event): void {
			this.onAfterCache();
		}
		
		onUpdateReady(e: Event): void {
//			this.hasNewVersion = true;
//			this.onAfterCache();
			window.location.reload();
		}
		
		onError(e: Event): void {
			this.hasUpdateError = true;
			this.onAfterCache();
		}
		
		onAfterCache(): void {
//			if (this.debugModeEnabled) {
//				adat.Database.deleteDatabase('mag');
//			}
			
			this.startNotifications.message('Szükségem lesz egy böngésző adatbázisra...', 'floppy-disk');
			this.database = new adat.Database('mag', [
				new adat.VersionDescriptor({
					wordlists: this.dbWordlistsDesc = new adat.ObjectStoreDescriptor<number, data.Wordlist>('id', true, {
						nameIndex: this.dbWordlistsNameIndexDesc = new adat.IndexDescriptor<string, data.Wordlist>('name', true)
					})
				})
			]);
			this.database.addEventCallback(adat.Database.EVENT_NOT_SUPPORTED, this.onDatabaseNotSupported, this);
			this.database.addEventCallback(adat.Database.EVENT_BLOCKED, this.onDatabaseBlocked, this);
			this.database.addEventCallback(adat.Database.EVENT_OPEN_ERROR, this.onDatabaseNotSupported, this);
			this.database.addEventCallback(adat.Database.EVENT_OPEN_SUCCESS, this.onDatabaseOpenSuccess, this);
			this.database.open();
		}
		
		onDatabaseNotSupported(e: illa.Event): void {
			this.startNotifications.error('Böngésző adatbázis nélkül nem működöm!');
		}
		
		onDatabaseBlocked(e: illa.Event): void {
			this.startNotifications.warning('Várok az adatbázisra... esetleg nyitva vagyok kétszer is?', 'time');
		}
		
		onDatabaseOpenSuccess(e: illa.Event): void {
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
			
			this.newWordlistForm = new ui.NewWordlistForm();
			this.newWordlistForm.addEventCallback(ui.NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this.onNewWordlistCreated, this);
			
			this.editWordlistForm = new ui.EditWordlistForm();
			
			this.learningForm = new ui.LearningForm();
			this.learningForm.addEventCallback(ui.LearningForm.EVENT_STATE_CHANGED, this.onLearningFormStateChanged, this);
			
			this.addEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
			this.refreshWordlists();
		}
		
		onInitWordlistsRefreshed(e: illa.Event): void {
			
			this.removeEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
			
			window.location.hash = '';
			
			this.mainTabs.enableAllTabs();
			this.startNotifications.success([
				['span', 'Kész vagyok a használatra! Kattints a ', ['em', 'szófelvétel'], ' fülre hogy kialakítsd a saját szólistádat, azután a ',
					['em', 'tanulás'], ' fülre, hogy megtanuld!']
			]);
		}
		
		onNewWordlistCreated(e: illa.Event): void {
			this.refreshWordlists();
		}
		
		refreshWordlists(): void {
			new illa.Event(Main.EVENT_WORDLISTS_LOAD_START, this).dispatch();
			this.loadListsTransaction = new adat.Transaction(mag.Main.getDatabase(), [
				new adat.RequestIndexCursor(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(),
					illa.bind(this.onWordlistsReceived, this))
			]);
			this.loadListsTransaction.process();
		}
		
		onWordlistsReceived(wordlists: data.Wordlist[]): void {
			this.wordlists = wordlists;
			
			var selectedWordlist = this.getSelectedWordlist();
			if (!selectedWordlist) {
				this.setSelectedWordistId(NaN);
			}
			
			new illa.Event(Main.EVENT_WORDLISTS_LOADED, this).dispatch();
		}
		
		setSelectedWordistId(id: number): void {
			if (!isNaN(id)) {
				window.localStorage[Main.LS_KEY_SELECTION_ID] = id + '';
			} else {
				delete window.localStorage[Main.LS_KEY_SELECTION_ID];
			}
			new illa.Event(Main.EVENT_SELECTED_WORDLIST_CHANGED, this).dispatch();
		}
		
		getSelectedWordlistId(): number {
			return Number(window.localStorage[Main.LS_KEY_SELECTION_ID]);
		}
		
		getSelectedWordlist(): data.Wordlist {
			var result: data.Wordlist = null;
			var id = this.getSelectedWordlistId();
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
		
		getWordlists() { return this.wordlists }
		
		onLearningFormStateChanged(e: illa.Event): void {
			if (this.mainTabs.getActiveTabId() === ui.MainTabIndex.LEARN) {
				switch (this.learningForm.getState()) {
					case ui.LearningFormState.NOT_STARTED:
						this.mainTabs.enableAllTabs();
						break;
					case ui.LearningFormState.STARTED:
						this.mainTabs.disableInactiveTabs();
						break;
				}
			}
		}
		
		static getInstance() { return this.instance }
		static getDatabase() { return this.getInstance().database }
		static getDBWordlistsDesc() { return this.getInstance().dbWordlistsDesc }
		static getDBWordlistsNameIndexDesc() { return this.getInstance().dbWordlistsNameIndexDesc }
	}
}