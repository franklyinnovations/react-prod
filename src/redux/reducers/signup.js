import {combineReducers} from 'redux';
import { webUrl } from '../../../api/config';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SHOW_FORGOT_PASSWORD':
			return {};
		case 'SET_ERRORS':
		case 'SET_FORGOT_PASSWORD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultLoginState = {
	email: '',
	password: ''
}

function login(state = defaultLoginState, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultLoginState;
		case 'UPDATE_LOGIN_DATA':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		case 'UPDATE_LOGIN_EMAIL': 
			return {
				...state, 
				email: action.value
			}
		case 'UPDATE_LOGIN_PASSWORD': 
			return {
				...state, 
				password: action.value
			}
		default:
			return state;
	}
}

const defaultSignupState = {
	roleId: '',
	name: '',
	email: '',
	mobile: '',
	password: '',
	user_type: '',
	phone_code: '+91',
	loginUrl: webUrl+'login',
	agreed_to_terms: true
}

function signup(state = defaultSignupState, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultSignupState;
		case 'UPDATE_SIGNUP_DATA':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		case 'UPDATE_SIGNUP_ROLE_DATA':
			let prevState = {...state};
			prevState[action.name] = action.value;
			prevState.user_type = action.user_type;
			return prevState;
		default:
			return state;
	}
}

function forgotPassword(state = null, action){
	switch(action.type) {
		case 'INIT_MODULE':
		case 'FORGOT_PASSWORD_LINK_SENT':
			return null;
		case 'SHOW_FORGOT_PASSWORD':
			return state === null ? {} : null;
		case 'UPDATE_FORGOT_PASSWORD_EMAIL':
			let newState = {...state};
			if(action.name) {
				newState.email = action.value;
			}
			return newState;
		default:
			return state;
	}
}

const defaultHelperState = {
	roles: [],
	country_codes: []
}
function helperData(state = defaultHelperState, action) {
	switch(action.type) {
		case 'SET_SIGNUP_META_DATA':
			return {
				...state,
				roles: action.data.roles,
				country_codes: []
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	login,
	signup,
	errors,
	helperData,
	forgotPassword
});

export default reducer;