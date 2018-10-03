import {combineReducers} from 'redux';

function results (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'START_SII_UPLOAD':
			return null;
		case 'SII_UPLOAD_DONE':
			return action.result.status ? action.result.results : false;
		default:
			return state;
	}
}

export default combineReducers({
	results,
});