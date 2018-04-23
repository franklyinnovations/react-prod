import api, {makeErrors, makeApiData} from '../../api';

const view = 'hospital';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.hospital.filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/hospital',
			cookies: state.cookies,
			data: makeApiData(state),
		})
		.then(function ({data}) {
			console.log(data);
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
			url: '/admin/hospital/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD_HOSPITAL',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_HOSPITAL_LIST'
	}
}

export function save(state, datasss) {
	
	let data = makeApiData(
		state,
		datasss
	);
	//if (state.hospital.is_active) data.is_active = 1;
	delete data.lang;
	delete data.langId;
	delete data.languageId;
	delete data.masterId;
	let newdata = {};
	
	return dispatch => api({
		data,
		url: '/admin/hospital/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_HOSPITAL_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			if(state.hospital.id) {
				return dispatch({
					type: 'UPDATE_TAB_KEY',
					key: 'photos_videos'
				});
			} else {
				dispatch(initProfileRelatedData(state, data.data.id, "photos_videos"));
			}
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: []
			});
		}
	});
}

export function saveTime(state, data) {
	
	let value = 1;
	let name = 'show_freeze';

	return dispatch => api({
		data,
		url: '/admin/hospital/save_time'
	})
	.then(({data}) => {

		if (!data.status)
			return dispatch({
				type: 'SET_HOSPITAL_ERRORS',
				errors: makeErrors({})
			});

		if (data.status) {
			return dispatch({
				type: 'UPDATE_DATA_VALUE',
				value,
				name
			});
		}
	});
}

export function addDoctorTime(state, data) {
	
	return dispatch => api({
		data,
		url: '/admin/hospital/save_doctor_time'
	})
	.then(({data}) => {

		if (data.error)
			return dispatch({
				type: 'SET_HOSPITAL_ERRORS',
				errors: data.error
			});
		
		if (data.status) {
			state.router.push('/admin/hospital');
		}
	});
}

export function filterDoctors(data) {

	return dispatch => api({
		data,
		url: '/admin/hospital/filter_doctor'
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
		url: '/admin/hospital/unmapdoc'
	})
	.then((res) => {
		if (res.data.status) {
			props.router.push('/admin/hospital');
		}
	});
}

export function saveImage(state, datasss) {
	let	data = makeApiData(
		state,
		datasss
	);
	delete data.lang;
	delete data.langId;
	delete data.languageId;
	delete data.masterId;

	return dispatch => api({
		data,
		url: '/admin/hospitalfile/save'
	})
	.then(({data}) => {
		if (data.status) {
			dispatch({
				type: 'UPDATE_DOCUMENTS_DATA',
				data: data.data
			});
		} else {
			dispatch({
				type: 'SET_HOSPITAL_ERRORS',
				errors: makeErrors(data.errors)
			});
		}

		// if (data.errors)
		// 	return dispatch({
		// 		type: 'SET_HOSPITAL_ERRORS',
		// 		errors: makeErrors(data.errors)
		// 	});
		// if(data.status) {}
		// if (state.hospital.id) {
		// 	return true;
		// 	//dispatch(init(state));
		// } else {
		// 	//state.router.push('/admin/hospital');
		// }
	});
}
export function saveInformation(state) {
	let langId = state.lang.id;
	//console.log(langId);
	let awardData = state.hospitalAwards;
	let specialIDsss = state.hospital.specialId;
let servicesIDsss = state.hospital.serviceId;
let memberIdssss = state.hospital.memberId;
let insuranceIdssss = state.hospital.insuranceId;
let hospitalId = state.hospital.id;
let data=[];
var z=0;
		for(var i=0;i<servicesIDsss.length;i++){
			data[z]={tagId:servicesIDsss[i],hospitalId:hospitalId,tagtypeId:1};
			z++;
		}
		for(var j=0;j<specialIDsss.length;j++){
			data[z]={tagId:specialIDsss[j],hospitalId:hospitalId,tagtypeId:2};
			z++;
		}
		for(var j=0;j<memberIdssss.length;j++){
			data[z]={tagId:memberIdssss[j],hospitalId:hospitalId,tagtypeId:12};
			z++;
		}
		for(var j=0;j<insuranceIdssss.length;j++){
			data[z]={tagId:insuranceIdssss[j],hospitalId:hospitalId,tagtypeId:11};
			z++;
		}
	data = {
		data,
		langId,
		awardData,
		hospitalId
		};

	return dispatch => api({
		data,
		url: '/admin/hospitalservice/save'
	})
	.then(({data}) => {
		if (data.errors){
			return dispatch({
				type: 'SET_HOSPITAL_ERRORS',
				errors: makeErrors(data.errors)
			});
		}else{
			return dispatch({
				type: 'UPDATE_TAB_KEY',
				key: 'hospital_timings'
			});
		}
	});
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
			url: '/admin/hospital/edit/'+itemId
		})
		.then(({data}) => {

			dispatch({
				type: 'SET_HOSPITAL_EDIT_DATA',
				data,
				stopLoading: true
			});

			dispatch({
				type: 'SET_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
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
			view
		});

		return api({
			data: data,
			url: '/admin/hospital/edit/'+itemId
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
			url: '/admin/hospital/status/' + itemId + '/' + status
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
export function addMoreAward(state) {
	return {
		type: 'ADD_MORE_AWARD',
		hospitalId: state.hospital.id
	}
}
export function changeOpen24X7(state,status) {
	let itemId=state.hospital.id;

	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state),
			url: '/admin/hospital/shiftstatus/' + itemId + '/' + status
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

export function manage_freeze(state, status, flag) {
	let itemId = state.hospital.id;

	const value = 'is_freeze';

	return dispatch => {
		return api({
			data: makeApiData(state),
			url: '/admin/hospital/managefreeze/' + itemId + '/' + status
		})
		.then(({data}) => {
				   
				if(flag === undefined) { 
                    let value = 1;
                    let name = 'is_freeze';
                    
                    if(data.status) { 
							dispatch({
								type: 'UPDATE_DATA_VALUE',
								value,
								name
							});
					}
				}
		});
	}
}

export function manage_unfreeze(state, status, flag) {
	let itemId = state.hospital.id;

	const value = 'is_freeze';

	return dispatch => {
		return api({
			data: makeApiData(state),
			url: '/admin/hospital/managefreeze/' + itemId + '/' + status
		})
		.then(({data}) => {
		});
	}
}

export function changeStatusDocument(state, itemId, status, itemType) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_DOCUMENT_STATUS',
			itemId,
			status: -1,
			itemType
		});

		return api({
			data: makeApiData(state),
			url: '/admin/hospitalfile/status/' + itemId + '/' + status
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
export function stateOnChange(state,value){
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

export function updateLatLng(state, lat, lng, address) {
	return {
		type: 'UPDATE_LAT_LNG',
		lat: lat,
		lng: lng,
		address: address
	}
}

export function viewClaimRequestDetail(state, hospitalId) {
	let data = makeApiData(state, {keyId: hospitalId, model: 'hospital'})	
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
	let data = makeApiData(state, {keyId: state.claimRequestDetail.data.keyId, userId: state.claimRequestDetail.data.user.id, status: actionType, model: 'hospital'})
	
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
			url: '/admin/hospital/verifystatus'
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

export function addMoreEmailMobile(state, type) {
	return {
		type: 'ADD_MORE_EMAIL_MOBILE',
		dataType: type,
		id: state.hospital.id
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