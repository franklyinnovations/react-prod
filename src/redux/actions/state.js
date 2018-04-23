import api, {makeErrors, makeApiData} from '../../api';

const view = 'state';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.state.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/state',
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
			url: '/admin/state/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD_STATE',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_STATE_LIST'
	}
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			countryId:state.item.countryId,
			code:state.item.code,
			alias:state.item.alias,
			state_detail:
			{
				id: state.item.detailId,
				name: state.item.name
			},
			userId
		}
	);
	if (state.item.is_active) data.is_active = 1;
	return dispatch => api({
		data,
		url: '/admin/state/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_STATE_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/admin/state');
		}
	});
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
			view
		});

		return api({
			data: data,
			url: '/admin/state/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_STATE_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
	}
}

export function changeStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/state/status/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status
			});
		});
	}
}
