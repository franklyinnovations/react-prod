import api, { makeErrors, makeApiData } from '../../../api';

const view = 'hospital_feedback';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.hospital_feedback.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/hospital/feedback',
			cookies: state.cookies,
			data: makeApiData(state, {hospitalId: state.session.associatedProfileData.id}),
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