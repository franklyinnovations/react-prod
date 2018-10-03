import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'examsyllabus';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let params = paramsFromState(state, view);
		if (params.boardClass) {
			let [boardId, classId] = params.boardClass.split(':');
			params.examschedule__boardId__eq = boardId;
			params.examschedule__classId__eq = classId;
		}

		const {data} = await api({
			params,
			url: '/admin/syllabus',
			cookies: state.cookies,
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			hideMessage: true,
		});

		data.data.forEach(item => {
			item.updater = item.updater && item.updater.userdetails[0].fullname;
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			examheads: data.examheads.map(examhead => ({
				value: examhead.id,
				label: examhead.examheaddetails[0].name,
			})),
			classes: data.classes.map(item => ({
				value: item.bcsmap.board.id + ':' + item.bcsmap.class.id,
				label: item.bcsmap.board.boarddetails[0].alias + '-' +
					item.bcsmap.class.classesdetails[0].name,
			})),
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_SYL',
		data: {
			
		},
	};
}

export function edit(state, index, action) {
	return async dispatch => {
		dispatch({type: 'START_SYL_EDIT'});

		let item = state.items[index], id = item.id;

		let {data: {data}} = await api({
			data: makeApiData(state, {
				id,
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/syllabus/' + action,
		});

		dispatch({
			type: 'SET_SYL_EDIT_DATA',
			data: {
				id,
				action,
				title: item.examschedule.board.boarddetails[0].alias
					+ ' - ' + item.examschedule.class.classesdetails[0].name
					+ ' - ' + item.examschedule.examhead.examheaddetails[0].name
					+ ' - ' + item.subject.subjectdetails[0].name,
				syllabus: action === 'view' ? {__html: data.examsyllabuses[0].syllabus} :
					(data.examsyllabuses[0] && data.examsyllabuses[0].syllabus),
			},
		});
	};
}

export function save(state, syllabus) {
	if (! syllabus.trim()) {
		return {
			type: 'SET_SYL_ERRORS',
			errors: {
				syllabus: window.__('This is a required field.'),
			}
		};
	}
	return async dispatch => {
		dispatch({type: 'SEND_SYL_SAVE_REQUEST'});
		await api({
			data: makeApiData(state, {
				syllabus,
				id: state.item.id,
				userId: state.session.id,
				user_type: state.session.user_type,
				userTypeId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/syllabus/save',
		});
		state.router.push(state.router.location);
	};
}
