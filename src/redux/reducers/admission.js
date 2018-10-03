import {combineReducers} from 'redux';

function session(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.parent;
		case 'ADMISSION_OTP_VERIFIED':
			return action.parent;
		default:
			return state;
	}
}

function academicsession(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.academicsession;
		default:
			return state;
	}
}

function viewState(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				otpState: 'getting-mobile',
				tab: 'get-otp',
				otp: '',
				mobile: '',
				canResendOtp: false,
			};
		case 'CHANGE_ADMISSION_TAB':
			return {
				...state,
				tab: action.tab,
				canResendOtp: false,
			};
		case 'UPDATE_ADMISSION_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SEND_ADMISSION_OTP_REQUEST':
			return {
				...state,
				otpState: 'sending-otp',
			};
		case 'ADMISSION_OTP_SENT':
			return {
				...state,
				otpState: 'otp-sent',
				tab: 'verify-otp',
				otp: '',
				canResendOtp: true,
			};
		case 'ADMISSION_OTP_SENDING_ERROR':
			return {
				...state,
				otpState: 'getting-mobile',
			};
		case 'SEND_ADMISSION_OTP_RESEND_REQUEST':
			return {
				...state,
				otpState: 'sending-otp',
			};
		case 'ADMISSION_OTP_RESENT':
			return {
				...state,
				otpState: 'otp-sent',
			};
		case 'SEND_ADMISSION_OTP_VERIFY_REQUEST':
			return {
				...state,
				otpState: 'verifying-otp',
			};
		case 'ADMISSION_OTP_VERIFIED':
			return {

			};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SEND_ADMISSION_OTP_REQUEST':
			return {};
		case 'SET_ADMISSION_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

export default combineReducers({
	session,
	academicsession,
	viewState,
	errors,
});