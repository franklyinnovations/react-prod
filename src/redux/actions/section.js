import api, {makeErrors, makeApiData} from '../../api';

const view = 'section';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.section.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/section',
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

export function startAdd() {
	return {
		type: 'START_ADD_SECTION'
	}
}

export function viewList() {
	return {
		type: 'VIEW_LIST'
	}
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.section.id,
			section_detail:
			{
				name: state.section.name,
				id: state.section.detailId
			},
			display_order: state.section.display_order,
			userId
		}
	);

	if (state.section.is_active) data.is_active = 1;
	return dispatch => api({
		data,
		url: '/admin/section/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.section.id) {
			dispatch(init(state));
		} else {
			state.router.push('/section');
		}
	});
}

export function edit(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/admin/section/edit/' + itemId
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_SECTION_EDIT_DATA',
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
			url: '/admin/section/status/' + itemId + '/' + status
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