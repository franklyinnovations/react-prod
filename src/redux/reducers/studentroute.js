import {combineReducers} from 'redux';

function selector (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				routeId: null,
				rvdhsmapId: null,
				bcsmapId: null,
				enrollment_no: '',
				name: '',
				mobile: '',
			};
		case 'LOADING_STR_RVDHSMAPS':
			return {
				...state,
				rvdhsmapId: null,
			};	
		case 'UPDATE_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function items (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_STR_RVDHSMAPS':
			return false;	
		case 'LOADING_STR_STUDENTS':
			return null;
		case 'SET_STR_STUDENTS':
			return action.students;
		case 'UPDATE_STUDENT':
			return updateArrayItem(state, action.index, student => {
				let next = {...student};
				next.rvdhsmaprecord[action.name] = action.value;
				if (next.rvdhsmaprecord.pickupId === null)
					next.rvdhsmaprecord.pickupId = action.value;
				if (next.rvdhsmaprecord.dropId === null)
					next.rvdhsmaprecord.dropId = action.value;
				return next;
			});
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				routes: action.routes,
				bcsmaps: action.bcsmaps,
				rvdhsmaps: false,
			};
		case 'LOAD_STR_RVDHSMAPS':
			return {
				...state,
				rvdhsmaps: action.rvdhsmaps,
			};
		case 'LOADING_STR_RVDHSMAPS':
			return {
				...state,
				rvdhsmaps: null,
			};
		case 'SET_STR_STUDENTS':
			return {
				...state,
				stats: action.stats,
				rvdhsmap: action.rvdhsmap,
				transportTypes: action.transportTypes,
				rvdhsmapaddresses: action.rvdhsmapaddresses,
				bcsmapId: action.students === null ? action.bcsmapId : state.bcsmapId,
			};
		case 'SAVED_STR':
			return {...state, stats: action.stats};
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_STR_STUDENTS':
		case 'SAVING_STR':
			return {};
		case 'SET_SELECTOR_ERRORS':
		case 'SET_STR_SAVE_ERRORS':
			return action.errors;		
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	items,
	meta,
	errors,
});

function updateArrayItem(array, index, updater) {
	let newArray = [...array];
	newArray[index] = updater(array[index], index, array);
	return newArray;
}