import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'language';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		const {data} = await api({
			url: '/admin/language',
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
		type: 'START_ADD_LANGUAGE',
		data: {
			name: '',
			code: '',
			direction: 'lr',
			is_active: 1,
		},
	};
}

export function save(state, userId) {
	return async dispatch => {
		dispatch({type: 'SEND_LANGUAGE_SAVE_REQUEST'});

		let {data} = await api({
			data: makeApiData(state, {
				id: state.item.id,
				name: state.item.name,
				code: state.item.code,
				direction: state.item.direction,
				is_active: state.item.is_active,
				userId
			}),
			url: '/admin/language/save',
		});

		if (data.errors) {
			dispatch({
				type: 'SET_LANGUAGE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/settings/language');
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_LANGUAGE_EDIT'});

		let {data} = await api({
			data: makeApiData(state, {
				id,
			}),
			url: '/admin/language/edit/' + id,
		});

		dispatch({
			type: 'SET_LANGUAGE_EDIT_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				name: data.name,
				code: data.code,
				direction: data.direction,
			},
		});
	};

}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_LANGUAGE_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/language/status/' + id + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_LANGUAGE_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}