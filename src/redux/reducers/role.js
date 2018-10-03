import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ROLE_STATUS': {
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
		case 'START_ADD_ROLE':
		case 'START_ROLE_EDIT':
			return {};
		case 'SET_ROLE_ERRORS':
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
		case 'START_ADD_ROLE':
			return {
				name: '',
				is_active: 1,
				permissionIds: {},
			};
		case 'START_ROLE_EDIT':
			return null;
		case 'SET_ROLE_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'ADD_ROLE_PERMISSION': {
			for (let i = action.ids.length - 1; i >= 0; i--) {
				state.permissionIds[action.ids[i]] = true;
			}
			return {...state};
		}
		case 'REMOVE_ROLE_PERMISSION': {
			for (let i = action.ids.length - 1; i >= 0; i--) {
				delete state.permissionIds[action.ids[i]];
			}
			return {...state};
		}
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'START_ADD_ROLE':
		case 'SET_ROLE_EDIT_DATA':
			return {
				filter: '',
				permissions: action.permissions,
			};
		case 'UPDATE_ROLE_MODULE_FITLER':
			return {
				...state,
				filter: action.value,
				permissions: action.permissions,
			};
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
});

export default reducer;