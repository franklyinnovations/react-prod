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

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'START_ADD_SYL':
			return false;
		case 'SET_SYL_EDIT_DATA':
			return action.data;
		case 'START_SYL_EDIT':
			return null;
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
		case 'START_SYL_EDIT':
		case 'START_ADD_SYL':
			return {};
		case 'SET_SYL_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				classes: action.classes,
				examheads: action.examheads,
			};
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