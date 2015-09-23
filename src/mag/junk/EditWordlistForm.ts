/// <reference path='../../lib/adat/RequestDelete.ts'/>
/// <reference path='../../lib/adat/RequestPut.ts'/>

/// <reference path='WordlistOptionRenderer.ts'/>

/// <reference path='WordlistSelectorForm.ts'/>

module mag {
	export class EditWordlistForm extends WordlistSelectorForm {
		
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
		private saveWordsButton = jQuery('#save-words');
		private deleteWordsButton = jQuery('#delete-words');
		
		private renameTransaction: adat.Transaction;
		private deleteTransaction: adat.Transaction;
		private addWordTransaction: adat.Transaction;
		private editWordsTransaction: adat.Transaction;
		private deleteWordsTransaction: adat.Transaction;
		
		constructor() {
			super('#list-select');
			
			this.renameListButton.on('click', illa.bind(this.onListRenameRequested, this));
			this.renameLang1Button.on('click', <any>illa.partial(this.onLangRenameRequested, this, true));
			this.renameLang2Button.on('click', <any>illa.partial(this.onLangRenameRequested, this, false));
			this.deleteListConfirm.on('change', illa.bind(this.onDeleteListConfirmChanged, this));
			this.deleteListButton.on('click', illa.bind(this.onDeleteListRequested, this));
			this.addWord1In.on('keyup', illa.bind(this.onAddWordInKeyUp, this));
			this.addWord2In.on('keyup', illa.bind(this.onAddWordInKeyUp, this));
			this.addWordButton.on('click', illa.bind(this.onAddWordRequested, this));
			this.saveWordsButton.on('click', illa.bind(this.onEditWordsSaveRequested, this));
			this.editWordsSelectAll.on('change', illa.bind(this.onEditWordsSelectAllChanged, this));
			this.deleteWordsButton.on('click', illa.bind(this.onDeleteWordsRequested, this));
		}
		
		onWordlistsLoaded(e: illa.Event): void {
			super.onWordlistsLoaded(e);
			this.updateFormOnSelectionChanged();
		}
		
		onSelectedWordlistChanged(e: illa.Event): void {
			super.onSelectedWordlistChanged(e);
			this.updateFormOnSelectionChanged();
		}
		
		updateFormOnSelectionChanged(): void {
			var wordlist = Main.getInstance().getSelectedWordlist() || new data.Wordlist();
			
			this.renameNotifications.removeAll();
			this.editWordsNotifications.removeAll();
			this.addWordNotifications.removeAll();
			this.deleteNotifications.removeAll();
			
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
		
		onListRenameRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.renameNotifications.removeAll();
			
			var wordlist = Main.getInstance().getSelectedWordlist();
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
			
			Main.getInstance().refreshWordlists();
		}
		
		onListRenamed(e: illa.Event): void {
			this.renameNotifications.success('Rendben, átneveztem!');
			
			Main.getInstance().refreshWordlists();
		}
		
		onLangRenameRequested(isFirstLang: boolean, e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.renameNotifications.removeAll();
			
			var wordlist = Main.getInstance().getSelectedWordlist();
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
			
			var list = Main.getInstance().getSelectedWordlist();
			
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
			
			Main.getInstance().refreshWordlists();
		}
		
		onListDeleted(e: illa.Event): void {
			this.deleteNotifications.success('Rendben, töröltem!');
			
			Main.getInstance().refreshWordlists();
		}
		
		onAddWordInKeyUp(e: jQuery.IEvent): void {
			if (e.which == 13) {
				this.onAddWordRequested();
			}
		}
		
		onAddWordRequested(e?: jQuery.IEvent): void {
			this.addWordNotifications.removeAll();
			
			var wordlist = Main.getInstance().getSelectedWordlist();
			if (!wordlist) {
				this.addWordNotifications.warning('Válassz listát előbb!');
				return;
			}
			
			var newWord = new data.Word();
			newWord.lang1 = illa.StringUtil.trim(this.addWord1In.val());
			newWord.lang2 = illa.StringUtil.trim(this.addWord2In.val());
			newWord.lang1Count = Main.PRACTICE_COUNT_DEFAULT;
			newWord.lang2Count = Main.PRACTICE_COUNT_DEFAULT;
			
			if (!newWord.lang1 || !newWord.lang2) {
				this.addWordNotifications.error('Kérlek add meg mindkét szót!');
				return;
			}
			
			this.checkNewWordAndReportCollisions(wordlist, newWord, NaN, this.addWordNotifications);
			
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
			
			Main.getInstance().refreshWordlists();
		}
		
		onWordAdded(e: illa.Event): void {
			this.addWordNotifications.success('Rendben, hozzáadtam!');
			
			this.addWord1In.val('').focus();
			this.addWord2In.val('');
			
			Main.getInstance().refreshWordlists();
		}
		
		renderWords(): void {
			var wordlist = Main.getInstance().getSelectedWordlist() || new data.Wordlist();
			
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
						]
					]
				);
			}
			this.editWordsTbody.html(illa.Arrkup.createString(arrkup));
		}
		
		checkNewWordAndReportCollisions(wordlist: data.Wordlist, newWord: data.Word, skipId: number, notifications: Notifications): void {
			for (var i = 0, n = wordlist.words.length; i < n; i++) {
				if (i == skipId) continue;
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
			newWord.lang1 = illa.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(row.find('input[data-edit-word-lang1-in]').val()));
			newWord.lang2 = illa.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(row.find('input[data-edit-word-lang2-in]').val()));
			newWord.lang1Count = parseInt(row.find('input[data-edit-word-lang1-count-in]').val());
			newWord.lang2Count = parseInt(row.find('input[data-edit-word-lang2-count-in]').val());
			return newWord;
		}
		
		onEditWordsSaveRequested(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.editWordsNotifications.removeAll();
			
			var wordlist = Main.getInstance().getSelectedWordlist();
			if (!wordlist) {
				this.editWordsNotifications.warning('Válassz listát előbb!');
				return;
			}
			
			var rows = this.editWordsTbody.children('tr[data-edit-word-id]');
			
			for (var i = 0, n = rows.length; i < n; i++) {
				var row = rows.eq(i);
				var id = this.getWordIdFromRow(row);
				var newWord = this.getNewWordFromRow(row);
				if (!newWord.lang1 || !newWord.lang2 || isNaN(newWord.lang1Count) || isNaN(newWord.lang2Count)) {
					row.addClass('danger');
					this.editWordsNotifications.error([[], 'Kérlek tölts ki minden mezőt a ', ['a', {href: '#edit-word-' + (i + 1)},
						i + 1 + '. sorban!']]);
					return;
				}
				this.checkNewWordAndReportCollisions(wordlist, newWord, id, this.editWordsNotifications);
				wordlist.words.splice(id, 1, newWord);
			}
			
			this.editWordsTransaction = new adat.Transaction(Main.getDatabase(), [
				new adat.RequestPut(Main.getDBWordlistsDesc(), wordlist)
			]);
			this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, <any>illa.partial(this.onWordsEdited, this, id), this);
			this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, <any>illa.partial(this.onEditWordsError, this, id), this);
			this.editWordsTransaction.process();
		}
		
		onEditWordsError(id: number, e: illa.Event): void {
			this.editWordsNotifications.error('Hiba történt, nem tudtam menteni!');
			
			Main.getInstance().refreshWordlists();
		}
		
		onWordsEdited(id: number, e: illa.Event): void {
			this.editWordsNotifications.success('Rendben, mentettem!');
			
			Main.getInstance().refreshWordlists();
		}
		
		onEditWordsSelectAllChanged(e: jQuery.IEvent): void {
			this.editWordsTbody.find('input[data-edit-word-selected]').prop('checked', jQuery(e.target).prop('checked'));
		}
		
		onDeleteWordsRequested(e: jQuery.IEvent): void {
			this.editWordsNotifications.removeAll();
			
			var checkedBoxes = this.editWordsTbody.find('input[data-edit-word-selected]:checked');
			var wordlist = Main.getInstance().getSelectedWordlist();
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
			
			Main.getInstance().refreshWordlists();
		}
		
		onWordsDeleted(e: illa.Event): void {
			this.editWordsNotifications.success('Rendben, töröltem!');
			
			Main.getInstance().refreshWordlists();
		}
	}
}