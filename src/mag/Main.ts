/// <reference path='../../lib/jQuery.d.ts'/>

/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='ui/MainTabs.ts'/>
/// <reference path='ui/Notifications.ts'/>

module mag {
	export class Main {
		
		private static instance = new Main();
		
		private mainTabs: ui.MainTabs;
		private startNotifications: ui.Notifications;
		
		private supportsAppCache: boolean;
		
		constructor() {
			
			this.supportsAppCache = !!window.applicationCache;
			
			jQuery(window).on('load', illa.bind(this.onWindowLoaded, this));
		}
		
		onWindowLoaded(): void {
			illa.Log.info('DOM loaded.');
			
			this.mainTabs = new ui.MainTabs();
			
			this.startNotifications = new ui.Notifications(jQuery('#notifications-start'));
			
			if (this.supportsAppCache) {
				this.startNotifications.warning('Kérlek várj, amíg teljesen betöltődöm.', 'time');
				window.applicationCache.addEventListener('cached', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('noupdate', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('updateready', illa.bind(this.onUpdateReady, this));
			} else {
				this.onAfterCache();
			}
		}
		
		onCached(e: Event): void {
			this.startNotifications.removeAll();
			this.onAfterCache();
		}
		
		onNoUpdate(e: Event): void {
			this.startNotifications.removeAll();
			this.onAfterCache();
		}
		
		onUpdateReady(e: Event): void {
			this.startNotifications.removeAll();
			this.startNotifications.message(['span',
				'Letöltöttem egy új verziómat, ',
				['a', {onclick: 'window.location.reload()', href: ''}, 'kattints ide'],
				' hogy elindítsd!'
			], 'gift');
			this.onAfterCache();
		}
		
		onError(e: Event): void {
			this.startNotifications.removeAll();
			this.startNotifications.error(['span',
				'Jaj, nem tudtam letölteni az új verziómat! ',
				['a', {onclick: 'window.location.reload()', href: ''}, 'Kattints ide'],
				' hogy újra próbálhassam!'
			]);
			this.onAfterCache();
		}
		
		onAfterCache(): void {
			if (this.supportsAppCache) {
				this.startNotifications.warning('Internet nélkül is működöm! Jelölj be kedvencnek!', 'star');
			} else {
				this.startNotifications.error('Ez a böngésző nem támogatja az internet nélküli módot!');
			}
			
			this.mainTabs.enableAllTabs();
			this.startNotifications.success([
				['span', 'Kész vagyok a használatra! Kattints a ', ['em', 'szófelvétel'], ' fülre hogy kialakítsd a saját szólistádat, azután a ',
					['em', 'tanulás'], ' fülre, hogy megtanuld!']
			]);
		}
		
		static getInstance() {return this.instance}
	}
}