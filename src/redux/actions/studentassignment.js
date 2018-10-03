import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter, update} from './index';
import moment from 'moment';

const view = 'studentassignment';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let [{data: bcsmaps}, {data: subjects}, {data}] = await Promise.all([
			api({
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.userdetails.userId,
					user_type: state.session.user_type
				}),
				cookies: state.cookies,
				url: '/admin/assignment/bcsmaps'
			}),
			api({
				url: '/admin/subject/list',
				cookies: state.cookies,
				data: makeApiData(state)
			}),
			api({
				params: paramsFromState(state, view),
				url: '/admin/studentassignment',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					userId: state.session.id,
					userType: state.session.user_type,
					bcsMapId: state.session.userdetails.bcsMapId,
				}),
				hideMessage: true
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: bcsmaps.bcsmaps.data.map(item => ({
				value: item.bcsmap.id, 
				label: bcsName(item.bcsmap),
			})),
			subjects: subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name 
			})),
			data,
		});
	};
}

export function viewData(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ASSIGNMENT_VIEW_DATA',
			view
		});

		let {data} = await api({
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.userdetails.userId,
				user_type: state.session.user_type,
				id:itemId
			}),
			url: '/admin/studentassignment/view'
		});
		data.start_date = moment(data.start_date).format(state.session.userdetails.date_format);
		data.end_date = moment(data.end_date).format(state.session.userdetails.date_format);
		dispatch({
			type: 'SET_ASSIGNMENT_VIEW_DATA',
			data,
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_ASSIGNMENT_DATA_VALUE',
		name,
		value
	};
}
