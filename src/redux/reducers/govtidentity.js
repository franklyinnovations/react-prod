import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_GIY_STATUS': {
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
		case 'START_ADD_GIY':
		case 'HIDE_DATA_MODAL':
		case 'SET_GIY_EDIT_DATA':
			return {};
		case 'SET_GIY_ERRORS':
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
		case 'START_GIY_EDIT':
			return null;
		case 'START_ADD_GIY':
		case 'SET_GIY_EDIT_DATA':
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

function meta (state = {}, action) {
	switch(action.type) {
		case 'START_ADD_GIY': 
		case 'SET_GIY_EDIT_DATA':
			return {
				countries: action.countries,
			};
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