/// <reference path='../../../lib/berek/StorageWrapper.ts'/>

module mag.model {
	export class LocalStorageModel {
		
		static LS_KEY_SELECTION_ID = 'mag_Main_selectedWordlistId';
		
		private localStorage: berek.StorageWrapper;
		
		constructor() {
			this.localStorage = new berek.StorageWrapper(berek.StorageType.LOCAL);
		}
		
		setSelectedWordistId(id: number): void {
			if (!isNaN(id)) {
				this.localStorage.setItem(LocalStorageModel.LS_KEY_SELECTION_ID, id + '');
			} else {
				this.localStorage.removeItem(LocalStorageModel.LS_KEY_SELECTION_ID);
			}
		}
		
		getSelectedWordlistId(): number {
			return Number(window.localStorage[LocalStorageModel.LS_KEY_SELECTION_ID]);
		}
	}
}