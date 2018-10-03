import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'vehiclebreakdown';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/vehiclebreakdown',
			cookies: state.cookies,
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			rvdhsmaps: data.rvdhsmaps.map(rvdhsmap => ({
				value: rvdhsmap.id,
				label: rvdhsmap.vehicle.vehicledetails[0].name,
			}))
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_VBD',
		data: {
			date: '',
			rvdhsmapId: null,
			replacementRvdhsmapId: null,
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
		let {data} = await api({
			url: '/admin/vehiclebreakdown/save',
			data: makeApiData(state, {
				id: state.item.id,
				date: moment(state.item.date, state.session.userdetails.date_format).format('YYYY/MM/DD'),
				rvdhsmapId: state.item.rvdhsmapId || '',
				replacementRvdhsmapId: state.item.replacementRvdhsmapId || '',
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_VBD_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/transport/breakdown');
		}
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_VBD_EDIT',
			view
		});

		let {data: {vehiclebreakdown: data}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/vehiclebreakdown/edit'
		});

		dispatch({
			type: 'SET_VBD_EDIT_DATA',
			data: {
				id: data.id,
				date: moment(data.date).format(state.session.userdetails.date_format),
				rvdhsmapId: data.rvdhsmapId,
				replacementRvdhsmapId: data.replacementRvdhsmapId,
			},
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_VBD_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/vehiclebreakdown/remove'
		});

		if (status)
			state.router.push('/transport/breakdown');

		dispatch({
			type: 'VBD_REMOVAL_FAILED',
		});
	};
}