import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'feehead';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			params: paramsFromState(state, view),
			url: '/admin/feehead',
			cookies: state.cookies,
			data: makeApiData(state),
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
		dispatch({type: 'SAVING_FHD'});
		let feehead = {
			id: state.item.id,
			type: state.item.type || '',
			is_active: state.item.is_active,
			no_of_installments: state.item.no_of_installments,
			feeheaddetail: {
				name: state.item.name,
				alias: state.item.alias,
			},
		};
		if (!feehead.id && feehead.type === 'Transportation') {
			feehead.vehicle_type = state.item.vehicle_type || '';
			if (state.item.transportationFeeType === 'lumsum') {
				feehead.routeId = null;
				feehead.routeaddressId = null;
			} else if (state.item.transportationFeeType === 'route') {
				feehead.routeId = state.item.routeId || '';
				feehead.routeaddressId = null;
			} else if (state.item.transportationFeeType === 'stoppage') {
				feehead.routeId = state.item.routeId || '';
				feehead.routeaddressId = state.item.routeaddressId || '';
			} else {
				feehead.transportationFeeType = '';
			}
		} else if (feehead.id) {
			delete feehead.type;
		}

		let {data} = await api({
			url: '/admin/feehead/save',
			data: makeApiData(state, feehead),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_FHD_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.push(state.router.location.pathname);
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_FHD_EDIT_DATA'});
		let {data} = await api({
			data: makeApiData(state, {
				id,
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/feehead/edit'
		});

		let item = data.data,
			transportationFeeType = null;
		if (item.type === 'Transportation') {
			if (item.routeId === null) {
				transportationFeeType = 'lumsum';
			} else if (item.routeaddressId === null) {
				transportationFeeType = 'route';
			} else {
				transportationFeeType = 'stoppage';
			}
		}

		dispatch({
			type: 'SET_FHD_EDIT_DATA',
			data: {
				id: item.id,
				type: item.type,
				transportationFeeType,
				routeId: item.routeId,
				is_active: item.is_active,
				vehicle_type: item.vehicle_type,
				name: item.feeheaddetails[0].name,
				alias: item.feeheaddetails[0].alias,
				routeaddressId: item.routeaddressId,
				no_of_installments: item.no_of_installments,
			},
			routes: item.route ? [{
				value: item.route.id,
				label: item.route.name,
			}] : [],
			routeaddresses: item.routeaddress ? [{
				value: item.routeaddress.id,
				label: item.routeaddress.address,
			}] : [],
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_FHD_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {id, status}),
			url: '/admin/feehead/status',
		});

		dispatch({
			type: 'CHANGE_FHD_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function loadRoutes(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_FHD_ROUTES'});
		let {data: {data}} = await api({
			data: makeApiData(state),
			url: '/admin/feehead/routes',
		});
		dispatch({
			type: 'LOAD_FHD_ROUTES',
			data: data.map(item => ({
				value: item.id,
				label: item.name,
			}))
		});
	};
}

export function loadRouteAddresses(state) {
	let routeId = state.item.routeId;
	if (routeId === null) return {type: 'RESET_FHD_ROUTE'};
	return async dispatch => {
		dispatch({type: 'LOADING_FHD_ROUTE_ADDRESSES'});
		let {data: {data}} = await api({
			data: makeApiData(state, {routeId}),
			url: '/admin/feehead/route-addresses',
		});
		dispatch({
			type: 'LOAD_FHD_ROUTE_ADDRESSES',
			data: data.map(item => ({
				value: item.id,
				label: item.address,
			})),
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_FHD_REMOVE', id});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/feehead/remove'
		});

		if (status) {
			state.router.push(state.router.location.pathname);
			return;
		}

		dispatch({
			type: 'FHD_REMOVAL_FAILED',
		});
	};
}