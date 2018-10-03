import api, {makeApiData} from '../../api';
import moment from 'moment';
const view  = 'empattendance';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data: {data}}, {data: roleList}] = await Promise.all([
			api({
				url: '/admin/empattendance/empList',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
					date: moment().format('YYYY-MM-DD')
				}),
			}),
			api({
				data: makeApiData(state),
				url: '/admin/role/attrolelist/' + state.session.masterId
			}),
		]);

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			roles: roleList.map(role => ({
				value: role.id,
				label: role.roledetails[0].name,
			})),
			date: moment().format(state.session.userdetails.date_format),
		});
	};
}

export function updateEmpAttendance(state, name, value){
	return async dispatch => {
		dispatch({
			type: 'UPDATING_EMPATTENDANCE_LIST',
			name,
			value,
		});

		const {data: {data}} = await api({
			url: '/admin/empattendance/empList',
			cookies: state.cookies,
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				roleId: name === 'roleId' ? value :
					state.selector.roleId,
				date: moment(name === 'date' ? value :
					state.selector.date, state.session.userdetails.date_format).format('YYYY-MM-DD'),
			}),
		});

		dispatch({
			type: 'UPDATE_EMPATTENDANCE_LIST',
			view,
			data
		});
	};
}

export function loadEmployees(state, name, value){
	return async dispatch => {
		const {data: {data}} = await api({
			url: '/admin/empattendance/empList',
			cookies: state.cookies,
			data: makeApiData(state, {
				...state.selector,
				academicSessionId: state.session.selectedSession.id,
				roleId: name === 'roleId' ? value :
					state.selector.roleId,
				date: moment(name === 'date' ? value :
					state.selector.date, state.session.userdetails.date_format).format('YYYY-MM-DD'),
			}),
		});

		dispatch({
			type: 'UPDATE_EMPATTENDANCE_LIST',
			view,
			data
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SAVING_EMPATTENDANCE'});

		let data = [],
			items = state.items;

		for (let i = items.length - 1; i >= 0; i--) {
			data.push({
				id: items[i].empattendances.length > 0 ? items[i].empattendances[0].id : '',
				userId: items[i].id,
				masterId: items[i].masterId,
				academicsessionId: state.session.selectedSession.id,
				user_type: items[i].user_type,
				roleId: items[i].roleId,
				attendancestatus: items[i].empleaves.length > 0 ? 3 : items[i].attendancestatus,
				empleaveId: items[i].empleaves.length > 0 ? items[i].empleaves[0].id : null,
				date:moment(state.selector.date, state.session.userdetails.date_format).format('YYYY-MM-DD')
			});
		}

		await api({
			url: '/admin/empattendance/save',
			data: makeApiData(state, {
				attData: data,
			}),
		});

		dispatch(loadEmployees(state, 'date', state.selector.date));
	};
}