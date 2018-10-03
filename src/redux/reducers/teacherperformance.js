import {combineReducers} from 'redux';

function selector(state = {bcsMapId: null}, action) {
	switch(action.type) {
		case 'UPDATE_TPC_SELECTOR':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
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
	meta,
	selector,
});