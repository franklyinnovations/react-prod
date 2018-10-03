import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';


function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_EXAMSCHEDULE_LIST':
			return 'LIST';
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'LOADING_EXAMSCHEDULE_FORM_DATA':
			return null;
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
			return action.data;
		default:
			return state;
	}
}

function examsyllabus(state = false, action) {
	switch(action.type) {
		case 'LOADING_EXAM_SYLLABUS':
			return null;
		case 'SHOW_SYLLABUS':
			return action.data;
		case 'HIDE_SYLLABUS':
			return false;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
			};
		default:
			return state;
	}
}

export default combineReducers({
	viewState,
	items,
	item,
	meta,
	examsyllabus,
	query,
	filters,
	pageInfo,
});