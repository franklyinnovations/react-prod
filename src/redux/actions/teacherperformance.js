import {bcsName} from '../../utils';
import api, {makeApiData} from '../../api';

const view = 'teacherperformance';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data: {data}} = await api({
			url: '/admin/utils/bcsByInstitute',
			cookies: state.cookies,
			data: makeApiData(state, {
				grade: true,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap)
			})),
		});
	};
}