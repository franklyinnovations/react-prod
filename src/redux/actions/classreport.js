import api, {makeApiData} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter, update} from './index';
import moment from 'moment';

const view = 'classreport';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		const params = paramsFromState(state, view);
		if (state.view && state.view.name === view && state.view.state.meta.date) {
			params.date = moment(
				state.view.state.meta.date,
				state.session.userdetails.date_format,
			).format('YYYY-MM-DD');
		} else {
			params.date = moment().format('YYYY-MM-DD');
		}


		let [{data: meta}, reports] = await Promise.all([
			api({
				params,
				cookies: state.cookies,
				data: makeApiData(state),
				url: '/admin/classreport/meta',
			}),
			api({
				params,
				cookies: state.cookies,
				url: '/admin/classreport',
				data: makeApiData(state, {
					userId: state.session.id,
					user_type: state.session.user_type,
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
		]);

		dispatch({
			type: 'INIT_MODULE',
			view,
			data: reports.data,
			bcsmaps: meta.bcsmaps.map(bcsmap => ({
				label: bcsName(bcsmap),
				value: bcsmap.id,
			})),
			users: meta.users.map(user => ({
				label: user.userdetails[0].fullname,
				value: user.id,
			})),
			subjects: meta.subjects.map(subject => ({
				label: subject.subjectdetails[0].name,
				value: subject.id,
			})),
			date: moment(params.date, 'YYYY-MM-DD').format(
				state.session.userdetails.date_format,
			),
		});
	};
}

export function viewReport(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_CR'});
		let {data: {data}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/classreport/view/' + id
		});
		data.content = {__html: data.content};
		dispatch({
			type: 'SET_CR_DATA',
			data,
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/classreport/status/' + itemId + '/' + status
		});

		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			itemId,
			status: data.status ? status : oldstatus
		});
	};
}