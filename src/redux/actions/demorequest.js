import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter} from './index';

const view = 'demorequest';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			cookies: state.cookies,
			data: makeApiData(state),
			url: '/admin/demorequest',
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
		dispatch({type: 'LOADING_DEMO_REQUEST_VIEW_DATA'});

		let {data: {data}} = await api({
			data: makeApiData(state, {
				id: itemId
			}),
			url: '/admin/demorequest/view'
		});
		
		dispatch({
			type: 'SET_DEMO_REQUEST_VIEW_DATA',
			data,
		});
	};
}
