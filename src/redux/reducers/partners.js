import {combineReducers} from 'redux';

const defaultState = {
	partner_name: '',
	company_name: '',
	website_url: '',
	address: '',
	name: '',
	designation: '',
	mobile: '',
	email: '',
	about_business: '',
	message: '',
};

function item(state = defaultState, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return defaultState;
		case 'UPDATE_PARTNERS_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_PARTNERS_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

export default combineReducers({
	item,
	errors,
});