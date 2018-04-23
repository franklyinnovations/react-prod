import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_COUNTRY_LIST':
			return 'LIST';
		case 'START_ADD_COUNTRY':
		case 'SET_COUNTRY_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function countries(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(country => {
				if (country.id === itemId)
					country.is_active = parseInt(action.status);
				return country;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_COUNTRY':
		case 'SET_COUNTRY_EDIT_DATA':
			return {};
		case 'SET_COUNTRY_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state || null;
	}
}

const defaultDataItem = {
	name: '',
	iso_code: '',
	currencyId: '',
	code: '',
	is_active: ''
}

function country(state = defaultDataItem, action) {
	switch(action.type) {
		case 'START_ADD_COUNTRY':
			return defaultDataItem;
		case 'SET_COUNTRY_EDIT_DATA':
			return {
				id: action.data.data.id,
				code: action.data.data.code,
				iso_code: action.data.data.iso_code,
				currencyId: action.data.data.currencyId,
				name: action.data.data.countrydetails[0].name,
				detailId: action.data.data.countrydetails[0].id,
				is_active: action.data.data.is_active
			};
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

const defaultHelperData = {
	currencies: [],
	isoCodes: []
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD_COUNTRY': 
			return {
				currencies: action.data.currencies.map(item => ({
					value: item.id,
					label: item.currency_name+'('+item.currency_symbol+')'
				})),
				isoCodes: action.data.isoCodes.map(item => ({
					value: item.iso,
					label: item.name+'('+item.iso+')'
				}))
			};
		case 'SET_COUNTRY_EDIT_DATA':
			return {
				currencies: action.data.currencies.map(item => ({
					value: item.id,
					label: item.currency_name+'('+item.currency_symbol+')'
				})),
				isoCodes: action.data.isoCodes.map(item => ({
					value: item.iso,
					label: item.name+'('+item.iso+')'
				}))
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	countries,
	errors,
	pageInfo,
	filter,
	country,
	helperData
});

export default reducer;