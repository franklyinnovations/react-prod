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

function classReport (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SAVED_ATT_CR':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_ATT_CR':
			return {
				report: null,
				timetable: action.timetable,
				nameOfClass: action.nameOfClass,
				timetableallocation: action.timetableallocation,
			};
		case 'SET_ATT_CR_CONTENT':
			return state && {
				...state,
				report: action.report,
			};
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
		default:
			return state;
	}
}

export default combineReducers({
	bcsmaps,
	meta,
	weekdays,
	classReport
});