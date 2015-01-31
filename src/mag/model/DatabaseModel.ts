/// <reference path='WordlistEvent.ts'/>

module mag.model {
	export class DatabaseModel extends illa.EventHandler {

		static EVENT_READY = 'mag_model_DatabaseModel_EVENT_READY';
		static EVENT_WORDLISTS_LOADED = 'mag_model_DatabaseModel_EVENT_WORDLISTS_LOADED';

		private database: adat.Database;
		private dbWordlistsDesc: adat.ObjectStoreDescriptor<number, data.Wordlist>;
		private dbWordlistsNameIndexDesc: adat.IndexDescriptor<number, data.Wordlist>;
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

		onWordlistsLoaded(wordlists: data.Wordlist[]): void {
			new WordlistEvent(DatabaseModel.EVENT_WORDLISTS_LOADED, this, wordlists);
		}

		saveNewWordlist(newList: data.Wordlist, onDone: (e: ErrorType) => void): void {
			this.currentTransaction = new adat.Transaction(this.database, [
				new adat.RequestIndexGet(this.dbWordlistsDesc, this.dbWordlistsNameIndexDesc,
					illa.bind<data.Wordlist, (e: ErrorType) => void, data.Wordlist, void>
						(this.onSaveNewWordlistExistingReceived, this, newList, onDone), newList.name)
			], adat.TransactionMode.READWRITE);
			this.currentTransaction.process();
		}

		onSaveNewWordlistExistingReceived(newList: data.Wordlist, onDone: (e: ErrorType) => void, existingList: data.Wordlist): void {
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

function test(p1: string, p2: number, p3: boolean, p4: string, p5: number, p6: boolean, p7: string, p8: number, p9: boolean): string {
	return '';
}

var f2 = test.bind(this);
var fn = illa.bind(test, this, '');
var r = fn(0, false, '', 0, false, '', 0, false);
