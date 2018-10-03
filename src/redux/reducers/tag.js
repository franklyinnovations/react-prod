import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS': {
			let itemId = action.itemId;
			return state.map(tag => {
				if (tag.id === itemId)
					tag.is_active = parseInt(action.status);
				return tag;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_TAG_EDIT_DATA':
		case 'START_ADD_TAG':
			return {};
		case 'SET_TAG_SAVE_ERRORS':
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
		case 'LOADING_TAG_EDIT_DATA':
			return null;
		case 'START_ADD_TAG':
		case 'SET_TAG_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE': {
			return {
				...state,
				[action.name]: action.value
			};
		}
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'SET_TAG_SAVE_ERRORS':
			return false;
		case 'SEND_ADD_TAG_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	item,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;