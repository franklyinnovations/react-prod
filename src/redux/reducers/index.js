import login from './login';
import home from './home';
import academicsession from './academicsession';
import section from './section';
import role from './role';
import tag from './tag';
import country from './country';
import state from './state';
import city from './city';
import hospital from './hospital';
import doctor from './doctor';
import patient from './patient';
import signup from './signup';
import doctor_profile from './doctor_profile';
import hospital_profile from './hospital/profile';
import doctor_article from './doctor/article';
import doctor_myschedule from './doctor/myschedule';
import hospital_myschedule from './hospital/myschedule';
import article from './article';
import pending_article from './pending_article';
import doctor_feedback from './doctor/feedback';
import hospital_feedback from './hospital/feedback';
import map_tag from './map_tag';
import feedback from './feedback';
import doctor_clinic from './doctor_clinic';
import doctor_new_clinic_add from './doctor_new_clinic_add';
import onlineconsult from './doctor/onlineconsult';
import freeqa from './doctor/freeqa';
import adminfreeqa from './adminfreeqa';
import chat from './chat';
import dashboard from './dashboard';
import chatconsult from './chatconsult';
import resetpassword from './resetpassword';
import account from './account';
import appointment from './appointment';
import clinicschedule from './doctor/clinicschedule';

import doctor_clinic_feedback from './doctor_clinic/feedback';
import jobpost from './hospital/jobpost';
import application from './hospital/application';
import clinicjobpost from './doctor_clinic/jobpost';
import clinicapplication from './doctor_clinic/application';
import adminjobpost from './adminjobpost';
import chatpayment from './chatpayment';
import commissionsetting from './commissionsetting';
import careers from './careers';
import careerdetail from './careerdetail';
import careerapply from './careerapply';
import tag_for_approval from './tag_for_approval';
import adminsubscription from './adminsubscription';
import subscriptionplan from './subscriptionplan';

import { combineReducers } from 'redux';


const views = {
	login,
	home,
	academicsession,
	section,
  	role,
  	tag,
  	country,
  	state,
  	city,
  	hospital,
	patient,
	doctor,
	signup,
	doctor_profile,
	hospital_profile,
	doctor_article,
	doctor_myschedule,
	hospital_myschedule,
	article,
	pending_article,
	doctor_feedback,
	hospital_feedback,
	map_tag,
	feedback,
	doctor_clinic,
	doctor_new_clinic_add,
	onlineconsult,
	freeqa,
	adminfreeqa,
	chat,
	dashboard,
	chatconsult,
	doctor_clinic_feedback,
	resetpassword,
	account,
	appointment,
	jobpost,
	application,
	clinicjobpost,
	clinicapplication,
	adminjobpost,
	clinicschedule,
	chatpayment,
	commissionsetting,
	careers,
	careerdetail,
	careerapply,
	tag_for_approval,
	adminsubscription,
	subscriptionplan
};

function session(state = {}, action) {
	let siteAdmin;
	if (action.type === 'INIT_APP') {
		siteAdmin = {...action.session.siteAdmin};
		delete siteAdmin.password;
		delete siteAdmin.oauth;
		return siteAdmin;
	} else if (action.type === 'ACCOUNT_SAVED') {
		return {
			...state,
			email: action.email,
			mobile: action.mobile,
			userdetails: {
				...state.userdetails,
				fullname: action.name,
			}
		}
	}
	if(action.type === 'SET_SESSION_HOSPITAL_PROFILES') {
		siteAdmin = {...state};
			siteAdmin.allHospitalProfiles = action.data;
			if (!siteAdmin.associatedProfileData)
				siteAdmin.associatedProfileData = action.data[0];
			return siteAdmin;
	}
	if(action.type === 'SET_SESSION_HOSPITAL_PROFILES_FOR_DC') {
		siteAdmin = {...state};
			siteAdmin.allHospitalProfiles = action.data;
			return siteAdmin;
	}
	return state;
}

function cookies(state = '', {type, cookie = ''}) {
	switch (type) {
		case 'INIT_APP':
		case 'SET_COOKIE':
			return cookie;
		default:
			return state;
	}
}

function view(state = null, action) {
	const v = (
		(action.type === 'INIT_MODULE' && action.view)
		|| (action.type === 'LOADING_MODULE' && action.view)
		|| (state && state.viewName)
	);
	if (!v || (action.type === 'INIT_MODULE' && state && state.viewName !== action.view)) return state;

	return {
		viewName: v,
		loading: action.type === 'LOADING_MODULE' || (state && state.loading && !action.stopLoading),
		[v]: views[v](state ? state[v] : undefined, action),
	};
}


function location(state = {query: {}, pathname: '/'}, action) {
	switch (action.type) {
		case '@@router/LOCATION_CHANGE':
			$(window).scrollTop(0);
			return {
				query: action.payload.query,
				pathname: action.payload.pathname,
			};
		case 'INIT_APP':
			return {
				query: action.query,
				pathname: action.pathname,
			};
		default:
			return state;
	}
}

const defaultLang = {
	id: 1,
	code: 'en',
	dir: 'lr'
};

function lang(state = defaultLang, action) {
	switch (action.type) {
		case 'INIT_APP':
			return {
				...state,
				...action.lang,
			};
		default:
			return state;
	}
}

function translations(state = {}, action) {
	switch (action.type) {
		case 'INIT_APP':
			return action.translations;
		default:
			return state;
	}
}

module.exports = {
	session,
	view,
	cookies,
	location,
	lang,
	translations
};
