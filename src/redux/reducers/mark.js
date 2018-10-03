import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_MARK_LIST':
			return 'LIST';
		case 'START_ADD_MARK':
			return 'ADD_DATA';
		case 'EDIT_MARK':
			return 'EDIT_DATA';
		case 'VIEW_MARK':
			return 'VIEW_DATA';
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

const defaultSelector = {
	examScheduleId: null,
	sectionId: null,
	subjects: [],
	loadingExamSchedules: true,
	loadingSections: false,
	loadingSubjects: false,
	selected: null,
};

function selector(state = {...defaultSelector}, action) {
	switch(action.type) {
		case 'LOADING_MRK_FORM_DATA':
			return {...defaultSelector};
		case 'START_ADD_MARK':
			return {...state, loadingExamSchedules: false};
		case 'EDIT_MARK':
		case 'VIEW_MARK':
			return {
				examScheduleId: action.examScheduleId,
				sectionId: action.bcsMapId,
				subjects: [],
				loadingExamSchedules: false,
				loadingSections: false,
				loadingSubjects: false,
				selected: {
					examScheduleId: action.examScheduleId,
					bcsMapId: action.bcsMapId,
				},
			};
		case 'RESET_EXAM_SCHEDULE':
			return {
				...defaultSelector,
				loadingExamSchedules: false,
			};
		case 'SET_MARK_EXAM_SCHEDULE':
			return {
				...state,
				loadingExamSchedules: false,
				loadingSections: true,
				sectionId: null,
				subjects: [],
				examScheduleId: action.examScheduleId,
			};
		case 'LOAD_MARKS_SECTIONS':
			return {
				...state,
				loadingSections: false,
				sectionId: null,
				subjects: [],
			};
		case 'RESET_MARK_SECTION':
			return {
				...state,
				sectionId: null,
				subjects: []
			};
		case 'SET_MARK_SECTION':
			return {
				...state,
				sectionId: action.bcsMapId,
				subjects: [],
				loadingSubjects: true,
			};
		case 'LOAD_MARKS_SUBJECTS':
			return {
				...state,
				subjects: [],
				loadingSubjects: false
			};
		case 'UPDATE_MRK_SUBJECTS':
			return {
				...state,
				subjects: action.value
			};
		case 'LOAD_MARK_STUDENTS':
			return {
				...state,
				selected: action.selected,
			};
		default:
			return state;
	}
}

function students(state = false, action) {
	switch(action.type) {
		case 'START_ADD_MARK':
		case 'EDIT_MARK':
		case 'VIEW_MARK':
			return false;
		case 'LOADING_MARKS_STUDENTS':
			return null;
		case 'LOAD_MARK_STUDENTS':
			return action.students;
		case 'UPDATE_SUBJECT_MARK': {
			let _state = [...state];
			_state[action.student].markrecords[action.markrecord].obtained_mark = action.value;
			return _state;
		}
		case 'UPDATE_SUBJECT_CATEGORY_MARK': {
			let _state = [...state];
			if (action.value === 'A') {
				let subjectcategory_marks = _state[action.student]
					.markrecords[action.markrecord].subjectcategory_marks;
				for (let k in subjectcategory_marks)
					subjectcategory_marks[k] = 'A';
			} else {
				_state[action.student].markrecords[action.markrecord]
					.subjectcategory_marks['s' + action.escId] = action.value;
			}
			return _state;
		}
		case 'SET_MARK_TAGS': {
			let _state = [...state];
			_state[action.student].markrecords[action.markrecord].tags = action.value;
			return _state;
		}
		case 'REMOVE_MARK_TAG': {
			let _state = [...state],
				tags = _state[action.student].markrecords[action.markrecord].tags.split(',');
			tags.splice(tags.indexOf(action.value), 1);
			_state[action.student].markrecords[action.markrecord].tags = tags.join(',') || null;
			return _state;
		}
		case 'SET_CSV_IMPORT_DATA': {
			let cursor = 0;
			return state.map(student => {
				let markrecords = student.markrecords;
				for (let i = 0; i < markrecords.length && i < action.markrecords.length; i++) {
					markrecords[i].obtained_mark = action.markrecords[cursor].obtained_mark;
					markrecords[i].subjectcategory_marks = 
						action.markrecords[cursor++].subjectcategory_marks;
				}
				return student;
			});
		}
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps
			};
		case 'START_ADD_MARK':
			return {
				...state,
				examSchedules: action.examSchedules,
				tags: action.tags,
				tagMap: action.tagMap,
				sections: [],
				subjects: action.examscheduledetails,
			};
		case 'EDIT_MARK':
		case 'VIEW_MARK':
			return {
				...state,
				examSchedules: action.examSchedules,
				tags: action.tags,
				tagMap: action.tagMap,
				sections: [{label: action.bcsmap, value: action.bcsMapId}],
				subjects: action.examscheduledetails,
			};
		case 'RESET_EXAM_SCHEDULE':
			return {
				...state,
				sections: null,
				subjects: null,
			};
		case 'SET_MARK_EXAM_SCHEDULE':
			return {
				...state,
				sections: null,
				subjects: []
			};
		case 'LOAD_MARKS_SECTIONS':
			return {
				...state,
				sections: action.bcsmaps,
				subjects: [],
			};
		case 'RESET_MARK_SECTION':
			return {
				...state,
				subjects: null,
			};
		case 'SET_MARK_SECTION':
			return {
				...state,
				subjects: [],
			};
		case 'LOAD_MARKS_SUBJECTS':
			return {
				...state,
				subjects: action.examscheduledetails,
			};
		case 'LOAD_MARK_STUDENTS':
			return {
				...state,
				marks: action.marks
			};
		default:
			return state;
	}
}

function tag(state = {student: null, markrecord: null, selected: null}, action) {
	switch(action.type) {
		case 'MARK_SHOW_TAG_POP':
			return {
				...state,
				student: action.student,
				markrecord: action.markrecord,
				selected: action.value,
			};
		case 'SET_MARK_TAGS':
			return {
				...state,
				selected: action.value
			};
		case 'HIDE_TAG_POPUP':
			return {
				student: null, markrecord: null, selected: null
			};
		default:
			return state;
	}
}

function errors(state = [], action) {
	switch (action.type) {
		case 'SHOW_MARK_ERRORS':
			return action.errors;
		case 'LOAD_MARK_STUDENTS':
		case 'SEND_MARK_SAVE_REQUEST':
			return [];
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SEND_MARK_SAVE_REQUEST':
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
	selector,
	students,
	tag,
	meta,
	errors,
	saving,
	query,
	filters,
	pageInfo,
});