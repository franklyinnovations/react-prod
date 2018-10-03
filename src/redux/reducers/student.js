import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';
import moment from 'moment';

function items(state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_STUDENT_STATUS':
			itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.user.id === itemId)
					item.user.is_active = parseInt(action.status);
				return item;
			});
		case 'SEND_STUDENT_LOGIN_INFO': 
			itemId = parseInt(action.itemId); 
			return state.map(item => { 
				if (item.id === itemId) item.sendingLoginInfo = true; 
				return item; 
			}); 
		case 'STUDENT_LOGIN_INFO_SENT': 
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
		case 'START_ADD_STUDENT':
		case 'SET_STUDENT_EDIT_DATA':
		case 'ACTIVATE_TAB':
		case 'CLOSE_NOTIFICATION_MODAL_STUDENT':
			return {};
		case 'SET_STUDENT_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultItem = {
	'id':'',
	'studentId':'',
	'roleId':'',
	'studentdetailsId':'',
	'studentrecordsId':'',
	'mobile':'',
	'email':'',
	'password':'',
	'user_image':'',
	'is_active': true,
	'is_supervision': false,
	'userdetails[fullname]':'',
	'student[is_health_issue]': false,
	'student[is_allergies]': false,
	'student[is_medicine]': false,
	'student[is_asthma]': false,
	'student[is_disability]': false,
	'student[enrollment_no]':'',
	'student[form_no]':'',
	'student[fee_receipt_no]':'',
	'student[doa]': null,
	'student[gender]':'',
	'student[blood_group]':'',
	'student[countryId]':'',
	'student[stateId]':'',
	'student[cityId]':'',
	'student[other_city]':'',
	'student[zip_code]':'',
	'student[same_as_comm_add]':'',
	'student[countryId_2]':'',
	'student[stateId_2]':'',
	'student[cityId_2]':'',
	'student[other_city2]':'',
	'student[zip_code2]':'',
	'student[dob]': null,
	'student[father_email]': '',
	'student[mother_email]': '',
	'student[father_contact]':'',
	'student[father_contact_alternate]':'',
	'student[mother_contact]':'',
	'student[mother_contact_alternate]':'',
	'student[transportType]':'',
	'student[routeId]':'',
	'student[stoppage_point]':'',
	'student[res_category]':'',
	'student[aadhar]':'',
	'student[guardian_contact]':'',
	'student[guardian_contact_alternate]':'',
	'student[no_of_brother]':'',
	'student[no_of_sister]':'',
	'student[no_of_brother_in_school]':'',
	'student[no_of_sister_in_school]':'',
	'student[rank_in_family]':'',
	'student[residancy_number]':'',
	'student[rn_issuer]':'',
	'student[date_of_release]': null,
	'student[date_of_expiration]': null,
	'studentdetails[religion]':'',
	'studentdetails[height]':'',
	'studentdetails[weight]':'',
	'studentdetails[birthmark]':'',
	'studentdetails[address]':'',
	'studentdetails[address_2]':'',
	'studentdetails[nationality]':'',
	'studentdetails[birthplace]':'',
	'studentdetails[father_name]':'',
	'studentdetails[father_occupation]':'',
	'studentdetails[mother_name]':'',
	'studentdetails[mother_occupation]':'',
	'studentdetails[guardian_name]':'',
	'studentdetails[guardian_relationship]':'',
	'studentdetails[pre_school_name]':'',
	'studentdetails[pre_school_address]':'',
	'studentdetails[pre_qualification]':'',
	'studentdetails[guardian_address]':'',
	'studentdetails[standard_of_living]':'',
	'studentdetails[health_issue_detail]':'',
	'studentdetails[allergies_detail]':'',
	'studentdetails[medicine_detail]':'',
	'studentdetails[asthma_detail]':'',
	'studentdetails[disability_detail]':'',
	'studentrecords[bcsMapId]':'',
	'studentrecords[roll_no]':'',
	'studentrecords[academicSessionId]':'',
	'income_certificate_img':'',
	'ration_card_img':'',
	'labour_card_img':'',
	'mark_list_img':'',
	'birth_certificate_img':'',
	'tc_img':'',
	'cast_certificate_img':'',
	'migration_certificate_img':'',
	'affidavit_img':'',
	'editablePassword': true,
	'countryISOCode': '',
	'feeDiscountId':[],
	'feeDiscountIds':[]
};

function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_STUDENT_EDIT':
			return null;	
		case 'START_ADD_STUDENT':
			return {
				...defaultItem,
				'countryISOCode':action.countryISOCode,
				'student[countryId]':action.countryId,
				'student[countryId_2]':action.countryId,
			};
		case 'SET_STUDENT_EDIT_DATA': {
			let data = action.data.data;

			var selectedDiscount=[];
			selectedDiscount=data.studentdiscounts.map(item => (
				item.feediscountId
			));

			return {
				'id': data.user.id,
				'studentId': data.id,
				'roleId': data.user.roleId,
				'studentdetailsId': data.studentdetails[0].id,
				'studentrecordsId': data.studentrecord.id,
				'mobile': data.user.mobile,
				'email': data.user.email,
				'password':'',
				'user_image': data.user.user_image,
				'is_active': data.user.is_active,
				'is_supervision': !!data.studentdetails[0].guardian_name,
				'userdetails[fullname]': data.user.userdetails[0].fullname,
				'student[is_health_issue]': data.is_health_issue,
				'student[is_allergies]': data.is_allergies,
				'student[is_medicine]': data.is_medicine,
				'student[is_asthma]': data.is_asthma,
				'student[is_disability]': data.is_disability,
				'student[enrollment_no]': data.enrollment_no,
				'student[form_no]': data.form_no,
				'student[fee_receipt_no]': data.fee_receipt_no,
				'student[doa]': moment(data.doa),
				'student[gender]': data.gender,
				'student[blood_group]': data.blood_group,
				'student[countryId]': data.countryId,
				'student[stateId]': data.stateId,
				'student[cityId]': data.cityId,
				'student[other_city]': data.other_city || '',
				'student[zip_code]': data.zip_code || '',
				'student[same_as_comm_add]': data.same_as_comm_add,
				'student[countryId_2]': data.countryId_2,
				'student[stateId_2]': data.stateId_2,
				'student[cityId_2]': data.cityId_2,
				'student[other_city2]': data.other_city2 || '',
				'student[zip_code2]': data.zip_code2 || '',
				'student[dob]': moment(data.dob),
				'student[father_email]': data.father_email,
				'student[mother_email]': data.mother_email,
				'student[father_contact]': data.father_contact,
				'student[father_contact_alternate]': data.father_contact_alternate,
				'student[mother_contact]': data.mother_contact,
				'student[mother_contact_alternate]': data.mother_contact_alternate,
				'student[transportType]': data.transportType,
				'student[routeId]': data.routeId,
				'student[stoppage_point]': data.stoppage_point,
				'student[res_category]': data.res_category,
				'student[aadhar]': data.aadhar || '',
				'student[guardian_contact]': data.guardian_contact,
				'student[guardian_contact_alternate]': data.guardian_contact_alternate,
				'student[no_of_brother]': data.no_of_brother,
				'student[no_of_sister]': data.no_of_sister,
				'student[no_of_brother_in_school]': data.no_of_brother_in_school,
				'student[no_of_sister_in_school]': data.no_of_sister_in_school,
				'student[rank_in_family]': data.rank_in_family,
				'student[residancy_number]': data.residancy_number,
				'student[rn_issuer]': data.rn_issuer,
				'student[date_of_release]': moment(data.date_of_release),
				'student[date_of_expiration]': moment(data.date_of_expiration),
				'studentdetails[religion]': data.studentdetails[0].religion,
				'studentdetails[height]': data.studentdetails[0].height,
				'studentdetails[weight]': data.studentdetails[0].weight,
				'studentdetails[birthmark]': data.studentdetails[0].birthmark,
				'studentdetails[address]': data.studentdetails[0].address,
				'studentdetails[address_2]': data.studentdetails[0].address_2,
				'studentdetails[nationality]': data.studentdetails[0].nationality,
				'studentdetails[birthplace]': data.studentdetails[0].birthplace,
				'studentdetails[father_name]': data.studentdetails[0].father_name,
				'studentdetails[father_occupation]':data.studentdetails[0].father_occupation,
				'studentdetails[mother_name]': data.studentdetails[0].mother_name,
				'studentdetails[mother_occupation]':data.studentdetails[0].mother_occupation,
				'studentdetails[guardian_name]': data.studentdetails[0].guardian_name,
				'studentdetails[guardian_relationship]': data.studentdetails[0].guardian_relationship,
				'studentdetails[pre_school_name]': data.studentdetails[0].pre_school_name,
				'studentdetails[pre_school_address]': data.studentdetails[0].pre_school_address,
				'studentdetails[pre_qualification]': data.studentdetails[0].pre_qualification,
				'studentdetails[guardian_address]': data.studentdetails[0].guardian_address,
				'studentdetails[standard_of_living]': data.studentdetails[0].standard_of_living,
				'studentdetails[health_issue_detail]': data.studentdetails[0].health_issue_detail,
				'studentdetails[allergies_detail]': data.studentdetails[0].allergies_detail,
				'studentdetails[medicine_detail]': data.studentdetails[0].medicine_detail,
				'studentdetails[asthma_detail]': data.studentdetails[0].asthma_detail,
				'studentdetails[disability_detail]': data.studentdetails[0].disability_detail,
				'studentrecords[bcsMapId]': data.studentrecord.bcsMapId,
				'studentrecords[roll_no]': data.studentrecord.roll_no || '',
				'studentrecords[academicSessionId]': data.studentrecord.academicSessionId,
				'income_certificate_img': data.income_certificate_img,
				'ration_card_img': data.ration_card_img,
				'labour_card_img': data.labour_card_img,
				'mark_list_img': data.mark_list_img,
				'birth_certificate_img': data.birth_certificate_img,
				'tc_img': data.tc_img,
				'cast_certificate_img': data.cast_certificate_img,
				'migration_certificate_img': data.migration_certificate_img,
				'affidavit_img': data.affidavit_img,
				'editablePassword': false,
				'countryISOCode':action.countryISOCode,
				'feeDiscountId':selectedDiscount
			};
		}
		case 'UPDATE_STUDENT_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		}
		case 'LOAD_AVAILABLE_STATE1':
			return {
				...state,
				'student[stateId]': null,
			};
		case 'LOAD_AVAILABLE_STATE2':
			return {
				...state,
				'student[stateId_2]': null,
			};
		case 'LOAD_AVAILABLE_CITY1':
			return {
				...state,
				'student[cityId]': null,
			};
		case 'LOAD_AVAILABLE_CITY2':
			return {
				...state,
				'student[cityId_2]': null,
			};	
		default:
			return state;
	}
}

const defaultHelperData = {
	countries: [],
	states: [],
	cities: [],
	states2: [],
	cities2: [],
	bcsmaps:[],
	identities:[],
	languages:[],
	timezones:[],
	loadingStates: false,
	loadingCities: false,
	loadingStates2: false,
	loadingCities2: false,
	roleId:'',
	routes:[],
	routeAddress:[],
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps
			};
		case 'START_ADD_STUDENT':
			return {
				...state,
				countries:action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				})),
				states: action.states.data.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				states2: action.states.data.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				bcsmaps:action.data.bcsmaps.data.map(item => ({
					value: item.id,
					label: item.board.boarddetails[0].alias +'-'+item.class.classesdetails[0].name+'-'+item.section.sectiondetails[0].name
				})),
				roleId:action.data.roleId.id,
				routes:action.data.routes.data.map(item => ({
					value: item.id,
					label: item.name
				})),
				feediscount:action.data.feediscount.map(item => ({
					value: item.id,
					label: item.feediscountdetails[0].name
				}))
			};
		case 'SET_STUDENT_EDIT_DATA': {
			let st = [], ct=[];
			if(!action.data.data.same_as_comm_add){
				st = action.data.states2.data.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				}));
				ct =  action.data.cities2.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				}));
			}
			return {
				...state,
				countries: action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				})),
				states: action.data.states.data.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				cities: action.data.cities.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				})),
				routes: action.data.routes.data.map(item => ({
					value: item.id,
					label: item.name
				})),
				routeAddress: action.data.routeAddress.data.map(item => ({
					label: item.address,
					value: item.id
				})),
				bcsmaps:action.data.bcsmaps.data.map(item => ({
					value: item.id,
					label: item.board.boarddetails[0].alias +'-'+item.class.classesdetails[0].name+'-'+item.section.sectiondetails[0].name
				})),
				feediscount:action.data.feediscount.map(item => ({
					value: item.id,
					label: item.feediscountdetails[0].name
				})),
				roleId:action.data.roleId.id,
				states2: st,
				cities2: ct,
			};
		}
		case 'LOAD_AVAILABLE_STATE1':
			return {
				...state,
				states: [],
				cities: [],
				loadingStates: true
			};
		case 'SET_AVAILABLE_STATE1':
			return {
				...state,
				states: action.states.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				loadingStates: false
			};
		case 'LOAD_AVAILABLE_CITY1':
			return {
				...state,
				cities: [],
				loadingCities: true
			};
		case 'SET_AVAILABLE_CITY1':
			return {
				...state,
				cities: action.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				})),
				loadingCities: false
			};
		case 'LOAD_AVAILABLE_STATE2':
			return {
				...state,
				states2: [],
				cities2: [],
				loadingStates2: true
			};
		case 'SET_AVAILABLE_STATE2':
			return {
				...state,
				states2: action.states.map(item => ({
					label: item.statedetails[0].name,
					value: item.id
				})),
				loadingStates2: false
			};
		case 'LOAD_AVAILABLE_CITY2':
			return {
				...state,
				cities2: [],
				loadingCities2: true
			};
		case 'SET_AVAILABLE_CITY2':
			return {
				...state,
				cities2: action.data.map(item => ({
					label: item.citydetails[0].name,
					value: item.id
				})),
				loadingCities2: false
			};
		case 'LOAD_ROUTE_ADDRESS':
			return {
				...state,
				routeAddress: []
			};
		case 'SET_ROUTE_ADDRESS':
			return {
				...state,
				routeAddress: action.data.map(item => ({
					label: item.address,
					value: item.id
				}))
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SET_STUDENT_SAVE_ERRORS':
		case 'INIT_MODULE':
			return false;
		case 'SEND_ADD_STUDENT_REQUEST':
			return true;
		default:
			return state;
	}
}

const defaultSendemail = {
	emailModal: false,
	smsModal: false,
	selectedIds:[],
	subject: '',
	message: '',
	checkedBox: {}
};
function notification(state = defaultSendemail, action) {
	switch(action.type) {
		case 'SHOW_NOTIFICATION_MODAL_STUDENT':
			return {
				...state,
				emailModal: action.modal === 'email' ? true : false,
				smsModal: action.modal === 'sms' ? true : false,
				discountModal: action.modal === 'discount' ? true : false,
				subject: '',
				message: ''
			};
		case 'UPDATE_CHECKBOX_STUDENT': {
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
		case 'CLOSE_NOTIFICATION_MODAL_STUDENT':
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

function selector(state = {show: false, bcsMapId: null, feeDiscountId:[], feeDiscountIds:[], loading: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				feediscount:action.data.feediscount.map(item => ({
					value: item.id,
					label: item.feediscountdetails[0].name
				})) 
			};
		case 'SHOW_STUDENT_EXPORT_DATA_MODAL':
			return {
				show: true, bcsMapId: null, loading: false,
			};
		case 'HIDE_STUDENT_EXPORT_DATA_MODAL':
			return {
				...state,
				show: false,
			};
		case 'UPDATE_STUDENT_EXPORT_DATA_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'LOADED_STUDENT_EXPORT_DATA':
			return {
				...state,
				show: false,
				loading: false,
			};
		case 'LOADING_STUDENT_EXPORT_DATA':
			return {
				...state,
				loading: true,
			};
		case 'UPDATE_STUDENT_DISCOUNT_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		}	
		default:
			return state;
	}
}


function tabbing(state = {activateKey: 1}, action) {
	switch(action.type) {
		case 'START_ADD_STUDENT':
		case 'SET_STUDENT_EDIT_DATA':
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
	selector,
	tabbing
});

export default reducer;