import api, {makeErrors, makeApiData} from '../../api';

const view = 'proxy';

export function init(state) {
	let filters = [],params = {
		...state.location.query
	};
	if (state.view && state.view.viewName === view){
		params = Object.assign(params, state.view[view].filter);
		filters = state.view[view].query.filters;
	}

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return Promise.all([
			api({
				params,
				url: '/admin/proxyclasses/add',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
			api({
				params,
				url: '/admin/proxyclasses',
				cookies: state.cookies,
				data: makeApiData(state, {
					academicSessionId: state.session.selectedSession.id,
				}),
			}),
		]).then(function ([data, proxylist]) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				proxylist:proxylist,
				data: data.data,
				query: filters,
				stopLoading: true,
			})
		})
	}
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_DATA_VALUE',
		name,
		value
	};
}

export function updateAvailablePeriod(state, itemId) {
	let day = new Date();
	let weekday = new Array("sunday","monday","tuesday","wednesday","thursday", "friday","saturday");
	return async dispatch => {
		if (itemId === null) {
			dispatch({
				type: 'SET_AVAILABLE_PERIOD',
				data: [],
			});
			return;
		}
		dispatch({
			type: 'LOADING_CLASS_PERIODS',
		});
		return api({
			url: '/admin/proxyclasses/listPeriods',
			data: makeApiData(state, {
				timetableId: itemId.split('-')[0],
				weekday: weekday[day.getDay()],
			})
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_AVAILABLE_PERIOD',
				data: data.data,
			});
		});
	}
}

export function updateAvailableTeacher(state, itemId) {
	return async dispatch => {
		if (itemId === null) {
			dispatch({
				type: 'SET_AVAILABLE_TEACHER',
				data: [],
			});
			return;
		}
		dispatch({
			type: 'LOADING_TEACHERS'
		});
		return api({
			url: '/admin/proxyclasses/listTeachers',
			data: makeApiData(state, {
				id: itemId
			})
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_AVAILABLE_TEACHER',
				data: data.data,
			})
		});
	}
}

export function save(state) {
	let data = makeApiData(
		state,
		{
			id: state.item.id,
			bcsmapId:state.item.bcsmapId ? state.item.bcsmapId.split('-')[1] : '',
			academicSessionId:state.session.selectedSession.id,
			teacherId:state.item.teacherId || '',
			timetableallocationId:state.item.timetableallocationId || '',
			date:moment().format('YYYY-MM-DD'),
			userId: state.session.id
		}
	);
	return dispatch => api({
		data,
		url: '/admin/proxyclasses/save'
	})
	.then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_PROXY_ERRORS',
				errors: makeErrors(data.errors)
			});
		if (state.item.id) {
			dispatch(init(state));
		} else {
			state.router.push('/proxy');
		}
	});
}

export function deleteItem(state, itemId) {
	return dispatch => {
		return api({
			data: makeApiData(state,
			{
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.id,
				id: itemId
			}),
			url: '/admin/proxyclasses/remove/'
		})
		.then(({data}) => {
			if(data.status){
				dispatch({
					type: 'DELETE_PROXY',
					itemId
				});
			}
		});
	}
}







