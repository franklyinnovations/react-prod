import {combineReducers} from 'redux';

function selector (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				name: '',
				bcsMapId: null,
				enrollment_no: '',
			};
		case 'UPDATE_MYS_SELECTOR':
			return {...state, [action.name]: action.value};
		default:
			return state;
	}
}

function students (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_MYS_STUDENTS':
			return null;
		case 'LOAD_MYS_STUDENTS':
			return action.data;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {bcsmaps: action.bcsmaps};
		default:
			return state;
	}
}

export default combineReducers({
	meta,
	selector,
	students,
});
