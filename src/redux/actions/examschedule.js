import moment from 'moment';

import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'examschedule';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data}, {data: classes}] = await Promise.all([
			api({
				url: '/admin/examschedule',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
				}),
				params: paramsFromState(state, view),
			}),
			api({
				url: '/admin/class/list/' + state.session.masterId,
				cookies: state.cookies,
				data: makeApiData(state),
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			boards: data.boards.map(board => ({
				value: board.id,
				label: board.boarddetails[0].alias,
			})),
			classes: classes.map(item => ({
				value: item.id,
				label: item.classesdetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_EXAMSCHEDULE_STATUS',
			itemId,
			status: -1
		});
		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/examschedule/status/' + itemId + '/' + status
		});
		dispatch({
			type: 'CHANGE_EXAMSCHEDULE_STATUS',
			itemId,
			status: data.status ? status : oldstatus,
		});
	};
}

export function sendNotification(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'SEND_EXAM_NOTIFICATION_REQUEST',
			itemId,
		});
		await api({
			data: makeApiData(state, {
				userId: state.session.id
			}),
			url: '/admin/examschedule/notification/' + itemId
		});
		dispatch({
			type: 'SET_EXAM_NOTIFICATION_RESPONSE',
			itemId,
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_EHD_REMOVE'});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/examschedule/remove'
		});

		if (status) {
			state.router.push('/exam/schedule');
			return;
		}

		dispatch({
			type: 'EHD_REMOVAL_FAILED',
		});
	};
}

export function viewSchedule(state, id) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_EXAM_SCHEDULE',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/examschedule/viewSchedule'
		});
		dispatch({
			type: 'SHOW_EXAMSCHEDULE',
			data: data.examschedules.examscheduledetails
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_EXAMSCHEDULE_FORM_DATA'});
		const [examheads, classes, activities] = await loadFormData(
			makeApiData(state, {
				academicSessionId: state.session.selectedSession.id
			})
		);
		dispatch({
			type: 'START_ADD_EXAMSCHEDULE',
			classes,
			examheads,
			activities,
			data: {
				id: '',
				is_active: true,
				has_activity: 0,
				examheadId: null,
				examscheduledetails: [],
				activityschedules: [],
				boardId: '',
				classId: '',
				dirty: false,
				loadingSubjects: false,
				subjects: [],
				loadingSubActivities: false,
				subActivities: [],
			},
		});
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_EXAMSCHEDULE_FORM_DATA'});
		let formData = makeApiData(state, {
			academicSessionId: state.session.selectedSession.id
		});
		let [{data}, [examheads, classes, activities]] = await Promise.all([
			api({
				data: makeApiData(state, {
					id
				}),
				url: '/admin/examschedule/edit'
			}),
			loadFormData(formData),
		]);
		dispatch({
			type: 'SET_EXAMSCHEDULE_DATA',
			data: {
				id: data.id,
				is_active: data.is_active,
				has_activity: data.has_activity,
				examheadId: data.examheadId,
				examscheduledetails: data.examscheduledetails,
				activityschedules: data.activityschedules,
				boardId: data.boardId,
				classId: data.classId,
				dirty: false,
				loadingSubjects: true,
				subjects: [],
				loadingSubActivities: false,
				subActivities: []
			},
			classes,
			examheads,
			activities,
		});
		let {data: {subjects}} = await api({
			data,
			url: '/admin/examschedule/classSubjects'
		});

		dispatch({
			type: 'LOAD_EXAM_SUBJECTS',
			data: subjects.map(item => ({
				label: item.subjectdetails[0].name,
				value: item.id
			}))
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_EXAMSCHEDULE_DATA',
		name,
		value,
	};
}

export function changeExamHead(state, examheadId) {
	if (examheadId === null) {
		return {
			type: 'RESET_EXAM_SCHEDULE_EXAM'
		};
	}
	if (!state.item.boardId) return updateData('examheadId', examheadId);
	return async dispatch => {
		let {boardId, classId} = state.item,
			formData = makeApiData(state, {
				boardId,
				classId,
				examheadId,
				academicSessionId: state.session.selectedSession.id,
			});

		dispatch({
			type: 'LOAD_EXAM_SCHEDULE',
			boardId,
			classId,
			examheadId,
		});
		api({
			data: formData,
			url: '/admin/examschedule/examSchedule'
		})
			.then(({data}) => dispatch({
				type: 'LOAD_EXAM_SCHEDULE_DATA',
				data: data.examschedules
			}));

		api({
			data: formData,
			url: '/admin/examschedule/classSubjects'
		})
			.then(({data}) => {
				dispatch({
					type: 'LOAD_EXAM_SUBJECTS',
					data: data.subjects.map(item => ({
						label: item.subjectdetails[0].name,
						value: item.id
					}))
				});
			});			
	};
}

export function changeClass(state, cIds) {
	if (cIds === null) {
		return {
			type: 'RESET_EXAM_SCHEDULE_CLASS'
		};
	}
	let examheadId = state.item.examheadId;
	if (!examheadId) return updateData('cIds', cIds);
	return dispatch => {
		let [boardId, classId] = cIds.split('-');
		dispatch({
			type: 'LOAD_EXAM_SCHEDULE',
			boardId,
			classId,
			examheadId,
		});
		let data = makeApiData(state, {
			boardId,
			classId,
			examheadId,
			academicSessionId: state.session.selectedSession.id,
		});
		api({
			data,
			url: '/admin/examschedule/examSchedule'
		})
			.then(({data}) => dispatch({
				type: 'LOAD_EXAM_SCHEDULE_DATA',
				data: data.examschedules
			}));
		api({
			data,
			url: '/admin/examschedule/classSubjects'
		})
			.then(({data}) => {
				dispatch({
					type: 'LOAD_EXAM_SUBJECTS',
					data: data.subjects.map(item => ({
						label: item.subjectdetails[0].name,
						value: item.id
					}))
				});
			});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({
			type: 'SEND_SAVE_EXAMSCHEDULE_REQUEST',
		});
		let {data} = await api({
			data: makeApiData(state, {
				id: state.item.id,
				examheadId: state.item.examheadId || '',
				masterId: state.session.masterId,
				academicSessionId: state.session.selectedSession.id,
				boardId: state.item.boardId,
				classId: state.item.classId,
				cIds: 'cIds',
				is_active: state.item.is_active,
				has_activity: state.item.has_activity
			}),
			url: '/admin/examschedule/save2'
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_EXAMSCHEDULE_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_EXAMSCHEDULE_SAVE_ERRORS',
				errors: {}
			});
		} else {
			dispatch({
				type: 'EXAM_SCHEDULE_SAVED',
				data
			});
		}
	};
}

async function loadFormData(data) {
	let [examheads, classes, activities] = await Promise.all([
		api({
			data,
			url: '/admin/examhead/list'
		}),
		api({
			data,
			url: '/admin/examschedule/scheduleClasses'
		}),
		api({
			data,
			url: '/admin/activity/activityList'
		}),
	]);
	return [
		examheads.data.data.map(item => ({
			value: item.id,
			label: item.examheaddetails[0].name
		})),
		classes.data.data.map(item => ({
			value: item.boardId + '-' + item.classId,
			label: item.board.boarddetails[0].alias
				+ '-' + item.class.classesdetails[0].name
		})),
		activities.data.activities.map(item => ({
			value: item.id,
			label: item.activitydetails[0].name
		}))
	];
}

export function saveDetail(state) {
	return async dispatch => {
		dispatch({
			type: 'SEND_SAVE_EXAM_DETAIL_REQUEST',
		});
		let formData = {
			...state.examscheduledetail,
			date: !state.examscheduledetail.date ? '' : moment(
				state.examscheduledetail.date,
				state.session.userdetails.date_format,
			).format('YYYY-MM-DD'),
		};
		formData.subjectId = formData.subjectId || '';
		formData.exam_type = formData.exam_type || '';
		formData.duration = moment.utc(
			moment(formData.end_time, 'HH:mm:ss').diff(moment(formData.start_time, 'HH:mm:ss'))
		).format('HH:mm');
		if (formData.id) {
			let {data: result} = await api({
				data: makeApiData(state, formData),
				url: '/admin/examschedule/saveEdit',
			});
			if (result.errors) {
				return dispatch({
					type: 'SET_EXAMS_DETAIL_SAVE_ERRORS',
					errors: makeErrors(result.errors)
				});
			} else if (!result.status) {
				dispatch({
					type: 'SET_EXAMSCHEDULE_SAVE_ERRORS',
					errors: {}
				});
			} else {
				let subjects = state.item.subjects, subjectId = formData.subjectId;
				for (var i = subjects.length - 1; i >= 0; i--) {
					if (subjects[i].value === subjectId)
						formData.subject = {
							id: subjectId,
							subjectdetails: [{
								name: subjects[i].label,
							}]
						};
				}
				formData.date = moment(formData.date, moment.defaultFormat).toISOString();
				dispatch({
					type: 'EXAM_DETAIL_UPDATED',
					data: formData,
				});
			}
		} else {
			let {data} = await api({
				data: makeApiData(state, {
					examheadId: state.item.examheadId,
					boardId: state.item.boardId,
					classId: state.item.classId,
					id: state.item.id,
					academicSessionId: state.session.selectedSession.id,
					examscheduledetail: formData
				}),
				url: '/admin/examschedule/save',
			});
			if (data.errors) {
				return dispatch({
					type: 'SET_EXAMS_DETAIL_SAVE_ERRORS',
					errors: makeErrors(data.errors)
				});
			} else if (!data.status) {
				dispatch({
					type: 'SET_EXAMSCHEDULE_SAVE_ERRORS',
					errors: {}
				});
			} else {
				let subjects = state.item.subjects, subjectId = data.data.subjectId;
				for (let i = subjects.length - 1; i >= 0; i--) {
					if (subjects[i].value === subjectId)
						data.data.subject = {
							id: subjectId,
							subjectdetails: [{
								name: subjects[i].label,
							}]
						};
				}
				dispatch({
					type: 'EXAM_DETAIL_ADDED',
					data: data.data
				});
			}
		}
	};
}

export function removeDetail(state, id) {
	return async dispatch => {
		dispatch({
			type: 'SEND_REMOVE_EXAM_DETAIL_REQUEST'
		});
		let {data} = await api({
			url: '/admin/examschedule/removeSchedule',
			data: makeApiData(state, {
				id
			})
		});
		dispatch({
			type: data.status ? 'REMOVE_EXAM_DETAIL_SUCCEED' : 'REMOVE_EXAM_DETAIL_FAILED',
			id,
		});
	};
}

export function changeActivity(state, id) {
	if (!id)
		return {
			type: 'RESET_SUB_ACTIVITIES',
		};
	return async dispatch => {
		dispatch({
			type: 'LOAD_EXAM_SUB_ACTIVITIES',
			id
		});
		let {data} = await api({
			url: '/admin/activity/getSubActivity',
			data: makeApiData(state, {
				activityId: id,
				examscheduleId: state.item.id,
			})
		});
		dispatch({
			type: 'SET_EXAM_SUB_ACTIVITIES',
			data: data.activities
		});
	};
}

export function saveActivitySchedule(state, reqdata) {
	return async dispatch => {
		dispatch({
			type: 'SEND_SAVE_EXAM_ACTIVITY_REQUEST',
		});

		let saveData = makeApiData(state, {
			activityschedule: reqdata.map(r => ({
				...r,
				date: !r.date ? '' : moment(
					r.date,
					state.session.userdetails.date_format,
				).format('YYYY-MM-DD'),
			})), 
		});

		let {data} = await api({
			url: '/admin/activity/checkActivitySchedule',
			data: saveData,
		});
		if(data.activityschedules == null){
			let {data} = await api({
				url: '/admin/activity/addActivitySchedule',
				data: saveData,
			});
			dispatch({
				type: 'EXAM_ACTIVITY_ADDED',
				data: data.activityschedule
			});
		} else {
			dispatch({
				type: 'EXAM_ACTIVITY_EXISTS_ERROR',
			});
		}
	};
}

export function removeActivitySchedule(state, id, activityId) {
	return async dispatch => {
		dispatch({
			type: 'SEND_REMOVE_EXAM_ACTIVITY_REQUEST'
		});
		let {data} = await api({
			url: '/admin/activity/removeActivity',
			data: makeApiData(state, {
				id: activityId,
				examscheduleId: state.item.id
			})
		});
		dispatch({
			type: data.status
				? 'REMOVE_EXAM_ACTIVITY_SUCCEED'
				: 'REMOVE_EXAM_ACTIVITY_FAILED',
			id,
			activityId,
		});
	};
}

export function editCategory(state, id) {
	return async dispatch => {
		dispatch({
			type: 'GET_CATEGORIES',
		});
		let {data} = await api({
			url: '/admin/examschedule/addCategories',
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id
			})
		});
		dispatch({
			type: 'SET_CATEGORIES',
			data
		});
	};
}

export function saveCategory(state, data) {
	data.delSubCatIds  = state.category.delSubCatIds;
	return async dispatch => {
		dispatch({
			type: 'SEND_SAVE_EXAM_CATEGORY_REQUEST',
		});
		await api({
			data: makeApiData(state, data),
			url: '/admin/examschedule/saveCategories',
		});

		dispatch({
			type: 'SAVED_EXAM_CATEGORY',
		});
	};
}

