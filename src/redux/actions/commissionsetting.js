import api, {makeErrors, makeApiData} from '../../api';

import {messenger} from '../../utils'

const view = 'commissionsetting';

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
			url: '/admin/commission',
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

export function saveGlobalCommission(state, type) {

	return dispatch => {
		if(!state.item[type] || state.item[type] === ''){
			dispatch({
				type: 'SET_COMMISSION_ERROR',
				errors: {[type]:'Required field.'}
			})
		} else if(isNaN(parseInt(state.item[type])) || parseInt(state.item[type]) > 100){
			dispatch({
				type: 'SET_COMMISSION_ERROR',
				errors: {[type]:'Invalid Percentage.'}
			})
		} else {

			dispatch({
				type: 'SEND_SAVE_CS_REQUEST',
				name: type
			});

			return api({
				data: makeApiData(
					state,
					{
						type,
						percentage: state.item[type]
					}
				),
				url: '/admin/commission/savegc'
			})
			.then(({data}) => {
				dispatch(init(state));
			});
		}
	}
}

export function saveDSC(state, type) {

	return dispatch => {
		let errors = {};
		if(!state.item.doctorId || state.item.doctorId === ''){
			errors.doctorId = 'Required field.';
		}

		if(!state.item.doctor_percentage || state.item.doctor_percentage === ''){
			errors.doctor_percentage = 'Required field.';
		} else if(isNaN(parseInt(state.item.doctor_percentage)) || parseInt(state.item.doctor_percentage) > 100){
			errors.doctor_percentage = 'Invalid Percentage.';
		}

		if(Object.keys(errors).length !== 0){
			dispatch({
				type: 'SET_COMMISSION_ERROR',
				errors
			})
		} else {

			dispatch({
				type: 'SEND_SAVE_CS_REQUEST',
				name: 'dsc'
			});

			return api({
				data: makeApiData(
					state,
					{
						type: 'chat_consult',
						doctorprofileId: state.item.doctorId,
						percentage: state.item.doctor_percentage
					}
				),
				url: '/admin/commission/savedsc'
			})
			.then(({data}) => {
				dispatch(init(state));
			});
		}
	}
}

export function deleteCommission(state, itemId, itemIndex) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'REQUEST_DELETE_COMMISSION',
			itemIndex
		});

		return api({
			data: data,
			url: '/admin/commission/deletecommission'
		})
		.then(({data}) => {
			if(data.status){
				dispatch({
					type: 'DELETE_COMMISSION_SUCCESS',
					itemId
				});
			} else {
				dispatch(init(state));
			}
		});
	}
}
