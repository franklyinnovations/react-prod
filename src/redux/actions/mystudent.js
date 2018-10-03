import moment from 'moment';
import {bcsName} from '../../utils';
import api, {makeApiData} from '../../api';

const view = 'mystudent';

export function init(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE', view});
		let query = state.location.query;
		let {data: {data}} = await api({
			url: '/admin/utils/bcsByTeacher',
			cookies: state.cookies,
			data: makeApiData(state, {
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			})),
		});
		if (query.date) {
			dispatch({type: 'UPDATE_MYS_SELECTOR', name: 'bcsMapId', value: +query.bcsMapId});
			await dispatch(loadStudents(query.date));
		}
	};
}

export function loadStudents(date = false) {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'LOADING_MYS_STUDENTS'});
		let {data} = await api({
			url: '/admin/mystudent/teacherStudent',
			data: makeApiData(state, {
				...state.view.state.selector,
				date: date || moment().format('YYYY-MM-DD'),
				academicSessionId: state.session.selectedSession.id
			}),
			cookies: state.cookies,
			hideMessage: true,
		});
		dispatch({
			type: 'LOAD_MYS_STUDENTS',
			data: data.data,
		});
	};
}


