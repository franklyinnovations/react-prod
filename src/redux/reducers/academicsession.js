import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(academicsession => {
				if (academicsession.id === itemId)
					academicsession.is_active = parseInt(action.status);
				return academicsession;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_ACADEMICSESSION':
		case 'SET_ACADEMICSESSION_EDIT_DATA':
			return {};
		case 'SET_ERRORS_ACADEMICSESSION':
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
		case 'START_ADD_ACADEMICSESSION':
			return {
				name: '',
				start_date: '',
				end_date: '',
				is_active: 1,
			};
		case 'SET_ACADEMICSESSION_EDIT_DATA':
			return action.data;
		case 'START_ACADEMICSESSION_EDIT':
			return null;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
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