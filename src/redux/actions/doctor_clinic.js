import api, {makeErrors, makeApiData} from '../../api';
const view = 'doctor_clinic';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor_clinic.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/doctor/my-clinics',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id}),
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

export function doctorAddNewClinic(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/clinic-add',
			data: makeApiData(state, {userId: state.session.id}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'ADD_PROFILE_VIEW',
				view,
				data: data,
				stopLoading: true
			})
		})
	}
}

export function searchClinic(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			data: makeApiData(state, {}),
			url: '/doctor/link_to_hospital_comp/'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_HOSPITAL_SEARCH_DATA',
				data,
				stopLoading: true
			});
		});
	}
}

export function filterHospitalsFront(state, data) {
	return dispatch => api({
		data: makeApiData(state, data),
		url: '/doctor/filter_hospital'
	})
	.then((res) => {
		const { data } = res;
		return dispatch({
			type: 'SET_FILTER_HOSPITAL_ARR_FRONT',
			data
		});
	});
}

export function edit(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return Promise.all([
			api({
				data: makeApiData(state, {id: itemId}),
				url: '/hospital/getEditMetaData'
			}),
			api({
				url: '/hospital/edit-profile/'+itemId,
				data: makeApiData(state, {})
			})
		]).then(([helperData, data]) => {
			dispatch({
				type: 'EDIT_PROFILE_VIEW',
				helperData: helperData.data,
				data:data.data,
				stopLoading: true
			});
		});
	}
}

export function addMoreAward(state) {
	return {
		type: 'ADD_MORE_AWARD',
		hospitalId: state.basicDetails.id
	}
}

export function saveImage(state, datasss) {
	let	data = makeApiData(
		state,
		datasss
	);
	return dispatch => api({
		data,
		url: '/hospitalfile/save'
	})
	.then(({data}) => {
		if (data.status) {
			dispatch({
				type: 'UPDATE_DOCUMENTS_DATA',
				data: data.data
			});
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

export function saveBasicInfo(state, formData, nextTabKey) {
	formData.append('userId', state.session.id)
	formData.append('id', state.basicDetails.id)
	formData.append('is_active', 1);
	formData.append('contact_informations', JSON.stringify(state.contactInformations))
	
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/hospital/save-basic-info'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			if(state.basicDetails.id != "") {
				return dispatch({
					type: 'UPDATE_TAB',
	            	tabKey: nextTabKey
				})
			} else {
				return dispatch({
					type: 'INIT_PROFILE_RELATED_DATA',
	            	tabKey: nextTabKey,
	            	data: data.data
				})
			}
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});	
}

export function saveSpecServInfo(state, formData, nextTabKey) {
	let specializations = setTagsData(state.additionalInfo.specializations, state.helperData.specialization_tags, state.basicDetails.id)
	let services = setTagsData(state.additionalInfo.services, state.helperData.service_tags, state.basicDetails.id)
	let tags = specializations.concat(services)

	let data = makeApiData(state, {tags: tags, id: state.basicDetails.id});

	return dispatch => api({
		data,
		url: '/hospitalservice/save-spec-service-info'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			return dispatch({
				type: 'UPDATE_TAB',
            	tabKey: nextTabKey
			})
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	})
}

export function saveAwardMembershipsInfo(state, formData, nextTabKey) {
	let memberships = setTagsData(state.additionalInfo.memberships, state.helperData.membership_tags, state.basicDetails.id)
	let awards = state.awards;
	let tags = memberships;

	let data = makeApiData(state, {tags: tags, id: state.basicDetails.id, awards: awards});

	return dispatch => api({
		data,
		url: '/hospitalservice/save-award-memb-info'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			return dispatch({
				type: 'UPDATE_TAB',
            	tabKey: nextTabKey
			})
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	})
}

export function saveInsuranceCompanies(state, formData, nextTabKey) {
	let insurance_tags = setTagsData(state.additionalInfo.insurance_companies, state.helperData.insurance_companies_tags, state.basicDetails.id)
	let tags = insurance_tags;

	let data = makeApiData(state, {tags: tags, id: state.basicDetails.id});

	return dispatch => api({
		data,
		url: '/hospitalservice/save-insurance-comp-info'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			return dispatch({
				type: 'UPDATE_TAB',
            	tabKey: nextTabKey
			})
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	})
}

export function saveShifTiming(state, formData, nextTabKey) {
	let data = makeApiData(state, {
		timings: formData, 
		shift_24X7 : state.basicDetails.shift_24X7, 
		is_hosp : true,
		hospitalId : state.basicDetails.id, 
	});

	return dispatch => api({
		data,
		url: '/hospital/save-time'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			return dispatch({
				type: 'UPDATE_DATA_VALUE',
				value: 1,
				name: 'show_freeze'
			});
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	})
}

export function filterDoctors(data) {

	return dispatch => api({
		data,
		url: '/hospital/filter_doctor'
	})
	.then((res) => {
		if (res.data.status) {
			return dispatch({
				type: 'SET_FILTER_DOCTOR_ARR',
				res
			});
		}
	});
}

export function unmapdoc(props, data) {

	return dispatch => api({
		data,
		url: '/hospital/unmapdoc'
	})
	.then((res) => {
		if (res.data.status) {
			props.router.push('/admin/hospital');
		}
	});
}

export function addDoctorTime(state, data) {
	
	return dispatch => api({
		data,
		url: '/hospital/save_doctor_time'
	})
	.then(({data}) => {

		if (data.error)
			return dispatch({
				type: 'SET_ERRORS',
				errors: data.error
			});
		
		if (data.status) {
			dispatch(init(state));
			// return dispatch({
			// 	type: 'CLOSE_DOC_TIMING_MODAL',
			// 	errors: data.error
			// });
		
		}
	});
}

export function changeOpen24X7(state,status) {
	let itemId=state.basicDetails.id;

	return dispatch => {
		return api({
			data: makeApiData(state),
			url: '/hospital/shiftstatus/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_SHIFT_STATUS',
				itemId,
				status
			});
		});
	}
}

export function cancelClaimRequest(state, id) {	
	let data = makeApiData(state, {hospitalId: id, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/hospital/cancel-claim-request'
	})
	.then(({data}) => {
		if(data.status) {
			dispatch({
				type: 'HOSPITAL_CLAIM_REQUEST_CANCEL'
			})
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

function setTagsData(values, state, hosiptalId) {
	let setData = [];
	for(var i = 0; i < values.length; i++) {
		setData.push({tagId: values[i].value, tagtypeId: values[i].tagtypeId, hospitalId: hosiptalId})
	}
	return setData;
}

export function sendClaimForClinic(state, hospitalId) {
	
	let data = makeApiData(state, {hospitalId: hospitalId, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/hospital/send-claim-request'
	})
	.then(({data}) => {
		if(data.status) {
			dispatch({
				type: 'SET_CLAIMED_PROFILE',
				data: data.data
			})
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

export function manage_freeze(state,status) {
	let itemId=state.basicDetails.id;
	const value = 'is_freeze';

	return dispatch => {
		return api({
			data: makeApiData(state),
			url: '/hospital/managefreeze/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'UPDATE_DATA_VALUE',
				name: 'is_freeze',
				value: status
			});
		});
	}
}














