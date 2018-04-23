import api, {makeErrors} from '../../api';
import {messenger} from "../../utils";

export function init() {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view: 'resetpassword'
		});
		dispatch({
			type: 'INIT_MODULE',
			view: 'resetpassword',
			stopLoading: true,
		});
	};
}

export function sendRequest(password, confirm_password, reset_password_token, router) {
	return dispatch => {
		dispatch({
			type: 'SEND_RESET_PASSWORD_REQUEST'
		});
		api({
			url: '/reset-password',
			data: {
				password,
				type: 'admin',
				confirm_password,
				reset_password_token
			},
			hideMessage: true
		})
		.then(({data}) => {
			if (data.status !== false && !data.errors) {
				messenger.post(data.message);
				return router.push('/login');
			}
			let errors;
			if (data.errors) {
				errors = makeErrors(data.errors);
				errors = {
					newPassword: errors.password,
					confirmPassword: errors.confirm_password
				};
			} else {
				messenger.post(data.message);
			}
			dispatch({
				type: 'SET_RESET_PASSWORD_ERRORS',
				errors
			});
		})
	}
}