import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS': {
			let itemId = parseInt(action.itemId);
			return state.map(curriculum => {
				if (curriculum.id === itemId)
					curriculum.is_active = parseInt(action.status);
				return curriculum;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_CURRICULUM':
		case 'START_CURRICULUM_EDIT':
			return {};
		case 'SET_CURRICULUM_ERRORS':
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
		case 'START_ADD_CURRICULUM':
			return {
				display_order: '',
				name: '',
				alias: '',
				is_active: true,
			};
		case 'START_CURRICULUM_EDIT':
			return null;
		case 'SET_CURRICULUM_EDIT_DATA':
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

const reducer = combineReducers({
	errors,
	items,
	item,

	pageInfo,
	filters,
	query,
});

export default reducer;