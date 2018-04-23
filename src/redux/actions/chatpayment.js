import api, {makeErrors, makeApiData} from '../../api';

const view = 'chatpayment';

export function init(state) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view[view].filter);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/transaction/duetransactions',
			cookies: state.cookies,
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				globalcommission: data.globalcommission || 0,
				stopLoading: true
			})
		})
	}
}

export function initList(state, name) {
	let	params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view[view].filter);
	return dispatch => {
		dispatch({
			type: 'CHANGE_CP_VIEW_LIST',
			name
		});
		return api({
			params,
			url: name === 'DUE_LIST' ? '/admin/transaction/duetransactions':'/admin/transaction/paidtransactions',
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_LIST',
				data
			})
		})
	}
}

export function viewList() {
	return {
		type: 'VIEW_ADMIN_FQA_LIST'
	}
}

export function viewDetails(state, doctorId) {
	let data = makeApiData(
		state,
		{
			id: doctorId,
			timestamp: state.timestamp
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/admin/transaction/viewDetails'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_CHAT_PAYMENT_VIEW_DATA',
				doctor: data.doctor,
				data: data.data,
				commission: data.commission,
				stopLoading: true
			});
		});
	}
}

export function viewACDetails(state, doctorId) {
	let data = makeApiData(
		state,
		{
			id: doctorId
		}
	);
	return dispatch => {
		dispatch({
			type: 'SHOW_CHAT_PAYMENT_ACDETAIL_MODAL'
		});

		return api({
			data: data,
			url: '/admin/transaction/viewACDetails'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_CHAT_PAYMENT_ACDETAIL_DATA',
				data: data.data
			});
		});
	}
}

export function releasePayment(state) {
	return dispatch => {
		if(state.release.reference_no ==='' ) {
			dispatch({
				type: 'SET_CP_RELEASE_ERRORS',
				errors: {
					reference_no: 'This is a required field.'
				}
			});
		}  else {
			dispatch({
				type: 'SEND_CP_RELEASE_REQUEST'
			});

			let data = makeApiData(
				state,
				{
					doctorprofileId: state.release.doctorprofileId,
					reference_no: state.release.reference_no,
					timestamp: state.timestamp
				}
			);
			return api({
				data: data,
				url: '/admin/transaction/releasePayment'
			})
			.then(({data}) => {
				dispatch(init(state));
			});
		}
	}
}

export function viewPaidDetail(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/admin/transaction/viewPaidDetail'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_CHAT_PAYMENT_PAID_VIEW_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}