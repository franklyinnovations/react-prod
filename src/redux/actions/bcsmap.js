import api, {makeErrors, makeApiData} from '../../api';
export {updateFilter, update} from './index';

const view = 'bcsmap';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/bcsmap/boards',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		data.boards = data.boards.map(board => ({
			value: board.id,
			label: board.boarddetails[0].alias,
		}));
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			stopLoading: true,
		});
		if (data.boards.length === 0) return;
		return dispatch(loadClasses(state, data.boards[0].value));
	};
}

export function loadClasses(state, boardId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_BCSMAPS',
		});
		let {data: {data}} = await api({
			url: '/admin/bcsmap/all',
			cookies: state.cookies,
			data: makeApiData(state, {
				boardId,
			}),
		});
		const classes = data.classes.map(item => ({
			id: item.id,
			name: item.classesdetails[0].name,
			detailId: item.classesdetails[0].id,
			display_order: item.display_order,
			is_active: item.is_active,
		}));
		const sections = data.sections.map(item => ({
			id: item.id,
			name: item.sectiondetails[0].name,
			detailId: item.sectiondetails[0].id,
			display_order: item.display_order,
			is_active: item.is_active,
		}));
		const bcsmaps = {};
		for (let i = data.bcsmaps.length - 1; i >= 0; i--) {
			let bcsmap = data.bcsmaps[i];
			bcsmaps[bcsmap.classId + ':' + bcsmap.sectionId] = {
				id: bcsmap.id,
				is_active: bcsmap.is_active,
			};
		}
		dispatch({
			type: 'LOAD_BCSMAPS',
			bcsmaps,
			classes,
			sections,
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({
			type: 'SAVING_BCSMAP_ITEM',
		});

		let item = state.item;

		const {data} = await api({
			url: '/admin/' + item.type + '/save',
			data: makeApiData(state, {
				id: item.id,
				is_active: item.is_active,
				display_order: parseInt(item.display_order) || '',
				userId: state.session.id,
				[item.type + '_detail'] : {
					name: item.name,
					id: item.detailId,
					[item.type + 'Id']: item.id, 
					masterId: state.session.masterId,
				},
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_BCSMAP_ITEM_ERRORS',
				errors: makeErrors(data.errors)
			});
		} else {
			let items = item.type === 'class' ? state.classes : state.sections,
				savedItem = {
					id: data.id,
					detailId: data.detailId,
					name: item.name,
					display_order: parseInt(item.display_order),
					is_active: item.is_active,
				};

			items = !item.id ? [...items, savedItem] :
				items.map(item => item.id === savedItem.id ? savedItem : item);
			items.sort(sorting);

			dispatch({
				type: 'BCSMAP_ITEM_SAVED',
				itemType: item.type,
				items,
			});
		}
	};
}

export function edit(state, itemId, type) {
	return {
		type: 'LOAD_BCSMAP_ITEM',
		data: {
			type,
			...state[type === 'class' ? 'classes' : 'sections'].find(item => item.id === itemId),
		},
	};
}

export function remove(state, id, itemType) {
	return async dispatch => {
		dispatch({
			type: 'REMOVING_BCSMAP_ITEM',
			id,
			itemType,
		});

		const {data} = await api({
			url: '/admin/' + itemType + '/remove',
			data: makeApiData(state, {
				id,
			}),
		});

		dispatch({
			type: 'REMOVED_BCSMAP_ITEM',
			id,
			itemType,
			removed: data.status,
		});
	};
}

export function createOrRemoveBcsmap(state, classId, sectionId) {
	return async dispatch => {
		const exists = state.items[classId + ':' + sectionId];
		if (exists) {
			dispatch({type: 'REMOVING_BCSMAP', classId, sectionId});

			let {data} = await api({
				url: '/admin/bcsmap/remove/' + exists.id,
				data: makeApiData(state),
			});

			dispatch({
				type: 'REMOVED_BCSMAP',
				classId,
				sectionId,
				status: data.status,
			});
		} else {
			dispatch({type: 'CREATING_BCSMAP', classId, sectionId});

			let {data} = await api({
				url: '/admin/bcsmap/save',
				data: makeApiData(state, {
					classId,
					sectionId,
					boardId: state.meta.boardId,
				}),
			});

			dispatch({
				type: 'CREATED_BCSMAP',
				classId,
				sectionId,
				id: data.id,
			});
		}
	};
}

export function changeStatus(state, classId, sectionId, id, oldStatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGING_BCSMAP_STATUS',
			id,
			classId,
			sectionId,
		});

		let {data} = await api({
			url: '/admin/bcsmap/status/' + id + '/' + (oldStatus === '1' ? '0' : '1'),
			data: makeApiData(state),
		});

		dispatch({
			type: 'CHANGED_BCSMAP_STATUS',
			id,
			classId,
			sectionId,
			status: data.status ? (oldStatus === '1' ? 0 : 1) : parseInt(oldStatus),
		});
	};
}

export function changeBoard(state, boardId) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_BCSMAP_BOARD',
			boardId,
		});
		return dispatch(loadClasses(state, boardId));
	};
}

const sorting = (item1, item2) => (item1.display_order === item2.display_order) ?
	(item2.id - item1.id) : (item1.display_order - item2.display_order);