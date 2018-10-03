import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'transportemp';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/transportemp',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
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
		const [{data: {id: driverRoleId}}, {data: {id: helperRoleId}}] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/role/getAutoRoleId/' + state.session.masterId + '/driver'
			}),
			api({
				data: makeApiData(state),
				url: '/admin/role/getAutoRoleId/' + state.session.masterId + '/helper'
			}),
		]);
		dispatch({
			type: 'START_ADD_TEY',
			driverRoleId,
			helperRoleId,
			data: {
				id: '',
				mobile: '',
				is_active: true,
				user_type : null,
				govt_identity_number: '',
				govt_identity_expiry: null,
				'user_detail[address]': '',
				'user_detail[fullname]': '',
			},
		});
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
			type: 'SAVING_TEY',
		});
		if(!state.item.id){
			let roleId = 0;
			roleId = state.item.user_type == 'driver' ? state.meta.driverRoleId : state.meta.helperRoleId;
			formData.append('roleId', roleId);
		}
		formData.append('institute_name', state.session.userdetails.institute_name);
		formData.append('parentId', state.session.id);
		formData.append('loginUrl', window.location.origin + '/login');
		formData.append('secondary_lang', state.session.secondary_lang);

		let {data} = await api({
			url: '/admin/transportemp/save',
			data: makeApiData(state, formData),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_TEY_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			state.router.push('/transport/transportemp');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_TEY_EDIT',
			view
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/transportemp/edit/' + itemId
		});
		dispatch({
			type: 'SET_TEY_EDIT_DATA',
			data: {
				id: data.id,
				password: '',
				mobile: data.mobile,
				editablePassword: false,
				is_active: data.is_active,
				user_type :data.user_type,
				user_image: data.user_image,
				govt_identity_number: data.govt_identity_number,
				govt_identity_expiry: moment(data.govt_identity_expiry).format(
					state.session.userdetails.date_format,
				),
				govt_identity_image: data.govt_identity_image,
				detailId: data.userdetails[0].id,
				'user_detail[fullname]': data.userdetails[0].fullname,
				'user_detail[address]': data.userdetails[0].address,
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_TEY_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/transportemp/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_TEY_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_TEY_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/transportemp/remove'
		});

		if (status)
			state.router.push('/transport/transportemp');

		dispatch({
			type: 'TEY_REMOVAL_FAILED',
		});
	};
}