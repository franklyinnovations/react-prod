import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'tag';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const {data} = await api({
			url: '/admin/tag',
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

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SEND_ADD_TAG_REQUEST'});
		let {data} = await api({
			url: '/admin/tag/save',
			data: makeApiData(state, {
				id: state.item.id,
				userId: state.session.id,
				tagdetail: {
					id: state.item.detailId,
					title: state.item.title,
					description: state.item.description,
				},
				type: state.item.id ? undefined : (state.item.type || ''),
				is_active: state.item.is_active,
			}),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_TAG_SAVE_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.push('/general/tag');
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_TAG_EDIT_DATA'});
		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/tag/edit/' + id
		});
		dispatch({
			type: 'SET_TAG_EDIT_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				type: data.type,
				title: data.tagdetails[0].title,
				detailId: data.tagdetails[0].id,
				description: data.tagdetails[0].description,
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
			url: '/admin/tag/status/' + itemId + '/' + status
		});

		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: data.status ? status : oldstatus
		});
	};
}

