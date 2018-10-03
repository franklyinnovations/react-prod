import {combineReducers} from 'redux';
import marksheets from './marksheets';

function selector(state = {bcsmapId: null, marksheetbuilderId: null, students: []}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				bcsmapId: null,
				marksheetbuilderId: null,
				students: [],
			};
		case 'CHANGE_MST_BCSMAP':
			return {
				...state,
				bcsmapId: action.bcsmapId,
			};
		case 'UPDATE_MST_SELECTOR': {
			if (action.name === 'students' && action.value.indexOf('') !== -1) {
				if (action.value.length === 2)
					return {
						...state,
						students: [action.value[1]]
					};
				else
					return {
						...state,
						students: [''],
					};
			} else {
				return {
					...state,
					[action.name]: action.value,
				};
			}
		}
		default:
			return state;
	}
}

function meta(state = {loadingData: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		case 'CHANGE_MST_BCSMAP':
			return {
				...state,
				loadingData: true,
				students: [],
				marksheetbuilders: [],
			};
		case 'SET_MST_DATA':
			return {
				...state,
				loadingData: false,
				students: action.students,
				marksheetbuilders: action.marksheetbuilders,
			};
		default:
			return state;
	}
}

function creator(state = {template: false, data: undefined, saved: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'CHANGE_MST_BCSMAP':
		case 'UPDATE_MST_SELECTOR':
			return {template: false, data: undefined, saved: false};
		case 'LOADING_MS_CREATOR':
			return {template: null, data: undefined, saved: false};
		case 'MS_DATA_SAVED':
			return {template: state.template, data: state.data, saved: true};
		case 'LOAD_MS_CREATOR': {
			if (marksheets[action.template]) {
				return {
					saved: false,
					template: action.template,
					data: marksheets[action.template](
						undefined,
						action,
					),
				};
			} else {
				return {
					saved: true,
					template: false,
					data: null,
				};
			}
		}
		default: {
			if (!state.template) return state;
			let data = marksheets[state.template](
				state.data,
				action
			);
			if (data === state.data)
				return state;
			return  {...state, data};
		}
	}
}

const reducer = combineReducers({
	selector,
	meta,
	creator,
});

export default reducer;