import {combineReducers} from 'redux';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

const defaultPayment = {
	showModal: false,
	plan: null,
	clientToken: '',
	loading: false,
	DropIn: false,
	instance: null,
	response: null
}
function payment(state = defaultPayment, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultPayment;
		case 'SHOW_PAYMENT_MODAL':
			return {
				...state,
				showModal: true,
				loading: true,
				plan: action.plan
			};
		case 'SET_PAYMENT_CLIENT_TOKEN':
			return {
				...state,
				loading: false,
				clientToken: action.data.data.clientToken
			};
		case 'SET_PAYMENT_INSTANCE':
			return {
				...state,
				instance: action.instance
			};
		case 'CLOSE_PAYMENT_MODAL':
			return defaultPayment;
		case 'SHOW_PAYMENT_DROP_IN':
			return {
				...state,
				DropIn: true
			}
		case 'REQUEST_SUBSCRIPTION_PAYMENT':
			return {
				...state,
				loading: true
			};
		case 'RESPONSE_SUBSCRIPTION_PAYMENT':
			return {
				...state,
				loading: false,
				response: action.data
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	payment
});

export default reducer;