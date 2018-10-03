import api, {makeApiData} from '../../api';

const view = 'vehicletracking';

export function init(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE', view});

		const [{data: {rvdhsmaps}}, {data: {trips}}] = await Promise.all([
			api({
				url: '/admin/transport/rvdhsmaps',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
			api({
				url: '/admin/transport/active-trips',
				cookies: state.cookies,
				data: makeApiData(state),
			}),
		]);

		dispatch({
			type: 'INIT_MODULE',
			view,
			trips,
			rvdhsmaps,
		});
	};
}

export function showTrip(state, tripId) {
	return async dispatch => {
		dispatch({type: 'LOADING_VTK_TRIP'});
		const {data: {data}} = await api({
			url: '/admin/transport/trip-info',
			data: makeApiData(state, {id: tripId}),
		});
		dispatch({type: 'LOAD_VTK_TRIP', data});
	};
}