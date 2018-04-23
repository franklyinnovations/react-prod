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
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(doctor => {
				if (doctor.id === itemId)
					doctor.is_active = parseInt(action.status);
				return doctor;
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
	article_image: '',
	'article_details[title]': '',
	'article_details[body]': '',
	article_tags: [],
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
			let getData = action.data.data;
			return {
				...state,
				id: getData.id,
				article_image: getData.article_image,
				'article_details[title]': getData.articledetails[0].title,
				'article_details[body]': getData.articledetails[0].body,
				article_tags: getData.article_tags.split(','),
				status: getData.status
			}
		default:
			return state;
	}
}

const defaultHelperData = {
	article_tags: [],
	displayViewDetailModal: false,
	displayPublishArticleModal: false
};

function helperData (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			var articletags = action.data.article_tags;

			return {
				...state, 
				article_tags: articletags.tags.map(item => {
					return {label: item.tagdetails[0].title, value: item.id}
				})
			}
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			var articletags = action.data.article_tags;

			return {
				...state, 
				article_tags: articletags.tags.map(item => {
					return {label: item.tagdetails[0].title, value: item.id}
				})
			}
		default:
			return state;
	}
}

function modalActivity(state = null, action) {
	switch(action.type) {
		case 'CLOSE_MODAL':
			return {displayViewDetailModal: false, displayPublishArticleModal: false}
		case 'SHOW_MODAL':
			let prevState = {...state}
			prevState[action.modal] = true;
			return prevState;
		default:
			return {displayViewDetailModal: false, displayPublishArticleModal: false}

	}
}

const reducer = combineReducers({
	viewState,
	articles,
	errors,
	pageInfo,
	filter,
	modelData,
	helperData,
	modalActivity
});

export default reducer;
