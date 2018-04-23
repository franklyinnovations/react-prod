import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';
import DisplayError from './routes/DisplayError';

import Footer from './panel/Footer';
import Header from './panel/Header';
import Sidebar from './panel/Sidebar';

import Adminloginfooter from './adminlogin/Footer';
import Adminloginheader from './adminlogin/Header';

import Account from './routes/Account';

import Home from './routes/Home';
import AboutUs from './routes/AboutUs';
import Feature from './routes/Feature';
import FrontArticle from './routes/FrontArticle';
import FrontPage from './routes/Front';
import Careers from './routes/Careers';
import CareerDetail from './routes/CareerDetail';
import CareerApply from './routes/CareerApply';
import Adminloginpage from './routes/Adminlogin';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';
import Section from './routes/Section';
import Role from './routes/Role';
import Tag from './routes/Tag';
import Country from './routes/Country';

import State from './routes/State';
import City from './routes/City';
import Hospital from './routes/Hospital';
import Patient from './routes/Patient';
import Doctor from './routes/Doctor';

import FrontDoctorProfile from './routes/Doctor/Profile';

import FrontSidebar from './front/Sidebar';

import FrontHospitalProfile from './routes/Hospital/Profile';
import FrontHospitalMySchedule from './routes/Hospital/MySchedule';

import FrontDoctorArticle from './routes/Doctor/Article';
import FrontDoctorMySchedule from './routes/Doctor/MySchedule';
import Chat from './routes/Doctor/Chat';

import AdminArticle from './routes/Article';
import AdminPendingArticle from './routes/PendingArticle';

import FrontDoctorFeedback from './routes/Doctor/Feedback';
import FrontHospitalFeedback from './routes/Hospital/Feedback';

import AdminMapTag from './routes/MapTag';
import AdminFeedback from './routes/Feedback';

import FrontDoctorClinics from './routes/Doctor/DoctorClinic';
import DoctorNewClinicAdd from './routes/DoctorNewClinicAdd';

import OnlineConsult from './routes/Doctor/OnlineConsult';
import FreeQA from './routes/Doctor/FreeQA';
import AdminFreeQA from './routes/AdminFreeQA';
import ChatConsult from './routes/ChatConsult';
import DoctorClinicFeedback from './routes/DoctorClinic/Feedback';
import ResetPassword from './routes/ResetPassword';
import Appointment from './routes/Appointment';
import JobPost from './routes/Hospital/JobPost';
import Application from './routes/Hospital/Application';
import ClinicJobPost from './routes/DoctorClinic/JobPost';
import ClinicApplication from './routes/DoctorClinic/Application';
import AdminJobPost from './routes/AdminJobPost';
import ClinicSchedule from './routes/Doctor/ClinicSchedule';

import ChatPayment from './routes/ChatPayment';
import CommissionSetting from './routes/CommissionSetting';

import Front from './Front';
import TagForApproval from './routes/TagForApproval';
import AdminSubscription from './routes/AdminSubscription';
import SubscriptionExpired from './routes/SubscriptionExpired';
import SubscriptionPlan from './routes/SubscriptionPlan';
import FrontOnlineConsult from './routes/OnlineConsult';
import PrivacyPolicy from './routes/PrivacyPolicy';

const Panel = ({children}) => <MainContainer>{children}</MainContainer>;

const invalidURLs = ['/doh', '/doh/', '/admin', '/admin/', '/doctor', '/doctor/', '/hospital', '/hospital/'];

function redirectWithoutSession(nextState, replace) {
	return replace('/login');
}

function redirectSubscriptionExpired(nextState, replace) {
	return replace('/subscription-expired');
}

const nothing = () => undefined;

class Admin extends React.Component {
	render() {
		return (
			<MainContainer {...this.props}>
				<div id='body1' className="main-wrapper">
					<Adminloginheader />
					{this.props.children}
					<Adminloginfooter />
				</div>
			</MainContainer>
		);
	}
}

class AdminDashboard extends React.Component {
	render() {
		return (
			<MainContainer {...this.props}>
				<Sidebar />
				<Header />
				<div id='body'>
					<Grid>
						<Row>
							<Col xs={12}>
							{this.props.children}
							</Col>
						</Row>
					</Grid>
				</div>
				<Footer />
			</MainContainer>
		);
	}
}

class FrontDashboard extends React.Component {
	render() {
		return (
			<MainContainer {...this.props}>
				<FrontSidebar />
				<Header />
				<div id='body' className="front-dash-theme">
					<Grid>
						<Row>
							<Col xs={12}>
							{this.props.children}
							</Col>
						</Row>
					</Grid>
				</div>
				<Footer />
			</MainContainer>
		);
	}
}

const adminRoutes = session => {
	if (session.user_type !== 'admin') {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}
	return <Route component={AdminDashboard}>
        <Route path='account' component={Account}/>
        <Route path='dashboard' component={Dashboard}/>
        <Route path='section' component={Section}/>
        <Route path='role' component={Role}/>
        <Route path='tag' component={Tag}/>
        <Route path='country' component={Country}/>
        <Route path='state' component={State}/>
        <Route path='city' component={City}/>
        <Route path='hospital' component={Hospital}/>
        <Route path='doctors' component={Doctor}/>
        <Route path='patient' component={Patient}/>
        <Route path='articles' component={AdminArticle}/>
        <Route path='articles/pending' component={AdminPendingArticle}/>
        <Route path='map-tag' component={AdminMapTag}/>
        <Route path='feedback' component={AdminFeedback}/>
        <Route path='freeqa' component={AdminFreeQA}/>
        <Route path='chat-consult' component={ChatConsult}/>
        <Route path='appointment' component={Appointment}/>
        <Route path='job-post' component={AdminJobPost}/>
        <Route path='chatpayment' component={ChatPayment}/>
        <Route path='commission-setting' component={CommissionSetting}/>
        <Route path='tags-for-approval' component={TagForApproval}/>
        <Route path='subscription' component={AdminSubscription}/>
    </Route>
};

const doctorProfileRoutes = session => {
	if (session.user_type !== 'doctor') {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}
	return <Route component={FrontDashboard}>
		<Route path='account' component={Account}/>
		<Route path='profile' component={FrontDoctorProfile}/>
		<Route path='article' component={FrontDoctorArticle}/>
		<Route path='myschedule' component={FrontDoctorMySchedule}/>
		<Route path='feedback' component={FrontDoctorFeedback}/>
		<Route path='my-clinics' component={FrontDoctorClinics}/>
		<Route path='add-clinic' component={DoctorNewClinicAdd}/>
		<Route path='onlineconsult' component={OnlineConsult}/>
		<Route path='freeqa' component={FreeQA}/>
		<Route path='chat' component={Chat}/>
		<Route path='clinic-schedule' component={ClinicSchedule}/>
	</Route>
};

const hospitalProfileRoutes = session => {
	if (session.user_type !== 'hospital') {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}
	return <Route component={FrontDashboard}>
		<Route path='account' component={Account}/>
		<Route path='profile' component={FrontHospitalProfile}/>
		<Route path='myschedule' component={FrontHospitalMySchedule}/>
		<Route path='feedback' component={FrontHospitalFeedback}/>
		<Route path='job-post' component={JobPost}/>
		<Route path='application' component={Application}/>
	</Route>
};

const doctorHospitalProfileRoutes = session => {
	if (session.user_type !== 'doctor_clinic_both') {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}
	return <Route component={FrontDashboard}>
		<Route path='account' component={Account}/>
		<Route path='profile' component={FrontDoctorProfile}/>
		<Route path='article' component={FrontDoctorArticle}/>
		<Route path='feedback' component={DoctorClinicFeedback}/>
		<Route path='my-clinics' component={FrontDoctorClinics}/>
		<Route path='add-clinic' component={DoctorNewClinicAdd}/>
		<Route path='myschedule' component={FrontDoctorMySchedule}/>
		<Route path='clinic-schedule' component={ClinicSchedule}/>
		<Route path='onlineconsult' component={OnlineConsult}/>
		<Route path='job-post' component={ClinicJobPost}/>
		<Route path='application' component={ClinicApplication}/>
		<Route path='freeqa' component={FreeQA}/>
		<Route path='chat' component={Chat}/>
	</Route>
};

function getCombinedRoutes(store) {
	let state = store.getState();
	if (!state.session || !state.session.id) {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}

	if((state.session.user_type === 'doctor' || state.session.user_type === 'hospital' || state.session.user_type === 'doctor_clinic_both') && !state.session.subscription) {
		return <Route path='*' onEnter={redirectSubscriptionExpired}/>;
	}

	if(invalidURLs.indexOf(state.location.pathname) !== -1) {
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	}

	return ( 
		<Route>
			<Route path='/doctor'>
				{doctorProfileRoutes(state.session)}
			</Route>
			<Route path='/hospital'>
				{hospitalProfileRoutes(state.session)}
			</Route>
			<Route path='/doh'>
				{doctorHospitalProfileRoutes(state.session)}
			</Route>
			<Route path='/admin'>
				{adminRoutes(state.session)}
			</Route>
		</Route>
	)
}

function getBasicRoutes(store) {

	let state = store.getState();
	let loggedIn = state.session && state.session.id;
	function redirectOnLogin(nextState, replace) {
		if(loggedIn && "doctor" === state.session.user_type) {
			replace('/doctor/profile');	
		} else if(loggedIn && "doctor_clinic_both" === state.session.user_type) {
			replace('/doh/profile');
		} else if(loggedIn && "hospital" === state.session.user_type) {
			replace('/hospital/profile');	
		} else {
			replace('/admin/dashboard');
		}
	}
	return (
		<Route component={Front}>
			<Route path='/login' component={Signup} onEnter={loggedIn ? redirectOnLogin : nothing} />
			<Route path='/admin' component={Adminloginpage} onEnter={loggedIn ? redirectOnLogin : nothing}/>
			<Route path='/reset-password/:token' component={ResetPassword}/>
			<Route path='/careers' component={Careers}/>
			<Route path='/careers/detail/:id' component={CareerDetail}/>
			<Route path='/careers/apply/:id' component={CareerApply}/>
			<Route path='/about-us' component={AboutUs}/>
			<Route path='/features' component={Feature}/>
			<Route path='/subscription-expired' component={SubscriptionExpired}/>
			<Route path='/subscription-plans' component={SubscriptionPlan}/>
			<Route path='/article' component={FrontArticle}/>
			<Route path='/online-consult' component={FrontOnlineConsult}/>
			<Route path='/privacy-policy' component={PrivacyPolicy}/>
			<Route path='/' component={Home}/>
		</Route>
	);
}

const getRoutes = store => (location, cb) => {
	cb(null, [
		<Route path='503' component={DisplayError}/>,
		<Route path='500' component={DisplayError}/>,
		<Route path='401' component={DisplayError}/>,
		<Route path='404' component={DisplayError}/>,
		getBasicRoutes(store),
		getCombinedRoutes(store),
		<Route path='*' component={DisplayError}/>
	]);
};

export default function (store) {
	return (
		<Route getChildRoutes={getRoutes(store)}/>
	);
}
