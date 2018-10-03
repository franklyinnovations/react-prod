import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'city';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/city',
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
		dispatch({type: 'START_EDIT_CITY'});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/city/add'
		});
		
		dispatch({
			type: 'START_ADD_CITY',
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
			url: '/admin/city/save',
			data: makeApiData(
				state, {
					id: state.item.id,
					alias: state.item.alias,
					userId: state.session.id,
					is_active: state.item.is_active,
					stateId: state.item.stateId || '',
					countryId: state.item.countryId || '',
					city_detail: {
						name: state.item.name,
						id: state.item.detailId,
					},
				}
			),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_CITY_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_EDIT_CITY'});

		let {data: {data, countries, states}} = await api({
			url: '/admin/city/edit',
			data: makeApiData(state, {id}),
		});
		
		dispatch({
			type: 'SET_CITY_EDIT_DATA',
			data: {
				id: data.id,
				alias: data.alias,
				stateId: data.stateId,
				countryId: data.countryId,
				is_active: data.is_active,
				name: data.citydetails[0].name,
				detailId: data.citydetails[0].id,
			},
			countries: countries.map(item => ({
				value: item.id,
				label: item.countrydetails[0].name,
			})),
			states: states.map(item => ({
				value: item.id,
				label: item.statedetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_CITY_STATUS',
			itemId,
			status: -1,
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/city/status/' + itemId + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_CITY_STATUS',
			itemId,
			status: data.status ? status : oldstatus,
		});
	};
}

export function changeCountry(state, value) {
	if (value === null)
		return {type: 'RESET_STATE_COUNTRY'};
	return async dispatch => {
		dispatch({type: 'CHANGING_STATE_COUNTRY', value});
		let {data: {data}} = await api({
			url: '/admin/state/listByCountryId',
			data: makeApiData(state, {countryId: value}),
		});
		dispatch({
			type: 'SET_CITY_STATES',
			data: data.map(item => ({
				value: item.id,
				label: item.statedetails[0].name,
			})),
		});
	};
}