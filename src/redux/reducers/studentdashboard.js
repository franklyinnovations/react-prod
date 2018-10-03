import {combineReducers} from 'redux';

function todo (state = {items: false, item: false, errors: {}, saving: false}, action) {
	switch(action.type) {
		case 'LOADING_SDB_TODO':
			return {
				...state,
				items: null,
			};
		case 'LOAD_SDB_TODO':
			return {
				...state,
				items: action.data,
			};
		case 'START_SDB_TODO_ADD':
			return {
				...state,
				errors: {},
				item: action.data,
			};
		case 'UPDATE_SDB_TODO_ITEM':
			return {
				...state,
				item: {...state.item, [action.name]: action.value},
			};
		case 'HIDE_DATA_MODAL':
			return {...state, item: false};
		case 'SDB_TODO_SAVED':
			return {...state, items: [...state.items, action.data], saving: false, item: false};
		case 'SET_TODO_ERRORS':
			return {...state, errors: action.errors};
		case 'SAVING_SDB_TODO':
			return {...state, saving: false};
		case 'START_SDB_TODO_REMOVE': {
			let id = action.id;
			return {
				...state,
				items: state.items.map(todo => {
					if (todo.id === id)
						todo.removing = true;
					return todo;
				}),
			};
		}
		case 'SDB_TODO_REMOVAL_RESULT': {
			let id = action.id;
			return action.status ? {
				...state,
				items: state.items.filter(todo => todo.id !== id),
			} : {
				...state,
				items: state.items.map(todo => {
					if (todo.id === id)
						todo.removing = false;
					return todo;
				}),
			};
		}
		default:
			return state;
	}
}

function classes (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_CLASSES':
			return null;
		case 'LOAD_SDB_CLASSES':
			return action.data;
		default:
			return state;
	}
}

function leaves (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_LEAVES':
			return null;
		case 'LOAD_SDB_LEAVES':
			return action.data;
		default:
			return state;
	}
}

function events (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_EVENTS':
			return null;
		case 'LOAD_SDB_EVENTS':
			return action.data;
		default:
			return state;
	}
}

function circulars (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_CIRCULARS':
			return null;
		case 'LOAD_SDB_CIRCULARS':
			return action.data;
		default:
			return state;
	}
}

function exams (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_EXAMS':
			return null;
		case 'LOAD_SDB_EXAMS':
			return action.data;
		default:
			return state;
	}
}

function assignments (state = null, action) {
	switch(action.type) {
		case 'LOADING_SDB_ASSIGNMENTS':
			return null;
		case 'LOAD_SDB_ASSIGNMENTS':
			return action.data;
		default:
			return state;
	}
}

export default combineReducers({
	todo,
	classes,
	leaves,
	events,
	circulars,
	exams,
	assignments
});