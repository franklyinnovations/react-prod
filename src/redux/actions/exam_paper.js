import moment from 'moment';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter, update} from './index';

const view = 'exam_paper';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [{data: bcsmaps}, {data: subjects}, {data}] = await Promise.all([
			api({
				cookies: state.cookies,
				url: '/admin/assignment/bcsmaps',
				data: makeApiData(state, {
					user_type: state.session.user_type,
					userId: state.session.userdetails.userId,
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
			api({
				cookies: state.cookies,
				data: makeApiData(state),
				url: '/admin/subject/list',
			}),
			api({
				params: paramsFromState(state, view),
				url: '/admin/exampaper',
				cookies: state.cookies,
				data: makeApiData(state, {
					userId: state.session.id,
					academicSessionId: state.session.selectedSession.id,
				}),
			})
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.bcsmaps.data.map(item => ({
				value: item.bcsmap.id, 
				label: bcsName(item.bcsmap),
			})),
			subjects: subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name 
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_EXP_EDIT_DATA'});
		let {data} = await api({
			data:  makeApiData(state, {
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id
			}),
			url: state.session.user_type === 'teacher' ? 
				'/admin/utils/bcsByTeacher' : '/admin/utils/bcsByInstitute'
		});
		dispatch({
			type: 'START_ADD_SECTION',
			data: {
				id: '',
				paper_title: '',
				max_marks: '',
				total_questions: '',
				published_date: null,
				tags_for_search: '',
				duration: '',
				section_title: '',
				comments: '',
				classId: null,
				subjectId: null,
				is_active: 1,
			},
			bcs_list: data.data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
		});
	};
}

export function save(state, formData) {
	formData.append('id', state.item.id);
	formData.append('userId', state.session.id);
	formData.append('sections', state.surveySections);
	formData.append('academicSessionId', state.session.selectedSession.id);

	return async dispatch => {
		dispatch({type: 'SAVING_EXP'});
		let {data} = await api({
			url: '/admin/exampaper/save',
			data: makeApiData(state, formData),
		});
		if (data.errors)
			dispatch({
				type: 'SET_EXP_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		else
			state.router.push('/exam/paper');
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({type: 'LOADING_EXP_EDIT_DATA'});
		let {data} = await api({
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/exampaper/edit/' + itemId
		});

		let item = data.data;

		dispatch({
			type: 'SET_SECTION_EDIT_DATA',
			data: {
				id: item.id,
				paper_title: item.exampaperdetails[0].paper_title,
				max_marks: item.max_marks,
				total_questions: item.total_questions,
				published_date: moment(item.published_date).format(
					state.session.userdetails.date_format,
				),
				tags_for_search: item.exampaperdetails[0].tags_for_search,
				duration: item.duration,
				section_title: '',
				comments: item.exampaperdetails[0].comments,
				classId: item.classId,
				subjectId: item.subjectId,
				is_active: item.is_active
			},
			exampapersections: item.exampapersections.map(({section_title}) => section_title),
			classes: data.classes.data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			subjects: data.subjects.data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
		});
	};
}

export function viewMappedQuestions(state, examPaperId) {
	return async dispatch => {
		dispatch({type: 'LOADING_EXP_QUESTIONS'});

		let {data: {data}} = await api({
			data: makeApiData(state),
			url: '/admin/exampaper/get-mapped-question/' + examPaperId
		});

		data.forEach(item => {
			item.questionHtml = {__html: item.question.questiondetails[0].question_title};
			item.optionsHtml = item.question.questionoptions.map(option => ({
				__html: option.option_title,
			}));
		});
		
		dispatch({
			type: 'SET_EXP_QUESTIONS',
			data,
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_EXP_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/exampaper/status/' + id + '/' + status
		});

		dispatch({
			type: 'CHANGE_EXP_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function changePublishStatus(state, index) {
	return async dispatch => {
		let id = state.items[index].id,
			oldstatus = state.items[index].is_published,
			status = oldstatus === 0 ? 1: 0;
		dispatch({
			type: 'CHANGE_EXP_PUBLISH_STATUS',
			id,
			status,
		});
		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/exampaper/publish/'+ id + '/'+status
		});
		dispatch({
			type: 'CHANGE_EXP_PUBLISH_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function changeClass(state, value) {
	if (value === null)
		return {
			type: 'RESET_EXP_CLASS',
		};
	return async dispatch => {
		dispatch({
			type: 'CHANGING_EXP_CLASS',
			value,
		});
		let {data: {data}} = await api({
			data: makeApiData(state, {
				bcsMapId: value,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: state.session.user_type === 'teacher' ?
				'/admin/utils/subjectByTeacher' : '/admin/utils/subjectByInstitute'
		});
		dispatch({
			type: 'LOAD_EXP_SUBJECTS',
			subjects: data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			}))
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_EXP_REMOVE', id});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/exampaper/remove'
		});

		if (status) {
			state.router.push('/exam/paper');
			return;
		}

		dispatch({
			type: 'EXP_REMOVAL_FAILED',
		});
	};
}