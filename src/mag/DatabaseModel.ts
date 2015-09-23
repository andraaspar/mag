/// <reference path='ErrorType.ts'/>
/// <reference path='Wordlist.ts'/>
/// <reference path='WordlistEvent.ts'/>

module mag {
	export class DatabaseModel extends illa.EventHandler {

		static EVENT_READY = 'mag_DatabaseModel_EVENT_READY';
		static EVENT_WORDLISTS_LOADED = 'mag_DatabaseModel_EVENT_WORDLISTS_LOADED';

		private database: adat.Database;
		private dbWordlistsDesc: adat.ObjectStoreDescriptor<number, Wordlist>;
		private dbWordlistsNameIndexDesc: adat.IndexDescriptor<number, Wordlist>;
		private currentTransaction: adat.Transaction;

		constructor() {
			super();
		}

		init(): void {
			//			if (this.debugModeEnabled) {
			//				adat.Database.deleteDatabase('mag');
			//			}
			
			//this.startNotifications.message('Szükségem lesz egy böngésző adatbázisra...', 'floppy-disk');
			this.database = new adat.Database('mag', [
				new adat.VersionDescriptor({
					wordlists: this.dbWordlistsDesc = new adat.ObjectStoreDescriptor<number, Wordlist>('id', true, {
						nameIndex: this.dbWordlistsNameIndexDesc = new adat.IndexDescriptor<string, Wordlist>('name', true)
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
			//this.startNotifications.error('Böngésző adatbázis nélkül nem működöm!');
			new illa.Event(e.getType(), this).dispatch();
		}

		onDatabaseBlocked(e: illa.Event): void {
			//this.startNotifications.warning('Várok az adatbázisra... esetleg nyitva vagyok kétszer is?', 'time');
			new illa.Event(e.getType(), this).dispatch();
		}

		onDatabaseOpenSuccess(e: illa.Event): void {
			new illa.Event(DatabaseModel.EVENT_READY, this).dispatch();
		}

		loadWordlists(): void {
			//new illa.Event(DatabaseModel.EVENT_WORDLISTS_LOAD_START, this).dispatch();
			this.currentTransaction = new adat.Transaction(this.database, [
				new adat.RequestIndexCursor(this.dbWordlistsDesc, this.dbWordlistsNameIndexDesc,
					illa.bind(this.onWordlistsLoaded, this))
			]);
			this.currentTransaction.process();
		}

		onWordlistsLoaded(wordlists: Wordlist[]): void {
			new WordlistEvent(DatabaseModel.EVENT_WORDLISTS_LOADED, this, wordlists);
		}

		saveNewWordlist(newList: Wordlist, onDone: (e: ErrorType) => void): void {
			this.currentTransaction = new adat.Transaction(this.database, [
				new adat.RequestIndexGet<number, Wordlist>(this.dbWordlistsDesc, this.dbWordlistsNameIndexDesc,
					illa.bind(this.onSaveNewWordlistExistingReceived, this, newList, onDone), newList.id)
			], adat.TransactionMode.READWRITE);
			this.currentTransaction.process();
		}

		onSaveNewWordlistExistingReceived(newList: Wordlist, onDone: (e: ErrorType) => void, existingList: Wordlist): void {
			if (existingList) {
//				notifications.removeAll();
//				notifications.error('Egy lista ezzel a névvel már létezik!');
//				this.submitButton.prop('disabled', false);
				onDone(ErrorType.WORDLIST_NAME_ALREADY_EXISTS);
				return;
			}

			this.currentTransaction.setRequests([
				new adat.RequestAdd(this.dbWordlistsDesc, newList)
			]);
			this.currentTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, illa.bind<(e: ErrorType) => void, illa.Event, void>
				(this.onSavedNewWordlist, this, onDone), this);
			this.currentTransaction.process();
		}
		
		onSavedNewWordlist(onDone: (e: ErrorType) => void, e: illa.Event): void {
			onDone(ErrorType.NONE);
		}
	}
}
