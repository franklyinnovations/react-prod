import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import Front from './Front';
import MainContainer from './panel/MainContainer';
import DisplayError from './routes/DisplayError';

import {
	FrontPage,
	Login,
	ResetPassword,
	ContactUs,
	Partners,
	DealRegistration,
	PrivacyPolicy,
	Refund,
	TermsCondition,
	Faq,
	Features,
	
	DashboardNew,
	TeacherDashboard,
	StudentDashboard,

	Academicsession,
	Curriculum,
	Infrastructure,
	Bcsmap,
	Subject,
	Activity,
	
	Role,
	User,
	Teacher,
	TeacherImport,
	EmpLeaveType,
	EmpLeave,
	EmpAttendance,

	Timetable,

	Feehead,
	FeePenalty,
	FeeDiscount,
	Fee,
	FeeSubmission,
	FeeChallan,

	Student,
	Studentimport,
	StudentImageImport,
	StudentBulkEdit,
	StudentTransfer,
	StudentPromotion,

	TransportRoute,
	TransportEmp,
	Vehicle,
	MapRouteVehicle,
	StudentRoute,
	VehicleBreakdown,
	ParentVehicle,
	VehicleTracking,

	StudentLeave,
	ExamBulkAttendance,

	ExamHead,
	ExamSyllabus,
	Grade,
	ExamSchedule,
	Mark,
	ActivityMark,
	ExamPaper,
	Question,
	BulkUploadQuestion,
	PaperMapWithQuestion,
	MarksheetBuilder,

	Greensheet,
	TeacherPerformance,
	TeacherSchedule,
	AssignmentReport,
	EmpLeaveReport,
	StudentReport,
	ClassReport,
	Marksheet,
	TransferCertificate,

	Holiday,
	Tag,
	Events,
	Circulars,
	Complaints,

	LmsChapter,
	LmsStudyMaterial,

	Assignment,

	Institute,

	Country,
	State,
	City,
	Govtidentity,
	Language ,
	Contact,
	DemoRequest,
	Partner,
	DealRegister,
	EmailProvider,

	Profile,

	MyClasses,
	MyStudent,
	AttendanceHome,
	Attendance,

	SignUp,

	Feed,
	
	StudentClasses,
	StudentLeaveManager,
	StudentAssignment,
	StudentExam
} from './routes/index';

const Panel = ({children}) => <MainContainer>{children}</MainContainer>;

const redirectWithoutSession = (nextState, replace) => {
	return replace('/login');
};

function getPanelRoutes(store) {
	let state = store.getState();
	if (!state.session || !state.session.id)
		return <Route path='*' onEnter={redirectWithoutSession}/>;
	let requireSession = (
		state.session &&
		state.session.userdetails &&
		state.session.userdetails.academicSessions.length === 0
	);
	if (requireSession)
		return (
			<Route>
				<Route path='setup' component={Panel}>
					<Route path='academicsession' component={Academicsession}/>
				</Route>
				<Redirect from='*' to='/setup/academicsession'/>
			</Route>
		);
	return (
		<Route component={Panel}>
			<Route path='setup'>
				<Route path='academicsession' component={Academicsession}/>
				<Route path='curriculum' component={Curriculum}/>
				<Route path='infrastructure' component={Infrastructure}/>
				<Route path='bcsmap' component={Bcsmap}/>
				<Route path='subject' component={Subject}/>
				<Route path='activity' component={Activity}/>
			</Route>
			{
				state.session.user_type === 'teacher' &&
				<Redirect from='dashboard' to='/dashboard/teacher'/>
			}
			{
				state.session.user_type === 'student' &&
				<Redirect from='dashboard' to='/dashboard/student'/>
			}
			<Route path='dashboard'>
				<Route path='teacher' component={TeacherDashboard}/>
				<Route path='student' component={StudentDashboard}/>
				<IndexRoute component={DashboardNew}/>
			</Route>
			<Route path='hrm'>
				<Route path='role' component={Role}/>
				<Route path='user' component={User}/>
				<Route path='teacher' component={Teacher}/>
				<Route path='teacher-import' component={TeacherImport}/>
				<Route path='empleavetype' component={EmpLeaveType}/>
				<Route path='empleave' component={EmpLeave}/>
				<Route path='empattendance' component={EmpAttendance}/>
			</Route>
			<Route path='timetable'>
				<Route path='setup' component={Timetable}/>
			</Route>
			<Route path='finances'>
				<Route path='fee-head' component={Feehead}/>
				<Route path='fee-discount' component={FeeDiscount}/>
				<Route path='fee-penalty' component={FeePenalty}/>
				<Route path='fee' component={Fee}/>
				<Route path='fee-submission' component={FeeSubmission}/>
				<Route path='fee-challan' component={FeeChallan}/>
			</Route>
			<Route path='student'>
				<Route path='admission' component={Student}/>
				<Route path='studentimport' component={Studentimport}/>
				<Route path='student-image-import' component={StudentImageImport}/>
				<Route path='studentbulkedit' component={StudentBulkEdit}/>
				<Route path='student-transfer' component={StudentTransfer}/>
				<Route path='student-promotion' component={StudentPromotion}/>
				<Route path='student-leave' component={StudentLeave}/>
			</Route>
			<Route path='transport'>
				<Route path='transportroute' component={TransportRoute}/>
				<Route path='transportemp' component={TransportEmp}/>
				<Route path='vehicle'>
					<Route path=':vehicleId/route' component={MapRouteVehicle}/>
					<IndexRoute component={Vehicle}/>
				</Route>
				<Route path='student-route' component={StudentRoute}/>
				<Route path='breakdown' component={VehicleBreakdown}/>
				<Route path='parent-vehicle' component={ParentVehicle}/>
				<Route path='tracking' component={VehicleTracking}/>
			</Route>
			<Route path='student-attendance'>
				<Route path='attendance/:token' component={Attendance}/>
				<Route path='attendance' component={AttendanceHome}/>
				<Route path='bulk-attendance' component={ExamBulkAttendance}/>
			</Route>
			<Route path='exam'>
				<Route path='head' component={ExamHead}/>
				<Route path='syllabus' component={ExamSyllabus}/>
				<Route path='grade' component={Grade}/>
				<Route path='schedule' component={ExamSchedule}/>
				<Route path='mark' component={Mark}/>
				<Route path='activity-mark' component={ActivityMark}/>
				<Route path='paper' component={ExamPaper}/>
				<Route path='questions' component={Question}/>
				<Route path='upload-bulk-questions' component={BulkUploadQuestion}/>
				<Route path='map-paper-with-questions' component={PaperMapWithQuestion}/>
				<Route path='marksheet-builder' component={MarksheetBuilder}/>
			</Route>
			<Route path='reports'>
				<Route path='greensheet' component={Greensheet}/>
				<Route path='teacher-performance' component={TeacherPerformance}/>
				<Route path='teacher-schedule' component={TeacherSchedule}/>
				<Route path='assignment' component={AssignmentReport}/>
				<Route path='emp-leave' component={EmpLeaveReport}/>
				<Route path='student' component={StudentReport}/>
				<Route path='class' component={ClassReport}/>
				<Route path='marksheet' component={Marksheet}/>
				<Route path='transfer-certificate' component={TransferCertificate}/>
			</Route>
			<Route path='general'>
				<Route path='holiday' component={Holiday}/>
				<Route path='tag' component={Tag}/>
				<Route path='event' component={Events}/>
				<Route path='circular' component={Circulars}/>
				<Route path='complaints' component={Complaints}/>
			</Route>
			<Route path='lms'>
				<Route path='chapter' component={LmsChapter}/>
				<Route path='study-material' component={LmsStudyMaterial}/>
			</Route>
			<Route path='assignment'>
				<Route path='setup' component={Assignment}/>
			</Route>
			<Route path='institute'>
				<Route path='setup' component={Institute}/>
			</Route>
			<Route path='settings'>
				<Route path='country' component={Country}/>
				<Route path='state' component={State}/>
				<Route path='city' component={City}/>
				<Route path='govtidentity' component={Govtidentity}/>
				<Route path='language' component={Language}/>
				<Route path='contact' component={Contact}/>
				<Route path='demorequest' component={DemoRequest}/>
				<Route path='partner' component={Partner}/>
				<Route path='dealregister' component={DealRegister}/>
				<Route path='emailprovider' component={EmailProvider}/>
			</Route>
			<Route path='profile' component={Profile}/>
			<Route path='my-student' component={MyStudent}/>
			<Route path='classes' component={MyClasses}/>
			<Route path='feed' component={Feed}/>
			<Route path='student-classes' component={StudentClasses}/>
			<Route path='student-leave' component={StudentLeaveManager}/>
			<Route path='student-assignment' component={StudentAssignment}/>
			<Route path='student-exam'>
				<Route path='schedule' component={StudentExam}/>
			</Route>
		</Route>
	);
}

const redirectOnLogin = (nextState, replace) => {
	replace('/dashboard');
};

const nothing = () => undefined;

function getFrontRoutes(store) {
	let state = store.getState();
	let loggedIn = state.session && state.session.id;
	return (
		<Route component={Front}>
			<Route path='login' component={Login} onEnter={loggedIn ? redirectOnLogin : nothing}/>
			<Route
				path='forgot-password/:token'
				component={ResetPassword}
				onEnter={loggedIn ? redirectOnLogin : nothing}/>
			<Route path='contact-us' component={ContactUs}/>
			<Route path='partners' component={Partners}/>

			<Route path='privacy-policy' component={PrivacyPolicy}/>
			<Route path='terms-condition' component={TermsCondition}/>
			<Route path='refund-policy' component={Refund}/>
			<Route path='faq' component={Faq}/>
			<Route path='features' component={Features}/>

			<Route path='dealregistration' component={DealRegistration}/>
			
			<Route path='sign-up' component={SignUp}/>

			<Route path='/' component={FrontPage}/>
		</Route>
	);
}

const getRoutes = store => (location, cb) => {
	/* eslint react/jsx-key: off*/
	cb(null, [
		<Route path='503' component={DisplayError}/>,
		<Route path='500' component={DisplayError}/>,
		<Route path='401' component={DisplayError}/>,
		<Route path='404' component={DisplayError}/>,
		getFrontRoutes(store),
		getPanelRoutes(store),
		<Route path='*' component={DisplayError}/>
	]);
};

export default function Routes (store) {
	return <Route getChildRoutes={getRoutes(store)}/>;
}