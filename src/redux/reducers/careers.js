import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_FQA_LIST':
			return 'LIST';
		case 'SET_CHAT_PAYMENT_VIEW_DATA':
		case 'SET_CHAT_PAYMENT_PAID_VIEW_DATA':
			return 'VIEW_DATA';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'INIT_LIST':
			return {
				page: action.data.page,
				pageCount: action.data.pageCount,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	pageInfo,
});

export default reducer;