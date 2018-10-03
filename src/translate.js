import {recordIncompleteTranslations} from './config';

export default function (translations, code) {
	let translaters, isBrowser = typeof window !== 'undefined';
	if (isBrowser && window.pateastTranslation)
		return window.pateastTranslation;
	else {
		translaters = global.translaters || (global.translaters = {});
		if (translaters[code]) return translaters[code];
	}

	let __ = makeTranslater(translations[code], code);

	if (isBrowser)
		return window.pateastTranslation = window.__ = __;
	else
		return translaters[code] = __;
}

function makeTranslater(translations = {}, code) {
	return (str = '', obj) => {
		if (recordIncompleteTranslations && typeof window !== 'undefined') {
			localStorage.setItem('trd-' + code + '-' +  str, code === 'en' ? (translations[str] || str) : '');
		}
		return rawTranslate(translations[str] || str, obj);
	};
}

export function rawTranslate(text, options = false, expStart = '{{', expEnd = '}}') {
	if (options) {
		let index1 = text.indexOf(expStart),
			index2 = 0,
			res = '';
		while (index1 !== -1) {
			res += text.substring(index2, index1);
			index2 = text.indexOf(expEnd, index1);
			if (index2 === -1) {
				return res + text.substring(index1);
			} else {
				res += options[text.substring(index1 + 2, index2)] || '';
			}
			index2 += 2;
			index1 = text.indexOf(expStart, index2);
		}
		return res + text.substring(index2);
	} else {
		return text;
	}
}
