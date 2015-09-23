

module mag {
	export class MainView extends berek.Widget {
		
		containerJq: jQuery.IInstance;
		navbarJq: jQuery.IInstance;
		startJq: jQuery.IInstance;
		
		constructor(jq: jQuery.IInstance) {
			super(jq);
			
			jq.html(illa.Arrkup.createString([
				['div', {'class': 'container', 'data-berek-widget-part': 'containerJq'},
					['div', {'data-berek-widget-part': 'navbarJq'}],
					['div', {'data-berek-widget-part': 'startJq'}]
				]
			]));
			
			this.initParts();
		}
	}
}