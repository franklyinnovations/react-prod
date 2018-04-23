import api, {makeErrors, makeApiData} from '../../../api';

const view = 'clinicjobpost';

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
			url: '/hospital/job/listForClinic',
			cookies: state.cookies,
			data: makeApiData(state, {
				userId: state.session.id,
			}),
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
		type: 'VIEW_ADMIN_CLINIC_JOB_LIST'
	}
}

export function save(state, status) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			hospitalId: state.item.hospitalId || '',
			no_of_post: state.item.no_of_post,
			is_active: status,
			jobdetail: {
				id: state.item.detailId,
				title: state.item.title,
				experience: state.item.experience,
				designation: state.item.designation,
				description: state.item.description,
				qualification: state.item.qualification,
				key_skills: state.item.key_skills
			}
		}
	);
	return dispatch => {
		dispatch({
			type: 'SEND_CLINIC_JOB_SAVE_REQUEST'
		});

		return api({
			data: data,
			url: '/hospital/job/save'
		})
		.then(({data}) => {
			if (data.errors) {
				return dispatch({
					type: 'SET_CLINIC_JOB_ERRORS',
					errors: makeErrors(data.errors)
				});
			} else {
				dispatch(init(state));
			}
		});
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
			view
		});

		return api({
			data: data,
			url: '/hospital/job/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ADMIN_CLINIC_JOB_EDIT_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}

export function viewDetails(state, itemId) {
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
			url: '/hospital/job/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ADMIN_CLINIC_JOB_VIEW_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}

export function jobPublish(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state, {
				id:itemId,
				is_active: 2
			}),
			url: '/hospital/job/status'
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status: 2
			});
		});
	}
}