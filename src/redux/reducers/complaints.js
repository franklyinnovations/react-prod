import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOAD_CLT_FORM':
			return null;
		case 'START_ADD_CLT':
		case 'SET_CLT_VIEW_DATA':
			return action.data;
		case 'RESET_CLT_CLASS':
			return {...state, bcsmapId: null};
		case 'CHANGING_CLT_CLASS':
			return {...state, bcsmapId: action.value};
		case 'UPDATE_DATA_VALUE':
			return {...state, [action.name]: action.value};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'SET_CLT_ERRORS':
			return action.errors;
		case 'INIT_MODULE':
		case 'SET_VIEW_DATA':
		case 'START_ADD_CLT':
		case 'HIDE_DATA_MODAL':
			return {};
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		case 'START_ADD_CLT':
			return {...state, tags: action.tags, allSelected: false, students: false};
		case 'RESET_CLT_CLASS':
			return {...state, students: false};
		case 'CHANGING_CLT_CLASS':
			return {...state, students: null};
		case 'SET_CLT_STUDENTS':
			return {...state, students: action.data};
		case 'TOGGLE_CLT_STUDENT': {
			let id = +action.id;
			return {
				...state,
				students: state.students.map(item => {
					if (item.student.id === id)
						item.selected = action.checked;
					return item;
				}),
			};
		}
		case 'TOGGLE_CLT_STUDENT_ALL':
			return {
				...state,
				allSelected: action.checked,
				students: state.students.map(item => {
					item.selected = action.checked;
					return item;
				}),
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_CLT_ERRORS':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SEND_COMPLAINT_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	item,
	errors,
	meta,
	saving,
	query,
	filters,
	pageInfo,
});

export default reducer;