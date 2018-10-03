import {combineReducers} from 'redux';

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_VTK_TRIP':
			return null;
		case 'LOAD_VTK_TRIP':
			return action.data;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				trips: action.trips,
				rvdhsmaps: action.rvdhsmaps,
			};
		default:
			return state;
	}
}

export default combineReducers({
	item,
	meta,
});