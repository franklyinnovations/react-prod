import {combineReducers} from 'redux';

function selector(state = {bcsMapId: null, enrollment_no: '', fullname: '', all: false, toBcsMapId: null}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				bcsMapId: null,
				enrollment_no: '',
				fullname: '',
				all: false,
				toBcsMapId: null
			};
		case 'UPDATE_SP_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'SP_CHANGE_ALL_SELECTIONS':
			return {
				...state,
				all: action.value
			};
		case 'CHANGE_SP_SELECTION':
			return {
				...state,
				all: false,
			};
		default:
			return state;
	}
}

function students(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_SP_DATA':
			return null;
		case 'SET_SP_STUDENTS':
			return action.data;
		case 'CHANGE_SP_SELECTION':{
			let _state = [...state];
			_state[action.index].selected = !_state[action.index].selected;
			return _state;
		}
		case 'SP_CHANGE_ALL_SELECTIONS':{
			let selected = action.value;
			return state.map(item => {
				item.selected = selected;
				return item;
			});
		}
		default:
			return state;
	}
}

function helperData(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
				nextAcademicSession: action.nextAcademicSession,
				bcsMapId: null,
				toBcsMapId: null,
			};
		case 'SET_SP_STUDENTS':
			return {
				...state,
				toBcsmaps: action.bcsmaps,
				bcsMapId: action.bcsMapId,
			};
		case 'SET_SELECTED_SESSION':
			return {
				...state,
				nextAcademicSession: null
			};
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	students,
	helperData,
});