import {combineReducers} from 'redux';
import * as utilsActions from '../../../utils';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_SEARCH_MODULE':
		case 'CLAIM_REQUEST_SENT':
		case 'BACK_TO_SEARCH':
			return 'SEARCH_PROFILE_VIEW';
		case 'SET_PROFILE_VIEW':
		case 'BACK_TO_PROFILE_VIEW':
			return 'PROFILE_VIEW';
		case 'SET_EDIT_PROFILE_VIEW':
			return 'EDIT_PROFILE_VIEW';
		case 'INIT_NEW_PROFILE_CREATION':
			return 'EDIT_PROFILE_VIEW';
		case 'INIT_WELCOME_SCREEN':
			return 'WELCOME_SCREEN_VIEW';
		case 'SHOW_SEARCHED_PROFILES':
		case 'BACK_TO_SEARCH_LIST':
			return 'SEARCHED_PROFILES_VIEW';
		case 'VIEW_HOSPITAL_PROFILE':
			return 'VIEW_HOSPITAL_PROFILE_SCREEN';
		default:
			return state;
	}	
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_ERRORS':
			return action.errors;
		case 'UPDATE_TAB':
		case 'SET_EDIT_PROFILE_VIEW':
			return {};
		default:
			return state;
	}
}

const profileSearchStates = {
	name: '',
	selected_city: "",
	email: '',
	mobile: '',
	selected_specialization: ""
}
function profileSearch(state = profileSearchStates, action) {
	switch(action.type) {
		case 'INIT_SEARCH_MODULE': 
		case 'INIT_WELCOME_SCREEN':
			return profileSearchStates;
		case 'UPDATE_PROFILE_SEARCH_DATA':
			return {
				...state, 
				[action.name]: action.value
			}
		case 'CLAIM_REQUEST_SENT':
			return {
				...state,
				name: '',
				selected_city: [],
				email: '',
				mobile: '',
				selected_specialization: []
			}
		default:
			return state;
	}
}

const profileSearchData = {
	cities: [],
	specializations: [],
	is_claim_request_pending: false,
	requested_claimed_profile_detail: null
}
function profileSearchHelperData(state = profileSearchData, action) {
	switch(action.type) {
		case 'INIT_SEARCH_MODULE':
		case 'INIT_WELCOME_SCREEN':
			let requested_claimed_profile_detail = action.data.is_any_claim_request_pending ? action.data.hospital_profile_data : null;
			return {
				...state,
				cities: action.data.cities.data.map((item) => { return {label: item.citydetails[0].name, value: item.id} }),
				specializations: action.data.specialization_tags.data.tags.map((item) => { return {label: item.tagdetails[0].title, value: item.id} }),
				is_claim_request_pending: action.data.is_any_claim_request_pending,
				requested_claimed_profile_detail: requested_claimed_profile_detail
			}
		case 'CLAIM_REQUEST_SENT': 
			return {
				...state,
				is_claim_request_pending: true,
				requested_claimed_profile_detail: action.data	
			}
		case 'CLAIM_REQUEST_CANCEL': 
			return {
				...state,
				is_claim_request_pending: false,
				requested_claimed_profile_detail: null	
			}
		default:
			return state;
	}
}

const searchedProfileStates = {
	isLoading: false,
	data: [],
	create_new_profile_btn_display: false,
	paginationData: null
}
function searchedProfiles(state = searchedProfileStates, action) {
	switch(action.type) {
		case 'INIT_SEARCH_MODULE':
		case 'INIT_WELCOME_SCREEN':
			return searchedProfileStates;
		case 'INIT_LOADING':
			return {
				...state, 
				isLoading: true
			}
		case 'SHOW_SEARCHED_PROFILES':
			return {
				...state,
				isLoading: false,
				data: action.data.data,
				create_new_profile_btn_display: true,
				paginationData: {
					totalData: action.data.totalData,
					pageCount: action.data.pageCount,
					pageLimit: action.data.pageLimit,
					currentPage: action.data.currentPage
				}
			}
		case 'SET_ERRORS':
			return {
				...state,
				isLoading: false
			}
		case 'CLAIM_REQUEST_SENT': 
			return {
				...state,
				data: [],
				create_new_profile_btn_display: false
			}
		case 'BACK_TO_SEARCH_LIST':
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
	shift_24X7 : '',
	is_complete: 0,
	is_live: '',
	claim_status: '',
	verified_status: '',
	is_freeze: 0
}
function basicDetails(state = basicInfo, action) {
 	switch(action.type) {
		case 'GET_LAT_LONG_GMAP':
				let updateState = {...state};
				updateState['latitude'] = action.lat;
				updateState['longitude'] = action.long;
				return updateState;
 		case 'INIT_NEW_PROFILE_CREATION':
 			return basicInfo;
 		case 'SET_EDIT_PROFILE_VIEW':
 		case 'SET_PROFILE_VIEW':
 			var data = action.data.data;
 			return {
 				...state,
 				id: action.data.data.id,
				userId: action.data.data.userId,
				'hospital_detail[hospital_name]': data.hospitaldetails[0].hospital_name,
				'hospital_detail[about_hospital]': data.hospitaldetails[0].about_hospital,
				'hospital_detail[address]': data.hospitaldetails[0].address,
				'hospital_detail[contact_emails]': data.hospitaldetails[0].contact_emails,
				'hospital_detail[contact_mobiles]': data.hospitaldetails[0].contact_mobiles,
				hospital_logo: data.hospital_logo,
				google_address: data.google_address,
				shift_24X7: data.shift_24X7,
				is_freeze: data.is_freeze,
			    countryId: data.countryId,
			    stateId: data.stateId,
			    cityId: data.cityId,
			    zipcode: data.zipcode,
			    is_complete: data.is_complete,
			    is_live: data.is_live,
			    claim_status: data.claim_status,
			    verified_status: data.verified_status,
			    is_active: data.is_active
 			}
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
				claim_status: data.claim_status
 			}
 		case 'UPDATE_DATA_VALUE':
 			let newState = {...state};

			"countryId" === action.name && (newState.stateId = '', newState.cityId = '');
			"stateId" === action.name && (newState.cityId = '');
			newState[action.name] = action.value;
			return newState;
		case 'CHANGE_SHIFT_STATUS':
			return {
				...state, shift_24X7: parseInt(action.status)
			}
		default:
			return state;
	}
}

function activeTab(state = 'basic-info-form', action) {
	switch(action.type) {
		case 'UPDATE_TAB':
			return action.tabKey
		case 'INIT_NEW_PROFILE_CREATION':
			return 'basic-info-form';
		case 'INIT_PROFILE_RELATED_DATA':
			return action.tabKey;
		case 'SET_EDIT_PROFILE_VIEW':
			return 'basic-info-form';
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
		case 'INIT_NEW_PROFILE_CREATION': 
			let prevStates = {...state}
			prevStates.countries = action.data.countries;
			prevStates.service_tags = getTagsData(action.data.service_tags.data.tags);
			prevStates.insurance_companies_tags = getTagsData(action.data.insurance_companies_tags.data.tags);
			prevStates.membership_tags = getTagsData(action.data.membership_tags.data.tags);
			prevStates.specialization_tags = getTagsData(action.data.specialization_tags.data.tags);
			return prevStates;
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var concatAllhelperTags = action.data.service_tags.data.tags.concat(action.data.insurance_companies_tags.data.tags, action.data.specialization_tags.data.tags, action.data.membership_tags.data.tags);
			var getEditHelperTagsData = setEditHelperTagsData(concatAllhelperTags, action.data.data.hospitalservices);
			return {
				...state,
				countries: action.data.countries,
				states: action.data.states,
				cities: action.data.cities,
				service_tags: getEditHelperTagsData.serviceTags,
				insurance_companies_tags: getEditHelperTagsData.insurCompTags,
				specialization_tags: getEditHelperTagsData.specTags,
				membership_tags: getEditHelperTagsData.membershipTags,
			}
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
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var awrData;
			if(0 === action.data.data.hospitalawards.length) {
				awrData = [];
			} else {
				awrData = action.data.data.hospitalawards.map((item) => {
					return {
						award_year: item.award_year,
						award_gratitude_title: item.hospitalawarddetails[0].award_gratitude_title,
						hospitalId: action.data.data.id
					}
				})	
			}
			return awrData;
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
		case 'START_ADD':
			return state;
		case 'SET_EDIT_DATA':
			var specializations = [], services = [], memberships = [], insurance_companies = [];
			action.data.data.doctortags.map((item) => {
				if(2 === item.tagtypeId) specializations.push(item.tagId)
				if(1 === item.tagtypeId) services.push(item.tagId)
				if(12 === item.tagtypeId) memberships.push(item.tagId)
				if(11 === item.tagtypeId) insurance_companies.push(item.tagId)
			})
			return {
				...state,
				specializations: specializations,
				services: services,
				memberships: memberships,
				insurance_companies: insurance_companies
			}
		case 'UPDATE_ADD_INFO_VALUE':
			let newState = {...state};
			newState[action.name].push(action.obj)
			return newState;
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var specializations = setTagsLabel(action.data.data.hospitalservices, action.data.specialization_tags)
			var services = setTagsLabel(action.data.data.hospitalservices, action.data.service_tags)
			var memberships = setTagsLabel(action.data.data.hospitalservices, action.data.membership_tags)
			var insurance_companies = setTagsLabel(action.data.data.hospitalservices, action.data.insurance_companies_tags)

			return {
				...state,
				specializations: specializations,
				services: services,
				memberships: memberships,
				insurance_companies: insurance_companies
			}
		case 'REMOVE_TAG_LABEL':
			var getPrevState = {...state};
			var getPrevValues = [...getPrevState[action.name]];
			var updatedValues = []
			for(var i = 0; i < getPrevValues.length; i++) {
				if(getPrevValues[i].value != action.value)
					updatedValues.push(getPrevValues[i])
			}
			getPrevState[action.name] = updatedValues//.filter(function(e){return e})
			return getPrevState;
		case 'INIT_NEW_PROFILE_CREATION':
			return {
				...state,
				specializations: [],
				services: [],
				memberships: [],
				insurance_companies: []
			}
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
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			let imageFiles = [], videoFiles = [];
			action.data.data.hospitalfiles.map((item) => {
				if("image" === item.file_type) imageFiles.push(item)
				if("video" === item.file_type) videoFiles.push(item)
			})
			return {
				...state,
				images: imageFiles,
				videos: videoFiles
			};
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

function hospitalTimings(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			return action.data.data.hospital_timings;
		case 'INIT_NEW_PROFILE_CREATION':
			return [];
		default:
			return state;
	}
}

const defaultDoctorLinkHelperData = {
	doctors_list_all: [],
	filtered_doctor_list: []
}
function doctorLinkHelperData(state = {}, action) {
	switch(action.type) {
		case 'SET_EDIT_PROFILE_VIEW':
 		case 'SET_PROFILE_VIEW':
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

function mappedDoctors(state = [], action) {
	switch(action.type) {
		case 'INIT_NEW_PROFILE_CREATION':
 			return [];
 		case 'SET_EDIT_PROFILE_VIEW':
 		case 'SET_PROFILE_VIEW':
 			return action.data.data.hospital_doctors;
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
		case 'INIT_NEW_PROFILE_CREATION':
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
		case 'SET_EDIT_PROFILE_VIEW':
 		case 'SET_PROFILE_VIEW':
 			let getContactDetail = action.data.data.contactinformations;
			let emails = [], mobiles = [];
			getContactDetail.map((item) => {
				var infoData = item; delete infoData.id;
				if(item.type === "email") emails.push(infoData);
				if(item.type === "mobile") mobiles.push(infoData);
			})
			return {
				emails: emails,
				mobiles: mobiles
			}
		default:
			return state;
	}
}
function resetDocumentForm(state = false, action) {
	switch(action.type) {
		case 'UPDATE_DOCUMENTS_DATA':
			return true;
		default:
			return false;
	}
}




function getTagsData(items){
	let data = [];
	items.forEach(function(item){
		data.push({value: item.id, label: item.tagdetails[0].title, tagtypeId: item.tagtypeId})
	});
	return data;
}

function setEditHelperTagsData(allHelpertags, hosTags){
	let serviceTags = [], specTags = [], membershipTags = [], insurCompTags = [];
	let tagtypeIds = utilsActions.tagtypeIds();
	allHelpertags.forEach(function(helperTagVal){
		var status = hosTags.some((hosTagVal) => { return hosTagVal.tagId == helperTagVal.id })
		if(!status) {
			if(helperTagVal.tagtypeId == tagtypeIds.ServiceTagId) serviceTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
			if(helperTagVal.tagtypeId == tagtypeIds.SpecializationTagId) specTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
			if(helperTagVal.tagtypeId == tagtypeIds.MembershipsTagId) membershipTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
			if(helperTagVal.tagtypeId == tagtypeIds.InsuranceCompaniesTagId) insurCompTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
		}
	})
	return {serviceTags: serviceTags, specTags: specTags, membershipTags: membershipTags, insurCompTags: insurCompTags}
}

function setTagsLabel(profileTags, allTags) {
	if(profileTags.length) {
		let setData = []
		allTags.data.tags.map((allTagValues) => {
			profileTags.map((profileTagValues) => {
				if(profileTagValues.tagId == allTagValues.id)
					setData.push({label: allTagValues.tagdetails[0].title, value: profileTagValues.tagId, tagtypeId: allTagValues.tagtypeId})
			})
		})
		return setData;
	} else {
		return [];
	}
}

function viewOtherHospitalProfile(state = null, action) {
	switch(action.type) {
		case 'VIEW_HOSPITAL_PROFILE':
			return action.data;
		default:
			return null
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
	viewState,
	profileSearch,
	profileSearchHelperData,
	searchedProfiles,
	basicDetails,
	helperData,
	activeTab,
	errors,
	hospitalFiles,
	additionalInfo,
	awards,
	hospitalFiles,
	hospitalTimings,
	doctorLinkHelperData,
	mappedDoctors,
	contactInformations,
	resetDocumentForm,
	viewOtherHospitalProfile,
	newTagCreationStates
});

export default reducer;