import api, {makeErrors, makeApiData} from '../../api';

const view = 'adminfreeqa';

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
			url: '/doctor/freeqa/adminlist',
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
}

export function viewList() {
	return {
		type: 'VIEW_ADMIN_FQA_LIST'
	}
}

export function viewDetails(state, itemId) {
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
			url: '/doctor/freeqa/viewDetails'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ADMIN_FQA_VIEW_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}

export function sendEmail(state){
	let errors = {};
	if(state.mail.subject === ''){
		errors.subject = window.__('This is a required field.');
	}
	if(state.mail.message === ''){
		errors.message = window.__('This is a required field.');
	}

	return dispatch => {

		if(Object.keys(errors).length !== 0){
			dispatch({
				type: 'FQA_MAIL_ERRORS',
				errors
			});
		} else {
			return api({
				data: makeApiData(
					state,
					{
						id: state.mail.itemId,
						subject: state.mail.subject,
						message: state.mail.message
					}
				),
				url: '/doctor/freeqa/sendEmail'
			})
			.then(({data}) => {
				dispatch({
					type: 'CLOSE_FQA_SEND_MAIL_MODAL'
				});
			});
		}
	}
	
}

export function changeStatus(state, itemId, status) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		return api({
			data: makeApiData(state, {
				id:itemId,
				is_active: status
			}),
			url: '/doctor/freeqa/status'
		})
		.then(({data}) => {
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status
			});
		});
	}
}