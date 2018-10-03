import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';
import { getColumnColor } from '../../utils';
const weekdaysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_TIMETABLE_LIST':
			return 'LIST';
		case 'START_ADD_TIMETABLE':
			return 'DATA_FORM';
		case 'SET_TIMETABLE_EDIT_DATA':
			return 'EDIT_FORM';
		default:
			return state;
	}	
}

function items(state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_TIMETABLE_STATUS':
			itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		case 'DELETE_TIMETABLE_SUCCESS':
			itemId = parseInt(action.itemId);
			return state.filter(item => item.id !== itemId);
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_TIMETABLE':
		case 'SET_TIMETABLE_EDIT_DATA':
		case 'SHOW_EDIT_MODAL':
		case 'SHOW_TEACHER_MODAL':
			return {};
		case 'SET_TIMETABLE_SAVE_ERRORS':
		case 'SET_ASSIGN_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultItem = {
	'id': '',
	'academicSessionId': '',
	'bcsMapId': '',
	'classteacherId': '',
	'weekday': [],
	'period_no': '',
	'start_time': '',
	'countRow': 0,
};

function item(state = defaultItem, action) {
	switch(action.type) {
		case 'START_ADD_TIMETABLE':
			return defaultItem;
		case 'START_ADDING'	:
			return null;
		case 'SET_TIMETABLE_EDIT_DATA':
			return {
				timetableData: action.data.data,
				timetableallocations: makeTimetableallocations(action.data.data),
				weekdays: weekdaysArr,
				countRow: 0,
			};
		case 'UPDATE_TIMETABLE_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		}
		case 'SUCCESS_ASSIGN_SAVE':
			return {
				...state,
				countRow: 0,
				timetableallocations: makeTimetableallocations(action.data.timetableallocations),
			};
		case 'SHOW_TEACHER_MODAL':
			return {
				...state,
				classteacherId: '',
			};
		case 'SET_TEACHER_MODAL_DATA':
			return {
				...state,
				classteacherId: parseInt(action.teacherId),
			};
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				classteacherId: '',
			};
		default:
			return {
				...state,
				countRow: 0
			};
	}
}

function makeTimetableallocations(data){
	var timetableAllocation =[];
	if(data.timetableallocations){
		weekdaysArr.forEach(function(weekday){
			timetableAllocation[weekday] = [];
			data.timetableallocations.forEach(function(item){
				if (item.weekday == weekday) {
					item.color = getColumnColor();
					timetableAllocation[weekday].push(item);
				}
			});
		});
	}
	return timetableAllocation;
}

const defaultHelperData = {
	bcsmaps: [],
	classTeachers:[],
	showTeacherModal: false,
	timeShiftModal: false,
	loadingIcon:false,
	subjects:[],
	tags: [],
	timetableId: '',
	addTimeTableModel: false,

};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD_TIMETABLE':
			return {
				...defaultHelperData,
				bcsmaps:action.data.bcsmaps.data.map(item => ({
					value: item.id,
					label: item.board.boarddetails[0].alias +'-'+item.class.classesdetails[0].name+'-'+item.section.sectiondetails[0].name
				})),
				classTeachers:action.data.teachers.map(item => ({
					value: item.id,
					label: item.user.userdetails[0].fullname
				})),
				addTimeTableModel: true,
			};
		case 'START_ADDING':
			return {
				...state,
				addTimeTableModel: true,
			};	
		case 'SET_TIMETABLE_EDIT_DATA':
			var subjects = [{value:'N/A', label:'N/A'}];
			action.subjects.map(item =>  {
				subjects.push({
					value: item.id,
					label: item.subjectdetails[0].name
				});
			});
			return {
				...defaultHelperData,
				subjects:subjects,
				tags: action.tags
			};
		case 'INIT_MODULE':
			return {
				...defaultHelperData,
				bcsmaps:action.bcsmaps,
			};
		case 'SHOW_TEACHER_MODAL':
			return {
				...state,
				showTeacherModal: true,
				loadingIcon:true,
			};
		case 'SET_TEACHER_MODAL_DATA':
			return {
				...state,
				classTeachers:action.data.data.map(item => ({
					value: item.id,
					label: item.user.userdetails[0].fullname
				})),
				classTeacherId: parseInt(action.teacherId),
				timetableId: parseInt(action.timetableId),
				loadingIcon:false,
			};
		case 'SHOW_TIME_SHIFT_MODAL':
			return {
				...state,
				timeShiftModal: true
			};
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				addTimeTableModel: false,
				showTeacherModal: false,
				timeShiftModal: false,
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SET_TIMETABLE_SAVE_ERRORS':
		case 'INIT_MODULE':
		case 'SUCCESS_ASSIGN_SAVE':
		case 'CLOSE_EDIT_MODAL':
		case 'SET_ASSIGN_ERRORS':
		case 'HIDE_DATA_MODAL':
		case 'SET_TIMETABLE_EDIT_DATA':
			return false;
		case 'SEND_CHANGE_CLASS_TEACHER_REQUEST':
		case 'SEND_ADD_TIMETABLE_REQUEST':
		case 'SEND_TIME_SHIFT_REQUEST':
			return true;
		default:
			return state;
	}
}
const defaultTaData = {
	id: '',
	timetableId: '',
	start_time: '',
	end_time: '',
	subjectId: 'N/A',
	teacherId: 'N/A',
	selectedTeacherId: 'N/A',
	weekday: '',
	is_break: 0,
	tagId: '',
	icon: 'fa-utensils',
	teachers: [],
	showEditModal: false,
	loadingIcon: false,
	loadingTeacher:false
};
function taEdit(state = defaultTaData, action) {
	switch(action.type) {
		case 'SHOW_EDIT_MODAL':
			return {
				...defaultTaData,
				showEditModal:true,
				loadingIcon: true
			};
		case 'SET_EDIT_MODAL_DATA': 
			return {
				...state,
				id: action.itemId,
				timetableId: action.timetableId,
				start_time: action.start_time,
				end_time: action.end_time,
				subjectId: action.subjectId !== 'N/A' ? parseInt(action.subjectId):action.subjectId,
				teacherId: action.teacherId !== 'N/A' ? parseInt(action.teacherId):action.teacherId,
				selectedTeacherId: action.teacherId !== 'N/A' ? parseInt(action.teacherId):action.teacherId,
				weekday: action.weekday,
				is_break: action.is_break,
				tagId: action.tagId,
				icon: action.icon  ? action.icon:'fa-utensils',
				loadingIcon: false,
				teachers: subjectTeachers(action.data.data),
			};
		case 'LOAD_SUBJECT_TEACHERS':
			return {
				...state,
				teacherId: 'N/A',
				loadingTeacher: true
			};
		case 'SET_SUBJECT_TEACHERS':
			return {
				...state,
				teachers: subjectTeachers(action.data.data),
				loadingTeacher: false
			};
		case 'UPDATE_EDIT_TIMETABLE_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			if(action.name === 'start_time' || action.name === 'end_time'){
				newState['subjectId'] = 'N/A';
				newState['teacherId'] = 'N/A';
				newState['selectedTeacherId'] =  'N/A';
			}
			if(action.name === 'subjectId' && !action.value){
				newState['subjectId'] = 'N/A';
				newState['teacherId'] = 'N/A';
			}
			if(action.name === 'teacherId' && !action.value){
				newState['teacherId'] = 'N/A';	
			}

			if(action.name === 'is_break'){
				newState['subjectId'] = 'N/A';
				newState['teacherId'] = 'N/A';
			}
			return newState;
		}
		case 'SUCCESS_ASSIGN_SAVE':
		case 'CLOSE_EDIT_MODAL':
			return defaultTaData;
		default:
			return state;
	}
}

function subjectTeachers(data) {
	var teachers = [{value:'N/A', label:'N/A'}];
	data.map(item =>  {
		teachers.push({
			value: item.teacher.id,
			label: item.teacher.user.userdetails[0].fullname
		});
	});
	return teachers;
}

const reducer = combineReducers({
	viewState,
	items,
	errors,
	item,
	saving,
	helperData,
	taEdit,

	pageInfo,
	filters,
	query,
});

export default reducer;