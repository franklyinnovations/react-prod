import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'curriculum';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/board',
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
		type: 'START_ADD_CURRICULUM'
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
			url: '/admin/board/save',
			data: makeApiData(state, {
				id: state.item.id,
				board_detail:{
					name: state.item.name,
					alias: state.item.alias,
					id: state.item.detailId,
					boardId: state.item.id,
				},
				userId: state.session.id,
				is_active: state.item.is_active,
				display_order: state.item.display_order,
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_CURRICULUM_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/setup/curriculum');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_CURRICULUM_EDIT',
			view
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/board/edit/' + itemId
		});
		dispatch({
			type: 'SET_CURRICULUM_EDIT_DATA',
			data: {
				id: data.id,
				display_order: data.display_order,
				is_active: data.is_active,
				name: data.boarddetails[0].name,
				alias: data.boarddetails[0].alias,
				detailId: data.boarddetails[0].id
			},
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/board/status/' + itemId + '/' + status
		});

		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_CURRICULUM_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/board/remove'
		});

		if (status)
			state.router.push('/setup/curriculum');

		dispatch({
			type: 'CURRICULUM_REMOVAL_FAILED',
		});
	};
}