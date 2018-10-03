import api, {makeErrors, makeApiData} from '../../api';
import {dialog, paramsFromState} from '../../utils';
export {updateFilter} from './index';
import moment from 'moment';

const view = 'feechallan';

export function init(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE',view});
		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/feechallan',
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

export function approve(state) {
	return async dispatch => {
		dispatch({type: 'SEND_FCN_APPROVAL_REQUEST'});

		let {data} = await api({
			data: makeApiData(state, {
				id: state.approval.id,
				remarks: state.approval.remarks,
				approval_date: state.approval.approval_date === null ? ''
					: moment(
						state.approval.approval_date,
						state.session.userdetails.date_format,
					).format('YYYY-MM-DD'),
			}),
			url: '/admin/feechallan/approve'
		});

		if (data.errors) {
			dispatch({
				type: 'SET_FCN_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			state.router.push(state.router.location);
		}
		
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({type: 'START_FCN_REMOVE', id});
		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/feechallan/remove'
		});
		if (status) {
			state.router.push(state.router.location.pathname);
		} else {
			dispatch({type: 'FCN_REMOVAL_FAILED'});
		}
	};
}

export async function mail(state, feesubmissionId, error = '', value = '') {
	dialog.prompt({
		placeholder: window.__('Email'),
		input: '<div class="has-error"><input type="text" name="email" value="'+value+'"/><div class="help-block">' + error + '</div></div>',
		message: window.__('Send Invoice'),
		callback: (email => {
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (email === false) {
				return;
			} else if (email.trim().length === 0) {
				mail(state, feesubmissionId, window.__('This is a required field.'), email);
			} else if (!re.test(email)) {
				mail(state, feesubmissionId, window.__('Invalid Email.'), email);
			} else {
				api({
					url: '/admin/feechallan/mail',
					data: makeApiData(state, {
						email,
						feesubmissionId,
						academicSessionId: state.session.selectedSession.id,
					}),
				});
			}
		}),
	});
}