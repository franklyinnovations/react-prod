import * as login from './login';
import * as home from './home';
import * as academicsession from './academicsession';
import * as section from './section';
import * as role from './role';
import * as tag from './tag';
import * as country from './country';
import * as state from './state';
import * as city from './city';
import * as hospital from './hospital';
import * as doctor from './doctor';
import * as patient from './patient';
import * as signup from './signup';
import * as doctor_profile from './doctor_profile';
import * as hospital_profile from './hospital/profile';
import * as doctor_article from './doctor/article';
import * as doctor_myschedule from './doctor/myschedule';
import * as hospital_myschedule from './hospital/myschedule';
import * as article from './article';
import * as pending_article from './pending_article';
import * as doctor_feedback from './doctor/feedback';
import * as hospital_feedback from './hospital/feedback';
import * as map_tag from './map_tag';
import * as feedback from './feedback';
import * as onlineconsult from './doctor/onlineconsult';
import * as freeqa from './doctor/freeqa';
import * as adminfreeqa from './adminfreeqa';
import * as chat from './chat';
import * as dashboard from './dashboard';
import * as chatconsult from './chatconsult';
import * as resetpassword from './resetpassword';
import * as account from './account';
import * as appointment from './appointment';
import * as jobpost from './hospital/jobpost';
import * as application from './hospital/application';
import * as clinicjobpost from './doctor_clinic/jobpost';
import * as clinicapplication from './doctor_clinic/application';
import * as adminjobpost from './adminjobpost';
import * as clinicschedule from './doctor/clinicschedule';

import * as doctor_clinic from './doctor_clinic';
import * as doctor_new_clinic_add from './doctor_new_clinic_add';

import * as doctor_clinic_feedback from './doctor_clinic/feedback';

import * as chatpayment from './chatpayment';
import * as commissionsetting from './commissionsetting';
import * as careers from './careers';
import * as careerdetail from './careerdetail';
import * as careerapply from './careerapply';
import * as tag_for_approval from './tag_for_approval';
import * as adminsubscription from './adminsubscription';
import * as subscriptionplan from './subscriptionplan';

import api from '../../api';

function getSession() {
	return dispatch => api({
		method: 'get',
		url: '/session'
	})
	.then(session => {
		dispatch({
			type: 'INIT_SESSION',
			session
		});
	})
	.catch(error => console.error)
}

module.exports = {
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
