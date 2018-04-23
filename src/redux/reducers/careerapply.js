import {combineReducers} from 'redux';

function item(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'REQUEST_SENT_APPLY_POST':
			return {};
		case 'SET_APPLY_FORM_ERROR':
			return action.errors;
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_APPLY_FORM_ERROR':
			return false;
		case 'REQUEST_SENT_APPLY_POST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	item,
	errors,
	saving
});

export default reducer;