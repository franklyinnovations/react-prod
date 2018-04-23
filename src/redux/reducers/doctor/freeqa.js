import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_FQA_LIST':
			return 'LIST';
		case 'FQA_QUESTION_SET_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'REQUEST_FQA_SKIP_QUESTION':
			return state.map(item => {
				if(item.id === parseInt(action.itemId)) {
					item.skipped = true;
				}
				return item;
			});
		case 'FQA_QUESTION_SKIPPED_ERROR':
			return state.map(item => {
					delete item.skipped;
				return item;
			});
		case 'FQA_QUESTION_SKIPPED':
			return state.filter(item => item.id !== parseInt(action.itemId));
		default:
			return state;
	}	
}

function filter(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...state,
				loading: false
			};
		case 'FQA_UPDATE_FILTER':
			var newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			newState.loading = true;
			return newState;
		default:
			return state;
	}
}

const defaultItem = {
	answer: '',
	id: '',
	patientquestionId: '',
	is_for_profile: true,
	answerView: false,
	data: [],
};
function item(state = defaultItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...defaultItem,
				data: []
			};
		case 'FQA_QUESTION_SET_DATA':
			return {
				...defaultItem,
				id: action.data.question_answers.length > 0 ? action.data.question_answers[0].id:'',
				answer: action.data.question_answers.length > 0 ? action.data.question_answers[0].answer:'',
				is_for_profile: action.data.question_answers.length > 0 ? action.data.question_answers[0].is_for_profile:'',
				patientquestionId: action.data.id,
				answerView: action.answerView,
				data: action.data
			}
		case 'FQA_UPDATE_DATA_VALUE':
			let newData = {...state};
			if(action.name){
				newData[action.name] = action.value;
			}
			return newData;
		default:
			return state;
	}	
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'FQA_QUESTION_SET_DATA':
			return {};
		case 'SET_FQA_ERRORS':
			return action.errors;
		default:
			return state;
	}	
}

function saving(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
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

function helperData(state = {tags: []}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			let tags = action.data.tags.map(item => ({
				value: item.id,
				label: item.tagdetails[0].title
			}));
			tags.unshift({
				value: 'all',
				label: 'All Type'
			});
			return {tags};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	item,
	errors,
	saving,
	filter,
	pageInfo,
	helperData
});

export default reducer;