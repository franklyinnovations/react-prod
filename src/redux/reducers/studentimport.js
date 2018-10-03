import {combineReducers} from 'redux';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SI_DISCARD_DATA':
		case 'SI_CLOSE_RES_MODAL':
		case 'SI_SHOW_IMPORT_PROGRESS':
			return {};
		case 'SET_IMPORT_STUDENT_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultItem = {
	bcsmaps: [],
	roleId: '',
	bcsMapId: '',
	languageId: '',
	academicSessionId: '',
	disableSelect: false,
	isLoading: false,
	data: []
};
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps:action.bcsmaps,
				roleId: action.role.id,
				academicSessions: action.academicSessions,
				languages: action.languages
			};
		case 'UPDATE_IMPORT_STUDENT_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		}
		case 'LOAD_SI_SHEET_DATA':
			return {
				...state,
				data: [],
				disableSelect: true,
				isLoading: true,
			};
		case 'SI_EMPTY_SHEET':
			return {
				...state,
				data: [],
				disableSelect: false,
				isLoading: false,
			};
		case 'SET_SI_SHEET_DATA':
			return {
				...state,
				isLoading: false,
				data: action.data,
				fields: action.fields,
				cols: action.data[0].map(() => null),
			};
		case 'SI_COL_DATA_UPDATE':{
			let newState = {...state};
			newState.cols[action.name]=action.value;
			return newState;
		}
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SI_DISCARD_DATA':
			return {
				...state,
				bcsMapId: '',
				languageId: '',
				academicSessionId: '',
				disableSelect: false,
				isLoading: false,
				data: [],
				cols: {},
			};
		default:
			return state;
	}
}

function importProgress(state = null, action){
	switch(action.type) {
		case 'INIT_MODULE':
			return null;
		case 'SI_SHOW_IMPORT_PROGRESS': {
			let newState = {...state};
			newState.pSuccess = action.pSuccess;
			newState.pError = action.pError;
			newState.percentage = action.percentage;
			if(newState.data) 
				newState.data.unshift(action.data);
			else 
				newState.data = action.data ? [action.data] : [];
			return newState;
		}
		case 'SI_CLOSE_RES_MODAL':
			return null;
		default:
			return state;
	}
}


function saving(state = false, action) {
	switch(action.type) {
		case 'SET_IMPORT_STUDENT_SAVE_ERRORS':
		case 'SET_IMPORT_STUDENT_SAVE_RESPONSE':
		case 'INIT_MODULE':
			return false;
		case 'SEND_IMPORT_STUDENT_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	item,
	importProgress,
	saving
});

export default reducer;