/// <reference path='../../lib/adat/Database.ts'/>
/// <reference path='../../lib/adat/RequestAdd.ts'/>
/// <reference path='../../lib/adat/RequestIndexCursor.ts'/>
/// <reference path='../../lib/adat/RequestIndexGet.ts'/>
/// <reference path='../../lib/adat/Transaction.ts'/>

/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='../../lib/jQuery.d.ts'/>

/// <reference path='data/Wordlist.ts'/>
/// <reference path='ui/MainTabs.ts'/>
/// <reference path='ui/NewWordlistForm.ts'/>
/// <reference path='ui/Notifications.ts'/>
/// <reference path='ui/SelectWordlistForm.ts'/>

module mag {
	export class Main {
		
		private static instance = new Main();
		
		private mainTabs: ui.MainTabs;
		private startNotifications: ui.Notifications;
		
		private newWordlistForm: ui.NewWordlistForm;
		private selectWordlistForm: ui.SelectWordlistForm;
		
		private supportsAppCache: boolean;
		private hasNewVersion = false;
		private hasUpdateError = false;
		private debugModeEnabled = window.location.hash == '#debug';
		
		private database: adat.Database;
		private dbWordlistsDesc: adat.ObjectStoreDescriptor<number, data.Wordlist>;
		private dbWordlistsNameIndexDesc: adat.IndexDescriptor<number, data.Wordlist>;
		
		constructor() {
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
			this.hasNewVersion = true;
			this.onAfterCache();
		}
		
		onError(e: Event): void {
			this.hasUpdateError = true;
			this.onAfterCache();
		}
		
		onAfterCache(): void {
			if (this.debugModeEnabled) {
				adat.Database.deleteDatabase('mag');
			}
			
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
			
			this.selectWordlistForm = new ui.SelectWordlistForm();
			
			this.mainTabs.enableAllTabs();
			this.startNotifications.success([
				['span', 'Kész vagyok a használatra! Kattints a ', ['em', 'szófelvétel'], ' fülre hogy kialakítsd a saját szólistádat, azután a ',
					['em', 'tanulás'], ' fülre, hogy megtanuld!']
			]);
		}
		
		onNewWordlistCreated(e: illa.Event): void {
			this.selectWordlistForm.refreshWordlists();
		}
		
		static getInstance() { return this.instance }
		static getDatabase() { return this.getInstance().database }
		static getDBWordlistsDesc() { return this.getInstance().dbWordlistsDesc }
		static getDBWordlistsNameIndexDesc() { return this.getInstance().dbWordlistsNameIndexDesc }
	}
}