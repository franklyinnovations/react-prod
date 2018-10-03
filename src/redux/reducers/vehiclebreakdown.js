import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_VBD_STATUS': {
			return state.map(item => {
				if (item.id === action.id)
					item.is_active = parseInt(action.status);
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
		case 'START_ADD_VBD':
		case 'START_VBD_EDIT':
			return {};
		case 'SET_VBD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_VBD_EDIT':
			return null;
		case 'START_ADD_VBD':
		case 'SET_VBD_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				rvdhsmaps: action.rvdhsmaps,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	items,
	item,
	meta,

	pageInfo,
	filters,
	query,
});

export default reducer;