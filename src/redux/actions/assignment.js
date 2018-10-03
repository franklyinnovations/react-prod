import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter, update} from './index';
import moment from 'moment';

const view = 'assignment';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let [{data: bcsmaps}, {data: subjects}, {data}] = await Promise.all([
			api({
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.userdetails.userId,
					user_type: state.session.user_type
				}),
				cookies: state.cookies,
				url: '/admin/assignment/bcsmaps'
			}),
			api({
				url: '/admin/subject/list',
				cookies: state.cookies,
				data: makeApiData(state)
			}),
			api({
				params: paramsFromState(state, view),
				url: '/admin/assignment',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.id,
					userType: state.session.user_type
				}),
				hideMessage: true
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: bcsmaps.bcsmaps.data.map(item => ({
				value: item.bcsmap.id, 
				label: bcsName(item.bcsmap),
			})),
			subjects: subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name 
			})),
			data,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ASSIGNMENT_EDIT_DATA',
		});

		let {data} = await api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.userdetails.userId,
				user_type: state.session.user_type
			}),
			url: '/admin/assignment/add'
		});
		dispatch({
			type: 'START_ADD_ASSIGNMENT',
			data,
		});
	};
}

export function save(state, formdata) {
	formdata.append('userId', state.session.id);
	formdata.append('academicSessionId', state.session.selectedSession.id);
	formdata.append('loginUrl', window.location.origin+'/login'); 
	return async dispatch => {
		dispatch({
			type: 'SEND_ADD_ASSIGNMENT_REQUEST',
		});
		let {data} = await api({
			data: makeApiData(state, formdata),
			url: '/admin/assignment/save'
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_ASSIGNMENT_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_ASSIGNMENT_SAVE_ERRORS',
				errors: {}
			});
		} else if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/assignment/setup');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ASSIGNMENT_EDIT_DATA',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.userdetails.userId,
				user_type: state.session.user_type,
				id:itemId
			}),
			url: '/admin/assignment/edit'
		});
		data.data.start_date = moment(data.data.start_date).format(state.session.userdetails.date_format);
		data.data.end_date = moment(data.data.end_date).format(state.session.userdetails.date_format);
		dispatch({
			type: 'SET_ASSIGNMENT_EDIT_DATA',
			data,
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ASSIGNMENT_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {
				updateById: state.session.id
			}),
			url: '/admin/assignment/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_ASSIGNMENT_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function changeClass(state, bcsMapId) {
	if (bcsMapId === null)
		return {
			type: 'RESET_ASSIGNMENT_CLASS',
		};
	return async dispatch => {
		dispatch({
			type: 'LOAD_ASSIGNMENT_SUBJECTS',
			bcsMapId
		});
		let {data} = await api({
			url: '/admin/assignment/getSubjects',
			data: makeApiData(state, {
				bcsMapId,
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.userdetails.userId,
				user_type: state.session.user_type
			})
		});
		dispatch({
			type: 'SET_ASSIGNMENT_SUBJECTS',
			data: data
		});
	};
}

export function deleteItem(state, itemId) {
	return async dispatch => {
		let {data: {status}} = await  api({
			data: makeApiData(state),
			url: '/admin/assignment/delete/' + itemId
		});

		if (status)
			state.router.push('/assignment/setup');

		dispatch({
			type: 'ASSIGNMENT_REMOVAL_FAILED',
		});

	};
}

export function remarks(state, itemId, bcsMapId) {
	return async dispatch => {
		dispatch({type: 'LOADING_ASSIGNMENT_REMARK_DATA'});
		let {data} = await api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: bcsMapId,
				assignmentId: itemId,
			}),
			url: '/admin/assignment/getStudents'
		});
		dispatch({
			type: 'ASSIGNMENT_REMARKS',
			data,
			assignmentId: itemId,
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_ASSIGNMENT_DATA_VALUE',
		name,
		value
	};
}

export function showTagModal(studentId) {
	return {
		type: 'SHOW_TAG_MODAL',
		studentId
	};
}

export function closeTagModal() {
	return {
		type: 'CLOSE_TAG_MODAL'
	};
}

export function tagUpdate(studentId, tagId) {
	return {
		type: 'UPDATE_ASSIGNMENT_TAG',
		studentId,
		tagId
	};
}

export function saveRemark(state, data) {
	data.append('academicSessionId', state.session.selectedSession.id);
	data.append('updateById', state.session.id); 
	data.append('reviewedAt', moment().format('YYYY/MM/DD')); 
	return dispatch => {
		dispatch({
			type: 'SEND_ADD_ASSIGNMENT_REMARK_REQUEST',
		});
		return api({
			data: makeApiData(state, data),
			url: '/admin/assignment/saveRemark'
		})
			.then(({data}) => {
				if (!data.status) {
					dispatch({
						type: 'SET_ASSIGNMENT_REMARK_ERRORS',
						errors: {}
					});
				} else {
					dispatch(init(state));
				}
			});
	};
}
