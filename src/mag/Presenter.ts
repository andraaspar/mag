

module mag {
	export class Presenter<T extends berek.Widget> extends illa.EventHandler {
		
		private parent: illa.IEventHandler;
		private view: T;
		
		constructor(parent: illa.IEventHandler, jq: jQuery.IInstance) {
			super();
			this.parent = parent;
			this.view = this.createView(jq);
		}
		
		protected createView(jq: jQuery.IInstance): T {
			throw 'Unimplemented.';
		}
		
		getEventParent(): illa.IEventHandler {
			return this.parent;
		}
		
		protected getView(): T {
			return this.view;
		}
		
		public show(): void {
			this.getView().getJQuery().show();
		}
		
		public hide(): void {
			this.getView().getJQuery().hide();
		}
	}
}