

module mag.model {
	export class WordlistEvent extends illa.Event {
		
		constructor(type: string, target: illa.EventHandler, private wordlists: data.Wordlist[]) {
			super(type, target);
		}
		
		getWordlists() {
			return this.wordlists;
		}
	}
}