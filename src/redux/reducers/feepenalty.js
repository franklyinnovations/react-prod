import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_FPT_STATUS': {
			let id = action.id;
			return state.map(item => {
				if (item.id === id)
					item.is_active = action.status;
				return item;
			});
		}
		default:
			return state;
	}
}

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_ADD_FPT':
		case 'SET_FPT_EDIT_DATA':
			return action.data;
		case 'LOADING_FPT_EDIT_DATA':
			return null;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'ADD_FPT_SLAB':
			return {
				...state,
				days: '',
				amount: '',
				feepenaltyslabs: [...state.feepenaltyslabs, action.item].sort((x, y) => x.days - y.days),
			};
		case 'REMOVE_FPT_SLAB':
			return {
				...state,
				feepenaltyslabs: state.feepenaltyslabs.filter((_, index) => index !== action.index),
			};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'LOADING_FPT_EDIT_DATA':
		case 'START_ADD_FPT':
		case 'ADD_FPT_SLAB':
			return {};
		case 'SET_FPT_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'LOADING_FPT_ROUTES':
			return {...state, routes: null};
		case 'LOAD_FPT_ROUTES':
			return {...state, routes: action.data};
		case 'LOADING_FPT_ROUTE_ADDRESSES':
			return {...state, routeaddresses: null};
		case 'LOAD_FPT_ROUTE_ADDRESSES':
			return {...state, routeaddresses: action.data};
		case 'RESET_FPT_ROUTE':
			return {...state, routeaddresses: []};
		case 'SET_FPT_EDIT_DATA':
			return {...state, routes: action.routes, routeaddresses: action.routeaddresses};
		default:
			return state;
	}
}

export default combineReducers({
	items,
	item,
	errors,
	meta,
	query,
	filters,
	pageInfo,
});