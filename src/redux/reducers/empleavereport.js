import {combineReducers} from 'redux';

function selector(state = {user_type: null, start: null, end: null}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {user_type: null, start: null, end: null};
		case 'UPDATE_ELR_SELECTOR':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function users(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_ELR':
			return null;
		case 'LOAD_ELR':
			return action.users;
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	users,
});