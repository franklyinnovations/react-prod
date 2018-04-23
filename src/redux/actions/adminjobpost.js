import api, {makeErrors, makeApiData} from '../../api';

const view = 'adminjobpost';

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
			url: '/hospital/job/list',
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

export function viewList() {
	return {
		type: 'VIEW_ADMIN_JOB_LIST'
	}
}

export function viewDetail(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/hospital/job/viewDetail'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ADMIN_JOB_VIEW_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}

export function handleStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state, {
				id:itemId,
				is_active: status === 2 ? 0:2
			}),
			url: '/hospital/job/status'
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status: status === 2 ? 0:2
			});
		});
	}
}