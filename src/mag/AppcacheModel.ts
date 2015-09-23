

module mag {
	export class AppcacheModel extends illa.EventHandler {
		
		static EVENT_READY = 'mag_AppcacheModel_EVENT_READY';
		
		private supportsAppCache = !!window.applicationCache;
		
		constructor() {
			super();
		}
		
		init(): void {
			if (this.supportsAppCache) {
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
			window.location.reload();
		}
		
		onError(e: Event): void {
			this.onAfterCache();
		}
		
		onAfterCache(): void {
			new illa.Event(AppcacheModel.EVENT_READY, this).dispatch();
		}
	}
}