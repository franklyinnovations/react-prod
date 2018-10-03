import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';

const view = 'profile';

export function init(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE', view,});
		let {data: {data}} = await api({
			url: '/admin/profile2',
			cookies: state.cookies,
			data: makeApiData(state, {
				id: state.session.id,
				user_type: state.session.user_type,
			}),
		});
		let experiences, qualifications, digests = [];
		if (data.teacher) {
			experiences = data.teacher.teacherdetails[0].experiences;
			qualifications = data.teacher.teacherdetails[0].qualifications;
			experiences = experiences ? JSON.parse(experiences) : [];
			qualifications = qualifications ? JSON.parse(qualifications) : [];
			experiences.forEach(item => {
				if (item.start) item.start = moment(item.start, 'YYYY-MM-DD').format(
					state.session.userdetails.date_format
				);
				if (item.end) item.end = moment(item.end, 'YYYY-MM-DD').format(
					state.session.userdetails.date_format
				);
			});
		}
		const intervals = data.digests.reduce(
			((digests, {model, interval}) => (digests[model] = interval, digests)), {}
		);

		digests.push(
			{
				model: 'assignment',
				label: 'Assignment',
				interval: intervals.assignment || 0,
			},
			{
				model: 'studentleave',
				label: 'Student Leave',
				interval: intervals.studentleave || 0,
			}
		);

		if (state.session.user_type === 'teacher') {
			digests.push(
				{
					model: 'todo',
					label: 'To Do',
					interval: intervals.todo || 0,
				},
				{
					model: 'timetable',
					label: 'Scheduled Classes',
					interval: intervals.timetable || 0,
				},
			);
		} else {
			digests.push(
				{
					model: 'empleave',
					label: 'Employee Leave',
					interval: intervals.empleave || 0,
				},
				{
					model: 'feesubmission',
					label: 'Fee Submission',
					interval: intervals.feesubmission || 0
				},
			);
		}


		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			digests,
			teacher: !data.teacher ? {} : {
				experiences,
				qualifications,
				gender: data.teacher.gender,
				dob: data.teacher.dob && moment(data.teacher.dob, 'YYYY-MM-DD').format(
					state.session.userdetails.date_format
				),
				join_date: data.teacher.join_date && moment(data.teacher.join_date, 'YYYY-MM-DD')
					.format(
						state.session.userdetails.date_format
					),
				marital_status: data.teacher.marital_status,
				address: {
					cityId: data.teacher.cityId,
					stateId: data.teacher.stateId,
					countryId: data.teacher.countryId,
					address: data.teacher.teacherdetails[0].address,
				},
			},
			institute: data.user_type !== 'institute' ? {} : {
				pan_no: data.institute.pan_no,
				bank_name: data.institute.bank_name,
				ifsc_code: data.institute.ifsc_code,
				account_no: data.institute.account_no,
				date_format: data.institute.date_format,
				bank_branch: data.institute.bank_branch,
				tagline: data.institute.institutedetails[0].tagline,
				min_admission_years: data.institute.min_admission_years,
				min_admission_months: data.institute.min_admission_months,
				bank_challan_charges: data.institute.bank_challan_charges,
				attendance_type: data.institute.attendance_type,
				attendance_access: data.institute.attendance_access,
			},
		});
	};
}

export function changePassword() {
	return async (dispatch, getState) => {
		let state = getState();
		let {
			password,
			curr_password,
			confirm_password,
		} = state.view.state.password;
		dispatch({type: 'PROFILE_START_CHANGE_PASSWORD'});
		let {data} = await api({
			url: '/admin/profile/changePassword',
			data: makeApiData(state, {
				password,
				curr_password,
				confirm_password,
				id: state.session.id,
			})
		});
		if (data.errors) {
			dispatch({
				type: 'SET_PROFILE_PASSWORD_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({type: 'PROFILE_PASSWORD_CHANGED'});
		}
	};
}

export function changeUsername() {
	return async (dispatch, getState) => {
		let state = getState();
		let {curr_password, user_name} = state.view.state.username;
		dispatch({type: 'PROFILE_START_CHANGE_USERNAME'});
		let {data} = await api({
			url: '/admin/profile/changeUsername',
			data: makeApiData(state, {
				user_name,
				curr_password,
				id: state.session.id,
			})
		});
		if (data.errors) {
			dispatch({
				type: 'SET_PROFILE_USERNAME_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({type: 'PROFILE_USERNAME_CHANGED'});
		}
	};
}

export function changeDefaults() {
	return async (dispatch, getState) => {
		let
			state = getState(),
			{default_lang, defaultSessionId} = state.view.state.defaults;
		dispatch({type: 'PROFILE_START_CHANGE_DEFAULTS'});
		await api({
			url: '/admin/profile/changeDefaults',
			data: makeApiData(state, {
				default_lang,
				defaultSessionId,
				id: state.session.id,
			}),
		});
		dispatch({type: 'PROFILE_DEFAULTS_CHANGED', defaults: state.view.state.defaults});
	};
}

export function changeBank(state) {
	return async dispatch => {
		let {default_lang, defaultSessionId} = state.item;
		dispatch({
			type: 'PROFILE_START_CHANGE_DEFAULTS',
		});
		await api({
			url: '/admin/profile/changeBankDetails',
			data: makeApiData(state, {
				default_lang,
				defaultSessionId,
				id: state.session.id,
				'institute[bank_name]':state.item['institute[bank_name]'],
				'institute[ifsc_code]':state.item['institute[ifsc_code]'],
				'institute[bank_branch]':state.item['institute[bank_branch]'],
				'institute[account_no]':state.item['institute[account_no]'],
				'institute[pan_no]':state.item['institute[pan_no]'],
				'institute[bank_challan_charges]':state.item['institute[bank_challan_charges]']
			})
		});
		dispatch({
			type: 'PROFILE_DEFAULTS_CHANGED',
		});
	};
}

export function saveUserProfile(formData) {
	return async (dispatch, getState) => {
		let state = getState();
		formData.append('user_type', state.session.user_type);
		let {data} = await api({
			url: '/admin/profile2/save-user',
			data: makeApiData(state, formData),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_PROFILE_USER_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({
				type: 'PROFILE_USER_CHANGED',
				data: data.data,
			});
		}
	};
}

export function saveTeacherProfile(formData) {
	return async (dispatch, getState) => {
		let state = getState();
		let {data} = await api({
			url: '/admin/profile2/save-teacher',
			data: makeApiData(state, formData),
		});
		if (data.errors) {
			dispatch({
				type: 'SET_PROFILE_TEACHER_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({
				type: 'PROFILE_TEACHER_CHANGED',
				data: data.data,
			});
		}
	};
}

export function saveInsituteProfile(formData) {
	return async (dispatch, getState) => {
		let state = getState();
		let {data} = await api({
			data: makeApiData(state, formData),
			url: '/admin/profile2/save-institute',
		});
		if (data.errors) {
			dispatch({
				type: 'SET_PROFILE_INSTITUTE_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({
				type: 'PROFILE_INSTITUTE_CHANGED',
				data: data.data,
			});
		}
	};
}

export function saveDigests() {
	return async (dispatch, getState) => {
		let state = getState();
		dispatch({type: 'SAVING_DIGESTS'});
		await api({
			data: makeApiData(state, {
				digests: state.view.state.digests.items,
			}),
			url: '/admin/profile2/save-digests',
		});
		dispatch({type: 'SAVED_DIGESTS'});
	};
}