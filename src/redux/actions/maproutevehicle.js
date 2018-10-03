import api, {makeApiData, makeErrors} from '../../api';
export {update} from './index';

const view = 'maproutevehicle';

export function init(state, {vehicleId}) {
	return async dispatch => {

		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let {data: {drivers, helpers, routes, rvdhsmap}} = await api({
			cookies: state.cookies,
			url: '/admin/maproutevehicle/vehicle-rvdhsmap',
			data: makeApiData(state, {
				vehicleId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			routes: routes.map(route => ({
				value: route.id,
				label: route.name,
			})),
			drivers: drivers.map(user => ({
				value: user.id,
				label: user.userdetails[0].fullname,
			})),
			helpers: helpers.map(user => ({
				value: user.id,
				label: user.userdetails[0].fullname,
			})),
			rvdhsmap: rvdhsmap === null ? {
				routeId: null,
				driverId: null,
				helperId: null,
				addresses: false,
			} : {
				id: rvdhsmap.id,
				routeId: rvdhsmap.routeId,
				driverId: rvdhsmap.driverId,
				helperId: rvdhsmap.helperId,
				addresses: rvdhsmap.route.routeaddresses.map(routeaddress =>
					routeaddress.rvdhsmapaddress ? {
						label: routeaddress.address,
						routeaddressId: routeaddress.id,
						id: routeaddress.rvdhsmapaddress.id,
						drop_time: routeaddress.rvdhsmapaddress.drop_time,
						pick_up_time: routeaddress.rvdhsmapaddress.pick_up_time,
					} : {
						drop_time: null,
						pick_up_time: null,
						label: routeaddress.address,
						routeaddressId: routeaddress.id,
					}
				),
			},
		});
	};
}

export function loadRouteAddresses(state, routeId) {

	if (routeId === null) return ({type: 'UNLOAD_ROUTE_ADDRESSES'});

	return async (dispatch, getState) => {
		dispatch({
			type: 'LOADING_ROUTE_ADDRESSES',
		});

		let {data: {addresses}} = await api({
			url: '/admin/maproutevehicle/route-addresses',
			data: makeApiData(state, {
				routeId: routeId,
			}),
		});

		let currentState = getState();
		if (currentState.view.name !== view || currentState.view.state.item.routeId !== routeId)
			return;

		dispatch({
			type: 'SET_ROUTE_ADDRESSES',
			data: addresses.map(address => ({
				drop_time: null,
				pick_up_time: null,
				routeaddressId: address.id,
				label: address.address,
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_ROUTE_VEHICLE_MAP'});

		let {data} = await api({
			url: '/admin/maproutevehicle/save',
			data: makeApiData(state, {
				id: state.item.id,
				driverId: state.item.driverId || '',
				helperId: state.item.helperId,
				routeId: state.item.routeId || '',
				rvdhsmapaddresses: state.addresses,
				vehicleId: state.router.params.vehicleId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ROUTE_MAP_SAVE_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.goBack();
		}
	};
}