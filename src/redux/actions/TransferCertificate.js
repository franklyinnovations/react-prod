import moment from 'moment';
import api, {makeApiData} from '../../api';
import {bcsName, TAG_TYPE_CONDUCT, TAG_TYPE_RESULT} from '../../utils';

const view = 'transcertfkt';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data: {data}} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/utils/allBcsByMasterId',
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: data.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function errors(errors) {
	return {
		type: 'SET_IMPORT_STUDENT_SAVE_ERRORS',
		errors,
	};
}

export function getStudents(state, name, value) {
	return async dispatch => {
		dispatch({
			type: 'UPDATE_TC_DATA_VALUE',
			name,
			value
		});
		if(value && name === 'bcsmapId'){
			let {data} = await api({
				url: '/admin/transcertfkt/getStudents',
				data: makeApiData(state, {
					bcsmapId: value,
					academicSessionId: state.session.selectedSession.id
				}),
			});
			dispatch({
				type: 'SET_TC_STUDENT',
				data: data.data,
			});
		}
	};
}

export function getStudentsDetails(state) {
	let ids = [];
	state.item.data.forEach(item => {
		if(item.selected){
			ids.push(item.student.id);
		}
	});
	return async dispatch => {
		dispatch({type: 'START_TC_EDIT'});
		let [data, {data: {data: conducts}}, {data: {data: results}}] =  await Promise.all([
			api({
				url: '/admin/transcertfkt/getSelectedStudents',
				data: makeApiData(state, {
					studentIds: ids,
					bcsmapId: state.item.bcsmapId,
					academicSessionId: state.session.selectedSession.id
				}),
			}),
			api({
				url: '/admin/tag/list',
				data: makeApiData(state, {
					type: TAG_TYPE_CONDUCT,
				})
			}),
			api({
				url: '/admin/tag/list',
				data: makeApiData(state, {
					type: TAG_TYPE_RESULT,
				})
			}),
		]);
		let conductOptions = [], resultOptions = [], students = data.data.data;
		for (let i = conducts.length - 1; i >= 0; i--) {
			if (conductOptions.indexOf(conducts[i].tagdetails[0].title) === -1)
				conductOptions.push(conducts[i].tagdetails[0].title);
		}

		for (let i = students.length - 1; i >= 0; i--) {
			if (conductOptions.indexOf(students[i].conduct) === -1 && students[i].conduct != null)
				conductOptions.push(students[i].conduct);
		}

		for (let i = results.length - 1; i >= 0; i--) {
			if (resultOptions.indexOf(results[i].tagdetails[0].title) === -1)
				resultOptions.push(results[i].tagdetails[0].title);
		}

		for (let i = students.length - 1; i >= 0; i--) {
			if (resultOptions.indexOf(students[i].result) === -1 && students[i].result != null)
				resultOptions.push(students[i].result);
		}

		dispatch({
			type: 'SET_SELECTED_TC_STUDENT',
			data: students,
			institutedata: data.data.instituteData,
			classdata: data.data.classData,
			signaturedata: data.data.signatureData,
			academicname: state.session.selectedSession.academicsessiondetails[0].name,
			conducts: conductOptions.map(conduct => ({value: conduct, label: conduct})),
			results: resultOptions.map(result => ({value: result, label: result})),
		});
	};
}

export function printTC(state, url) {
	return async () => {
		let tcData = [];
		state.item.data.forEach(item => {
			tcData.push({
				bcsmapId:state.item.bcsmapId,
				studentId: item.student.id,
				releaving_date: moment(item.releaving_date, state.session.userdetails.date_format).format('YYYY-MM-DD'),
				conduct: item.conduct,
				result: item.result,
				academicsessionId: state.session.selectedSession.id,
				masterId:state.session.masterId,
			});
		});

		await api({
			url: '/admin/transcertfkt/savetc',
			data: makeApiData(state, {
				tcData
			}),
		});

		openTcUrl(url, {
			students: state.item.data.map(student => ({
				...student,
				releaving_date: moment(student.releaving_date, state.session.userdetails.date_format).format('YYYY-MM-DD'),
			})),
			institute: state.item.institutedata,
			classdata: state.item.classdata,
			signaturedata: state.item.signaturedata,
			academicname: state.item.academicname,
			servicePath: state.session.servicePath,
		});
	};
}

let tcForm = false;
function openTcUrl(url, data) {
	let form;
	if (tcForm) {
		form = tcForm;
	} else {
		tcForm = form = document.createElement('form');
		tcForm.style.display = 'none';
		tcForm.setAttribute('method', 'post');
		tcForm.setAttribute('target', '_blank');
		document.body.appendChild(tcForm);
		let input = document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'data');
		tcForm.appendChild(input);
	}
	form.setAttribute('action', url);
	form.querySelector('input').value = JSON.stringify(data);
	form.submit();
}

export function viewTC(state, url, studentId) {
	return async () => {
		let {data} = await api({
			url: '/admin/transcertfkt/getSelectedStudents',
			data: makeApiData(state, {
				studentIds: [studentId],
				bcsmapId: state.item.bcsmapId,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		
		openTcUrl(url, {
			students: data.data,
			institute: data.instituteData,
			classdata: data.classData,
			signaturedata: data.signatureData || {},
			academicname: state.session.selectedSession.academicsessiondetails[0].name,
			servicePath: state.session.servicePath,
		});
	};
}

export function showUploadSignatureModal(state) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_SIGNATURE_MODEL'
		});
		let {data: {data}} = await api({
			data: makeApiData(state, {
				academicsessionId: state.session.selectedSession.id,
				module: 'tc'
			}),
			url: '/admin/signature/tc-signatures'
		});
		return dispatch({
			type: 'SHOW_UPLOAD_SIGNATURE_DATA_MODAL',
			data,
		});
	};
}

export function hideUploadSignatureModal() {
	return {
		type: 'HIDE_UPLOAD_SIGNATURE_DATA_MODAL',
	};
}

export function uploadSignature(state, formData) {
	return async dispatch => {
		dispatch({type: 'UPLOADING_TC_SINGATURE'});
		formData.append('module', 'tc');
		formData.append('academicsessionId', state.session.selectedSession.id);
		await api({
			url: '/admin/signature/save-tc-signatures',
			data: makeApiData(state, formData),
		});
		dispatch({
			type: 'HIDE_UPLOAD_SIGNATURE_DATA_MODAL',
		});
	};
}

export function showStudentDetailModal(state, studentId) {
	return async dispatch => {
		dispatch({type: 'LOAD_STUDENTDETAIL_MODEL'});
		let {data} = await api({
			data: makeApiData(state, {
				id: studentId,
				academicsessionId: state.session.selectedSession.id,
				userType: state.session.user_type
			}),
			url: '/admin/transcertfkt/studentDetail'
		});
		dispatch({
			type: 'SHOW_UPLOAD_STUDENTDETAIL_DATA_MODAL',
			data
		});
	};
}

export function hideStudentDetailModal() {
	return {
		type: 'HIDE_UPLOAD_STUDENTDETAIL_DATA_MODAL',
	};
}



