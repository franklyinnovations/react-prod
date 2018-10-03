import {combineReducers} from 'redux';

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				boards: action.data.boards,
				boardId: action.data.boards.length ? action.data.boards[0].value : null,
			};
		case 'CHANGE_BCSMAP_BOARD':
			return {
				...state,
				boardId: action.boardId,
			};
		default:
			return state;
	}
}

function item (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'BCSMAP_ITEM_SAVED':
			return false;
		case 'START_ADD_CLASS':
		case 'START_ADD_SECTION':
			return {
				type: action.type === 'START_ADD_CLASS' ? 'class' : 'section',
				name: '',
				display_order: '',
				is_active: true,
			};
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'LOAD_BCSMAP_ITEM':
			return action.data;
		case 'SAVING_BCSMAP_ITEM':
			return {
				...state,
				saving: true,
			};
		default:
			return state
	}
}

function items (state = null, action) {
	switch(action.type) {
		case 'LOAD_BCSMAPS':
			return action.bcsmaps;
		case 'CREATED_BCSMAP':
			return {
				...state,
				[action.classId + ':' + action.sectionId]: {
					id: action.id,
					is_active: 1,
				},
			};
		case 'REMOVED_BCSMAP': {
			if (action.status === false) return state;
			let newState = {...state};
			delete newState[action.classId + ':' + action.sectionId];
			return newState;
		}
		case 'CHANGED_BCSMAP_STATUS':
			return {
				...state,
				[action.classId + ':' + action.sectionId]: {
					id: action.id,
					is_active: action.status,
				},
			};
		case 'CHANGING_BCSMAP_STATUS':
			return {
				...state,
				[action.classId + ':' + action.sectionId]: {
					id: action.id,
					is_active: -1,
				},
			};
		case 'CHANGE_BCSMAP_BOARD':
			return null;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SAVING_BCSMAP_ITEM':
		case 'HIDE_DATA_MODAL':
			return {};
		case 'SET_BCSMAP_ITEM_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function classes (state = [], action) {
	switch(action.type) {
		case 'LOAD_BCSMAPS':
			return action.classes;
		case 'BCSMAP_ITEM_SAVED':
			return action.itemType === 'class' ? action.items : state;
		case 'REMOVED_BCSMAP_ITEM': {
			if (action.itemType === 'section') return state;
			if (action.removed) {
				return state.filter(item => item.id !== action.id);
			} else {
				return state.map(item => {
					if (item.id === action.id)
						delete item.removing;
					return item;
				});
			}
		}
		case 'REMOVING_BCSMAP_ITEM': {
			return action.itemType === 'section' ? state : 
				state.map(item => {
					if (item.id === action.id)
						item.removing = true;
					return item;
				});
		}
		default:
			return state
	}
}

function sections (state = [], action) {
	switch(action.type) {
		case 'LOAD_BCSMAPS':
			return action.sections;
		case 'BCSMAP_ITEM_SAVED':
			return action.itemType === 'section' ? action.items : state;
		case 'REMOVED_BCSMAP_ITEM': {
			if (action.itemType === 'class') return state;
			if (action.removed) {
				return state.filter(item => item.id !== action.id);
			} else {
				return state.map(item => {
					if (item.id === action.id)
						delete item.removing;
					return item;
				});
			}
		}
		case 'REMOVING_BCSMAP_ITEM': {
			return action.itemType === 'class' ? state : 
				state.map(item => {
					if (item.id === action.id)
						item.removing = true;
					return item;
				});
		}
		default:
			return state
	}
}

export default combineReducers({
	meta,
	item,
	items,
	errors,
	classes,
	sections,
});