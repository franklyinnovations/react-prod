import api, { makeErrors, makeApiData } from '../../../api';

const view = 'doctor_clinic_feedback';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor_clinic_feedback.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/doctor/feedback/dohfeedback',
			cookies: state.cookies,
			data: makeApiData(state, {doctorProfileId: state.session.associatedProfileData.id}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				doctorProfileId: state.session.associatedProfileData.id,
				stopLoading: true
			})
		})
	}
}

export function changeProfile(state, name, value, model) {
	let data = {
		[model === 'doctorprofile' ? 'doctorProfileId' : 'hospitalId']: value
	}
	return dispatch => {
		dispatch({
			type: 'UPDATE_PROFILE_STATE',
			value: value,
			name: model === 'doctorprofile' ? 'doctorProfileId' : 'hospitalId'
		});
		return api({
			params: {},
			url: '/doctor/feedback/dohfeedback',
			data: makeApiData(state, {where: data}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'VIEW_LIST',
				view,
				data
			})
		})
	}
}

export function filterData(state, page) {
	let data = {
		where: {[state.profileChangeState.name === 'doctorprofile' ? 'doctorProfileId' : 'hospitalId']: state.profileChangeState.value},
		filterObj: state.filter
	}
	page !== undefined && (data['page'] = parseInt(page));
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/feedback/dohfeedback',
			data: makeApiData(state, data),
		})
		.then(function ({data}) {
			dispatch({
				type: 'VIEW_LIST',
				data,
				stopLoading: true
			})
		})
	}
	
}