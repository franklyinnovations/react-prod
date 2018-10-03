import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index'; 

const view = 'role';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/role',
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
			type: 'START_ROLE_EDIT',
		});

		let {data} = await api({
			data: makeApiData(state, {
				userId: state.session.id,
				roleId: state.session.roleId,
			}),
			url: '/admin/role/add'
		});
		dispatch({
			type: 'START_ADD_ROLE',
			permissions: createPermissions(state.session.id === 1, data.permissions),
		});
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/role/save',
			data: makeApiData(state, {
				id: state.item.id,
				role_detail:{
					name: state.item.name,
					id: state.item.detailId,
					roleId: state.item.id,
				},
				userId: state.session.id,
				is_active: state.item.is_active,
				permissionIds: Object.keys(state.item.permissionIds),
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ROLE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/hrm/role');
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_ROLE_EDIT',
			view
		});

		let {data: {data, permissions}} = await api({
			data: makeApiData(state, {
				id,
				userId: state.session.id,
				roleId: state.session.roleId,
			}),
			url: '/admin/role/edit'
		});
		dispatch({
			type: 'SET_ROLE_EDIT_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				name: data.roledetails[0].name,
				detailId: data.roledetails[0].id,
				permissionIds: data.rolepermissions.reduce(
					(obj, {permissionId}) => (obj[permissionId] = true, obj), {}
				),
			},
			permissions: createPermissions(state.session.id === 1, permissions),
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ROLE_STATUS',
			id,
			status: -1
		});

		const {data} = await api({
			data: makeApiData(state, {
				id,
				status,
			}),
			url: '/admin/role/status/' + id + '/' + status 
		});
		
		dispatch({
			type: 'CHANGE_ROLE_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_ROLE_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/role/remove'
		});

		if (status)
			state.router.push('/hrm/role');

		dispatch({
			type: 'ROLE_REMOVAL_FAILED',
		});
	};
}

function createPermissions(superadmin, permissions) {
	let result = {};
	for (let i = permissions.length - 1; i >= 0; i--) {
		let permission = superadmin ? permissions[i] : permissions[i].permission;
		if (result[permission.model] === undefined) {
			result[permission.model] = {
				model: permission.model,
				display_order: permission.display_order,
				permissions: [{
					id: permission.id,
					action: permission.action,
				}],
			};
		} else {
			result[permission.model].permissions.push({
				id: permission.id,
				action: permission.action,
			});
		}
	}
	result = Object.values(result);
	result.sort((x, y) => x.display_order - y.display_order);
	return result;
}