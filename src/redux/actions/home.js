import api from '../../api';

export function init() {
	return dispatch => api({
		method: 'get',
		url: '/session'
	})
	.then(({data}) => {
		dispatch({
			type: 'INIT_MODULE',
			view: 'home',
			session: data
		});
	})
	.catch(error => console.error)
}