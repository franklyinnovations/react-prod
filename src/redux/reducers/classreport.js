import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function item(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_CR':
			return null;
		case 'SET_CR_DATA':
			return action.data;
		default:
			return state;
	}
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_locked = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				date: action.date,
				users: action.users,
				bcsmaps: action.bcsmaps,
				subjects: action.subjects,
			};
		case 'UPDATE_CR_DATE':
			return {
				...state,
				date: action.value,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	item,
	items,
	meta,
	query,
	filters,
	pageInfo,
});

export default reducer;