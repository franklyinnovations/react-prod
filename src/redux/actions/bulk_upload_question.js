import api, {makeApiData} from '../../api';
import {bcsName, mapAndFilter} from '../../utils';

const view = 'bulk_upload_question';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/question/add',
			cookies: state.cookies,
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcs_list: data.bcs_list.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
			question_control_types: mapAndFilter(data.question_control_types, item =>
				item.questioncontroltypedetails[0].control_slug !== 'text_type' && {
					label: item.questioncontroltypedetails[0].control_title,
					value: item.questioncontroltypedetails[0].control_slug + '-' + item.id,
				}
			),
		});
	};
}

export function changeClass(state, value) {
	if (value === null) return {type: 'RESET_BUQ_CLASS'};
	return async dispatch => {
		dispatch({
			type: 'CHANGING_BUQ_CLASS',
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
			type: 'SET_BUQ_SUBJECTS',
			subjects: data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
		});
	};
}

export function upload(state, formData) {
	return async dispatch => {
		formData.append('userId', state.session.id);
		formData.append('academicSessionId', state.session.selectedSession.id);
		dispatch({type: 'UPLOAD_BUQ_FILE'});
		let {data} = await api({
			url: '/admin/question/bulk-upload',
			data: makeApiData(state, formData),
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_BUQ_UPLOAD_ERRORS',
				errors: data.errors
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_BUQ_UPLOAD_ERRORS',
				errors: [],
			});
		} else {
			data.data.forEach(item => {
				item.questionHtml = {__html: item.question_details.question_title};
				item.optionsHtml = item.question_options.map(option => ({
					__html: option.option_title,
				}));
			});
			dispatch({
				type: 'SET_EXCEL_UPLOADED_DATA',
				data: data.data,
			});
		}
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_BUQ'});
		await api({
			data: makeApiData(state, {
				data: state.meta.questions,
				classId: state.selector.classId,
				subjectId: state.selector.subjectId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/question/save-bulk-question'
		});
		state.router.push('/exam/upload-bulk-questions');
	};
}