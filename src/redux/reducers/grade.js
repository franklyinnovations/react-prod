import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_GRD_STATUS': {
			let id = action.id;
			return state.map(curriculum => {
				if (curriculum.id === id)
					curriculum.is_active = action.status;
				return curriculum;
			});
		}
		default:
			return state;
	}
}

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'SET_GRD_ADD_DATA':
		case 'SET_GRD_EDIT_DATA':
			return action.data;
		case 'START_ADD_GRD':
		case 'START_GRD_EDIT':
			return null;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'ADD_GRD_DATA':
			return {
				...state,
				to: '',
				end: '',
				grade: '',
				result: null,
				start: action.data.end,
				data: [...state.data, action.data],
			};
		case 'REMOVE_ADD_DATA': {
			let data = [...state.data], last = data.pop();
			return {
				...state,
				data,
				start: last.start,
			};
		}
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'START_GRD_EDIT':
		case 'START_ADD_GRD':
		case 'ADD_GRD_DATA':
			return {};
		case 'SET_GRD_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				allBcsmaps: action.bcsmaps,
			};
		case 'SET_GRD_ADD_DATA':
		case 'SET_GRD_EDIT_DATA':
			return {
				...state,
				tags: action.tags,
				bcsmaps: action.bcsmaps, 
			};
		default:
			return state;
	}
}

export default combineReducers({
	items,
	item,
	errors,
	meta,
	query,
	filters,
	pageInfo,
});