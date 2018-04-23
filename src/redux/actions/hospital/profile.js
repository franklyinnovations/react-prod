import api, {makeErrors, makeApiData} from '../../../api';

const view = 'hospital_profile';

export function init(state) {
	let data = makeApiData(state, {userId: state.session.id})

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/hospital/check-profile',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id, associatedProfileData: state.session.associatedProfileData}),
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

export function updateProfileSearchData(name, value) {
	return {
		type: 'UPDATE_PROFILE_SEARCH_DATA',
		name: name,
		value: value
	}
}

export function getProfilesToClaim(state, formData) {
	let data = makeApiData(state, formData)
	
	return dispatch => {
		dispatch({
			type: 'INIT_LOADING',
		});
		return api({
			data,
			url: "/hospital/get-profiles"
		})
		.then(({data}) => {
			if(data.status) {
				if(data.data.length === 0)
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
		url: '/hospital/new-profile'
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
export function saveBasicInfo(state, formData, nextTabKey) {
	formData.append('userId', state.session.id)
	formData.append('id', state.basicDetails.id)
	formData.append('is_active', 1);
	formData.append('contact_informations', JSON.stringify(state.contactInformations))
	if(state.basicDetails.id == "") formData.append('claim_status', 'user-created') 
	
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
					return dispatch({
						type: 'INIT_PROFILE_RELATED_DATA',
		            	tabKey: nextTabKey,
		            	data: data.data
					})
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

export function edit(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/hospital/check-profile',
			data: makeApiData(state, {userId: state.session.id, associatedProfileData: state.session.associatedProfileData}),
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
			url: '/hospitalfile/status/' + itemId + '/' + status
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

export function unmapdoc(props, data) {

	return dispatch => api({
		data,
		url: '/hospital/unmapdoc'
	})
	.then((res) => {
		dispatch({
			type: 'UPDATE_DATA_VALUE',
			data,
			value
		});
	});
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

export function back_to_profile_view(state) {
	let data = makeApiData(state, {userId: state.session.id})

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/hospital/check-profile',
			cookies: state.cookies,
			data: makeApiData(state, {userId: state.session.id, associatedProfileData: state.session.associatedProfileData}),
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


export function sendClaimRequest(state, hospitalId) {
	
	let data = makeApiData(state, {hospitalId: hospitalId, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/hospital/send-claim-request'
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

export function cancelClaimRequest(state) {
	
	let data = makeApiData(state, {hospitalId: state.profileSearchHelperData.requested_claimed_profile_detail.id, userId: state.session.id});
	
	return dispatch => api({
		data,
		url: '/hospital/cancel-claim-request'
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

export function viewHospitalProfile(state, id) {	
	let data = makeApiData(state, {id: id});
	
	return dispatch => api({
		data,
		url: '/hospital/view-hospital-info'
	})
	.then(({data}) => {
		if(data) {
			dispatch({
				type: 'VIEW_HOSPITAL_PROFILE',
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