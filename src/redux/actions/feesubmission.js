import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {dialog, bcsName} from '../../utils';

const view = 'feesubmission';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let {data: {data: bcsmaps}} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/utils/allBcsByMasterId',
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function loadStudents(state, bcsmapId) {
	if (bcsmapId === null) return {type: 'RESET_FSM_CLASS'};
	return async dispatch => {
		dispatch({type: 'LOADING_FSM_STUDENTS', bcsmapId});
		let {data: {data}} = await api({
			url: '/admin/feesubmission/students',
			data: makeApiData(state, {
				bcsmapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'LOAD_FSM_STUDENTS',
			data: data.map(studentrecord => ({
				value: studentrecord.student.enrollment_no,
				label: studentrecord.student.user.userdetails[0].fullname,
			})),
		});
	};
}

export function loadFeeAllocations(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_FSM_FEE_ALLOCATIONS'});
		let {data: {status, feeallocations, feesubmissionrecords, studentId}} = await api({
			url: '/admin/feesubmission/fee-allocations',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				enrollment_no: state.selector.studentId || state.selector.enrollment_no,
			}),
		});

		if (status === false) {
			dispatch({
				type: 'LOAD_FSM_FEE_ALLOCATIONS',
				data: false,
			});
			return;
		}

		let data = [];
		for (let i = 0; i < feeallocations.length; i++) {
			let feeallocation = feeallocations[i];
			feeallocation.selected = false;
			feeallocation.feesubmissionrecord = feesubmissionrecords.find(feesubmissionrecord =>
				feesubmissionrecord.feeheadId === feeallocation.feeheadId &&
				feesubmissionrecord.installment === feeallocation.installment
			);
			if (feeallocation.feesubmissionrecord) {
				feeallocation.feesubmissionrecord.selected = true;
			}
			data.push(feeallocation);
		}
		feesubmissionrecords.forEach(feesubmissionrecord => {
			if (feesubmissionrecord.selected) return;
			data.push({
				feesubmissionrecord,
				feehead: feesubmissionrecord.feehead,
				installment: feesubmissionrecord.installment,
			});
		});
		dispatch({
			type: 'LOAD_FSM_FEE_ALLOCATIONS',
			data,
			studentId,
		});
	};
}

export function pay(state, challan) {
	return async dispatch => {
		dispatch({type: 'SEND_FSM_PAY_REQUEST'});
		let feesubmission = {
			studentId: state.selector.student,
			academicSessionId: state.session.selectedSession.id,
			feesubmissionrecords: state.fees.feesubmissionrecords,
			date: moment(
				state.selector.payment_date,
				state.session.userdetails.date_format,
			).format('YYYY-MM-DD'),
		};
		if (challan) {
			feesubmission.mode = 3;
			feesubmission.approved = 0;
		} else {
			feesubmission.bank = state.payment.bank;
			feesubmission.cheque = state.payment.cheque;
			feesubmission.remarks = state.payment.remarks;
			feesubmission.discount_type =  state.payment.discount_type === -1 
				? null : state.payment.discount_type;
			feesubmission.discount_value = (
					feesubmission.discount_type === null ||
					feesubmission.discount_type === -1 ) ? null :
					state.payment.discount_value;
			feesubmission.mode = state.payment.mode === null ? '' : state.payment.mode;
		}
		let {data} = await api({
			url: '/admin/feesubmission/pay',
			data: makeApiData(state, feesubmission)
		});
		if (data.errors) {
			dispatch({
				type: 'UPDATE_FSM_PAYMENT',
				name: 'errors',
				value: makeErrors(data.errors),
			});
		} else {
			dispatch(loadFeeAllocations(state));
		}
	};
}

export async function sendInvoice(state, feesubmissionId, error = '', value = '') {
	dialog.prompt({
		placeholder: window.__('Email'),
		input: '<div class="has-error"><input type="text" name="email" value="'+value+'"/><div class="help-block">' + error + '</div></div>',
		message: window.__('Send Invoice'),
		callback: (email => {
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (email === false) {
				return;
			} else if (email.trim().length === 0) {
				sendInvoice(state, feesubmissionId, window.__('This is a required field.'), email);
			} else if (!re.test(email)) {
				sendInvoice(state, feesubmissionId, window.__('Invalid Email.'), email);
			} else {
				api({
					url: '/admin/feesubmission/send-invoice',
					data: makeApiData(state, {
						email,
						feesubmissionId,
						academicSessionId: state.session.selectedSession.id,
					}),
				});
			}
		}),
	});
}