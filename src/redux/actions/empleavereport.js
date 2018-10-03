import moment from 'moment';
import api, {makeApiData} from '../../api';

const view = 'empleavereport';

export function init() {
	return {
		type: 'INIT_MODULE_SYNC',
		view,
	};
}

export function load(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_ELR',
		});
		let date_format = state.session.userdetails.date_format;
		let {data} = await api({
			url: '/admin/reports/emp-leave',
			data: makeApiData(state, {
				user_type: state.selector.user_type,
				end: moment(state.selector.end, date_format),
				start: moment(state.selector.start, date_format),
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		data.users.forEach(user => {
			user.leaves = [0, 0, 0, 0];
			for (let i = user.empleaves.length - 1; i >= 0; i--)
				user.leaves[user.empleaves[i].leavestatus] = user.empleaves[i].sum;
		});
		dispatch({
			type: 'LOAD_ELR',
			users: data.users,
		});
	};
}