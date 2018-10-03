import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'empleavetype';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/empleavetype',
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

export function startAdd() {
	return {
		type: 'START_ADD_ELT'
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
			url: '/admin/empleavetype/save',
			data: makeApiData(state, {
				id: state.item.id,
				empleavetype_detail:{
					name: state.item.name,
					id: state.item.detailId
				},
				is_active: state.item.is_active,
				total_leaves: state.item.total_leaves,
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ELT_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/hrm/empleavetype');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_ELT_EDIT',
			view
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/empleavetype/edit/' + itemId
		});
		dispatch({
			type: 'SET_ELT_EDIT_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				total_leaves: data.total_leaves,
				name: data.empleavetypedetails[0].name,
				detailId: data.empleavetypedetails[0].id
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ELT_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/empleavetype/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_ELT_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_ELT_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/empleavetype/remove'
		});

		if (status)
			state.router.push('/hrm/empleavetype');

		dispatch({
			type: 'ELT_REMOVAL_FAILED',
		});
	};
}