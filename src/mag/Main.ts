

module mag {
	export class Main {
		
		private static instance = new Main();
		
		constructor() {
			
		}
		
		static getInstance() {return this.instance}
	}
}