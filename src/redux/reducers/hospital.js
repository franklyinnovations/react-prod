import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_HOSPITAL_LIST':
		return 'LIST';
		case 'START_ADD_HOSPITAL':
		case 'SET_HOSPITAL_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
		return 'DATA_FORM';
		default:
		return state;
	}
}

function hospitals(state = [], action) {

	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(hospital => {
				if (hospital.id === itemId)
					hospital.is_active = parseInt(action.status);
				return hospital;
			});
		case 'CLAIM_REQUESTED_UPDATED':
			var itemId = parseInt(action.dataId);
			return state.map(hospital => {
				if (hospital.id === itemId) {
					hospital.claim_status = action.status === "rejected" ? "non-claimed" : "approved";
				}
				return hospital;
			});
		case 'UPDATE_VERIFY_LIVE_STATUS':
			var itemId = parseInt(action.dataId);
			return state.map(hospital => {
				if (hospital.id === itemId) {
					hospital.verified_status = "verified"; hospital.is_live = 1;
				}
				return hospital;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_HOSPITAL':
		case 'SET_HOSPITAL_EDIT_DATA':
			return {};
		case 'INIT_ERRORS':
			return {};
		case 'SET_HOSPITAL_ERRORS':
			return action.errors;
		case 'SET_MESSAGE':
			return action;
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

function tagType(state,action){
	switch(action.type) {
		case 'LOADING_TAG_TYPE':
		return {serviceId:''};
		case 'SET_TAGS_LIST':
		let serviceList = action.data.data.tags.map(item => ({
			value: item.id,
			label: item.tagdetails[0].title
		}));
		return {serviceList:serviceList};
		default:
		return {};
	}
}
function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		return state || {};
		case 'RESET_FILTERS':
		return {};
		case 'UPDATE_FILTER':
		var newState = {...state};
		if (action.value) {
			newState[action.name] = action.value;
		} else {
			delete newState[action.name];
		}
		return newState;
		default:
		return state || null;
	}
}

const defaultDataItem = {
	id: '',
	hospital_name:'',
	about_hospital:'',
	address:'',
	zipcode:'',
	hospital_logo:'',
	countryId: '',
	stateId: '',
	cityId: '',
	doctors : [],
	filtered_doctor_list : [],
	hospital_files: [],
	latitude: '',
	copy_week_days : 0,
	longitude: '',
	google_address: '',
	isNext : false
}
function hospitalAwards(state = [], action) {
	switch(action.type) {
		case 'START_ADD':
		return [];
		case 'ADD_MORE_AWARD':
		return [...state, {award_gratitude_title: '', award_year: '', hospitalId: action.hospitalId}];
		case 'REMOVE_AWARD':
		var getPrevState = [...state]
		delete getPrevState[action.index]
		return getPrevState.filter(function(){return true;});
		case 'UPDATE_AWARD_INPUT_VALUE':
		var getPrevState = [...state];
		getPrevState[action.dataIndex][action.name] = action.value;
		return getPrevState;

		case 'SET_EDIT_DATA':
		let awrData = action.data.data.hospitalawards.map((item) => {
			return {
				award_year: item.award_year,
				award_gratitude_title: item.hospitalawarddetails[0].award_gratitude_title,
				hospitalId: action.data.data.id
			}
		})
		if(awrData.length>0){
			return awrData;
		}else{
			return [{award_gratitude_title: '', award_year: '', hospitalId: action.data.data.id}];
			//return [{award_gratitude_title: '', award_year: '', hospitalId: action.data.data.id}];
		}
		default:
		return state;
	}
}
function hospital(state = defaultDataItem, action) {
	switch(action.type) {
		case 'START_ADD_HOSPITAL':
		return defaultDataItem;
		case 'CHANGE_ITEM_STATUS_DOCUMENT':
		return {};
		case 'GET_LAT_LONG_GMAP':
		let updateState = {...state};
		updateState['latitude'] = action.lat;
		updateState['longitude'] = action.long;
		return updateState;
		//return {'lat':action.lat,'long':action.long};
		case 'SET_HOSPITAL_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
		let serviceId = [];
		let specialId = [];
		let memberId = [];
		let insuranceId = [];
		action.data.data.hospitalservices.map(function(item,index){
			if(item.tagtypeId==1){
				serviceId.push(item.tagId);
			}else if(item.tagtypeId==2){
				specialId.push(item.tagId);
			}else if(item.tagtypeId==12){
				memberId.push(item.tagId);
			}else{
				insuranceId.push(item.tagId);
			}
		});

		return {
			id: action.data.data.id,
			hospital_detail_id: action.data.data.hospitaldetails[0].id,
			'hospital_detail[hospital_name]': action.data.data.hospitaldetails[0].hospital_name,
			'hospital_detail[about_hospital]': action.data.data.hospitaldetails[0].about_hospital,
			'hospital_detail[address]': action.data.data.hospitaldetails[0].address,
			zipcode: action.data.data.zipcode,
			'hospital_detail[contact_emails]': action.data.data.hospitaldetails[0].contact_emails,
			'hospital_detail[contact_mobiles]': action.data.data.hospitaldetails[0].contact_mobiles,
			hospital_logo: action.data.data.hospital_logo,
			shift_24X7: action.data.data.shift_24X7,
			hospital_files: action.data.data.hospitalfiles,
			hospital_timings: action.data.data.hospital_timings,
			hospital_doctors: action.data.data.hospital_doctors,
			doctors_list_all: action.data.doctors.data,
			countryId: action.data.data.countryId,
			stateId: action.data.data.stateId,
			cityId: action.data.data.cityId,
			is_active: action.data.data.is_active,
			is_freeze: action.data.data.is_freeze,
			serviceId:serviceId,
			specialId:specialId,
			memberId:memberId,
			insuranceId:insuranceId,
			// states:action.data.states.data.map(item => ({
			// 	value: item.id,
			// 	label: item.statedetails[0].name
			// })),
			// cities:action.data.cities.data.map(item => ({
			// 	value: item.id,
			// 	label: item.citydetails[0].name
			// })),
			latitude: action.data.data.lat,
			longitude: action.data.data.long
		};
		case 'UPDATE_DATA_VALUE':
		let newState = {...state};
		newState[action.name] = action.value;
		return newState;
		// case 'STATE_LIST_BY_COUNTY_ID':
		//                   let newoneState = {...state};
		// 		newoneState['states'] = action.data.data.map(item => ({
		// 			value: item.id,
		// 			label: item.statedetails[0].name
		// 		}));
		//                               newoneState['countryId'] = action.data.countryId;
		//                               return newoneState;
		// case 'CITY_LIST_BY_STATE_ID':
		//                   let newonecityState = {...state};
		// 		newonecityState['cities'] = action.data.data.map(item => ({
		// 			value: item.id,
		// 			label: item.citydetails[0].name
		// 		}));
		//                               newonecityState['stateId'] = action.data.stateId;
		//                               return newonecityState;
		case 'UPDATE_LAT_LNG':
		return {
			...state,
			latitude: action.lat,
			longitude: action.lng,
			google_address: action.google_address
		}
		case 'SET_FILTER_DOCTOR_ARR':
		return {
			...state,
			filtered_doctor_list: action.res.data,
		}
		case 'UPDATE_DOCUMENTS_DATA': 
			var prevState = {...state}
			prevState.hospital_files.push(action.data)
			// if("image" === action.data.file_type) {
			// 	prevState.images.push(action.data)
			// }
			// if("video" === action.data.file_type) {
			// 	prevState.videos.push(action.data)
			// }
			return prevState;
		case 'CHANGE_DOCUMENT_STATUS':
			let prevState = {...state}
			parseInt(action.status)
			var itemId = parseInt(action.itemId);

			prevState.hospital_files.map((item) => {
				if (item.id === itemId) item.is_active = parseInt(action.status);
				return item;
			})

			return prevState;
		default:
		return state;
	}
}

const defaultHelperData = {
	countries: [],
	states: [],
	cities: [],
	country_name: '',
	state_name: '',
	city_name: ''
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD_HOSPITAL':

		return {
			...state,
			countries: action.data.countries
			// countries: action.data.countries.map(item => ({
			// 	value: item.id,
			// 	label: item.countrydetails[0].name
			// }))

		};
		case 'SET_HOSPITAL_EDIT_DATA':
		case 'INIT_PROFILE_RELATED_DATA':
		let selectedCountryData = action.data.countries.filter((item) => {
			if(action.data.data.countryId == item.id) return item;
		})
		let selectedStateData = action.data.states.data.filter((item) => {
			if(action.data.data.stateId == item.id) return item;
		})
		let selectedCityData = action.data.cities.data.filter((item) => {
			if(action.data.data.cityId == item.id) return item;
		})


		return {
			...state,
			countries: action.data.countries,
			states: action.data.states.data,
			cities: action.data.cities.data,
			country_name: selectedCountryData.length ? selectedCountryData[0].countrydetails[0].name : '',
			state_name: selectedStateData.length ? selectedStateData[0].statedetails[0].name : '',
			city_name: selectedCityData.length ? selectedCityData[0].citydetails[0].name : '',
			// countries: action.data.countries.map(item => ({
			// 	value: item.id,
			// 	label: item.countrydetails[0].name
			// }))

		};
		case 'STATE_LIST_BY_COUNTY_ID':
		return {...state, states: action.data.data}
		case 'CITY_LIST_BY_STATE_ID':
		return {...state, cities: action.data.data}
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
		case 'START_ADD_HOSPITAL':
			return {
				emails: [{key: '', model: 'hospital', type: 'email', value: '', status: 0, is_primary: 1}],
				mobiles: [{key: '', model: 'hospital', type: 'mobile', value: '', status: 0, is_primary: 1}]
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
		case 'SET_HOSPITAL_EDIT_DATA':
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

function mappedDoctors(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_HOSPITAL':
			return [];
		case 'SET_HOSPITAL_EDIT_DATA': 
		case 'INIT_PROFILE_RELATED_DATA':
			return action.data.data.hospital_doctors;
		default:
			return state;
	}
}

function activeTabKey(state = null, action) {
	switch(action.type) {
		case 'START_ADD_HOSPITAL':
		case 'SET_HOSPITAL_EDIT_DATA':
			return 'basic_info';
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
	hospitals,
	errors,
	pageInfo,
	filter,
	hospital,
	helperData,
	tagType,
	hospitalAwards,
	claimRequestDetail,
	contactInformations,
	mappedDoctors,
	activeTabKey,
	resetDocumentForm
});

export default reducer;
