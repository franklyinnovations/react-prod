import api, {makeErrors, makeApiData} from '../../api';
import {messenger, paramsFromState} from '../../utils';
export {update, updateFilter} from './index';

const view = 'timetable';

export function init(state, loading=true) {
	return dispatch => {
		if(loading) {
			dispatch({
				type: 'LOADING_MODULE',
				view
			});
		}
		return Promise.all([
			api({
				data: makeApiData(state),
				cookies: state.cookies,
				url: '/admin/utils/allBcsByMasterId',
				hideMessage: true
			}).then(({data}) => data.data.map(item => ({
				value: item.id,
				label: item.board.boarddetails[0].alias
				+'-'+item.class.classesdetails[0].name
				+'-'+item.section.sectiondetails[0].name
			}))),
			api({
				url: '/admin/timetable',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.userdetails.userId,
					userType: state.session.user_type
				}),
				params: paramsFromState(state, view),
			}),
		]).then(([bcsmaps, data]) => {
			dispatch({
				type: 'INIT_MODULE',
				view,
				bcsmaps,
				data:data.data,
				stopLoading: true,
			});
		});
	};
}

export function startAdd(state) {
	return dispatch => {
		dispatch({
			type: 'START_ADDING',
		});
		return api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.userdetails.userId,
				userType: state.session.user_type
			}),
			url: '/admin/timetable/add'
		})
			.then(({data}) => {
				dispatch({
					type: 'START_ADD_TIMETABLE',
					data,
				});
			});
	};
}

export function viewList() {
	return {
		type: 'VIEW_TIMETABLE_LIST'
	};
}

export function save(state, data) {
	data.append('userId', state.session.id);
	data.append('academicSessionId', state.session.selectedSession.id);
	return dispatch => {
		dispatch({
			type: 'SEND_ADD_TIMETABLE_REQUEST',
		});
		return api({
			data: makeApiData(state, data),
			url: '/admin/timetable/newsave'
		})
			.then(({data}) => {
				if (data.errors) {
					return dispatch({
						type: 'SET_TIMETABLE_SAVE_ERRORS',
						errors: makeErrors(data.errors)
					});
				} else if (!data.status) {
					dispatch({
						type: 'SET_TIMETABLE_SAVE_ERRORS',
						errors: {}
					});
				} else {
					dispatch(edit(state, data.data.id));
				}
			});
	};
}

export function edit(state, itemId) {
	return dispatch => {
		let data = makeApiData(state, {
			academicSessionId: state.session.selectedSession.id,
			userId: state.session.userdetails.userId,
			userType: state.session.user_type,
			id:itemId
		});
		return Promise.all([
			api({
				data: data,
				url: '/admin/timetable/edit/' + itemId
			}),
			api({
				data: data,
				url: '/admin/subject/list/'+ state.session.masterId
			}),
			api({
				data: makeApiData(state, {
					type: 8
				}),
				url: '/admin/timetable/tags'
			})
		])
			.then(([data, subjects, {data:tags}]) => {
				return dispatch({
					type: 'SET_TIMETABLE_EDIT_DATA',
					data: data.data,
					subjects: subjects.data,
					tags: tags.data.map(item => ({
						value: item.id,
						label: item.tagdetails[0].title
					}))
				});
			});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_TIMETABLE_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/timetable/status/' + itemId + '/' + status
		})
			.then(({data}) => {
				dispatch({
					type: 'CHANGE_TIMETABLE_STATUS',
					itemId,
					status: data.status ? status : oldstatus
				});
			});
	};
}

export function deleteItem(state, itemId) {
	return dispatch => {
		return api({
			data: makeApiData(state,{
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/timetable/remove/' + itemId
		})
			.then(({data}) => {
				if(data.status){
					dispatch({
						type: 'DELETE_TIMETABLE_SUCCESS',
						itemId
					});
				}
			});
	};
}

export function sendNotification(state, itemId) {
	return () => {
		return api({
			data: makeApiData(state,{
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.id
			}),
			url: '/admin/timetable/notification/' + itemId
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_TIMETABLE_DATA_VALUE',
		name,
		value
	};
}

export function showTeacherModal(state, teacherId, timetableId) {
	return dispatch => {
		dispatch({
			type: 'SHOW_TEACHER_MODAL'
		});

		return api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/timetable/changeClassTeacher/' + teacherId
		})
			.then(({data}) => {
				dispatch({
					type: 'SET_TEACHER_MODAL_DATA',
					data,
					teacherId,
					timetableId,
				});
			});
	};
}

export function changeClassTeacher(state){
	return dispatch => {
		if(!state.item.classteacherId){
			return dispatch({
				type: 'SET_TIMETABLE_SAVE_ERRORS',
				errors: {classteacherId: 'This is a required field.'}
			});
		} else {
			dispatch({
				type: 'SEND_CHANGE_CLASS_TEACHER_REQUEST'
			});
			return api({
				data: makeApiData(state, {
					timetableId: state.helperData.timetableId,
					teacherId: state.item.classteacherId,
				}),
				url: '/admin/timetable/changeTeacher/'
			})
				.then(() => {
					dispatch(init(state, false));
				});
		}
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function showEditModal(state, itemId, start_time, end_time, subjectId, teacherId, weekday, timetableId, is_break, tagId, icon) {
	return dispatch => {
		dispatch({
			type: 'SHOW_EDIT_MODAL'
		});
		return Promise.all([
			api({
				data: makeApiData(state, {
					id: itemId,
					subjectId: subjectId,
					teacherId: teacherId,
					start_time: start_time,
					end_time: end_time,
					weekday: weekday,
					academicSessionId: state.session.selectedSession.id
				}),
				url: '/admin/timetable/listBySubjectId/' + state.session.masterId
			}),
			
		])
			.then(([{data}]) => {
				dispatch({
					type: 'SET_EDIT_MODAL_DATA',
					data,
					itemId,
					start_time,
					end_time,
					subjectId: subjectId === null ? 'N/A': subjectId,
					teacherId: teacherId === null ? 'N/A': teacherId,
					timetableId,
					weekday,
					is_break,
					tagId,
					icon
				});
			});
	};
}

export function closeEditModal() {
	return {
		type: 'CLOSE_EDIT_MODAL'
	};
}

export function updateEditData(name, value) {
	return {
		type: 'UPDATE_EDIT_TIMETABLE_DATA_VALUE',
		name,
		value
	};
}

export function updateAvailableTeacher(state, subjectId) {
	return dispatch => {
		dispatch({
			type: 'LOAD_SUBJECT_TEACHERS'
		});
		api({
			data: makeApiData(state, {
				id: state.taEdit.id,
				subjectId: subjectId,
				teacherId: state.taEdit.selectedTeacherId,
				start_time: state.taEdit.start_time,
				end_time: state.taEdit.end_time,
				weekday: state.taEdit.weekday,
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/timetable/listBySubjectId/' + state.session.masterId,
		})
			.then(({data}) => {
				dispatch({
					type: 'SET_SUBJECT_TEACHERS',
					data
				});
			});
	};
}

export function assignSave(state) {
	return dispatch => {
		dispatch({
			type: 'SEND_ADD_TIMETABLE_REQUEST',
		});
		let errors = {},
			start_time = state.taEdit.start_time,
			end_time = state.taEdit.end_time;
		if(!state.taEdit.start_time){
			errors.start_time = 'This is a required field.';
		}
		if(!state.taEdit.end_time){
			errors.end_time = 'This is a required field.';
		} else if (end_time <= start_time){
			errors.end_time = 'Invalid End Time';
		}

		if(state.taEdit.subjectId < 0){
			errors.subjectId = 'This is a required field.';
		}
		if(state.taEdit.teacherId < 0){
			errors.teacherId = 'This is a required field.';
		}

		if(+state.taEdit.is_break === 1 && !state.taEdit.tagId){
			errors.tagId = 'This is a required field.';
		}

		if(Object.keys(errors).length !== 0) {
			return dispatch({
				type: 'SET_ASSIGN_ERRORS',
				errors
			});
		}

		api({
			data: makeApiData(state, {
				id: state.taEdit.id,
				timetableId: state.taEdit.timetableId,
				subjectId: state.taEdit.subjectId !== 'N/A' ? state.taEdit.subjectId : null,
				teacherId: state.taEdit.teacherId !== 'N/A' ? state.taEdit.teacherId : null,
				weekday: state.taEdit.weekday,
				start_time: start_time,
				end_time: end_time,
				is_break: state.taEdit.is_break,
				tagId: state.taEdit.tagId,
				icon: state.taEdit.icon,
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/timetable/saveTimeSubjectTeacher',
		})
			.then(({data}) => {
				if(data.status) {
					dispatch({
						type: 'SUCCESS_ASSIGN_SAVE',
						data
					});
				} else {
					dispatch({
						type: 'SET_ASSIGN_ERRORS',
						errors: {
							start_time: data.overlapped,
							end_time: data.overlapped,
						}
					});
				}
			});
	};
}

export function copyTimetable(state, itemId, start_time, end_time, subjectId, teacherId) {
	return dispatch => {
		if(parseInt(subjectId) < 1 || parseInt(teacherId) < 1) {
			messenger.post({
				message: 'Please Select Subject and Teacher',
				type:'error'
			});

			return dispatch({
				type: 'COPY_ERRORS'
			});
		}
		api({
			data: makeApiData(state, {
				taId: itemId,
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/timetable/copyTimetableNew',
		})
			.then(({data}) => {
				data.data.forEach(function(item){
					if(item.status) {
						messenger.post({
							message: item.weekday+': Copied successfully',
							type:'success'
						});
					} else {
						messenger.post({
							message: item.weekday+': This teacher is engaged for this time frame!',
							type:'error'
						});
					}
				});
				dispatch({
					type: 'SUCCESS_ASSIGN_SAVE',
					data
				});
			});
	};
}

export function timeShiftModal(){
	return {
		type: 'SHOW_TIME_SHIFT_MODAL'
	};
}

export function submitTimeShift(state, data) {
	data.append('academicSessionId', state.session.selectedSession.id);
	return dispatch => {
		dispatch({
			type: 'SEND_TIME_SHIFT_REQUEST'
		});
		api({
			data: makeApiData(state, data),
			url: '/admin/timetable/newtimeshift',
		})
			.then(({data}) => {
				if(data.status){
					dispatch(init(state));
				} else {
					dispatch({
						type:'HIDE_DATA_MODAL'
					});
				}
			});
	};
}
