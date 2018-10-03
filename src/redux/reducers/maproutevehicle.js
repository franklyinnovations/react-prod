import {combineReducers} from 'redux';

function item (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.rvdhsmap;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'SET_ROUTE_MAP_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				routes: action.routes,
				drivers: action.drivers,
				helpers: action.helpers,
			};
		default:
			return state;
	}
}

function addresses (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.rvdhsmap.addresses;
		case 'UNLOAD_ROUTE_ADDRESSES':
			return false;
		case 'LOADING_ROUTE_ADDRESSES':
			return null;
		case 'SET_ROUTE_ADDRESSES':
			return action.data;
		case 'UPDATE_TIME_VALUE': {
			const nextState = [...state];
			nextState[action.index][action.name] = action.value;
			return nextState;
		}
		default:
			return state;
	}
}

export default combineReducers({
	item,
	errors,
	meta,
	addresses,
});