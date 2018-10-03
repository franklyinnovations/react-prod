import {combineReducers} from 'redux';

function meta(state = {}, action) {
	switch(action.type) {
		case 'LOAD_MS_CREATOR':
			return {
				students: action.meta.students,
				tags: action.meta.tags.map(tag => ({
					value: tag.id,
					label: tag.tagdetails[0].title,
				})),
			};
		default:
			return state;
	}	
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'LOAD_MS_CREATOR':
		case 'SAVE_MS_DATA':
			return {};
		case 'SET_MS_DATA_ERRORS':
			return action.errors;
		default:
			return state;
	}	
}

function marksheet(state = null, action) {
	switch(action.type) {
		case 'LOAD_MS_CREATOR': {
			let state = {
					marksheetrecords: [],
				},
				marksheetrecords = [],
				cursor = 0;

			if (action.meta.marksheet) {
				state.id = action.meta.marksheet.id;
				state.data = JSON.parse(action.meta.marksheet.data);
				marksheetrecords = action.meta.marksheet.marksheetrecords;
			} else {
				state.data = {date: null};
				marksheetrecords = [];
			}

			action.meta.students.forEach(student => {
				let marksheetrecord = marksheetrecords[cursor];
				if (marksheetrecord && marksheetrecord.studentId === student.id) {
					cursor++;
					state.marksheetrecords.push(JSON.parse(marksheetrecord.data));
				} else {
					state.marksheetrecords.push({
						remarkId: null,
					});
				}
			});
			return state;
		}
		case 'UPDATE_MS_REMARK': {
			let marksheetrecords = [...state.marksheetrecords];
			marksheetrecords[action.studentIndex].remarkId = action.value;
			return {
				...state,
				marksheetrecords,
			};
		}
		case 'UPDATE_MS_DATE':
			return {
				...state,
				data: {
					...state.data,
					date: action.value,
				}
			};
		default:
			return state;
	}	
}

export default combineReducers({
	meta,
	errors,
	marksheet,
});