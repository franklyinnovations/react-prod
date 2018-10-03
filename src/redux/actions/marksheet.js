import api, {makeApiData} from '../../api';

const view = 'marksheet';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data: {bcsmaps}} = await api({
			url: '/admin/marksheet',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps,
		});
	};
}

export function changeBcsmap(state, bcsmapId) {
	if (bcsmapId === null) 
		return {
			type: 'RESET_MST_BCSMAP',
		};
	return async dispatch => {
		dispatch({
			type: 'CHANGE_MST_BCSMAP',
			bcsmapId,
		});
		const {data: {marksheetbuilders, students}} = await api({
			url: '/admin/marksheet/studentsAndMarksheetBuilders',
			data: makeApiData(state, {
				bcsmapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		students.unshift({
			id: '',
			fullname: window.__('All'),
		});
		dispatch({
			type: 'SET_MST_DATA',
			students,
			marksheetbuilders,
		});
	};
}


export function loadCreator(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MS_CREATOR',
		});

		let students = [...state.selector.students];
		if (students.length === 0 || (students.length === 1 && !students[0]))
			students = state.meta.students.map(student => student.id).slice(1);

		let {data: {template, meta}} = await api({
			url: '/admin/marksheet/creator',
			data: makeApiData(state, {
				students,
				bcsmapId: state.selector.bcsmapId,
				academicSessionId: state.session.selectedSession.id,
				marksheetbuilderId: state.selector.marksheetbuilderId,
			}),
		});

		dispatch({
			type: 'LOAD_MS_CREATOR',
			template: template,
			meta,
		});
	};
}

export function save(state, data) {
	return async dispatch => {
		dispatch({
			type: 'SAVE_MS_DATA',
		});

		await api({
			url: '/admin/marksheet/save',
			data: makeApiData(this.props, data),
		});

		dispatch({
			type: 'MS_DATA_SAVED'
		});
	};
}