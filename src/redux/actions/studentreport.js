import api, {makeApiData} from '../../api';
import {bcsName} from "../../utils";

const view = 'studentreport';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data: {data: bcsmaps}} = await api({
			data: makeApiData(state),
			cookies: state.cookies,
			url: '/admin/utils/allBcsByMasterId',
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: bcsmaps.map(bcsmap => ({
				value: bcsmap.id,
				label: bcsName(bcsmap),
			})),
			stopLoading: true,
		});
	};
}

export function load(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_STR',
		});
		let {data} = await api({
			url: '/admin/reports/student',
			data: makeApiData(state, {
				...state.selector,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'LOAD_STR',
			students: data.students,
		});
	};
}