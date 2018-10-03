import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'LOADING_ASSIGNMENT_VIEW_DATA':
			return null;	
		case 'SET_ASSIGNMENT_VIEW_DATA': {
			let data = action.data;
			return {
				'created_by': data.user.userdetails[0].fullname,
				'subject': data.subject.subjectdetails[0].name,
				'assignmenttitle': data.assignmentdetails[0].title,
				'start_date': data.start_date,
				'end_date': data.end_date,
				'assignmentcomment': data.assignmentdetails[0].comment,
				'assignment_file': data.assignment_file,
				'assignment_file_name': data.assignment_file_name,
				'assignmentremarks': data.assignmentremarks.length > 0 ? data.assignmentremarks[0].tag.tagdetails[0].title : ''
			};
		}	
		default:
			return state;
	}
}

const defaultHelperData = {
	bcsmaps: [],
	subjects: []
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...defaultHelperData,
				bcsmaps: action.bcsmaps,
				subjects: action.subjects,
			};
		default:
			return state;
	}
}

function saving(state = false, action) {
	switch(action.type) {
		case 'SET_ASSIGNMENT_SAVE_ERRORS':
		case 'INIT_MODULE':
			return false;
		default:
			return state;
	}
}

const reducer = combineReducers({
	items,
	item,
	saving,
	helperData,
	pageInfo,
	filters,
	query
});

export default reducer;