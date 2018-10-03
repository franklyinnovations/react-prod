import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'activity';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/activity',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({
			type: 'START_ACTIVITY_EDIT',
		});

		let {data} = await api({
			data: makeApiData(state),
			url: '/admin/activity/add'
		});
		dispatch({
			type: 'START_ADD_ACTIVITY',
			activities: data.activities.map(activity => ({
				value: activity.id,
				label: activity.activitydetails[0].name,
			})),
		});
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
			url: '/admin/activity/save',
			data: makeApiData(state, {
				id: state.item.id,
				activitydetail:{
					name: state.item.name,
					id: state.item.detailId
				},
				superActivityId: state.item.superActivityId,
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ACTIVITY_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/setup/activity');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_ACTIVITY_EDIT',
			view
		});

		let {data: {data, activities}} = await api({
			data: makeApiData(state, {
				id: itemId,
			}),
			url: '/admin/activity/edit'
		});
		dispatch({
			type: 'SET_ACTIVITY_EDIT_DATA',
			data: {
				id: data.id,
				superActivityId: data.superActivityId,
				name: data.activitydetails[0].name,
				detailId: data.activitydetails[0].id
			},
			activities: activities.map(activity => ({
				value: activity.id,
				label: activity.activitydetails[0].name,
			})),
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_ACTIVITY_REMOVAL',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/activity/remove'
		});

		if (status)
			state.router.push('/setup/activity');

		dispatch({
			type: 'ACTIVITY_REMOVAL_FAILED',
		});
	};
}