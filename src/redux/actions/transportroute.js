import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'transportroute';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/route',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_TR',
		data: {
			name: '',
			routeaddresses: [],
			is_active: true,
			addressIndex: '',			
		}
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state) {
	return async dispatch => {
		const {data} = await api({
			url: '/admin/route/save',
			data: makeApiData(state, state.item),
		});

		if (data.errors)
			return dispatch({
				type: 'SET_TR_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/transport/transportroute');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_TR_EDIT',
			view
		});

		const {data} = await api({
			data: makeApiData(state),
			url: '/admin/route/edit/' + itemId
		});
		data.routeaddresses.forEach(
			routeaddress => routeaddress.theId = Math.floor(Math.random() * 16777216)
		);
		dispatch({
			type: 'SET_TR_EDIT_DATA',
			data,
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_TR_STATUS',
			id,
			status: -1
		});

		const {data} = await api({
			data: makeApiData(state),
			url: '/admin/route/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_TR_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function addPlace(routeaddress) {
	routeaddress.theId = Math.floor(Math.random() * 16777216);
	return {
		type: 'ADD_TR_ADDRESS',
		routeaddress,
	};
}

export function updateOrder(oldIndex, newIndex) {
	return {
		type: 'UPDATE_TR_ADDRESS_ORDER',
		oldIndex,
		newIndex,
	};
}

export function removeRouteAddress(state, index, itemId) {
	if (itemId) {
		return async dispatch => {
			dispatch({
				type: 'REMOVE_TR_ADDRESS_REQUEST',
				index,
			});

			const {data} = await api({
				data: makeApiData(state, {
					id: itemId
				}),
				url: '/admin/route/removeAddress'
			});

			if (data.status) {
				dispatch({
					type: 'REMOVE_TR_ADDRESS',
					index,
				});
			} else {
				dispatch({
					type: 'INVALID_REMOVE_TR_ADDRESS',
				});
			}
		};
	} else {
		return {
			type: 'REMOVE_TR_ADDRESS',
			index,
		};
	}
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({type: 'START_TR_REMOVE'});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/route/remove'
		});

		if (status) {
			state.router.push('/transport/transportroute');
			return;
		}

		dispatch({type: 'TR_REMOVAL_FAILED'});
	};
}