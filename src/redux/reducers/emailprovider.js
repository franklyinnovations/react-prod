import {combineReducers} from 'redux';
import {query, filters} from './common';

function items (state = [], action) {
	let id;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data;
		case 'SEND_EMAIL_PROVIDER_ACTIVATION_REQUEST':
			id = parseInt(action.id);
			return state.map(item => {
				if (item.id === id)
					item.is_active = -1;
				return item;
			});
		case 'CHANGE_EMAIL_PROVIDER':
			id = parseInt(action.id);
			return state.map(item => {
				if (item.id === id)
					item.is_active = 1;
				else
					item.is_active = 0;
				return item;
			});
		default:
			return state;
	}
}


export default combineReducers({
	items,
	filters,
	query,
});