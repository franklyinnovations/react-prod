import { combineReducers } from 'redux';
import PropTypes from 'prop-types';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		default:
			return state;
	}
}

function feedbacks(state = [], action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return action.data.data;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
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
		case 'VIEW_LIST':
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

function helperData(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return {
				...state, 
				average_rating: action.data.average_rating
			}
		default: 
			return state;
	}
}

function profileChangeState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				value: action.doctorProfileId, name: 'doctorprofile'
			}
		case 'UPDATE_PROFILE_STATE':
			return {
				value: action.value, name: action.name
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
	helperData,
	profileChangeState
});

export default reducer;
