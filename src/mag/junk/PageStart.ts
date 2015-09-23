/// <reference path='Page.ts'/>

module mag {
	export class PageStart extends Page {
		
		private titleJq: jQuery.IInstance;
		
		constructor(jq: jQuery.IInstance) {
			super(jq);
		}
		
		generateContent(): void {
			this.getJQuery().html(illa.Arrkup.createString(
				['h1', {'data-berek-Widget-part': 'titleJq'}, 'It works!']
			));
			this.initParts();
		}
		
		updateContent(): void {
			this.titleJq.text('Awesome!');
		}
	}
}