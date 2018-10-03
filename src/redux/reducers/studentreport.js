import {combineReducers} from 'redux';

function selector(state = {bcsMapId: null, res_category: null, gender: null, religion: ''}, action) {
	switch (action.type) {
		case 'UPDATE_STR_SELECTOR':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function students(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_STR':
			return null;
		case 'LOAD_STR':
			return action.students;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	students,
	meta,
});