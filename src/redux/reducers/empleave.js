import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';
import moment from 'moment';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'EL_STATUS_CHANGED': {
			return state.map(item => {
				if (item.id === action.id)
					item.leavestatus = parseInt(action.status);
				return item;
			});
		}
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'HIDE_DATA_MODAL':
			return {};
		case 'SET_EL_ERRORS':
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
		case 'EL_STATUS_CHANGED':
			if (state && state.id === action.id) {
				return false;
			} else {
				return state;
			}
		case 'START_EL_VIEW':
			return null;
		case 'START_ADD_EL':
		case 'SET_EL_VIEW_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE': {
			let nextState = {...state, [action.name]: action.value};
			switch (action.name) {
				case 'empLeaveTypeId':
					nextState.balance = action.balance;
					break;
				case 'start_date':
				case 'end_date':
					nextState.duration = (nextState.start_date && nextState.end_date) ?
						1 + (moment(nextState.end_date, action.date_format).diff(moment(nextState.start_date, action.date_format), 'days')) : null;
					break;
				case 'leaveDay':
					if (action.value === 1)
						nextState.duration = 0.5;
					break;
			}
			return nextState;
		}

		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				leavetypeOptions: action.leavetypeOptions,
			};
		case 'START_ADD_EL':
			return {
				...state,
				tags: action.tags,
				leavetypes: action.leaveTypes,
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	item,
	meta,

	pageInfo,
	filters,
	query,
});

export default reducer;