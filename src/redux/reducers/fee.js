import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_FEE_STATUS': {
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
		case 'START_ADD_FEE':
		case 'SET_FEE_EDIT_DATA':
			return action.data;
		case 'LOADING_FEE_EDIT_DATA':
			return null;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'UPDATE_FEE_INSTALLMENT_DATA': {
			let feeheads = [...state.feeheads];
			feeheads[action.feehead].feeallocations[action.feeallocation][action.name] = action.value;
			return {...state, feeheads};
		}
		case 'SET_FEE_ERRORS':
			return {...state, feeheads: action.feeheads};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'LOADING_FEE_EDIT_DATA':
		case 'START_ADD_FEE':
		case 'SAVING_FEE':
			return {};
		case 'SET_FEE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				boards: action.boards,
				classes: action.classes,
			};
		case 'START_ADD_FEE':
		case 'SET_FEE_EDIT_DATA':
			return {
				...state,
				classes: action.classes,
				feepenalties: action.feepenalties,
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