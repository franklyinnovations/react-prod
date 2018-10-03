const defaultLoginState = {
	username: '',
	password: '',
	sendingRequest: false,
	errors: {},
};

export default function (state = {...defaultLoginState}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SHOW_LOGIN':
			return {
				...defaultLoginState
			};
		case 'UPDATE_LOGIN_PASSWORD':
			return {
				...state,
				password: action.value
			};
		case 'UPDATE_LOGIN_USERNAME':
			return {
				...state,
				username: action.value
			};
		case 'SEND_LOGIN_REQUEST':
			return {
				...state,
				sendingRequest: true
			};
		case 'SET_LOGIN_ERRORS':
		case 'SET_FORGOT_PASSWORD_ERRORS':
			return {
				...state,
				sendingRequest: false,
				errors: action.errors,
				viewState: action.type
			};
		case 'SHOW_FORGOT_PASSWORD':
			return {
				username: state.username,
				sendingRequest: false,
				errors: {},
				viewState: 'FORGOT_PASSWORD_FORM',
			};
		case 'SEND_FORGOT_PASSWORD_REQUEST':
			return {
				...defaultLoginState,
				viewState: action.type
			};
		case 'FORGOT_PASSWORD_LINK_SENT':
			return{
				...defaultLoginState,
				viewState: action.type
			};
		default:
			return state;
	}
}