import {combineReducers} from 'redux';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_HOLIDAY_DATA':
			return {};
		case 'SET_HOLIDAY_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'ADD_HOLIDAY_SUCCESS':
		case 'DELETE_HOLIDAY_SUCCESS':
			return false;
		case 'SET_HOLIDAY_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'ADD_HOLIDAY_SUCCESS':
		case 'DELETE_HOLIDAY_SUCCESS':
			return false;
		case 'SEND_HOLIDAY_ADD_REQUEST':
		case 'SEND_HOLIDAY_REMOVE_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	item,
	saving,
});

export default reducer;