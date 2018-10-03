import {combineReducers} from 'redux';

function user (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				errors: {},
				saving: false,
				email: action.data.email,
				mobile: action.data.mobile,
				signature: action.data.signature,
				user_type: action.data.user_type,
				user_image: action.data.user_image,
				fullname: action.data.userdetails[0].fullname,
			};
		case 'PROFILE_USER_CHANGED':
			return {
				...state,
				...action.data,
				errors: {},
				saving: false,
			};
		case 'UPDATE_PROFILE_USER_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SET_PROFILE_USER_ERRORS':
			return {...state, saving: false, errors: action.errors};
		case 'PROFILE_START_CHANGE_USER':
			return {...state, saving: true};
		default:
			return state;
	}
}

function password (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'PROFILE_PASSWORD_CHANGED':
			return {
				errors: {},
				saving: false,
				password: '',
				curr_password: '',
				confirm_password: '',
			};
		case 'UPDATE_PROFILE_PASSWORD_DATA':
			return {...state, [action.name]: action.value};
		case 'PROFILE_START_CHANGE_PASSWORD':
			return {...state, saving: true};
		case 'SET_PROFILE_PASSWORD_ERRORS':
			return {...state, saving: false, errors: action.errors};
		default:
			return state;
	}
}

function username (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'PROFILE_USERNAME_CHANGED':
			return {
				errors: {},
				saving: false,
				user_name: '',
				curr_password: '',
			};
		case 'UPDATE_PROFILE_USERNAME_DATA':
			return {...state, [action.name]: action.value};
		case 'PROFILE_START_CHANGE_USERNAME':
			return {...state, saving: true};
		case 'SET_PROFILE_USERNAME_ERRORS':
			return {...state, saving: false, errors: action.errors};
		default:
			return state;
	}
}

function defaults (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				errors: {},
				saving: false,
				default_lang: action.data.default_lang,
				defaultSessionId: action.data.defaultSessionId,
			};
		case 'PROFILE_DEFAULTS_CHANGED':
			return {...state, saving: false};
		case 'UPDATE_PROFILE_DEFAULTS_DATA':
			return {
				...state,
				[action.name]: action.value || state[action.name],
			};
		case 'PROFILE_START_CHANGE_DEFAULTS':
			return {...state, saving: true};
		default:
			return state;
	}
}

function teacher (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				errors: {},
				saving: false,
				...action.teacher,
			};
		case 'PROFILE_TEACHER_CHANGED':
			return {
				...state,
				errors: {},
				saving: false,
				experiences: JSON.parse(action.data.experiences),
				qualifications: JSON.parse(action.data.qualifications),
			};
		case 'UPDATE_PROFILE_TEACHER_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SET_PROFILE_TEACHER_ERRORS':
			return {...state, saving: false, errors: action.errors};
		case 'PROFILE_START_CHANGE_TEACHER':
			return {...state, saving: true};
		default:
			return state;
	}
}

function institute (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				errors: {},
				saving: false,
				...action.institute,
			};
		case 'PROFILE_INSTITUTE_CHANGED':
			return {
				...state,
				errors: {},
				saving: false,
			};
		case 'UPDATE_PROFILE_INSTITUTE_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SET_PROFILE_INSTITUTE_ERRORS':
			return {...state, saving: false, errors: action.errors};
		case 'PROFILE_START_CHANGE_INSTITUTE':
			return {...state, saving: true};
		default:
			return state;
	}
}

function digests (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.institute && action.data.institute.digest && {
				saving: false,
				items: action.digests,
			};
		case 'UPDATE_DIGEST_INTERVAL':
			return {
				...state,
				items: state.items.map(item => {
					if (item.model === action.name)
						item.interval = action.value || 0;
					return item;
				}),
			};
		case 'SAVING_DIGESTS':
			return {...state, saving: true};
		case 'SAVED_DIGESTS':
			return {...state, saving: false};
		default:
			return state;
	}
}

export default combineReducers({
	user,
	password,
	username,
	defaults,
	teacher,
	institute,
	digests,
});

