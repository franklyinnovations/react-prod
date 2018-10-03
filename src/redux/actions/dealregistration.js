import api, {makeErrors} from '../../api';
export {update} from './index';

const view = 'dealregistration';

export function init() {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		let {data: {countries}} = await api({
			url: '/dealregistration/add',
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			countries,
			stopLoading: true,
		});
	};
}

export function updateAvailableState(state, countryId) {
	return async dispatch => {
		dispatch({
			type: 'LOAD_DEAL_STATE'
		});

		let {data} = await api({
			url: '/admin/state/listByCountryId',
			data: {
				countryId
			}
		});

		dispatch({
			type: 'SET_DEAL_STATE',
			data: data.data
		});
	}
}
export function submit(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/dealregistration/register',
			data: state.item,
			lang: state.lang.code,
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_DEAL_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_DEAL_SAVE_ERRORS',
				errors: {}
			});
		} else {
			dispatch({
				type: 'INIT_MODULE',
				view,
				countries: state.helperData.countries,
				stopLoading: true,
			});
		}
	};
}