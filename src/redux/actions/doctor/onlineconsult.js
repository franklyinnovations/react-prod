import api, {makeErrors, makeApiData} from '../../../api';

const view = 'onlineconsult';

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
			url: '/doctor/onlineconsult',
			cookies: state.cookies,
			data: makeApiData(state, {
				doctorprofileId: state.session.associatedProfileData.id
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

export function getStart(state, status){
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/onlineconsult/getStart',
			cookies: state.cookies,
			data: makeApiData(state, {
				doctorprofileId: state.session.associatedProfileData.id,
				available_for_consult: status
			}),
		})
		.then(function ({data}) {
			dispatch(init(state))
		})
	}
}

export function editSetting(state){
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/onlineconsult/editSetting',
			cookies: state.cookies,
			data: makeApiData(state, {
				doctorprofileId: state.session.associatedProfileData.id
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'SET_OC_SETTING_DATA',
				data: data.data,
				stopLoading: true
			})
		})
	}
}

export function saveSetting(state){
	return dispatch => {
		dispatch({
			type: 'REQUEST_OC_SAVE_SETTING'
		});
		return api({
			url: '/doctor/onlineconsult/saveSetting',
			data: makeApiData(state, {
				id: state.item.id,
				available_for_consult: state.item.available_for_consult,
				freeqa_notification: state.item.freeqa_notification,
				chat_notification: state.item.chat_notification,
				account_holder_name: state.item.account_holder_name,
				account_number: state.item.account_number,
				account_type: state.item.account_type,
				bank_name: state.item.bank_name,
				bank_branch_city: state.item.bank_branch_city,
				bank_ifsc_code: state.item.bank_ifsc_code,
				consultation_fee: state.item.consultation_fee,
			}),
		})
		.then(function ({data}) {
			if (data.data.errors) {
				return dispatch({
					type: 'SET_OC_SETTING_ERRORS',
					errors: makeErrors(data.data.errors)
				});
			} else {
				dispatch(init(state));
			}
		})
	}
}

export function notificationFreeQA(state, name){
	return dispatch => {
		dispatch({
			type: 'REQUEST_FQA_NOTIFICATION',
			name
		});
		return api({
			url: '/doctor/onlineconsult/notificationFreeQA',
			data: makeApiData(state, {
				id: state.item.id,
				[name]: state.item[name] ? 0:1
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'UPDATE_FQA_NOTIFICATION',
				name,
				status: data.status ? (state.item[name] ? 0:1):state.item[name]
			})
		})
	}
}