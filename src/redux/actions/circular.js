import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'circular',
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
			url: '/admin/circular',
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
		dispatch({type: 'LOADING_CIR_FORM_DATA'});
		let {data: {bcsmaps}} = await api({
			data: makeApiData(state),
			url: '/admin/circular/add'
		});
		bcsmaps = bcsmaps.map(item => ({
			value: item.id,
			label: bcsName(item),
		}));
		bcsmaps.unshift({
			value: 0,
			label: window.__('All'),
		});
		dispatch({
			type: 'SET_CIR_ADD_DATA',
			bcsmaps,
			data: {
				title: '',
				number: '',
				date: null,
				details: '',
				bcsmaps: [],
				teachers: 0,
				students: 0,
				parents: 0,
			},
		});
	};
}

export function save(state, file) {
	return async dispatch => {
		dispatch({type: 'SEND_CIRCULAR_SAVE_REQUEST'});
		let date_format = state.session.userdetails.date_format,
			bcsmaps = state.item.bcsmaps;
		if (bcsmaps.indexOf(0) !== -1) {
			bcsmaps = state.meta.bcsmaps.map(({value}) => value);
			bcsmaps.shift();
		}

		let circular = new FormData();
		circular.append('circular', JSON.stringify(
			makeApiData(state, {
				id: state.item.id,
				date: state.item.date ? moment(state.item.date, date_format).format('YYYY/MM/DD') : '',
				bcsmaps,
				number: state.item.number,
				parents: state.item.parents,
				students: state.item.students,
				teachers: state.item.teachers,
				academicSessionId: state.session.selectedSession.id,
				circulardetail:{
					id: state.item.detailId,
					title: state.item.title,
					details: document.getElementById('circular-details').value,
				},
			})
		));
		if(file)
			circular.append('circular_file', file, file.name);

		let {data} = await api({
			data: circular,
			url: '/admin/circular/save'
		});
		if (data.errors) {
			dispatch({
				type: 'SET_CIRCULAR_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			state.router.push(state.router.location);
		} else {
			dispatch({
				type: 'RESET_CIRCULAR',
			});
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_CIR_FORM_DATA'});
		let {data: {data, bcsmaps}} = await api({
			url: '/admin/circular/edit',
			data: makeApiData(state, {id, meta: 1}),
		});
		let date_format = state.session.userdetails.date_format;
		bcsmaps = bcsmaps.map(item => ({
			value: item.id,
			label: bcsName(item),
		}));
		bcsmaps.unshift({
			value: 0,
			label: window.__('All'),
		});
		dispatch({
			type: 'SET_CIR_EDIT_DATA',
			data: {
				id: data.id,
				detailId: data.circulardetails[0].id,
				title: data.circulardetails[0].title,
				details: data.circulardetails[0].details,
				date: moment(data.date).format(date_format),
				bcsmaps: data.circularrecords.map(({bcsMapId}) => bcsMapId),
				teachers: data.users & TEACHER_MASK,
				students: data.users & STUDENT_MASK,
				parents: data.users & PARENT_MASK,
				file: data.file,
				number: data.number,
			},
			bcsmaps,
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({type: 'START_CIR_REMOVE'});
		let {data} = await api({
			data: makeApiData(state,{
				id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/circular/remove/'
		});
		if (data.status) {
			state.router.push(state.router.location);
			return;
		}
		dispatch({type: 'CIR_REMOVAL_FAILED'});
	};
}

export function sendNotification(state, id) {
	return async () => {
		await api({
			url: '/admin/circular/notification/',
			data: makeApiData(state,{
				id,
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
	};
}
