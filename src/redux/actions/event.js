import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'event',
	STUDENT_MASK = 1,
	TEACHER_MASK = (1 << 1),
	PARENT_MASK = (1 << 2);

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			url: '/admin/event',
			cookies: state.cookies,
			params: paramsFromState(state, view),
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_EVT_FORM_DATA'});
		let {data: {bcsmaps}} = await api({
			data: makeApiData(state),
			url: '/admin/event/add'
		});
		dispatch({
			type: 'SET_EVT_ADD_DATA',
			bcsmaps: bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
			data: {
				title: '',
				start: null,
				end: null,
				details: '',
				bcsmaps: [],
				teachers: 0,
				students: 0,
				parents: 0,
				venue: '',
				dresscode: '',
				instructions: '',
			},
		});
	};
}

export function save(state, file) {
	return async dispatch => {
		dispatch({type: 'SEND_EVENT_SAVE_REQUEST'});
		let date_format = state.session.userdetails.date_format + ' hh:mm A';

		let event = new FormData();
		event.append('event', JSON.stringify(
			makeApiData(state, {
				id: state.item.id,
				end: state.item.end ? moment(state.item.end, date_format) : '',
				start: state.item.start ? moment(state.item.start, date_format) : '',
				bcsmaps:state.item.bcsmaps,
				parents: state.item.parents,
				students: state.item.students,
				teachers: state.item.teachers,
				academicSessionId: state.session.selectedSession.id,
				eventdetail:{
					id: state.item.detailId,
					title: state.item.title,
					instructions: state.item.instructions,
					details: state.item.details,
					venue: state.item.venue,
					dresscode: state.item.dresscode,
				},
			}),
		));

		if(file)
			event.append('event_file', file, file.name);

		let {data} = await api({
			data: event,
			url: '/admin/event/save'
		});
		if (data.errors) {
			dispatch({
				type: 'SET_EVENT_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			state.router.push(state.router.location);
		} else {
			dispatch({
				type: 'RESET_EVENT',
			});
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_EVT_FORM_DATA'});
		let {data: {data, bcsmaps}} = await api({
			url: '/admin/event/edit',
			data: makeApiData(state, {id, meta: 1}),
		});
		let date_format = state.session.userdetails.date_format;
		dispatch({
			type: 'SET_EVT_EDIT_DATA',
			data: {
				id: data.id,
				detailId: data.eventdetails[0].id,
				title: data.eventdetails[0].title,
				details: data.eventdetails[0].details,
				end: moment(data.end).format(date_format + ' hh:mm A'),
				start: moment(data.start).format(date_format + ' hh:mm A'),
				bcsmaps: data.eventrecords.map(({bcsMapId}) => bcsMapId),
				teachers: data.users & TEACHER_MASK,
				students: data.users & STUDENT_MASK,
				parents: data.users & PARENT_MASK,
				venue: data.eventdetails[0].venue,
				dresscode: data.eventdetails[0].dresscode,
				instructions: data.eventdetails[0].instructions,
				file: data.file,
			},
			bcsmaps: bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({type: 'START_EVT_REMOVE'});
		let {data} = await api({
			data: makeApiData(state,{
				id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/event/remove/'
		});
		if (data.status) {
			state.router.push(state.router.location);
			return;
		}
		dispatch({type: 'EVT_REMOVAL_FAILED'});
	};
}

export function sendNotification(state, id) {
	return async () => {
		await api({
			url: '/admin/event/notification/',
			data: makeApiData(state,{
				id,
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
	};
}
