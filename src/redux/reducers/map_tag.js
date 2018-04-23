import {combineReducers} from 'redux';
import {tagtypeIds} from '../../utils';

function viewState(state = 'LIST', action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}
}

function mapped_tags(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SET_EDIT_DATA':
		case 'START_ADD':
			return {};
		case 'SET_ERRORS':
			return action.errors;	
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

const defaultAddData = {
	id: '',
	specializationTagId: '',
	problemtypeTagId: []
}

function addData(state = defaultAddData, action) {
	switch(action.type) {
		case 'START_ADD': 
			return {id: '', specializationTagId: '', problemtypeTagId: []}
		case 'SET_EDIT_DATA':
			let data = action.data.data[0];
			return {
				id: data.id,
				specializationTagId: data.specializationTagId, 
				problemtypeTagId: data.problemtypetags.split(",")
			}
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

const defaultHelperData = {
	specializationTags: [],
	problemtypeTags: []
}
function helperData(state = defaultHelperData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			var prevState = {...state};
			var data = action.data.allTagsData;
			var getTagsData = setTagsData(data);
			return {
				...state, 
				specializationTags: getTagsData.specializationTags,
				problemtypeTags: getTagsData.problemtypeTags
			};
		case 'START_ADD':
			var prevState = {...state};
			var data = action.data.data;
			var getTagsData = setTagsData(data);
			return {
				...state, 
				specializationTags: getTagsData.specializationTags,
				problemtypeTags: getTagsData.problemtypeTags
			};
		case 'SET_EDIT_DATA':
			var prevState = {...state};
			var data = action.data.helperData;
			var getTagsData = setTagsData(data);
			return {
				...state, 
				specializationTags: getTagsData.specializationTags,
				problemtypeTags: getTagsData.problemtypeTags
			};
		default:
			return state;
	}
}

function setTagsData(data) {
	if(data.length === 0) return {specializationTags: [], problemtypeTags: []};
	let specializationTags = [], problemtypeTags = [];
	let tagtypes = tagtypeIds();
	data.forEach(function(item){
  		item.tagtypeId === tagtypes['SpecializationTagId'] && (specializationTags.push({label: item.tagdetails[0].title, value: item.id}))
  		item.tagtypeId === tagtypes['ProbleTypeTagId'] && (problemtypeTags.push({label: item.tagdetails[0].title, value: item.id}))
	});
	return {
		specializationTags: specializationTags,
		problemtypeTags: problemtypeTags
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

const reducer = combineReducers({
	errors,
	viewState,
	helperData,
	addData,
	pageInfo,
	filter,
	mapped_tags
});

export default reducer;
