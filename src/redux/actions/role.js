import api, {makeErrors, makeApiData} from '../../api';

const view = 'role';

export function init(state) {
	let	params = {
		...state.location.query
	};
        
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.role.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/role',
			cookies: state.cookies,
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			})
		})
	}
}

export function startAdd(state) {
	let data = makeApiData(
		state,
		{
			userId: state.session.id,
			roleId: state.session.roleId
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/admin/role/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD_ROLE',
				data,
				userId:state.session.id,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_ROLE_LIST'
	}
}

export function save(state, userId) {
	var permissionIds = [];
	Object.keys(state.item.rolepermissions).forEach(function(permissions){
		permissionIds.push(state.item.rolepermissions[permissions]);
	});
	permissionIds = [].concat(...permissionIds);
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			permissionIds:permissionIds,
			role_detail:
			{
				id: state.item.detailId,
				name: state.item.name
			},
			userId
		}
	);
	if (state.item.is_active) data.is_active = 1;
	return dispatch => api({
		data,
		url: '/admin/role/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ROLE_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/admin/role');
		}
	});
}

export function edit(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
			userId: state.session.id,
			roleId: state.session.roleId
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/admin/role/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ROLE_EDIT_DATA',
				data,
				userId:state.session.id,
				stopLoading: true
			});
		});
	}
}

export function changeStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/role/status/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status
			});
		});
	}
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_ROLE_DATA_VALUE',
		name,
		value
	};
}

export function checkedStatus(model, permissions) {
	return {
		type: 'UPDATE_ROLE_PERMISSIONS',
		model,
		permissions
	};
}