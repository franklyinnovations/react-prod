import {combineReducers} from 'redux';

function bcsmaps (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_ATT_BCSMAPS':
			return null;
		case 'LOAD_ATT_BCSMAPS':
			return action.data;
		default:
			return state;
	}
}

function weekdays (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_ATT_WEEKLY':
			return null;
		case 'LOAD_ATT_WEEKLY':
			return action.data;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE_SYNC':
			return {
				date: action.date,
				day: action.weekday,
			};
		case 'SET_ATT_DATE':
			return {
				...state,
				day: action.day,
				date: action.date,
			};
		case 'RESET_ATT_DATE':
			return {
				...state,
				day: null,
				date: null,
			};
		case 'LOAD_ATT_WEEKLY':	
			return {
				date: action.date,
				day: action.weekday,
				classteacher: action.classteacher,
				studentclass: action.studentclass,
				timetableId: action.timetableId
			};
		default:
			return state;
	}
}

export default combineReducers({
	bcsmaps,
	meta,
	weekdays,
});