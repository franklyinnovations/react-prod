import {combineReducers} from 'redux';

function selector(state = {bcsMapId: null, enrollment_no: '', fullname: '', all: false, transerred_effective_from: null, toBcsMapId: null}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				bcsMapId: null,
				enrollment_no: '',
				fullname: '',
				all: false,
				transerred_effective_from: null,
				toBcsMapId: null
			};
		case 'UPDATE_ST_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'ST_CHANGE_ALL_SELECTIONS':
			return {
				...state,
				all: action.value
			};
		case 'CHANGE_ST_SELECTION':
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
		case 'LOADING_ST_DATA':
			return null;
		case 'SET_ST_STUDENTS':
			return action.data;
		case 'CHANGE_ST_SELECTION':{
			let _state = [...state];
			_state[action.index].selected = !_state[action.index].selected;
			return _state;
		}
		case 'ST_CHANGE_ALL_SELECTIONS':{
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
				bcsMapId: null,
				toBcsMapId: null,
			};
		case 'SET_ST_STUDENTS':
			return {
				...state,
				toBcsmaps: action.bcsmaps,
				bcsMapId: action.bcsMapId,
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