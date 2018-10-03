import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'user';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		const [{data}, {data: roleList}] = await Promise.all([
			api({
				url: '/admin/user',
				cookies: state.cookies,
				data: makeApiData(state),
				params: paramsFromState(state, view),
			}),
			api({
				data: makeApiData(state),
				url: '/admin/role/list/' + state.session.masterId
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			roles: roleList.map(role => ({
				value: role.id,
				label: role.roledetails[0].name,
			})),
			stopLoading: true,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_USER_EDIT',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/role/list/' + state.session.masterId
		});

		dispatch({
			type: 'START_ADD_USER',
			roles: data.map(role => ({
				value: role.id,
				label: role.roledetails[0].name,
			})),
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
			type: 'SEND_ADD_USER_REQUEST',
		});

		formData.append('institute_name', state.session.userdetails.institute_name);
		formData.append('parentId', state.session.id);
		formData.append('loginUrl', window.location.origin + '/login');

		let {data} = await api({
			url: '/admin/user/save',
			data: makeApiData(state, formData),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_USER_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			state.router.push('/hrm/user');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_USER_EDIT',
			view
		});

		let [{data}, {data: roles}] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/user/edit/' + itemId
			}),
			api({
				data: makeApiData(state),
				url: '/admin/role/list/' + state.session.masterId
			}),
		]);
		dispatch({
			type: 'SET_USER_EDIT_DATA',
			data: {
				id: data.id,
				detailId: data.userdetails[0].id,
				salutation: data.salutation,
				'user_detail[fullname]': data.userdetails[0].fullname,
				roleId: data.roleId,
				email: data.email,
				mobile: data.mobile,
				alternate_mobile: data.alternate_mobile,
				password: '',
				confirm_password: '',
				editablePassword: false,
				is_active: data.is_active,
				user_image: data.user_image
			},
			roles: roles.map(role => ({
				value: role.id,
				label: role.roledetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_USER_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/user/status/' + id + '/' + status,
		});
		
		dispatch({
			type: 'CHANGE_USER_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}