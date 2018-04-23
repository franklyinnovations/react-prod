import api, {makeErrors, makeApiData} from '../../api';
import {messenger} from "../../utils";

const view = 'signup';

export function init(state) {
    return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			stopLoading: true
		});
	}
}

export function sendLoginRequest(username, userpassword) {
	var setErrors = {}
	if(!username) {
		setErrors.username = "This field is required."
	}
	if(!userpassword) {
		setErrors.userpassword = "This field is required."
	}

	if(Object.keys(setErrors).length > 0) {
		return {
			type: 'SET_ERRORS',
			errors: setErrors
		}
	} else {
		return dispatch => api({
			method: 'post',
			url: '/weblogin',
			data: {
				username, userpassword
			},
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(({data}) => {
			if(false === data.status && data.errors) {
				return dispatch({
					type: 'SET_ERRORS',
					errors: makeErrors(data.errors)
				});
			} else {
				if("doctor" === data.user_type) {
					window.location.href = '/doctor/profile';	
				} else if("doctor_clinic_both" === data.user_type) {
					window.location.href = '/doh/profile';	
				} else if("hospital" === data.user_type) {
					window.location.href = '/hospital/profile';	
				} else {
					window.location.href = '/admin/dashboard';
				}
			}
		})
		.catch(error => console.error);
	}
}

export function sendSignupRequest(state, formdata) {
	let data = makeApiData(state, formdata);

	return dispatch => api({
		data,
		url: '/users/web-register'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			setTimeout(() => {
				window.location.href = '/login';
			}, 3000)
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

export function updateLoginData(name, value) {
	return {
		type: 'UPDATE_LOGIN_DATA',
		name: name,
		value: value
	}
}

export function updateSignUpData(name, value) {
	return {
		type: 'UPDATE_SIGNUP_DATA',
		name: name,
		value: value
	}
}

export function updateSignUpRoleData(name, value, user_type) {
	return {
		type: 'UPDATE_SIGNUP_ROLE_DATA',
		name: name,
		value: value,
		user_type: user_type
	}
}

export function getSignupMetaData() {
	return dispatch => {
		return api({
			data: {},
			url: '/users/login'
		})
		.then(({data}) => {
            dispatch({
				type: 'SET_SIGNUP_META_DATA',
				data
			});
		});
    }
}

export function updateLoginEmail(value) {
	return {
		type: 'UPDATE_LOGIN_EMAIL',
		value: value
	}
}

export function updateLoginPassword(value) {
	return {
		type: 'UPDATE_LOGIN_PASSWORD',
		value: value
	}
}

export function forgotPassword(state) {
	let errors = {};
	if(!state.forgotPassword.email) {
		errors.email = "This field is required."
	}

	return dispatch => {
		if(Object.keys(errors).length !== 0 ) {
			dispatch({
				type: 'SET_FORGOT_PASSWORD_ERRORS',
				errors
			});
		} else {
			dispatch({
				type: 'SEND_FORGOT_PASSWORD_REQUEST'
			});
			return api({
				url: '/forgot-password',
				data: {
					email: state.forgotPassword.email,
					resetPassUrl: window.location.origin + '/reset-password/'
				},
				hideMessage: true
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
							email: data.message
						}
					});
				} else {
					dispatch({
						type: 'FORGOT_PASSWORD_LINK_SENT',
					});
					messenger.post(data.message);
				}
			});
		}
	}
}