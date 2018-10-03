import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			let id = parseInt(action.id);
			return state.map(curriculum => {
				if (curriculum.id === id)
					curriculum.is_active = parseInt(action.status);
				return curriculum;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_INFRASTRUCTURE':
		case 'START_INFRASTRUCTURE_EDIT':
			return {};
		case 'SET_INFRASTRUCTURE_ERRORS':
			return action.errors;
		case 'SET_INFRA_TYPE_ERRORS':
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
		case 'START_ADD_INFRASTRUCTURE':
			return {
				infratypeId: null,
				code: '',
				remarks: '',
				is_active: true,
				infratypeName: null,
				savingInfratype: false,
			};
		case 'START_INFRASTRUCTURE_EDIT':
			return null;
		case 'SET_INFRASTRUCTURE_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value
			};
		case 'START_INFRA_TYPE_UPDATE':
			return {
				...state,
				infratypeName: action.infratypeName,
			};
		case 'INFRA_TYPE_SAVED':
			return {
				...state,
				infratypeName: null,
				savingInfratype: false,
				infratypeId: action.data.value,
			};
		default:
			return state;
	}
}

function meta(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				infratypes: action.data.infratypes,
			};
		case 'INFRA_TYPE_SAVED':
			return {
				...state,
				infratypes: action.created ? [action.data, ...state.infratypes] :
					state.infratypes.map(infratype => {
						if (infratype.value === action.data.value)
							return action.data;
						return infratype;
					}),
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	errors,
	items,
	item,
	meta,

	pageInfo,
	filters,
	query,
});

export default reducer;