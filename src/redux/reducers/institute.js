import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_INSTITUTE_STATUS':
			itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.user.id === itemId)
					item.user.is_active = parseInt(action.status);
				return item;
			});
		case 'SEND_INSTITUTE_LOGIN_INFO': 
			itemId = parseInt(action.itemId); 
			return state.map(item => { 
				if (item.id === itemId) item.sendingLoginInfo = true; 
				return item; 
			}); 
		case 'INSTITUTE_LOGIN_INFO_SENT': 
			itemId = parseInt(action.itemId); 
			return state.map(item => { 
				if (item.id === itemId) item.sendingLoginInfo = false; 
				return item;
			}); 	
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_INSTITUTE':
		case 'SET_INSTITUTE_EDIT_DATA':
		case 'ACTIVATE_TAB':
		case 'CLOSE_INSTITUTE_MODAL':
		case 'HIDE_DATA_MODAL':
			return {};
		case 'SET_INSTITUTE_SAVE_ERRORS':
		case 'SET_AUTHKEY_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultItem = {
	'id': '',
	'detailId': '',
	'instituteId':'',
	'institutedetailId': '',
	'salutation':'',
	'email':'',
	'editablePassword':'',
	'password':'',
	'confirm_password':'',
	'roleId':'',
	'mobile':'',
	'alternate_mobile':'',
	'govtIdentityId':'',
	'govt_identity_number':'',
	'user_image':'',
	'institute_image':'',
	'institute_logo':'',
	'govt_identity_image':'',
	'secondary_lang':'',
	'is_active': true,
	'user_detail[fullname]':'',
	'institute[countryId]':'',
	'institute[stateId]':'',
	'institute[cityId]':'',
	'institute[zip_code]':'',
	'institute[is_institute]': false,
	'institute[parentInstituteId]':'',
	'institute[registration_number]':'',
	'institute[themeId]':'',
	'institute[website_url]':'',
	'institute[phone]':'',
	'institute[min_admission_years]':'',
	'institute[min_admission_months]':'',
	'institute[timezone]':'',
	'institute[date_format]':'',
	'institute[sms_provider]':'',
	'institute_detail[name]':'',
	'institute_detail[alias]':'',
	'institute_detail[address]':'',
	'institute_detail[tagline]':'',

	'institute[pan_no]':'',
	'institute[account_no]':'',
	'institute[bank_name]':'',
	'institute[bank_challan_charges]':'',
	'institute[bank_branch]':'',
	'institute[ifsc_code]':'',
	'institute[fee_active]':false,
	'cheque_image':'',
	'allow_fee_app':true,
	'institute[digest]':false,
};

function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_INSTITUTE_EDIT':
			return null;	
		case 'START_ADD_INSTITUTE':
			return defaultItem;
		case 'SET_INSTITUTE_EDIT_DATA': {
			let data = action.data.data;
			return {
				'id': data.user.id,
				'cityName': data.cityName,
				'stateName': data.stateName,
				'parentId': data.user.parentId,
				'instituteId': data.id,
				'institutedetailId': data.institutedetails[0].id,
				'salutation': data.user.salutation,
				'email': data.user.email,
				'editablePassword': data.user.editablePassword,
				'password': '',
				'confirm_password': '',
				'roleId': data.user.roleId,
				'mobile': data.user.mobile,
				'alternate_mobile': data.user.alternate_mobile,
				'govtIdentityId': data.user.govtIdentityId,
				'govt_identity_number': data.user.govt_identity_number,
				'user_image': data.user.user_image,
				'govt_identity_image': data.user.govt_identity_image,
				'secondary_lang': data.user.secondary_lang,
				'is_active': data.user.is_active,
				'institute_image': data.institute_image,
				'institute_logo': data.institute_logo,
				'user_detail[fullname]': data.user.userdetails[0].fullname,
				'institute[countryId]': data.countryId,
				'institute[stateId]': data.stateId,
				'institute[cityId]': data.cityId,
				'institute[zip_code]': data.zip_code,
				'institute[is_institute]': data.parentInstituteId === 0 ? false : true,
				'institute[parentInstituteId]': data.parentInstituteId,
				'institute[registration_number]': data.registration_number,
				'institute[themeId]': data.themeId,
				'institute[website_url]': data.website_url,
				'institute[phone]': data.phone,
				'institute[min_admission_years]': data.min_admission_years,
				'institute[min_admission_months]': data.min_admission_months,
				'institute[timezone]': data.timezone,
				'institute[date_format]': data.date_format,
				'institute[sms_provider]': data.sms_provider,
				'institute_detail[name]': data.institutedetails[0].name,
				'institute_detail[alias]': data.institutedetails[0].alias,
				'institute_detail[address]': data.institutedetails[0].address,
				'institute_detail[tagline]': data.institutedetails[0].tagline,
				'institute[pan_no]': data.pan_no,
				'institute[account_no]': data.account_no,
				'institute[bank_name]': data.bank_name,
				'institute[bank_challan_charges]': data.bank_challan_charges,
				'institute[bank_branch]': data.bank_branch,
				'institute[ifsc_code]': data.ifsc_code,
				'cheque_image': data.cheque_image,
				'institute[fee_active]': data.fee_active === 0 ? false : true,
				'allow_fee_app': data.account_no ? false : true,
				'institute[digest]': data.digest === 0 ? false : true,
			};
		}
		case 'UPDATE_INSTITUTE_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			if(action.name === 'institute[countryId]'){
				newState['institute[stateId]'] = '';
				newState['institute[cityId]'] = '';
			}
			if(action.name === 'institute[stateId]'){
				newState['institute[cityId]'] = '';
			}
			if(action.name === 'institute[is_institute]' && action.value === false){
				newState['institute[parentInstituteId]'] = 0;
			}
			return newState;
		}	
		default:
			return state;
	}
}

const defaultHelperData = {
	roles: [],
	countries: [],
	states: [],
	cities: [],
	themes:[],
	identities:[],
	languages:[],
	timezones:[],
	date_formats: [],
	loadingStates: false,
	loadingCities: false,
	instituteId: '',
	smsProviderAuthKey:'',
	smsSenderName:'',
	smsProvider: '',
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				authKeyModal: false,
			};
		case 'START_ADD_INSTITUTE':
			return {
				...state,
				roles:action.data.roles.map(item => ({
					value: item.id,
					label: item.roledetails[0].name
				})),
				countries:action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				})),
				themes:action.data.themes.map(item => ({
					value: item.id,
					label: item.themedetails[0].name
				})),
				languages:action.data.languages.map(item => ({
					value: item.id,
					label: item.name
				})),
				timezones:action.data.timezones.map(item => ({
					value: item,
					label: item
				})),
				date_formats:action.data.date_formats.map(item => ({
					value: item,
					label: item
				})),
				institutes:action.data.institutes.map(item => ({
					value: item.id,
					label: item.institutedetails[0].name
				}))
			};
		case 'SET_INSTITUTE_EDIT_DATA':
			return {
				...state,
				roles:action.data.roles.map(item => ({
					value: item.id,
					label: item.roledetails[0].name
				})),
				countries:action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				})),
				themes:action.data.themes.map(item => ({
					value: item.id,
					label: item.themedetails[0].name
				})),
				languages:action.data.languages.map(item => ({
					value: item.id,
					label: item.name
				})),
				timezones:action.data.timezones.map(item => ({
					value: item,
					label: item
				})),
				date_formats:action.data.date_formats.map(item => ({
					value: item,
					label: item
				})),
				states: action.data.states.data.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				cities: action.data.cities.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				})),
				identities: action.data.identities.map(item => ({
					label: item.govtidentitydetails[0].name,
					value: item.id
				})),
				institutes:action.data.institutes.map(item => ({
					value: item.id,
					label: item.institutedetails[0].name
				}))
			};
		case 'LOAD_AVAILABLE_STATE':
			return {
				...state,
				states: [],
				cities: [],
				identities:[],
				loadingStates: true
			};
		case 'SET_AVAILABLE_STATE':
			return {
				...state,
				states: action.states.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				identities: action.identities.map(item => ({
					label: item.govtidentitydetails[0].name,
					value: item.id
				})),
				loadingStates: false
			};
		case 'LOAD_AVAILABLE_CITY':
			return {
				...state,
				cities: [],
				loadingCities: true
			};
		case 'SET_AVAILABLE_CITY':
			return {
				...state,
				cities: action.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				})),
				loadingCities: false
			};
		case 'SHOW_AUTHKEY_MODAL':
			return {
				...state,
				authKeyModal: true,
				loadingIcon:true,
			};
		case 'SET_AUTHKEY_MODAL_DATA':
			return{
				...state,
				instituteId: action.itemId,
				smsProviderAuthKey: action.smsProviderAuthKey,
				smsSenderName: action.smsSenderName,
				smsProvider: action.smsProviderId,
				loadingIcon:false
			};
		case 'CLOSE_INSTITUTE_MODAL':
			return {
				...state,
				authKeyModal: false,
				smsProvider: '',
				smsProviderAuthKey: '',
				smsSenderName:''
			};
		case 'UPDATE_AUTHKEY_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;	
		}
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SET_AUTHKEY_SAVE_ERRORS':
		case 'SET_INSTITUTE_SAVE_ERRORS':
		case 'CLOSE_INSTITUTE_MODAL':
		case 'INIT_MODULE':
			return false;
		case 'SEND_AUTHKEY_REQUEST':
		case 'SEND_ADD_INSTITUTE_REQUEST':
			return true;
		default:
			return state;
	}
}

const defaultSendemail = {
	emailModal: false,
	smsModal: false,
	discountModal: false,
	selectedIds:[],
	subject: '',
	message: '',
	checkedBox: {}
};
function notification(state = defaultSendemail, action) {
	switch(action.type) {
		case 'SHOW_NOTIFICATION_MODAL_INSTITUTE':
			return {
				...state,
				emailModal: action.modal === 'email' ? true : false,
				smsModal: action.modal === 'sms' ? true : false,
				discountModal: action.modal === 'discount' ? true : false,
				subject: '',
				message: ''
			};
		case 'UPDATE_CHECKBOX_INSTITUTE': {
			let updateState = {...state},
				ids = updateState.selectedIds, checkedBox = {};
			if (action.id instanceof Array) {
				ids = action.id;
			} else {
				let index = ids.indexOf(parseInt(action.id));
				if (index === -1) {
					ids.push(parseInt(action.id));
				} else {
					ids.splice(index, 1);
					if((index = ids.indexOf('all')) !== -1){
						ids.splice(index, 1);
					}
				}
			}
			ids.map(id => checkedBox[id] = true);
			updateState.selectedIds = ids;
			updateState.checkedBox = checkedBox;
			return updateState;
		}
		case 'INIT_MODULE':
		case 'CLOSE_NOTIFICATION_MODAL_INSTITUTE':
			return {
				emailModal: false,
				smsModal: false,
				selectedIds:[],
				subject: '',
				message: '',
				checkedBox: {}
			};
		default:
			return state;
	}
}

function tabbing(state = {activateKey: 1}, action) {
	switch(action.type) {
		case 'START_ADD_INSTITUTE':
		case 'SET_INSTITUTE_EDIT_DATA':
			return {
				activateKey: 1,
			};
		case 'ACTIVATE_TAB':
			return {
				activateKey: action.activateKey
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	pageInfo,
	filters,
	item,
	helperData,
	saving,
	notification,
	query,
	tabbing
});

export default reducer;