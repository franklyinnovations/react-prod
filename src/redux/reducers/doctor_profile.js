import {combineReducers} from 'redux';
import * as utilsActions from '../../utils';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_SEARCH_MODULE':
		case 'BACK_TO_SEARCH':
		case 'CLAIM_REQUEST_SENT':
			return 'SEARCH_PROFILE_VIEW';
		case 'SET_PROFILE_VIEW':
		case 'BACK_TO_PROFILE_VIEW':
			return 'PROFILE_VIEW';
		case 'SET_EDIT_PROFILE_VIEW':
			return 'EDIT_PROFILE_VIEW';
		case 'INIT_NEW_PROFILE_CREATION':
			return 'EDIT_PROFILE_VIEW';
		case 'SET_CLINIC_PROFILE_CREATION_VIEW':
			return 'CLINIC_PROFILE_CREATION_VIEW';
		case 'INIT_WELCOME_SCREEN':
		case 'CLAIM_REQUEST_CANCEL':
			return 'WELCOME_SCREEN_VIEW';
		case 'SHOW_SEARCHED_PROFILES':
		case 'BACK_TO_SEARCH_LIST':
			return 'SEARCHED_PROFILES_VIEW';
		case 'VIEW_DOCTOR_PROFILE':
			return 'VIEW_DOCTOR_PROFILE_SCREEN';
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
	selected_city: '',
	email: '',
	mobile: '',
	selected_specialization: ''
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
			let requested_claimed_profile_detail = action.data.is_any_claim_request_pending ? action.data.doctor_profile_data : null;
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
	create_new_profile_btn_display: false
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
				data: action.data.filtered_doctor_list,
				create_new_profile_btn_display: true
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
	userId: '',
	mobile: '',
	name: '',
	email: '',
    countryId: '',
    stateId: '',
    cityId: '',
    address_line_1: '',
    postal_code: '',
    gender: 'male',
    about_doctor: '',
    is_active: true,
    doctor_profile_pic: '',
    salutation: 'Mr',
    is_complete: '',
    is_live: '',
    claim_status: '',
    verified_status: ''
}
function basicDetails(state = basicInfo, action) {
 	switch(action.type) {

		case 'GET_LAT_LONG_GMAP':
				let updateState = {...state};
				updateState['latitude'] = action.lat;
				updateState['longitude'] = action.long;
				return updateState;
 		case 'INIT_NEW_PROFILE_CREATION':
 			return {
 				...state,
 				id: '',
				userId: '',
				mobile: '',
				name: '',
				email: '',
			    countryId: '',
			    stateId: '',
			    cityId: '',
			    address_line_1: '',
			    postal_code: '',
			    gender: 'male',
			    about_doctor: '',
			    is_active: true,
			    doctor_profile_pic: '',
			    salutation: 'Mr',
			    salutation: 'Mr',
    			is_complete: '',
    			is_live: '',
    			claim_status: '',
    			verified_status: ''
 			}
 		case 'SET_EDIT_PROFILE_VIEW':
 		case 'SET_PROFILE_VIEW':
 			return {
 				...state,
 				id: action.data.data.id,
				userId: action.data.data.userId,
				mobile: action.data.data.mobile,
				name: action.data.data.doctorprofiledetails[0].name,
				email: action.data.data.email,
			    countryId: action.data.data.countryId,
			    stateId: action.data.data.stateId,
			    cityId: action.data.data.cityId,
			    address_line_1: action.data.data.doctorprofiledetails[0].address_line_1,
			    postal_code: action.data.data.postal_code,
			    gender: action.data.data.gender,
			    about_doctor: action.data.data.doctorprofiledetails[0].about_doctor,
			    doctor_profile_pic: action.data.data.doctor_profile_pic,
			    salutation: action.data.data.salutation,
			    salutation: 'Mr',
			    is_complete: action.data.data.is_complete,
			    is_live: action.data.data.is_live,
			    claim_status: action.data.data.claim_status,
			    verified_status: action.data.data.verified_status,
			    is_active: action.data.data.is_active,
 			}
 		case 'INIT_PROFILE_RELATED_DATA':
 			return {
 				...state,
 				id: action.data.id,
				userId: action.data.userId,
				mobile: action.data.mobile,
				name: action.data.doctor_profile_details.name,
				email: action.data.email,
			    countryId: action.data.countryId,
			    stateId: action.data.stateId,
			    cityId: action.data.cityId,
			    address_line_1: action.data.doctor_profile_details.address_line_1,
			    postal_code: action.data.postal_code,
			    gender: action.data.gender,
			    about_doctor: action.data.doctor_profile_details.about_doctor,
			    doctor_profile_pic: action.data.doctor_profile_pic,
			    salutation: action.data.salutation,
			    is_complete: action.data.is_complete,
    			is_live: action.data.is_live,
    			claim_status: action.data.claim_status,
    			verified_status: action.data.verified_status,
    			is_active: action.data.is_active,
 			}
 		case 'UPDATE_DATA_VALUE':
 			let newState = {...state};

			"countryId" === action.name && (newState.stateId = '', newState.cityId = '');
			"stateId" === action.name && (newState.cityId = '');
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

function activeTab(state = 'personal-info', action) {
	switch(action.type) {
		case 'UPDATE_TAB':
			return action.tabKey
		case 'INIT_NEW_PROFILE_CREATION':
			return 'personal-info';
		case 'INIT_PROFILE_RELATED_DATA':
			return action.tabKey;
		case 'SET_EDIT_PROFILE_VIEW':
			return 'personal-info';
		default:
			return state;
	}
}

const defaultHelperData = {
	countries: [],
	states: [],
	cities: [],
	service_tags: [],
	qualification_tags: [],
	specialization_tags: [],
	membership_tags: [],
	country_name: '',
	state_name: '',
	city_name: ''
}
function helperData(state = defaultHelperData, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	var setname = {specializations: 'specialization_tags', services: 'service_tags', memberships: 'membership_tags'}
	switch(action.type) {
		case 'INIT_NEW_PROFILE_CREATION': 
			let prevStates = {...state}
			prevStates.countries = action.data.countries;
			prevStates.service_tags = getTagsData(action.data.service_tags.data.tags);
			prevStates.qualification_tags = getTagsData(action.data.qualification_tags.data.tags);
			prevStates.membership_tags = getTagsData(action.data.membership_tags.data.tags);
			prevStates.specialization_tags = getTagsData(action.data.specialization_tags.data.tags);
			return prevStates;
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var concatAllhelperTags = action.data.service_tags.data.tags.concat(action.data.specialization_tags.data.tags, action.data.membership_tags.data.tags);
			var getEditHelperTagsData = setEditHelperTagsData(concatAllhelperTags, action.data.data.doctortags);
			return {
				...state,
				countries: action.data.countries,
				states: action.data.states,
				cities: action.data.cities,
				service_tags: getEditHelperTagsData.serviceTags,
				qualification_tags: getTagsData(action.data.qualification_tags.data.tags),
				specialization_tags: getEditHelperTagsData.specTags,
				membership_tags: getEditHelperTagsData.membershipTags,
			}
		case 'SET_STATES':
			return {...state, states: action.data}
		case 'SET_CITIES':
			return {...state, cities: action.data}
		case 'SET_HOSPITAL_ON_DOCTOR' : 
			return {
				...state, 
				all_hospital_list_on_doctor: action.data.all_hospital_list_on_doctor,
				all_city_list : action.data.all_city_list
			}
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
		case 'TAG_CREATED':
			if(action.data.tagtypeId == tagtypeIds.EducationQualificationTagId) {
				var prevState = {...state}
				prevState.qualification_tags.push({value: action.data.id, label: action.data.tagdetail.title, tagtypeId: action.data.tagtypeId})
				return prevState;
			} else {
				return state;
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

function setEditHelperTagsData(allHelpertags, docTags){
	let serviceTags = [], specTags = [], membershipTags = [];
	let tagtypeIds = utilsActions.tagtypeIds();
	allHelpertags.forEach(function(helperTagVal){
		var status = docTags.some((docTagVal) => { return docTagVal.tagId == helperTagVal.id })
		if(!status) {
			if(helperTagVal.tagtypeId == tagtypeIds.ServiceTagId) serviceTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
			if(helperTagVal.tagtypeId == tagtypeIds.SpecializationTagId) specTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
			if(helperTagVal.tagtypeId == tagtypeIds.MembershipsTagId) membershipTags.push({value: helperTagVal.id, label: helperTagVal.tagdetails[0].title, tagtypeId: helperTagVal.tagtypeId})
		}
	})
	return {serviceTags: serviceTags, specTags: specTags, membershipTags: membershipTags}
}

function educations(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'ADD_MORE_EDUCATION':
			//return [...state, {tagtypeId: '', college_name: '', year_of_passing: '', doctorProfileId: action.doctorProfileId, edu_proof: '', edu_proof_file_name: ''}];
			return [...state, {tagtypeId: action.tagtypeId, college_name: action.college_name, year_of_passing: action.year_of_passing, doctorProfileId: action.doctorProfileId, edu_proof_file_name: '', newAdd: true}];
		case 'REMOVE_EDUCATION':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var eduData;
			if(0 === action.data.data.doctoreducations.length) {
				eduData = [];
			} else {
				eduData = action.data.data.doctoreducations.map((item) => {
					return {
						tagtypeId: item.tagtypeId,
						college_name: item.doctoreducationdetails[0].college_name,
						year_of_passing: item.year_of_passing,
						doctorProfileId: action.data.data.id,
						edu_proof: item.edu_proof,
						edu_proof_file_name: item.edu_proof_file_name
					}
				})	
			}
			return eduData;
		default:
			return state;
	}
}

function registrations(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'ADD_MORE_REGISTRATION':
			return [...state, {council_registration_number: action.council_registration_number, council_name: action.council_name, year_of_registration: action.year_of_registration, doctorProfileId: action.doctorProfileId, reg_proof: '', reg_proof_file_name: '', newAdd: true}];
		case 'REMOVE_REGISTRATION':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var regData;
			if(0 === action.data.data.doctorregistrations.length) {
				regData = [];
			} else {
				regData = action.data.data.doctorregistrations.map((item) => {
					return {
						council_registration_number: item.council_registration_number,
						council_name: item.doctorregistrationdetails[0].council_name,
						year_of_registration: item.year_of_registration,
						doctorProfileId: action.data.data.id,
						reg_proof: item.reg_proof,
						reg_proof_file_name: item.reg_proof_file_name
					}
				})	
			}
			return regData;
		default:
			return state;
	}
}

function experiences(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'ADD_MORE_EXPERIENCE':
			return [...state, {clinic_hospital_name: action.clinic_hospital_name, designation: action.designation, city_name: action.city_name, duration_from: action.duration_from, duration_to: action.duration_to, doctorProfileId: action.doctorProfileId, newAdd: true}];
		case 'REMOVE_EXPERIENCE':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var expData;
			if(0 === action.data.data.doctorexperiences.length) {
				expData = [];
			} else {
				expData = action.data.data.doctorexperiences.map((item) => {
					return {
						clinic_hospital_name: item.doctorexperiencedetails[0].clinic_hospital_name,
						designation: item.designation,
						city_name: item.doctorexperiencedetails[0].city_name,
						duration_from: item.duration_from,
						duration_to: item.duration_to,
						doctorProfileId: action.data.data.id
					}
				})	
			}
			return expData;
		default:
			return state;
	}
}

function awards(state = [], action) {
	switch(action.type) {
		case 'INIT_PROFILE_RELATED_DATA':
			return [];
		case 'ADD_MORE_AWARD':
			return [...state, {award_gratitude_title: action.award_gratitude_title, award_year: action.award_year, doctorProfileId: action.doctorProfileId, newAdd: true}];
		case 'REMOVE_AWARD':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var awrData;
			if(0 === action.data.data.doctorawards.length) {
				awrData = [];
			} else {
				awrData = action.data.data.doctorawards.map((item) => {
					return {
						award_year: item.award_year,
						award_gratitude_title: item.doctorawarddetails[0].award_gratitude_title,
						doctorProfileId: action.data.data.id
					}
				})	
			}
			return awrData;
		default:
			return state;
	}
}

const defaultFiles = {
	images: [],
	videos: []
}
function doctorFiles(state = defaultFiles, action) {
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
			action.data.data.doctorfiles.map((item) => {
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
function resetDocumentForm(state = false, action) {
	switch(action.type) {
		case 'UPDATE_DOCUMENTS_DATA':
			return true;
		default:
			return false;
	}
}

const defaultAdditionalInfo = {
	specializations: [],
	services: [],
	memberships: [],
}
function additionalInfo(state = defaultAdditionalInfo, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	switch(action.type) {
		case 'START_ADD':
			return state;
		case 'SET_EDIT_DATA':
			var specializations = [], services = [], memberships = [];
			action.data.data.doctortags.map((item) => {
				if(tagtypeIds.SpecializationTagId === item.tagtypeId) specializations.push(item.tagId)
				if(tagtypeIds.ServiceTagId === item.tagtypeId) services.push(item.tagId)
				if(tagtypeIds.MembershipsTagId === item.tagtypeId) memberships.push(item.tagId)
			})
			return {
				...state,
				specializations: specializations,
				services: services,
				memberships: memberships
			}
		case 'UPDATE_ADD_INFO_VALUE':
			let newState = {...state};
			newState[action.name].push(action.obj)// = action.obj//action.value;
			return newState;
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			var specializations = setTagsLabel(action.data.data.doctortags, action.data.specialization_tags)
			var services = setTagsLabel(action.data.data.doctortags, action.data.service_tags)
			var memberships = setTagsLabel(action.data.data.doctortags, action.data.membership_tags)
			return {
				...state,
				specializations: specializations,
				services: services,
				memberships: memberships
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
		case 'TAG_CREATED':
			let tagToBeUpdated;
			if(action.data.tagtypeId != tagtypeIds.EducationQualificationTagId) {
				tagtypeIds.ServiceTagId == action.data.tagtypeId && (tagToBeUpdated = 'services');
				tagtypeIds.MembershipsTagId == action.data.tagtypeId && (tagToBeUpdated = 'memberships');
				var getPrevState = {...state};
				getPrevState[tagToBeUpdated].push({label: action.data.tagdetail.title, value: action.data.id, tagtypeId: action.data.tagtypeId})
				return getPrevState;
			} else {
				return state;
			}
		default:
			return state;
	}
}


function doctor_mapped_clinics(state = [], action){

	switch(action.type) {
		case 'INIT_NEW_PROFILE_CREATION':
		case 'INIT_PROFILE_RELATED_DATA':
			return []
		case 'SET_EDIT_PROFILE_VIEW':
		case 'SET_PROFILE_VIEW':
			return action.data.data.hospital_doctors
	   default:
		   return state;
   }
}

function filter(state, action) {

	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'SET_FILTER_HOSPITAL_ARR_FRONT':
			return { ...state, filtered_hospital_list_obj_front : action.data, show_create_profile_option: true}
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			if(action.name === 'show_create_profile_option') {
				newState['show_create_profile_option'] = false;
				newState['filtered_hospital_list_obj_front'] = [];
			}
			return newState;
		case 'RESET_FILTER_FILTER_HOSPITALS_DATA':
			return {...state, filtered_hospital_list_obj_front: [], show_create_profile_option: false}
		case 'SET_CLAIMED_PROFILE':
			return {...state, filtered_hospital_list_obj_front: [], show_create_profile_option: false}
		default:
			return state || null;
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
				emails: [{key: '', model: 'doctorprofile', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: '', model: 'doctorprofile', type: 'mobile', value: '', status: 0, is_primary: 1}]
			}
		case 'INIT_PROFILE_RELATED_DATA':
			return {
				emails: [{key: action.data.id, model: 'doctorprofile', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: action.data.id, model: 'doctorprofile', type: 'mobile', value: '', status: 0, is_primary: 1}]
			}
		case 'ADD_MORE_EMAIL_MOBILE':
			var prevState = {...state};
			if(action.dataType === "email") {
				prevState.emails.push({key: action.id, model: 'doctorprofile', type: 'email', value: '', status: 0, is_primary: 0})
			}
			if(action.dataType === "mobile") {
				prevState.mobiles.push({key: action.id, model: 'doctorprofile', type: 'mobile', value: '', status: 0, is_primary: 0})
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

function pendingClinicClaimedProfile(state = null, action) {
	switch(action.type) {
		case 'SET_CLAIMED_PROFILE':
			return action.data;
		case 'CANCEL_CLINIC_CLAIM_REQUEST':
			return null;
		case 'SET_HOSPITAL_ON_DOCTOR':
			return action.data.claimRequestedProfile;
		default:
			return null;
	}
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

function viewOtherDoctorProfile(state = null, action) {
	switch(action.type) {
		case 'VIEW_DOCTOR_PROFILE':
			return action.data;
		default:
			return null
	}
}

function qualificationStates(state = null, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	switch(action.type) {
		case 'UPDATE_QUALIFICATION_INPUT':
			return {...state, [action.name]: action.value};
		case 'ADD_MORE_EDUCATION':
			return {tagtypeId: '', college_name: '', year_of_passing: '', loading: false};
		case 'TAG_LOADING':
			return {...state, loading: action.tagtypeId == tagtypeIds.EducationQualificationTagId ? true : false};
		case 'TAG_CREATED':
			return {...state, loading: false, tagtypeId: action.data.id};
		default:
			return {tagtypeId: '', college_name: '', year_of_passing: '', loading: false};
	}
}

function newTagCreationStates(state = {}, action) {
	let tagtypeIds = utilsActions.tagtypeIds();
	switch(action.type) {
		case 'TAG_LOADING':
			let toBeLoading;
			tagtypeIds.ServiceTagId == action.tagtypeId && (toBeLoading = 'serviceTagLoading');
			tagtypeIds.MembershipsTagId == action.tagtypeId && (toBeLoading = 'membershipTagLoading');
			if(toBeLoading === undefined) {
				return state;
			} else {
				return {...state, [toBeLoading]: true}	
			}
		case 'TAG_CREATED':
			return {serviceTagLoading: false, membershipTagLoading: false}
		default:
			return {serviceTagLoading: false, membershipTagLoading: false}
	}
}

const reducer = combineReducers({
	viewState,
	profileSearch,
	profileSearchHelperData,
	searchedProfiles,
	basicDetails,
	helperData,
	filter,
	activeTab,
	//profileStatus,
	errors,
	educations,
	additionalInfo,
	registrations,
	experiences,
	awards,
	doctorFiles,
	doctor_mapped_clinics,
	contactInformations,
	resetDocumentForm,
	pendingClinicClaimedProfile,
	viewOtherDoctorProfile,
	newTagCreationStates,
	qualificationStates
});

export default reducer;