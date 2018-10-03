import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_SECTION':
		case 'SET_SECTION_EDIT_DATA':
			return {};
		case 'SET_EXP_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_EXP_EDIT_DATA':
			return null;
		case 'START_ADD_SECTION':
		case 'SET_SECTION_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'ADD_EXP_SECTION':
			return {...state, section_title: ''};
		case 'RESET_EXP_CLASS': 
			return {...state, classId: null};
		case 'CHANGING_EXP_CLASS': 
			return {...state, classId: action.value};
		default:
			return state;
	}
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data || [];
		case 'CHANGE_EXP_STATUS': {
			let itemId = action.id;
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = action.status;
				return item;
			});
		}
		case 'CHANGE_EXP_PUBLISH_STATUS': {
			let itemId = action.id;
			return state.map(item => {
				if (item.id === itemId)
					item.is_published = action.status;
				return item;
			});
		}
		default:
			return state;
	}
}

function surveySections(state = [], action) {
	switch(action.type) {
		case 'ADD_EXP_SECTION':
			return [...state, action.title];
		case 'REMOVE_EXP_SECTION': {
			return state.filter((_, index) => index !== action.index);
		}
		case 'SET_SECTION_EDIT_DATA':
			return action.exampapersections;
		case 'START_ADD_SECTION':
			return [];
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
		case 'START_ADD_SECTION':
			return {
				...state,
				bcs_list: action.bcs_list,
				subjects: []
			};
		case 'RESET_EXP_CLASS':
		case 'CHANGING_EXP_CLASS':
			return {
				...state,
				subjects: []
			};
		case 'LOAD_EXP_SUBJECTS':
			return {
				...state,
				subjects: action.subjects,
			};
		case 'SET_SECTION_EDIT_DATA':
			return {
				...state,
				bcs_list: action.classes,
				subjects: action.subjects,
			};
		default: 
			return state;
	}
}

function questions(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_EXP_QUESTIONS':
			return null;
		case 'SET_EXP_QUESTIONS':
			return action.data;
		default:
			return state;
	}
}

function saving (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_EXP_SAVE_ERRORS':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SAVING_EXP':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	items,
	item,
	surveySections,
	meta,
	questions,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;