import api, {makeErrors, makeApiData} from '../../api';
import {messenger, paramsFromState, bcsName} from '../../utils';
export {updateFilter} from './index';

const view = 'lmschapter';

export function init(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE',view});
		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/lmschapter',
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
			subjects: data.subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name,
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_LCR_DATA'});
		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/lmschapter/add'
		});
		dispatch({
			type: 'START_ADD_LMS_CHAPTER',
			data: {
				bcsmapId: null,
				subjectId: null,
				chapters: [{
					name: '',
					errors: {},
					is_active: 1,
					chapter_number: '',
				}],
			},
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
			subjects: data.subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name,
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SEND_LMS_CHAPTER_SAVE_REQUEST'});
		if (state.item.id) {
			let {data} = await api({
				data: makeApiData(state, {
					id: state.item.id,
					is_active: state.item.is_active,
					bcsmapId:state.item.bcsmapId || '',
					subjectId:state.item.subjectId || '',
					lmschapterdetail: {
						id: state.item.detailId,
						name: state.item.name,
						chapter_number: state.item.chapter_number,
					},
				}),
				url: '/admin/lmschapter/save',
			});
			if (data.errors) {
				dispatch({
					type: 'SET_LMS_CHAPTER_ERRORS',
					errors: makeErrors(data.errors)
				});
			} else {
				state.router.push(state.router.location.pathname);
			}
		} else {
			if (state.item.chapters.length === 0) {
				messenger.post({
					type: 'error',
					message: window.__('Please create at least on chapter'),
				});
				return;
			}
			let {data} = await api({
				data: makeApiData(state, {
					bcsmapId: state.item.bcsmapId || '',
					subjectId: state.item.subjectId || '',
					chapters: state.item.chapters,
				}),
				url: '/admin/lmschapter/save-many',
			});
			if (data.errors || data.chapters) {
				dispatch({
					type: 'SET_LCR_MULTI_ERRORS',
					errors: makeErrors(data.errors || []),
					chapters: data.chapters.map(errors => makeErrors(errors || [])),
				});
			} else {
				state.router.push(state.router.location.pathname);
			}
		}
		
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_LCR_DATA'});
		let {data} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/lmschapter/edit'
		});
		dispatch({
			type: 'SET_LMS_CHAPTER_EDIT_DATA',
			data: {
				id: data.data.id,
				bcsmapId: data.data.bcsmapId,
				subjectId: data.data.subjectId,
				is_active: data.data.is_active,
				name: data.data.lmschapterdetails[0].name,
				detailId: data.data.lmschapterdetails[0].id,
				chapter_number: data.data.lmschapterdetails[0].chapter_number,
			},
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
			subjects: data.subjects.map(item => ({
				value: item.id,
				label: item.subjectdetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_LCR_STATUS',
			itemId,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {
				id: itemId,
				is_active: status
			}),
			url: '/admin/lmschapter/status'
		});
		
		dispatch({
			type: 'CHANGE_LCR_STATUS',
			itemId,
			status: data.status ? status : oldstatus
		});
	};
}

export function updateData(name, value) {
	return {
		type: 'UPDATE_LMS_CHAPTER_DATA_VALUE',
		name,
		value
	};
}

export function saveTopic(state, formData) {
	return async dispatch => {
		let
			adding = !state.topic.id,
			chapterId = state.topic.lmschapterId;
		formData.append('id', state.topic.id || '');
		formData.append('lmschapterId', state.topic.lmschapterId);
		formData.append('deletedDocuments', JSON.stringify(state.topic.deletedDocuments));
		dispatch({type: 'SEND_LCR_TOPIC_SAVE_REQUEST'});
		let {data} = await api({
			data: makeApiData(state, formData),
			url: '/admin/lmschapter/savetopic',
		});
		if (data.errors) {
			dispatch({
				type: 'SET_LCR_TOPIC_SAVE_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			if (data.status) {
				if (adding) {
					dispatch({type: 'LCR_TOPIC_ADDED', chapterId});
				} else {
					dispatch({type: 'HIDE_DATA_MODAL'});
				}
			} else {
				dispatch({type: 'SET_LCR_TOPIC_SAVE_ERRORS', errors: {}});
			}
		}
	};
}

export function editTopic(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_LCR_TOPIC_DATA'});
		let {data: {data}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/lmschapter/editTopic'
		});
		dispatch({
			type: 'SET_LCR_TOPIC_DATA',
			data: {
				id: data.id,
				deletedDocuments: [],
				is_active: data.is_active,
				lmschapterId: data.lmschapterId,
				name: data.lmstopicdetails[0].name,
				lmsdocuments: data.lmstopicdocuments,
				content: data.lmstopicdetails[0].content,
			},
		});
	};
}

export function viewTopics(state, lmschapterId) {
	return async dispatch => {
		dispatch({type: 'LOADING_LCR_TOPICS'});
		let {data} = await api({
			url: '/admin/lmschapter/topicList',
			data: makeApiData(state, {lmschapterId}),
		});
		dispatch({
			type: 'SET_LCR_TOPICS',
			data: data.data
		});
	};
}

export function changeTopicStatus(state, itemId, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_LCR_TOPIC_STATUS',
			itemId,
			status: -1
		});
		let {data} = await api({
			data: makeApiData(state, {
				id: itemId,
				is_active: status
			}),
			url: '/admin/lmschapter/topicstatus'
		});
		dispatch({
			type: 'CHANGE_LCR_TOPIC_STATUS',
			itemId,
			status: data.status ? status : oldstatus
		});
	};
}

export function deleteTopic(state, id, chapterId) {
	return async dispatch => {
		dispatch({type: 'DELETING_LCR_TOPIC_ITEM', id});
		let {data} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/lmschapter/deleteTopic',
		});
		dispatch({
			type: 'DELETE_LCR_TOPIC_RESULT',
			id,
			chapterId,
			status: data.status,
		});
	};
}
