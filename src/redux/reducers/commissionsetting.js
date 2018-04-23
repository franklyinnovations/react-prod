import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_JOB_LIST':
			return 'LIST';
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return 'VIEW_FORM';
		default:
			return state;
	}	
}

function item(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				chat_consult: action.data.chat_consult,
				dscs: action.data.dscs
			};
		case 'UPDATE_COMMISSION_DATA_VALUE':
			let newState = {...state};
			if(action.name){
				newState[action.name] = action.value;
			}
			return newState;
		case 'REQUEST_DELETE_COMMISSION':
			newState = {...state};
			newState.dscs[action.itemIndex].loading = true; 
			return newState;
		case 'DELETE_COMMISSION_SUCCESS':
			return {
				...state,
				dscs: state.dscs.filter(item => item.id !== parseInt(action.itemId))
			};
		default:
			return state;
	}
}

function updateGlobal(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.chat_consult ? false:true;
		case 'UPDATE_GLOBAL_COMMISSION':
			return true;
		default:
			return state;
	}
}

function viewdetail(state = {}, action) {
	switch(action.type){
		case 'INIT_MODULE':
			return {};
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return action.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SEND_SAVE_CS_REQUEST':
			return {};
		case 'SET_COMMISSION_ERROR':
			return action.errors;
		default:
			return state;
	}
}

function saving (state = {}, action){
	switch(action.type){
		case 'INIT_MODULE':
			return {};
		case 'SEND_SAVE_CS_REQUEST':
			let newState = {...state};
			if(action.name){
				newState[action.name] = true;
			}
			return newState;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	item,
	updateGlobal,
	errors,
	viewdetail,
	saving
});

export default reducer;