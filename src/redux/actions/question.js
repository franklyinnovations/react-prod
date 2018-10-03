import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'question';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [bcsmaps, subjects, {data}] = await Promise.all([
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
				url: '/admin/subject/list',
				cookies: state.cookies,
				data: makeApiData(state)
			}),
			api({
				url: '/admin/question',
				cookies: state.cookies,
				params: paramsFromState(state, view),
				data: makeApiData(state, {
					userId: state.session.id,
					academicSessionId: state.session.selectedSession.id,
				}),
			})
		]);
		data.data.forEach(item => {
			item.questionHtml = {__html: item.questiondetails[0].question_title};
			item.optionsHtml = item.questionoptions.map(option => ({
				__html: option.option_title,
			}));
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.data.bcsmaps.data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			subjects: subjects.data.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name 
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_QUE_DATA'});
		let {data} = await api({
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id
			}),
			url: '/admin/question/add'
		});
		dispatch({
			type: 'START_QUE_ADD',
			data: {
				id: '',
				classId: '',
				comments: '',
				options: null,
				subjectId: '',
				question_title: '',
				tags_for_search: '',
				number_of_options: '',
				questionControlType: null,
				time_to_attempt_question: '',
			},
			bcs_list: data.bcs_list.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			question_control_types: data.question_control_types.map(item => ({
				label: item.questioncontroltypedetails[0].control_title,
				value: item.questioncontroltypedetails[0].control_slug + '-' + item.id,
			})),
		});
	};
	
}

export function changeClass(state, value) {
	if (value === null)
		return {
			type: 'RESET_QUE_CLASS',
		};
	return async dispatch => {
		dispatch({
			type: 'CHANGING_QUE_CLASS',
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
			type: 'LOAD_QUE_SUBJECTS',
			subjects: data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
		});
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({type: 'SAVING_QUE'});
		formData.append('userId', state.session.id);
		formData.append('academicSessionId', state.session.selectedSession.id);
		let {data} = await api({
			data: makeApiData(state, formData),
			url: '/admin/question/save'
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_QUE_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_QUE_SAVE_ERRORS',
				errors: {}
			});
		} else {
			state.router.push('/exam/questions');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({type: 'LOADING_QUE_DATA'});

		let {data} = await api({
			data: makeApiData(state, makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})),
			url: '/admin/question/edit/' + itemId
		});

		let item = data.data;

		dispatch({
			type: 'SET_QUE_EDIT_DATA',
			data: {
				id: item.id,
				classId: item.classId,
				comments: item.questiondetails[0].comments,
				options: item.questionoptions,
				subjectId: item.subjectId,
				question_title: item.questiondetails[0].question_title,
				tags_for_search: item.questiondetails[0].tags_for_search,
				number_of_options: item.number_of_options,
				questionControlType: item.questioncontroltype.
					questioncontroltypedetails[0].control_slug + '-' + item.questioncontroltype.id,
				time_to_attempt_question: item.time_to_attempt_question,
			},
			subjects: data.subjects.data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
			bcs_list: data.classes.data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			question_control_types: data.question_control_types.map(item => ({
				label: item.questioncontroltypedetails[0].control_title,
				value: item.questioncontroltypedetails[0].control_slug + '-' + item.id,
			})),
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_QUE_REMOVE'});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/question/remove'
		});

		if (status) {
			state.router.push('/exam/questions');
			return;
		}

		dispatch({type: 'QUE_REMOVAL_FAILED'});
	};
}