

module mag {
	export class NavbarView extends berek.Widget {
		
		mainButtonJq: jQuery.IInstance;
		collapseButtonJq: jQuery.IInstance;
		collapsablesJq: jQuery.IInstance;
		
		startItemJq: jQuery.IInstance;
		
		constructor(jq: jQuery.IInstance) {
			super(jq);
			
			jq.html(illa.Arrkup.createString([
				['nav', {'class': 'navbar navbar-default'},
					['div', {'class': 'container-fluid'},
						['div', {'class': 'navbar-header'},
							['button', {
								'type': 'button',
								'class': 'navbar-toggle collapsed',
								'data-berek-widget-part': 'collapseButtonJq'
							},
								['span', {'class': 'sr-only'}, 'Navigáció ki / be'],
								['span', {'class': 'icon-bar'}],
								['span', {'class': 'icon-bar'}],
								['span', {'class': 'icon-bar'}]
							],
							['a', {'class': 'navbar-brand', 'data-berek-widget-part': 'mainButtonJq'}, 'Mag']
						],
						['div', {'class': 'collapse navbar-collapse', 'data-berek-widget-part': 'collapsablesJq'},
							['ul', {'class': 'nav navbar-nav'},
								['li', {'data-berek-widget-part': 'startItemJq'},
									['a', 'Kezdőlap']
								]
							]
						]
					]
				]
			]));
			
			this.initParts();
		}
	}
}