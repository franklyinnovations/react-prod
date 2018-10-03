import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'RESET_TC_DATA':
			return 'LIST';
		case 'START_TC_EDIT':
			return 'EDIT';
		case 'PRINT_TC':
			return 'PRINT';
		default:
			return state;
	}	
}


function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_TC_EDIT':
			return {};
		case 'SET_TC_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultItem = {
	isLoading: false,
	data: null,
	bcsmapId: '',
	bcsmaps: [],
	check_all: false
};
function item(state = {...defaultItem}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps: action.bcsmaps,
				bcsmapId: '',
				isLoading: false,
				data: null,
				check_all: false
			};
		case 'RESET_TC_DATA':
			return {
				...state,
				bcsmapId: '',
				isLoading: false,
				data: null,
				check_all: false
			};
		case 'UPDATE_TC_DATA_VALUE': {
			let newState = {...state};
			newState[action.name] = action.value;
			if(action.name === 'bcsmapId'){
				newState.data = [];
				newState.isLoading = action.value ? true:false;
			}
			return newState;
		}
		case 'SET_TC_STUDENT':
			return {
				...state,
				isLoading: false,
				data: action.data
			};
		case 'START_TC_EDIT':
			return {
				...state,
				isLoading: true,
				data: null
			};
		case 'SET_SELECTED_TC_STUDENT':
			return {
				...state,
				isLoading: false,
				data: action.data,
				institutedata: action.institutedata,
				classdata: action.classdata,
				signaturedata: action.signaturedata || {},
				academicname: action.academicname,
				conducts: action.conducts,
				results: action.results
			};	
		case 'SELECT_TC_STUDENT': {
			let newState = {...state};
			if(action.name !== 'check_all'){
				newState.data[parseInt(action.name)].selected = action.value;
				if(!action.value && newState.check_all) {
					newState.check_all =  false;
				}
			} else {
				newState.data.forEach(item => item.selected = action.value);
				newState.check_all = action.value;
			}
			return newState;
		}
		case 'UPDATE_TC_UPDATE_FIELD_VALUE': {
			let newState = {...state};
			let nameIndex = action.name.split('-');
			newState.data[parseInt(nameIndex[1])][nameIndex[0]] = action.value;
			return newState;
		}
		case 'SHOW_UPLOAD_STUDENTDETAIL_DATA_MODAL': {
			let stdata = action.data.data;
			return {
				...state,
				stdata
			};
		}
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'SEND_TC_REQUEST':
			return true;
		default:
			return state;
	}
}

function selector(state = {show: false, loading: false, data: {}}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				show: false,
				loading: false,
				data: {}
			};
		case 'SHOW_UPLOAD_SIGNATURE_DATA_MODAL':
			return {
				...state,
				show: true, 
				loading: false,
				data: action.data || {}
			};
		case 'HIDE_UPLOAD_SIGNATURE_DATA_MODAL':
			return {
				...state,
				show: false,
			};
		case 'LOAD_SIGNATURE_MODEL':
			return {
				...state,
				show: true,
				loading: true,
			};
		case 'UPLOADING_TC_SINGATURE':
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}

function studentdetail(state = {show: false, loading: false, data: {}}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				show: false,
				loading: false,
				data: {}
			};
		case 'SHOW_UPLOAD_STUDENTDETAIL_DATA_MODAL':
			return {
				...state,
				show: true, 
				loading: false,
				data: action.data || {}
			};
		case 'HIDE_UPLOAD_STUDENTDETAIL_DATA_MODAL':
			return {
				...state,
				show: false,
			};
		case 'LOAD_STUDENTDETAIL_MODEL':
			return {
				...state,
				show: true,
				loading: true,
			};	
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	errors,
	item,
	saving,
	selector,
	studentdetail
});

export default reducer;