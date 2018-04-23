import {combineReducers} from 'redux';
import * as utilsActions from '../../utils';

// function viewState(state = null, action) {
// 	switch(action.type) {
// 		case 'INIT_MODULE':
// 			return 'RENDER_ADD_VIEW';
// 		default:
// 			return state;
// 	}	
// }

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_NEW_PROFILE_CREATION':
			return {};
		case 'SET_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const basicInfo = {
	id: '',
	userId:'',
	'hospital_detail[hospital_name]': '',
	'hospital_detail[about_hospital]': '',
	'hospital_detail[address]': '',
	'hospital_detail[contact_emails]': '',
	'hospital_detail[contact_mobiles]': '',
	cityId:'',
	stateId:'',
	countryId:'',
	zipcode:'',
	hospital_logo: '',
	google_address: '',
	is_active: '',
	doctors : [],
	shift_24X7 : [],
	is_complete: [],
	is_live: '',
	claim_status: '',
	verified_status: '',
	is_freeze: 0
}
function basicDetails(state = basicInfo, action) {
 	switch(action.type) {
 		case 'INIT_MODULE':
 			return basicInfo;
		case 'UPDATE_DATA_VALUE':
 			let newState = {...state};

			"countryId" === action.name && (newState.stateId = '', newState.cityId = '');
			"stateId" === action.name && (newState.cityId = '');
			newState[action.name] = action.value;
			return newState;
		case 'INIT_PROFILE_RELATED_DATA':
 			var data = action.data;
 			return {
 				...state,
 				id: data.id,
				userId: data.userId,
				'hospital_detail[hospital_name]': data.hospital_detail.hospital_name,
				'hospital_detail[about_hospital]': data.hospital_detail.about_hospital,
				'hospital_detail[address]': data.hospital_detail.address,
				'hospital_detail[contact_emails]': data.hospital_detail.contact_emails,
				'hospital_detail[contact_mobiles]': data.hospital_detail.contact_mobiles,
				cityId: data.cityId,
				stateId: data.stateId,
				countryId: data.countryId,
				zipcode: data.zipcode,
				hospital_logo: data.hospital_logo,
				google_address: data.google_address,
				is_active: data.is_active,
				shift_24X7 : data.shift_24X7,
				is_complete: data.is_complete,
				is_live: data.is_live,
				claim_status: data.claim_status,
				is_freeze: 0
 			}
		default:
			return state;
	}
}

function activeTab(state = 'basic-info-form', action) {
	switch(action.type) {
		case 'UPDATE_TAB':
			return action.tabKey
		case 'INIT_MODULE':
			return 'basic-info-form';
		case 'INIT_PROFILE_RELATED_DATA':
			return action.tabKey;
		default:
			return state;
	}
}

const defaultHelperData = {
	countries: [],
	states: [],
	cities: [],
	service_tags: [],
	insurance_companies_tags: [],
	specialization_tags: [],
	membership_tags: [],
	country_name: '',
	state_name: '',
	city_name: ''
}
function helperData(state = defaultHelperData, action) {
	var setname = {specializations: 'specialization_tags', services: 'service_tags', memberships: 'membership_tags', insurance_companies: 'insurance_companies_tags'}
	switch(action.type) {
		case 'INIT_MODULE': 
			let prevStates = {...state}
			prevStates.countries = action.data.countries;
			prevStates.service_tags = getTagsData(action.data.service_tags.data.tags);
			prevStates.insurance_companies_tags = getTagsData(action.data.insurance_companies_tags.data.tags);
			prevStates.membership_tags = getTagsData(action.data.membership_tags.data.tags);
			prevStates.specialization_tags = getTagsData(action.data.specialization_tags.data.tags);
			return prevStates;
		case 'SET_STATES':
			return {...state, states: action.data}
		case 'SET_CITIES':
			return {...state, cities: action.data}
		case 'UPDATE_ADD_INFO_VALUE':
			var getState = {...state}
			var updatedTags = []
			getState[setname[action.name]].map((item) => {
				if(item.value != action.value) updatedTags.push(item)
			})
			getState[setname[action.name]] = updatedTags;
			return getState;
		case 'REMOVE_TAG_LABEL':
			var getState = {...state}
			getState[setname[action.name]].push(action.obj)
			return getState;
		default:
			return state;
	}
}

function awards(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'ADD_MORE_AWARD':
			return [...state, {award_gratitude_title: action.award_gratitude_title, award_year: action.award_year, hospitalId: action.hospitalId}];
		case 'REMOVE_AWARD':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'UPDATE_AWARD_INPUT_VALUE':
			var getPrevState = [...state];
			getPrevState[action.dataIndex][action.name] = action.value;
			return getPrevState;
		default:
			return state;
	}
}

const defaultAdditionalInfo = {
	specializations: [],
	services: [],
	memberships: [],
	insurance_companies: []
}
function additionalInfo(state = defaultAdditionalInfo, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
			return state;
		case 'UPDATE_ADD_INFO_VALUE':
			let newState = {...state};
			newState[action.name].push(action.obj)
			return newState;
		case 'TAG_CREATED':
			let tagToBeUpdated;
			tagtypeIds.ServiceTagId == action.data.tagtypeId && (tagToBeUpdated = 'services');
			tagtypeIds.MembershipsTagId == action.data.tagtypeId && (tagToBeUpdated = 'memberships');
			tagtypeIds.InsuranceCompaniesTagId == action.data.tagtypeId && (tagToBeUpdated = 'insurance_companies');
			var getPrevState = {...state};
			getPrevState[tagToBeUpdated].push({label: action.data.tagdetail.title, value: action.data.id, tagtypeId: action.data.tagtypeId})
			return getPrevState;
		default:
			return state;
	}
}

const defaultFiles = {
	images: [],
	videos: []
}
function hospitalFiles(state = defaultFiles, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultFiles;
		case 'INIT_PROFILE_RELATED_DATA':
			return { ...state, images: [], videos: [] };
		case 'CHANGE_DOCUMENT_STATUS':
			let prevState = {...state}
			parseInt(action.status)
			var itemId = parseInt(action.itemId);

			if("image" === action.itemType) {
				prevState.images.map((item) => {
					if (item.id === itemId) item.is_active = parseInt(action.status);
					return item;
				})
			} else {
				prevState.videos.map((item) => {
					if (item.id === itemId) item.is_active = parseInt(action.status);
					return item;
				})
			}
			return prevState;
		case 'UPDATE_DOCUMENTS_DATA': 
			var prevState = {...state}
			if("image" === action.data.file_type) {
				prevState.images.push(action.data)
			}
			if("video" === action.data.file_type) {
				prevState.videos.push(action.data)
			}
			return prevState;
		default:
			return state;
	}
}

const defaultcontactInformations = {
	emails: [],
	mobiles: []
}
function contactInformations(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				emails: [{key: '', model: 'hospital', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: '', model: 'hospital', type: 'mobile', value: '', status: 0, is_primary: 1}]
			}
		case 'INIT_PROFILE_RELATED_DATA':
			return {
				emails: [{key: action.data.id, model: 'hospital', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: action.data.id, model: 'hospital', type: 'mobile', value: '', status: 0, is_primary: 1}]
			}
		case 'ADD_MORE_EMAIL_MOBILE':
			var prevState = {...state};
			if(action.dataType === "email") {
				prevState.emails.push({key: action.id, model: 'hospital', type: 'email', value: '', status: 0, is_primary: 0})
			}
			if(action.dataType === "mobile") {
				prevState.mobiles.push({key: action.id, model: 'hospital', type: 'mobile', value: '', status: 0, is_primary: 0})
			}
			return prevState;
		case 'UPDATE_EMAIL_MOBILE':
			var prevState = {...state};
			if(action.name === "value") {
				prevState[action.dataType][action.index][action.name] = action.value;	
			} else {
				let getdata = prevState[action.dataType];
				let newdata = getdata.filter((item) => {
					item.is_primary = 0; return item;
				})
				newdata[action.index][action.name] = action.value;

				prevState[action.dataType] = newdata;
				return prevState;
			}
			
			return prevState;
		case 'REMOVE_EMAIL_MOBILE':
			var prevState = {...state};
			let getData = prevState[action.dataType];
			delete getData[action.index]
			prevState[action.dataType] = getData.filter(function(){return true;});
			return prevState;
		default:
			return state;
	}
}

function hospitalTimings(state = [], action) {
	switch(action.type) {
		default:
			return [];
	}
}

const defaultDoctorLinkHelperData = {
	doctors_list_all: [],
	filtered_doctor_list: []
}
function doctorLinkHelperData(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'INIT_PROFILE_RELATED_DATA':
			return {
				...state,
				doctors_list_all: [],
				filtered_doctor_list: []
			}
		case 'EDIT_PROFILE_VIEW':
 			return {
				...state,
				doctors_list_all: action.data.doctors_list,
				filtered_doctor_list: []
			}
		case 'SET_FILTER_DOCTOR_ARR':
			return {
				...state,
				filtered_doctor_list: action.res.data,
			}
		default:
			return state;
	}
}

function getTagsData(items){
	let data = [];
	items.forEach(function(item){
		data.push({value: item.id, label: item.tagdetails[0].title, tagtypeId: item.tagtypeId})
	});
	return data;
}
function resetDocumentForm(state = false, action) {
	switch(action.type) {
		case 'UPDATE_DOCUMENTS_DATA':
			return true;
		default:
			return false;
	}
}

function newTagCreationStates(state = {}, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	switch(action.type) {
		case 'TAG_LOADING':
			let toBeLoading;
			tagtypeIds.ServiceTagId == action.tagtypeId && (toBeLoading = 'serviceTagLoading');
			tagtypeIds.MembershipsTagId == action.tagtypeId && (toBeLoading = 'membershipTagLoading');
			tagtypeIds.InsuranceCompaniesTagId == action.tagtypeId && (toBeLoading = 'insuranceTagLoading');
			return {...state, [toBeLoading]: true}
		case 'TAG_CREATED':
			return {serviceTagLoading: false, membershipTagLoading: false, insuranceTagLoading: false}
		default:
			return {serviceTagLoading: false, membershipTagLoading: false, insuranceTagLoading: false}
	}
}

const reducer = combineReducers({
	//viewState,
	basicDetails,
	helperData,
	activeTab,
	errors,
	hospitalFiles,
	additionalInfo,
	awards,
	hospitalFiles,
	contactInformations,
	resetDocumentForm,
	hospitalTimings,
	doctorLinkHelperData,
	newTagCreationStates
});

export default reducer;