import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'subject';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/subject',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		data.data.forEach(subject => {
			subject.subjectcategories = subject
				.subjectcategories
				.map(cat => cat.subjectcategorydetails[0].name)
				.join(', ');
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_SUBJECT'
	};
}

export function hideDataModal() {
	return {
		type: 'HIDE_DATA_MODAL'
	};
}

export function save(state) {
	return async dispatch => {
		let {data} = await api({
			url: '/admin/subject/save',
			data: makeApiData(state, {
				id: state.item.id,
				userId: state.session.id,
				is_active: state.item.is_active,
				subjectdetail: {
					id: state.item.detailId,
					name: state.item.name,
					alias: state.item.alias,
					subjectId: state.item.id,
				},
				subjectcategories: state.item.subItems.map(subItem => ({
					id: subItem.id,
					subjectId: state.item.id,
					is_active: subItem.is_active,
					subjectcategorydetail: {
						id: subItem.detailId,
						subjectCategoryId: subItem.id,
						name: subItem.name,
					},
				})),
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_SUBJECT_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/setup/subject');
		}
	};
}

export function edit(state, id, partial = 0) {
	return async dispatch => {
		dispatch({type: 'START_SUBJECT_EDIT'});

		let {data: {subject: data}} = await api({
			data: makeApiData(state, {
				id,
			}),
			url: '/admin/subject/edit',
		});
		dispatch({
			type: 'SET_SUBJECT_EDIT_DATA',
			data: {
				partial,
				id: data.id,
				display_order: data.display_order,
				is_active: data.is_active,
				name: data.subjectdetails[0].name,
				alias: data.subjectdetails[0].alias,
				detailId: data.subjectdetails[0].id,
				subName: '',
				subIndex: null,
				subItems: data.subjectcategories.map(subjectcategory => ({
					id: subjectcategory.id,
					is_active: subjectcategory.is_active,
					detailId: subjectcategory.subjectcategorydetails[0].id,
					name: subjectcategory.subjectcategorydetails[0].name,
				}))
			},
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {
				id,
				status,
			}),
			url: '/admin/subject/status' 
		});
		
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		
		dispatch({type: 'START_SUBJECT_REMOVE'});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/subject/remove'
		});

		if (status) {
			state.router.push('/setup/subject');
			return;
		}

		dispatch({
			type: 'SUBJECT_REMOVAL_FAILED',
		});
	};
}