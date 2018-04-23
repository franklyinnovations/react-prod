import api, {makeErrors, makeApiData} from '../../api';

const view = 'subscriptionplan';

export function init(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			url: '/admin/subscription/plans',
			cookies: state.cookies,
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			})
		})
	}
};

export function showPaymentModal(state, plan){
	return dispatch => {
		dispatch({
			type: 'SHOW_PAYMENT_MODAL',
			plan
		});

		return api({
			url: '/admin/transaction/client_token',
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'SET_PAYMENT_CLIENT_TOKEN',
				data
			})
		});
	}
}

export function getClientToken(state) {
	return dispatch => {
		dispatch({
			type: 'REQUEST_PAYMENT_CLIENT_TOKEN'
		});
		return api({
			url: '/admin/transaction/client_token',
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'SET_PAYMENT_CLIENT_TOKEN',
				data
			})
		});
	}
};

export function makePayment(state, nonce) {
	return dispatch => {
		dispatch({
			type: 'REQUEST_SUBSCRIPTION_PAYMENT'
		});
		return api({
			url: '/admin/subscription/make-payment',
			data: makeApiData(state, {
				nonce,
				plan: state.payment.plan,
				userId: state.session.id,
				user_type: state.session.user_type
			}),
		})
		.then(function ({data}) {
			dispatch({
				type: 'RESPONSE_SUBSCRIPTION_PAYMENT',
				data
			})
		});
	}
};