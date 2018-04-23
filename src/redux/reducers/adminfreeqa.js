import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_FQA_LIST':
			return 'LIST';
		case 'SET_ADMIN_FQA_VIEW_DATA':
			return 'VIEW_DATA';
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
					item.is_active = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
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

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state || null;
	}
}

function helperData(state = {tags: []}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			let tags = action.data.tags.map(item => ({
				value: item.id,
				label: item.tagdetails[0].title
			}));
			tags.unshift({
				value: 'all',
				label: 'All Type'
			});
			return {tags};
		default:
			return state;
	}
}

function item(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return [];
		case 'SET_ADMIN_FQA_VIEW_DATA':
			return action.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'FQA_MAIL_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultMail = {
	showModal: false,
	itemId: '',
	subject: '',
	message: ''
}
function mail(state = defaultMail, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultMail;
		case 'SHOW_FQA_SEND_MAIL_MODAL':
			return {
				...state,
				itemId: action.itemId,
				showModal: true
			};
		case 'UPDATE_FQA_MAIL_VALUE':
			let newState = {...state};
			if(action.name) {
				newState[action.name] = action.value;
			}
			return newState;
		case 'CLOSE_FQA_SEND_MAIL_MODAL':
			return defaultMail;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	pageInfo,
	filter,
	helperData,
	item,
	errors,
	mail
});

export default reducer;