import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS': {
			let itemId = parseInt(action.itemId);
			return state.map(country => {
				if (country.id === itemId)
					country.is_active = parseInt(action.status);
				return country;
			});
		}
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


const defaultDataItem = {
	name: '',
	iso_code: '',
	currencyId: '',
	code: '',
	is_active: true
};

function item(state = defaultDataItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
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
		case 'UPDATE_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			if((action.name === 'currencyId' || action.name === 'iso_code') && !action.value){
				newState[action.name] = '';
			}
			return newState;
		}
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
		case 'INIT_MODULE': 
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

const defaultQueryData = {
	queryItems: [],
	filters: [],
};

const reducer = combineReducers({
	items,
	item,
	helperData,
	errors,
	query,
	filters,
	pageInfo,
});

export default reducer;