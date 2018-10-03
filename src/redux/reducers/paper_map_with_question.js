import {combineReducers} from 'redux';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_SAVE_PMQ_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function selector(state = {classId: null, subjectId: null}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {classId: null, subjectId: null};
		case 'RESET_PMQ_CLASS':
			return {classId: null, subjectId: null};
		case 'CHANGING_PMQ_CLASS':
			return {classId: action.value, subjectId: null};
		case 'RESET_PMQ_SUBJECT':
			return {...state, subjectId: null};
		case 'CHANGING_PMQ_SUBJECT':
			return {...state, subjectId: action.value};
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcs_list: action.bcs_list,
				subjects: [],
				exampapers: [],
				questions: [],
				paper: null,
			};
		case 'RESET_PMQ_CLASS':
			return {
				...state,
				subjects: [],
				exampapers: [],
				paper: null,
				questions: [],
			};
		case 'SET_PMQ_SUBJECTS':
			return {
				...state,
				subjects: action.subjects,
			};
		case 'RESET_PMQ_SUBJECT':
			return {
				...state,
				exampapers: [],
				paper: null,
				questions: [],
			};
		case 'SET_PMQ_EXAMPAPERS':
			return {
				...state,
				exampapers: action.exampapers,
				questions: action.questions,
			};
		case 'SET_PMQ_PAPER':
			return {
				...state,
				paper: action.paper
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