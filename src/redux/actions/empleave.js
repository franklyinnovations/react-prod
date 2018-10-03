import moment from 'moment';
import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, dialog} from '../../utils';
export {update, updateFilter} from './index';

const view = 'empleave';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			hideMessage: true,
			url: '/admin/empleave',
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
			data,
			leavetypeOptions: data.leavetypes.map(item => ({
				value: item.id,
				label: item.empleavetypedetails[0].name,
			})),
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
			type: 'START_EL_VIEW',
			view
		});

		const {data: {data}} = await api({
			hideMessage: true,
			url: '/admin/empleave/view/' + itemId,
			data: makeApiData(state, {
				userId: state.session.id,
				user_type: state.session.user_type,
				academicSessionId: state.session.selectedSession.id
			}),
		});
		dispatch({
			type: 'SET_EL_VIEW_DATA',
			data,
		});
	};
}

export function changeStatus(state, status) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_EL_STATUS',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/empleave/leavestatus/' + state.item.id + '/' + status
		});

		if (data.status) {
			dispatch({
				type: 'EL_STATUS_CHANGED',
				status,
				id: state.item.id,
			});
		} else {
			dispatch({
				type: 'EL_STATUS_CHANGE_FAILED',
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
			url: '/admin/empleave/apply',
			hideMessage: true
		});

		const tags = data.tags.map(tag => ({value: tag.id, label: tag.tagdetails[0].title}));
		tags.push({value: 0, label: window.__('Other')});

		dispatch({
			type: 'START_ADD_EL',
			data: {
				empLeaveTypeId: '',
				start_date: null,
				end_date: null,
				tagId: null,
				comment: '',
				duration: null,
				leaveDay: 0,
				halfday: 1,
				balance: 0,
			},
			tags,
			leaveTypes: data.leaveTypes.map(item => ({
				value: item.id,
				label: item.empleavetypedetails[0].name,
				balance: item.balance
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_EL'});
		const {data} =  await api({
			url: '/admin/empleave/save',
			data: makeApiData(state, {
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
				user_type: state.session.user_type,

				duration: state.item.duration,
				empLeaveTypeId: state.item.empLeaveTypeId || '',
				balance: state.item.balance,
				start_date: state.item.start_date ? moment(state.item.start_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
				end_date: state.item.end_date ? moment(state.item.end_date, state.session.userdetails.date_format).format('YYYY/MM/DD') : '',
				tagId: state.item.tagId === null ?  '' : state.item.tagId,
				comment: state.item.tagId === 0 ? state.item.comment : undefined,
				halfday: state.item.duration === 0.5 ? state.item.halfday : undefined,
			})
		});

		if (data.errors) {
			dispatch({
				type: 'SET_EL_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/hrm/empleave');
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
					url: '/admin/empleave/reject'
				});

				if (data.status) {
					dispatch({
						type: 'EL_STATUS_CHANGED',
						status: 3,
						id: state.item.id,
					});
				} else {
					dispatch({
						type: 'EL_STATUS_CHANGE_FAILED',
						id: state.item.id,
					});
				}
			}
		});
	};
}