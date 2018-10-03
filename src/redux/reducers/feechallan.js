import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function approval (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_FCN_APPROVAL':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'SEND_FCN_APPROVAL_REQUEST':
			return {};
		case 'SET_FCN_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps: action.bcsmaps,
			};
		default:
			return state;
	}
}

function saving (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_FCN_ERRORS':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SEND_FCN_APPROVAL_REQUEST':
			return true;
		default:
			return state;
	}
}

export default combineReducers({
	items,
	meta,
	approval,
	errors,
	saving,

	query,
	filters,
	pageInfo,
});