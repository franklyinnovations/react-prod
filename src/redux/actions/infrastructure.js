import api, {makeErrors, makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'infrastructure';

export function init(state){
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/infrastructure',
			cookies: state.cookies,
			data: makeApiData(state),
			params: paramsFromState(state, view),
		});
		data.infratypes = data.infratypes.map(infratype => ({
			value: infratype.id,
			label: infratype.infratypedetails[0].name,
		}));
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
	};
}

export function startAdd() {
	return {
		type: 'START_ADD_INFRASTRUCTURE',
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
			url: '/admin/infrastructure/save',
			data: makeApiData(state, {
				id: state.item.id,
				is_active: state.item.is_active,
				infratypeId: state.item.infratypeId || '',
				infrastructuredetail: {
					id: state.item.detailId,
					code: state.item.code,
					remarks: state.item.remarks,
				},
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_INFRASTRUCTURE_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			state.router.push('/setup/infrastructure');
		}
	};
}

export function edit(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'START_INFRASTRUCTURE_EDIT',
			view
		});

		let {data: {infrastructure}} = await api({
			data: makeApiData(state, {id: itemId}),
			url: '/admin/infrastructure/edit'
		});
		dispatch({
			type: 'SET_INFRASTRUCTURE_EDIT_DATA',
			data: {
				id: infrastructure.id,
				is_active: infrastructure.is_active,
				infratypeId: infrastructure.infratypeId,
				code: infrastructure.infrastructuredetails[0].code,
				remarks: infrastructure.infrastructuredetails[0].remarks,
				detailId: infrastructure.infrastructuredetails[0].id,

				infratypeName: null,
				savingInfratype: false,
			},
		});
	};
}

export function remove(state, id) {
	return async dispatch => {
		dispatch({
			type: 'START_INFRASTRUCTURE_REMOVE',
			view
		});

		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/infrastructure/remove'
		});

		if (status) {
			state.router.push('/setup/infrastructure');
		} else {
			dispatch({
				type: 'INFRA_REMOVAL_FAILED',
			});
		}
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
			url: '/admin/infrastructure/status'
		});
		
		dispatch({
			type: 'CHANGE_ITEM_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function updateInfratypeEditor(state) {
	return async dispatch => {
		let {infratypeName, infratypeId, saving} = state.item;
		if (infratypeName === null) {
			return dispatch({
				type: 'START_INFRA_TYPE_UPDATE',
				infratypeName: infratypeId === null ? '' : 
					state.meta.infratypes.find(infratype => infratype.value === infratypeId).label,
			});
		}

		if (saving) return;

		let {data} = await api({
			url: '/admin/infrastructure/save-type',
			data: makeApiData(state, {
				id: infratypeId,
				infratypedetail: {
					name: infratypeName,
				},
			}),
		});

		if (data.errors) {
			const errors = makeErrors(data.errors);
			errors.infratypeName = errors.name;
			delete errors.name;
			dispatch({
				type: 'SET_INFRA_TYPE_ERRORS',
				errors,
			});
		} else {
			dispatch({
				type: 'INFRA_TYPE_SAVED',
				created: infratypeId === null,
				data: {
					label: infratypeName,
					value: infratypeId === null ? data.data.id : infratypeId,
				},
			});
		}

	};
}