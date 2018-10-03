import {combineReducers} from 'redux';
import {query, filters, pageInfo} from './common';

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_ASSIGNMENT':
		case 'SET_ASSIGNMENT_EDIT_DATA':
		case 'LOADING_ASSIGNMENT_EDIT_DATA':
			return {};
		case 'SET_ASSIGNMENT_SAVE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		case 'CHANGE_ASSIGNMENT_STATUS': {
			let itemId = action.id;
			return state.map(item => {
				if (item.id === itemId)
					item.assignment_status = action.status;
				return item;
			});
		}
		default:
			return state;
	}
}


function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'HIDE_DATA_MODAL':
			return false;
		case 'START_ADD_ASSIGNMENT':
			return {
				'id': '',
				'detailId': '',
				'bcsMapId': '',
				'subjectId': '',
				'assignmentdetails[title]': '',
				'start_date': '',
				'end_date': '',
				'assignmentdetails[comment]': '',
				'assignment_file': '',
				'assignment_file_name': '',
			};
		case 'LOADING_ASSIGNMENT_EDIT_DATA':
			return null;	
		case 'SET_ASSIGNMENT_EDIT_DATA': {
			let data = action.data.data;
			return {
				'id': data.id,
				'detailId': data.assignmentdetails[0].id,
				'bcsMapId': data.bcsMapId,
				'subjectId': data.subjectId,
				'assignmentdetails[title]': data.assignmentdetails[0].title,
				'start_date': data.start_date,
				'end_date': data.end_date,
				'assignmentdetails[comment]': data.assignmentdetails[0].comment,
				'assignment_file': data.assignment_file,
				'assignment_file_name': data.assignment_file_name,
			};
		}
		case 'UPDATE_DATA_VALUE':
			return {
				...state,
				[action.name]: action.value,
			};
		case 'RESET_ASSIGNMENT_CLASS': 
			return {...state, bcsMapId: null};
		case 'LOAD_ASSIGNMENT_SUBJECTS': 
			return {...state, bcsMapId: action.bcsMapId};
		default:
			return state;
	}
}

const defaultHelperData = {
	bcsmaps: [],
	subjects: [],
	loadingSubject:false,
};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'START_ADD_ASSIGNMENT':
			return {
				...defaultHelperData,
				bcsmaps:action.data.bcsmaps.data.map(item => ({
					value: item.bcsmap.id,
					label: item.bcsmap.board.boarddetails[0].alias +'-'+item.bcsmap.class.classesdetails[0].name+'-'+item.bcsmap.section.sectiondetails[0].name
				})),
			};
		case 'SET_ASSIGNMENT_EDIT_DATA':
			return {
				...defaultHelperData,
				bcsmaps:action.data.bcsmaps.data.map(item => ({
					value: item.bcsmap.id,
					label: item.bcsmap.board.boarddetails[0].alias +'-'+item.bcsmap.class.classesdetails[0].name+'-'+item.bcsmap.section.sectiondetails[0].name
				})),
				subjects:action.data.subjects.data.map(item => ({
					value: item.subject.id,
					label: item.subject.subjectdetails[0].name
				})),
			};
		case 'LOAD_ASSIGNMENT_SUBJECTS':
			return {
				...state,
				subjects:[],
				loadingSubject:true
			};
		case 'SET_ASSIGNMENT_SUBJECTS':
			return {
				...state,
				subjects:action.data.subjects.data.map(item => ({
					value: item.subject.id,
					label: item.subject.subjectdetails[0].name
				})),
				loadingSubject:false
			};
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
		case 'SET_ASSIGNMENT_REMARK_ERRORS':
			return false;
		case 'SEND_ADD_ASSIGNMENT_REQUEST':
			return true;
		default:
			return state;
	}
}


function remark(state = false, action){
	switch(action.type) {
		case 'INIT_MODULE':
			return false;
		case 'LOADING_ASSIGNMENT_REMARK_DATA':
			return null;
		case 'ASSIGNMENT_REMARKS':
			return {
				assignmentId: action.assignmentId,
				tags: action.data.tagsData,
				students: action.data.data,
				showTagModal:false,
				at_tags: makeTags(action.data.data),
				tagsDesc: action.data.tagsData.reduce(((tags, tag) => (tags[tag.id] = tag, tags)), {})
			};
		case 'SHOW_TAG_MODAL':
			return {
				...state,
				studentId:action.studentId,
				showTagModal:true,
			};
		case 'CLOSE_TAG_MODAL':
			return {
				...state,
				showTagModal:false,
			};
		case 'UPDATE_ASSIGNMENT_TAG': {
			let newTags = {...state};
			if(newTags.at_tags['tag_'+action.studentId] === action.tagId) {
				newTags.at_tags['tag_'+action.studentId] = '';
			} else {
				newTags.at_tags['tag_'+action.studentId] = action.tagId;
			}
			return newTags;
		}
		default:
			return state;
	}
}

function makeTags(data){
	let status = {};
	data.forEach(function(item){
		if(item.student.assignmentremark) {	
			status['tag_'+item.student.id] = item.student.assignmentremark.tags;
		} else {
			status['tag_'+item.student.id] = '';
		}
	});
	return status;
}

const reducer = combineReducers({
	items,
	errors,
	item,
	saving,
	helperData,
	remark,
	pageInfo,
	filters,
	query
});

export default reducer;