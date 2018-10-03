import {combineReducers} from 'redux';

function selector (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				student: null,
				students: [],
				bcsmapId: null,
				studentId: null,
				enrollment_no: '',
				bcsmaps: action.bcsmaps,
				payment_date: null,
			};
		case 'RESET_FSM_CLASS':
			return {
				...state,
				students: [],
				bcsmapId: null,
				studentId: null,
			};
		case 'LOADING_FSM_STUDENTS':
			return {
				...state,
				students: null,
				studentId: null,
				bcsmapId: action.bcsmapId,
			};
		case 'LOAD_FSM_STUDENTS':
			return {
				...state,
				studentId: null,
				students: action.data,
			};
		case 'UPDATE_FSM_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'LOAD_FSM_FEE_ALLOCATIONS':
			return {...state, student: action.studentId};
		default:
			return state;
	}
}

function feeallocations (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_FSM_FEE_ALLOCATIONS':
			return null;
		case 'LOAD_FSM_FEE_ALLOCATIONS':
			return action.data;
		case 'TOGGLE_FSM_FEE_ALLOCATION': {
			let nextState = [...state];
			nextState[action.index].selected = !nextState[action.index].selected;
			return nextState;
		}
		case 'TOGGLE_ALL_FSM_FEE_ALLOCATION':
			return state.map(item => {
				if (!item.feesubmissionrecord)
					item.selected = action.checked;
				return item;
			});
		default:
			return state;
	}
}

function fees (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'LOADING_FSM_FEE_ALLOCATIONS':
			return false;
		case 'LOAD_FSM_FEES':
			return action.data;
		default:
			return state;
	}
}

function payment (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'LOADING_FSM_FEE_ALLOCATIONS':
		case 'LOAD_FSM_FEES':
			return false;
		case 'FSM_START_PAYMENT':
			return action.data;
		case 'UPDATE_FSM_PAYMENT':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function saving (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'UPDATE_FSM_PAYMENT':
		case 'LOADING_FSM_FEE_ALLOCATIONS':
			return false;
		case 'SEND_FSM_PAY_REQUEST':
			return true;
		default:
			return state;
	}
}

export default combineReducers({
	selector,
	feeallocations,
	fees,
	payment,
	saving,
});
