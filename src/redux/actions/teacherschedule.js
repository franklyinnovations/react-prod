import api, {makeApiData} from '../../api';
import {days} from '../../utils';
import makeTranslater from '../../translate';
import moment from 'moment';

const view = 'teacherschedule';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data: subjects} = await api({
			url: '/admin/subject/list',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		let __ = makeTranslater(state.translations, state.lang.code);
		dispatch({
			type: 'INIT_MODULE',
			view,
			subjects: subjects.map(subject => ({
				value: subject.id,
				label: subject.subjectdetails[0].name,
			})),
			days: days.map(day => ({
				label: __(day),
				value: day,
			})),
		});
	};
}

export function load(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_TS',
		});
		let {data} = await api({
			url: '/admin/reports/teacher-schedule',
			data: makeApiData(state, {
				...state.selector,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		data.teachers.forEach(teacher => {
			teacher.timetableallocations.forEach(tta => {
				tta.start_time = moment(tta.start_time, 'HH:mm:ss').format('hh:mm a');
				tta.end_time = moment(tta.end_time, 'HH:mm:ss').format('hh:mm a');
			});
		});
		dispatch({
			type: 'LOAD_TS',
			teachers: data.teachers,
		});
	};
}