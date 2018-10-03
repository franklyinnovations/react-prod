import api, {makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter, update} from './index';

const view = 'activitymark';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let [{data}, {data: bcsmaps}] = await Promise.all([
			api({
				url: '/admin/activitymark',
				cookies: state.cookies,
				data: makeApiData(state, {
					user_type: state.session.user_type,
					userTypeId: state.session.userdetails.userId,
					academicSessionId: state.session.selectedSession.id,
				}),
				params: paramsFromState(state, view),
			}),
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
			}),
		]);

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.data.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

async function loadFormData(state, dispatch) {
	dispatch({
		type: 'LOADING_AM_FORM_DATA',
		view,
	});

	let {data} = await api({
		data: makeApiData(state, {
			user_type: state.session.user_type,
			userTypeId: state.session.userdetails.userId,
			academicSessionId: state.session.selectedSession.id
		}),
		url: '/admin/activitymark/add'
	});

	return data.examSchedules.map(item => ({
		value: item.id + '-' + item.board.id + '-' + item.class.id,
		label: item.examhead.examheaddetails[0].name
			+ '/' + item.board.boarddetails[0].alias
			+ '/' + item.class.classesdetails[0].name
	}));
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_ADD_ACTIVITY_MARK',
			examSchedules: await loadFormData(state, dispatch),
		});
	};
}

function editOrView(state, examschedule, _bcsMapId, type) {
	return async dispatch => {
		let [examschedules, activities] = await Promise.all([
			loadFormData(state, dispatch),
			api({
				url: '/admin/activitymark/mark-activities',
				data: makeApiData(state, {
					examscheduleId: examschedule.split('-')[0],
					bcsMapId: _bcsMapId
				})
			}),
		]);
		let bcsmap,
			bcsmaps = state.meta.bcsmaps,
			bcsMapId = parseInt(_bcsMapId);
		for (let i = bcsmaps.length - 1; i >= 0; i--) {
			if (bcsmaps[i].value === bcsMapId)
				bcsmap = bcsmaps[i].label;
		}
		dispatch({
			type,
			bcsmap,
			bcsMapId,
			examschedule,
			examschedules,
			activities: activities.data.data.map(activitymark => ({
				value: activitymark.activityschedule.activity.id,
				label: activitymark.activityschedule.activity.activitydetails[0].name,
			})),
		});
	};
}

export function edit(state, examschedule, bcsMapId) {
	return editOrView(
		state,
		examschedule,
		bcsMapId,
		'EDIT_AM'
	);
}

export function viewData(state, examschedule, bcsMapId) {
	return editOrView(
		state,
		examschedule,
		bcsMapId,
		'VIEW_AM'
	);
}

export function updateExamSchedule(state, examSchedule) {
	if (!examSchedule)
		return {
			type: 'RESET_EXAM_SCHEDULE',
		};
	return async dispatch => {
		dispatch({
			type: 'SET_AM_MARK_EXAM_SCHEDULE',
			examSchedule,
		});
		let [examscheduleId, boardId, classId] = examSchedule.split('-');
		let {data: {sections, activities}} = await api({
			url: '/admin/activitymark/getSectionsAndActivities',
			data: makeApiData(state, {
				classId,
				boardId,
				examscheduleId,
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});
		
		dispatch({
			type: 'LOAD_AM_ACTIVITIES_SECTIONS',
			sections: sections.map(item => ({
				value: item.bcsmaps[0].id,
				label: item.sectiondetails[0].name
			})),
			activities: activities.map(item => ({
				value: item.id,
				label: item.activitydetails[0].name
			})),
		});
	};
}

export function loadStudents(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_AM_STUDENTS',
		});

		let activities = state.selector.activities,
			bcsMapId = state.selector.sectionId,
			examscheduleId = state.selector.examSchedule.split('-')[0];

		let {data: {students, activities: _activities}} = await api({
			url: '/admin/activitymark/students2',
			data: makeApiData(state, {
				bcsMapId,
				activities,
				examscheduleId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		let subActivities = {}, superActivities = [];
		for (let i = 0; i < _activities.length; i++) {
			if (_activities[i].superActivityId) {
				if (subActivities[_activities[i].superActivityId]) {
					subActivities[_activities[i].superActivityId].push(_activities[i]);
				} else {
					subActivities[_activities[i].superActivityId]= [_activities[i]];
				}
			} else {
				superActivities.push(_activities[i]);
			}
		}
		let	activityschedules = {},
			activitymarks = {};

		students = students.map(item => {
			let student = {
				id: item.id,
				user: item.user,
				studentrecord: item.studentrecord,
				marks: {},
			};
			item.activityschedules.forEach(activityschedule => {
				if (!activityschedules[activityschedule.activityId]) {
					activityschedules[activityschedule.activityId] = {
						id: activityschedule.id,
						max_marks: activityschedule.max_marks
					};
				}

				if (activityschedule.activitymark) {
					if (!activitymarks[activityschedule.activityId]) {
						activitymarks[activityschedule.activityId] = activityschedule.activitymark.id;
					}
					if (activityschedule.activitymark.activitymarkrecords.length === 0) {
						student.marks[activityschedule.activityId] = {
							value: '',
						};
					} else {
						student.marks[activityschedule.activityId] = {
							id: activityschedule.activitymark.activitymarkrecords[0].id,
							value: activityschedule.activitymark.activitymarkrecords[0].obtained_mark,
						};
					}
				} else {
					student.marks[activityschedule.activityId] = {
						value: '',
					};
				}
			});
			return student;
		});

		dispatch({
			type: 'LOAD_AM_STUDENTS',
			students,
			activitymarks,
			subActivities,
			superActivities,
			activityschedules,
			bcsMapId,
		});
	};
}

export function save(state, activitymarks) {
	return async dispatch => {
		dispatch({
			type: 'SEND_AM_SAVE_REQUEST',
		});
		await api({
			url: '/admin/activitymark/save2',
			data: makeApiData(state, {
				activitymarks,
				academicSessionId: state.session.selectedSession.id,
			})
		});
		state.router.push('/exam/activity-mark');
	};
}
