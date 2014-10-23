module mag.data {
	export class Word {
		
		lang1: string = '';
		lang2: string = '';
		lang1Count = 0;
		lang2Count = 0;
		
		constructor(other?: Word) {
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