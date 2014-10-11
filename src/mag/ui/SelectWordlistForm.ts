

module mag.ui {
	export class SelectWordlistForm extends illa.EventHandler {
		
		static EVENT_SELECTED = 'mag_ui_SelectWordlistForm_EVENT_SELECTED';
		
		static LS_KEY_SELECTION_ID = 'mag_ui_SelectWordlistForm_selectionId';
		
		private selector = jQuery('#list-select');
		private wordlists: data.Wordlist[] = [];
		
		private loadListsTransaction: adat.Transaction;
		
		constructor() {
			super();
			
			this.selector.on('change', illa.bind(this.onSelected, this));
			
			this.refreshWordlists();
		}
		
		refreshWordlists(): void {
			this.selector.prop('disabled', true);
			this.loadListsTransaction = new adat.Transaction(mag.Main.getDatabase(), [
				new adat.RequestIndexCursor(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(),
					illa.bind(this.onWordlistsReceived, this))
			]);
			this.loadListsTransaction.process();
		}
		
		onWordlistsReceived(wordlists: data.Wordlist[]): void {
			this.wordlists = wordlists;
			var arrkup: any[] = [['option', 'Válassz egy listát...']];
			for (var i = 0, n = wordlists.length; i < n; i++) {
				var wordlist = wordlists[i];
				arrkup.push(['option', {value: wordlist.id}, wordlist.name + ' (' + wordlist.lang1Name + ', ' + wordlist.lang2Name + ')']);
			}
			this.selector.html(illa.Arrkup.createString(arrkup));
			this.selector.prop('disabled', false);
			this.loadSelection();
		}
		
		onSelected(e: jQuery.IEvent): void {
			this.storeSelection();
			new illa.Event(SelectWordlistForm.EVENT_SELECTED, this).dispatch();
		}
		
		storeSelection(): void {
			var wordlist = this.getSelectedWordlist();
			if (wordlist) {
				window.localStorage[SelectWordlistForm.LS_KEY_SELECTION_ID] = wordlist.id;
			} else {
				delete window.localStorage[SelectWordlistForm.LS_KEY_SELECTION_ID];
			}
		}
		
		loadSelection(): void {
			var id: number = Number(window.localStorage[SelectWordlistForm.LS_KEY_SELECTION_ID]);
			if (isNaN(id)) return;
			this.setSelectedWordlistId(id);
		}
		
		getSelectedWordlist(): data.Wordlist {
			var result: data.Wordlist = null;
			var id = this.selector.val();
			for (var i = 0, n = this.wordlists.length; i < n; i++) {
				var wordlist = this.wordlists[i];
				if (wordlist.id == id) {
					result = wordlist;
					break;
				}
			}
			return result;
		}
		
		setSelectedWordlistId(id: number) {
			for (var i = 0, n = this.wordlists.length; i < n; i++) {
				var wordlist = this.wordlists[i];
				if (wordlist.id == id) {
					this.selector.val(id + '');
				}
			}
		}
	}
}