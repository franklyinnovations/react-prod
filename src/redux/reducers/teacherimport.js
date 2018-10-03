import {combineReducers} from 'redux';

function errors(state = {}, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'TI_CLOSE_RES_MODAL':
			return {};
		default:
			return state;
	}
}

const defaultItem = {
	disableSelect: false,
	isLoading: false,
	data: []
};
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'LOAD_TI_SHEET_DATA':
			return {
				...state,
				data: [],
				disableSelect: true,
				isLoading: true,
			};
		case 'TI_EMPTY_SHEET':
			return {
				...state,
				data: [],
				disableSelect: false,
				isLoading: false,
			};
		case 'SET_TI_SHEET_DATA':
			return {
				...state,
				isLoading: false,
				data: action.data,
				fields: action.fields,
				cols: action.data[0].map(() => 'ignore'),
			};
		case 'TI_COL_DATA_UPDATE':{
			let newState = {...state};
			newState.cols[action.name]=action.value;
			return newState;
		}
		case 'TI_DISCARD_DATA':
			return{
				...state,
				data: [],
				disableSelect: false,
				isLoading: false,
				cols: {},
			};
		case 'UPDATE_SUBJECT':
			state.data[action.index][state.data[action.index].length - 1] = action.value;
			return {...state};
		default:
			return state;
	}
}

function importProgress(state=false, action){
	switch(action.type){
		case 'INIT_MODULE':
			return null;
		case 'TI_SHOW_IMPORT_PROGRESS':{
			let newState = {...state};
			newState.percentage = action.percentage;
			newState.pSuccess = action.pSuccess;
			newState.pError = action.pError;
			if(newState.data)
				newState.data.unshift(action.data);
			else
				newState.data = action.data ? [action.data] : [];
			return newState;
		}
		case 'TI_CLOSE_RES_MODAL':
			return null;
		default:
			return state;
	}
}

function saving(state=false, action){
	switch(action.type){
		case 'SEND_IMPORT_TEACHER_REQUEST':
			return true;
		default:
			return state;
	}
}

function meta(state={}, action){
	switch(action.type){
		case 'INIT_MODULE':
			return {
				roleId: action.roleId,
				subjects: action.subjects,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	item,
	importProgress,
	saving,
	meta,
});

export default reducer;