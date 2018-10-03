import moment from 'moment';
import api, {makeApiData} from '../../api';
import {days, bcsName, getCookie} from '../../utils';

const view = 'myclasses';

export function init(state) {
	return async dispatch => {
		let date = getCookie('pacd', state.cookies);
		date = date ? moment(date, 'YYYY-MM-DD') : moment();
		if (date.isBefore(state.session.selectedSession.start_date)) {
			date = moment(state.session.selectedSession.start_date);
		} else if (date.isAfter(state.session.selectedSession.end_date)) {
			date = moment(state.session.selectedSession.end_date);
		}
		let weekday = date.format('dddd');
		date = date.format(state.session.userdetails.date_format);
		dispatch({
			type: 'INIT_MODULE_SYNC',
			view,
			date,
			weekday,
		});
		return dispatch(loadClasses(state));
	};
}

export function loadClasses (state) {
	return async dispatch => {
		dispatch({type: 'LOADING_ATT_BCSMAPS'});
		let date = getCookie('pacd', state.cookies);
		date = date ? moment(date, 'YYYY-MM-DD') : moment();
		if (date.isBefore(state.session.selectedSession.start_date)) {
			date = moment(state.session.selectedSession.start_date);
		} else if (date.isAfter(state.session.selectedSession.end_date)) {
			date = moment(state.session.selectedSession.end_date);
		}
		let	weekday = date.format('dddd');
		date = date.format('YYYY-MM-DD');

		let {data: {data}} = await api({
			hideMessage: true,
			cookies: state.cookies,
			url: '/admin/attendance/list',
			data: makeApiData(state, {
				date,
				weekday,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		data.forEach(item => {
			item.timetableallocations.forEach(tta => {
				tta.time = moment(tta.start_time, 'HH:mm:ss').format('h:mm A') + 
				' - '+ moment(tta.end_time, 'HH:mm:ss').format('h:mm A');
				tta.token = item.bcsMapId + ',' + tta.period + ',' + tta.subjectId;
			});
		});

		dispatch({
			type: 'LOAD_ATT_BCSMAPS',
			data: data,
		});
	};
}

export function loadWeekly(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_ATT_WEEKLY'});
		let {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/classes/teacherClassWeekly',
			data: makeApiData(state, {
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		let weekdays = {};
		for (let i = 0; i < data.length; i++) {
			let item = data[i],
				weekday = weekdays[item.weekday] || (weekdays[item.weekday] = []);
			item.time = moment(item.start_time, 'HH:mm:ss').format('h:mm A') + 
				' - '+ moment(item.end_time, 'HH:mm:ss').format('h:mm A');
			weekday.push(item);
		}
		data = [];
		for (let i = 0; i < days.length; i++) {
			if (weekdays[days[i]])
				data.push({
					day: days[i],
					classes: weekdays[days[i]],
				});
		}
		dispatch({type: 'LOAD_ATT_WEEKLY', data});
	};
}

export function classReport(state, timetable, timetableallocation) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ATT_CR',
			timetable,
			timetableallocation,
			nameOfClass: bcsName(timetable.bcsmap),
		});
		let {data: {report}} = await api({
			hideMessage: true,
			url: '/admin/classreport/viewData',
			data: makeApiData(state, {
				userId: state.session.id,
				bcsMapId: timetable.bcsMapId,
				order: timetableallocation.order,
				subjectId: timetableallocation.subjectId,
				academicSessionId: state.session.selectedSession.id,
				date: moment(
					state.meta.date, state.session.userdetails.date_format
				).format('YYYY-MM-DD'),
			}),
		});
		dispatch({type: 'SET_ATT_CR_CONTENT', report});
	};
}

export function saveClassReport(state, report) {
	return async dispatch => {
		dispatch({type: 'SAVING_ATT_CR'});
		await api({
			url: '/admin/classreport/save',
			data: makeApiData(
				state, {
					content: report,
					userId: state.session.id,
					bcsMapId: state.classReport.timetable.bcsMapId,
					time: state.classReport.timetableallocation.time,
					order: state.classReport.timetableallocation.order,
					academicSessionId: state.session.selectedSession.id,
					subjectId: state.classReport.timetableallocation.subjectId,
					date: moment(
						state.meta.date, state.session.userdetails.date_format
					).format('YYYY-MM-DD'),
				}
			),
		});
		dispatch({type: 'SAVED_ATT_CR'});
	};
}