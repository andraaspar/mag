

module mag {
	export class StartView extends berek.Widget {
		
		notificationsOut: jQuery.IInstance;
		
		constructor(jq: jQuery.IInstance) {
			super(jq);
			
			jq.html(illa.Arrkup.createString([
				['div', {'class': 'row'},
					['div', {'class': 'col-xs-12'},
						['h2', 'Kezdőlap'],
						['p', {'class': 'lead'}, 'Szia! Mag vagyok, egy szógyakorló program.'],
						['div', {'data-berek-widget-part': 'notificationsOut'}]
					]
				]
			]));
			
			this.initParts();
		}
	}
}