import {combineReducers} from 'redux';

function item (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {...state, [action.name]: action.value};
		case 'SIGNUP_DONE':
			return false;
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SIGNUP_DONE':
			return {};
		case 'SET_SIGNUP_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				timezones: action.timezones,
				countries: action.countries,
				languages: action.languages,
				dateformats: action.dateformats,
			};
		default:
			return state;
	}
}

export default combineReducers({
	item,
	meta,
	errors,
});