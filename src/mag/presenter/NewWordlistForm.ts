

module mag.presenter {
	export class NewWordlistForm extends illa.EventHandler {

		static EVENT_NEW_WORDLIST_CREATED = 'mag_ui_NewWordlistForm_EVENT_NEW_WORDLIST_CREATED';

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

			var notifications = Main.getPresenter().getNotifications();
			Main.getPresenter().getNotifications().removeAll();

			var name = illa.StringUtil.trim(this.nameIn.val());
			var lang1Name = illa.StringUtil.trim(this.lang1NameIn.val());
			var lang2Name = illa.StringUtil.trim(this.lang2NameIn.val());

			if (!this.newList.name) {
				notifications.error('Kérlek adj nevet a szólistának!');
				return;
			}

			if (!this.newList.lang1Name) {
				notifications.error('Kérlek adj nevet az egyik nyelvnek!');
				return;
			}

			if (!this.newList.lang2Name) {
				notifications.error('Kérlek adj nevet a másik nyelvnek!');
				return;
			}

			notifications.message('Kérlek várj...', 'time');
			this.submitButton.prop('disabled', true);
			Main.getModel().onCreateNewWordlistRequested(name, lang1Name, lang2Name, illa.bind(this.onNewListDone, this));
		}

		onNewListDone(e: model.ErrorType): void {
			var notifications = MagPresenter.getNotifications();
			notifications.removeAll();
			switch (e) {
				case model.ErrorType.NONE:
					this.nameIn.val('');
					this.lang1NameIn.val('');
					this.lang2NameIn.val('');

					notifications.success('Létrehoztam az új listát!');
					new illa.Event(NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this).dispatch();
					break;
				default:
					
			}
			this.submitButton.prop('disabled', false);
		}
	}
}