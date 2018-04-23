import {combineReducers} from 'redux';

function item(state = null, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return action.user;
		case 'ACCOUNT_PASSWORD_CHANGED':
			return {
				...state,
				curr_password: '',
				new_password: '',
				confirm_new_password: '',
			};
		case 'UPDATE_PROFILE_DATA':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'ACCOUNT_START_CHANGE_PASSWORD':
		case 'SAVE_ACCOUNT':
			return {};
		case 'SET_ACCOUNT_PASSWORD_ERRORS':
		case 'SET_ACCOUNT_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

export default combineReducers({
	item,
	errors,
});

