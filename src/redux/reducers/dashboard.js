import {combineReducers} from 'redux';

const defaultInfoData = {
	teachers: 0,
	students: 0,
	classes: 0,
	vehicles: 0,
	absentTeachers: 0,
};

function info(state = defaultInfoData, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				teachers: action.data.teachers,
				students: action.data.students,
				classes: action.data.classes,
				vehicles: action.data.vehicles,
				absentTeachers: action.data.absentTeachers,
				presentStudents: action.data.presentStudents,
				tickets: action.data.tickets,
				due_fee: action.data.due_fee,
				pay_fee: action.data.pay_fee,
			};
		default:
			return state;
	}
}

function graphs(state = {assignments: null, attendances: null, marks: null}, action) {
	switch (action.type) {
		case 'SET_DASHBOARD_GRAPH_DATA':
			return {
				marks: action.marks,
				assignments: action.assignments,
				attendances: action.attendances,
			};
		case 'UPDATING_DASHBOARD_ASSIGNMENTS':
			return {
				...state,
				assignments: null,
			};
		case 'UPDATING_DASHBOARD_MARKS':
			return {
				...state,
				marks: null,
			};
		case 'UPDATING_DASHBOARD_ATTENDANCES':
			return {
				...state,
				attendances: null,
			};

		case 'SET_DASHBOARD_ASSIGNMENT_DATA':
			return {
				...state,
				assignments: action.assignments,
			};
		case 'SET_DASHBOARD_ATTENDANCE':
			return {
				...state,
				attendances: action.attendances,
			};
		case 'SET_DASHBOARD_MARKS':
			return {
				...state,
				marks: action.marks,
			};
		default:
			return state;
	}
}

function helperData(state = {
	subjectIdAssignments: null,
	bcsMapIdAssignments: null,
	bcsMapIdAttendance: null,
	subjectIdAttendance: null,
	bcsMapIdMarks: null,
	subjectIdMarks: null,
}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				subjectIdAssignments: null,
				bcsMapIdAssignments: null,
				bcsMapIdAttendance: null,
				subjectIdAttendance: null,
				bcsMapIdMarks: null,
				subjectIdMarks: null,
				bcsmaps: action.bcsmaps,
				subjects: action.subjects,
			};
		case 'UPDATING_DASHBOARD_ATTENDANCES':
		case 'UPDATING_DASHBOARD_MARKS':
		case 'UPDATING_DASHBOARD_ASSIGNMENTS':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	info,
	graphs,
	helperData,
});

export default reducer;