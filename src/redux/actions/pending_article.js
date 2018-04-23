import api, { makeErrors, makeApiData } from '../../api';

const view = 'pending_article';

export function init(state) {
	let	params = {
		...state.location.query
	};

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/article/pending',
			cookies: state.cookies,
			data: makeApiData(state),
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

export function startAdd(state) {

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/doctor/article/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_LIST'
	}
}

export function handleAction(state, id, actionType) {
	let data = makeApiData(
		state,
		{
			id: id,
			actionType: actionType
		}
	);
	return dispatch => {
		dispatch({
			type: 'MODAL_PROCESSING_STATE'
		});

		return api({
			data: data,
			url: '/admin/article/changeStatus'
		})
		.then(({data}) => {
			if(data.status) {
				dispatch(init(state));
			} else {
				dispatch({
					type: 'SET_ERRORS',
					data
				});	
			}
		});
	}
}

export function save(state, formData, actionIndex) {
	formData.append('langId', state.lang.id)
	formData.append('userId', state.session.id)
	formData.append('status', actionIndex)
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/article/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.modelData.id) {
			dispatch(init(state));
		} else {
			state.router.push('/doctor/article');
		}
	});	
}