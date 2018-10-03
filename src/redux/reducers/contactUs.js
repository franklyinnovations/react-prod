import {combineReducers} from 'redux';

const defaultState = {
	nature_of_interest: '',
	organization_name: '',
	name: '',
	mobile: '',
	email: '',
	query: '',
	try_demo: '',
	countryId: '',
	skypeId: '',
	countries: [],
};

function item (state = defaultState, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...defaultState,
				countries: action.data.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				})),
			};
		case 'UPDATE_CONTACT_US_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SAVED_SUCCESSFULLY':
			return {
				...state,
				nature_of_interest: '',
				organization_name: '',
				name: '',
				mobile: '',
				email: '',
				query: '',
				try_demo: '',
				countryId: '',
				skypeId: '',
			};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'SAVED_SUCCESSFULLY':
			return {};
		case 'SET_CONTACT_US_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

export default combineReducers({
	item,
	errors,
})