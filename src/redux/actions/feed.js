import api, {makeApiData} from '../../api';
import {messenger, bcsName} from '../../utils';
export {updateFilter, update} from './index';

const view = 'feed';

export function init() {
	return async dispatch => {
		dispatch({type: 'INIT_MODULE_SYNC', view});
		return dispatch(load());
	};
}

export function load() {
	return async (dispatch, getState) => {
		let state = getState(), url = '/admin/feed';
		if (state.view.state.meta.loading) return;
		if (state.view.state.items.length)
			url += '?id=' + state.view.state.items[state.view.state.items.length - 1].id;
		let formData = {
			academicSessionId: state.session.selectedSession.id,
		};
		if (state.view.state.meta.selector === 1) {
			formData.userId = state.session.id;
		} else if (state.view.state.meta.selector === 2) {
			formData.approvable = 1;
		}
		dispatch({type: 'LOADING_FEED_ITEMS'});
		let {data} = await api({
			url,
			cookies: state.cookies,
			data: makeApiData(state, formData),
		});
		data.data.forEach(item => {
			item.mine = item.userId === state.session.id;
			item.controlled = item.mine || item.controlUserId === state.session.id;
		});
		dispatch({
			type: 'LOAD_FEED_ITEMS',
			data: data.data,
			more: data.more,
		});
	};
}

export async function loadBcsmaps(state) {
	let {data: {bcsmaps: {data: bcsmaps}}} = await api({
		url: '/admin/assignment/bcsmaps',
		data: makeApiData(state, {
			user_type: state.session.user_type,
			userId: state.session.userdetails.userId,
			academicSessionId: state.session.selectedSession.id,
		}),
	});
	let data = [{label: window.__('All'), value: 0}];
	bcsmaps.forEach(item => data.push({
		value: item.bcsmap.id,
		label: bcsName(item.bcsmap),
	}));
	return data;
}

export async function loadTeachers(state) {
	let {data: {data}} = await api({
		url: '/admin/feed/control-users',
		data: makeApiData(state, {
			bcsmapId: state.session.userdetails.bcsMapId,
			academicSessionId: state.session.selectedSession.id,
		}),
	});
	return data.map(teacher => ({
		value: teacher.user.id,
		label: teacher.user.userdetails[0].fullname,
	}));
}

export function save(state) {
	return async dispatch => {
		if (state.item.description.trim().length === 0 && state.item.feedrecords.length === 0)
			return;
		if (state.session.user_type === 'student' && !state.item.controlUserId) {
			messenger.post({
				type: 'error',
				message: window.__('Please select a teacher'),
			});
			return;
		}

		dispatch({type: 'SAVING_FEED'});
		let data = new FormData();
		data.append('description', state.item.description);
		data.append('academicSessionId', state.session.selectedSession.id);
		if (state.item.bcsmapId) data.append('bcsmapId', state.item.bcsmapId);
		if (state.session.user_type === 'student')
			data.append('bcsmapId', state.session.userdetails.bcsMapId);
		if (state.item.controlUserId)
			data.append('controlUserId', state.item.controlUserId);
		state.item.feedrecords.forEach(item => {
			data.append('file', item.file, item.file.name);
		});
		await api({
			url: '/admin/feed/save',
			data: makeApiData(state, data),
		});
		dispatch({type: 'SAVED_FEED'});
		dispatch(load());
	};
}

export function like(state, id, liked) {
	return async dispatch => {
		dispatch({type: 'FEED_LIKE', id});
		await api({
			data: makeApiData(state, {id}),
			url: liked ? '/admin/feed/unlike' : '/admin/feed/like',
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		await api({
			url: '/admin/feed/remove',
			data: makeApiData(state, {id}),
		});
		dispatch({type: 'FEED_DELETE', id});
	};	
}

export function approve(state, id, approved) {
	return async dispatch => {
		dispatch({type: 'FEED_APPROVE', id, approved});
		await api({
			url: '/admin/feed/approve',
			data: makeApiData(state, {id, approved}),
		});
	};
}