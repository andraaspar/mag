/// <reference path='WordlistOptionRenderer.ts'/>

module mag {
	export class WordlistSelectorForm extends illa.EventHandler {
		
		private selector: jQuery.IInstance;
		
		constructor(selectorId: string) {
			super();
			
			this.selector = jQuery(selectorId);
			this.selector.on('change', illa.bind(this.onSelected, this));
			
			Main.getInstance().addEventCallback(Main.EVENT_WORDLISTS_LOAD_START, this.onWordlistsLoadStart, this);
			Main.getInstance().addEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onWordlistsLoaded, this);
			Main.getInstance().addEventCallback(Main.EVENT_SELECTED_WORDLIST_CHANGED, this.onSelectedWordlistChanged, this);
		}
		
		onWordlistsLoadStart(e: illa.Event): void {
			this.selector.prop('disabled', true);
		}
		
		onWordlistsLoaded(e: illa.Event): void {
			this.selector.html(illa.Arrkup.createString(util.WordlistOptionRenderer.getArrkup()));
			this.selector.prop('disabled', false);
			this.selector.val(Main.getInstance().getSelectedWordlistId() + '');
		}
		
		onSelected(e: jQuery.IEvent): void {
			Main.getInstance().setSelectedWordistId(Number(this.selector.val()));
		}
		
		onSelectedWordlistChanged(e: illa.Event): void {
			this.selector.val(Main.getInstance().getSelectedWordlistId() + '');
		}
		
		getSelector() { return this.selector }
	}
}