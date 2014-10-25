

module mag.util {
	export class WordlistOptionRenderer {
		
		static getArrkup(): any[] {
			var wordlists = Main.getInstance().getWordlists();
			var arrkup: any[] = [['option', {value: 'NaN'}, 'Válassz egy listát...']];
			for (var i = 0, n = wordlists.length; i < n; i++) {
				var wordlist = wordlists[i];
				arrkup.push(['option', {value: wordlist.id}, wordlist.name + ' (' + wordlist.lang1Name + ', ' + wordlist.lang2Name + ')']);
			}
			return arrkup;
		}
	}
}