import api, {makeErrors, makeApiData} from '../../../api';

const view = 'clinicapplication';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view[view].filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/hospital/jobapplication/listForClinic',
			cookies: state.cookies,
			data: makeApiData(state, {
				userId: state.session.id
			}),
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