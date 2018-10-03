import api, {makeErrors} from '../../api';
export {update, updateFilter} from './index';

const view = 'contactUs';

export function init() {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		return api({
			url: '/admin/country/list',
			data: {
				lang: 'en',
				langId: 1,
			}
		}).then(function ({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true,
			});
		});
	};
}

export function submit(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/contacts/send',
			data: {
				...state.item,
				lang: state.lang.code,
				countries: undefined,
			},
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_CONTACT_US_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_CONTACT_US_SAVE_ERRORS',
				errors: {}
			});
		} else {
			dispatch({
				type: 'SAVED_SUCCESSFULLY',
			});
		}
	};
}