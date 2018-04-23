import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'GET_START_CONSULT':
		case 'VIEW_OC_HOME':
			return 'LIST';
		case 'SET_OC_SETTING_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function availability(state = {status: false, chat:false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				status: action.data.status,
				chat: action.data.chat
			};
		case 'GET_START_CONSULT':
			return {
				...state,
				status: action.status,
			};
		default:
			return state;
	}	
}

const defaultItem = {
	id: '',
	available_for_consult: '',
	freeqa_notification: '',
	chat_notification: '',
	account_holder_name: '',
	account_number: '',
	account_type: 1,
	bank_name: '',
	bank_branch_city: '',
	bank_ifsc_code: '',
	consultation_fee: '',
	commission: 0,
	viewOnly: false
};
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultItem;
		case 'SET_OC_SETTING_DATA':
			return {
				id: action.data.id,
				available_for_consult: action.data.available_for_consult,
				freeqa_notification: action.data.freeqa_notification,
				chat_notification: action.data.chat_notification,
				account_holder_name: action.data.account_holder_name,
				account_number: action.data.account_number,
				account_type: action.data.account_type ? parseInt(action.data.account_type):1,
				bank_name: action.data.bank_name,
				bank_branch_city: action.data.bank_branch_city,
				bank_ifsc_code: action.data.bank_ifsc_code,
				consultation_fee: action.data.consultation_fee,
				commission: action.data.commission,
				viewOnly: (action.data.account_number && action.data.account_holder_name)
			};
		case 'OC_UPDATE_SETTING_VALUE':
			let newState = {...state};
			if(action.name){
				newState[action.name] = action.value;
			}
			return newState;
		case 'REQUEST_FQA_NOTIFICATION':
			newState = {...state};
			newState[action.name] = 'UPDATING';
			return newState;
		case 'UPDATE_FQA_NOTIFICATION':
			newState = {...state};
			newState[action.name] = action.status;
			return newState;
		case 'SHOW_EDIT_FQA_SETTING':
			newState = {...state};
			newState.viewOnly = newState.viewOnly ? false:true;
			return newState;
		default:
			return state;
	}	
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_OC_HOME':
		case 'SET_OC_SETTING_ERRORS':
			return false;
		case 'REQUEST_OC_SAVE_SETTING':
			return true;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_OC_SETTING_DATA':
			return {};
		case 'SET_OC_SETTING_ERRORS':
			return action.errors;
		default:
			return state;
	}	
}


const reducer = combineReducers({
	viewState,
	availability,
	item,
	saving,
	errors
});

export default reducer;