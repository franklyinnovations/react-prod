import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import * as utilsActions from '../../utils';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return 'LIST_VIEW';
		case 'ADD_PROFILE_VIEW':
			return 'ADD_PROFILE_VIEW';
		case 'EDIT_PROFILE_VIEW':
			return 'EDIT_PROFILE_VIEW';
		case 'SET_HOSPITAL_SEARCH_DATA':
			return 'SEARCH_VIEW';
		default:
			return state;
	}
}

function errors(state = {}, action) {	
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return {};
		case 'INIT_ERRORS':
		case 'EDIT_PROFILE_VIEW':
			return {};
		case 'SET_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function hospitals(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				data: action.data.data, pendingClaimedProfile: action.data.pendingClaimedProfile
			}
		case 'HOSPITAL_CLAIM_REQUEST_CANCEL':
			return { ...state, pendingClaimedProfile: null}
		default:
			return state;
	}
}

const defaultHelperData = {
	
};

function helperData (state = defaultHelperData, action) {
	var setname = {specializations: 'specialization_tags', services: 'service_tags', memberships: 'membership_tags', insurance_companies: 'insurance_companies_tags'}
	switch(action.type) {
		case 'EDIT_PROFILE_VIEW':
			var concatAllhelperTags = action.helperData.service_tags.concat(action.helperData.insurance_companies_tags, action.helperData.specialization_tags, action.helperData.membership_tags);
			var getEditHelperTagsData = setEditHelperTagsData(concatAllhelperTags, action.data.data.hospitalservices);
			return {
				...state,
				countries: action.helperData.countries,
				states: action.helperData.states,
				cities: action.helperData.cities,
				service_tags: getEditHelperTagsData.serviceTags,
				insurance_companies_tags: getEditHelperTagsData.insurCompTags,
				specialization_tags: getEditHelperTagsData.specTags,
				membership_tags: getEditHelperTagsData.membershipTags,
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
		default:
			return state;
	}
}

const defaultclinicSearchData = {
	filtered_hospital_list_obj_front: null,
}
function clinicSearch(state = null, action) {
	switch(action.type) {
		case 'SET_HOSPITAL_SEARCH_DATA':
			return {filtered_hospital_list_obj_front: null};
		case 'SET_FILTER_HOSPITAL_ARR_FRONT':
			return { filtered_hospital_list_obj_front : action.data, show_create_profile_option: true}
		case 'RESET_FILTER_FILTER_HOSPITALS_DATA':
			return {filtered_hospital_list_obj_front: []}
		case 'HIDE_NEW_PROFILE_CREATION_LINK':
		case 'SET_CLAIMED_PROFILE':
			return {...state, filtered_hospital_list_obj_front: [], show_create_profile_option: false}
		default:
			return state || null;
	}
}

function basicDetails(state = {}, action) {
 	switch(action.type) {
		case 'EDIT_PROFILE_VIEW':
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
		case 'EDIT_PROFILE_VIEW':
			return 'basic-info-form';
		default:
			return state;
	}
}

function awards(state = [], action) {
	switch(action.type) {
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
		case 'EDIT_PROFILE_VIEW':
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
	switch(action.type) {
		case 'UPDATE_ADD_INFO_VALUE':
			let newState = {...state};
			newState[action.name].push(action.obj);
			return newState;
		case 'EDIT_PROFILE_VIEW':
			var specializations = setTagsLabel(action.data.data.hospitalservices, action.helperData.specialization_tags)
			var services = setTagsLabel(action.data.data.hospitalservices, action.helperData.service_tags)
			var memberships = setTagsLabel(action.data.data.hospitalservices, action.helperData.membership_tags)
			var insurance_companies = setTagsLabel(action.data.data.hospitalservices, action.helperData.insurance_companies_tags)
			
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
		case 'EDIT_PROFILE_VIEW':
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
		case 'EDIT_PROFILE_VIEW':
			return action.data.data.hospital_timings;
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

function mappedDoctors(state = [], action) {
	switch(action.type) {
		case 'EDIT_PROFILE_VIEW':
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
		case 'EDIT_PROFILE_VIEW':
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
		allTags.map((allTagValues) => {
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

const reducer = combineReducers({
	viewState,
	errors,
	helperData,
	clinicSearch,
	hospitals,
	basicDetails,
	activeTab,
	awards,
	additionalInfo,
	hospitalFiles,
	hospitalTimings,
	doctorLinkHelperData,
	mappedDoctors,
	contactInformations,
	resetDocumentForm
});

export default reducer;
