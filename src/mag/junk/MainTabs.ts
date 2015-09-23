

module mag {
	export enum MainTabIndex {
		START, WORDLIST, LEARN
	}
	
	export class MainTabs {
		
		private startTab: jQuery.IInstance;
		private wordlistTab: jQuery.IInstance;
		private learnTab: jQuery.IInstance;
		
		private startTabPane: jQuery.IInstance;
		private wordlistTabPane: jQuery.IInstance;
		private learnTabPane: jQuery.IInstance;
		
		private allTabs: jQuery.IInstance;
		private allTabPanes: jQuery.IInstance;
		
		constructor() {
			this.startTab = jQuery('#tab-start');
			this.wordlistTab = jQuery('#tab-wordlist');
			this.learnTab = jQuery('#tab-learn');
			
			this.startTabPane = jQuery('#tab-pane-start');
			this.wordlistTabPane = jQuery('#tab-pane-wordlist');
			this.learnTabPane = jQuery('#tab-pane-learn');
			
			this.allTabs = this.startTab.add(this.wordlistTab).add(this.learnTab);
			this.allTabs.on('click', illa.bind(this.onTabClicked, this));
			
			this.allTabPanes = this.startTabPane.add(this.wordlistTabPane).add(this.learnTabPane);
		}
		
		getTabCount() { return this.allTabs.length }
		
		getActiveTabId() { return this.allTabs.index(this.allTabs.filter('.active')) }
		
		setActiveTabId(value: number): void {
			var tab = this.allTabs.eq(value);
			if (tab.hasClass('disabled') || tab.hasClass('active')) {
				return;
			}
			this.allTabs.removeClass('active').eq(value).addClass('active');
			this.allTabPanes.hide().eq(value).show();
		}
		
		disableInactiveTabs(): void {
			this.allTabs.not('.active').addClass('disabled');
		}
		
		enableAllTabs(): void {
			this.allTabs.removeClass('disabled');
		}
		
		onTabClicked(e: jQuery.IEvent): void {
			e.preventDefault();
			
			this.setActiveTabId(this.allTabs.index(e.currentTarget));
		}
	}
}