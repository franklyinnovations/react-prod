import moment from 'moment';
import csv from 'papaparse';
import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState, messenger} from '../../utils';
export {updateFilter, update} from './index';

const view = 'student';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let [bcsmaps, {data}] = await Promise.all([
			api({
				data: makeApiData(state),
				cookies: state.cookies,
				url: '/admin/utils/allBcsByMasterId',
				hideMessage: true
			}).then(({data}) => data.data.map(item => ({
				value: item.id,
				label: item.board.boarddetails[0].alias 
					+'-'+item.class.classesdetails[0].name
					+'-'+item.section.sectiondetails[0].name
			}))),
			api({
				params: paramsFromState(state, view),
				url: '/admin/student',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId:state.session.selectedSession.id,
					userType: state.session.user_type
				}),
			})
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps,
			data:data,
			stopLoading: true,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_STUDENT_EDIT',
		});
		let [data, states] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/student/add'
			}),
			api({
				data: makeApiData(state, {
					countryId:state.session.userdetails.countryId
				}),
				url: '/admin/state/listByCountryId'
			})
		]);
		dispatch({
			type: 'START_ADD_STUDENT',
			data: data.data,
			states: states.data,
			countryISOCode: state.session.userdetails.countryISOCode,
			countryId: state.session.userdetails.countryId,
		});
	};
}

export function viewList() {
	return {
		type: 'VIEW_STUDENT_LIST'
	};
}

export function save(state, formdata) {
	formdata.append('institute_name', state.session.userdetails.institute_name);
	formdata.append('countryISOCode', state.session.userdetails.countryISOCode);
	formdata.append('loginUrl', window.location.origin+'/login'); 
	formdata.append('studentrecords[academicSessionId]', state.session.selectedSession.id);
	formdata.append('parentId', state.session.id);
	return async dispatch => {
		dispatch({
			type: 'SEND_ADD_STUDENT_REQUEST',
		});
		let {data} = await api({
			data: makeApiData(state, formdata),
			url: '/admin/student/save'
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_STUDENT_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_STUDENT_SAVE_ERRORS',
				errors: {}
			});
		} else if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/student/admission');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_STUDENT_EDIT',
		});
		let {data} = await api({
			data: makeApiData(state, {
				id:itemId,
				academicSessionId: state.session.selectedSession.id,
				userType: state.session.user_type
			}),
			url: '/admin/student/edit',
		});
		if(data.data.same_as_comm_add){
			dispatch({
				type: 'SET_STUDENT_EDIT_DATA',
				data,
				countryISOCode: state.session.userdetails.countryISOCode,
				stopLoading: true,
			});
		} else {
			let [states2, cities2] = await Promise.all([
				api({
					data: makeApiData(state, {
						countryId:data.data.countryId_2
					}),
					url: '/admin/state/listByCountryId'
				}),
				api({
					url: '/admin/city/listByStateId',
					data: makeApiData(state, {
						stateId:data.data.stateId_2
					})
				})
			]);
			data.states2 = states2.data;
			data.cities2 = cities2.data;
			dispatch({
				type: 'SET_STUDENT_EDIT_DATA',
				data,
				countryISOCode: state.session.userdetails.countryISOCode,
			});
		}
	};
}

export function sendLoginInfo(state, itemId) {
	return async dispatch => {
		dispatch({ 
			type: 'SEND_STUDENT_LOGIN_INFO', 
			itemId, 
		}); 
		await api({ 
			url: '/admin/student/send_login_info/' + itemId, 
			data: makeApiData(state, 
				{ 
					resetPassUrl: window.location.origin + '/forgot-password/' 
				}), 
		}); 
		dispatch({ 
			type: 'STUDENT_LOGIN_INFO_SENT', 
			itemId, 
		});
	};
}

export function changeStatus(state, itemId, status) {
	let data = makeApiData(state);
	data.masterId = itemId;
	return async dispatch => {
		dispatch({
			type: 'CHANGE_STUDENT_STATUS',
			itemId,
			status: -1
		});

		await api({
			data: data,
			url: '/admin/student/status/' + itemId + '/' + status
		});
		
		dispatch({
			type: 'CHANGE_STUDENT_STATUS',
			itemId,
			status
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_STUDENT_DATA_VALUE',
		name,
		value
	};
}

export function updateDiscountData(name, value) {
	return {
		type: 'UPDATE_STUDENT_DISCOUNT_DATA_VALUE',
		name,
		value
	};
}

export function updateAvailableState(state, countryId, type) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_AVAILABLE_STATE'+type
		});

		let states = await api({
			data: makeApiData(state, {countryId}),
			url: '/admin/state/listByCountryId'
		});
		
		dispatch({
			type: 'SET_AVAILABLE_STATE'+type,
			states: states.data.data
		});	
	};
}

export function updateAvailableCity(state, stateId, type) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_AVAILABLE_CITY'+type
		});
		let {data} = await api({
			url: '/admin/city/listByStateId',
			data: makeApiData(state, {
				stateId
			})
		});
		
		dispatch({
			type: 'SET_AVAILABLE_CITY'+type,
			data: data.data
		});
	};
}

export function updateAvailableRouteAddress(state, routeId) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_ROUTE_ADDRESS'
		});
		let {data} = await api({
			url: '/admin/route/viewAddress',
			data: makeApiData(state, {
				routeId
			})
		});
		
		dispatch({
			type: 'SET_ROUTE_ADDRESS',
			data: data.data
		});
	};
}

export function notificationModal(modal) {
	return {
		type: 'SHOW_NOTIFICATION_MODAL_STUDENT',
		modal
	};
}

export function closeNotificationModal() {
	return {
		type: 'CLOSE_NOTIFICATION_MODAL_STUDENT'
	};
}

export function submitSendEmail(state, data) {
	data.append('userId', state.session.id);
	return async dispatch => {
		await api({
			url: '/admin/student/sendemail',
			data: makeApiData(state, data)
		});
		
		dispatch({
			type: 'CLOSE_NOTIFICATION_MODAL_STUDENT'
		});
	};
}

export function submitSendSMS(state, data) {
	data.append('userId', state.session.id);
	return async dispatch => {
		await api({
			url: '/admin/student/sendsms',
			data: makeApiData(state, data)
		});
		
		dispatch({
			type: 'CLOSE_NOTIFICATION_MODAL_STUDENT'
		});
	};
}

export function submitDiscount(state, data) {
	data.append('userId', state.session.id);
	return async dispatch => {
		await api({
			url: '/admin/student/applyDiscount',
			data: makeApiData(state, data)
		});
		
		dispatch({
			type: 'CLOSE_NOTIFICATION_MODAL_STUDENT'
		});
	};
}

export function showExportDataModal() {
	return {
		type: 'SHOW_STUDENT_EXPORT_DATA_MODAL',
	};
}

export function hideExportDataModal() {
	return {
		type: 'HIDE_STUDENT_EXPORT_DATA_MODAL',
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function proceedNextStep(state, activateKey, currentKey) {
	return async dispatch => {
		let commonData = {
				countryISOCode: state.session.userdetails.countryISOCode,
				loginUrl: window.location.origin+'/login',
				parentId: state.session.id,
				id:state.item.id,
				academicSessionId: state.session.selectedSession.id,
				userType: state.session.user_type,
				roleId: state.helperData.roleId
			},
			data;
		if(currentKey == 1){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
					enrollment_no: state.item['student[enrollment_no]'],
					form_no: state.item['student[form_no]'],
					fee_receipt_no: state.item['student[fee_receipt_no]'],
					doa: state.item['student[doa]'] ? moment(state.item['student[doa]'], state.session.userdetails.date_format).format('YYYY-MM-DD') : '',
				},
				studentdetails: {
					id: state.item.studentdetailId
				},
				studentrecords: 
				{ 
					id: state.item.studentrecordsId,
					bcsMapId: state.item['studentrecords[bcsMapId]'],
					roll_no: state.item['studentrecords[roll_no]'],
					academicSessionId: state.session.selectedSession.id
				},
				userdetails: {},
			};
		}
		if(currentKey == 2){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
					doa: state.item['student[doa]'] ? moment(state.item['student[doa]'], state.session.userdetails.date_format).format('YYYY-MM-DD') : '',
					gender: state.item['student[gender]'] ? state.item['student[gender]'] : '',
					dob: state.item['student[dob]'] ? moment(state.item['student[dob]'], state.session.userdetails.date_format).format('YYYY-MM-DD') : '',
					countryId: state.item['student[countryId]'] ? state.item['student[countryId]'] : '',
					stateId: state.item['student[stateId]'] ? state.item['student[stateId]'] : '',
					cityId: state.item['student[cityId]'] ? state.item['student[cityId]'] : '',
					zip_code: state.item['student[zip_code]'],
					same_as_comm_add: state.item['student[same_as_comm_add]'] ? state.item['student[same_as_comm_add]'] : undefined,
					countryId_2: state.item['student[countryId_2]'] ? state.item['student[countryId_2]'] : '',
					stateId_2: state.item['student[stateId_2]'] ? state.item['student[countryId_2]'] : '',
					cityId_2: state.item['student[cityId_2]'] ? state.item['student[cityId_2]'] : '',
					zip_code2: state.item['student[zip_code2]'],
				},
				studentdetails: {
					id: state.item.studentdetailId,
					birthplace: state.item['studentdetails[birthplace]'],
					religion: state.item['studentdetails[religion]'],
					nationality: state.item['studentdetails[nationality]'],
					address: state.item['studentdetails[address]'] ? state.item['studentdetails[address]'] : '',
					address_2: state.item['studentdetails[address_2]'] ? state.item['studentdetails[address_2]'] : '',
				},
				studentrecords: {
					id: state.item.studentrecordsId,
				},
				userdetails: {
					fullname: state.item['userdetails[fullname]']
				},
				mobile: state.item.mobile,
				email: state.item.email,
				password: (state.item.id !== '' && state.item.editablePassword || state.item.id === '') ? state.item.password : undefined,
				age: ''
			};
		}
		if(currentKey == 3){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
					father_contact: state.item['student[father_contact]'],
					father_email: state.item['student[father_email]'],
					father_contact_alternate: state.item['student[father_contact_alternate]'],
					mother_email: state.item['student[mother_email]'],
					mother_contact: state.item['student[mother_contact]'],
					mother_contact_alternate: state.item['student[mother_contact_alternate]'],
					guardian_contact: state.item['student[guardian_contact]'],
					guardian_contact_alternate: state.item['student[guardian_contact_alternate]'],
					no_of_brother: state.item['student[no_of_brother]'],
					no_of_sister: state.item['student[no_of_sister]'],
					no_of_brother_in_school: state.item['student[no_of_brother_in_school]'],
					no_of_sister_in_school: state.item['student[no_of_sister_in_school]'],
					rank_in_family: state.item['student[rank_in_family]']
				},
				studentdetails: {
					id: state.item.studentdetailId,
					father_name: state.item['studentdetails[father_name]'],
					father_occupation: state.item['studentdetails[father_occupation]'],
					mother_name: state.item['studentdetails[mother_name]'],
					other_occupation: state.item['studentdetails[mother_occupation]'],
					guardian_name: state.item['studentdetails[guardian_name]'],
					guardian_relationship: state.item['studentdetails[guardian_relationship]'],
					guardian_address: state.item['studentdetails[guardian_address]'],
					standard_of_living: state.item['studentdetails[standard_of_living]']
				},
				studentrecords: {
					id: state.item.studentrecordsId,
				},
				userdetails: {},
				is_supervision: state.item.is_supervision ? '1' : undefined,
			};
		}
		if(currentKey == 4){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
					blood_group: state.item['student[blood_group]'],
					is_health_issue: state.item['student[is_health_issue]'] ? '1' : undefined,
					is_allergies: state.item['student[is_allergies]'] ? '1' : undefined,
					is_medicine: state.item['student[is_medicine]'] ? '1' : undefined,
					is_asthma: state.item['student[is_asthma]'] ? '1' : undefined,
					is_disability: state.item['student[is_disability]'] ? '1' : undefined
				},
				studentdetails: {
					id: state.item.studentdetailId,
					height: state.item['studentdetails[height]'],
					birthmark: state.item['studentdetails[birthmark]'],
					weight: state.item['studentdetails[weight]'],
					health_issue_detail: state.item['studentdetails[health_issue_detail]'],
					allergies_detail: state.item['studentdetails[allergies_detail]'],
					medicine_detail: state.item['studentdetails[medicine_detail]'],
					asthma_detail: state.item['studentdetails[asthma_detail]'],
					disability_detail: state.item['studentdetails[disability_detail]']
				},
				studentrecords: {
					id: state.item.studentrecordsId,
				},
				userdetails: {},
			};
		}
		if(currentKey == 5){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
					res_category: state.item.countryISOCode === 'IN' ? state.item['student[res_category]'] : undefined,
					aadhar: state.item.countryISOCode === 'IN' ? state.item['student[aadhar]'] : undefined,
					residancy_number: state.item.countryISOCode === 'OM' ? state.item['student[residancy_number]'] : undefined,
					rn_issuer: state.item.countryISOCode === 'OM' ? state.item['student[rn_issuer]'] : undefined,
					date_of_release: state.item.countryISOCode === 'OM' ? moment(state.item['student[date_of_release]'], state.session.userdetails.date_format).format('YYYY-MM-DD') : undefined,
					date_of_expiration: state.item.countryISOCode === 'OM' ? moment(state.item['student[date_of_expiration]'], state.session.userdetails.date_format).format('YYYY-MM-DD') : undefined
				},
				studentdetails: {
					id: state.item.studentdetailId,
				},
				studentrecords: {
					id: state.item.studentrecordsId,
				},
				userdetails: {},
				feeDiscountId: state.item['feeDiscountId']
			};
		}
		if(currentKey == 6){
			data = {
				...commonData,
				student: {
					id: state.item.studentId,
				},
				studentdetails: {
					id: state.item.studentdetailId,
					pre_school_name: state.item['studentdetails[pre_school_name]'],
					pre_school_address: state.item['studentdetails[pre_school_address]'],
					pre_qualification: state.item['studentdetails[pre_qualification]']
				},
				studentrecords: {
					id: state.item.studentrecordsId,
				},
				userdetails: {},
			};
		}

		let {data:{errors}} = await api({
			url: '/admin/student/stepValidate',
			data: makeApiData(state, data)
		});
        
		if (errors) {
			return dispatch({
				type: 'SET_STUDENT_SAVE_ERRORS',
				errors: makeErrors(errors)
			});
		} else {
			dispatch({
				type: 'ACTIVATE_TAB',
				activateKey
			});
		}
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_STUDENT_REMOVAL',
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/student/remove'
		});

		if (status)
			state.router.push('/student/admission');

		dispatch({
			type: 'STUDENT_REMOVAL_FAILED',
		});
	};
}

let downloadCsvlink = false;

export function exportData(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_STUDENT_EXPORT_DATA',
		});

		let {data: {students}} = await api({
			url: '/admin/student/export',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				bcsMapId: state.selector.bcsMapId,
			})
		});

		if (students.length === 0) {
			messenger.post({
				type: 'error',
				message: window.__('No record found'),
			});
			dispatch({
				type: 'LOADED_STUDENT_EXPORT_DATA',
			});
			return;
		}

		let __ = window.__,
			fields = [
				__("Enrollment Number"),
				__("Roll Number"),
				__("Admission Date"),
				__("Full Name"),
				__("Gender"),
				__("Mobile Number"),
				__("Email"),
				__("Religion"),
				__("Height"),
				__("Weight"),
				__("Communication Address"),
				__("Permanent Address"),
				__("Birthmark"),
				__("Blood Group"),
				__("Date Of Birth"),
				__("Nationality"),
				__("Place of Birth"),
				__("Father's Name"),
				__("Father's Occupation"),
				__("Father's Email"),
				__("Father's Contact"),
				__("Father's Alternate Contact"),
				__("Mother's Name"),
				__("Mother's Occupation"),
				__("Mother's Email"),
				__("Mother's Contact"),
				__("Mother's Alternate Contact"),
				__("Guardian Name"),
				__("Guardian Relationship"),
				__("Guardian Contact"),
				__("Guardian's Alternate Contact"),
				__("Guardian Address"),
				__("Number of Brothers"),
				__("Number of Sisters"),
				__("Standard of Living"),
				__("Number of Brother in School"),
				__("Number of Sister in School"),
				__("Rank of Student in Family"),
				__("Health issue details"),
				__("Allergy details"),
				__("Medicine details"),
				__("Asthma details"),
				__("Disability details"),
				__("Previous Organization Name"),
				__("Previous Organization Address"),
				__("Previous Qualification"),
			];	
		if (state.session.userdetails.countryISOCode === 'IN')
			fields.push(__('Category'), __('Aadhar No'));

		if (state.session.userdetails.countryISOCode === 'OM'){
			fields.push(
				__('Residency Number'), 
				__('RN Issuer'),
				__('Date Of Release'), 
				__('Date of Expiration'),
			);
		}

		const csvString = csv.unparse({
			fields,
			data: students.map(student => {
				const row = [
					student.enrollment_no,
					student.studentrecord.roll_no || '',
					moment(student.doa).format(state.session.userdetails.date_format) || '',
					student.user.userdetails[0].fullname,
					student.gender,
					student.user.mobile,
					student.user.email,
					student.studentdetails[0].religion || '',
					student.studentdetails[0].height || '',
					student.studentdetails[0].weight || '',
					student.studentdetails[0].address || '',
					(student.same_as_comm_add == 1) ? student.studentdetails[0].address : student.studentdetails[0].address_2,
					student.studentdetails[0].birthmark || '',
					student.blood_group || '',
					moment(student.dob).format(state.session.userdetails.date_format),
					student.studentdetails[0].nationality || '',
					student.studentdetails[0].birthplace || '',
					student.studentdetails[0].father_name || '',
					student.studentdetails[0].father_occupation || '',
					student.father_email || '',
					student.father_contact || '',
					student.father_contact_alternate || '',
					student.studentdetails[0].mother_name || '',
					student.studentdetails[0].mother_occupation || '',
					student.mother_email || '',
					student.mother_contact || '',
					student.mother_contact_alternate || '',
					student.studentdetails[0].guardian_name || '',
					student.studentdetails[0].guardian_relationship || '',
					student.guardian_contact || '',
					student.guardian_contact_alternate || '',
					student.studentdetails[0].guardian_address || '',
					student.no_of_brother || '',
					student.no_of_sister || '',
					student.studentdetails[0].standard_of_living || '',
					student.no_of_brother_in_school || '',
					student.no_of_sister_in_school || '',
					student.rank_in_family || '',
					student.studentdetails[0].health_issue_detail || '',
					student.studentdetails[0].allergies_detail || '',
					student.studentdetails[0].medicine_detail || '',
					student.studentdetails[0].asthma_detail || '',
					student.studentdetails[0].disability_detail || '',
					student.studentdetails[0].pre_school_name || '',
					student.studentdetails[0].pre_school_address || '',
					student.studentdetails[0].pre_qualification || '',
				];
				if (state.session.userdetails.countryISOCode === 'IN')
					row.push(
						student.res_category || '',
						student.aadhar || '',
					);
				if (state.session.userdetails.countryISOCode === 'OM')
					row.push(
						student.residancy_number || '',
						student.rn_issuer || '',
						student.date_of_release ? moment(student.date_of_release).format(state.session.userdetails.date_format) : '',
						student.date_of_expiration ? moment(student.date_of_expiration).format(state.session.userdetails.date_format) : '',
					);
				return row;
			}),
		});

		let a;
		if (downloadCsvlink) {
			a = downloadCsvlink;
		} else {
			a = downloadCsvlink = document.createElement('a');
			a.style.display = 'none';
			document.body.appendChild(a);
			a.download = 'students.csv';
			a.target = '_blank';
		}

		a.href = URL.createObjectURL(
			new Blob(
				[csvString],
				{
					type: 'application/csv'
				}
			)
		);
		a.click();

		dispatch({
			type: 'LOADED_STUDENT_EXPORT_DATA',
		});
	};
}
