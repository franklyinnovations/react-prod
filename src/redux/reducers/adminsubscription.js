import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_SUBSCRIPTION_LIST':
			return 'LIST';
		case 'SET_ADMIN_SUBSCRIPTION_EDIT_DATA':
			return 'VIEW_DATA';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
		default:
			return state;
	}
}

function trialSubscription(state = {days: '', editable: false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				days: action.trial,
				editable: false
			};
		case 'EDIT_TRIAL_SUBSCRIPTION':
			return {
				...state,
				editable: true
			};
		case 'UPDATE_SUBSCRIPTION_TRIAL_VALUE':
			let newState = {...state};
			if(action.name){
				newState[action.name] = action.value;
			}
			return newState;
		default:
			return state;
	}
}

const defaultItem = {
	id: '',
	title: '',
	type: '',
	monthly_amount: '',
	iquaterly_amountd: '',
	yearly_amount: '',
	features: ''
}
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultItem;
		case 'SET_ADMIN_SUBSCRIPTION_EDIT_DATA':
			return {
				id: action.data.id,
				title: action.data.title,
				type: action.data.type,
				monthly_amount: action.data.monthly_amount,
				quaterly_amount: action.data.quaterly_amount,
				yearly_amount: action.data.yearly_amount,
				features: action.data.features
			};
		case 'UPDATE_SUBSCRIPTION_VALUE':
			let newState = {...state};
			if(action.name){
				newState[action.name] = action.value;
			}
			return newState;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_SUBSCRIPTION_ERROR':
			return action.errors;
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	item,
	errors,
	trialSubscription
});

export default reducer;