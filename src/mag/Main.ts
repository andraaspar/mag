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
/// <reference path='presenter/EditWordlistForm.ts'/>
/// <reference path='presenter/LearningForm.ts'/>
/// <reference path='presenter/MainTabs.ts'/>
/// <reference path='presenter/NewWordlistForm.ts'/>
/// <reference path='presenter/Notifications.ts'/>

module mag {
	export class Main extends illa.EventHandler {
		
		static EVENT_WORDLISTS_LOAD_START = 'mag_Main_EVENT_WORDLISTS_LOAD_START';
		static EVENT_WORDLISTS_LOADED = 'mag_Main_EVENT_WORDLISTS_LOADED';
		
		
		private static instance = new Main();
		
		private mainTabs: presenter.MainTabs;
		private startNotifications: presenter.Notifications;
		
		private newWordlistForm: presenter.NewWordlistForm;
		private editWordlistForm: presenter.EditWordlistForm;
		private learningForm: presenter.LearningForm;
		
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
			
			this.mainTabs = new presenter.MainTabs();
			
			this.startNotifications = new presenter.Notifications(jQuery('#notifications-start'));
			
			
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
		
		onLearningFormStateChanged(e: illa.Event): void {
			if (this.mainTabs.getActiveTabId() === presenter.MainTabIndex.LEARN) {
				switch (this.learningForm.getState()) {
					case presenter.LearningFormState.NOT_STARTED:
						this.mainTabs.enableAllTabs();
						break;
					case presenter.LearningFormState.STARTED:
						this.mainTabs.disableInactiveTabs();
						break;
				}
			}
		}
		
		static getInstance() { return this.instance }
	}
}