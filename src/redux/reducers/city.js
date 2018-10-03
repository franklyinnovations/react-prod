import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_CITY_STATUS': {
			let itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = action.status;
				return item;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'START_ADD_CITY':
		case 'SET_CITY_EDIT_DATA':
			return {};
		case 'SET_CITY_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_CITY_EDIT':
			return null;
		case 'START_ADD_CITY':
		case 'SET_CITY_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'RESET_STATE_COUNTRY':
			return {
				...state,
				countryId: null,
				stateId: null,
			};
		case 'CHANGING_STATE_COUNTRY':
			return {
				...state,
				countryId: action.value,
				stateId: null,
			};
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'START_ADD_CITY': 
			return {
				countries: action.countries,
				states: false,
			};
		case 'SET_CITY_EDIT_DATA':
			return {
				countries: action.countries,
				states: action.states,
			};
		case 'RESET_STATE_COUNTRY':
			return {...state, states: false};
		case 'CHANGING_STATE_COUNTRY':
			return {...state, states: null};
		case 'SET_CITY_STATES':
			return {...state, states: action.data};
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	item,
	meta,
	query,
	filters,
	pageInfo,
});

export default reducer;