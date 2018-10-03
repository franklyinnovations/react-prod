import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'examhead';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const {data} = await api({
			url: '/admin/examhead',
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

export function startAdd() {
	return {
		type: 'START_ADD_EHD',
		data: {
			name: '',
			alias: '',
			is_active: 1,
		},
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_EHD_EDIT'});

		let {data} = await api({
			data: makeApiData(state, {
				id,
			}),
			url: '/admin/examhead/edit/' + id,
		});

		dispatch({
			type: 'SET_EHD_EDIT_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				name: data.examheaddetails[0].name,
				alias: data.examheaddetails[0].alias,
				detailId: data.examheaddetails[0].id,
			},
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SEND_EHD_SAVE_REQUEST'});

		let {data} = await api({
			data: makeApiData(state, {
				id: state.item.id,
				is_active: state.item.is_active,
				examheaddetail: {
					name: state.item.name,
					alias: state.item.alias,
					id: state.item.detailId,
					examheadId: state.item.id,
				},
			}),
			url: '/admin/examhead/save',
		});

		if (data.errors) {
			dispatch({
				type: 'SET_EHD_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/exam/head');
		}
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_EHD_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/examhead/status/' + id + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_EHD_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_EHD_REMOVE'});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/examhead/remove'
		});

		if (status) {
			state.router.push('/exam/head');
			return;
		}

		dispatch({
			type: 'EHD_REMOVAL_FAILED',
		});
	};
}