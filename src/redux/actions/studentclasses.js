import moment from 'moment';
import api, {makeApiData} from '../../api';
import {days, getCookie} from '../../utils';

const view = 'studentclasses';

export function init(state) {
	return async dispatch => {
		let date = getCookie('pacdd', state.cookies);
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
		let date = getCookie('pacdd', state.cookies);
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
			url: '/admin/classes/studentClasses',
			data: makeApiData(state, {
				date,
				weekday,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: state.session.userdetails.bcsMapId,
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
		let date = getCookie('pacdd', state.cookies);
		date = date ? moment(date, 'YYYY-MM-DD') : moment();
		if (date.isBefore(state.session.selectedSession.start_date)) {
			date = moment(state.session.selectedSession.start_date);
		} else if (date.isAfter(state.session.selectedSession.end_date)) {
			date = moment(state.session.selectedSession.end_date);
		}
		let weekday = date.format('dddd');
		date = date.format(state.session.userdetails.date_format);
		dispatch({type: 'LOADING_ATT_WEEKLY'});
		let {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/classes/studentClassWeekly',
			data: makeApiData(state, {
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: state.session.userdetails.bcsMapId,
			}),
		});
		let weekdays = {};
		for (let i = 0; i < data.timetableallocations.length; i++) {
			let item = data.timetableallocations[i],
				weekday = weekdays[item.weekday] || (weekdays[item.weekday] = []);
			item.time = getTime(item.start_time) +' - '+ getTime(item.end_time);
			weekday.push(item);
		}
		let studentdata = [];
		for (let i = 0; i < days.length; i++) {
			if (weekdays[days[i]])
				studentdata.push({
					day: days[i],
					classes: weekdays[days[i]],
				});
		}
		dispatch({
			type: 'LOAD_ATT_WEEKLY', 
			data: studentdata, 
			classteacher: data.teacher, 
			studentclass: data.bcsmap, 
			timetableId: data.id,
			date,
			weekday,
		});
	};
}

function getTime(time) {
	return time ? moment(time, 'HH:mm:ss').format('h:mm A'): 'N/A';
}