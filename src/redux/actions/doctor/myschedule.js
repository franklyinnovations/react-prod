import api, { makeErrors, makeApiData } from '../../../api';

const view = 'doctor_myschedule';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor_myschedule.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			params,
			url: '/doctor/myschedule',
			cookies: state.cookies,
			data: makeApiData(state, {doctorProfileId: state.session.associatedProfileData.id,languageId:state.session.associatedProfileData.languageId}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			});
		})
	}
}

export function startAdd(state) {

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/doctor/article/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_LIST'
	}
}

export function edit(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/doctor/article/edit/'+itemId
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
	}
}

export function changeStatus(state, id, status) {

	var formData={};
	formData.sid=id;
	formData.status=status;
	formData.langId=state.lang.id;
	formData.userId=state.session.id;
	formData.doctorProfileId=state.session.associatedProfileData.id;

	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/myschedule/status'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.modelData.id) {
			dispatch(init(state));
		} else {
			state.router.push(state.location.pathname);
		}
	});	
}


export function saveNote(state) {

	var formData={};
	formData.sid=state.modelData.model_id;
	formData.suggestion=state.modelData.suggestion;
	formData.langId=state.lang.id;
	formData.userId=state.session.id;
	formData.doctorProfileId=state.session.associatedProfileData.id;
	formData.status = 0;
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/myschedule/status'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});

		var name='isVisibleSug';
		var value=false;
		dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});

		dispatch(init(state));
	});	
}


export function saveBlock(state) {


	var formData={};
	formData.leave_details=state.modelData.leave_details;
	formData.from_date=state.modelData.from_date;
	formData.to_date=state.modelData.to_date;
	formData.langId=state.lang.id;
	formData.doctorProfileId=state.session.id;
	formData.doctorProfileId=state.session.associatedProfileData.id;
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/myschedule/add-block'
	}).then(({data}) => {
		if (!data.status && data.errors){
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		}else{

		var name='isVisibleBlock';
		var value=false;
		dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});

		dispatch(init(state));	

		}
		
	});	
}


export function loadSchedule(state) {

	return dispatch => {
		// dispatch({
		// 	type: 'LOADING_MODULE',
		// 	view
		// });
		var name="isVisibleBlock";
		var value=true;
		return api({
			data: makeApiData(state,{doctorProfileId:state.session.associatedProfileData.id}),
			url: '/doctor/myschedule/get-schedule'
		})
		.then(({data}) => {
			dispatch({
				type: 'UPDATE_DATA_POPUP',
				data
			});
		});
	}
}