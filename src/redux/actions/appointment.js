import api, {makeApiData} from '../../api';

const view = 'appointment';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		let params = {
			...state.location.query
		}
		if(state.view && state.view.viewName == view)
			params = Object.assign(params, state.view.appointment.filter);

		const {data} = await api({
			params,
			url: '/admin/appointment',
			cookies: state.cookies,
			data: makeApiData(state),
		});

		dispatch({
			type: 'INIT_MODULE',
			data,
			view,
			stopLoading: true
		});
	};
}

export function viewAppointment(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_APPOINTMENT_CONSULT',
		});

		let {data: {data}} = await api({
			url: '/admin/appointment/view',
			data: makeApiData(state, {
				myScheduleId: itemId,
			}),
		});

		dispatch({
			type: 'LOAD_APPOINTMENT_CONSULT',
			data,
		});
	};
}