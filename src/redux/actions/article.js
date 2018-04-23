import api, { makeErrors, makeApiData } from '../../api';

const view = 'article';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.article.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/article',
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

export function edit(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			type: 'RESET_FILTERS',
			view
		});

		return api({
			data: data,
			url: '/admin/doctor/edit/'+itemId
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_EDIT_DATA',
				data,
				stopLoading: true
			});
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

export function changeActiveStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_ACTIVE_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/article/active-status/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_ACTIVE_STATUS',
				itemId,
				status
			});
		});
	}
}