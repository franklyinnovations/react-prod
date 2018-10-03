import {combineReducers} from 'redux';

function todo (state = {items: false, item: false, errors: {}, saving: false}, action) {
	switch(action.type) {
		case 'LOADING_TDB_TODO':
			return {
				...state,
				items: null,
			};
		case 'LOAD_TDB_TODO':
			return {
				...state,
				items: action.data,
			};
		case 'START_TDB_TODO_ADD':
			return {
				...state,
				errors: {},
				item: action.data,
			};
		case 'UPDATE_TDB_TODO_ITEM':
			return {
				...state,
				item: {...state.item, [action.name]: action.value},
			};
		case 'HIDE_DATA_MODAL':
			return {...state, item: false};
		case 'TDB_TODO_SAVED':
			return {...state, items: [...state.items, action.data], saving: false, item: false};
		case 'SET_TODO_ERRORS':
			return {...state, errors: action.errors};
		case 'SAVING_TDB_TODO':
			return {...state, saving: false};
		case 'START_TBD_TODO_REMOVE': {
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
		case 'TBD_TODO_REMOVAL_RESULT': {
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
		case 'LOADING_TDB_CLASSES':
			return null;
		case 'LOAD_TDB_CLASSES':
			return action.data;
		default:
			return state;
	}
}

function leaves (state = null, action) {
	switch(action.type) {
		case 'LOADING_TDB_LEAVES':
			return null;
		case 'LOAD_TDB_LEAVES':
			return action.data;
		default:
			return state;
	}
}

function studentleaves (state = null, action) {
	switch(action.type) {
		case 'LOADING_TDB_STUDENT_LEAVES':
			return null;
		case 'LOAD_TDB_STUDENT_LEAVES':
			return action.data;
		default:
			return state;
	}
}

function events (state = null, action) {
	switch(action.type) {
		case 'LOADING_TDB_EVENTS':
			return null;
		case 'LOAD_TDB_EVENTS':
			return action.data;
		default:
			return state;
	}
}

function exams (state = null, action) {
	switch(action.type) {
		case 'LOADING_TDB_EXAMS':
			return null;
		case 'LOAD_TDB_EXAMS':
			return action.data;
		default:
			return state;
	}
}

function assignments (state = null, action) {
	switch(action.type) {
		case 'LOADING_TDB_ASSIGNMENTS':
			return null;
		case 'LOAD_TDB_ASSIGNMENTS':
			return action.data;
		default:
			return state;
	}
}

export default combineReducers({
	todo,
	classes,
	leaves,
	studentleaves,
	events,
	exams,
	assignments,
});