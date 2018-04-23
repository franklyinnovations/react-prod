import api, {makeErrors, makeApiData} from '../../api';

const view = 'city';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.city.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/city',
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
			url: '/admin/city/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD_CITY',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_CITY_LIST'
	}
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			countryId:state.item.countryId,
			stateId:state.item.stateId,
			code:state.item.code,
			alias:state.item.alias,
			city_detail:
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
		url: '/admin/city/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_CITY_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/admin/city');
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
			url: '/admin/city/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_CITY_EDIT_DATA',
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
			url: '/admin/city/status/' + itemId + '/' + status
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

export function updateData(name, value) {
	return {
		type: 'UPDATE_CITY_DATA_VALUE',
		name,
		value
	};
}

export function updateAvailableState(state, countryId) {
	return dispatch => {
		dispatch({
			type: 'LOAD_AVAILABLE_STATE'
		});
		api({
			url: '/admin/state/listByCountryId',
			data: makeApiData(state, {
				countryId
			})
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_AVAILABLE_STATE',
				data: data.data
			})
		});
	}
}
