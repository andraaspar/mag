/// <reference path='Presenter.ts'/>
/// <reference path='StartView.ts'/>

module mag {
	export class StartPresenter extends Presenter<StartView> {
		
		constructor(parent: illa.IEventHandler, jq: jQuery.IInstance) {
			super(parent, jq);
		}
		
		protected createView(jq: jQuery.IInstance): StartView {
			return new StartView(jq);
		}
	}
}