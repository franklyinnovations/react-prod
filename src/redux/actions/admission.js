import api from '../../api';
import Redirect from '../../Redirect';
import moment from 'moment';

const view = 'admission';

export function init(state, {academicSessionId}) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let {data} = await api({
			url: '/admission/',
			data: {
				academicSessionId,
			},
			cookies: state.cookies,
		});

		if (data.status) {
			data.academicsession.min_admission_date =
				moment(data.academicsession.min_admission_date).format('YYYY-MM-DD');
			data.academicsession.max_admission_date =
				moment(data.academicsession.max_admission_date).format('YYYY-MM-DD');
			dispatch({
				type: 'INIT_MODULE',
				data,
				stopLoading: true,
			});
		} else if (data.code === 'ACADEMIC_SESSION_NOT_FOUND') {
			throw new Redirect('/404');
		} else if (data.code === 'INVALID_URL_OF_SESSION') {
			throw new Redirect('/admission_logout');
		}
	};
}

export function selectTab(tab) {
	return {
		type: 'CHANGE_ADMISSION_TAB',
		tab,
	}
}

export function setErrors(errors) {
	return {
		type: 'SET_ADMISSION_ERRORS',
		errors,
	}
}

export function sendOtp() {
	return async (dispatch, getState) => {
		dispatch({
			type: 'SEND_ADMISSION_OTP_REQUEST',
		});

		let {
			viewState: {mobile},
			academicsession: {masterId},
		} = getState().view.admission;

		let {data} = await api({
			url: '/admission/send-otp',
			data: {
				mobile,
				masterId,
			},
		});

		if (data.status) {
			dispatch({
				type: 'ADMISSION_OTP_SENT',
			});
		} else {
			dispatch({
				type: 'ADMISSION_OTP_SENDING_ERROR',
			});
		}
	};
}

export function resendOtp() {
	return async (dispatch, getState) => {
		dispatch({
			type: 'SEND_ADMISSION_OTP_RESEND_REQUEST',
		});

		let {
			viewState: {mobile},
			academicsession: {masterId},
		} = getState().view.admission;

		let {data} = await api({
			url: '/admission/resend-otp',
			data: {
				mobile,
				masterId,
			},
		});

		if (data.status) {
			dispatch({
				type: 'ADMISSION_OTP_RESENT',
			});
		} else {
			dispatch({
				type: 'ADMISSION_OTP_RESENDING_ERROR',
			});
		}
	};
}

export function verifyOtp() {
	return async (dispatch, getState) => {
		dispatch({
			type: 'SEND_ADMISSION_OTP_VERIFY_REQUEST',
		});

		let {
			viewState: {mobile, otp},
			academicsession: {masterId},
		} = getState().view.admission;

		let {data} = await api({
			url: '/admission/verify-otp',
			data: {
				otp,
				mobile,
				masterId,
			},
			hideMessage: true,
		});

		if (data.status) {
			dispatch({
				type: 'ADMISSION_OTP_VERIFIED',
				parent: data.parent,
			});
		} else {
			dispatch({
				type: 'SET_ADMISSION_ERRORS',
				errors: {otp: data.message}
			});
		}
	};
}