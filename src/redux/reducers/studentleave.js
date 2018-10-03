import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data || [];
		case 'CHANGE_ITEM_STATUS': {
			let itemId = +action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					item.leavestatus = parseInt(action.status);
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
		case 'SET_STUDENT_LEAVE_VIEW_DATA':
			return {};
		case 'SET_STUDENT_LEAVE_ERRORS':
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
		case 'LODING_STL_DATA':
			return null;
		case 'SET_STUDENT_LEAVE_VIEW_DATA':
			return action.data;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps: action.bcsmaps
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SEND_UPDATE_LEAVE_STATUS_REQUEST':
			return true;
		default:
			return state;
	}
}


const reducer = combineReducers({
	items,
	errors,
	item,
	meta,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;