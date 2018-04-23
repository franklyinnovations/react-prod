import {combineReducers} from 'redux';

function item(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data;
		default:
			return state;
	}
}

const reducer = combineReducers({
	item,
});

export default reducer;