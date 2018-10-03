import {combineReducers} from 'redux';

function selector(state = {weekday: null, subjectId: null}, action) {
	switch (action.type) {
		case 'UPDATE_TS_SELECTOR':
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
		case 'LOADING_TS':
			return null;
		case 'LOAD_TS':
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
				subjects: action.subjects,
				days: action.days,
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