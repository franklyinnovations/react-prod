import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, bcsName, dialog} from '../../utils';
export {update, updateFilter} from './index';
import moment from 'moment';

const view = 'dashboardnew';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [{data}, {data: {bcsmaps: {data: bcsmaps}}}] = await Promise.all([
			api({
				url: '/admin/dashboard/dashboard',
				cookies: state.cookies,
				data: makeApiData(state, {
					user_type: state.session.user_type,
					userId: state.session.userdetails.userId,
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
			api({
				url: '/admin/assignment/bcsmaps',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.userdetails.userId,
					user_type: state.session.user_type,
				}),
			}),
		]);
		let today = moment().format(state.session.userdetails.date_format);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			dateAssignments: today,
			dateTeacherDiary: today,
			dateAttendance: today,
			dateFee: today,
			dateAttendanceClassWise: today,
			dateTodaysProxy: today,
			dateTeacherSchedule: today,
			stopLoading: true,
		});
	};
}

export function loadGraphs(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/reports/dashboard-new',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				date: moment(state.helperData.dateAssignments, state.session.userdetails.date_format).format('YYYY-MM-DD'),
				day: moment(state.helperData.dateAssignments, state.session.userdetails.date_format).format('dddd'),
			}),
		});
		dispatch({
			type: 'SET_DASHBOARD_DATA',
			assignments: makeAssignmentData(data.assignmentdata, data.assignmentdatabcsmap, data.pendingassignmentsubjects),
			classreports: makeTeacherDiaryData(data.classreportsdata, data.classreportsdatabcsmap),
			attendances: makeAttendanceGraphData(data.attendances),
			fees: makeFeeGraphData(data.fees),
			classwiseattendances: makeClassWiseAttendanceData(data.attendances),
			showAttendance : data.attendances.length > 0 ? true : false,
			absentteachersrecord: makeTodaysAbsentTeacherData(data.absentteachersrecord, data.totalpresentteacher),
			upcomingempleaves: data.upcomingempleaves,
			teachersdailyschedule: makeTeachersDailySchedule(data.teachers, data.teacherSchedules),
		});
	};
}

function makeAssignmentData(assignmentdata, assignmentdatabcsmap, pendingassignmentsubjects){
	let allPublished = assignmentdata.find(item => item.assignment_status == 'Published'),
		allCompleted = assignmentdata.find(item => item.assignment_status == 'Completed'),
		published = assignmentdatabcsmap.find(item => item.assignment_status == 'Published'),
		completed = assignmentdatabcsmap.find(item => item.assignment_status == 'Completed'),
		pendingsubjects = pendingassignmentsubjects ? pendingassignmentsubjects: [];

	allPublished = allPublished ? allPublished.count : 0;
	allCompleted = allCompleted ? allCompleted.count : 0;
	published = published ? published.count : 0;
	completed = completed ? completed.count : 0;

	return {
		total: allPublished,
		reviewed: allCompleted,
		totalbybcsmapid: published,
		reviewedbybcsmapid: completed,
		pendingsubjectsbybcsmap: pendingsubjects,
	};
}

function makeTeacherDiaryData(classreportsdata, classreportsdatabcsmap){
	let allfilled = classreportsdata.filled,
		allpending = classreportsdata.pending,
		filled = classreportsdatabcsmap ? classreportsdatabcsmap.filled : 0,
		pending = classreportsdatabcsmap ? classreportsdatabcsmap.pending : 0,
		pendingteachers = classreportsdatabcsmap ? classreportsdatabcsmap.pendingTeachers: [];
	return {
		filled: allfilled,
		pending: allpending,
		filledbybcsmapid: filled,
		pendingbybcsmapid: pending,
		pendingteachersbybcsmap: pendingteachers,
	};
}

function makeClassWiseAttendanceData(data){
	let totalstrength = 0,
		present = 0,
		absent = 0,
		late = 0;

	data.forEach(item=>{
		item.bcsmaps.forEach(item1=>{
			present = present + item1.present;
			absent = absent + item1.absent;
			late = late + item1.late;
			totalstrength = totalstrength + item1.total;
		});
	});	

	return {
		totalstrength,
		present,
		absent,
		late,
		data,
	};
}

function makeTodaysAbsentTeacherData(data, totalpresentteacher){
	let total = 0,
		present = 0,
		absent = 0;

	present = totalpresentteacher;
	absent = data.length;
	total = present + absent;

	return {
		total,
		present,
		absent,
		data,
	};
}

function makeTeachersDailySchedule(teachers, teacherSchedules){
	let totalteacher = 0,
		totalschedule = 0;

	totalteacher = teachers.length;
	totalschedule = teacherSchedules.length;
	return {
		totalteacher,
		totalschedule,
		teachers,
		teacherSchedules
	};
}

export function updateAssignments(state, name, value) {
	return async dispatch => {
		if ((name === 'dateAssignments' && !value) || !state.helperData.dateAssignments) {
			return;
		}

		dispatch({
			type: 'UPDATING_DASHBOARD_ASSIGNMENTS',
			name,
			value,
		});

		let date = moment(
			name === 'dateAssignments' ? value :
				state.helperData.dateAssignments,
			state.session.userdetails.date_format
		);
		let {data} = await api({
			url: '/admin/reports/dashboard-assignments',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: name === 'bcsMapIdAssignments' ? value :
					state.helperData.bcsMapIdAssignments,
				day: date.format('dddd'),
				date: date.format('YYYY-MM-DD'),
			}),
		});
		dispatch({
			type: 'SET_DASHBOARD_ASSIGNMENT_DATA',
			assignments: makeAssignmentData(data.assignmentdata, data.assignmentdatabcsmap, data.pendingassignmentsubjects),
		});
	};
}

export function updateTeacherDiary(state, name, value) {
	return async dispatch => {
		if ((name === 'dateTeacherDiary' && !value) || !state.helperData.dateTeacherDiary) {
			return;
		}

		dispatch({
			type: 'UPDATING_DASHBOARD_TEACHER_DIARY',
			name,
			value,
		});
		let date = moment(
			name === 'dateTeacherDiary' ? value :
				state.helperData.dateTeacherDiary,
			state.session.userdetails.date_format
		);
		let {data} = await api({
			url: '/admin/reports/dashboard-classreports',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: name === 'bcsMapIdTeacherDiary' ? value :
					state.helperData.bcsMapIdTeacherDiary,
				day: date.format('dddd'),
				date: date.format('YYYY-MM-DD'),
			}),
		});
		dispatch({
			type: 'SET_DASHBOARD_TEACHER_DIARY_DATA',
			classreports: makeTeacherDiaryData(data.classreportsdata, data.classreportsdatabcsmap),
		});

	};
}

export function updateAttendance(state, name, value) {
	return async dispatch => {
		if ((name === 'dateAttendance' && !value) || !state.helperData.dateAttendance) {
			return;
		}
		
		dispatch({
			type: 'UPDATING_DASHBOARD_ATTENDANCES',
			name,
			value,
		});
		let date = moment(
			name === 'dateAttendance' ? value :
				state.helperData.dateAttendance,
			state.session.userdetails.date_format
		);
		let {data} = await api({
			url: '/admin/reports/dashboard-attendance',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				date: date.format('YYYY-MM-DD'),
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_ATTENDANCE',
			attendances: makeAttendanceGraphData(data.attendances),
			classwiseattendances: makeClassWiseAttendanceData(data.attendances),
			showAttendance : data.attendances.length > 0 ? true : false,
		});
	};
}

export function updateAttendanceClassWise(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATING_DASHBOARD_ATTENDANCES_CLASSWISE',
			name,
			value,
		});
		let date = moment(
			name === 'dateAttendanceClassWise' ? value :
				state.helperData.dateAttendanceClassWise,
			state.session.userdetails.date_format
		);
		let {data} = await api({
			url: '/admin/reports/dashboard-attendance',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				date: date.format('YYYY-MM-DD'),
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_ATTENDANCE_CLASSWISE',
			classwiseattendances: makeClassWiseAttendanceData(data.attendances),
			showAttendance : data.attendances.length > 0 ? true : false,
		});
	};
}

export function updateTeacherSchedule(state, name, value) {
	return async dispatch => {
		if ((name === 'dateTeacherSchedule' && !value) || !state.helperData.dateTeacherSchedule) {
			return;
		}

		dispatch({
			type: 'UPDATING_DASHBOARD_TEACHERSCHEDULE',
			name,
			value,
		});

		let date = moment(
			name === 'dateTeacherSchedule' ? value :
				state.helperData.dateTeacherSchedule,
			state.session.userdetails.date_format
		);
		let {data} = await api({
			url: '/admin/reports/dashboard-teacherschedule',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				day: date.format('dddd'),
				date: date.format('YYYY-MM-DD'),
			}),
		});
		dispatch({
			type: 'SET_DASHBOARD_TEACHERSCHEDULE_DATA',
			teachersdailyschedule: makeTeachersDailySchedule(data.teachers, data.teacherSchedules),
		});
	};
}

function makeAttendanceGraphData(data) {
	let jsonData = {
			'view': 'Student Status',
		},
		totalstrength = 0,
		present = 0,
		absent = 0,
		late = 0;

	data.forEach(item=>{
		item.bcsmaps.forEach(item1=>{
			present = present + item1.present;
			absent = absent + item1.absent;
			late = late + item1.late;
			totalstrength = totalstrength + item1.total;
		});
	});

	jsonData.total = totalstrength;
	jsonData.present = present;
	jsonData.absent = absent;
	jsonData.late = late;

	return {
		json: [jsonData],
		keys: {
			'x': 'view',
			'value': [
				'present','absent','late'
			]
		},
		names: {
			'present': window.__('Present'),
			'absent': window.__('Absent'),
			'late': window.__('Late'),
		},
		type: 'bar',
		empty: {
			/*label: {
				text: window.__('No Record Found'),
			},*/
		},
		colors: {
			'present': '#007F22',
			'absent': '#ff0000',
			'late': '#f0ad4e',
		},
	};
}

export function updateFee(state, name, value) {
	return async dispatch => {
		if ((name === 'dateFee' && !value) || !state.helperData.dateFee) {
			return;
		}
		
		dispatch({
			type: 'UPDATING_DASHBOARD_FEES',
			name,
			value,
		});
		let date = moment(
			name === 'dateFee' ? value :
				state.helperData.dateFee,
			state.session.userdetails.date_format
		);
		let {data: {data: fees}} = await api({
			url: '/admin/reports/dashboard-fee',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				date: date.format('YYYY-MM-DD'),
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_FEE',
			fees: makeFeeGraphData(fees),
		});
	};
}

function makeFeeGraphData(data) {
	return {
		columns: data.total === 0 ? [] : [
			['Paid', data.paid],
			['Due', data.total - data.paid],
		],
		type: 'pie',
		empty: {
			label: {
				text: window.__('No Record Found'),
			},
		},
		colors: {
			'Due': '#ff0000',
			'Paid': '#007F22',
		},
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function proxyClasses(state, id){
	return async dispatch=>{
		let proxycount = 0;
		dispatch({
			type: 'RESET_PROXY_OPTIONS',
		});
		let {data: {teacherclasses: data}} = await api({
			url: '/admin/reports/teacherClasses',
			data: makeApiData(state,{
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				id,
				academicSessionId: state.session.selectedSession.id,
				day: moment(state.helperData.dateTodaysProxy, state.session.userdetails.date_format).format('dddd'),
				date: moment(state.helperData.dateTodaysProxy, state.session.userdetails.date_format).format('YYYY-MM-DD'),
			})
		});

		data.timetableallocations.map(item=>{
			if(item.proxy_classes.length > 0){
				proxycount++;
			}
		});
		dispatch({
			type: 'SET_TODAY_PROXY_DATA',
			teacherclasses: data.timetableallocations.map(item=>({
				value:item.classtimetable,
				label:item.teachersubject+'-'+window.__('Period')+':'+item.period
			})),
			proxycount: proxycount,
			selectedteacherId: id,
			data
		});
	};
}

export function upcomingProxy(state, id){
	return async dispatch=>{
		dispatch({
			type: 'RESET_UPCOMINGPROXY_OPTIONS',
		});
		let {data: {upcomingproxy: data}} = await api({
			url: '/admin/reports/upcomingLeavesById',
			data: makeApiData(state,{
				id,
			})
		});

		dispatch({
			type: 'UPCOMING_PROXY',
			selectedteacherId: data.user.teacher.id,
			data
		});
	};
}

export function upcomingProxyClasses(state, name, value){
	if ((name === 'upcomingproxydate' && !value)) {
		return {type: 'NOTHING'};
	}
	return async dispatch => {
		dispatch({
			type: 'UPDATING_UPCOMING_PROXY',
			name,
			value,
		});
		let proxycount = 0;
		let date = moment(
			name === 'upcomingproxydate' ? value :
				state.helperData.dateTeacherDiary,
			state.session.userdetails.date_format
		);
		let {data: {teacherclasses: data}} = await api({
			url: '/admin/reports/teacherClasses',
			data: makeApiData(state,{
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				id: state.items.selectedteacherId,
				academicSessionId: state.session.selectedSession.id,
				day: date.format('dddd'),
				date: date.format('YYYY-MM-DD'),
			})
		});

		data.timetableallocations.map(item=>{
			if(item.proxy_classes.length > 0){
				proxycount++;
			}
		});
		dispatch({
			type: 'SET_UPCOMING_PROXY_DATA',
			teacherclasses: data.timetableallocations.map(item=>({
				value:item.classtimetable,
				label:item.teachersubject+'-'+window.__('Period')+':'+item.period
			})),
			proxycount: proxycount,
			proxydate: value,
			data
		});
	};
}

export function getProxyTeachers(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATING_PROXY_TEACHER_CLASS',
			name,
			value,
		});
		if (!value) {
			dispatch({type: 'SET_PROXY_TEACHERS', proxyteachers: []});
			return;
		}
		let timetableId = value.split('-');
		let {data:{data}} = await api({
			url: '/admin/proxyclasses/listTeachers',
			data: makeApiData(state, {
				id: timetableId[0],
			}),
		});
		dispatch({
			type: 'SET_PROXY_TEACHERS',
			proxyteachers:data.map(item => ({
				value: item.id,
				label:item.user.userdetails[0].fullname
			})),
		});

	};
}

export function saveProxy(state) {
	return async dispatch=>{
		let proxydata = state.helperData.teacherClass.split('-');
		let {data} = await api({
			url: '/admin/proxyclasses/save',
			data: makeApiData(state, {
				id: '',
				bcsmapId:proxydata[1],
				academicSessionId:state.session.selectedSession.id || '',
				teacherId:state.helperData.proxyTeacher || '',
				timetableallocationId:proxydata[0] || '',
				date:state.helperData.upcomingproxydate !== null ? moment(state.helperData.upcomingproxydate, state.session.userdetails.date_format).format('YYYY-MM-DD') :moment().format('YYYY-MM-DD'),
				userId: state.session.id
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_PROXY_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			if(state.items.todayproxy)
				dispatch(proxyClasses(state, state.items.selectedteacherId));
			else
				dispatch(upcomingProxyClasses(state, 'upcomingproxydate', state.helperData.upcomingproxydate));
		}
	};
}

export function deleteProxy(state, itemId) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/proxyclasses/remove/',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.id,
				id: itemId
			}),
		});

		if(data.status){
			if(state.items.todayproxy)
				dispatch(proxyClasses(state, state.items.selectedteacherId));
			else
				dispatch(upcomingProxyClasses(state, 'upcomingproxydate', state.helperData.upcomingproxydate));
		}
	};
}

export function leaveDetail(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_EL_VIEW',
			view
		});

		const {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/empleave/view/' + itemId,
			data: makeApiData(state, {
				userId: state.session.id,
				user_type: state.session.user_type,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'SET_EL_VIEW_DATA',
			data,
		});
	};
}

export function changeStatus(state, status) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_EL_STATUS',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/empleave/leavestatus/' + state.items.empleaveinfo.id + '/' + status
		});

		if (data.status) {
			dispatch({
				type: 'EL_STATUS_CHANGED',
				status,
				id: state.items.empleaveinfo.id,
			});
		} else {
			dispatch({
				type: 'EL_STATUS_CHANGE_FAILED',
				id: state.items.empleaveinfo.id,
			});
		}
	};
}

export function reject(state, error = '') {
	return dispatch => {
		dispatch(hideDataModal());
		dialog.prompt({
			message: window.__('Reason'),
			input: '<div class="has-error"><textarea rows="5" name="reason"></textarea><div class="help-block">' + error + '</div></div>',
			callback: async reject_reason => {
				if (reject_reason === false) return;
				if (reject_reason.trim().length === 0) {
					dispatch(reject(state, window.__('Reason is required.')));
					return;
				}

				const {data} = await api({
					data: makeApiData(state, {
						reject_reason,
						id: state.items.empleaveinfo.id,
						leavestatus: 3,
						date: new Date(),
						status_updatedby: state.session.id,
						status_updatedbytype: state.session.user_type,
					}),
					url: '/admin/empleave/reject'
				});

				if (data.status) {
					dispatch({
						type: 'EL_STATUS_CHANGED',
						status: 3,
						id: state.items.empleaveinfo.id,
					});
				} else {
					dispatch({
						type: 'EL_STATUS_CHANGE_FAILED',
						id: state.items.empleaveinfo.id,
					});
				}
			}
		});
	};
}

