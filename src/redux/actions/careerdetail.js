import api, {makeErrors, makeApiData} from '../../api';

const view = 'careerdetail';

export function init(state, params) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/careers/detail',
			cookies: state.cookies,
			data: makeApiData(state, {
				id: params.id
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data: data.data,
				stopLoading: true
			})
		})
	}
}