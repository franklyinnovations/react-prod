'use strict';

import axios from 'axios';

import {
	webApiUrl
} from './config';

import {
	messenger,
} from './utils';

// export default function api (options) {
// 	options.method = options.method || 'post';
// 	options.url = webApiUrl + options.url;
// 	if (!options.headers) options.headers = {};
// 	if (typeof window === 'undefined' && options.cookies) {
// 		options.headers.cookie = options.cookies;
// 	}
// 	if (!options.headers['Content-Type'])
// 		options.headers['Content-Type'] = 'application/json';

// 	return axios(options)
// 	.catch(error => {
// 		if (!(error.response && error.response.status === 401)) throw error;
// 		return axios({
// 			method: 'get',
// 			url: webApiUrl + '/refresh_token',
// 			headers: options.headers
// 		})
// 		.then(() => axios(options))
// 		.catch(error => {
// 			if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
// 				window.location.href = '/logout';
// 				return;
// 			}
// 			throw error;
// 		});
// 	})
// 	.then(response => {
// 		let message = response.data.message || response.data.error_description;
// 		if ((response.status === false || !options.hideMessage) && messenger && message && message !== 'tag type list')
// 			messenger.post({
// 				message,
// 				type: response.data.status ? 'success' : 'error'
// 			});
// 		if (response.status === false) throw response;
// 		return response;
// 	});
// };

export default function api (options) {
	options.method = options.method || 'post';
	options.url = webApiUrl + options.url;
	if (!options.headers) options.headers = {};
	if (typeof window === 'undefined' && options.cookies)
		options.headers.cookie = options.cookies;
	if (!options.headers['Content-Type'])
		options.headers['Content-Type'] = 'application/json';

	return axios(options)
	.catch(error => {
		if (!(error.response && error.response.status === 401)) throw error;
		return axios({
			method: 'get',
			url: webApiUrl + '/refresh_token',
			headers: options.headers
		})
		.then(() => axios(options))
	})
	.catch(error => {
		if (error.response) {
			if (error.response.status === 503) {
				throw 'SERVICE_DOWN';
			} else if (error.response.status === 400 || error.response.status === 401) {
				throw 'INVALID_SESSION';
			} else {
				throw 'UNKNOWN_ERROR';
			}
		} else {
			throw 'SERVER_DOWN';
		}
	})
	.then(response => {
		let {code, url, error_description, status, error} = response.data || {};
		if (code === 500) throw 'INTERNAL_ERROR';
		if (code === 401) throw 'ACCESS_DENIED';
		if (url && error_description && status && error) throw 'INTERNAL_ERROR';

		let message = response.data.message || response.data.error_description;
		if ((response.status === false || !options.hideMessage) && messenger && message)
			messenger.post({
				message,
				type: response.data.status ? 'success' : 'error'
			});
		return response;
	});
};

export function makeApiData (state, data = {}) {
	if (typeof FormData !== 'undefined' && data instanceof FormData) {
		data.append('lang', state.lang.code || 'en');
		data.append('langId', state.lang.id || 1);
		data.append('languageId', state.lang.id || 1);
	} else {
		data.lang = state.lang.code || 'en';
		data.langId = state.lang.id || 1;
		data.languageId = state.lang.id || 1;
	}
	return data;
}

export function makeErrors (errors) {
	let result = {};
	for (var i = errors.length - 1; i >= 0; i--) {
		result[errors[i].path] = errors[i].message;
	}
	return result;
}
