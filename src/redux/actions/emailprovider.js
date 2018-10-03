import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'emailprovider';

export function init (state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data: {data}} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/emailprovider',
			params: paramsFromState(state, view),
		});

		dispatch({
			type: 'INIT_MODULE',
			data,
			view,
		});
	};
}

export function activate(state, id) {
	return async dispatch => {
		dispatch({
			type: 'SEND_EMAIL_PROVIDER_ACTIVATION_REQUEST',
			id,
		});
		await api({
			data: makeApiData(state, {id}),
			url: '/admin/emailprovider/activate/',
		});
		dispatch({
			type: 'CHANGE_EMAIL_PROVIDER',
			id,
		});
	};
}