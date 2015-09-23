/// <reference path='../../lib/illa/EventHandler.ts'/>

/// <reference path='AppcacheModel.ts'/>
/// <reference path='DatabaseModel.ts'/>
/// <reference path='ErrorType.ts'/>
/// <reference path='LocalStorageModel.ts'/>

module mag {
	export class MagModel extends illa.EventHandler {
		
		static EVENT_WORDLISTS_LOAD_START = 'mag_model_MagModel_EVENT_WORDLISTS_LOAD_START';
		static EVENT_WORDLISTS_LOADED = 'mag_model_MagModel_EVENT_WORDLISTS_LOADED';
		static EVENT_SELECTED_WORDLIST_CHANGED = 'mag_model_MagModel_EVENT_SELECTED_WORDLIST_CHANGED';
		static EVENT_READY = 'mag_model_MagModel_EVENT_READY';
		
		static PRACTICE_COUNT_DEFAULT = 1;
		static PRACTICE_COUNT_MAX = 3;
		
		private appcacheModel: AppcacheModel;
		private databaseModel: DatabaseModel;
		private localStorageModel: LocalStorageModel;
		
		private wordlists: data.Wordlist[] = [];
		
		private selectedWordistId: number;
		
		constructor() {
			super();
			
			this.localStorageModel = new LocalStorageModel();
			
			this.appcacheModel = new AppcacheModel();
			this.appcacheModel.addEventCallback(AppcacheModel.EVENT_READY, this.onAppcacheModelReady, this);
			
			this.databaseModel = new DatabaseModel();
			this.databaseModel.addEventCallback(DatabaseModel.EVENT_READY, this.onDatabaseModelReady, this);
			this.databaseModel.addEventCallback(DatabaseModel.EVENT_WORDLISTS_LOADED, this.onWordlistsLoaded, this);
			
			this.appcacheModel.init();
		}
		
		onAppcacheModelReady(e: illa.Event): void {
			this.databaseModel.init();
		}
		
		onDatabaseModelReady(e: illa.Event): void {
			new illa.Event(MagModel.EVENT_READY, this).dispatch();
		}
		
		loadWordlists(): void {
			this.databaseModel.loadWordlists();
		}
		
		onWordlistsLoaded(e: WordlistEvent): void {
			this.wordlists = e.getWordlists();
			
			var selectedWordlist = this.getSelectedWordlist();
			if (!selectedWordlist) {
				this.setSelectedWordistId(NaN);
			}
			
			new illa.Event(MagModel.EVENT_WORDLISTS_LOADED, this).dispatch();
		}
		
		getWordlists() {
			return this.wordlists;
		}
		
		getSelectedWordlistId(): number {
			return this.selectedWordistId;
		}
		
		setSelectedWordistId(id: number): void {
			this.localStorageModel.setSelectedWordistId(id);
			new illa.Event(MagModel.EVENT_SELECTED_WORDLIST_CHANGED, this).dispatch();
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
		
		onNewWordlistCreated(e: illa.Event): void {
			this.loadWordlists();
		}
		
		onCreateNewWordlistRequested(name: string, lang1Name: string, lang2Name: string, onDone: (e: ErrorType) => void): void {
			if (!name) {
				//notifications.error('Kérlek adj nevet a szólistának!');
				onDone(ErrorType.WORDLIST_MUST_HAVE_NAME);
				return;
			}
			
			if (!lang1Name) {
				//notifications.error('Kérlek adj nevet az egyik nyelvnek!');
				onDone(ErrorType.WORDLIST_MUST_HAVE_LANG1NAME);
				return;
			}
			
			if (!lang2Name) {
				//notifications.error('Kérlek adj nevet a másik nyelvnek!');
				onDone(ErrorType.WORDLIST_MUST_HAVE_LANG2NAME);
				return;
			}
			
			var newList = new data.Wordlist();
			newList.name = illa.StringUtil.trim(name);
			newList.lang1Name = illa.StringUtil.trim(lang1Name);
			newList.lang2Name = illa.StringUtil.trim(lang2Name);
		}
		
		getHasNewVersion() { return this.appcacheModel.getHasNewVersion() }
		getHasUpdateError() { return this.appcacheModel.getHasUpdateError() }
		getSupportsAppcache() { return this.appcacheModel.getSupportsAppcache() }
	}
}