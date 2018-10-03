import {combineReducers} from 'redux';

function selector(state = {bcsMapId: null}, action) {
	switch(action.type) {
		case 'UPDATE_GST_CLASS':
			return {
				...state,
				bcsMapId: action.bcsMapId
			};
		default:
			return state;
	}
}

function chart (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'UPDATE_GST_CLASS':
			return {};
		case 'SET_GST_DATA':
			return {
				grades: action.grades,
				merit: action.merit,
				attendance: action.attendance,
				exams: action.exams,
			};
		case 'UPDATE_GST_SUBJECT':
			return {
				...state,
				exams: action.exams,
			};
		default:
			return state;
	}
}

function meta(state = {marks: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		case 'UPDATE_GST_CLASS':
			return {
				...state,
				marks: null,
				students: null,
			};
		case 'SET_GST_DATA':
			return {
				...state,
				marks: action.marks,
				students: action.students,
				institute: action.institute,
				timetable: action.timetable,
				subjects: action.subjects,
				subject: 0,
				studentsData: action.studentsData,
			};
		case 'UPDATE_GST_SUBJECT':
			return {
				...state,
				subject: action.subject,
			};
		default:
			return state;
	}
}

export default combineReducers({
	meta,
	chart,
	selector,
});