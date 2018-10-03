import moment from 'moment';
import api, {makeApiData} from '../../api';
import {bcsName} from '../../utils';

const view = 'attendancehome';

export function init(state) {

	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data:{data}} = await api({
			url: '/admin/attendance',
			cookies: state.cookies,
			data: makeApiData(state)
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
		});
	};
}

export function loadDayWise (state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ATT_BCSMAPS'
		});
		let date = moment(state.meta.date, 'DD-MM-YYYY');
		if (date.isBefore(state.session.selectedSession.start_date)) {
			date = moment(state.session.selectedSession.start_date);
		} else if (date.isAfter(state.session.selectedSession.end_date)) {
			date = moment(state.session.selectedSession.end_date);
		}
		let	weekday = date.format('dddd');
		date = date.format('YYYY-MM-DD');

		let {data: {data}} = await api({
			url: '/admin/attendance/getFullDayData',
			data: makeApiData(state, {
				date,
				weekday,
				bcsMapId: state.meta.bcsMapId,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		let attendance = [];

		data.forEach((item) => {
			if(item.timetable && item.timetable.timetableallocations.length > 0) {
				item.timetable.timetableallocations.forEach((item2, index2) => {
					let ar = {
						id: '',
						studentId: item.student.id,
						subjectId: item2.subjectId,
						is_present: 1,
						tags: '',
						subject: item2.subject.subjectdetails[0].name,
						student: item.student.user.userdetails[0].fullname
					};
					if(item2.attendance && item2.attendance.attendancerecords.length > 0) {
						ar.id = item2.attendance.attendancerecords[0].id;
						ar.attendanceId = item2.attendance.attendancerecords[0].id;
						ar.is_present = item2.attendance.attendancerecords[0].is_present;
						ar.tags = item2.attendance.attendancerecords[0].tags;
					}
					if(index2 in attendance){
						attendance[index2].attendancerecords.push(ar);
					} else {
						let a = {
							id: '',
							userId: state.session.userdetails.userId,
							masterId: item.masterId,
							academicSessionId: item.academicSessionId,
							bcsMapId: item.bcsMapId,
							subjectId: item2.subjectId,
							period: item2.period,
							date: date,
							attendancerecords: [ar]
						};
						if(item2.attendance) {
							a.userId = item2.attendance.userId;
							a.id = item2.attendance.id;
						}
						attendance.push(a);
					}
				});
			}
		});

		dispatch({
			type: 'LOAD_ATT_FULL_DAY',
			data: attendance,
		});
	};
}

export function loadBcsmaps (state, date) {
	return async dispatch => {

		dispatch({
			type: 'LOADING_ATT_BCSMAPS',
		});

		let	weekday = moment(date, 'DD/MM/YYYY').format('dddd');
		date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

		let {data: {data}} = await api({
			url: '/admin/attendance/bcsmaps',
			data: makeApiData(state, {
				date,
				weekday,
				type: state.meta.select_type,
				id: state.session.id,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		let bcsmaps = data.map(item => ({
			value: item.bcsMapId,
			label: bcsName(item.bcsmap)
		}));

		return dispatch({
			type: 'LOAD_ATT_BCSMAPS',
			bcsmaps
		});
	};
}

export function loadSlot (state, bcsMapId) {
	return async dispatch => {

		dispatch({
			type: 'LOADING_ATT_SLOTS',
		});

		let	weekday = moment(state.meta.date, 'DD/MM/YYYY').format('dddd');
		let date = moment(state.meta.date, 'DD/MM/YYYY').format('YYYY-MM-DD');

		let {data: {data}} = await api({
			url: '/admin/attendance/slot',
			data: makeApiData(state, {
				date,
				weekday,
				bcsMapId,
				id: state.session.id,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		let slot = data.map(item => ({
			value: item.subjectId,
			label: item.subject.subjectdetails[0].name + ' ('+window.__('Period')+' '+item.period+')',
			token: bcsMapId+','+item.period+','+item.subjectId
		}));

		return dispatch({
			type: 'LOAD_ATT_SLOTS',
			slot
		});
	};
}

export function saveAttendance (state) {
	return async dispatch => {

		dispatch({
			type: 'REQ_SAVE_DAY_ATTENDANCE',
		});

		let {data} = await api({
			url: '/admin/attendance/save-attendance',
			data: makeApiData(state, {
				attendance: state.day_wise,
				date: moment(state.meta.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
			})
		});

		if(data.status) {
			state.router.push('/student-attendance/attendance');
		} else {
			dispatch({
				type: 'RES_SAVE_DAY_ATTENDANCE',
				data
			});
		}

	};
}
