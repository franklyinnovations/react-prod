import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'contact';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			url: '/admin/contact',
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
		dispatch({type: 'LOADING_CONTACT_VIEW_DATA'});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/contact/view/' + itemId
		});

		dispatch({
			type: 'SET_CONTACT_VIEW_DATA',
			data,
		});
	};
}
