import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_JOB_LIST':
			return 'LIST';
		case 'START_ADD_JOB':
		case 'SET_ADMIN_JOB_EDIT_DATA':
			return 'DATA_FORM';
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return 'VIEW_DATA';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(item => {
				if (item.id === itemId)
					item.is_active = parseInt(action.status);
				return item;
			});
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

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state || null;
	}
}

function helperData(state = {tags: []}, action) {
	switch(action.type) {
		default:
			return state;
	}
}

const defaultItem = {
	id: '',
	detailId: '',
	title: '',
	description: '',
	experience: '',
	qualification: '',
	key_skills: '',
	designation: '',
	no_of_post: ''
}
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultItem;
		case 'SET_ADMIN_JOB_EDIT_DATA':
		case 'SET_ADMIN_JOB_VIEW_DATA':
			return {
				id: action.data.id,
				detailId: action.data.jobdetails[0].detailId,
				title: action.data.jobdetails[0].title,
				description: action.data.jobdetails[0].description,
				experience: action.data.jobdetails[0].experience,
				qualification: action.data.jobdetails[0].qualification,
				key_skills: action.data.jobdetails[0].key_skills,
				designation: action.data.jobdetails[0].designation,
				no_of_post: action.data.no_of_post
			};
		case 'UPDATE_JOB_DATA_VALUE':
			let newState = {...state};
			if(action.name) {
				newState[action.name] = action.value;
			}
			return newState;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_JOB_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	pageInfo,
	filter,
	helperData,
	item,
	errors
});

export default reducer;