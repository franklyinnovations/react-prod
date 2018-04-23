import api, { makeErrors, makeApiData } from '../../api';

const view = 'doctor';

export function init(state) {
	let	params = {
		...state.location.query
	};


	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.doctor.filter);

	
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/doctor',
			cookies: state.cookies,
			data: makeApiData(state),
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

export function startAdd(state) {

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/admin/doctor/add'
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

export function saveBasicInfo(state, formData) {
	formData.append('id', state.doctorBasicDetails.id)
	formData.append('latitude', state.doctorBasicDetails.latitude)
	formData.append('longitude', state.doctorBasicDetails.longitude)
	formData.append('doctor_profile_details', JSON.stringify({name: state.doctorBasicDetails.name, about_doctor: state.doctorBasicDetails.about_doctor, address_line_1: state.doctorBasicDetails.address_line_1}))
	formData.append('contact_informations', JSON.stringify(state.contactInformations))
	formData.delete('is_active');
	
	let data = makeApiData(state, formData);
	
	if (state.doctorBasicDetails.is_active) formData.append('is_active', 1);

	return dispatch => api({
		data,
		url: '/admin/doctor/save-basic-info'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			if(state.doctorBasicDetails.id) {
				return dispatch({
					type: 'UPDATE_TAB_KEY',
					key: 'photos_videos'
				});
			} else {
				dispatch(initProfileRelatedData(state, data.data.id, 'photos_videos'));
			}
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});	
}

export function saveAdditionalInfo(state, formData) {
	formData.append('doctorEducations', JSON.stringify(state.doctorEducations))
	formData.append('doctorExperiences', JSON.stringify(state.doctorExperiences))
	formData.append('doctorRegistrations', JSON.stringify(state.doctorRegistrations))
	formData.append('doctorAwards', JSON.stringify(state.doctorAwards))

	formData.append('id', state.doctorBasicDetails.id)

	formData.delete('college_name'); formData.delete('year_of_passing'); formData.delete('clinic_hospital_name'); formData.delete('designation'); formData.delete('city_name'); 
	formData.delete('duration_from'); formData.delete('duration_to'); formData.delete('council_registration_number'); formData.delete('council_name'); formData.delete('year_of_registration'); 
	formData.delete('award_gratitude_title'); formData.delete('tagtypeId'); formData.delete('award_year');
	formData.delete('specializations'); formData.delete('services'); formData.delete('memberships');

	let specializations = setTagsData(state.doctorAdditionalInfo.specializations, state.helperData.specialization_tags, state.doctorBasicDetails.id)
	let services = setTagsData(state.doctorAdditionalInfo.services, state.helperData.service_tags, state.doctorBasicDetails.id)
	let memberships = setTagsData(state.doctorAdditionalInfo.memberships, state.helperData.membership_tags, state.doctorBasicDetails.id)
	let doctor_tags = (specializations.concat(services)).concat(memberships);

	formData.append('doctor_tags', JSON.stringify(doctor_tags))

	let data = makeApiData(state, formData);

	return dispatch => api({
		data,
		url: '/admin/doctor/save-additional-info'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			return dispatch({
				type: 'UPDATE_TAB_KEY',
				key: 'add_clinic'
			});
			//dispatch(edit(state, state.doctorBasicDetails.id));
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});	
}

function setTagsData(values, state, doctorProfileId) {
	
	let setData = [];
	for(var i = 0; i <= values.length; i++) {
		state.filter((item) => {
			if(item.value === values[i]) {
				setData.push({tagId: values[i], tagtypeId: item.tagtypeId, doctorProfileId: doctorProfileId})
			}
		})
	}
	return setData;
}

export function link_to_hospital_comp(props) {
	
	let data = makeApiData(
		props,
	);

	return dispatch => {
		return api({
			data: data,
			url: '/admin/doctor/link_to_hospital_comp/'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_HOSPITAL_ON_DOCTOR',
				data
			});
		});
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
			url: '/admin/doctor/edit/'+itemId
		}).then(({data}) => {
			dispatch({
				type: 'SET_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
	}
}

export function editNew(state, itemId) {
	let data = makeApiData(state, { id: itemId} );

		return dispatch => {
			dispatch({
				type: 'LOADING_MODULE',
				view
			});

			return Promise.all([
				api({
					data: data, url: '/admin/doctor/edit/'+itemId
				})
			]).then((data, additionalInfo, helperData) => {

			})
		}
}

export function initProfileRelatedData(state, itemId, tabKey) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			type: 'RESET_FILTERS',
			view
		});

		return api({
			data: data,
			url: '/admin/doctor/edit/'+itemId
		})
		.then(({data}) => {
			dispatch({
				type: 'INIT_PROFILE_RELATED_DATA',
				data,
				key: tabKey,
				stopLoading: true
			});
		});
	}
}

export function changeStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/doctor/status/'+itemId+'/'+status
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status
			});
		});
	}
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
			url: '/admin/doctorfile/status/' + itemId + '/' + status
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
export function countryOnChange(state,value){
    return dispatch => {
    return api({
			data: {countryId:value},
			url: '/admin/state/listByCountryId'
		})
		.then(({data}) => {
                    data.countryId = value;
			dispatch({
				type: 'STATE_LIST_BY_COUNTY_ID',
                                state,
				data
			});
		});
            }
}
export function stateOnChange(state, value){
    return dispatch => {
    return api({
			data: {stateId:value},
			url: '/admin/city/listByStateId'
		})
		.then(({data}) => {
                    data.stateId = value;
			dispatch({
				type: 'CITY_LIST_BY_STATE_ID',
                                state,
				data
			});
		});
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

export function addEducation(state) {
	return {
		type: 'ADD_EDUCATIONS',
		tagtypeId: state.doctor.education_tagtypeId,
		college_name: state.doctor.college_name,
		year_of_passing: state.doctor.year_of_passing
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
		url: '/admin/doctorfile/save'
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

export function updateLatLng(state, lat, lng, address) {
	return {
		type: 'UPDATE_LAT_LNG',
		lat: lat,
		lng: lng,
		address: address
	}
}

export function filterHospitals(data) {

	return dispatch => api({
		data,
		url: '/admin/doctor/filter_hospital'
	})
	.then((res) => {
		const { data } = res;
		if (data.status) {
			return dispatch({
				type: 'SET_FILTER_HOSPITAL_ARR',
				data
			});
		} else if(data.filtered_hospital_list.length === 0) {
			return dispatch({
				type: 'RESET_FILTER_FILTER_HOSPITALS_DATA'
			});
		}
	});
}


export function viewClaimRequestDetail(state, doctorProfileId) {
	let data = makeApiData(state, {keyId: doctorProfileId, model: 'doctorprofile'})
	
	return dispatch => {
		dispatch({
			type: 'INIT_CLAIM_REQUEST_DETAIL_LOADING',
		});
		return api({
			data,
			url: "/admin/claimrequest/view-sent-detail"
		})
		.then(({data}) => {
			if(data.status)
				return dispatch({
					type: 'SET_CLAIMED_REQUEST_DETAIL',
					data: data.data
				});
			else 
				return dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
		})
	}
}

export function handleClaimRequest(state, actionType) {
	let data = makeApiData(state, {keyId: state.claimRequestDetail.data.keyId, userId: state.claimRequestDetail.data.user.id, status: actionType, model: 'doctorprofile'})
	
	return dispatch => {
		return api({
			data,
			url: "/admin/claimrequest/change"
		})
		.then(({data}) => {
			if(data.status)
				return dispatch({
					type: 'CLAIM_REQUESTED_UPDATED',
					dataId: state.claimRequestDetail.data.keyId,
					status: actionType
				});
			else 
				return dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
		})
	}
}

export function verifystatus(state, id) {
	return dispatch => {
    	return api({
			data: {id: id},
			url: '/admin/doctor/verifystatus'
		}).then(({data}) => {
   			if(data.status)
				return dispatch({
					type: 'UPDATE_VERIFY_LIVE_STATUS',
					dataId: id
				});
			else 
				return dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
		});
    }
}

export function handleIsLiveStatus(state, id, status) {
	return dispatch => {
    	return api({
			data: {id: id, status: status},
			url: '/admin/doctor/livestatus'
		}).then(({data}) => {
   			if(data.status)
				return dispatch({
					type: 'UPDATE_VERIFY_STATUS',
					dataId: id
				});
			else 
				return dispatch({
					type: 'SET_ERRORS',
					errors: []
				});
		});
    }
}

export function linkClinicTime(state, data) {
	
	return dispatch => api({
		data,
		url: '/admin/doctor/link_doctor_time'
	})
	.then(({data}) => {
		
		if (!data.status)
			return dispatch({
				type: 'SET_DOCTOR_ERRORS',
				errors: data.error
			});
		
		if (data.status) {
			dispatch({
				type: 'SET_DOCTOR_ERRORS',
				errors: []
			});
			state.router.push('/admin/doctors');
		}
	});
}

export function addMoreEmailMobile(state, type) {
	return {
		type: 'ADD_MORE_EMAIL_MOBILE',
		dataType: type,
		id: state.doctorBasicDetails.id
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

export function updateTabKey(key) {
	return {
		type: 'UPDATE_TAB_KEY',
		key: key
	}
}

export function addMoreAdditionalInfo(state, actionType) {
	return {
		type: actionType,
		doctorProfileId: state.doctorBasicDetails.id
	}
}