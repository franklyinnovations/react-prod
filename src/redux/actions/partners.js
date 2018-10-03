import api, {makeErrors} from '../../api';
export {update} from './index';

const view = 'partners';

export function init() {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			stopLoading: true,
		});
	};
}

export function submit(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/partners/send',
			data: state.item,
			lang: state.lang.code,
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_PARTNERS_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_PARTNERS_SAVE_ERRORS',
				errors: {}
			});
		} else {
			dispatch({
				type: 'INIT_MODULE',
				view,
			});
		}
	};
}