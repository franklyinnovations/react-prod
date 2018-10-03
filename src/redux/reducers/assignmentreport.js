import {combineReducers} from 'redux';

function selector(state = {teachers: [], start: null, end: null}, action) {
	switch (action.type) {
		case 'UPDATE_AR_SELECTOR':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function teachers(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_AR':
			return null;
		case 'LOAD_AR':
			return action.teachers;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				teachers: action.teachers,
			};
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	teachers,
	meta,
});