import {combineReducers} from 'redux';

function errors (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'RESET_PROXY_OPTIONS':
		case 'RESET_UPCOMINGPROXY_OPTIONS':
		case 'UPDATING_UPCOMING_PROXY':
			return {};	
		case 'SET_PROXY_ERRORS':
		case 'TEACHER_CLASS':
			return action.errors;		
		default:
			return state;
	}
}

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

const defaultGraphData = {
	assignments: null, 
	classreports: null, 
	attendances: null, 
	classwiseattendances: null,
	showAttendance: false
};

function graphs(state = defaultGraphData, action) {
	switch (action.type) {
		case 'SET_DASHBOARD_DATA':
			return {
				fees: action.fees,
				assignments: action.assignments,
				classreports: action.classreports,
				attendances: action.attendances,
				classwiseattendances: action.classwiseattendances,
				showAttendance: action.showAttendance,
				absentteachersrecord: action.absentteachersrecord,
				upcomingempleaves: action.upcomingempleaves,
				teachersdailyschedule: action.teachersdailyschedule
			};
		case 'UPDATING_DASHBOARD_ASSIGNMENTS':
			return {
				...state,
				assignments: null,
			};
		case 'UPDATING_DASHBOARD_TEACHER_DIARY':
			return {
				...state,
				classreports: null,
			};	
		case 'UPDATING_DASHBOARD_ATTENDANCES':
			return {
				...state,
				attendances: null,
				classwiseattendances: null,
				//showAttendance: false,
			};
		case 'UPDATING_DASHBOARD_ATTENDANCES_CLASSWISE':
			return {
				...state,
				classwiseattendances: null,
			};
		case 'UPDATING_DASHBOARD_FEES':
			return {
				...state,
				fees: null,
			};	
		case 'UPDATING_DASHBOARD_TEACHERSCHEDULE':
			return {
				...state,
				teachersdailyschedule: null,
			};		
		case 'SET_DASHBOARD_ASSIGNMENT_DATA':
			return {
				...state,
				assignments: action.assignments,
			};
		case 'SET_DASHBOARD_TEACHER_DIARY_DATA':
			return {
				...state,
				classreports: action.classreports,
			};	
		case 'SET_DASHBOARD_ATTENDANCE':
			return {
				...state,
				attendances: action.attendances,
				classwiseattendances: action.classwiseattendances,
				showAttendance: action.showAttendance,
			};
		case 'SET_DASHBOARD_ATTENDANCE_CLASSWISE':
			return {
				...state,
				classwiseattendances: action.classwiseattendances,
				showAttendance: action.showAttendance,
			};	
		case 'SET_DASHBOARD_FEE':
			return {
				...state,
				fees: action.fees,
			};	
		case 'SET_DASHBOARD_TEACHERSCHEDULE_DATA':
			return {
				...state,
				teachersdailyschedule: action.teachersdailyschedule,
			};	
		case 'EL_STATUS_CHANGED': {
			let {upcomingempleaves} = state;
			let updatelist = upcomingempleaves.map(item => {
				if (item.id === action.id)
					item.leavestatus = parseInt(action.status);
				return item;
			});
			return {
				...state, 
				upcomingempleaves: updatelist
			};
		}
		default:
			return state;
	}
}

const defaultHelperData = {
	bcsMapIdAssignments: null,
	dateAssignments: null,
	bcsMapIdTeacherDiary: null,
	dateTeacherDiary: null,
	dateAttendance: null,
	dateFee: null,
	dateAttendanceClassWise: null,
	teacherdiarymodal: false,
	bcsmaps:[],
	dateTodaysProxy: null,
	teacherClass: null,
	proxyTeacher:null,
	upcomingproxydate: null,
	dateTeacherSchedule: null,
};

function helperData(state = defaultHelperData, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				bcsMapIdAssignments: null,
				dateAssignments: action.dateAssignments,
				bcsMapIdTeacherDiary: null,
				dateTeacherDiary: action.dateTeacherDiary,
				dateAttendance: action.dateAttendance, 
				dateFee: action.dateFee,
				dateAttendanceClassWise: action.dateAttendanceClassWise,
				bcsmaps: action.bcsmaps,
				dateTodaysProxy: action.dateTodaysProxy,
				teacherClass: null,
				upcomingproxydate: null,
				dateTeacherSchedule: action.dateTeacherSchedule,
			};
		case 'UPDATING_DASHBOARD_ATTENDANCES':
		case 'UPDATING_DASHBOARD_ATTENDANCES_CLASSWISE':
		case 'UPDATING_DASHBOARD_FEES':
		case 'UPDATING_DASHBOARD_ASSIGNMENTS':
		case 'UPDATING_DASHBOARD_TEACHER_DIARY':
		case 'UPDATING_PROXY_TEACHER_CLASS':
		case 'UPDATING_DASHBOARD_TEACHERSCHEDULE':
			return {
				...state,
				[action.name]: action.value,
				proxyTeacher: null,
			};
		case 'UPDATE_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'RESET_PROXY_OPTIONS':
		case 'RESET_UPCOMINGPROXY_OPTIONS':
			return {
				...state,
				proxyTeacher: null,
				teacherClass: null,
				upcomingproxydate: null
			};	
		case 'UPDATING_UPCOMING_PROXY':
			return {
				...state,
				[action.name]: action.value,
				proxyTeacher: null,
				teacherClass: null,
			};
		case 'SHOW_TEACHER_ASSIGNMENT_MODEL':
			return {
				...state,
				pendingassignmentmodal: true
			};	
		case 'SHOW_TEACHER_DIARY_MODEL':
			return {
				...state,
				teacherdiarymodal: true
			};
		case 'SHOW_CLASSWISE_ATTENDANCE_MODEL':
			return {
				...state,
				classwiseattendancemodal: true,
				dateAttendanceClassWise: action.dateAttendance,
			};		
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				pendingassignmentmodal: false,
				teacherdiarymodal: false,
				classwiseattendancemodal: false
			};
		default:
			return state;
	}
}

const defaultItems = {
	teacherclasses: [],
	teachername: '',
	proxyteachers:[],
	proxyclasses:null,
	proxydate: null,
	empleaveinfo: null
};
function items(state = defaultItems, action){
	switch (action.type) {
		case 'SET_TODAY_PROXY_DATA':
			return {
				...state,
				todayproxy: true,
				teacherclasses: action.teacherclasses,
				proxyclasses: action.data,
				selectedteacherId: action.selectedteacherId,
				proxycount: action.proxycount
			};
		case 'SET_PROXY_TEACHERS':
			return {
				...state,
				proxyteachers: action.proxyteachers,
			};	
		case 'RESET_PROXY_OPTIONS':
			return {
				...state,
				proxyteachers: [],
			};
		case 'RESET_UPCOMINGPROXY_OPTIONS':	
			return {
				...state,
				proxyteachers: [],
				proxyclasses: null,
				proxydate: null,
			};
		case 'UPDATING_UPCOMING_PROXY':
			return {
				...state,
				proxyteachers: [],
				proxyclasses: null,
				proxydate: null,
				proxycount: 'loading'
			};	
		case 'UPCOMING_PROXY':
			return {
				...state,
				upcomingproxy: true,
				selectedteacherId: action.selectedteacherId,
				upcomingproxydata: action.data,
			};	
		case 'SET_UPCOMING_PROXY_DATA':
			return {
				...state,
				teacherclasses: action.teacherclasses,
				proxyclasses: action.data,
				proxycount: action.proxycount,
				proxydate: action.proxydate
			};	
		case 'START_EL_VIEW':
			return {
				...state,
				empleaveinfo: null,
			};	
		case 'SET_EL_VIEW_DATA':
			return {
				...state,
				empleaveinfo: action.data,
				leaveinfo: true
			};	
		case 'EL_STATUS_CHANGED':
			return {
				...state,
				leaveinfo: false
			};
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				todayproxy: false,
				upcomingproxy: false,
				leaveinfo: false
			};		
		default:
			return state;	
	}
}


const reducer = combineReducers({
	errors,
	info,
	graphs,
	helperData,
	items
});

export default reducer;