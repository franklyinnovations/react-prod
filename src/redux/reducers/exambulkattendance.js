import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

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
				bcsmaps1: action.bcsmaps
			};
		case 'START_ADD_EXAM_BULK_ATT':
			return {
				...state,
				bcsmaps: action.bcsmaps,
				months: action.months,
			};
		case 'SET_EBA_EDIT_DATA':
			return {
				...state,
				months: action.months,
			};
		case 'RESET_EBA_CLASS':
			return {
				...state,
				availableExamHeads: [],
				loadingAvailableExamHeads: false,
			};
		case 'LOAD_AVAILABLE_EXAM_HEADS':
			return {
				...state,
				availableExamHeads: [],
				loadingAvailableExamHeads: true,
			};
		case 'SET_AVAILABLE_EXAM_HEADS':
			return {
				...state,
				availableExamHeads: action.data.map(item => ({
					label: item.examhead.examheaddetails[0].name,
					value: item.examhead.id
				})),
				loadingAvailableExamHeads: false
			};
		default:
			return state;
	}
}

const defaultItemData = {
	bcsmapId: '',
	examheadId: '',
	students: '',
	exambulkattendanceId: '',
	ebas_status: {},
	total: '',
	month:'',
	pattern: '2',

};
function item(state = defaultItemData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_ADD_EXAM_BULK_ATT':
			return action.data;
		case 'SET_EBA_EDIT_DATA':
			return {
				...state,
				editing: true,
				bcsmapId: action.data.exambulkattendancedata.bcsmapId + '-',
				pattern: action.data.exambulkattendancedata.pattern,
				examheadId: action.data.exambulkattendancedata.examheadId,
				month: action.data.exambulkattendancedata.month,
				total: action.data.exambulkattendancedata.total,
				students: action.data.students,
				exambulkattendanceId: action.data.exambulkattendanceId,
				ebas_status: makeEbasStatus(action.data.students)
			};
		case 'LOAD_EBA_FORM_DATA':
			return null;
		case 'LOAD_BCS_STUDENTS':
			return {
				...state,
				students: action.data.students,
				ebas_status: makeEbasStatus(action.data.students),
				total: action.data.exambulkattendancedata ?
					action.data.exambulkattendancedata.total : '',
				exambulkattendanceId: action.data.exambulkattendanceId,
			};
		case 'LOAD_AVAILABLE_EXAM_HEADS':
			return {...state, examheadId: null, bcsmapId: action.value};
		case 'RESET_EBA_CLASS':
			return {...state, examheadId: null, bcsmapId: null};
		case 'UPDATE_DATA_VALUE':
			return {...state, [action.name]: action.value};
		case 'UPDATE_PRESENT_DAY_EBA_DATA_VALUE':
			return {
				...state,
				ebas_status: {
					...state.ebas_status,
					[action.name]: action.value
				},
			};
		case 'LOADING_BCS_STUDENTS':
			return {...state, students: null};
		default:
			return state;
	}
}

function makeEbasStatus(data){
	let status = {};
	data.forEach(function(item){
		if(item.student.exambulkattendancedetails && item.student.exambulkattendancedetails.length !== 0) {	
			status['ebas_'+item.student.id] = item.student.exambulkattendancedetails[0].present_days;
		} else {
			status['ebas_'+item.student.id] = '';
		}
	});
	return status;
}

function errors(state = [], action) {
	switch (action.type) {
		case 'SHOW_EBA_ERRORS':
			return action.errors;
		case 'LOAD_BCS_STUDENTS':
		case 'SEND_EXAM_BULK_ATT_SAVE_REQUEST':
		case 'SET_EBA_EDIT_DATA':
		case 'START_ADD_EXAM_BULK_ATT':
			return [];
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SEND_EXAM_BULK_ATT_SAVE_REQUEST':
			return true;
		case 'INIT_MODULE':
			return false;
		default:
			return state;
	}
}

export default combineReducers({
	items,
	meta,
	item,
	errors,
	saving,
	query,
	filters,
	pageInfo,
});
