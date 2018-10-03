import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'academicsession';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/academicsession',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_ACADEMICSESSION'
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			academicsession_detail:
			{
				id: state.item.detailId,
				name: state.item.name
			},
			start_date: state.item.start_date ? 
				moment(state.item.start_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
			end_date: state.item.end_date ?
				moment(state.item.end_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
			userId
		}
	);

	if (state.item.is_active) data.is_active = 1;
	return dispatch => api({
		data,
		url: '/admin/academicsession/save'
	})
		.then(({data}) => {
			if (data.errors)
				return dispatch({
					type: 'SET_ERRORS_ACADEMICSESSION',
					errors: makeErrors(data.errors)
				});
			let session = {...state.session};
			session.userdetails = {...session.userdetails};
			if (data.academicSession)
				session.userdetails.academicSessions = data.academicSession;
			if (state.session.userdetails.academicSessions.length === 0 && data.academicSession !== undefined)
				session.selectedSession = data.academicSession[0];

			api({
				url: '/session',
				data: session
			})
				.then(() => {
					dispatch({
						type: 'SET_ACADEMICSESSIONS',
						data: session.userdetails.academicSessions
					});
					if (state.item.id) {
						dispatch(init(state));
					} else {
						state.router.push('/setup/academicsession');
					}
				});
		});
}

export function edit(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'START_ACADEMICSESSION_EDIT',
		});

		return api({
			data: makeApiData(state),
			url: '/admin/academicsession/edit/' + itemId
		})
			.then(({data}) => {
				dispatch({
					type: 'SET_ACADEMICSESSION_EDIT_DATA',
					data: {
						id: data.id,
						name: data.academicsessiondetails[0].name,
						detailId: data.academicsessiondetails[0].id,
						start_date: moment(data.start_date).format(state.session.userdetails.date_format),
						end_date: moment(data.end_date).format(state.session.userdetails.date_format),
						is_active: data.is_active
					},
					stopLoading: true,
				});
			});
	};
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
			url: '/admin/academicsession/status/' + itemId + '/' + status
		})
			.then(({data}) => {
				dispatch({
					type: 'CHANGE_ITEM_STATUS',
					itemId,
					status
				});
			});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_ACADEMICSESSION_REMOVAL',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/academicsession/remove'
		});
		
		if (data.status) {
			state.router.push('/setup/academicsession');
			let session = {...state.session};
			session.userdetails = {...session.userdetails};
			if (data.academicSession)
				session.userdetails.academicSessions = data.academicSession;
			if (state.session.userdetails.academicSessions.length === 0 && data.academicSession !== undefined)
				session.selectedSession = data.academicSession[0];

			api({
				url: '/session',
				data: session
			})
				.then(() => {
					dispatch({
						type: 'SET_ACADEMICSESSIONS',
						data: session.userdetails.academicSessions
					});
					if (state.item.id) {
						dispatch(init(state));
					} else {
						state.router.push('/setup/academicsession');
					}
				});
			return;
		}

		dispatch({
			type: 'ACADEMICSESSION_REMOVAL_FAILED',
		});
	};
}