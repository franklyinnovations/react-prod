import api, { makeErrors, makeApiData } from '../../api';

const view = 'feedback';

export function init(state) {
	let	params = {
		...state.location.query
	};

	if (state.view && state.view.viewName === view)
		params = Object.assign(params, state.view.feedback.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/feedback',
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

export function handleAction(state, id, actionType) {
	let data = makeApiData(
		state,
		{
			id: id,
			actionType: actionType
		}
	);
	return dispatch => {
		dispatch({
			type: 'MODAL_PROCESSING_STATE'
		});

		return api({
			data: data,
			url: '/admin/feedback/changeApprovalStatus'
		})
		.then(({data}) => {
			if(data.status) {
				dispatch(init(state));
			} else {
				dispatch({
					type: 'SET_ERRORS',
					errors: {}
				});	
			}
		});
	}
}