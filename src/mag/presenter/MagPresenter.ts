/// <reference path='../../../lib/jQuery.d.ts'/>

/// <reference path='EditWordlistForm.ts'/>
/// <reference path='LearningForm.ts'/>
/// <reference path='MainTabs.ts'/>
/// <reference path='NewWordlistForm.ts'/>
/// <reference path='Notifications.ts'/>

module mag.presenter {
	export class MagPresenter {
		
		private mainTabs: MainTabs;
		private notifications: Notifications;
		
		private newWordlistForm: NewWordlistForm;
		private editWordlistForm: EditWordlistForm;
		private learningForm: LearningForm;
		
		constructor() {
			this.mainTabs = new MainTabs();
			
			this.notifications = new Notifications(jQuery('#notifications-start'));
			
			Main.getModel().addEventCallback(model.MagModel.EVENT_READY, this.onModelReady, this);
		}
		
		onModelReady() {
			this.notifications.removeAll();
			
			if (Main.getModel().getHasNewVersion()) {
				this.notifications.message(['span',
					'Letöltöttem egy új verziómat, ',
					['a', {onclick: 'window.location.reload()', href: ''}, 'kattints ide'],
					' hogy elindítsd!'
				], 'gift');
			} else if (Main.getModel().getHasUpdateError()) {
				this.notifications.error(['span',
					'Jaj, nem tudtam letölteni az új verziómat! ',
					['a', {onclick: 'window.location.reload()', href: ''}, 'Kattints ide'],
					' hogy újra próbálhassam!'
				]);
			}
			
			if (Main.getModel().getSupportsAppcache()) {
				this.notifications.warning('Internet nélkül is működöm! Jelölj be kedvencnek!', 'star');
			} else {
				this.notifications.error('Ez a böngésző nem támogatja az internet nélküli módot!');
			}
			
			this.newWordlistForm = new presenter.NewWordlistForm();
			
			this.editWordlistForm = new presenter.EditWordlistForm();
			
			this.learningForm = new presenter.LearningForm();
			this.learningForm.addEventCallback(presenter.LearningForm.EVENT_STATE_CHANGED, this.onLearningFormStateChanged, this);
			
			Main.getModel().addEventCallback(model.MagModel.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
			Main.getModel().loadWordlists();
		}
		
		onInitWordlistsRefreshed(e: illa.Event): void {
			
			Main.getModel().removeEventCallback(model.MagModel.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
			
			window.location.hash = '';
			
			this.mainTabs.enableAllTabs();
			this.notifications.success([
				['span', 'Kész vagyok a használatra! Kattints a ', ['em', 'szófelvétel'], ' fülre hogy kialakítsd a saját szólistádat, azután a ',
					['em', 'tanulás'], ' fülre, hogy megtanuld!']
			]);
		}
		
		onLearningFormStateChanged(e: illa.Event): void {
			if (this.mainTabs.getActiveTabId() === presenter.MainTabIndex.LEARN) {
				switch (this.learningForm.getState()) {
					case presenter.LearningFormState.NOT_STARTED:
						this.mainTabs.enableAllTabs();
						break;
					case presenter.LearningFormState.STARTED:
						this.mainTabs.disableInactiveTabs();
						break;
				}
			}
		}
		
		getNotifications() { return this.notifications }
		static getNotifications() { return Main.getPresenter().getNotifications() }
	}
}