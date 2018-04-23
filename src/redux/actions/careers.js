import api, {makeErrors, makeApiData} from '../../api';

const view = 'careers';

export function init(state, page) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/careers',
			cookies: state.cookies,
			data: makeApiData(state, {
				page 
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