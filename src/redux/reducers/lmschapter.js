import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_LCR_STATUS': {
			let itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = action.status;
				return item;
			});
		}
		case 'DELETE_LCR_TOPIC_RESULT': {
			if (! action.status) return state;
			let chapterId = action.chapterId;
			return state.map(item => {
				if (item.id === chapterId)
					item.topics--;
				return item;
			});
		}
		case 'LCR_TOPIC_ADDED': {
			let chapterId = action.chapterId;
			return state.map(item => {
				if (item.id === chapterId)
					item.topics++;
				return item;
			});	
		}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'LCR_ADD_TOPIC':
		case 'HIDE_DATA_MODAL':
		case 'START_ADD_LMS_CHAPTER':
		case 'SET_LMS_CHAPTER_EDIT_DATA':
		case 'LOAD_EDIT_LMS_TOPIC_DATA':
			return {};
		case 'SET_LMS_CHAPTER_ERRORS':
		case 'SET_LCR_TOPIC_SAVE_ERRORS':
		case 'SET_LCR_MULTI_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_LCR_DATA':
			return null;
		case 'START_ADD_LMS_CHAPTER':
		case 'SET_LMS_CHAPTER_EDIT_DATA':
			return action.data;
		case 'UPDATE_DATA_VALUE':
			return {...state, [action.name]: action.value};
		case 'ADD_LCR_CHAPTER':
			return {...state, chapters: [...state.chapters, action.data]};
		case 'REMOVE_LCR_CHAPTER':
			return {
				...state,
				chapters: state.chapters.filter((_, index) => index !== action.index)
			};
		case 'UPDATE_DATA_VALUE_INDEX': {
			let nextState = {...state, chapters: [...state.chapters]};
			nextState.chapters[action.index][action.name] = action.value;
			return nextState; 
		}
		case 'SET_LCR_MULTI_ERRORS':
			return {
				...state,
				chapters: state.chapters.map((chapter, index) => {
					chapter.errors = action.chapters[index];
					return chapter;
				}),
			};
		default:
			return state;
	}
}

function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_LMS_CHAPTER':
		case 'SET_LMS_CHAPTER_EDIT_DATA':
			return {
				bcsmaps: action.bcsmaps,
				subjects: action.subjects,
			};
		default:
			return state;
	}
}

function topic(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'LCR_TOPIC_ADDED':
			return false;
		case 'LOADING_LCR_TOPIC_DATA':
			return null;
		case 'LCR_ADD_TOPIC':
		case 'SET_LCR_TOPIC_DATA':
			return action.data;
		case 'DELETE_LCR_DOCUMENT':
			return {
				...state,
				deletedDocuments: [...state.deletedDocuments, action.id],
				lmsdocuments: state.lmsdocuments.filter(item => item.id !== action.id),
			};
		default:
			return state;
	}
}

function topics (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'LOADING_LCR_TOPIC_DATA':
			return false;
		case 'LOAD_LCR_TOPICS':
			return null;
		case 'SET_LCR_TOPICS':
			return action.data;
		case 'CHANGE_LCR_TOPIC_STATUS':{
			let itemId = action.itemId;
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = action.status;
				return item;
			});
		}
		case 'DELETING_LCR_TOPIC_ITEM':
			return state.map(item => {
				item.deleting = true;
				return item;
			});
		case 'DELETE_LCR_TOPIC_RESULT': {
			if (action.status) {
				return state.filter(item => item.id !== action.id);
			} else {
				return state.map(item => {
					delete item.deleting;
					return item;
				});
			}
		}
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
		case 'LCR_TOPIC_ADDED':
		case 'SET_LMS_TOPIC_ERRORS':
		case 'CLOSE_LMS_TOPIC_MODAL':
		case 'SET_LMS_CHAPTER_ERRORS':
		case 'SET_LCR_TOPIC_SAVE_ERRORS':
			return false;
		case 'SEND_LCR_TOPIC_SAVE_REQUEST':
		case 'SEND_LMS_CHAPTER_SAVE_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	errors,
	item,
	meta,
	topic,
	topics,
	saving,

	query,
	filters,
	pageInfo,
});

export default reducer;