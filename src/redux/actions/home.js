import api from '../../api';

const view = 'home';
export function init() {
	return dispatch => {
		
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		return api({
			method: 'get',
			url: '/session'
		})
		.then(({data}) => {
			dispatch({
				type: 'INIT_MODULE',
				view: 'home',
				session: data,
				stopLoading: true
			});
		})
		.catch(error => console.error)
	}
}