import api from '../../api';

export function init(data, params, cookies) {
	return dispatch => api({
		url: '/admin/academicsession',
		cookies,
		data,
		params
	})
	.then(function ({data}) {
		dispatch({
			type: 'INIT_MODULE',
			view: 'academicsession',
			data
		})
	})
}