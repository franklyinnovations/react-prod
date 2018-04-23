import {combineReducers} from 'redux';

function tags(state = [], action) {
	switch(action.type) {	
		case 'INIT_MODULE':
			action.data.data.currentPage = action.data.currentPage;
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(tag => {
				if (tag.id === itemId)
				tag.is_active = parseInt(action.status);
				return tag;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_TAG_EDIT_DATA':
		case 'START_ADD_TAG':
			return {};
		case 'SET_TAG_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const defaultSection = {
	title: '',
	description: '',
	type: '',
}

function tag(state = defaultSection, action) {
	switch(action.type) {
		case 'START_ADD_TAG':
			return defaultSection;
		case 'SET_TAG_EDIT_DATA':
			return {
				id: action.data.id,
				title: action.data.tagdetails[0].title,
				description: action.data.tagdetails[0].description,
				tagtypeId: action.data.tagtypeId,
				detailId: action.data.tagdetails[0].id
			};
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'SET_TAG_SAVE_ERRORS':
		case 'INIT_MODULE':
			return false;
		case 'SEND_ADD_TAG_REQUEST':
			return true;
		default:
			return state;
	}
}

const reducer = combineReducers({
	tags,
	errors,
	pageInfo,
	saving
});

export default reducer;
