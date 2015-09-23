/// <reference path='MainView.ts'/>
/// <reference path='NavbarPresenter.ts'/>
/// <reference path='Presenter.ts'/>

module mag {
	export class MainPresenter extends Presenter<MainView> {
		
		private navbarPresenter: NavbarPresenter;
		
		private startPresenter: StartPresenter;
		
		private screens: Presenter<any>[];
		
		constructor(parent: illa.IEventHandler, jq: jQuery.IInstance) {
			super(parent, jq);
			
			this.navbarPresenter = new NavbarPresenter(this, this.getView().navbarJq);
			
			this.startPresenter = new StartPresenter(this, this.getView().startJq);
			
			this.screens = [
				this.startPresenter
			];
		}
		
		protected createView(jq: jQuery.IInstance): MainView {
			return new MainView(jq);
		}
		
		protected onClick(e: jQuery.IEvent): void {
			var navParent = jQuery(e.target).closest('[data-navigate]');
			if (navParent.length) {
				var p: Presenter<any> = this[navParent.data('navigate')];
				if (p instanceof Presenter) {
					for (var i = 0, n = this.screens.length; i < n; i++) {
						if (this.screens[i] === p) this.screens[i].show();
						else this.screens[i].hide();
					}
				}
			}
		}
	}
}