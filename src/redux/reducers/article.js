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

function articles(state = [], action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_ACTIVE_STATUS':
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

function errors(state = {}, action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return {};
		case 'INIT_ERRORS':
			return {};
		case 'SET_ERRORS':
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

const defaultDataItem = {
	id: '',
	image: '',
	'article_details[title]': '',
	'article_details[body]': '',
	article_tags: [],
	is_active: true,
	status: ''
}

function modelData(state = defaultDataItem, action) {
 	switch(action.type) {
		case 'START_ADD':
			return defaultDataItem;
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		case 'SET_EDIT_DATA':
			return {
				...state,
				id: '',
				image: '',
				'article_details[title]': '',
				'article_details[body]': '',
				article_tags: [],
				is_active: true,
				status: ''
			}
		default:
			return state;
	}
}

const defaultHelperData = {
	article_tags: []
};

function helperData (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			let articletags = action.data.article_tags;
			let setTags = articletags ? articletags.tags : [];
			return {
				...state, 
				article_tags: setTags.map(item => {
					return {label: item.tagdetails[0].title, value: item.id}
				})
			}
		case 'SET_EDIT_DATA':
			return [];
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	articles,
	errors,
	pageInfo,
	filter,
	modelData,
	helperData
});

export default reducer;
