import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'state';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			url: '/admin/state',
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

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'START_EDIT_STATE'});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/state/add'
		});
		
		dispatch({
			type: 'START_ADD_STATE',
			countries: data.countries.map(item => ({
				value: item.id,
				label: item.countrydetails[0].name,
			})),
			data: {
				name: '',
				code: '',
				alias: '',
				countryId: null,
				is_active: true,
			},
		});
	};
}

export function save(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/state/save',
			data: makeApiData(
				state, {
					id: state.item.id,
					code:state.item.code,
					alias:state.item.alias,
					userId: state.session.id,
					countryId:state.item.countryId || '',
					is_active: state.item.is_active,
					state_detail: {
						id: state.item.detailId,
						name: state.item.name
					},
				}
			),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_STATE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_EDIT_STATE'});

		let {data: {data, countries}} = await api({
			url: '/admin/state/edit',
			data: makeApiData(state, {id}),
		});
		
		dispatch({
			type: 'SET_STATE_EDIT_DATA',
			data: {
				id: data.id,
				code: data.code,
				alias: data.alias,
				countryId: data.countryId,
				is_active: data.is_active,
				name: data.statedetails[0].name,
				detailId: data.statedetails[0].id,
			},
			countries: countries.map(item => ({
				value: item.id,
				label: item.countrydetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_STATE_STATUS',
			itemId,
			status: -1,
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/state/status/' + itemId + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_STATE_STATUS',
			itemId,
			status: data.status ? status : oldstatus,
		});
	};
}