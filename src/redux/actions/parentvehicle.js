import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'parentvehicle';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [{data}, {data: {data: bcsmaps}}] = await Promise.all([
			api({
				url: '/admin/parentvehicle',
				cookies: state.cookies,
				data: makeApiData(state,{
					academicSessionId: state.session.selectedSession.id,
				}),
				params: paramsFromState(state, view),
			}),
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
				params: paramsFromState(state, view),
			})
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps,
		});
	};
}

export function loadStudents(state, bcsmapId) {
	return async dispatch => {
		dispatch({type: 'LOADING_PARENTVEHICLE_STUDENTS'});

		const {data: {data: students}} = await api({
			url: '/admin/utils/studentsByBcsMapId',
			data: makeApiData(state, {
				bcsmapId,
				academicSessionId: state.session.selectedSession.id
			}),
		});

		dispatch({
			type: 'LOAD_PARENTVEHICLE_STUDENTS',
			students: students.map(item => ({
				value: item.student.id,
				label: item.student.user.userdetails[0].fullname,
			})),
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_PARENTVEHICLE',
		data: {
			make: '',
			number: '',
			fuel_type: '',
			total_seats: '',
			is_active: true,
			vehicle_type: '',
			vehicle_document: '',
			insurance_number: '',
			registration_number: '',
			insurance_certificate: '',
			insurance_expiry_date: null,
			pollution_control_number: '',
			pollution_control_certificate: '',
			pollution_control_expiry_date: null,

			'parentvehicledetail[owner]': '',
			'parentvehicledetail[model]': '',
			'parentvehicledetail[colour]': '',
			'parentvehicledetail[place]': '',
		},
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({
			type: 'SAVING_PARENTVEHICLE',
		});
		let {data} = await api({
			url: '/admin/parentvehicle/save',
			data: makeApiData(state, formData),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_PARENTVEHICLE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			state.router.push('/transport/parent-vehicle');
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_PARENTVEHICLE_EDIT',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/parentvehicle/edit'
		});
		dispatch({
			type: 'SET_PARENTVEHICLE_EDIT_DATA',
			data: {
				id: data.id,
				make: data.make,
				number: data.number,
				fuel_type: data.fuel_type,
				is_active: data.is_active,
				studentId: data.studentId,
				total_seats: data.total_seats,
				vehicle_type: data.vehicle_type,
				vehicle_image: data.vehicle_image,
				insurance_number: data.insurance_number,
				vehicle_document: data.vehicle_document,
				bcsmapId: data.student.studentrecord.bcsMapId,
				registration_number: data.registration_number,
				insurance_expiry_date: moment(data.insurance_expiry_date).format(state.session.userdetails.date_format),
				insurance_certificate: data.insurance_certificate,
				pollution_control_number: data.pollution_control_number,
				pollution_control_expiry_date: moment(data.pollution_control_expiry_date).format(state.session.userdetails.date_format),
				pollution_control_certificate: data.pollution_control_certificate,

				detailId: data.parentvehicledetails[0].id,
				'parentvehicledetail[owner]': data.parentvehicledetails[0].owner,
				'parentvehicledetail[place]': data.parentvehicledetails[0].place,
				'parentvehicledetail[model]': data.parentvehicledetails[0].model,
				'parentvehicledetail[colour]': data.parentvehicledetails[0].colour,
			},
		});
		dispatch(loadStudents(state, data.student.studentrecord.bcsMapId));
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_PARENTVEHICLE_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {id, status}),
			url: '/admin/parentvehicle/status'
		});

		dispatch({
			type: 'CHANGE_PARENTVEHICLE_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_PARENTVEHICLE_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/parentvehicle/remove'
		});

		if (status)
			state.router.push('/transport/parent-vehicle');

		dispatch({
			type: 'PARENTVEHICLE_REMOVAL_FAILED',
		});
	};
}

export function viewQRCode(state, id) {
	return {
		type: 'SHOW_PARENTVEHICLE_QRCODE',
		item: state.items.find(item => item.id === id)
	};
}

export function sendEmail(state, id) {
	return async dispatch => {
		await api({
			url: '/admin/parentvehicle/sendemail',
			data: makeApiData(state, {
				id,
				userId: state.session.id
			})
		});
		dispatch({type: 'PARENTVEHICLE_EMAIL_SENT'});
	};
}