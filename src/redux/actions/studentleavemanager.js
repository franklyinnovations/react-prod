import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, dialog} from '../../utils';
export {update, updateFilter} from './index';

const view = 'studentleavemanager';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			hideMessage: true,
			url: '/admin/studentleave',
			cookies: state.cookies,
			data: makeApiData(state, {
				userId: state.session.id,
				user_type: state.session.user_type,
				academicSessionId: state.session.selectedSession.id,
			}),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data
		});
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function viewItem(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_SL_VIEW',
			view
		});

		const {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/studentleave/view',
			data: makeApiData(state, {
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
				id: itemId
			}),
		});
		dispatch({
			type: 'SET_SL_VIEW_DATA',
			data,
		});
	};
}

export function changeStatus(state, status) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_SL_STATUS',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/studentleave/leavestatus/' + state.item.id + '/' + status
		});

		if (data.status) {
			dispatch({
				type: 'SL_STATUS_CHANGED',
				status,
				id: state.item.id,
			});
		} else {
			dispatch({
				type: 'SL_STATUS_CHANGE_FAILED',
				id: state.item.id,
			});
		}
	};
}

export function startAdd(state) {
	return async dispatch => {
		const {data} = await api({
			data: makeApiData(state, {
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
			}),
			url: '/admin/studentleave/add',
			hideMessage: true
		});

		const tags = data.data.map(tag => ({value: tag.id, label: tag.tagdetails[0].title}));
		tags.push({value: 0, label: window.__('Other')});

		dispatch({
			type: 'START_ADD_SL',
			data: {
				start_date: null,
				end_date: null,
				tagId: null,
				comment: '',
				duration: null,
				leaveDay: 0,
				halfday: 1,
			},
			tags,
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_SL'});
		const {data} =  await api({
			url: '/admin/studentleave/save',
			data: makeApiData(state, {
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
				user_type: state.session.user_type,
				bcsMapId: state.session.userdetails.bcsMapId,
				duration: state.item.duration,
				start_date: state.item.start_date ? moment(state.item.start_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
				end_date: state.item.end_date ? moment(state.item.end_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
				tagId: state.item.tagId === null ?  '' : state.item.tagId,
				comment: state.item.tagId === 0 ? state.item.comment : undefined,
				halfday: state.item.duration === 0.5 ? state.item.halfday : undefined,
			}),
			hideMessage: true
		});

		if (data.errors) {
			dispatch({
				type: 'SET_SL_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/student-leave');
		}
	};
}

export function reject(state, error = '') {
	return dispatch => {
		dispatch(hideDataModal());
		dialog.prompt({
			message: window.__('Reason'),
			input: '<div class="has-error"><textarea rows="5" name="reason"></textarea><div class="help-block">' + error + '</div></div>',
			callback: async reject_reason => {
				if (reject_reason === false) return;
				if (reject_reason.trim().length === 0) {
					dispatch(reject(state, window.__('Reason is required.')));
					return;
				}

				const {data} = await api({
					data: makeApiData(state, {
						reject_reason,
						id: state.item.id,
						leavestatus: 3,
						date: new Date(),
						status_updatedby: state.session.id,
						status_updatedbytype: state.session.user_type,
					}),
					url: '/admin/studentleave/reject'
				});

				if (data.status) {
					dispatch({
						type: 'SL_STATUS_CHANGED',
						status: 3,
						id: state.item.id,
					});
				} else {
					dispatch({
						type: 'SL_STATUS_CHANGE_FAILED',
						id: state.item.id,
					});
				}
			}
		});
	};
}