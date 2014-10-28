

module mag.model {
	export class DatabaseModel extends illa.EventHandler {
		
		static EVENT_READY = 'mag_model_DatabaseModel_EVENT_READY';
		
		private database: adat.Database;
		private dbWordlistsDesc: adat.ObjectStoreDescriptor<number, data.Wordlist>;
		private dbWordlistsNameIndexDesc: adat.IndexDescriptor<number, data.Wordlist>;
		
		private wordlists: data.Wordlist[] = [];
		private currentTransaction: adat.Transaction;
		
		constructor(private debugModeEnabled: boolean) {
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
		
		getWordlists(): void {
			return this.wordlists;
		}
	}
}