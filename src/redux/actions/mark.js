import api, {makeApiData} from '../../api';
import {paramsFromState, TAG_TYPE_EXAM, bcsName} from '../../utils';
import {getExamType} from '../../utils/options';
export {updateFilter, update} from './index';

const view = 'mark';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data}, {data: bcsmaps}] = await Promise.all([
			api({
				url: '/admin/mark',
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

export function startAdd(state) {
	return async dispatch => {
		let [examSchedules, tags, tagMap] = await loadFormData(state, dispatch);
		dispatch({
			type: 'START_ADD_MARK',
			tags,
			tagMap,
			examSchedules,
		});
	};
}

export function edit(state, examScheduleId, _bcsMapId) {
	return editOrView(
		state,
		examScheduleId,
		_bcsMapId,
		'EDIT_MARK'
	);
}

export function viewData(state, examScheduleId, _bcsMapId) {
	return editOrView(
		state,
		examScheduleId,
		_bcsMapId,
		'VIEW_MARK'
	);
}


export function updateExamSchedule(state, examScheduleId) {
	if (!examScheduleId)
		return {
			type: 'RESET_EXAM_SCHEDULE',
		};
	return async dispatch => {
		dispatch({
			type: 'SET_MARK_EXAM_SCHEDULE',
			examScheduleId
		});
		let {data} = await api({
			url: '/admin/mark2/sections',
			data: makeApiData(state, {
				examScheduleId,
				academicSessionId: state.session.selectedSession.id,
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
			})
		});
		dispatch({
			type: 'LOAD_MARKS_SECTIONS',
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: item.section.sectiondetails[0].name
			}))
		});
	};
}

export function updateSection(state, bcsMapId) {
	if (!bcsMapId)
		return {
			type: 'RESET_MARK_SECTION',
		};
	return async dispatch => {
		dispatch({
			type: 'SET_MARK_SECTION',
			bcsMapId
		});
		let {data} = await api({
			url: '/admin/mark2/subjects',
			data: makeApiData(state, {
				bcsMapId,
				examScheduleId: state.selector.examScheduleId,
				academicSessionId: state.session.selectedSession.id,
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
			}),
		});
		dispatch({
			type: 'LOAD_MARKS_SUBJECTS',
			examscheduledetails: data.examscheduledetails.map(item => ({
				value: item.id,
				label: item.subject.subjectdetails[0].name + ' - ' + getExamType(item.exam_type)
			})),
		});
	};
}

export function loadStudents(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MARKS_STUDENTS',
		});

		let examscheduledetails = state.selector.subjects,
			bcsMapId = state.selector.sectionId,
			examScheduleId = state.selector.examScheduleId;

		let {data} = await api({
			url: '/admin/mark2/students',
			data: makeApiData(state, {
				examscheduledetails,
				bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		let marks = data.examscheduledetails.map(examscheduledetail => ({
			id: examscheduledetail.markId || '',
			subjectId: examscheduledetail.subjectId,
			subject: examscheduledetail.subject,
			exam_type: examscheduledetail.exam_type,
			examschedulesubjectcategories: examscheduledetail.examschedulesubjectcategories,
			min_passing_mark: examscheduledetail.min_passing_mark,
			max_mark: examscheduledetail.max_mark,
		}));

		data.students.forEach(student => {
			let markrecords = student.markrecords, index = 0;
			student.markrecords = marks.map(mark => {
				let markId = markrecords[index] ? markrecords[index].markId : 0,
					escs;
				if (mark.examschedulesubjectcategories && mark.examschedulesubjectcategories.length) {
					escs = {};
					if (markId !== 0 && markrecords[index].obtained_mark === null) {
						mark.examschedulesubjectcategories.forEach(esc => {
							escs['s' + esc.subjectCategoryId] = 'A';
						});
					} else {
						let subjectcategory_marks = (
							mark.id === markId
								? JSON.parse(markrecords[index].subjectcategory_marks)
								: {}
						) || {};
						mark.examschedulesubjectcategories.forEach(esc => {
							escs['s' + esc.subjectCategoryId] =
								subjectcategory_marks['s' + esc.subjectCategoryId] || '';
						});
					}
				} else {
					escs = null;
				}

				if (mark.id === markId) {
					markrecords[index].subjectcategory_marks = escs;
					markrecords[index].obtained_mark = markrecords[index].obtained_mark === null ?
						'A' : markrecords[index].obtained_mark;
					return markrecords[index++];
				} else {
					return {
						id: '',
						markId: '',
						studentId: student.id,
						obtained_mark: '',
						subjectcategory_marks: escs,
						tags: '',
					};
				}
			});
		});

		dispatch({
			type: 'LOAD_MARK_STUDENTS',
			students: data.students,
			marks,
			selected: {
				examscheduledetails,
				bcsMapId,
				examScheduleId,
			}
		});
	};
}

export function save(state, marks) {
	return async dispatch => {
		dispatch({type: 'SEND_MARK_SAVE_REQUEST'});
		await api({
			url: '/admin/mark2/save',
			data: makeApiData(state, {
				marks,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		state.router.push(state.router.location);
	};
}

async function loadFormData(state, dispatch) {
	dispatch({type: 'LOADING_MRK_FORM_DATA'});

	const [examSchedules, tags] = await Promise.all([
		api({
			url: '/admin/mark/add',
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id
			}),
		}),
		api({
			url: '/admin/tag/list',
			data: makeApiData(state, {
				type: TAG_TYPE_EXAM,
			}),
		}),
	]);

	let tagMap = Object.create(null, {});
	tags.data.data.forEach(tag => {
		tagMap[tag.id] = tag;
	});

	return [
		examSchedules.data.data.map(item => ({
			value: item.id,
			label: item.examhead.examheaddetails[0].name
				+ '/' + item.board.boarddetails[0].alias
				+ '/' + item.class.classesdetails[0].name,
		})),
		tags.data.data,
		tagMap,
	];
}

function editOrView(state, examScheduleId, _bcsMapId, type) {
	return async dispatch => {
		const [[examSchedules, tags, tagMap], {data}] = await Promise.all([
			loadFormData(state, dispatch),
			api({
				url: '/admin/mark2/subjects',
				data: makeApiData(state, {
					bcsMapId: _bcsMapId,
					examScheduleId,
					academicSessionId: state.session.selectedSession.id,
					user_type: state.session.user_type,
					userTypeId: state.session.userdetails.userId,
					view: type === 'VIEW_MARK'
				})
			})
		]);
		let bcsmap, bcsmaps = state.meta.bcsmaps, bcsMapId = parseInt(_bcsMapId);
		for (let i = bcsmaps.length - 1; i >= 0; i--) {
			if (bcsmaps[i].value === bcsMapId)
				bcsmap = bcsmaps[i].label;
		}
		dispatch({
			type,
			tags,
			tagMap,
			bcsmap,
			bcsMapId,
			examSchedules,
			examScheduleId: parseInt(examScheduleId),
			examscheduledetails: data.examscheduledetails.map(item => ({
				value: item.id,
				label: item.subject.subjectdetails[0].name + ' - ' + window.__(getExamType(item.exam_type))
			})),
		});
	};
}
