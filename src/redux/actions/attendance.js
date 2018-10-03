import api, {makeApiData} from '../../api';

const view = 'attendance';

export function init(state, params) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE', view});

		let [date, bcsMapId, period, subjectId] = params.token.split(',');

		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/attendance/getClassStudents',
			data: makeApiData(state, {
				date,
				period,
				bcsMapId,
				subjectId,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		if (data.holiday) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				holiday: data.holiday_data,
			});
			return;
		}

		data.students.forEach(item => {
			item.hide = false;
			if (item.student.attendancerecord) {
				item.tags = item.student.attendancerecord.tags;
				item.is_present = item.student.attendancerecord.is_present;
			} else {
				item.tags = '';
				item.is_present = 1;
			}
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			tags: data.tagsData,
			students: data.students,
			attendance: {
				date,
				period,
				bcsMapId,
				subjectId,
				id: data.attendanceId || '',
			},
		});
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({type: 'SAVING_ATT'});
		formData.append('userId', state.session.userdetails.userId);
		formData.append('academicSessionId', state.session.selectedSession.id);
		await api({
			cookies: state.cookies,
			url: '/admin/attendance/savenew',
			data: makeApiData(state, formData),
		});
		dispatch({type: 'SAVED_ATT'});
	};
}
