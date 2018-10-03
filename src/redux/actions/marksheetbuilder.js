import api, {makeApiData, makeErrors} from '../../api';
import {paramsFromState, bcsName, marksheetTemplates} from '../../utils';
export {updateFilter, update} from './index';
import * as marksheets from '../../marksheets';

const view = 'marksheetbuilder';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let [{data: data}, {data: {data: bcsmaps}}] = await Promise.all([
			api({
				url: '/admin/marksheetbuilder',
				cookies: state.cookies,
				data: makeApiData(state),
				params: paramsFromState(state, view),
			}),
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			bcsmaps: bcsmaps.map(bcsmap => ({
				value: bcsmap.id,
				label: bcsName(bcsmap),
			})),
		});
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOAD_MSB_FORM_DATA'});
		await api({
			url: '/admin/marksheetbuilder/add',
			data: makeApiData(state),
		});
		dispatch({
			type: 'START_ADD_MSB',
			data: {
				id: null,
				name: '',
				bcsmaps: [],
				template: null,
				is_active: true,
			},
			templates: marksheetTemplates.map((template, index) => ({
				value: template,
				label: window.__('Template {{index}}', {index: index + 1}),
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({type: 'SEND_SAVE_MSB_REQUEST'});

		let {data} = await api({
			url: '/admin/marksheetbuilder/save',
			data: makeApiData(state, {
				...state.item,
				template: state.item.template || '',
			}),
		});

		if (data.errors) {
			return dispatch({
				type: 'SET_MSB_SAVE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/exam/marksheet-builder');
		}
	};
}

export function changeStatus(state, itemId, status) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_MSB_STATUS',
			itemId,
			status: -1,
		});
		let {data} = await api({
			data: makeApiData(state, {
				id: itemId,
				status: (status === 1 ? 0 : 1),
			}),
			url: '/admin/marksheetbuilder/status'
		});
		dispatch({
			type: 'CHANGE_MSB_STATUS',
			itemId,
			status: data.status ? (status === 1 ? 0 : 1) : status,
		});
	};
}

export function remove(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'SEND_MSB_REMOVE_REQUEST',
			itemId,
		});
		let {data} = await api({
			data: makeApiData(state, {id: itemId}),
			url: '/admin/marksheetbuilder/remove'
		});
		if (data.status) {
			state.router.push('/exam/marksheet-builder');
		} else {
			dispatch({
				type: 'REMOVE_MSB_FAILED',
				itemId,
				success: data.status,
			});
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({type: 'LOAD_MSB_FORM_DATA'});
		let {data} = await api({
			data: makeApiData(state, {id: itemId}),
			url: '/admin/marksheetbuilder/edit'
		});
		let bcsmaps = data.marksheetbuilder.bcsmaps;
		for (var i = bcsmaps.length - 1; i >= 0; i--)
			bcsmaps[i] = bcsmaps[i].id;
		dispatch({
			type: 'SET_MSB_EDIT_DATA',
			data: data.marksheetbuilder,
			templates: marksheetTemplates.map((template, index) => ({
				value: template,
				label: window.__('Template {{index}}', {index: index + 1}),
			})),
		});
	};
}

export function settings(state, itemId) {
	return async dispatch => {
		dispatch({type: 'LOADING_MSB_EDITOR'});
		let {data} = await api({
			url: '/admin/marksheetbuilder/settings',
			data: makeApiData(state, {
				id: itemId,
			}),
		});
		data.preview = data.settings !== null;
		marksheets[data.template].transformTemplateData(data);
		dispatch({
			type: 'LOAD_MSB_EDITOR',
			data,
		});
	};
}

export function saveSettings(state, settings) {
	return async dispatch => {
		dispatch({type: 'SAVING_MSB_SETTINGS'});

		await api({
			url: '/admin/marksheetbuilder/save-settings',
			data: makeApiData(state, {
				id: state.editor.id,
				settings: settings,
			}),
		});

		dispatch({
			type: 'SAVED_MSB_SETTINGS',
		});
	};	
}

export function updateSettings(name, value) {
	return {
		type: 'UPDATE_MSB_SETTINGS',
		name,
		value,
	};
}

export function setEditorErrors(errors) {
	return {
		type: 'SET_MSB_EDITOR_ERRORS',
		errors,
	};
}