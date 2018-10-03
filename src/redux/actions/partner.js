import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'partner';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			url: '/admin/partner',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
		});
	};
}

export function viewData(state, itemId) {
	return async dispatch => {
		dispatch({type: 'LOADING_PARTNER_VIEW_DATA'});

		let {data: {data}} = await api({
			data: makeApiData(state),
			url: '/admin/partner/view/' + itemId
		});

		dispatch({
			type: 'SET_PARTNER_VIEW_DATA',
			data,
		});
	};
}
