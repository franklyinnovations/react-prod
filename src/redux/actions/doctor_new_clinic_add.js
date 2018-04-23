import api, {makeErrors, makeApiData} from '../../api';
const view = 'doctor_new_clinic_add';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor_new_clinic_add.filter);
	

	let data = makeApiData(
		state, {userId: state.session.id}
	);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/hospital/new-profile',
			cookies: state.cookies,
			data: data,
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data: data,
				stopLoading: true
			});
		})
	}
}

export function saveBasicInfo(state, formData, nextTabKey) {
	formData.append('userId', state.session.id)
	formData.append('id', state.basicDetails.id)
	formData.append('is_active', 1);
	formData.append('contact_informations', JSON.stringify(state.contactInformations))
	if(state.basicDetails.id == "") formData.append('claim_status', 'user-created') 
	
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/hospital/create-by-doctor'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		
		if(data.status) {
			let setHospitalData = {
				id: data.data.id, 
				claim_status: data.data.claim_status, 
				is_active: data.data.is_active, 
				is_complete: data.data.is_complete, 
				is_live: data.data.is_live, 
				verified_status: data.data.verified_status,
				hospitaldetails: [
					{
						hospital_name: data.data.hospital_detail.hospital_name
					}
				]
			}
			let session = {...state.session};
			let prevAllHospitalProfiles = [...session.allHospitalProfiles];
			prevAllHospitalProfiles.push(setHospitalData)
			if (state.session.allHospitalProfiles.length === 0 && data.allHospitalProfiles !== undefined)
				session.allHospitalProfiles = setHospitalData;
			session.allHospitalProfiles = prevAllHospitalProfiles;

			api({
				url: '/session',
				data: session
			})
			.then(() => {
				dispatch({
					type: 'SET_SESSION_HOSPITAL_PROFILES',
					data: session.allHospitalProfiles
				});
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
			})
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


function setTagsData(values, state, hosiptalId) {
	let setData = [];
	for(var i = 0; i < values.length; i++) {
		setData.push({tagId: values[i].value, tagtypeId: values[i].tagtypeId, hospitalId: hosiptalId})
	}
	return setData;
}

export function addMoreEmailMobile(state, type) {
	return {
		type: 'ADD_MORE_EMAIL_MOBILE',
		dataType: type,
		id: state.basicDetails.id
	}
}
export function updateEmailMobile(state, dataType, index, name, value) {
	return {
		type: 'UPDATE_EMAIL_MOBILE',
		dataType: dataType,
		index: index,
		name: name,
		value: value
	}
}
export function removeEmailMobile(state, dataType, index) {
	return {
		type: 'REMOVE_EMAIL_MOBILE',
		dataType: dataType,
		index: index
	}
}
export function addMoreAward(state) {
	return {
		type: 'ADD_MORE_AWARD',
		hospitalId: state.basicDetails.id
	}
}

export function saveImage(state, datasss) {
	datasss.append('langId', state.lang.id)
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
				value
			});
		});
	}
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

export function customTagAdd(state, tagvalue, tagtypeId) {
	let data = makeApiData(state, {userId: state.session.id, tagdetail: {title: tagvalue}, tagtypeId: tagtypeId, is_active: 1});
	return dispatch => {
		dispatch({
			type: 'TAG_LOADING',
			tagtypeId: tagtypeId
		});

		return api({
			data,
			url: '/admin/tag/addByUser'
		}).then(({data}) => {
			if(data.status) {
				dispatch({
					type: 'TAG_CREATED',
					data: data.data
				})
			} else {
				dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
			}
		})
	}
}