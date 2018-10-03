import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ACTIVITY_MARK_LIST':
			return 'LIST';
		case 'START_ADD_ACTIVITY_MARK':
			return 'ADD';
		case 'EDIT_AM':
			return 'EDIT';
		case 'VIEW_AM':
			return 'VIEW';
		default:
			return state;
	}
}

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps
			};
		case 'START_ADD_ACTIVITY_MARK':
			return {
				...state,
				examSchedules: action.examSchedules,
			};
		case 'LOAD_AM_ACTIVITIES_SECTIONS':
			return {
				...state,
				activities: action.activities,
				sections: action.sections,
			};
		case 'SET_AM_MARK_EXAM_SCHEDULE':
			return {
				...state,
				activities: [],
				sections: [],
			};
		case 'LOAD_AM_STUDENTS':
			return {
				...state,
				subActivities: action.subActivities,
				activitymarks: action.activitymarks,
				superActivities: action.superActivities,
				activityschedules: action.activityschedules,
			};
		case 'VIEW_AM':
		case 'EDIT_AM':
			return {
				...state,
				examSchedules: action.examschedules,
				sections: [{label: action.bcsmap, value: action.bcsMapId}],
				activities: action.activities,
			};
		default:
			return state;
	}
}

const defaultSelector = {
	examSchedule: null,
	sectionId: null,
	activities: [],
	loading: false,
	selected: null,
};
function selector(state = {...defaultSelector}, action) {
	switch(action.type) {
		case 'START_ADD_ACTIVITY_MARK':
			return {...defaultSelector};
		case 'UPDATE_ACTIVITY_MARK_SELECTOR':
			return {
				...state,
				[action.name]: action.value
			};
		case 'SET_AM_MARK_EXAM_SCHEDULE':
			return {
				...state,
				loading: true,
				activities: [],
				sectionId: null,
				examSchedule: action.examSchedule,
			};
		case 'LOAD_AM_ACTIVITIES_SECTIONS':
			return {
				...state,
				loading: false
			};
		case 'LOAD_AM_STUDENTS':
			return {
				...state,
				selected: {
					bcsMapId: action.bcsMapId,
				}
			};
		case 'EDIT_AM':
		case 'VIEW_AM':
			return {
				examSchedule: action.examschedule,
				sectionId: action.bcsMapId,
				activities: [],
				loading: false,
				selected: {
					bcsMapId: action.bcsMapId,
				},
			};
		default:
			return state;
	}
}

function students(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_ACTIVITY_MARK':
		case 'EDIT_AM':
		case 'VIEW_AM':
			return false;
		case 'LOADING_AM_STUDENTS':
			return null;
		case 'LOAD_AM_STUDENTS':
			return action.students;
		case 'UPDATE_ACTIVITY_MARK': {
			let _state = [...state];
			_state[action.student].marks[action.activity].value = action.value;
			return _state;
		}
		case 'SET_AM_CSV_IMPORT_DATA':
			return state.map((student, index) => {
				let marks = action.markrecords[index];
				for (let k in action.markrecords[index]) {
					student.marks[k].value = marks[k];
				}
				return student;
			});
		default:
			return state;
	}
}

function errors(state = [], action) {
	switch (action.type) {
		case 'SHOW_AM_ERRORS':
			return action.errors;
		case 'LOAD_AM_STUDENTS':
		case 'SEND_AM_SAVE_REQUEST':
			return [];
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SEND_AM_SAVE_REQUEST':
			return true;
		case 'INIT_MODULE':
			return false;
		default:
			return state;
	}
}

export default combineReducers({
	viewState,
	items,
	meta,
	selector,
	students,
	errors,
	saving,
	query,
	filters,
	pageInfo,
});
