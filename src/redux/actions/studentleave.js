import api, {makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'studentleave';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			params: paramsFromState(state, view),
			url: '/admin/studentleave/list',
			cookies: state.cookies,
			data: makeApiData(state, {
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			}),
			hideMessage: true
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: data.classes && data.classes.map(item => ({
				value: item.id,
				label: bcsName(item),
			}))
		});
	};
}

export function viewData(state, id) {
	return async dispatch => {
		dispatch({type: 'LODING_STL_DATA'});
		let {data: {data}} = await api({
			url: '/admin/studentleave/view',
			data: makeApiData(state, {
				id,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'SET_STUDENT_LEAVE_VIEW_DATA',
			data,
		});
	};
}

export function changeStatus(state, itemId, status) {
	return async dispatch => {
		dispatch({type: 'SEND_UPDATE_LEAVE_STATUS_REQUEST'});

		let {data} = await api({
			data: makeApiData(state, {
				status_updatedby: state.session.id,
				status_updatedbytype: state.session.user_type
			}),
			url: '/admin/studentleave/leavestatus/' + itemId + '/' + status
		});
		if(data.status){
			dispatch({
				type: 'CHANGE_ITEM_STATUS',
				itemId,
				status,
			});
		}
		dispatch({type: 'HIDE_DATA_MODAL'});
	};
}
