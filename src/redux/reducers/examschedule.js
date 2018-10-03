import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';


function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_EXAMSCHEDULE_LIST':
			return 'LIST';
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function items (state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_EXAMSCHEDULE_STATUS':
			itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		case 'SEND_EXAM_NOTIFICATION_REQUEST':
			itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					item.sendingNotification = true;
				return item;
			});
		case 'SET_EXAM_NOTIFICATION_RESPONSE':
			itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					delete item.sendingNotification;
				return item;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
		case 'EDIT_EXAM_DETAIL':
		case 'EXAM_DETAIL_ADDED':
		case 'EXAM_DETAIL_UPDATED':
		case 'SET_EXAM_SUB_ACTIVITIES':
		case 'RESET_SUB_ACTIVITIES':
		case 'EXAM_ACTIVITY_ADDED':
		case 'SAVED_EXAM_CATEGORY':
		case 'EXAM_SCHEDULE_SAVED':
		case 'LOAD_EXAM_SCHEDULE_DATA':
		case 'GET_CATEGORIES':
		case 'CANCEL_EXAM_DETAIL_EDIT':
		case 'SEND_SAVE_EXAM_ACTIVITY_REQUEST':
			return {};
		case 'SET_EXAMSCHEDULE_SAVE_ERRORS':
		case 'SET_EXAMS_DETAIL_SAVE_ERRORS':
		case 'SET_EXAM_ACTIVITY_SAVE_ERRORS':
		case 'SET_CATEGORY_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'LOADING_EXAMSCHEDULE_FORM_DATA':
			return null;
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
			return action.data;
		case 'LOAD_EXAM_SCHEDULE_DATA': {
			let data = action.data;
			return data ?  {
				id: data.id,
				is_active: data.is_active,
				has_activity: data.has_activity,
				examheadId: state.examheadId,
				examscheduledetails: data.examscheduledetails,
				activityschedules: data.activityschedules,
				boardId: state.boardId,
				classId: state.classId,
				dirty: false,
				loadingSubActivities: false,
				subActivities: [],
				subjects: state.subjects,
			} : {
				...state,
				id: '',
				examscheduledetails: [],
				activityschedules: [],
				dirty: false
			};
		}
		case 'RESET_EXAM_SCHEDULE_CLASS':
			return {
				...state,
				id: '',
				examscheduledetails: [],
				activityschedules: [],
				boardId: '',
				classId: '',
				loadingSubjects: false,
				subjects: [],
				loadingSubActivities: false,
				subActivities: [],
			};
		case 'RESET_EXAM_SCHEDULE_EXAM':
			return {
				...state,
				id: '',
				examscheduledetails: [],
				activityschedules: [],
				examheadId: null,
				loadingSubjects: false,
				subjects: [],
				loadingSubActivities: false,
				subActivities: [],
			};
		case 'UPDATE_EXAMSCHEDULE_DATA':
			if (action.name === 'cIds') {
				let [boardId, classId] = action.value.split('-');
				return {
					...state,
					boardId,
					classId,
				};
			}
			return {
				...state,
				[action.name]: action.value
			};
		case 'LOAD_EXAM_SCHEDULE':
			return {
				...state,
				dirty: true,
				boardId: action.boardId,
				classId: action.classId,
				examheadId: action.examheadId,
				loadingSubjects: true,
				subjects: [],
			};
		case 'LOAD_EXAM_SUBJECTS':
			return {
				...state,
				loadingSubjects: false,
				subjects: action.data
			};
		case 'EXAM_DETAIL_ADDED':
			return {
				...state,
				examscheduledetails: [...state.examscheduledetails, action.data],
			};
		case 'EXAM_DETAIL_UPDATED': {
			let itemId = action.data.id;
			return {
				...state,
				examscheduledetails: state.examscheduledetails.map(
					item => itemId === item.id ? action.data : item
				)
			};
		}
		case 'REMOVE_EXAM_DETAIL_SUCCEED': {
			let itemId = parseInt(action.id);
			return {
				...state,
				examscheduledetails: state.examscheduledetails.filter(
					item => item.id !== itemId
				)
			};
		}
		case 'SEND_REMOVE_EXAM_DETAIL_REQUEST':
		case 'REMOVE_EXAM_DETAIL_FAILED': {
			let itemId = parseInt(action.id);
			return {
				...state,
				examscheduledetails: state.examscheduledetails.map(item => {
					if (item.id === itemId) {
						if (action.type === 'SEND_REMOVE_EXAM_DETAIL_REQUEST')
							item.removing = true;
						else
							delete item.removing;
					}
					return item;
				})
			};
		}
		case 'SEND_SAVE_EXAM_ACTIVITY_REQUEST': 
			return {
				...state,
				savingActivtySchedule: true,
			};
		case 'EXAM_ACTIVITY_EXISTS_ERROR':
			return {
				...state,
				savingActivtySchedule: false,
			};
		case 'EXAM_ACTIVITY_ADDED':
			return {
				...state,
				activityschedules: [...state.activityschedules, action.data],
				loadingSubActivities: false,
				subActivities: [],
				savingActivtySchedule: false,
			};
		case 'REMOVE_EXAM_ACTIVITY_SUCCEED': {
			let itemId = parseInt(action.id);
			return {
				...state,
				activityschedules: state.activityschedules.filter(
					item => (item.id !== itemId && item.activity.superActivityId !== action.activityId)
				)
			};
		}
		case 'SEND_REMOVE_EXAM_ACTIVITY_REQUEST':
		case 'REMOVE_EXAM_ACTIVITY_FAILED': {
			let itemId = parseInt(action.id);
			return {
				...state,
				activityschedules: state.activityschedules.map(item => {
					if (item.id === itemId) {
						if (action.type === 'SEND_REMOVE_EXAM_ACTIVITY_REQUEST')
							item.removing = true;
						else
							delete item.removing;
					}
					return item;
				})
			};
		}
		case 'LOAD_EXAM_SUB_ACTIVITIES':
			return {
				...state,
				loadingSubActivities: true,
				subActivities: []
			};
		case 'SET_EXAM_SUB_ACTIVITIES':
			return {
				...state,
				subActivities: action.data,
				loadingSubActivities: false,
			};
		case 'RESET_SUB_ACTIVITIES':
			return {
				...state,
				loadingSubActivities: false,
				subActivities: [],
			};
		case 'EXAM_SCHEDULE_SAVED':
			return state.id ? state: {
				...state,
				id: action.data.data.id
			};
		default:
			return state;
	}
}

function examscheduledetails(state = false, action) {
	switch(action.type) {
		case 'LOADING_EXAM_SCHEDULE':
			return null;
		case 'SHOW_EXAMSCHEDULE':
			return action.data;
		case 'HIDE_EXAMSCHEDULE':
			return false;
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_EXAMSCHEDULE_SAVE_ERRORS':
		case 'EXAM_SCHEDULE_SAVED':
			return false;
		case 'SEND_SAVE_EXAMSCHEDULE_REQUEST':
			return true;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				boards: action.boards,
				allClasses: action.classes,
			};
		case 'START_ADD_EXAMSCHEDULE':
		case 'SET_EXAMSCHEDULE_DATA':
			return {
				...state,
				classes: action.classes,
				examheads: action.examheads,
				activities: action.activities,
			};
		default:
			return state;
	}
}

const defaultExamScheduleDetail = {
	id: '',
	subjectId: null,
	exam_type: null,
	date: null,
	start_time: '',
	end_time: '',
	max_mark: '',
	min_passing_mark: '',
};

function examscheduledetail(state = {...defaultExamScheduleDetail}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_EXAMSCHEDULE':
		case 'CANCEL_EXAM_DETAIL_EDIT':
		case 'EXAM_DETAIL_ADDED':
		case 'EXAM_DETAIL_UPDATED':
		case 'LOAD_EXAM_SCHEDULE':
			return {...defaultExamScheduleDetail};
		case 'UPDATE_EXAM_DETAIL_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'EDIT_EXAM_DETAIL':
			return action.data;
		default:
			return state;
	}
}

const defaultActivitySchedule = {
	activityId: '',
	max_marks: '',
	date:null,
	subActivityMarks: [],
	exists: false,
};

function activityschedule(state = {...defaultActivitySchedule}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_EXAMSCHEDULE':
		case 'EXAM_ACTIVITY_ADDED':
			return {...defaultActivitySchedule};
		case 'UPDATE_EXAM_ACTIVITY_DATA':
			return {
				...state,
				[action.name]: action.value
			};
		case 'LOAD_EXAM_SUB_ACTIVITIES':
			return {
				...state,
				activityId: action.id,
			};
		case 'RESET_SUB_ACTIVITIES':
			return {
				...state,
				activityId: '',
				date: null,
				subActivityMarks: [],
			};
		case 'SET_EXAM_SUB_ACTIVITIES':
			return {
				...state,
				subActivityMarks: action.data.map(() => '')
			};
		case 'UPDATE_SUBACTIVITY_MARK':
			state.subActivityMarks[action.index] = action.value;
			return {...state};
		case 'EXAM_ACTIVITY_EXISTS_ERROR':
			return {
				...state,
				exists: true,
			};
		default:
			return state;
	}
}

function category(state = false, action) {
	switch(action.type) {
		case 'GET_CATEGORIES':
			return null;
		case 'SET_CATEGORIES':
			return {
				delSubCatIds: [],
				subjectcategories: action.data.subjectcategory.map(item => ({
					label: item.subjectcategorydetails[0].name,
					value: item.id
				})),
				examschedulesubjectcategory: action.data.examschedulesubjectcategory,
				examscheduledetail: action.data.examscheduledetail,
				marks: action.data.examschedulesubjectcategory.reduce((marks, item) => {
					marks[item.subjectCategoryId] = item.max_marks;
					return marks;
				}, {})
			};
		case 'HIDE_CATEGORIES':
		case 'SAVED_EXAM_CATEGORY':
			return false;
		case 'SEND_SUBCAT_DELETE_REQUEST': {
			let itemId = parseInt(action.subjectCategoryId),
				delId = parseInt(action.id);
			return {
				...state,
				examschedulesubjectcategory: state.examschedulesubjectcategory.filter(
					item => item.subjectCategoryId !== itemId
				),
				delSubCatIds: (state.delSubCatIds.push(delId), state.delSubCatIds),
				marks: {
					...state.marks,
					[action.subjectCategoryId]: undefined,
				},
			};
		}
		case 'UPDATE_EXAM_CATEGORY_MARK':
			return {
				...state,
				marks: {
					...state.marks,
					[action.subjectCategoryId]: action.value
				}
			};
		case 'ADD_EXAM_CATEGORY':
			return {
				...state,
				marks: {
					...state.marks,
					[action.data.subjectCategoryId]: ''
				},
				examschedulesubjectcategory: [
					...state.examschedulesubjectcategory,
					action.data
				]
			};
		default:
			return state;
	}  
}

export default combineReducers({
	viewState,
	items,
	errors,
	item,
	saving,
	meta,
	examscheduledetails,
	examscheduledetail,
	activityschedule,
	category,
	query,
	filters,
	pageInfo,
});