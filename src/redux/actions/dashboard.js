import api, {makeApiData} from '../../api';
import {bcsName} from '../../utils';
import {addView} from '../reducers/views';
import reducer from '../reducers/dashboard';

const view = 'dashboard';
addView(view, reducer);

export function init(state) {
	return async dispatch => {
		addView(view, reducer);
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [{data}, {data: {bcsmaps: {data: bcsmaps}}}, {data: {subjects}}] = await Promise.all([
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
			api({
				url: '/admin/utils/subjects',
				cookies: state.cookies,
				data: makeApiData(state, {
					user_type: state.session.user_type,
					userTypeId: state.session.userdetails.id,
				}),
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			subjects: subjects.map(subject => ({
				value: subject.id,
				label: subject.subjectdetails[0].name,
			})),
			stopLoading: true,
		});
	};
}

export function loadGraphs(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/reports/dashboard',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'SET_DASHBOARD_GRAPH_DATA',
			assignments: makeAssignmentGraphData(data.assignments),
			attendances: makeAttendanceGraphData(data.attendance),
			marks: makeMarksGraphData(data.marks),
		});
	};
}

export function updateAssignments(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATING_DASHBOARD_ASSIGNMENTS',
			name,
			value,
		});
		let {data} = await api({
			url: '/admin/reports/dashboard-assignments',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				subjectId: name === 'subjectIdAssignments' ? value :
					state.helperData.subjectIdAssignments,
				bcsMapId: name === 'bcsMapIdAssignments' ? value :
					state.helperData.bcsMapIdAssignments,
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_ASSIGNMENT_DATA',
			assignments: makeAssignmentGraphData(data.assignments),
		});
	};
}

export function updateAttendance(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATING_DASHBOARD_ATTENDANCES',
			name,
			value,
		});
		let {data} = await api({
			url: '/admin/reports/dashboard-attendance',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				subjectId: name === 'subjectIdAttendance' ? value :
					state.helperData.subjectIdAttendance,
				bcsMapId: name === 'bcsMapIdAttendance' ? value :
					state.helperData.bcsMapIdAttendance,
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_ATTENDANCE',
			attendances: makeAttendanceGraphData(data.attendances),
		});
	};
}

export function updateMarks(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATING_DASHBOARD_MARKS',
			name,
			value,
		});
		let {data} = await api({
			url: '/admin/reports/dashboard-marks',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.id,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
				subjectId: name === 'subjectIdMarks' ? value :
					state.helperData.subjectIdMarks,
				bcsMapId: name === 'bcsMapIdMarks' ? value :
					state.helperData.bcsMapIdMarks,
			}),
		});

		dispatch({
			type: 'SET_DASHBOARD_MARKS',
			marks: makeMarksGraphData(data.marks),
		});
	};
}

function makeAssignmentGraphData(data) {
	let json = {
			Canceled: 0,
			Completed: 0,
			Draft: 0,
			Published: 0,
		},
		total = 0;
	
	for (let i = data.length - 1; i >= 0; i--) {
		json[data[i].assignment_status] = data[i].count;
		total += data[i].count;
	}
	return {
		json: total === 0 ? {} : json,
		type: 'pie',
		empty: {
			label: {
				text: window.__('No Record Found'),
			},
		},
		colors: {
			Canceled: '#d9534f',
			Completed: '#f0ad4e',
			Draft: '#428bca',
			Published: '#82be5a',
		},
		names: {
			Canceled: window.__('Cancelled'),
			Completed: window.__('Completed'),
			Draft: window.__('Draft'),
			Published: window.__('Published'),
		}
	};
}

function makeAttendanceGraphData(data) {
	return {
		json: data,
		keys: {
			x: 'id',
			value: ['present', 'late'],
		},
		names: {
			'present': window.__('Present'),
			'late': window.__('Late'),
		},
		groups: [
			['present', 'late'],
		],
		type: 'bar',
		empty: {
			label: {
				text: window.__('No Record Found'),
			},
		},
		colors: {
			'present': '#007F22',
			'late': '#f0ad4e',
		},
	};
}

function makeMarksGraphData(data) {
	return {
		json: data,
		keys: {
			x: 'id',
			value: ['percentage'],
		},
		names: {
			'percentage': window.__('Percentage'),
		},
		empty: {
			label: {
				text: window.__('No Record Found'),
			},
		},
	};
}