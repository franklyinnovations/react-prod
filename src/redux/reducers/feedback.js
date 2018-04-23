import { combineReducers } from 'redux';
import PropTypes from 'prop-types';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}
}

function feedbacks(state = [], action) {
	
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

const defaultModalActionData = {
	displayModal: false,
	disableHandlers: false,
	data: null
};
function modalAction (state = defaultModalActionData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state, 
				data: null,
				displayModal: false,
				disableHandlers: false
			}
		case 'VIEW_MODAL':
			return {
				...state, 
				data: action.data,
				displayModal: true,
				disableHandlers: false
			}
		case 'CLOSE_MODAL':
			return {
				...state, 
				data: null,
				displayModal: false,
				disableHandlers: false
			}
		case 'MODAL_PROCESSING_STATE': 
			return {
				...state, 
				disableHandlers: true
			}
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	feedbacks,
	pageInfo,
	filter,
	modalAction,
	pageInfo
});

export default reducer;
