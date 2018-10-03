import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'studentdashboard';

export function init() {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
		});
	};
}

export function loadTodo() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_TODO'});
		const {data: {data}} = await api({
			url: '/admin/todo/list',
			data: makeApiData(state),
		});
		dispatch({
			type: 'LOAD_SDB_TODO',
			data,
		});
	};
}

export function saveTodo() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'SAVING_SDB_TODO'});
		const {data: {data, errors}} = await api({
			url: '/admin/todo/save',
			params: paramsFromState(state, view),
			data: makeApiData(state, {
				...state.view.state.todo.item,
				date: moment(
					state.view.state.todo.item.date,
					state.session.userdetails.date_format + ' hh:mm A'
				),
			}),
		});
		if (errors) {
			dispatch({type: 'SET_TODO_ERRORS', errors: makeErrors(errors)});
		} else {
			dispatch({type: 'SDB_TODO_SAVED', data});
		}
	};
}

export function removeTodo(id) {
	return async (dispatch, getState) => {
		dispatch({type: 'START_SDB_TODO_REMOVE', id});
		let {data: {status}} = await api({
			data: makeApiData(getState(), {id}),
			url: '/admin/todo/remove'
		});
		dispatch({
			type: 'SDB_TODO_REMOVAL_RESULT',
			id,
			status,
		});
	};
}

export function loadClasses() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_CLASSES'});
		let {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/student-dashboard/classes',
			data: makeApiData(state, {
				weekday: moment().format('dddd'),
				date: moment().format('YYYY-MM-DD'),
				userTypeId: state.session.userdetails.userId,
				bcsMapId: state.session.userdetails.bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		data.forEach(item => {
			item.timetableallocations.forEach(tta => {
				tta.time = moment(tta.start_time, 'HH:mm:ss').format('h:mm A') + 
				' - '+ moment(tta.end_time, 'HH:mm:ss').format('h:mm A');
			});
		});
		dispatch({type: 'LOAD_SDB_CLASSES', data});
	};
}

export function loadLeaves() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_LEAVES'});
		let {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/student-dashboard/leaves',
			data: makeApiData(state, {
				date: moment().format('YYYY-MM-DD'),
				bcsMapId: state.session.userdetails.bcsMapId,
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({type: 'LOAD_SDB_LEAVES', data});
	};
}

export function loadEvents() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_EVENTS'});
		let {data: {data}} = await api({
			url: '/admin/student-dashboard/events',
			data: makeApiData(state, {
				date: moment().format('YYYY-MM-DD'),
				bcsMapId: state.session.userdetails.bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({type: 'LOAD_SDB_EVENTS', data});
	};
}

export function loadCirculars() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_CIRCULARS'});
		let {data: {data}} = await api({
			url: '/admin/student-dashboard/circulars',
			data: makeApiData(state, {
				date: moment().format('YYYY-MM-DD'),
				bcsMapId: state.session.userdetails.bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({type: 'LOAD_SDB_CIRCULARS', data});
	};
}

export function loadExams() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_EXAMS'});
		let {data: {data}} = await api({
			url: '/admin/student-dashboard/exams',
			data: makeApiData(state, {
				date: moment().format('YYYY-MM-DD'),
				userTypeId: state.session.userdetails.userId,
				boardId: state.session.userdetails.boardId,
				classId: state.session.userdetails.classId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		data.forEach(item => {
			item.end_time = moment(item.end_time, 'HH:mm:ss').format('h:mm A');
			item.start_time = moment(item.start_time, 'HH:mm:ss').format('h:mm A');
		});
		dispatch({type: 'LOAD_SDB_EXAMS', data});
	};
}

export function loadAssignments() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_SDB_ASSIGNMENTS'});
		let {data: {data}} = await api({
			url: '/admin/student-dashboard/assignments',
			data: makeApiData(state, {
				userId: state.session.id,
				date: moment().format('YYYY-MM-DD'),
				bcsMapId: state.session.userdetails.bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({type: 'LOAD_SDB_ASSIGNMENTS', data});
	};
}
