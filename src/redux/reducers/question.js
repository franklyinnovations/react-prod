import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_QUE_ADD':
			return {};
		case 'SET_ERRORS':
		case 'SET_QUE_SAVE_ERRORS':
			return action.errors;
		case 'RENDER_QUE_VIEW':
			return {};
		default:
			return state;
	}
}


function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_QUE_DATA':
			return null;
		case 'START_QUE_ADD':
		case 'SET_QUE_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'RESET_QUE_CLASS':
			return {
				...state,
				classId: null,
			};
		case 'CHANGING_QUE_CLASS':
			return {
				...state,
				classId: action.value,
			};
		case 'UPDATE_QUE_OPTIONS':
			return {
				...state,
				options: action.options,
				number_of_options: !action.options ? '' : state.number_of_options,
				questionControlType: !action.options ? null : state.questionControlType,
			};
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
				subject_list: action.subjects
			};
		case 'SET_QUE_EDIT_DATA':
			return {
				...state,
				bcs_list: action.bcs_list,
				subjects: action.subjects,
				question_control_types: action.question_control_types,
			};
		case 'START_QUE_ADD':
			return {
				...state,
				bcs_list: action.bcs_list,
				question_control_types: action.question_control_types,
			};
		case 'RESET_QUE_CLASS':
		case 'CHANGING_QUE_CLASS':
			return {
				...state,
				subjects: [],
			};
		case 'LOAD_QUE_SUBJECTS':
			return {
				...state,
				subjects: action.subjects,
			};
		default: 
			return state;
	}
}

function saving (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_QUE_SAVE_ERRORS':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SAVING_QUE':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	item,
	meta,
	items,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;