import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'studentexam';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data}] = await Promise.all([
			api({
				url: '/admin/studentexamschedule',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					boardId: state.session.userdetails.boardId,
					classId: state.session.userdetails.classId,
				}),
				params: paramsFromState(state, view),
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data
		});
	};
}

export function viewSyllabus(state, id) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_EXAM_SYLLABUS',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/studentexamschedule/viewSyllabus'
		});
		dispatch({
			type: 'SHOW_SYLLABUS',
			data: data.examschedule
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

