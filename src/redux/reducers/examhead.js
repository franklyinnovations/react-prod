import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_EHD_STATUS': {
			let id = action.id;
			return state.map(curriculum => {
				if (curriculum.id === id)
					curriculum.is_active = action.status;
				return curriculum;
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
		case 'START_ADD_EHD':
		case 'SET_EHD_EDIT_DATA':
			return action.data;
		case 'START_EHD_EDIT':
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
		case 'START_EHD_EDIT':
		case 'START_ADD_EHD':
			return {};
		case 'SET_EHD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

export default combineReducers({
	items,
	item,
	errors,
	query,
	filters,
	pageInfo,
});