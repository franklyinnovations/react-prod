import api, {makeApiData} from '../../api';
import {bcsName} from '../../utils';
import moment from 'moment';
export {update} from './index';

const view = 'studentTransfer';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let bcsmaps = state.view && state.view[view] && state.view[view].helperData
			&& state.view[view].helperData.bcsmaps;
		if (!bcsmaps) {
			let {data} = await api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
			});
			bcsmaps = data.data.map(item => ({
				value: item.id,
				label: bcsName(item)
			}));
		}
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps,
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
				type: 'LOADING_ST_DATA',
			});
			let response = await api({
				url: '/admin/student/classStudentForTransfer',
				data: makeApiData(state, {
					bcsMapId,
					academicSessionId: state.session.selectedSession.id,
				})
			});
			data = response.data.data;
			bcsmaps = state.helperData.bcsmaps.filter(bcsmap => bcsmap.value !== bcsMapId);
		} else {
			data = [...state.students];
			bcsmaps = state.helperData.toBcsmaps;
		}

		data.forEach(item => {
			item._fullname = item.student.user.userdetails[0].fullname.toLowerCase();
			item._enrollment_no = item.student.enrollment_no.toLowerCase();
			item.selected = false;
			item.visible = getStudentVisibilty(item, fullname, enrollment_no);
		});

		dispatch({
			type: 'SET_ST_STUDENTS',
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
		type: 'CHANGE_ST_SELECTION',
		index,
	};
}

export function transfer(state, ids) {
	return async dispatch => {
		dispatch({
			type: 'SEND_ST_REQUEST',
		});
		await api({
			url: '/admin/student/transferred',
			data: makeApiData(state, {
				ids,
				currentbcsMapId: state.helperData.bcsMapId,
				transferredbcsMapId: state.selector.toBcsMapId,
				transferred_date: moment().format('YYYY/MM/DD'),
				currentAcademicSessionId: state.session.selectedSession.id,
				transerred_effective_from: moment(state.selector.transerred_effective_from, state.session.userdetails.date_format).format('YYYY/MM/DD'),
			})
		});
		state.router.push(state.router.location);
	};
}