import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'complaints';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		let {data} = await api({
			url: '/admin/complaint',
			cookies: state.cookies,
			params: paramsFromState(state, view),
			data: makeApiData(state, {
				academicsessionId: state.session.selectedSession.id,
			}),
		});
		data.data.forEach(item => {
			item.bcsmap = bcsName(item.bcsmap);
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOAD_CLT_FORM'});
		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/complaint/add'
		});
		dispatch({
			type: 'START_ADD_CLT',
			tags: data.tags.map(item => ({
				value: item.id,
				label: item.tagdetails[0].title,
			})),
			data: {
				bcsmapId: null,
				complaint_detail: '',
				is_penalty: false,
				fine_amount: '',
				tagIds: [],
			},
		});
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({
			type: 'SEND_COMPLAINT_REQUEST',
		});
		formData.append('userId', state.session.id);
		formData.append('academicsessionId', state.session.selectedSession.id);
		let {data} = await api({
			url: '/admin/complaint/save',
			data: makeApiData(state, formData),
		});
		if (data.errors) {
			return dispatch({
				type: 'SET_CLT_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else if (!data.status) {
			dispatch({
				type: 'SET_CLT_ERRORS',
				errors: {}
			});
		}  else {
			state.router.push('/general/complaints');
		}
	};
}

export function viewData(state, id) {
	return async dispatch => {
		dispatch({type: 'LOAD_CLT_FORM'});

		let {data: {complaint: data}} = await api({
			url: '/admin/complaint/view',
			data: makeApiData(state, {id}),
		});

		dispatch({
			type: 'SET_CLT_VIEW_DATA',
			data,
		});
	};
}

export function changeClass(state, value) {
	if (value === null)
		return {type: 'RESET_CLT_CLASS'};
	return async dispatch => {
		dispatch({type: 'CHANGING_CLT_CLASS', value});
		let {data: {data}} = await api({
			data: makeApiData(state, {
				academicsessionId: state.session.selectedSession.id,
				bcsmapId: value,
			}),
			url: '/admin/complaint/listStudents'
		});
		data.forEach(item => item.selected = false);
		dispatch({
			type: 'SET_CLT_STUDENTS',
			data,
		});
	};
}
