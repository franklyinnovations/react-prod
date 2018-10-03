import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function viewState(state = 'LIST', action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'VIEW_MSB_LIST':
			return 'LIST';
		case 'START_ADD_MSB':
		case 'SET_MSB_EDIT_DATA':
			return 'DATA_FORM';
		case 'LOAD_MSB_EDITOR':
			return 'EDITOR';
		default:
			return state;
	}
}

function items(state = [], action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_MSB_STATUS': {
			let itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		}
		case 'SEND_MSB_REMOVE_REQUEST': {
			let itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.removing = true;
				return item;
			});
		}
		case 'REMOVE_MSB_FAILED': {
			let itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					delete item.removing;
				return item;
			});
		}
		default:
			return state;
	}
}


function item(state = false, action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOAD_MSB_FORM_DATA':
			return null;
		case 'START_ADD_MSB':
		case 'SET_MSB_EDIT_DATA':
			return action.data;
		case 'UPDATE_MSB_DATA':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SEND_SAVE_MSB_REQUEST':
			return true;
		case 'INIT_MODULE':
		case 'SET_MSB_SAVE_ERRORS':
			return false;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
		case 'SEND_SAVE_MSB_REQUEST':
		case 'START_ADD_MSB':
		case 'SET_MSB_EDIT_DATA':
			return {};
		case 'SET_MSB_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				bcsmaps: action.bcsmaps,
			};
		case 'SET_MSB_EDIT_DATA':
		case 'START_ADD_MSB':
			return {
				...state,
				templates: action.templates,
			};
		default:
			return state;
	}
}

function editor(state = {saving: false, errors: {}, preview: false}, action) {
	switch(action.type) {
		case 'LOAD_MSB_EDITOR':
			return {
				saving: false,
				errors: {},
				...action.data,
			};
		case 'SAVING_MSB_SETTINGS':
			return {
				...state,
				saving: true,
				errors: {},
				preview: false,
			};
		case 'SAVED_MSB_SETTINGS':
			return {
				...state,
				saving: false,
				preview: true,
			};
		case 'UPDATE_MSB_SETTINGS':
			return {
				...state,
				settings: {
					...state.settings,
					[action.name]: action.value 
				},
				preview: false,
			};
		case 'SET_MSB_EDITOR_ERRORS':
			return {
				...state,
				errors: action.errors,
			};
		default:
			return state;
	}
}

export default combineReducers({
	viewState,
	items,
	item,
	saving,
	errors,
	meta,
	editor,
	query,
	filters,
	pageInfo
});