import api, {makeErrors, makeApiData} from '../../api';
import {bcsName} from '../../utils';

const view = 'paper_map_with_question';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/papermapwithquestion',
			cookies: state.cookies,
			data:  makeApiData(state,{
				userId: state.session.userdetails.userId,
				user_type: state.session.user_type,
				academicSessionId: state.session.selectedSession.id
			})
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcs_list: data.bcs_list.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
		});
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({type: 'SAVING_PMQ'});
		let {data} = await api({
			data: makeApiData(state, formData),
			url: '/admin/papermapwithquestion/save'
		});
		if (data.errors)
			return dispatch({
				type: 'SET_SAVE_PMQ_ERRORS',
				errors: makeErrors(data.errors)
			});
		else if(!data.status)
			return dispatch({
				type: 'SET_SAVE_PMQ_ERRORS',
				errors: {}
			});
		else
			state.router.push('/exam/map-paper-with-questions');
	};
}

export function changeClass(state, value) {
	if (value === null) return {type: 'RESET_PMQ_CLASS'};
	return async dispatch => {
		dispatch({
			type: 'CHANGING_PMQ_CLASS',
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
			type: 'SET_PMQ_SUBJECTS',
			subjects: data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
		});
	};
}

export function changeSubject(state, value) {
	if (value === null) return {type: 'RESET_PMQ_SUBJECT'};
	return async dispatch => {
		dispatch({
			type: 'CHANGING_PMQ_SUBJECT',
			value,
		});
		let {data: {exam_papers, questions}} = await api({
			data: makeApiData(state, {
				subjectId: value,
				userId: state.session.id,
				classId: state.selector.classId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/papermapwithquestion/getpaperandquestion',
		});

		exam_papers.forEach(item => {
			item.value = item.id;
			item.label = item.exampaperdetails[0].paper_title;
		});
		questions.forEach(item => {
			item.questionHtml = {__html: item.questiondetails[0].question_title};
			item.optionsHtml = item.questionoptions.map(option => ({
				__html: option.option_title,
			}));
		});

		dispatch({
			type: 'SET_PMQ_EXAMPAPERS',
			questions,
			exampapers: exam_papers,
		});
	};
}