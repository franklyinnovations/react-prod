export default function (translations, code) {
	let translaters, isBrowser = typeof window !== 'undefined';
	if (isBrowser && window.pateastTranslation)
		return window.pateastTranslation;
	else {
		translaters = global.translaters || (global.translaters = {});
		if (translaters[code]) return translaters[code];
	}

	let __ = makeTranslater(translations[code]);

	if (isBrowser)
		return window.pateastTranslation = window.__ = __;
	else
		return translaters[code] = __;
}

function makeTranslater(translations = {}) {
	return (str = '', obj) => rawTranslate(translations[str] || str, obj);
}

export function rawTranslate(text, options = false) {
	if (options) {
		let index1 = text.indexOf('{{'),
			index2 = 0,
			res = '';
		while (index1 !== -1) {
			res += text.substring(index2, index1);
			index2 = text.indexOf('}}', index1);
			if (index2 === -1) {
				return res + text.substring(index1);
			} else {
				res += options[text.substring(index1 + 2, index2)] || '';
			}
			index2 += 2;
			index1 = text.indexOf('{{', index2);
		}
		return res + text.substring(index2);
	} else {
		return text;
	}
}
