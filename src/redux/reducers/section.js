import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		case 'START_ADD_SECTION':
		case 'SET_SECTION_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function sections(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(section => {
				if (section.id === itemId)
					section.is_active = parseInt(action.status);
				return section;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_ERRORS':
			return action.errors;
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

const defaultSection = {
	display_order: '',
	name: '',
	is_active: false,
}

function section(state = defaultSection, action) {
	switch(action.type) {
		case 'START_ADD_SECTION':
			return defaultSection;
		case 'SET_SECTION_EDIT_DATA':
			return {
				id: action.data.id,
				display_order: action.data.display_order,
				is_active: action.data.is_active,
				name: action.data.sectiondetails[0].name,
				detailId: action.data.sectiondetails[0].id
			};
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	sections,
	errors,
	pageInfo,
	filter,
	section,
});

export default reducer;