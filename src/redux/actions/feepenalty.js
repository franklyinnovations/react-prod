import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'feepenalty';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/feepenalty',
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

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_FPT'});
		let {data} = await api({
			url: '/admin/feepenalty/save',
			data: makeApiData(state, {
				id: state.item.id,
				is_active: state.item.is_active,
				feepenaltydetail: {
					name: state.item.name,
				},
				feepenaltyslabs: state.item.feepenaltyslabs,
			}),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_FPT_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_FPT_EDIT_DATA'});
		let {data: {data: item}} = await api({
			data: makeApiData(state, {
				id,
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/feepenalty/edit'
		});

		dispatch({
			type: 'SET_FPT_EDIT_DATA',
			data: {
				days: '',
				amount: '',
				id: item.id,
				is_active: item.is_active,
				name: item.feepenaltydetails[0].name,
				feepenaltyslabs: item.feepenaltyslabs,
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_FPT_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {id, status}),
			url: '/admin/feepenalty/status',
		});

		dispatch({
			type: 'CHANGE_FPT_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_FPT_REMOVE', id});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/feepenalty/remove'
		});

		if (status) {
			state.router.push(state.router.location.pathname);
			return;
		}

		dispatch({
			type: 'FPT_REMOVAL_FAILED',
		});
	};
}