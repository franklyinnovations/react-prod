import {combineReducers} from 'redux';

const defaultDataItem = {
	prospect_name: '',
	email: '',
	phone: '',
	institution: '',
	countryId: '',
	stateId: '',
	count_of_students: '',
	additional_info: '',
	fullname: '',
	email_address: '',
	business_name: '',
	business_url: '',
	institute_erp: '',
	partner_code:'',
};

function item(state = defaultDataItem, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...defaultDataItem
			};
		case 'UPDATE_DEAL_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'LOAD_DEAL_STATE':
			return {
				...state,
				stateId: '',
			};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_DEAL_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultHelperData = {
	countries: [],
	states: [],
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				countries: action.countries,
			};
		case 'LOAD_DEAL_STATE':
			return {
				...state,
				states: [],
			};
		case 'SET_DEAL_STATE':
			return {
				...state,
				states: action.data
			};
		default:
			return state;
	}
}
export default combineReducers({
	item,
	errors,
	helperData,
});