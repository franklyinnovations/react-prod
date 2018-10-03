import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS': {
			let id = parseInt(action.id);
			return state.map(curriculum => {
				if (curriculum.id === id)
					curriculum.is_active = parseInt(action.status);
				return curriculum;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_SUBJECT':
		case 'START_SUBJECT_EDIT':
		case 'UPDATE_SUBJECT_CATEGORY':
			return {};
		case 'SET_SUBJECT_ERRORS':
			return action.errors;
		case 'SET_SUBJECT_CATEGORY_ERROR':
			return {
				subName: action.error,
			};
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
		case 'START_ADD_SUBJECT':
			return {
				name: '',
				alias: '',
				is_active: true,
				subName: '',
				subIndex: null,
				subItems: [],
			};
		case 'START_SUBJECT_EDIT':
			return null;
		case 'SET_SUBJECT_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'UPDATE_SUBJECT_CATEGORY': {
			let nextState = {
				...state,
				subName: '',
				subIndex: null,
			};
			if (state.subIndex === null) {
				nextState.subItems = [...state.subItems, {
					is_active: 1,
					name: state.subName,
				}];
			} else {
				nextState.subItems = [...state.subItems];
				nextState.subItems[state.subIndex].name = state.subName;
			}
			return nextState;
		}
		case 'EDIT_SUBJECT_CATEGORY':
			return {
				...state,
				subIndex: action.index,
				subName: state.subItems[action.index].name,
			};
		case 'REMOVE_SUBJECT_CATEGORY':
			return {
				...state,
				subIndex: state.subIndex > action.index ? (state.subIndex - 1) : 
					((state.subIndex === action.index) ? null : state.subIndex),
				subName: state.subIndex === action.index ? '' : state.subName,
				subItems: state.subItems.filter((_, index) => index !== action.index),
			};
		case 'CHANGE_SUBJECT_CATEGORY_STATUS': {
			let nextState = {...state};
			nextState.subItems[action.index].is_active = !state.subItems[action.index].is_active;
			return nextState;
		}
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	items,
	item,

	pageInfo,
	filters,
	query,
});

export default reducer;