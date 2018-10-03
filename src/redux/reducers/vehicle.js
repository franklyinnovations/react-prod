import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_VEHICLE_STATUS': {
			return state.map(item => {
				if (item.id === action.id)
					item.is_active = parseInt(action.status);
				return item;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_VEHICLE':
		case 'START_VEHICLE_EDIT':
			return {};
		case 'SET_VEHICLE_ERRORS':
		case 'SET_ROUTE_MAP_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'INIT_MODULE_NEXT':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;	
		case 'START_VEHICLE_EDIT':
			return null;
		case 'START_ADD_VEHICLE':
		case 'SET_VEHICLE_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function itemNext (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE_NEXT':
			return action.rvdhsmap;
		case 'SAVED_ROUTE_VEHICLE_MAP':
		case 'MAP_ROUTE_SKIP':
		case 'HIDE_NEXT_DATA_MODAL':
			return false;	
		case 'UPDATE_DATA_VALUE_NEXT':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				infrastructures: action.data.infrastructures,
			};
		case 'INIT_MODULE_NEXT':
			return {
				routes: action.routes,
				drivers: action.drivers,
				helpers: action.helpers,
				vehicleId: action.vehicleId
			};	
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'SET_VEHICLE_ERRORS':
		case 'START_MAP_ROUTE':
			return false;
		case 'SAVING_VEHICLE':
			return true;
		default:
			return state;
	}
}

function addresses (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE_NEXT':
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

const reducer = combineReducers({
	errors,
	items,
	item,
	meta,

	pageInfo,
	filters,
	query,
	saving,
	itemNext,
	addresses
});

export default reducer;