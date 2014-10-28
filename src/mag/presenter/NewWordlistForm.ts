

module mag.presenter {
	export class NewWordlistForm extends illa.EventHandler {
		
		static EVENT_NEW_WORDLIST_CREATED = 'mag_ui_NewWordlistForm_EVENT_NEW_WORDLIST_CREATED';
		
		private notifications = new Notifications(jQuery('#notifications-new-wordlist'));
		private nameIn = jQuery('#new-wordlist-name-in');
		private lang1NameIn = jQuery('#new-wordlist-lang1-name-in');
		private lang2NameIn = jQuery('#new-wordlist-lang2-name-in');
		private submitButton = jQuery('#create-new-wordlist');
		private newList: data.Wordlist;
		private transaction: adat.Transaction;
		
		constructor() {
			super();
			this.submitButton.on('click', illa.bind(this.onSubmitButtonClicked, this));
		}
		
		onSubmitButtonClicked(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.notifications.removeAll();
			
			this.newList = new data.Wordlist();
			this.newList.name = illa.StringUtil.trim(this.nameIn.val());
			this.newList.lang1Name = illa.StringUtil.trim(this.lang1NameIn.val());
			this.newList.lang2Name = illa.StringUtil.trim(this.lang2NameIn.val());
			
			if (!this.newList.name) {
				this.notifications.error('Kérlek adj nevet a szólistának!');
				return;
			}
			
			if (!this.newList.lang1Name) {
				this.notifications.error('Kérlek adj nevet az egyik nyelvnek!');
				return;
			}
			
			if (!this.newList.lang2Name) {
				this.notifications.error('Kérlek adj nevet a másik nyelvnek!');
				return;
			}
			
			this.notifications.message('Kérlek várj...', 'time');
			this.submitButton.prop('disabled', true);
			this.transaction = new adat.Transaction(mag.Main.getDatabase(), [
				new adat.RequestIndexGet(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(),
					illa.bind(this.onExistingListRetrieved, this), this.newList.name)
			], adat.TransactionMode.READWRITE);
			this.transaction.process();
		}
		
		onExistingListRetrieved(existingList: data.Wordlist): void {
			if (existingList) {
				this.notifications.removeAll();
				this.notifications.error('Egy lista ezzel a névvel már létezik!');
				this.submitButton.prop('disabled', false);
				return;
			}
			
			this.transaction.setRequests([
				new adat.RequestAdd(mag.Main.getDBWordlistsDesc(), this.newList)
			]);
			this.transaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onNewListAdded, this);
			this.transaction.process();
		}
		
		onNewListAdded(e: illa.Event): void {
			this.nameIn.val('');
			this.lang1NameIn.val('');
			this.lang2NameIn.val('');
			
			this.notifications.removeAll();
			this.notifications.success('Létrehoztam az új listát!');
			this.submitButton.prop('disabled', false);
			new illa.Event(NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this).dispatch();
		}
	}
}