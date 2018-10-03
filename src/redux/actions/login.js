import api, {makeErrors} from '../../api';
import {messenger} from '../../utils';
import {addView} from '../reducers/views';
import reducer from '../reducers/login';
export {update} from './index';

const view = 'login';
addView(view, reducer);

export function sendRequest(username, userpassword) {
	return dispatch => {
		dispatch({
			type: 'SEND_LOGIN_REQUEST'
		});
		return api({
			url: '/login',
			data: {
				username,
				userpassword
			},
			hideMessage: true,
		})
		.then(({data}) => {
			if (data.status !== false && !data.errors)
				return window.location.href = '/dashboard';
			let errors;
			if (data.errors) {
				errors = makeErrors(data.errors);
				errors = {
					username: errors.username,
					password: errors.userpassword
				};
			} else {
				errors = {
					message: data.message
				}
			}
			dispatch({
				type: 'SET_LOGIN_ERRORS',
				errors
			});
		});
	}
}

export function init() {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view: 'login'
		});
		dispatch({
			type: 'INIT_MODULE',
			view: 'login',
			stopLoading: true,
		});
	};
}

export function showForgotPassword() {
	return {
		type: 'SHOW_FORGOT_PASSWORD'
	};
}

export function showLogin() {
	return {
		type: 'SHOW_LOGIN'
	};
}

export function forgotPassword(username) {
	return dispatch => {
		dispatch({
			type: 'SEND_FORGOT_PASSWORD_REQUEST'
		});
		return api({
			url: '/forgot-password',
			data: {
				username,
				type: 'admin',
				resetPassUrl: window.location.origin + '/forgot-password/'
			},
			hideMessage: true,
		})
		.then(({data}) => {
			if (data.errors) {
				let errors = makeErrors(data.errors);
				dispatch({
					type: 'SET_FORGOT_PASSWORD_ERRORS',
					errors
				});
			} else if (data.status === false) {
				dispatch({
					type: 'SET_FORGOT_PASSWORD_ERRORS',
					errors: {
						username: data.message
					}
				});
			} else {
				dispatch({
					type: 'FORGOT_PASSWORD_LINK_SENT',
				});
				messenger.post(data.message);
			}
		});
	};
}