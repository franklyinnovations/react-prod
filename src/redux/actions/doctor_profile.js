import api, {makeErrors, makeApiData} from '../../api';

const view = 'doctor_profile';

export function init(state) {
	let data = makeApiData(state, {userId: state.session.id})

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			url: '/doctor/check-profile',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id}),
		})
		.then(function ({data}) {
			if(data.isClaimed) {
				dispatch({
					type: 'SET_PROFILE_VIEW',
					view,
					data: data,
					stopLoading: true
				})	
			} else if(!data.is_any_claim_request_pending) {
				dispatch({
					type: 'INIT_WELCOME_SCREEN',
					view,
					data: data,
					stopLoading: true
				})
			} else {
				dispatch({
					type: 'INIT_SEARCH_MODULE',
					view,
					data: data,
					stopLoading: true
				})
			}
		})
	}
}

export function edit(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/check-profile',
			data: makeApiData(state, {userId: state.session.id}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'SET_EDIT_PROFILE_VIEW',
				view,
				data: data,
				stopLoading: true
			})
		})
	}
}

export function getProfilesToClaim(state, formData) {

	let data = makeApiData(state, formData)
	data.language = state.lang
	
	return dispatch => {
		dispatch({
			type: 'INIT_LOADING',
		});
		return api({
			data,
			url: "/doctor/get-profiles"
		})
		.then(({data}) => {
			if(data.status) {
				if(data.filtered_doctor_list.length === 0)
					dispatch(createNewProfile(state))
				else
					return dispatch({
						type: 'SHOW_SEARCHED_PROFILES',
						data: data
					});
			} else {
				return dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
			}
		})
	}
}

export function createNewProfile(state) {
	let data = makeApiData(
		state, {userId: state.session.id}
	);
	return dispatch => api({
		data,
		url: '/doctor/new-profile'
	})
	.then(({data}) => {
		return dispatch({
			type: 'INIT_NEW_PROFILE_CREATION',
			data: data
		});
	})
}

export function getSearchProfileView() {
	return dispatch => api({
		data: {},
		url: '/doctor/meta-data-for-search'
	})
	.then(({data}) => {
		return dispatch({
			type: 'INIT_SEARCH_MODULE',
			data: data
		});
	});
}
export function updateProfileSearchData(name, value) {
	return {
		type: 'UPDATE_PROFILE_SEARCH_DATA',
		name: name,
		value: value
	}
}

export function getStates(state, value) {
	let data = makeApiData(
		state, {countryId: value}
	);
	return dispatch => api({
		data,
		url: '/admin/state/listByCountryId'
	})
	.then(({data}) => {
		return dispatch({
			type: 'SET_STATES',
			data: data.data
		});
	})
}

export function getCities(state, value) {
	let data = makeApiData(
		state, {stateId: value}
	);
	return dispatch => api({
		data,
		url: '/admin/city/listByStateId'
	})
	.then(({data}) => {
		return dispatch({
			type: 'SET_CITIES',
			data: data.data
		});
	})
}

export function saveBasicInfo(state, formData, nextTabKey) {
	formData.append('userId', state.session.id)
	formData.append('id', state.basicDetails.id)
	formData.append('doctor_profile_details', JSON.stringify({name: state.basicDetails.name, about_doctor: state.basicDetails.about_doctor, address_line_1: state.basicDetails.address_line_1}))
	formData.append('contact_informations', JSON.stringify(state.contactInformations))
	if(state.basicDetails.id == "") formData.append('claim_status', 'user-created');
	formData.append('is_active', 1);
	
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/save-basic-info'
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

export function saveEduSpecInfo(state, formData, nextTabKey) {
	formData.append('id', state.basicDetails.id)
	formData.append('doctorEducations', JSON.stringify(state.educations))
	let specializations = setTagsData(state.additionalInfo.specializations, state.helperData.specialization_tags, state.basicDetails.id)
	formData.delete('tagtypeId'); formData.delete('college_name'); formData.delete('year_of_passing');

	let data = makeApiData(state, formData);

	formData.append('doctor_tags', JSON.stringify(specializations))

	return dispatch => api({
		data,
		url: '/doctor/save-edu-spec-info'
	})
	.then(({data}) => {
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
	});
}
export function saveRegistrationInfo(state, formData, nextTabKey) {
	formData.append('id', state.basicDetails.id)
	formData.append('doctorRegistrations', JSON.stringify(state.registrations))
	formData.delete('council_registration_number'); formData.delete('council_name'); formData.delete('year_of_registration');

	let data = makeApiData(state, formData);

	return dispatch => api({
		data,
		url: '/doctor/save-registrations-info'
	})
	.then(({data}) => {
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
	});
}
export function saveExpInfo(state, formData, nextTabKey) {
	formData.append('id', state.basicDetails.id)
	formData.append('doctorExperiences', JSON.stringify(state.experiences))
	let services = setTagsData(state.additionalInfo.services, state.helperData.service_tags, state.basicDetails.id)
	formData.delete('services'); formData.delete('clinic_hospital_name'); formData.delete('designation'); formData.delete('city_name'); formData.delete('duration_from'); formData.delete('duration_to');

	let data = makeApiData(state, formData);

	formData.append('doctor_tags', JSON.stringify(services))

	return dispatch => api({
		data,
		url: '/doctor/save-serv-exp-info'
	})
	.then(({data}) => {
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
	});
}
export function saveAwdMemInfo(state, formData, nextTabKey) {
	let getData = {}
	getData.id = state.basicDetails.id;
	getData.doctorAwards = state.awards;
	let memberships = setTagsData(state.additionalInfo.memberships, state.helperData.membership_tags, state.basicDetails.id)
	getData.doctor_tags = memberships;

	let data = makeApiData(state, getData);

	return dispatch => api({
		data,
		url: '/doctor/save-award-memberships-info'
	})
	.then(({data}) => {
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
	});
}

export function saveImage(state, datasss) {
	datasss.append('langId', state.lang.id)
	let	data = makeApiData(
		state,
		datasss
	);
	return dispatch => api({
		data,
		url: '/doctorfile/save'
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
export function changeDocumentStatus(state, itemId, status, itemType) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_DOCUMENT_STATUS',
			itemId,
			status: -1,
			itemType
		});

		return api({
			data: makeApiData(state),
			url: '/doctorfile/status/' + itemId + '/' + status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_DOCUMENT_STATUS',
				itemId,
				status,
				itemType
			});
		});
	}
}


export function sendClaimRequest(state, doctorProfileId) {
	
	let data = makeApiData(state, {doctorProfileId: doctorProfileId, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/doctor/send-claim-request'
	})
	.then(({data}) => {
		if(data.status) {
			dispatch({
				type: 'CLAIM_REQUEST_SENT',
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
export function cancelClaimRequest(state) {
	
	let data = makeApiData(state, {doctorProfileId: state.profileSearchHelperData.requested_claimed_profile_detail.id, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/doctor/cancel-claim-request'
	})
	.then(({data}) => {
		if(data.status) {
			dispatch({
				type: 'CLAIM_REQUEST_CANCEL'
			})
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

function setTagsData(values, state, doctorProfileId) {
	let setData = [];
	for(var i = 0; i < values.length; i++) {
		setData.push({tagId: values[i].value, tagtypeId: values[i].tagtypeId, doctorProfileId: doctorProfileId})
	}
	return setData;
}

export function back_to_profile_view(state) {
	let data = makeApiData(state, {userId: state.session.id})

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/doctor/check-profile',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id}),
		})
		.then(function ({data}) {
			if(data.isClaimed) {
				dispatch({
					type: 'SET_PROFILE_VIEW',
					view,
					data: data,
					stopLoading: true
				})
			} else {
				dispatch({
					type: 'INIT_SEARCH_MODULE',
					view,
					data: data,
					stopLoading: true
				})
			}
		})
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
		// if (data.status) {
		// 	return dispatch({
		// 		type: 'SET_FILTER_HOSPITAL_ARR_FRONT',
		// 		data
		// 	});
		// } else if(data.filtered_hospital_list.length === 0) {
		// 	return dispatch({
		// 		type: 'RESET_FILTER_FILTER_HOSPITALS_DATA'
		// 	});
		// }
	});
}

export function addDoctorTime(state, data) {

	let dataObj = makeApiData(state, data);
	
	return dispatch => api({
		data,
		url: '/doctor/save_doctor_time_front'
	})
	.then((res) => {
		const { data } = res;
		if (!data.status)
			return dispatch({
				type: 'SET_ERRORS',
				errors: data.error
			});
		if (data.status) {
			state.router.push('/doctor/profile');
		}
	});
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

export function link_to_hospital_comp(props) {
	let data = makeApiData(
		props, {userId: props.session.id}
	);

	return dispatch => {
		return api({
			data: data,
			url: '/doctor/link_to_hospital_comp/'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_HOSPITAL_ON_DOCTOR',
				data
			});
		});
	}
}

export function createNewClinicProfile(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			url: '/doctor/create-clinic-profile',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'SET_CLINIC_PROFILE_CREATION_VIEW',
				view,
				data: data,
				stopLoading: true
			})	
		})
	}
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

export function cancelClinicClaimRequest(state, id) {	
	let data = makeApiData(state, {hospitalId: id, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/hospital/cancel-claim-request'
	})
	.then(({data}) => {
		if(data.status) {
			dispatch({
				type: 'CANCEL_CLINIC_CLAIM_REQUEST'
			})
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

export function viewDoctorProfile(state, id) {	
	let data = makeApiData(state, {id: id});
	
	return dispatch => api({
		data,
		url: '/doctor/view-doctor-info'
	})
	.then(({data}) => {
		if(data) {
			dispatch({
				type: 'VIEW_DOCTOR_PROFILE',
				data
			})
		} else {
			dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
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