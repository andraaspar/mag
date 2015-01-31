

module mag.util {
	export class StringUtil {
		
		static removeDoubleSpaces(s: string): string {
			return s.replace(/\s{2,}/, ' ');
		}
	}
}