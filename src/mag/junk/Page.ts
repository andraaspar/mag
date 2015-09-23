/// <reference path='../../lib/berek/Widget.ts'/>

module mag {
	
	export interface PageConstructor {
		new (jq: jQuery.IInstance): Page;
	}
	
	export class Page extends berek.Widget {
		
		constructor(jq: jQuery.IInstance) {
			super(jq);
			
			jq.on('click', illa.bind(this.onClick, this));
		}
		
		processInput(): void {
			
		}
		
		generateContent(): void {
			
		}
		
		updateContent(): void {
			
		}
		
		protected onClick(e: jQuery.IEvent): void {
			
		}
	}
}