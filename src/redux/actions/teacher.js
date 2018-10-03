import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
import {getGenderFromSalutation} from '../../utils/options';
export {updateFilter, update} from './index';

const view = 'teacher';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/teacher',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_TEACHER_ADD',
		});

		const [{data: {id: roleId}}, {data: subjects}] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/role/getAutoRoleId/' + state.session.masterId + '/teacher'
			}),
			api({
				data: makeApiData(state),
				url: '/admin/subject/list'
			}),
		]);

		dispatch({
			type: 'ADD_TEACHER',
			roleId,
			subjects: subjects.map(subject => ({
				value: subject.id,
				label: subject.subjectdetails[0].name,
			})),
		});
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state, formData = null) {
	return async dispatch => {
		dispatch({
			type: 'SAVING_TEACHER',
		});

		if (formData === null) {
			formData = {
				salutation: state.item.salutation !== null ? state.item.salutation : '',
				email: state.item.email,
				mobile: state.item.mobile,
				roleId: state.meta.roleId,
				is_active: state.item.is_active,
				loginUrl: window.location.origin + '/login',
				parentId: state.session.id,
				institute_name: state.session.userdetails.institute_name,
				defaultSessionId: state.session.defaultSessionId,
				teacher: {
					subjectId: state.item.subjects,
					gender: getGenderFromSalutation(state.item.salutation),
				},
				teacher_detail: {

				},
				user_detail:{
					fullname: state.item.name,
				},
			};
		}

		let {data} = await api({
			url: '/admin/teacher/save',
			data: makeApiData(state, formData),
		});

		if (data.errors) {
			let errors = makeErrors(data.errors);
			errors.address = {
				countryId: errors.countryId,
				stateId: errors.stateId,
				cityId: errors.cityId,
				address: errors.address,
			};
			dispatch({
				type: 'SET_TEACHER_ERRORS',
				errors,
			});
		} else if (data.status) {
			state.router.push('/hrm/teacher');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_TEACHER_EDIT',
		});

		let [{data}, {data: subjects}] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/teacher/edit/' + itemId
			}),
			api({
				data: makeApiData(state),
				url: '/admin/subject/list'
			}),
		]);

		let item = {
			id: data.user.id,
			'teacher[id]': data.id,
			'teacher_detail[id]': data.teacherdetails[0].id,
			salutation: data.user.salutation,
			'user_detail[fullname]': data.user.userdetails[0].fullname,
			'teacher[gender]': data.gender,
			'teacher[marital_status]': data.marital_status,
			mobile: data.user.mobile,
			email: data.user.email,
			password: '',
			editablePassword: false,
			'teacher[join_date]': data.join_date ? moment(data.join_date).format(state.session.userdetails.date_format) : null,
			'teacher[dob]': data.dob ? moment(data.dob).format(state.session.userdetails.date_format) : null,
			is_active: data.user.is_active,
			user_image: data.user.user_image,
			address: {
				countryId: data.countryId || state.session.userdetails.countryId,
				stateId: data.stateId || state.session.userdetails.stateId,
				cityId: data.cityId || state.session.userdetails.cityId,
				address: data.teacherdetails[0].address
			},
			'teacher[subjectId]': data.teachersubjects.map(ts => ts.subjectId),
			experiences: JSON.parse(data.teacherdetails[0].experiences || '[]'),
			qualifications: JSON.parse(data.teacherdetails[0].qualifications || '[]')
		};
		item.experiences.forEach(experience => {
			experience.start = moment(experience.start);
			experience.end = moment(experience.end);
		});
		if (item.experiences.length === 0)
			item.experiences.push({
				institute_name: '',
				start: null,
				end: null,
				remark: ''
			});
		if (item.qualifications.length === 0)
			item.qualifications.push({
				institute_name: '',
				name: '',
				startYear: '',
				endYear: '',
				image: '',
			});
		dispatch({
			type: 'SET_TEACHER_EDIT_DATA',
			data: item,
			subjects: subjects.map(subject => ({
				value: subject.id,
				label: subject.subjectdetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/teacher/status/' + itemId + '/' + status
		})
			.then(({data}) => {
				dispatch({
					type: 'CHANGE_ITEM_STATUS',
					itemId,
					status: data.status ? status : oldstatus
				});
			});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_TEACHER_REMOVAL',
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/teacher/remove'
		});

		if (status)
			state.router.push('/hrm/teacher');

		dispatch({
			type: 'TEACHER_REMOVAL_FAILED',
		});
	};
}

export function updateTableData(info, value) {
	return {
		type: 'UPDATE_TEACHER_TABLE_DATA',
		info,
		value
	};
}

export function updateTable(table, index, action) {
	return {
		type: 'UPDATE_TEACHER_TABLE',
		table,
		index,
		action
	};
}

export function setTableErrors(qualifications, experiences) {
	return {
		type: 'SET_TEACHER_TABLE_ERROS',
		experiences,
		qualifications,
	};
}

export function clearSelection() {
	return {
		type: 'TEACHER_CLEAR_SELECTION',
	};
}

export function sendSMS(state, data) {
	return async dispatch => {
		data.append('userId', state.session.id);
		const selectedIds = [];
		for (let i = state.items.length - 1; i >= 0; i--) {
			if (state.items[i].selected)
				selectedIds.push(state.items[i].id);
		}
		data.append('ids', JSON.stringify(selectedIds));
		await api({
			url: '/admin/teacher/sendsms',
			data: makeApiData(state, data)
		});
		dispatch({
			type: 'TEACHER_SMS_SENT',
		});
	};
}

export function sendEmail(state, data) {
	return async dispatch => {
		data.append('userId', state.session.id);
		const selectedIds = [];
		for (let i = state.items.length - 1; i >= 0; i--) {
			if (state.items[i].selected)
				selectedIds.push(state.items[i].id);
		}
		data.append('ids', JSON.stringify(selectedIds));
		await api({
			url: '/admin/teacher/sendemail',
			data: makeApiData(state, data)
		});
		dispatch({
			type: 'TEACHER_EMAIL_SENT'
		});
	};
}

export function sendLoginInfo(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'SEND_TEACHER_LOGIN_INFO',
			itemId,
		});
		await api({
			url: '/admin/teacher/send_login_info/' + itemId,
			data: makeApiData(state, {
				resetPassUrl: window.location.origin + '/forgot-password/'
			}),
		});
		dispatch({
			type: 'TEACHER_LOGIN_INFO_SENT',
			itemId,
		});
	};
}

export function viewSubjects(state, id) {
	return async dispatch => {
		dispatch({
			type: 'GET_TEACHER_SUBJECTS',
			id,
		});
		let {data} = await api({
			url: '/admin/teacher/viewSubjects',
			data: makeApiData(state, {
				id,
			}),
		});
		dispatch({
			type: 'SET_TEACHER_SUBJECTS',
			id,
			subjects: data.teachersubjects.map(teachersubject => 
				teachersubject.subject.subjectdetails[0].name
			),
		});
	};
}

export function hideSubjects() {
	return {
		type: 'HIDE_TEACHER_SUBJECTS'
	};
}