import moment from 'moment';
import api, {makeApiData} from '../../api';

const view = 'assignmentreport';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data: {rows: teachers}} = await api({
			url: '/admin/dashboard/teacherbyinstitute',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		if (state.session.user_type === 'teacher') {
			let teacher = state.session.userdetails.userId;
			teachers = teachers.filter(({id}) => id === teacher);
		}
		dispatch({
			type: 'INIT_MODULE',
			view,
			teachers: teachers.map(teacher => ({
				value: teacher.id,
				label: teacher.user.userdetails[0].fullname,
			})),
		});
	};
}

export function load(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_AR',
		});
		let date_format = state.session.userdetails.date_format;
		let {data} = await api({
			url: '/admin/reports/assignment',
			data: makeApiData(state, {
				teachers: state.selector.teachers,
				end: moment(state.selector.end, date_format),
				start: moment(state.selector.start, date_format),
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		let statusValues = ['Canceled', 'Completed', 'Draft', 'Published'];
		data.teachers.forEach(teacher => {
			let cursor = 0;
			for (let i = 0; i < 4; i++) {
				let assignment = teacher.user.assignments[cursor];
				if (assignment && assignment.assignment_status === statusValues[i]) {
					teacher[statusValues[i]] = assignment.count;
					cursor++;
				} else {
					teacher[statusValues[i]] = 0;
				}
			}
		});
		dispatch({
			type: 'LOAD_AR',
			teachers: data.teachers,
		});
	};
}