/// <reference path='Word.ts'/>

module mag.data {
	export class Wordlist {
		id: number;
		name = '';
		lang1Name = '';
		lang2Name = '';
		words: Word[] = [];
		
		constructor(other?: Wordlist) {
			if (other) {
				for (var i in other) {
					if (other.hasOwnProperty(i)) {
						this[i] = other[i];
					}
				}
			}
		}
	}
}