import api, {makeErrors, makeApiData} from '../../../api';

const view = 'clinicschedule';

export function init(state, hospitalId) {
	let params = {...state.location.query};
	if(state.view && state.view.viewName == view)
		params = Object.assign(params, state.view.clinicschedule.filter);
	if (!hospitalId) {
		hospitalId = state.session.allHospitalProfiles
			&& state.session.allHospitalProfiles[0].id
	}
	if (! hospitalId) {
		return {
			type: 'INIT_MODULE',
			view,
		};
	}
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data: {data, list}} = await api({
			params,
			url: '/doctor/myschedule/hospital',
			cookies: state.cookies,
			data: makeApiData(state, {
				doctorProfileId: hospitalId,
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true
		});
	};
}

export function activeSchedule(state, hospitalId) {
	return async dispatch => {
		await api({
			url: '/doctor/myschedule/active-schedule',
			data: makeApiData(state, {
				doctorProfileId: hospitalId,
			}),
		});
		dispatch(init(state, hospitalId));		
	}
}
