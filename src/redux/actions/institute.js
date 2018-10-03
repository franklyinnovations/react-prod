import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, messenger} from '../../utils';
export {updateFilter, update} from './index';

const view = 'institute';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			params: paramsFromState(state, view),
			url: '/admin/institute',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_INSTITUTE_EDIT',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/institute/add'
		});
		dispatch({
			type: 'START_ADD_INSTITUTE',
			data
		});
	};
}

export function viewList() {
	return {
		type: 'VIEW_INSTITUTE_LIST'
	};
}

export function save(state, formdata) {
	formdata.append('loginUrl', window.location.origin + '/login');
	formdata.append('parentId', state.session.id);
	return async dispatch => {
		dispatch({
			type: 'SEND_ADD_INSTITUTE_REQUEST',
		});
		let {data} = await api({
			data: makeApiData(state, formdata),
			url: '/admin/institute/save'
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_INSTITUTE_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_INSTITUTE_SAVE_ERRORS',
				errors: {}
			});
		} else if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/institute/setup');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_INSTITUTE_EDIT',
		});

		let {data} = await api({
			data: makeApiData(state, {id:itemId}),
			url: '/admin/institute/edit'
		});
		dispatch({
			type: 'SET_INSTITUTE_EDIT_DATA',
			data,
		});
	};
}

export function emailSent(state, itemId) {
	return async dispatch => {
		dispatch({ 
			type: 'SEND_INSTITUTE_LOGIN_INFO', 
			itemId, 
		}); 
		await api({
			data: makeApiData(state, {
				loginUrl: window.location.origin + '/login',
				resetPassUrl: window.location.origin + '/forgot-password/'
			}),
			url: '/admin/institute/resend_registration_email/' + itemId
		});
		dispatch({ 
			type: 'INSTITUTE_LOGIN_INFO_SENT', 
			itemId, 
		});
	};
}

export function emailSentBank(state, itemId) {
	return async dispatch => {
		dispatch({ 
			type: 'SEND_INSTITUTE_LOGIN_INFO', 
			itemId, 
		});
		await api({
			data: makeApiData(state, {
				loginUrl: window.location.origin + '/login',
				resetPassUrl: window.location.origin + '/forgot-password/'
			}),
			url: '/admin/institute/send_email_bank/' + itemId
		});
		dispatch({ 
			type: 'INSTITUTE_LOGIN_INFO_SENT', 
			itemId, 
		});
	};
}

export function changeStatus(state, itemId, status) {
	let data = makeApiData(state);
	data.masterId = itemId;
	return async dispatch => {
		dispatch({
			type: 'CHANGE_INSTITUTE_STATUS',
			itemId,
			status: -1
		});

		await api({
			data: data,
			url: '/admin/institute/status/' + itemId + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_INSTITUTE_STATUS',
			itemId,
			status
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_INSTITUTE_DATA_VALUE',
		name,
		value
	};
}

export function updateAuthKeyData(name, value) {
	return {
		type: 'UPDATE_AUTHKEY_DATA_VALUE',
		name,
		value
	};
}

export function saveAuthKey(state){
	return dispatch => {
		let errors = {};
		let letters = /^[A-Za-z]+$/;  
      
		if(!state.helperData.smsProviderAuthKey){
			errors.smsProviderAuthKey = window.__('This is a required field.');
		}

		if(state.helperData.smsProvider == 1){
			if(!state.helperData.smsSenderName){
				errors.smsSenderName = window.__('This is a required field.');
			}else if(!(state.helperData.smsSenderName).match(letters) || (state.helperData.smsSenderName).length !== 6) {
				errors.smsSenderName = window.__('Please enter alphabets of only 6 character in length.');
			}
		}

		if(state.helperData.smsProvider == 3){
			if(!state.helperData.smsSenderName){
				errors.smsSenderName = window.__('This is a required field.');
			}else if(!(state.helperData.smsSenderName).match(letters) || (state.helperData.smsSenderName).length > 11) {
				errors.smsSenderName = window.__('Please enter alphabets of maximum 11 character in length.');
			}
		}

		if(Object.keys(errors).length > 0){
			return dispatch({
				type: 'SET_AUTHKEY_SAVE_ERRORS',
				errors
			});
		}else {
			dispatch({
				type: 'SEND_AUTHKEY_REQUEST'
			});
			return api({
				data: makeApiData(state, {
					instituteId: state.helperData.instituteId,
					smsProviderAuthKey: state.helperData.smsProviderAuthKey,
					smsSenderName: state.helperData.smsSenderName
				}),
				url: '/admin/institute/updateAuthKey/'
			})
				.then(() => {
					dispatch({
						type:'CLOSE_INSTITUTE_MODAL'
					});
				});
		}
	};
}

export function authKeyModal(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'SHOW_AUTHKEY_MODAL',
			itemId
		});

		let {data} = await api({
			data: makeApiData(state, {
				instituteId: itemId
			}),
			url: '/admin/institute/getAuthKey/'
		});
		dispatch({
			type: 'SET_AUTHKEY_MODAL_DATA',
			smsProviderAuthKey: data.data.smsProviderAuthKey,
			smsSenderName: data.data.smsSenderName,
			smsProviderId: data.data.sms_provider,
			itemId
		});
	};
}

export function updateAvailableState(state, countryId) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_AVAILABLE_STATE'
		});

		let [{data: states}, {data: identities}] = await Promise.all([
			api({
				data: makeApiData(state, {countryId}),
				url: '/admin/state/listByCountryId'
			}),
			api({
				data: makeApiData(state, {countryId}),
				url: '/admin/govtidentity/listByCountryId'
			})
		]);
		dispatch({
			type: 'SET_AVAILABLE_STATE',
			states: states.data,
			identities,
		});
	};
}

export function updateAvailableCity(state, stateId) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_AVAILABLE_CITY'
		});
		let {data: {data}} = await api({
			url: '/admin/city/listByStateId',
			data: makeApiData(state, {
				stateId
			})
		});
		dispatch({
			type: 'SET_AVAILABLE_CITY',
			data
		});
	};
}

export function closeInstituteModal() {
	return {
		type: 'CLOSE_INSTITUTE_MODAL'
	};
}

export function notificationModal(modal) { 
	return { 
		type: 'SHOW_NOTIFICATION_MODAL_INSTITUTE', 
		modal
	}; 
}

export function closeNotificationModal() {
	return {
		type: 'CLOSE_NOTIFICATION_MODAL_INSTITUTE'
	};
}

export function submitSendEmail(state, data) {
	data.append('userId', state.session.id);
	return async dispatch => {
		await api({
			url: '/admin/institute/sendemail',
			data: makeApiData(state, data)
		});
		dispatch({
			type: 'CLOSE_NOTIFICATION_MODAL_INSTITUTE'
		});
	};
}

export function submitSendSMS(state, data) {
	data.append('userId', state.session.id);
	return async dispatch => {
		await api({
			url: '/admin/institute/sendsms',
			data: makeApiData(state, data)
		});
		dispatch({
			type: 'CLOSE_NOTIFICATION_MODAL_INSTITUTE'
		});
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_INSTITUTE_REMOVAL',
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/institute/remove'
		});

		if (status)
			state.router.push('/institute/setup');

		dispatch({
			type: 'INSTITUTE_REMOVAL_FAILED',
		});
	};
}

export function proceedNextStep(state, activateKey, currentKey) {
	return async dispatch => {
		let commonData = {
				loginUrl: window.location.origin+'/login',
				id:state.item.id,
				parentId: state.session.id,
				is_active: 1
			},
			data;
		if(currentKey == 1){
			data = {
				...commonData,
				institute: {
					id: state.item.instituteId,
					countryId: state.item['institute[countryId]'] ? state.item['institute[countryId]'] : '',
					stateId: state.item['institute[stateId]'] ? state.item['institute[stateId]'] : '',
					cityId: state.item['institute[cityId]'] ? state.item['institute[cityId]'] : '',
					zip_code: state.item['institute[zip_code]'],
					is_institute: state.item['institute[is_institute]'] ? '1' : undefined,
					parentInstituteId: state.item['institute[is_institute]'] === true ? state.item['institute[parentInstituteId]'] : undefined,
				},
				institute_detail: {
					id: state.item.institutedetailId,
					name: state.item['institute_detail[name]'] ? state.item['institute_detail[name]'] : '',
					alias: state.item['institute_detail[alias]'],
					address: state.item['institute_detail[address]'] ? state.item['institute_detail[address]'] : '',
					tagline: state.item['institute_detail[tagline]'],
				},
				user_detail: {},
			};
		}
		if(currentKey == 2){
			data = {
				...commonData,
				institute: {
					id: state.item.instituteId,
					registration_number: state.item['institute[registration_number]'] ? state.item['institute[registration_number]'] : '',
					themeId: state.item['institute[themeId]'] ? state.item['institute[themeId]'] : '',
					website_url: state.item['institute[website_url]'] ? state.item['institute[website_url]'] : '',
					phone: state.item['institute[phone]'] ? state.item['institute[phone]'] : '',
					sms_provider: state.item['institute[sms_provider]'] ? state.item['institute[sms_provider]'] : '',
					min_admission_years: state.item['institute[min_admission_years]'] !== '' ? parseInt(state.item['institute[min_admission_years]']) : '',
					min_admission_months: state.item['institute[min_admission_months]'] !== '' ? parseInt(state.item['institute[min_admission_months]']) : '',
					timezone: state.item['institute[timezone]'] ? state.item['institute[timezone]'] : '',
					date_format: state.item['institute[date_format]'] ? state.item['institute[date_format]'] : '',
				},
				institute_detail: {
					id: state.item.institutedetailId,
				},
				user_detail: {
					fullname: state.item['user_detail[fullname]']
				},
				salutation: state.item.salutation ? state.item.salutation : '',
				email: state.item.email,
				password: (state.item.id !== '' && state.item.editablePassword || state.item.id === '') ? state.item.password : undefined,
				confirm_password: (state.item.id !== '' && state.item.editablePassword || state.item.id === '') ? state.item.confirm_password : undefined,
				roleId: state.item.roleId ? state.item.roleId : '',
				mobile: state.item.mobile,
				alternate_mobile: state.item.alternate_mobile,
				govtIdentityId: state.item.govtIdentityId ? state.item.govtIdentityId : '',
				govt_identity_number: state.item.govt_identity_number ? state.item.govt_identity_number : '',
				secondary_lang: state.item.secondary_lang ? state.item.secondary_lang : '',
			};
		}
		if(currentKey == 3){
			data = {
				...commonData,
				institute: {
					id: state.item.instituteId,
					bank_name: state.item['institute[bank_name]'] ? state.item['institute[bank_name]'] : '',
					ifsc_code: state.item['institute[ifsc_code]'] ? state.item['institute[ifsc_code]'] : '',
					bank_branch: state.item['institute[bank_branch]'] ? state.item['institute[bank_branch]'] : '',
					account_no: state.item['institute[account_no]'] ? state.item['institute[account_no]'] : '',
					pan_no: state.item['institute[pan_no]'] ? state.item['institute[pan_no]'] : '',
					bank_challan_charges: state.item['institute[bank_challan_charges]'] ? state.item['institute[bank_challan_charges]'] : '',
					fee_active: state.item['institute[fee_active]'] ? '1' : undefined,
				},
				institute_detail: {
					id: state.item.institutedetailId,
				},
				user_detail: {},
			};
		}

		let {data:{errors}} = await api({
			url: '/admin/institute/stepValidate',
			data: makeApiData(state, data)
		});
        
		if (errors) {
			return dispatch({
				type: 'SET_INSTITUTE_SAVE_ERRORS',
				errors: makeErrors(errors)
			});
		} else {
			dispatch({
				type: 'ACTIVATE_TAB',
				activateKey
			});
		}
	};
}
