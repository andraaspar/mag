/// <reference path='Page.ts'/>

module mag {
	export class LocalServer {
		
		private page: Page;
		private nextPageConstructor: PageConstructor;
		
		constructor(private startPageConstructor: PageConstructor) {
			
		}
		
		processPageInput(): void {
			this.page.processInput();
		}
		
		renderNextPage(): void {
			var pageConstructor = this.nextPageConstructor ? this.nextPageConstructor : this.startPageConstructor;
			if (!(this.page instanceof pageConstructor)) {
				if (this.page) {
					this.page.getJQuery().remove();
				}
				this.page = new pageConstructor(jQuery('<div>').appendTo('body'));
				this.page.generateContent();
			}
			this.page.updateContent();
		}
		
		getPage(): Page { return this.page }
		
		getNextPageConstructor(): PageConstructor { return this.nextPageConstructor }
		setNextPageConstructor(v: PageConstructor): void { this.nextPageConstructor = v }
	}
}