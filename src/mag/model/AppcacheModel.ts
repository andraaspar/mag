

module mag.model {
	export class AppcacheModel extends illa.EventHandler {
		
		static EVENT_READY = 'mag_model_AppcacheModel_EVENT_READY';
		
		private supportsAppCache = !!window.applicationCache;
		
		private hasNewVersion = false;
		private hasUpdateError = false;
		
		constructor() {
			super();
		}
		
		init(): void {
			if (this.supportsAppCache) {
				//this.startNotifications.message('Kérlek várj, amíg teljesen betöltődöm...', 'time');
				window.applicationCache.addEventListener('cached', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('noupdate', illa.bind(this.onCached, this));
				window.applicationCache.addEventListener('updateready', illa.bind(this.onUpdateReady, this));
				window.applicationCache.addEventListener('error', illa.bind(this.onCached, this));
			} else {
				this.onAfterCache();
			}
		}
		
		onCached(e: Event): void {
			this.onAfterCache();
		}
		
		onNoUpdate(e: Event): void {
			this.onAfterCache();
		}
		
		onUpdateReady(e: Event): void {
//			this.hasNewVersion = true;
//			this.onAfterCache();
			window.location.reload();
		}
		
		onError(e: Event): void {
			this.hasUpdateError = true;
			this.onAfterCache();
		}
		
		onAfterCache(): void {
			new illa.Event(AppcacheModel.EVENT_READY, this).dispatch();
		}
	}
}