import api from '../../api';

const defaultLoginState = {
	username: '',
	password: ''
};

export default function (state, action) {
	switch(action.type) {
		case 'LOGIN_UPDATE_PASSWORD':
			return {
				...state,
				password: action.value
			};
		case 'LOGIN_UPDATE_USERNAME':
			return {
				...state,
				username: action.value
			};
		default:
			return defaultLoginState;
	}
}