import moment from 'moment';
import api, {makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'exambulkattendance';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let [{data}, bcsmaps] = await Promise.all([
			api({
				params: paramsFromState(state, view),
				url: '/admin/exambulkattendance',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id
				}),
			}),
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state)
			})
		]);

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.data.data.map(item => ({
				value: item.id,
				label: bcsName(item)
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOAD_EBA_FORM_DATA'});
		let {data: {data}} = await api({
			data: makeApiData(state),
			url: '/admin/utils/allBcsByMasterId',
		});
		dispatch({
			type: 'START_ADD_EXAM_BULK_ATT',
			bcsmaps: data.map(item => ({
				value: item.id +'-'+item.boardId+'-'+item.classId,
				label: bcsName(item)
			})),
			months: getMonths(
				state.session.selectedSession.start_date,
				state.session.selectedSession.end_date,
			),
			data: {
				bcsmapId: '',
				examheadId: '',
				students: '',
				exambulkattendanceId: '',
				ebas_status: {},
				total: '',
				month:'',
				pattern: '2',
				editing: false,
			},
		});
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOAD_EBA_FORM_DATA'});
		let {data} = await api({
			url: '/admin/exambulkattendance/edit',
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'SET_EBA_EDIT_DATA',
			data,
			months: getMonths(
				state.session.selectedSession.start_date,
				state.session.selectedSession.end_date,
			),
		});
	};
}

function getMonths(start_date, end_date) {
	let start = moment(start_date), end = moment(end_date), months = [
		{value: start.format('MMMM YYYY')},
	];
	start.startOf('month').add(1, 'months');
	while(start.isSameOrBefore(end)) {
		months.push({value: start.format('MMMM YYYY')});
		start.add(1, 'months');
	}
	return months;
}

export function changeClass(state, bcsmap) {
	if (bcsmap === null) return {type: 'RESET_EBA_CLASS'};
	return async dispatch => {
		dispatch({type: 'LOAD_AVAILABLE_EXAM_HEADS', value: bcsmap});
		let {data} = await api({
			url: '/admin/exambulkattendance/exams',
			data: makeApiData(state, {
				boardId: bcsmap.split('-')[1],
				classId: bcsmap.split('-')[2],
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'SET_AVAILABLE_EXAM_HEADS',
			data: data.exams
		});
	};
}

export function save(state, data) {
	let errors = {}, atttotalvalue = '', attvalue = '',
		__ = window.__;

	if(typeof state.item.total === 'string')
		atttotalvalue = state.item.total.trim();
	else
		atttotalvalue = state.item.total;

	if(atttotalvalue === ''){
		errors.total = __('This is a required field.');
	} else if(isNaN(Number(atttotalvalue))) {
		errors.total = __('Not a valid input.');
	} else if(atttotalvalue.length > 4){
		errors.total = __('Length can not be more than 4 digits.');
	}

	Object.keys(state.item.ebas_status).forEach(key => {
		if(typeof state.item.ebas_status[key] === 'string')
			attvalue = state.item.ebas_status[key].trim();
		else
			attvalue = state.item.ebas_status[key];

		if(attvalue === ''){
			errors[key] = __('This is a required field.');
		} else if(isNaN(Number(attvalue))) {
			errors[key] = __('Not a valid input.');
		} else if(parseFloat(attvalue) > parseFloat(state.item.total))  {
			errors[key] = __('Beyond total attendance.');
		}
	});
	data.append('academicSessionId', state.session.selectedSession.id);
	return async dispatch => {
		if (Object.keys(errors).length !== 0) {
			return dispatch({
				type: 'SHOW_EBA_ERRORS',
				errors
			});
		}
		dispatch({
			type: 'SEND_EXAM_BULK_ATT_SAVE_REQUEST',
		});
		await api({
			url: '/admin/exambulkattendance/save',
			data: makeApiData(state, data)
		});
		state.router.push('/student-attendance/bulk-attendance');
	};
}

export function loadStudents(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_BCS_STUDENTS'});
		let {data} = await api({
			url: '/admin/exambulkattendance/getStudents',
			data: makeApiData(state, {
				month: state.item.month,
				pattern: state.item.pattern,
				examheadId: state.item.examheadId,
				bcsMapId: state.item.bcsmapId.split('-')[0],
				academicSessionId: state.session.selectedSession.id,
			})
		});
		dispatch({type: 'LOAD_BCS_STUDENTS', data});
	};
}


