import {combineReducers} from 'redux';

function item (state = {}, action) {
	switch(action.type) {
		case 'SAVED_FEED':
		case 'INIT_MODULE_SYNC':
			return {
				bcsmapId: 0,
				description: '',
				feedrecords: [],
				saving: false,
				controlUserId: null,
			};
		case 'UPDATE_DATA_VALUE':
			return {...state, [action.name]: action.value};
		case 'FEED_ADD_FILE':
			return {...state, feedrecords: [...state.feedrecords, action.feedrecord]};
		case 'FEED_REMOVE_FILE':
			return {...state, feedrecords: state.feedrecords.filter(({id})=> id !== action.id)};
		case 'SAVING_FEED':
			return {...state, saving: true};
		default:
			return state;
	}
}

function items (state = [], action) {
	switch(action.type) {
		case 'LOAD_FEED_ITEMS':
			return [...state, ...action.data];
		case 'SAVED_FEED':
		case 'UPDATE_FEED_SELECTOR':
			return [];
		case 'FEED_LIKE':
			return state.map(item => {
				if (item.id === action.id) {
					item.liked = !item.liked;
					item.likes += item.liked ? 1 : -1;
				}
				return item;
			});
		case 'FEED_APPROVE':
			return state.map(item => {
				if (item.id === action.id) {
					item.approved = action.approved;
				}
				return item;
			});
		case 'FEED_DELETE':
			return state.filter(item => item.id !== action.id);
		default:
			return state;
	}
}

function meta (state = {selector: 0, loading: false, more: 0}, action) {
	switch(action.type) {
		case 'LOAD_FEED_ITEMS':
			return {...state, loading: false, more: action.more};
		case 'LOADING_FEED_ITEMS':
			return {...state, loading: true};
		case 'UPDATE_FEED_SELECTOR':
			return {...state, selector: action.selector};
		case 'SAVED_FEED':
			return {...state, selector: 1};
		default:
			return state;
	}
}

export default combineReducers({
	item,
	items,
	meta,
});