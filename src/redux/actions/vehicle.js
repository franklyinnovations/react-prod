import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'vehicle';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/vehicle',
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
		type: 'START_ADD_VEHICLE',
		data: {
			make: '',
			number: '',
			fuel_type: '',
			total_seats: '',
			is_active: true,
			vehicle_type: '',
			insurance_number: '',
			registration_number: '',
			insurance_expiry_date: null,
			pollution_control_number: '',
			pollution_control_expiry_date: null,

			'vehicle_detail[name]': '',
			'vehicle_detail[model]': '',
			'vehicle_detail[colour]': '',
			'vehicle_detail[place]': '',
		},
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function hideNextDataModal() {
	return {
		type: 'HIDE_NEXT_DATA_MODAL'
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({
			type: 'SAVING_VEHICLE',
		});
		//console.log(state.item.id);
		let {data} = await api({
			url: '/admin/vehicle/save',
			data: makeApiData(state, formData),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_VEHICLE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (data.status) {
			dispatch({
				type: 'START_MAP_ROUTE',
				view
			});
			let vehicleId = data.data.id;
			return getMapRouteData(state, vehicleId, dispatch);
			//state.router.push('/transport/vehicle');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_VEHICLE_EDIT',
			view
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/vehicle/edit/' + itemId
		});
		dispatch({
			type: 'SET_VEHICLE_EDIT_DATA',
			data: {
				id: data.id,
				make: data.make,
				number: data.number,
				fuel_type: data.fuel_type,
				is_active: data.is_active,
				total_seats: data.total_seats,
				vehicle_type: data.vehicle_type,
				vehicle_image: data.vehicle_image,
				insurance_number: data.insurance_number,
				vehicle_document: data.vehicle_document,
				registration_number: data.registration_number,
				insurance_expiry_date: moment(data.insurance_expiry_date).format(state.session.userdetails.date_format),
				insurance_certificate: data.insurance_certificate,
				pollution_control_number: data.pollution_control_number,
				pollution_control_expiry_date: moment(data.pollution_control_expiry_date).format(state.session.userdetails.date_format),
				pollution_control_certificate: data.pollution_control_certificate,

				detailId: data.vehicledetails[0].id,
				'vehicle_detail[name]': data.vehicledetails[0].name,
				'vehicle_detail[place]': data.vehicledetails[0].place,
				'vehicle_detail[model]': data.vehicledetails[0].model,
				'vehicle_detail[colour]': data.vehicledetails[0].colour,
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_VEHICLE_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/vehicle/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_VEHICLE_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_VEHICLE_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/vehicle/remove'
		});

		if (status)
			state.router.push('/transport/vehicle');

		dispatch({
			type: 'VEHICLE_REMOVAL_FAILED',
		});
	};
}

export function loadRouteAddresses(state, routeId) {

	if (routeId === null) return ({type: 'UNLOAD_ROUTE_ADDRESSES'});

	return async (dispatch) => {
		dispatch({
			type: 'LOADING_ROUTE_ADDRESSES',
		});

		let {data: {addresses}} = await api({
			url: '/admin/maproutevehicle/route-addresses',
			data: makeApiData(state, {
				routeId: routeId,
			}),
		});

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

export function mapWithRoute(state, vehicleId) {
	return async dispatch => {
		dispatch({
			type: 'START_MAP_ROUTE',
			view
		});

		return getMapRouteData(state, vehicleId, dispatch);
	};
}

async function getMapRouteData(state, vehicleId, dispatch){
	let {data: {drivers, helpers, routes, rvdhsmap}} = await api({
		cookies: state.cookies,
		url: '/admin/maproutevehicle/vehicle-rvdhsmap',
		data: makeApiData(state, {
			vehicleId,
			academicSessionId: state.session.selectedSession.id,
		})
	});

	dispatch({
		type: 'INIT_MODULE_NEXT',
		view,
		vehicleId: vehicleId,
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
}

export function saveNext(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_ROUTE_VEHICLE_MAP'});

		let {data} = await api({
			url: '/admin/maproutevehicle/save',
			data: makeApiData(state, {
				id: state.itemNext.id,
				driverId: state.itemNext.driverId || '',
				helperId: state.itemNext.helperId,
				routeId: state.itemNext.routeId || '',
				rvdhsmapaddresses: state.addresses,
				vehicleId: state.meta.vehicleId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ROUTE_MAP_SAVE_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({type: 'SAVED_ROUTE_VEHICLE_MAP'});
			state.router.push('/transport/vehicle');
		}
	};
}