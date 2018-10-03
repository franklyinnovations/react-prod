import {combineReducers} from 'redux';


function day_wise (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOAD_ATT_FULL_DAY':
		case 'UPDATE_MARKED_ATT':
			return action.data;
		case 'UPDATE_ATT_DAY_WISE': {
			let attendance = [...state];
			attendance[action.itemIndex2].attendancerecords[action.itemIndex].is_present = action.value;
			return attendance;
		}
		default:
			return state;
	}
}

function isLoading(state = false, action) {
	switch(action.type) {
		default:
			return state;
	}
}

let defaultMetaData={
	date: null,
	att_type: 1,
	select_type: 'day',
	bcsMapId: '',
	subjectId: '',
	bcsmaps: [],
	slot: []
};
function meta (state = defaultMetaData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...defaultMetaData,
				att_type: action.data.attendance_type,
				select_type: action.data.attendance_type === 2 ? 'slot':'day'
			};
		case 'UPDATE_ATT_DATA':{
			let newState = {...state};
			newState[action.name] = action.value;

			if(action.name === 'select_type'){
				newState.bcsMapId = '';
				newState.subjectId = '';
				newState.slot = [];
			}

			if(action.name === 'date'){
				newState.bcsMapId = '';
				newState.subjectId = '';
				newState.slot = [];
			}

			if(action.name === 'bcsMapId') {
				newState.subjectId = '';
			}

			return newState;
		}
		case 'LOADING_ATT_BCSMAPS':
			return {
				...state,
				bcsmaps: null
			};
		case 'LOAD_ATT_BCSMAPS':
			return {
				...state,
				bcsmaps: action.bcsmaps
			};
		case 'LOADING_ATT_SLOTS':
			return {
				...state,
				slot: null
			};
		case 'LOAD_ATT_SLOTS':
			return {
				...state,
				slot: action.slot
			};
		default:
			return state;
	}
}

function check_mark(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'UPDATE_ATT_CHECKBOX':
			return {...action.value};
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'ATT_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'RES_SAVE_DAY_ATTENDANCE':
			return false;
		case 'REQ_SAVE_DAY_ATTENDANCE':
			return true;
		default:
			return state;
	}
}

export default combineReducers({
	day_wise,
	isLoading,
	meta,
	check_mark,
	errors,
	saving
});