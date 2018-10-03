import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'country';

export function init(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/admin/country',
			cookies: state.cookies,
			params: paramsFromState(state, view),
			data: makeApiData(state),
		})
			.then(function ({data}) {
				dispatch({
					type: 'INIT_MODULE',
					view,
					data,
				});
			});
	};
}

export function startAdd(state) {
	return dispatch => {
		return api({
			data: makeApiData(state),
			url: '/admin/country/add'
		})
			.then(({data}) => {
				dispatch({
					type: 'START_ADD_COUNTRY',
					data,
				});
			});
	};
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			currencyId:state.item.currencyId || '',
			code:state.item.code,
			iso_code:state.item.iso_code || '',
			country_detail:
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
		url: '/admin/country/save'
	})
		.then(({data}) => {
			if (data.errors)
				return dispatch({
					type: 'SET_COUNTRY_ERRORS',
					errors: makeErrors(data.errors)
				});
			if (state.item.id) {
				dispatch(init(state));
			} else {
				state.router.push(state.router.location.pathname);
			}
		});
}

export function edit(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		return api({
			data: data,
			url: '/admin/country/edit'
		})
			.then(({data}) => {
				dispatch({
					type: 'SET_COUNTRY_EDIT_DATA',
					data,
					stopLoading: true,
				});
			});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/country/status/' + itemId + '/' + status
		})
			.then(({data}) => {
				dispatch({
					type: 'CHANGE_ITEM_STATUS',
					itemId,
					status: data.status ? status : oldstatus
				});
			});
	};
}