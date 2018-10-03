import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS': {
			let itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.user.id === itemId)
					item.user.is_active = parseInt(action.status);
				return item;
			});
		}
		case 'TOGGLE_ALL_TEACHER_SELECTION':
			return state.map(item => {
				if (action.value) {
					item.selected = true;
				} else {
					delete item.selected;
				}
				return item;
			});
		case 'TOGGLE_TEACHER_SELECTION': {
			let newState = [...state];
			if (action.value) {
				newState[action.index].selected = true;
			} else {
				delete newState[action.index].selected;
			}
			return newState;
		}
		case 'SEND_TEACHER_LOGIN_INFO': {
			return state.map(item => {
				if (item.id === action.itemId)
					item.sendingLoginInfo = true;
				return item;
			});
		}
		case 'TEACHER_LOGIN_INFO_SENT':
			return state.map(item => {
				if (item.id === action.itemId)
					delete item.sendingLoginInfo;
				return item;
			});
		case 'TEACHER_CLEAR_SELECTION':	
		case 'TEACHER_EMAIL_SENT':	
		case 'TEACHER_SMS_SENT':
			return state.map(item => {
				delete item.selected;
				return item;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_TEACHER':
		case 'START_TEACHER_EDIT':
		case 'HIDE_DATA_MODAL':
		case 'TEACHER_SMS_SENT':
		case 'TEACHER_EMAIL_SENT':
			return {};
		case 'SET_TEACHER_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'HIDE_DATA_MODAL':
			return false;
		case 'ADD_TEACHER':
			return {
				salutation: '',
				name: '',
				email: '',
				mobile: '',
				subjects: [],
				is_active: true,
			};
		case 'START_TEACHER_ADD':
		case 'START_TEACHER_EDIT':
			return null;
		case 'SET_TEACHER_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'UPDATE_TEACHER_TABLE_DATA': {
			let newState = {...state};
			if (action.info.table === 'exp')
				newState.experiences[action.info.index][action.info.name] = action.value;
			else
				newState.qualifications[action.info.index][action.info.name] = action.value;
			return newState;
		}
		case 'UPDATE_TEACHER_TABLE': {
			let newState = {...state};
			updateTable(
				action.table === 'exp' ? newState.experiences : newState.qualifications,
				action.index,
				action,
			);
			return newState;
		}
		case 'SET_TEACHER_TABLE_ERROS':
			return {
				...state,
				qualifications: action.qualifications,
				experiences: action.experiences
			};
		default:
			return state;
	}
}

function meta(state = {formType: null, allSelected: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				formType: null,
				allSelected: false,
			};
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				formType: null,
				allSelected: state.allSelected,
			};
		case 'ADD_TEACHER':
			return {
				...state,
				formType: 'ADD',
				roleId: action.roleId,
				subjects: action.subjects,
			};
		case 'START_TEACHER_EDIT':
			return {
				...state,
				formType: 'EDIT',
				allSelected: state.allSelected,
			};
		case 'SET_TEACHER_EDIT_DATA':
			return {
				...state,
				subjects: action.subjects,
			};
		case 'TOGGLE_TEACHER_SELECTION': {
			if (!action.value) {
				return {...state, allSelected: false};
			} else {
				return state;
			}
		}
		case 'TOGGLE_ALL_TEACHER_SELECTION':
			return {
				...state,
				allSelected: action.value,
			};
		case 'TEACHER_CLEAR_SELECTION':	
		case 'TEACHER_EMAIL_SENT':	
		case 'TEACHER_SMS_SENT':
			return {
				allSelected: false,
			};
		default:
			return state;
	}
}

function updateTable(table, index, action) {
	switch(action.action) {
		case 'ADD':
			table.splice(
				index + 1,
				0,
				action.table === 'exp' ? {
					institute_name: '',
					start: null,
					end: null,
					remark: '',
				} : {
					institute_name: '',
					name: '',
					startYear: '',
					endYear: '',
					image: '',
				}
			);
			break;
		case 'DELETE':
			if (table.length !== 1)
				table.splice(index, 1);
			else
				table[0] = action.table === 'exp' ? {
					institute_name: '',
					start: null,
					end: null,
					remark: '',
				} : {
					institute_name: '',
					name: '',
					startYear: '',
					endYear: '',
					image: '',
				};
			break;
		case 'MOVE_UP': {
			if (index === 0) break;
			let temp = table[index];
			table[index] = table[index - 1];
			table[index - 1] = temp;
			break;
		}
		case 'MOVE_DOWN': {
			if (index === table.length - 1) break;
			let temp = table[index];
			table[index] = table[index + 1];
			table[index + 1] = temp;
			break;
		}
	}
}

export function subjects(state = false, action) {
	switch (action.type) {
		case 'SET_TEACHER_SUBJECTS':
			return action.subjects;
		case 'GET_TEACHER_SUBJECTS':
			return null;
		case 'HIDE_TEACHER_SUBJECTS':
			return false;
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	items,
	item,
	meta,
	subjects,

	pageInfo,
	filters,
	query,
});

export default reducer;