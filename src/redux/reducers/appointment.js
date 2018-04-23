import {combineReducers} from 'redux';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'LOADING_APPOINTMENT_CONSULT':
			return null;
		case 'LOAD_APPOINTMENT_CONSULT':
			return action.data;
		case 'CLOSE_APPOINTMENT_VIEW':
			return false;
		default:
			return state;
	}
}

function pageInfo(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

function filter(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state;
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			let newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state;
	}
}

export default combineReducers({
	items,
	item,
	pageInfo,
	filter,
});