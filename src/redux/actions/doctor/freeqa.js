import api, {makeErrors, makeApiData} from '../../../api';

const view = 'freeqa';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view[view].filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/doctor/freeqa',
			cookies: state.cookies,
			data: makeApiData(state, {
				doctorprofileId: state.session.associatedProfileData.id
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			})
		})
	}
}

export function skipQuestion(state, itemId){
	return dispatch => {
		dispatch({
			type: 'REQUEST_FQA_SKIP_QUESTION',
			itemId
		});
		return api({
			url: '/doctor/freeqa/skipquestion',
			data: makeApiData(state, {
				patientquestionId: itemId,
				doctorprofileId: state.session.associatedProfileData.id
			}),
		})
		.then(function ({data}) {
			if(data.status)
				dispatch({
					type: 'FQA_QUESTION_SKIPPED',
					itemId
				})
			else
				dispatch({
					type: 'FQA_QUESTION_SKIPPED_ERROR',
					itemId
				})
		})
	}
}

export function answerNow(state, itemId, answerView=false){
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/freeqa/question',
			data: makeApiData(state, {
				id: itemId,
				doctorprofileId: state.session.associatedProfileData.id
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'FQA_QUESTION_SET_DATA',
				data: data.data,
				answerView,
				stopLoading: true
			})
		})
	}
}

export function saveAnswer(state){
	return dispatch => {
		dispatch({
			type: 'REQUEST_FQA_SAVE_ANSWER'
		});
		return api({
			url: '/doctor/freeqa/saveAnswer',
			data: makeApiData(state, {
				id: state.item.id,
				patientquestionId: state.item.patientquestionId,
				doctorprofileId: state.session.associatedProfileData.id,
				answer: state.item.answer,
				is_for_profile: state.item.is_for_profile ? 1:0
			}),
		})
		.then(function ({data}) {
			if (data.errors) {
				return dispatch({
					type: 'SET_FQA_ERRORS',
					errors: makeErrors(data.errors)
				});
			}
			state.router.push(state.location.pathname);
		})
	}
}

export function reportQuestion(state, type){
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/freeqa/reportQuestion',
			data: makeApiData(state, {
				patientquestionId: state.item.patientquestionId,
				doctorprofileId: state.session.associatedProfileData.id,
				type
			}),
		})
		.then(function ({data}) {
			state.router.push(state.location.pathname);
		})
	}
}