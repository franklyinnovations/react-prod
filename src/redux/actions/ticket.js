import api, {makeErrors, makeApiData} from '../../api';

const view = 'ticket';

export function init(state) {
	let filters = [], params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view){
		params = Object.assign(params, state.view[view].filter);
		filters = state.view[view].query.filters;
	}
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		return api({
			params,
			url: '/admin/ticket',
			cookies: state.cookies,
			data: makeApiData(state, {
				user_type: state.session.user_type,
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				query: filters,
				data,
				stopLoading: true,
			})
		});
	}
}

export function startAdd(state) {
	return {
		type: 'START_ADD_TICKET',
	};
}

export function viewList() {
	return {
		type: 'VIEW_TICKET_LIST'
	}
}
export function updateData(name,value) {
	return {
		type: 'UPDATE_TICKET_DATA_VALUE',
		name,
		value,
	}
}
export function updateEditData(name,value) {
	return {
		type: 'UPDATE_TICKET_EDIT_DATA',
		name,
		value,
	}
}

export function save(state, data) {
	return dispatch => {
		dispatch({
			type: 'SEND_TICKET_REQUEST',
		});
		data.append('userId', state.session.id);
		data.append('userType',state.session.user_type)
		
		return api({
			data: makeApiData(state, data),
			url: '/admin/ticket/save'
		})
		.then(({data}) => {
			if (data.errors) {
				return dispatch({
					type: 'SET_TICKET_ERRORS',
					errors: makeErrors(data.errors)
				});
			} else if (!data.status) {
				dispatch({
					type: 'SET_TICKET_ERRORS',
					errors: {}
				});
			} else if (state.item.id) {
				dispatch(init(state));
			} else {
				state.router.push('/ticket');
			}
		});
	}
}

export function edit(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			url: '/admin/ticket/edit/' + itemId,
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
		})
		.then(({data}) => {
			var date = Date.parse(data.ticketmessages[data.ticketmessages.length - 1].createdAt) > 
			Date.parse(data.updatedAt) ? 
			data.ticketmessages[data.ticketmessages.length - 1].createdAt : data.updatedAt;

			for (var i = data.ticketmessages.length - 1; i >= 0; i--) {
				data.ticketmessages[i].files = JSON.parse(data.ticketmessages[i].files);
			}
			dispatch({
				type: 'SET_TICKET_EDIT_DATA',
				data,
				stopLoading:true
			});
		});
	}
}

export function update(state, data) {
	return dispatch => {
		data.append('userId', state.session.id);
		data.append('userType',state.session.user_type)
		return api({
			data: makeApiData(state, data),
			url: '/admin/ticket/message'
		})
		.then(({data}) => {
			if (data.errors) {
				return dispatch({
					type: 'SET_TICKET_ERRORS',
					errors: makeErrors(data.errors)
				});
			}
			else {
				state.router.push('/ticket');
			}
		});
	}
}


export function changeStatus(state, status) {
	return dispatch => {
		let oldStatus = state.edititem.status;

		dispatch({
			type: 'CHANGE_TICKET_STATUS',
			status: -1,
		});

		return api({
			data: makeApiData(state),
			url: '/admin/ticket/status/' + state.edititem.id + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_TICKET_STATUS',
				status: data.status ? status : oldStatus,
			});
			state.router.push('/ticket');
		});
	}
}

export function changeClosedStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/ticket/status/' + itemId + '/' + status
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