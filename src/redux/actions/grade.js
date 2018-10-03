import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, bcsName, TAG_TYPE_RESULT} from '../../utils';
export {updateFilter, update} from './index';

const view = 'grade';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data}, {data: {data: bcsmaps}}] = await Promise.all([
			api({
				url: '/admin/grade',
				cookies: state.cookies,
				data: makeApiData(state),
				params: paramsFromState(state, view),
			}),
			api({
				url: state.session.user_type === 'teacher'
					? '/admin/utils/bcsByTeacher'
					: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state, {
					userId: state.session.userdetails.userId,
					academicSessionId: state.session.selectedSession.id
				}),
			}),
		]);

		data.data.forEach(item => {
			item.bcsmaps = item.bcsmaps.map(bcsmap => bcsName(bcsmap));
			item.data = JSON.parse(item.data);
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.map(item => state.session.user_type === 'institute' ? {
				value: item.id,
				label: bcsName(item),
			} : {
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap),
			}),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'START_ADD_GRD'});
		let [{data}, tags] = await Promise.all([
			api({
				url: '/admin/grade/add',
				data: makeApiData(state)
			}),
			getResultTags(state),
		]);
		dispatch({
			type: 'SET_GRD_ADD_DATA',
			data: {
				end: '0',
				start: 0,
				data: [],
				grade: '',
				bcsmaps: [],
				result: null,
			},
			tags,
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function addGrade(state) {
	let item = state.item, errors = {};
	if (! item.end.trim()) {
		errors.end = window.__('This is required field.');
	}
	if (! item.grade.trim()) {
		errors.grade = window.__('This is required field.');
	}
	if (! item.result) {
		errors.result = window.__('This is required field.');
	}
	let end = Number(item.end);
	if (isNaN(end) || end <= item.start || end > 100)
		errors.end = window.__('Invalid Marks');

	if (Object.keys(errors).length !== 0) {
		return {type: 'SET_GRD_ERRORS', errors};
	} else {
		return {
			type: 'ADD_GRD_DATA',
			data: {
				start: item.start,
				end,
				grade: item.grade,
				result: item.result,
			},
		};
	}
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'START_GRD_EDIT'});

		const [{data: {data, bcsmaps}}, tags] = await Promise.all([
			api({
				data: makeApiData(state, {
					id,
				}),
				url: '/admin/grade/edit',
			}),
			getResultTags(state),
		]);

		data.data = JSON.parse(data.data);

		dispatch({
			type: 'SET_GRD_EDIT_DATA',
			data: {
				id,
				bcsmaps: data.bcsmaps.map(({id}) => id),
				start: data.data.length ===  0 ? 0 : data.data[data.data.length - 1].end,
				end: '',
				grade: '',
				result: null,
				data: data.data,
			},
			tags,
			bcsmaps: bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function save(state) {
	let item = state.item, errors = {};
	if (item.bcsmaps.length === 0) {
		errors.bcsmaps = window.__('This is required field.');
	}
	if (item.data.length === 0 || item.data[item.data.length - 1].end < 100) {
		errors.data = window.__('Grade Definition is not complete.');
	}

	if (Object.keys(errors).length !== 0) {
		return {
			type: 'SET_GRD_ERRORS',
			errors,
		};
	}
	return async dispatch => {
		dispatch({type: 'SEND_GRD_SAVE_REQUEST'});

		let {data} = await api({
			data: makeApiData(state, {
				id: state.item.id,
				bcsmaps: state.item.bcsmaps,
				data: JSON.stringify(state.item.data),
			}),
			url: '/admin/grade/save2',
		});

		if (data.errors) {
			dispatch({
				type: 'SET_GRD_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/exam/grade');
		}
	};
}


async function getResultTags(state) {
	let {data} = await api({
		url: '/admin/tag/list',
		data: makeApiData(state, {
			type: TAG_TYPE_RESULT,
		})
	});
	return data.data.map(tag => ({
		value: tag.tagdetails[0].title,
		label: tag.tagdetails[0].title,
	}));
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_GRD_REMOVAL'
		});
		await api({
			data: makeApiData(state,{
				id,
			}),
			url: '/admin/grade/remove'
		});
		state.router.push('/exam/grade');
	};
}