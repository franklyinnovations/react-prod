import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_USER_STATUS': {
			let id = parseInt(action.id);
			return state.map(item => {
				if (item.id === id)
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
		case 'START_ADD_USER':
		case 'START_USER_EDIT':
			return {};
		case 'SET_USER_ERRORS':
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
		case 'START_ADD_USER':
			return {
				id: '',
				detailId: '',
				salutation: null,
				'user_detail[fullname]': '',
				roleId: null,
				email: '',
				mobile: '',
				alternate_mobile: '',
				password: '',
				confirm_password: '',
				is_active: true
			};
		case 'START_USER_EDIT':
			return null;
		case 'SET_USER_EDIT_DATA':
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

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				roles: action.roles,
			};
		case 'SET_USER_EDIT_DATA':
		case 'START_ADD_USER':
			return {
				...state,
				roles: action.roles,
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