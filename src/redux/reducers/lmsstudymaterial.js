import {combineReducers} from 'redux';

function studymaterial(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_LSM_DATA':
			return null;
		case 'SET_LSM_DATA':
			return action.data;
		default:
			return state;
	}
}

function selector(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'RESET_LSM_CLASS':
			return {
				bcsmapId: null,
				subjectId: null,
				chapterId: null,
				topicId: null,
			};
		case 'CHANGING_LSM_CLASS':
			return {
				...state,
				bcsmapId: action.value,
				subjectId: null,
				chapterId: null,
				topicId: null,
			};
		case 'RESET_LSM_SUBJECT':
			return {
				...state,
				subjectId: null,
				chapterId: null,
				topicId: null,
			};
		case 'CHANGING_LSM_SUBJECT':
			return {
				...state,
				subjectId: action.value,
				chapterId: null,
				topicId: null,
			};
		case 'RESET_LSM_CHAPTER':
			return {
				...state,
				chapterId: null,
				topicId: null,
			};
		case 'CHANGING_LSM_CHAPTER':
			return {
				...state,
				chapterId: action.value,
				topicId: null,
			};
		case 'UPDATE_SML_TOPIC':
			return {
				...state,
				topicId: action.value,
			};
		default:
			return state;
	}
}


function meta (state = {bcsmaps: false, subjects: false, chapters: false, topics: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		case 'RESET_LSM_CLASS':
			return {
				...state,
				subjects: false,
				chapters: false,
				topics: false,
			};
		case 'CHANGING_LSM_CLASS':
			return {
				...state,
				subjects: null,
				chapters: false,
				topics: false,
			};
		case 'SET_LSM_SUBJECTS':
			return {
				...state,
				subjects: action.data,
				chapters: false,
				topics: false,
			};
		case 'RESET_LSM_SUBJECT':
			return {
				...state,
				chapters: false,
				topics: false,
			};
		case 'CHANGING_LSM_SUBJECT':
			return {
				...state,
				chapters: null,
				topics: false,
			};
		case 'SET_LSM_CHAPTERS':
			return {
				...state,
				chapters: action.data,
				topics: false,
			};
		case 'RESET_LSM_CHAPTER':
			return {
				...state,
				topics: false,
			};
		case 'CHANGING_LSM_CHAPTER':
			return {
				...state,
				topics: null,
			};
		case 'SET_LSM_TOPICS':
			return {
				...state,
				topics: action.data,
			};
		default:
			return state;
	}
}


const reducer = combineReducers({
	studymaterial,
	selector,
	meta,
});

export default reducer;