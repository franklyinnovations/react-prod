import api, {makeErrors, makeApiData} from '../../api';

const view = 'careerapply';

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

export function applyNow(state, data) {
	data.append('jobId', state.item.id);
	return dispatch => {
		dispatch({
			type: 'REQUEST_SENT_APPLY_POST',
		});
		return api({
			url: '/careers/apply',
			data: makeApiData(state, data),
		})
		.then(function ({data}) {
			if(data.errors){
				return dispatch({
					type: 'SET_APPLY_FORM_ERROR',
					errors: makeErrors(data.errors)
				});
			} else {
				if(data.status){
					state.router.push('/careers');
				} else {
					return dispatch({
						type: 'SET_APPLY_FORM_ERROR',
						errors: {}
					});
				}
			}
		})
	}
}