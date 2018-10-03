import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_PARENTVEHICLE_STATUS': {
			return state.map(item => {
				if (item.id === action.id)
					item.is_active = parseInt(action.status);
				return item;
			});
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_PARENTVEHICLE':
		case 'START_PARENTVEHICLE_EDIT':
			return {};
		case 'SET_PARENTVEHICLE_ERRORS':
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
		case 'START_PARENTVEHICLE_EDIT':
			return null;
		case 'START_ADD_PARENTVEHICLE':
		case 'SET_PARENTVEHICLE_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
}

function meta(state = {}, action){
	switch(action.type){
		case 'INIT_MODULE':
			return {
				bcsmaps: action.bcsmaps.map(item=>({
					value: item.id,
					label: item.board.boarddetails[0].alias 
					+'-'+item.class.classesdetails[0].name
					+'-'+item.section.sectiondetails[0].name
				}))
			};
		case 'START_ADD_PARENTVEHICLE':	
			return {
				...state,
				students: [],
			};
		case 'LOADING_PARENTVEHICLE_STUDENTS':
			return {
				...state,
				students: null, 
			};
		case 'LOAD_PARENTVEHICLE_STUDENTS':
			return {
				...state,
				students: action.students,
			};	
		default:
			return state;
	}
}

function qrcode (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_PARENTVEHICLE_QRCODE':
			return false;
		case 'SHOW_PARENTVEHICLE_QRCODE':
			return action.item;
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'SET_PARENTVEHICLE_ERRORS':
			return false;
		case 'SAVING_PARENTVEHICLE':
			return true;
		default:
			return state;
	}
}


const reducer = combineReducers({
	errors,
	items,
	item,
	meta,
	qrcode,

	pageInfo,
	filters,
	query,
	saving,
});

export default reducer;