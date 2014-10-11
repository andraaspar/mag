

module mag.ui {
	export class Notifications {
		
		
		
		constructor(private container: jQuery.IInstance) {
			
		}
		
		message(arrkup: any, icon = '', alertType = 'info'): jQuery.IInstance {
			var result = jQuery(illa.Arrkup.createString(
			['div', {'class': 'alert alert-' + alertType, role: 'alert'},
				(icon ? <any>['span', {'class': 'glyphicon glyphicon-' + icon}] : ''),
				' ',
				arrkup
			])).appendTo(this.container);
			result.find('a').addClass('alert-link');
			return result;
		}
		
		warning(arrkup: any, icon = ''): jQuery.IInstance {
			return this.message(arrkup, icon, 'warning');
		}
		
		error(arrkup: any, icon = 'warning-sign'): jQuery.IInstance {
			return this.message(arrkup, icon, 'danger');
		}
		
		success(arrkup: any, icon = 'ok'): jQuery.IInstance {
			return this.message(arrkup, icon, 'success');
		}
		
		removeAll(): void {
			this.container.empty();
		}
	}
}