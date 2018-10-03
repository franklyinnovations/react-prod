import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'RESET_SBE_DATA':
			return 'LIST';
		case 'START_SBE_EDIT':
			return 'EDIT';
		default:
			return state;
	}	
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_SBE_EDIT':
			return {};
		case 'SET_SEB_ERRORS':
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
	field: [],
	fields: [],
	field_value : {},
	check_all: false
};
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps:action.bcsmaps,
				bcsmapId: '',
				isLoading: false,
				data: null,
				field: [],
				fields: [],
				field_value : {},
				check_all: false
			};
		case 'RESET_SBE_DATA':
			return {
				...state,
				bcsmapId: '',
				isLoading: false,
				data: null,
				field: [],
				fields: [],
				field_value : {},
				check_all: false
			};
		case 'UPDATE_SBE_DATA_VALUE':{
			let newState = {...state};
			newState[action.name] = action.value;
			if(action.name === 'bcsmapId'){
				newState.data = [];
				newState.isLoading = action.value ? true:false;
				newState.fields = [];
				newState.field = [];
			}
			return newState;
		}
		case 'SET_SBE_STUDENT':
			return {
				...state,
				isLoading: false,
				data: action.data,
				fields: action.fields
			};
		case 'SELECT_SBE_STUDENT':{
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
		case 'UPDATE_SBE_UPDATE_FIELD_VALUE':{
			let newState = {...state};
			newState.field_value[action.name] = action.value;
			return newState;
		}
		case 'START_SBE_EDIT':
			return {
				...state,
				field_value: {}
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'SEND_SBE_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	errors,
	item,
	saving
});

export default reducer;