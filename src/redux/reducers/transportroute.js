import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';


function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_TR_STATUS':
			return state.map(item => {
				if (item.id === action.id)
					item.is_active = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_TR':
		case 'SET_TR_EDIT_DATA':
			return {};
		case 'SET_TR_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_TR_EDIT':
			return null;
		case 'START_ADD_TR':
		case 'SET_TR_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'ADD_TR_ADDRESS':
			return {
				...state,
				routeaddresses: [...state.routeaddresses, action.routeaddress],
			};
		case 'UPDATE_TR_ADDRESS_ORDER': {
			if (action.oldIndex === action.newIndex) return state;
			let newState = {...state, routeaddresses: [...state.routeaddresses]};
			newState.routeaddresses.splice(
				action.newIndex, 0,
				newState.routeaddresses.splice(action.oldIndex, 1)[0]
			);
			newState.routeaddresses.forEach((item, index) => item.position = index);
			return newState;
		}
		case 'REMOVE_TR_ADDRESS_REQUEST':
			return {
				...state,
				addressIndex: action.index
			};
		case 'INVALID_REMOVE_TR_ADDRESS':
			return {
				...state,
				addressIndex: '',
			};
		case 'REMOVE_TR_ADDRESS': {
			let newState = {...state, routeaddresses: [...state.routeaddresses]};
			newState.addressIndex = '';
			newState.routeaddresses.splice(action.index, 1);
			newState.routeaddresses.forEach((item, index) => item.position = index);
			return newState;
		}
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	item,

	pageInfo,
	filters,
	query,
});

export default reducer;