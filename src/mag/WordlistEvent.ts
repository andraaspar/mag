

module mag {
	export class WordlistEvent extends illa.Event {
		
		constructor(type: string, target: illa.EventHandler, private wordlists: Wordlist[]) {
			super(type, target);
		}
		
		getWordlists() {
			return this.wordlists;
		}
	}
}