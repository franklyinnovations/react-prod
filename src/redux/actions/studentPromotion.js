import api, {makeApiData} from '../../api';
import {bcsName} from '../../utils';
export {update} from './index';

export const view = 'studentPromotion';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		let helperData = state.view && state.view[view] && state.view[view].helperData,
			bcsmaps = helperData && helperData.bcsmaps,
			nextAcademicSession = helperData && helperData.nextAcademicSession;

		if (!bcsmaps) {
			bcsmaps = api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
			})
				.then(({data}) => data.data.map(
					item => ({
						value: item.id,
						label: bcsName(item)
					})
				));
		}

		if (!nextAcademicSession) {
			nextAcademicSession = api({
				url: '/admin/utils/getNextAcademicSession',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionsEndDate: state.session.selectedSession.end_date,
				}),
			})
				.then(({data}) => data.data)
		}

		[bcsmaps, nextAcademicSession] = await Promise.all([bcsmaps, nextAcademicSession]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps,
			nextAcademicSession,
			stopLoading: true,
		});
	};
}

export function loadStudents(state, bcsMapId) {
	return async dispatch => {
		let {fullname, enrollment_no} = state.selector;
		fullname = fullname.toLowerCase();
		enrollment_no = enrollment_no.toLowerCase();

		let data, bcsmaps;
		if (state.helperData.bcsMapId !== bcsMapId) {
			dispatch({
				type: 'LOADING_SP_DATA',
			});
			let response = await api({
				url: '/admin/student/classStudent',
				data: makeApiData(state, {
					bcsMapId,
					academicSessionId: state.session.selectedSession.id,
				})
			});
			data = response.data.data;
			//bcsmaps = state.helperData.bcsmaps.filter(bcsmap => bcsmap.value !== bcsMapId);
			bcsmaps = state.helperData.bcsmaps;
		} else {
			data = [...state.students];
			bcsmaps = state.helperData.bcsmaps;
		}

		data.forEach(item => {
			item._fullname = item.student.user.userdetails[0].fullname.toLowerCase();
			item._enrollment_no = item.student.enrollment_no.toLowerCase();
			item.selected = false;
			item.visible = getStudentVisibilty(item, fullname, enrollment_no);
		});

		dispatch({
			type: 'SET_SP_STUDENTS',
			data,
			bcsmaps,
			bcsMapId,
		});
	};
}

function getStudentVisibilty(item, fullname, enrollment_no) {
	return item._fullname.indexOf(fullname) !== -1
		&& item._enrollment_no.indexOf(enrollment_no) !== -1;
}

export function studentSelection(index) {
	return {
		type: 'CHANGE_SP_SELECTION',
		index,
	};
}

export function promote(state, ids) {
	return async dispatch => {
		dispatch({
			type: 'SEND_SP_REQUEST',
		});
		await api({
			url: '/admin/student/promoted',
			data: makeApiData(state, {
				ids,
				currentbcsMapId: state.helperData.bcsMapId,
				promotedbcsMapId: state.selector.toBcsMapId,
				promotedAcademicSession: state.helperData.nextAcademicSession.id,
				currentAcademicSessionId: state.session.selectedSession.id,
			})
		});
		state.router.push(state.router.location);
	};
}