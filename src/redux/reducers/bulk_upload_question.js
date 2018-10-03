import {combineReducers} from 'redux';

function errors(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_EXCEL_UPLOADED_DATA':
			return [];
		case 'SET_BUQ_UPLOAD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function selector(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				classsId: null,
				subjectId: null,
				questionControlType: null,
			};
		case 'RESET_BUQ_CLASS':
			return {
				...state,
				classId: null,
				subjectId: null,
			};
		case 'CHANGING_BUQ_CLASS':
			return {
				...state,
				subjectId: null,
				classId: action.value,
			};
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function meta (state = {questions: [], bcs_list: [], question_control_types: []}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				questions: [],
				bcs_list: action.bcs_list,
				question_control_types: action.question_control_types,
			};
		case 'RESET_BUQ_CLASS':
		case 'CHANGING_BUQ_CLASS':
			return {
				...state,
				subjects: [],
			};
		case 'SET_BUQ_SUBJECTS':
			return {
				...state,
				subjects: action.subjects,
			};
		case 'SET_EXCEL_UPLOADED_DATA':
			return {
				...state, 
				questions: action.data,
			};
		case 'SET_BUQ_UPLOAD_ERRORS':
			return {
				...state,
				questions: [],
			};
		default: 
			return state;
	}
}

const reducer = combineReducers({
	errors,
	meta,
	selector,
});

export default reducer;