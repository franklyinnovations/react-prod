import api, { makeErrors, makeApiData } from '../../../api';

const view = 'doctor_feedback';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor_feedback.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/doctor/feedback',
			cookies: state.cookies,
			data: makeApiData(state, {doctorProfileId: state.session.associatedProfileData.id}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			})
		})
	}
}