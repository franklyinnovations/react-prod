import api, {makeErrors, makeApiData} from '../../api';

const view = 'adminsubscription';

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
			url: '/admin/subscription',
			cookies: state.cookies,
			data: makeApiData(state),
		})
		.then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				trial: data.trial,
				stopLoading: true
			})
		})
	}
}

export function viewList() {
	return {
		type: 'VIEW_ADMIN_SUBSCRIPTION_LIST'
	}
}

export function edit(state, itemId) {
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
			url: '/admin/subscription/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_ADMIN_SUBSCRIPTION_EDIT_DATA',
				data: data.data,
				stopLoading: true
			});
		});
	}
}

export function save(state) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			title: state.item.title,
			type: state.item.type,
			monthly_amount: state.item.monthly_amount,
			quaterly_amount: state.item.quaterly_amount,
			yearly_amount: state.item.yearly_amount,
			features: state.item.features
		}
	);
	return dispatch => {
		dispatch({
			type: 'REQUEST_SAVE_SUBSCRIPTION'
		});

		return api({
			data: data,
			url: '/admin/subscription/save'
		})
		.then(({data}) => {
			if(data.errors){
				dispatch({
					type: 'SET_SUBSCRIPTION_ERROR',
					errors: makeErrors(data.errors)
				});
			} else {
				dispatch(init(state));
			}
		});
	}
}

export function updateTrialSubscription(state) {
	return dispatch => {
		if(state.trialSubscription.days === ''){
			dispatch({
				type: 'SET_SUBSCRIPTION_TRIAL_ERROR',
				errors: {days: window.__('This is a required field.')}
			});
		} else if(isNaN(parseInt(state.trialSubscription.days))){
			dispatch({
				type: 'SET_SUBSCRIPTION_TRIAL_ERROR',
				errors: {days: window.__('Invalid day.')}
			});
		} else {
			dispatch({
				type: 'REQUEST_SAVE_TRIAL_SUBSCRIPTION'
			});

			return api({
				data: makeApiData(state, {
					days: state.trialSubscription.days
				}),
				url: '/admin/subscription/update-trial'
			})
			.then(({data}) => {
				if(data.errors){
					dispatch({
						type: 'SET_SUBSCRIPTION_TRIAL_ERROR',
						errors: makeErrors(data.errors)
					});
				} else {
					dispatch(init(state));
				}
			});
		}
	}
}