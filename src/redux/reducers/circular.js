import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'DELETE_CIRCULAR':
			itemId = parseInt(action.itemId);
			return state.filter(item => item.id !== itemId);
		default:
			return state;
	}
}

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_CIR_FORM_DATA':
			return null;
		case 'SET_CIR_ADD_DATA':
		case 'SET_CIR_EDIT_DATA':
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

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_CIR_ADD_DATA':
		case 'SET_CIR_EDIT_DATA':
			return {};
		case 'SET_CIRCULAR_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'SET_CIR_ADD_DATA':
		case 'SET_CIR_EDIT_DATA':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SET_CIRCULAR_ERRORS':
		case 'INIT_MODULE':
		case 'RESET_CIRCULAR':
			return false;
		case 'SEND_CIRCULAR_SAVE_REQUEST':
			return true;
		default:
			return state;
	}
}


const reducer = combineReducers({
	meta,
	items,
	errors,
	item,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;