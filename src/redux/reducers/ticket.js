import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_TICKET_LIST':
			return 'LIST';
		case 'START_ADD_TICKET':
			return 'DATA_FORM';
		case 'SET_TICKET_EDIT_DATA':
			return 'EDIT_FORM';
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
					item.status = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_TICKET':
		case 'SET_TICKET_EDIT_DATA':
			return {};
		case 'SET_TICKET_ERRORS':
			return action.errors;
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

function filter(state = {}, action) {
	switch(action.type) {
		case 'RESET_TICKET_FILTERS':
			return {};
		case 'UPDATE_TICKET_FILTER':
		case 'REMOVE_TICKET_FILTERS':
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

const defaultItem = {
	id: '',
	'ticket[title]': '',
	'ticket[type]': '',
	'ticket[priority]':'',
	'ticket[ticketmessage][message]': '',
};

function item(state = defaultItem, action) {
	switch(action.type) {
		case 'START_ADD_TICKET':
			return defaultItem;
		case 'UPDATE_TICKET_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

const defaultState = {
	id: '',
	createdAt: '',
	updatedAt: '',
	type:'',
	status:'',
	'ticketmessage[message]':'',
	ticketmessages: [],
};

function edititem(state = defaultState, action) {
	switch(action.type) {
		case 'SET_TICKET_EDIT_DATA':
			return action.data;
		case 'UPDATE_TICKET_EDIT_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'CHANGE_TICKET_STATUS':
			return {
				...state,
				status: parseInt(action.status),
			};
		default:
			return state;
	}
}

const defaultQueryData = {
	queryItems: [],
	filters: [],
}

function query(state = defaultQueryData, action){
	switch(action.type){
		case 'INIT_MODULE':
			return {
				queryItems: action.query,
				filters: action.query,
			};
		case 'RESET_TICKET_FILTERS':
			return {...defaultQueryData};
		case 'UPDATE_TICKET_FILTER':
		case 'REMOVE_TICKET_FILTERS':
			let filters = state.filters.filter(item => item.name !== action.name);
			if (action.value) {
				filters.push({name: action.name, label:action.label, value:action.valueLable});
			}
			return {...state, filters};
		default:
			return state;
	}
}


const reducer = combineReducers({
	viewState,
	errors,
	filter,
	pageInfo,
	item,
	items,
	edititem,
	query,
});

export default reducer;