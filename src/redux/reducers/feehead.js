import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_FHD_STATUS': {
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
		case 'START_ADD_FHD':
		case 'SET_FHD_EDIT_DATA':
			return action.data;
		case 'LOADING_FHD_EDIT_DATA':
			return null;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'RESET_FHD_TRANSPORT_TYPE':
		case 'LOADING_FHD_ROUTES':
			return {
				...state,
				routeId: null,
				routeaddressId: null,
			};
		case 'RESET_FHD_TRANSPORT':
			return {
				...state,
				routeId: null,
				routeaddressId: null,
				transportationFeeType: null,
			};
		case 'RESET_FHD_ROUTE':
			return {
				...state,
				routeaddressId: null,
			};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'LOADING_FHD_EDIT_DATA':
		case 'START_ADD_FHD':
			return {};
		case 'SET_FHD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'LOADING_FHD_ROUTES':
			return {...state, routes: null};
		case 'LOAD_FHD_ROUTES':
			return {...state, routes: action.data};
		case 'LOADING_FHD_ROUTE_ADDRESSES':
			return {...state, routeaddresses: null};
		case 'LOAD_FHD_ROUTE_ADDRESSES':
			return {...state, routeaddresses: action.data};
		case 'RESET_FHD_ROUTE':
			return {...state, routeaddresses: []};
		case 'SET_FHD_EDIT_DATA':
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