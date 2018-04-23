const defaultState = {
	confirmPassword: '',
	newPassword: '',
	errors: {},
	sendingRequest: false
};

export default function (state = defaultState, action) {
	switch(action.type) {
		case 'UPDATE_RP_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'SEND_RESET_PASSWORD_REQUEST':
			return {
				...state,
				sendingRequest: true,
				errors: {}
			};
		case 'SET_RESET_PASSWORD_ERRORS':
			return {
				...state,
				sendingRequest: false,
				errors: action.errors
			};
		case 'PASSWORD_RESET':
			return {
				viewState: 'PASSWORD_RESET',
				message: action.message
			};
		default:
			return state;
	}
};