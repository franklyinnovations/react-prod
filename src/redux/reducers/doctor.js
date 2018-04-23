import { combineReducers } from 'redux';
import PropTypes from 'prop-types';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		case 'START_ADD':
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}
}

function doctors(state = [], action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(doctor => {
				if (doctor.id === itemId)
					doctor.is_active = parseInt(action.status);
				return doctor;
			});
		case 'CLAIM_REQUESTED_UPDATED':
			var itemId = parseInt(action.dataId);
			return state.map(doctor => {
				if (doctor.id === itemId) {
					doctor.claim_status = action.status === "rejected" ? "non-claimed" : "approved";
				}
				return doctor;
			});
		case 'UPDATE_VERIFY_LIVE_STATUS':
			var itemId = parseInt(action.dataId);
			return state.map(doctor => {
				if (doctor.id === itemId) {
					doctor.verified_status = "verified"; doctor.is_live = 1;
				}
				return doctor;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			return {};
		case 'INIT_ERRORS':
			return {};
		case 'SET_DOCTOR_ERRORS':
			return action.errors;
		case 'SET_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
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
		case 'SET_FILTER_HOSPITAL_ARR':
			return { ...state, filtered_hospital_list_obj : action.data }
		case 'SET_FILTER_HOSPITAL_ARR_FRONT':
			return { ...state, filtered_hospital_list_obj_front : action.data }
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		case 'RESET_FILTER_FILTER_HOSPITALS_DATA':
			return { ...state, filtered_hospital_list_obj: []}
		default:
			return state || null;
	}
}

const defaultDataItem = {
	id: '',
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
    latitude: '',
    longitude: '',
}

function doctorBasicDetails(state = defaultDataItem, action) {
 	switch(action.type) {
		case 'START_ADD':
			return defaultDataItem;
			case 'GET_LAT_LONG_GMAP':
				let updateState = {...state};
				updateState['latitude'] = action.lat;
				updateState['longitude'] = action.long;
				return updateState;
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};

			"countryId" === action.name && (newState.stateId = '', newState.cityId = '');
			"stateId" === action.name && (newState.cityId = '');
			newState[action.name] = action.value;
			return newState;
		case 'ADD_EDUCATIONS':
			return {...state, education_tagtypeId: '', college_name: '', year_of_passing: ''}
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			return {
				...state,
				id: action.data.data.id,
				mobile: action.data.data.mobile,
				name: action.data.data.doctorprofiledetails[0].name,
				email: action.data.data.email,
			    google_address: action.data.data.google_address,
			    countryId: action.data.data.countryId,
			    stateId: action.data.data.stateId,
			    cityId: action.data.data.cityId,
				address_line_1: action.data.data.doctorprofiledetails[0].address_line_1,
			    postal_code: action.data.data.postal_code,
			    gender: action.data.data.gender,
			    about_doctor: action.data.data.doctorprofiledetails[0].about_doctor,
			    is_active: 1 === action.data.data.is_active ? true : false,
			    doctor_profile_pic: action.data.data.doctor_profile_pic,
			    latitude: action.data.data.latitude,
    			longitude: action.data.data.longitude,
    			salutation: action.data.data.salutation
			}
		case 'UPDATE_LAT_LNG':
			return {
				...state,
				latitude: action.lat,
    			longitude: action.lng,
    			google_address: action.address
			}
		default:
			return state;
	}
}

const defaultAdditionalInfo = {
	specializations: [],
	services: [],
	memberships: []
}

function doctorAdditionalInfo(state = defaultAdditionalInfo, action) {
	switch(action.type) {
		case 'START_ADD':
			return state;
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			let specializations = [], services = [], memberships = [];
			action.data.data.doctortags.map((item) => {
				if(2 === item.tagtypeId) specializations.push(item.tagId)
				if(1 === item.tagtypeId) services.push(item.tagId)
				if(12 === item.tagtypeId) memberships.push(item.tagId)
			})
			return {
				...state,
				specializations: specializations,
				services: services,
				memberships: memberships
			}
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
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
	all_hospital_list_on_doctor: [],
	all_city_list: [],
	specialization_tags: [],
	membership_tags: [],
	country_name: '',
	state_name: '',
	city_name: ''
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD':
			let prevState = {...state}
			prevState['country_name'] = ''; prevState['state_name'] = ''; prevState['city_name'] = '';
			prevState['countries'] = action.data.countries;
			prevState['service_tags'] = action.data.service_tags.data && 0 < action.data.service_tags.data.tags.length ? getTagsData(action.data.service_tags.data.tags) : [];
			prevState['qualification_tags'] = action.data.qualification_tags.data && 0 < action.data.qualification_tags.data.tags.length ? getTagsData(action.data.qualification_tags.data.tags) : [];
			prevState['all_hospital_list_on_doctor'] = [];
			prevState['specialization_tags'] = action.data.specialization_tags.data && 0 < action.data.specialization_tags.data.tags.length ? getTagsData(action.data.specialization_tags.data.tags) : [];
			prevState['membership_tags'] = action.data.membership_tags.data && 0 < action.data.membership_tags.data.tags.length ? getTagsData(action.data.membership_tags.data.tags) : [];
			return prevState;
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
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':

			let getState = {...state};

			let selectedCountryData = action.data.countries.filter((item) => {
				if(action.data.data.countryId == item.id) return item;
			})
			let selectedStateData = action.data.states.filter((item) => {
				if(action.data.data.stateId == item.id) return item;
			})
			let selectedCityData = action.data.cities.filter((item) => {
				if(action.data.data.cityId == item.id) return item;
			})

			getState.countries = action.data.countries; 
			getState.states = action.data.states;
			getState.cities = action.data.cities;
			getState.service_tags = action.data.service_tags.data && 0 < action.data.service_tags.data.tags.length ? getTagsData(action.data.service_tags.data.tags) : [];
			getState.qualification_tags = action.data.qualification_tags.data && 0 < action.data.qualification_tags.data.tags.length ? getTagsData(action.data.qualification_tags.data.tags) : [];
			getState.specialization_tags = action.data.specialization_tags.data && 0 < action.data.specialization_tags.data.tags.length ? getTagsData(action.data.specialization_tags.data.tags) : [];
			getState.membership_tags = action.data.membership_tags.data && 0 < action.data.membership_tags.data.tags.length ? getTagsData(action.data.membership_tags.data.tags) : [];
			getState.country_name = selectedCountryData.length ? selectedCountryData[0].countrydetails[0].name : '';
			getState.state_name = selectedStateData.length ? selectedStateData[0].statedetails[0].name : '';
			getState.city_name = selectedCityData.length ? selectedCityData[0].citydetails[0].name : '';
			getState.doctor_mappedinhospital_admin = null !== action.data && 0 < action.data.data.hospital_doctors.length ? action.data.data.hospital_doctors : [];

			return getState;
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};

			"countryId" === action.name && (newState.states = [], newState.cities = []);
			"stateId" === action.name && (newState.cities = []);
			newState[action.name] = action.value;
			return newState;
		case 'UPDATE_GMAP_ADDRESS_VALUE':
			let getPrevState = {...state}
			getPrevState[action.slug] = action.value;

			"country_name" === action.slug && (getPrevState.state_name = '', getPrevState.city_name = '');
			"state_name" === action.slug && (getPrevState.city_name = '');
			return getPrevState;
		default:
			return state;
	}
}

function doctorAwards(state = [], action) {
	switch(action.type) {
		case 'START_ADD':
			return [];
		case 'ADD_MORE_AWARD':
			return [...state, {award_gratitude_title: '', award_year: '', doctorProfileId: action.doctorProfileId}];
		case 'REMOVE_AWARD':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'UPDATE_AWARD_INPUT_VALUE':
			var getPrevState = [...state];
			getPrevState[action.dataIndex][action.name] = action.value;
			return getPrevState;
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			var awrData;
			if(0 === action.data.data.doctorawards.length) {
				awrData = [{award_gratitude_title: '', award_year: '', doctorProfileId: action.data.data.id}];
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

function doctorRegistrations(state = [], action) {
	switch(action.type) {
		case 'START_ADD':
			return [];
		case 'ADD_MORE_REGISTRATION':
			return [...state, {council_registration_number: '', council_name: '', year_of_registration: '', doctorProfileId: action.doctorProfileId, reg_proof: '', reg_proof_file_name: ''}];
		case 'REMOVE_REGISTRATION':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'UPDATE_REGISTRATION_INPUT_VALUE':
			var getPrevState = [...state];
			getPrevState[action.dataIndex][action.name] = action.value;
			return getPrevState;
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			var regData;
			if(0 === action.data.data.doctorregistrations.length) {
				regData = [{council_registration_number: '', council_name: '', year_of_registration: '', doctorProfileId: action.data.data.id, reg_proof: '', reg_proof_file_name: ''}];
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

function doctorExperiences(state = [], action) {
	switch(action.type) {
		case 'START_ADD':
			return [];
		case 'ADD_MORE_EXPERIENCE':
			return [...state, {clinic_hospital_name: '', designation: '', city_name: '', duration_from: '', duration_to: '', doctorProfileId: action.doctorProfileId}];
		case 'REMOVE_EXPERIENCE':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'UPDATE_EXPERIENCE_INPUT_VALUE':
			var getPrevState = [...state];
			getPrevState[action.dataIndex][action.name] = action.value;
			return getPrevState;
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			var expData;
			if(0 === action.data.data.doctorexperiences.length) {
				expData = [{clinic_hospital_name: '', designation: '', city_name: '', duration_from: '', duration_to: '', doctorProfileId: action.data.data.id}];
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

function doctorEducations(state = [], action) {
	switch(action.type) {
		case 'START_ADD':
			return [];
		case 'ADD_MORE_EDUCATION':
			return [...state, {tagtypeId: '', college_name: '', year_of_passing: '', doctorProfileId: action.doctorProfileId, edu_proof: '', edu_proof_file_name: ''}];
		case 'REMOVE_EDUCATION':
			var getPrevState = [...state]
			delete getPrevState[action.index]
			return getPrevState.filter(function(){return true;});
		case 'UPDATE_EDUCATION_INPUT_VALUE':
			var getPrevState = [...state];
			getPrevState[action.dataIndex][action.name] = action.value;
			return getPrevState;
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
			var eduData;
			if(0 === action.data.data.doctoreducations.length) {
				eduData = [{tagtypeId: '', college_name: '', year_of_passing: '', doctorProfileId: action.data.data.id, edu_proof: '', edu_proof_file_name: ''}];
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

const defaultFiles = {
	images: [],
	videos: []
}

function doctorFiles(state = defaultFiles, action) {
	switch(action.type) {
		case 'START_ADD':
			return {
				...state, images: [], videos: []
			};
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
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

function getTagsData(items){
	let data = [];
	items.forEach(function(item){
		data.push({value: item.id, label: item.tagdetails[0].title, tagtypeId: item.tagtypeId})
	});
	return data;
}

function claimRequestDetail(state = {}, action) {
	switch(action.type) {
		case 'SET_CLAIMED_REQUEST_DETAIL':
			return {
				...state,
				data: action.data,
				isLoading: false,
				modalDisplay: true
			}
		case 'INIT_CLAIM_REQUEST_DETAIL_LOADING':
			return {
				...state,
				data: null,
				isLoading: true,
				modalDisplay: true
			}
		case 'CLOSE_MODAL':
			return {
				...state, data: null, isLoading: false, modalDisplay: false
			}
		case 'CLAIM_REQUESTED_UPDATED':
			return {
				...state, data: null, isLoading: false, modalDisplay: false
			}
		default:
			return {
				...state,
				data: null,
				isLoading: false,
				modalDisplay: false
			}
	}
}

const defaultcontactInformations = {
	emails: [],
	mobiles: []
}
function contactInformations(state = {}, action) {
	switch(action.type) {
		case 'START_ADD':
			return {
				emails: [{key: '', model: 'doctorprofile', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: '', model: 'doctorprofile', type: 'mobile', value: '', status: 0, is_primary: 1}]
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
		case 'SET_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
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

function mappedHospitals(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
			return [];
		case 'SET_EDIT_DATA': 
		case 'INIT_PROFILE_RELATED_DATA':
			return action.data.data.hospital_doctors;
		default:
			return state;
	}
}

function activeTabKey(state = null, action) {
	switch(action.type) {
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return 'basic_details';
		case 'INIT_PROFILE_RELATED_DATA':
			return action.key;
		case 'UPDATE_TAB_KEY':
			return action.key;
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

const reducer = combineReducers({
	viewState,
	doctors,
	errors,
	pageInfo,
	filter,
	doctorBasicDetails,
	helperData,
	doctorAwards,
	doctorRegistrations,
	doctorExperiences,
	doctorEducations,
	doctorAdditionalInfo,
	doctorFiles,
	claimRequestDetail,
	contactInformations,
	mappedHospitals,
	activeTabKey,
	resetDocumentForm
});

export default reducer;
