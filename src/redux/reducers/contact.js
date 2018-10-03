import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function item(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_CONTACT_VIEW_DATA':
			return null;
		case 'SET_CONTACT_VIEW_DATA':
			return action.data;
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	item,
	query,
	filters,
	pageInfo,
});

export default reducer;