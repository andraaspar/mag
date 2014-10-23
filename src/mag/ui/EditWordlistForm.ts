/// <reference path='../../../lib/adat/RequestDelete.ts'/>
/// <reference path='../../../lib/adat/RequestPut.ts'/>

module mag.ui {
	export class EditWordlistForm extends illa.EventHandler {
		
		static EVENT_SELECTED = 'mag_ui_SelectWordlistForm_EVENT_SELECTED';
		
		static LS_KEY_SELECTION_ID = 'mag_ui_SelectWordlistForm_selectionId';
		
		private selector = jQuery('#list-select');
		private renameNotifications = new Notifications(jQuery('#notifications-rename'));
		private renameListNameIn = jQuery('#rename-list-name-in');
		private renameListButton = jQuery('#rename-list-button');
		private renameLang1NameIn = jQuery('#rename-lang1-name-in');
		private renameLang1Button = jQuery('#rename-lang1-button');
		private renameLang2NameIn = jQuery('#rename-lang2-name-in');
		private renameLang2Button = jQuery('#rename-lang2-button');
		private deleteNotifications = new Notifications(jQuery('#notifications-delete'));
		private deleteListConfirm = jQuery('#delete-list-confirm');
		private deleteListButton = jQuery('#delete-list-button');
		private deleteListButtonGroup = jQuery('#delete-list-button-group');
		private addWordNotifications = new Notifications(jQuery('#notifications-add-word'));
		private addWord1InLabel = jQuery('#add-word-1-in-label');
		private addWord1In= jQuery('#add-word-1-in');
		private addWord2InLabel = jQuery('#add-word-2-in-label');
		private addWord2In = jQuery('#add-word-2-in');
		private addWordButton = jQuery('#add-word-button');
		private editWordsNotifications = new Notifications(jQuery('#notifications-edit-words'));
		private editWordsSelectAll = jQuery('#edit-words-select-all');
		private editWordsLang1Th = jQuery('#edit-words-lang-1-th');
		private editWordsLang2Th = jQuery('#edit-words-lang-2-th');
		private editWordsTbody = jQuery('#edit-words-tbody');
		private deleteWordsButton = jQuery('#delete-words');
		
		private wordlists: data.Wordlist[] = [];
		
		private loadListsTransaction: adat.Transaction;
		private renameTransaction: adat.Transaction;
		private deleteTransaction: adat.Transaction;
		private addWordTransaction: adat.Transaction;
		private editWordsTransaction: adat.Transaction;
		private deleteWordsTransaction: adat.Transaction;
		
		constructor() {
			super();
			
			this.selector.on('change', illa.bind(this.onSelected, this));
			
			this.renameListButton.on('click', illa.bind(this.onListRenameRequested, this));
			this.renameLang1Button.on('click', <any>illa.partial(this.onLangRenameRequested, this, true));
			this.renameLang2Button.on('click', <any>illa.partial(this.onLangRenameRequested, this, false));
			this.deleteListConfirm.on('change', illa.bind(this.onDeleteListConfirmChanged, this));
			this.deleteListButton.on('click', illa.bind(this.onDeleteListRequested, this));
			this.addWordButton.on('click', illa.bind(this.onAddWordRequested, this));
			this.editWordsTbody.on('click', 'button[data-edit-word-save-button]', illa.bind(this.onEditWordsSaveRequested, this));
			this.editWordsTbody.on('input', 'input', illa.bind(this.onEditWordsInputChanged, this));
			this.editWordsSelectAll.on('change', illa.bind(this.onEditWordsSelectAllChanged, this));
			this.deleteWordsButton.on('click', illa.bind(this.onDeleteWordsRequested, this));
			
			this.refreshWordlists();
		}
		
		updateFormOnSelectionChanged(): void {
			var wordlist = this.getSelectedWordlist() || new data.Wordlist();
			
			this.renameListNameIn.val(wordlist.name);
			this.renameLang1NameIn.val(wordlist.lang1Name);
			this.renameLang2NameIn.val(wordlist.lang2Name);
			
			this.deleteListConfirm.prop('checked', false);
			this.deleteListButtonGroup.hide();
			
			this.addWord1InLabel.text(wordlist.lang1Name);
			this.addWord2InLabel.text(wordlist.lang2Name);
			
			this.editWordsSelectAll.prop('checked', false);
			this.editWordsLang1Th.text(wordlist.lang1Name);
			this.editWordsLang2Th.text(wordlist.lang2Name);
			
			this.renderWords();
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
			this.updateFormOnSelectionChanged();
		}
		
		onSelected(e: jQuery.IEvent): void {
			this.storeSelection();
			this.updateFormOnSelectionChanged();
			new illa.Event(EditWordlistForm.EVENT_SELECTED, this).dispatch();
		}
		
		storeSelection(): void {
			var wordlist = this.getSelectedWordlist();
			if (wordlist) {
				window.localStorage[EditWordlistForm.LS_KEY_SELECTION_ID] = wordlist.id;
			} else {
				delete window.localStorage[EditWordlistForm.LS_KEY_SELECTION_ID];
			}
		}
		
		loadSelection(): void {
			var id: number = Number(window.localStorage[EditWordlistForm.LS_KEY_SELECTION_ID]);
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
		
		onListRenameRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.renameNotifications.removeAll();
			
			var wordlist = this.getSelectedWordlist();
			if (!wordlist) {
				this.renameNotifications.warning('Válassz listát előbb!');
				return;
			}
			
			var newName = illa.StringUtil.trim(this.renameListNameIn.val());
			if (newName == wordlist.name) {
				this.renameNotifications.warning('Hát igen, ez a neve.');
				return;
			}
			if (!newName) {
				this.renameNotifications.error('Kérlek adj nevet a szólistának!');
				return;
			}
			
			wordlist = new data.Wordlist(wordlist);
			wordlist.name = newName;
			
			this.renameTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestIndexGet(Main.getDBWordlistsDesc(), Main.getDBWordlistsNameIndexDesc(),
					<(r: data.Wordlist) => void>illa.partial(this.onListNameChecked, this, wordlist), newName)
			], adat.TransactionMode.READWRITE);
			this.renameTransaction.process();
		}
		
		onListNameChecked(wordlist: data.Wordlist, conflictingWordlist: data.Wordlist): void {
			if (conflictingWordlist) {
				this.renameNotifications.error('Ez a listanév már foglalt.');
				return;
			}
			
			this.renameTransaction.setRequests([
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.renameTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListRenamed, this);
			this.renameTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListRenameError, this);
			this.renameTransaction.process();
		}
		
		onListRenameError(e: illa.Event): void {
			this.renameNotifications.error('Hiba történt, nem tudtam átnevezni!');
			
			this.refreshWordlists();
		}
		
		onListRenamed(e: illa.Event): void {
			this.renameNotifications.success('Rendben, átneveztem!');
			
			this.refreshWordlists();
		}
		
		onLangRenameRequested(isFirstLang: boolean, e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.renameNotifications.removeAll();
			
			var wordlist = this.getSelectedWordlist();
			if (!wordlist) {
				this.renameNotifications.warning('Válassz listát előbb!');
				return;
			}
			
			var newName: string;
			if (isFirstLang) {
				newName = illa.StringUtil.trim(this.renameLang1NameIn.val());
			} else {
				newName = illa.StringUtil.trim(this.renameLang2NameIn.val());
			}
			var oldName: string;
			if (isFirstLang) {
				oldName = wordlist.lang1Name;
			} else {
				oldName = wordlist.lang2Name;
			}
			
			if (newName == oldName) {
				this.renameNotifications.warning('Hát igen, ez a neve.');
				return;
			}
			if (!newName) {
				this.renameNotifications.error('Kérlek adj nevet a nyelvnek!');
				return;
			}
			
			wordlist = new data.Wordlist(wordlist);
			if (isFirstLang) {
				wordlist.lang1Name = newName;
			} else {
				wordlist.lang2Name = newName;
			}
			
			this.renameTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			], adat.TransactionMode.READWRITE);
			this.renameTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListRenamed, this);
			this.renameTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListRenameError, this);
			this.renameTransaction.process();
		}
		
		onDeleteListConfirmChanged(e: jQuery.IEvent): void {
			this.deleteListButtonGroup.toggle(this.deleteListConfirm.prop('checked'));
		}
		
		onDeleteListRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.deleteNotifications.removeAll();
			
			var list = this.getSelectedWordlist();
			
			if (!list) {
				this.deleteNotifications.error('Válassz listát előbb!');
				return;
			}
			
			this.deleteTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestDelete(Main.getDBWordlistsDesc(), list.id)
			]);
			this.deleteTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListDeleted, this);
			this.deleteTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListDeleteError, this);
			this.deleteTransaction.process();
		}
		
		onListDeleteError(e: illa.Event): void {
			this.deleteNotifications.error('Hiba történt, nem tudtam törölni!');
			
			this.refreshWordlists();
		}
		
		onListDeleted(e: illa.Event): void {
			this.deleteNotifications.success('Rendben, töröltem!');
			
			this.refreshWordlists();
		}
		
		onAddWordRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.addWordNotifications.removeAll();
			
			var wordlist = this.getSelectedWordlist();
			if (!wordlist) {
				this.addWordNotifications.warning('Válassz listát előbb!');
				return;
			}
			
			var newWord = new data.Word();
			newWord.lang1 = illa.StringUtil.trim(this.addWord1In.val());
			newWord.lang2 = illa.StringUtil.trim(this.addWord2In.val());
			newWord.lang1Count = 3;
			newWord.lang2Count = 3;
			
			if (!newWord.lang1 || !newWord.lang2) {
				this.addWordNotifications.error('Kérlek add meg mindkét szót!');
				return;
			}
			
			this.checkNewWordAndReportCollisions(wordlist, newWord, this.addWordNotifications);
			
			wordlist.words.push(newWord);
			
			this.addWordTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.addWordTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordAdded, this);
			this.addWordTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onAddWordError, this);
			this.addWordTransaction.process();
		}
		
		onAddWordError(e: illa.Event): void {
			this.addWordNotifications.error('Hiba történt, nem tudtam hozzáadni!');
			
			this.refreshWordlists();
		}
		
		onWordAdded(e: illa.Event): void {
			this.addWordNotifications.success('Rendben, hozzáadtam!');
			
			this.addWord1In.val('');
			this.addWord2In.val('');
			
			this.refreshWordlists();
		}
		
		renderWords(): void {
			var wordlist = this.getSelectedWordlist() || new data.Wordlist();
			
			var arrkup: any[] = [];
			for (var i = 0, n = wordlist.words.length; i < n; i++) {
				var word = wordlist.words[i];
				arrkup.push(
					['tr', {id: 'edit-word-' + (i + 1), 'data-edit-word-id': i},
						['td',
							['div', {'class': 'mag-cell-content-min'},
								['p', {'class': 'form-control-static'},
									['input/', {'type': 'checkbox', 'data-edit-word-selected': true}]
								]
							]
						],
						['td', {'class': 'mag-cell-min'}, ['p', {'class': 'form-control-static'}, i + 1 + '']],
						['td', {'class': 'mag-cell-half'},
							['input/', {type: 'text', 'class': 'form-control', value: word.lang1, 'data-edit-word-lang1-in': true}]
						],
						['td', {'class': 'mag-cell-min'},
							['input/', {type: 'number', 'class': 'form-control', value: word.lang1Count, min: 0, max: 9, step: 1,
								pattern: '[0-9]{1,1}', 'data-edit-word-lang1-count-in': true}]
						],
						['td', {'class': 'mag-cell-half'},
							['input/', {type: 'text', 'class': 'form-control', value: word.lang2, 'data-edit-word-lang2-in': true}]
						],
						['td', {'class': 'mag-cell-min'},
							['input/', {type: 'number', 'class': 'form-control', value: word.lang2Count, min: 0, max: 9, step: 1,
								pattern: '[0-9]{1,1}', 'data-edit-word-lang2-count-in': true}]
						],
						['td', {'class': 'mag-cell-min'},
							['button', {type: 'button', 'class': 'btn btn-primary btn-block', 'data-edit-word-save-button': true, 'disabled': true},
								['span', {'class': 'glyphicon glyphicon-floppy-disk'}], ' Mentés'
							]
						]
					]
				);
			}
			this.editWordsTbody.html(illa.Arrkup.createString(arrkup));
		}
		
		checkNewWordAndReportCollisions(wordlist: data.Wordlist, newWord: data.Word, notifications: Notifications): void {
			for (var i = 0, n = wordlist.words.length; i < n; i++) {
				var existingWord = wordlist.words[i];
				if (existingWord.lang1 == newWord.lang1 || existingWord.lang2 == newWord.lang2) {
					if (existingWord.lang1Count || existingWord.lang2Count) {
						notifications.warning(['span', 'Ütközést találtam a következő tanulnivaló szóval: ',
							['a', {href: '#edit-word-' + (i + 1)}, (i + 1) + ': ' + existingWord.lang1 + ' – ' + existingWord.lang2 + '.']]);
					} else {
						notifications.message(['span', 'Ütközést találtam a következő szóval: ',
							['b', {href: '#edit-word-' + (i + 1)}, (i + 1) + ': ' + existingWord.lang1 + ' – ' + existingWord.lang2 + '.']]);
					}
				}
			}
		}
		
		getRowFromTarget(targetJq: jQuery.IInstance): jQuery.IInstance {
			return targetJq.closest('tr[data-edit-word-id]');
		}
		
		getWordIdFromRow(row: jQuery.IInstance): number {
			return <number>row.data('edit-word-id');
		}
		
		getNewWordFromRow(row: jQuery.IInstance): data.Word {
			var newWord = new data.Word();
			newWord.lang1 = illa.StringUtil.trim(row.find('input[data-edit-word-lang1-in]').val());
			newWord.lang2 = illa.StringUtil.trim(row.find('input[data-edit-word-lang2-in]').val());
			newWord.lang1Count = parseInt(row.find('input[data-edit-word-lang1-count-in]').val());
			newWord.lang2Count = parseInt(row.find('input[data-edit-word-lang2-count-in]').val());
			return newWord;
		}
		
		onEditWordsInputChanged(e: jQuery.IEvent): void {
			this.updateEditWordsButtonState(jQuery(e.target));
		}
		
		updateEditWordsButtonState(target: jQuery.IInstance): void {
			var row = this.getRowFromTarget(target);
			var id = this.getWordIdFromRow(row);
			var oldWord = this.getSelectedWordlist().words[id];
			var newWord = this.getNewWordFromRow(row);
			
			row.find('button[data-edit-word-save-button]').prop('disabled', newWord.lang1 == oldWord.lang1 && newWord.lang2 == oldWord.lang2 &&
				newWord.lang1Count == oldWord.lang1Count && newWord.lang2Count == oldWord.lang2Count);
		}
		
		onEditWordsSaveRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.editWordsNotifications.removeAll();
			
			var row = this.getRowFromTarget(jQuery(e.target));
			var id = this.getWordIdFromRow(row);
			
			var newWord = this.getNewWordFromRow(row);
			
			if (!newWord.lang1 || !newWord.lang2 || isNaN(newWord.lang1Count) || isNaN(newWord.lang2Count)) {
				this.editWordsNotifications.warning('Kérlek tölts ki minden mezőt!');
				return;
			}
			
			var wordlist = this.getSelectedWordlist();
			
			this.checkNewWordAndReportCollisions(wordlist, newWord, this.editWordsNotifications);
			
			wordlist.words.splice(id, 1, newWord);
			
			this.editWordsTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, <any>illa.partial(this.onWordsEdited, this, id), this);
			this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, <any>illa.partial(this.onEditWordsError, this, id), this);
			this.editWordsTransaction.process();
		}
		
		onEditWordsError(id: number, e: illa.Event): void {
			this.editWordsNotifications.error('Hiba történt, nem tudtam menteni!');
			
			this.updateEditWordsButtonState(this.editWordsTbody.find('button[data-edit-word-save-button]').eq(id));
		}
		
		onWordsEdited(id: number, e: illa.Event): void {
			this.editWordsNotifications.success('Rendben, mentettem!');
			
			this.updateEditWordsButtonState(this.editWordsTbody.find('button[data-edit-word-save-button]').eq(id));
		}
		
		onEditWordsSelectAllChanged(e: jQuery.IEvent): void {
			this.editWordsTbody.find('input[data-edit-word-selected]').prop('checked', jQuery(e.target).prop('checked'));
		}
		
		onDeleteWordsRequested(e: jQuery.IEvent): void {
			this.editWordsNotifications.removeAll();
			
			var checkedBoxes = this.editWordsTbody.find('input[data-edit-word-selected]:checked');
			var wordlist = this.getSelectedWordlist();
			if (!wordlist) {
				this.editWordsNotifications.error('Válassz listát előbb!');
				return;
			}
			
			for (var i = checkedBoxes.length - 1; i >= 0; i--) {
				var checkedBox = checkedBoxes.eq(i);
				var row = this.getRowFromTarget(checkedBox);
				var id = this.getWordIdFromRow(row);
				wordlist.words.splice(id, 1);
			}
			
			this.deleteWordsTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.deleteWordsTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordsDeleted, this);
			this.deleteWordsTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onDeleteWordsError, this);
			this.deleteWordsTransaction.process();
		}
		
		onDeleteWordsError(e: illa.Event): void {
			this.editWordsNotifications.error('Hiba történt, nem tudtam törölni!');
			
			this.refreshWordlists();
		}
		
		onWordsDeleted(e: illa.Event): void {
			this.editWordsNotifications.success('Rendben, töröltem!');
			
			this.refreshWordlists();
		}
	}
}