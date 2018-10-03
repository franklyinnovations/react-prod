import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'feediscount';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/feediscount',
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			feeheads: data.feeheads.map(item => ({
				value: item.id,
				label: item.feeheaddetails[0].name,
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_FDT'});
		let {data} = await api({
			url: '/admin/feediscount/save',
			data: makeApiData(state, {
				id: state.item.id,
				type: state.item.type,
				value: state.item.value,
				is_active: state.item.is_active,
				feeheadId: state.item.feeheadId || '',
				feediscountdetail: {
					name: state.item.name,
				},
			}),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_FDT_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_FDT_EDIT_DATA'});
		let {data:{data: item}} = await api({
			url: '/admin/feediscount/edit',
			data: makeApiData(state, {id}),
		});
		dispatch({
			type: 'SET_FDT_EDIT_DATA',
			data: {
				id: item.id,
				value: item.value,
				feeheadId: item.feeheadId,
				type: item.type.toString(),
				is_active: item.is_active,
				name: item.feediscountdetails[0].name,
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_FDT_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {id, status}),
			url: '/admin/feediscount/status',
		});

		dispatch({
			type: 'CHANGE_FDT_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_FDT_REMOVE', id});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/feediscount/remove'
		});

		if (status) {
			state.router.push(state.router.location.pathname);
			return;
		}

		dispatch({
			type: 'FDT_REMOVAL_FAILED',
		});
	};
}