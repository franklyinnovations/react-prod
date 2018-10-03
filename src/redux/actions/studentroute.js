import api, {makeApiData} from '../../api';

const view  = 'studentroute';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		const {data: {bcsmaps, routes}} = await api({
			url: '/admin/studentroute/bcsmaps-routes',
			cookies: state.cookies,
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			routes,
			bcsmaps,
		});
	};
}

export function loadRvdhsmaps(state, routeId) {
	if (routeId === null) {
		return {type: 'LOAD_STR_RVDHSMAPS', rvdhsmaps: false};
	}
	return async dispatch => {
		dispatch({type: 'LOADING_STR_RVDHSMAPS'});

		let {data: {rvdhsmaps}} = await api({
			url: '/admin/studentroute/rvdhsmaps',
			data: makeApiData(state, {
				routeId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		dispatch({
			type: 'LOAD_STR_RVDHSMAPS',
			rvdhsmaps: rvdhsmaps.map(rvdhsmap => ({
				value: rvdhsmap.id,
				total_seats: rvdhsmap.vehicle.total_seats,
				label: rvdhsmap.vehicle.vehicledetails[0].name,
			})),
		});
	};
}

export function loadStudents(state) {
	let errors = {};
	if (state.selector.routeId === null) {
		errors.routeId = window.__('This is a required field.');
	}
	if (state.selector.rvdhsmapId === null) {
		errors.rvdhsmapId = window.__('This is a required field.');
	}
	if (Object.keys(errors).length !== 0) {
		return {type: 'SET_SELECTOR_ERRORS', errors};
	}

	const rvdhsmap = state.meta.rvdhsmaps.find(item => item.value === state.selector.rvdhsmapId);

	return async dispatch => {
		dispatch({type: 'LOADING_STR_STUDENTS'});

		let {data: {students, rvdhsmapaddresses}} = await api({
			url: '/admin/studentroute/students',
			data: makeApiData(state, {
				...state.selector,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		let drops = 0, pickups = 0;

		for (let i = students.length - 1; i >= 0; i--) {
			students[i].rvdhsmaprecord = students[i].rvdhsmaprecord || {
				dropId: null,
				pickupId: null,
			};
			if (students[i].rvdhsmaprecord.dropId)
				drops += 1;
			if (students[i].rvdhsmaprecord.pickupId)
				pickups += 1;
		}

		dispatch({
			type: 'SET_STR_STUDENTS',
			students,
			rvdhsmap,
			rvdhsmapaddresses: rvdhsmapaddresses.map(rvdhsmapaddress => ({
				value: rvdhsmapaddress.id,
				label: rvdhsmapaddress.routeaddress.address,
			})),
			transportTypes: getTransportTypes(),
			stats:{
				drops,
				pickups,
				seats: rvdhsmap.total_seats,
			}
		});
	};
}

export function save(state) {
	return async dispatch => {
		let drops = 0,
			pickups = 0,
			updated = [],
			removed = [],
			errors = {},
			items = state.items,
			rvdhsmap = state.meta.rvdhsmap;

		for (let i = items.length - 1; i >= 0; i--) {
			let item = items[i].rvdhsmaprecord;
			if (item.pickupId) pickups += 1;
			if (item.dropId) drops += 1;
			if (item.dropId || item.pickupId) {
				updated.push({
					dropId: item.dropId,
					studentId: items[i].id,
					pickupId: item.pickupId,
					rvdhsmapId: rvdhsmap.value,
				});
			} else {
				removed.push(items[i].id);
			}
		}

		if (rvdhsmap.total_seats < drops) errors.drops = true;
		if (rvdhsmap.total_seats < pickups) errors.pickups = true;

		if (Object.keys(errors).length !== 0) {
			dispatch({type: 'SET_STR_SAVE_ERRORS', errors});
			return;
		}

		dispatch({type: 'SAVING_STR'});

		await api({
			url: '/admin/studentroute/save',
			data: makeApiData(state, {
				updated,
				removed,
				rvdhsmapId: rvdhsmap.value,
			}),
		});

		dispatch({
			type: 'SAVED_STR',
			stats: {
				drops,
				pickups,
				seats: rvdhsmap.total_seats,
			}
		});
	};
}

function getTransportTypes() {
	return [
		{label: window.__('Pick up'), value: 1},
		{label: window.__('Drop'), value: 2},
		{label: window.__('Both'), value: 3},
	];
}