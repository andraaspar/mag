/// <reference path='NavbarView.ts'/>
/// <reference path='Presenter.ts'/>

module mag {
	export class NavbarPresenter extends Presenter<NavbarView> {
		
		
		
		constructor(parent: illa.IEventHandler, jq: jQuery.IInstance) {
			super(parent, jq);
			
			this.getView().collapseButtonJq.on('click', illa.bind(this.onCollapseButtonClicked, this));
		}
		
		protected createView(jq: jQuery.IInstance): NavbarView {
			return new NavbarView(jq);
		}
		
		protected onCollapseButtonClicked(e: jQuery.IEvent): void {
			illa.GLOBAL.$(this.getView().collapsablesJq[0]).collapse('toggle');
		}
	}
}