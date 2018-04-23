import api, {makeErrors, makeApiData} from '../../api';

const view = 'country';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.country.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/country',
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
			url: '/admin/country/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD_COUNTRY',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_COUNTRY_LIST'
	}
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.country.id,
			currencyId:state.country.currencyId,
			code:state.country.code,
			iso_code:state.country.iso_code,
			country_detail:
			{
				id: state.country.detailId,
				name: state.country.name
			},
			userId
		}
	);
	if (state.country.is_active) data.is_active = 1;
	return dispatch => api({
		data,
		url: '/admin/country/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_COUNTRY_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.country.id) {
			dispatch(init(state));
		} else {
			state.router.push('/admin/country');
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
			url: '/admin/country/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_COUNTRY_EDIT_DATA',
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
			url: '/admin/country/status/' + itemId + '/' + status
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