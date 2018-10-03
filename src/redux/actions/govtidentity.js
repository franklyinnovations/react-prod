import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'govtidentity';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/govtidentity',
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
		dispatch({type: 'START_EDIT_GIY'});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/govtidentity/add'
		});
		
		dispatch({
			type: 'START_ADD_GIY',
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
				display_order: '',
			},
		});
	};
}

export function save(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/govtidentity/save',
			data: makeApiData(
				state, {
					id: state.item.id,
					userId: state.session.id,
					is_active: state.item.is_active,
					countryId: state.item.countryId || '',
					display_order: state.item.display_order,
					govtidentity_detail: {
						name: state.item.name,
						id: state.item.detailId,
						alias: state.item.alias,
					},
				}
			),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_GIY_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_EDIT_GIY'});

		let {data: {data, countries}} = await api({
			url: '/admin/govtidentity/edit',
			data: makeApiData(state, {id}),
		});
		
		dispatch({
			type: 'SET_GIY_EDIT_DATA',
			data: {
				id: data.id,
				countryId: data.countryId,
				is_active: data.is_active,
				display_order: data.display_order,
				name: data.govtidentitydetails[0].name,
				alias: data.govtidentitydetails[0].alias,
				detailId: data.govtidentitydetails[0].id,
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
			type: 'CHANGE_GIY_STATUS',
			itemId,
			status: -1,
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/govtidentity/status/' + itemId + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_GIY_STATUS',
			itemId,
			status: data.status ? status : oldstatus,
		});
	};
}