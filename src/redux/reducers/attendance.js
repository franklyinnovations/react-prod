import {combineReducers} from 'redux';

function students (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.students || state;
		case 'REMOVE_ATT_TAG': {
			let nextState = [...state], value = action.value;
			state[action.index].tags = state[action.index].tags.split(',')
				.filter(item => item !== value).join(',');
			return nextState;
		}
		case 'RESET_ATT_FILTER':
			return state.map(item => {
				item.hide = false;
				return item;
			});
		case 'APPLY_ATT_FILTER': {
			let {fullname, enrollment_no} = action.filter;
			fullname = fullname.toLowerCase();
			enrollment_no = enrollment_no.toLowerCase();
			return state.map(item => {
				item.hide = item.student.user.userdetails[0].fullname
					.toLowerCase().indexOf(fullname) === -1;
				item.hide = item.hide || item.student.enrollment_no
					.toLowerCase().indexOf(enrollment_no) === -1;
				return item;
			});
		}
		case 'UPDATE_ALL_STUDENT_ATT': {
			let newState = state.map(item => {
				item.is_present = parseInt(action.value);
				return item;
			});
			return newState;
		}
		case 'UPDATE_STUDENT_ATT': {
			let newState = [...state];
			newState[action.itemIndex].is_present = action.value;
			return newState;
		}
		default:
			return state;
	}
}

function filter (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'RESET_ATT_FILTER':
			return {
				enrollment_no: '',
				fullname: '',
			};
		case 'UPDATE_ATT_FILTER':
			return {
				...state,
				[action.name]: action.value,
			};
		default:
			return state;
	}
}

function tag (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				selected: '',
				student: false,
				tags: action.tags,
				map: action.tags && action.tags.reduce((map, item) => {
					map[item.id] = item;
					return map;
				}, {}),
			};
		case 'HIDE_DATA_MODAL':
			return {
				...state,
				selected: '',
				student: false,
			};
		case 'SELECT_ATT_TAGS':
			return {
				...state,
				student: action.student,
				selected: action.student.tags,
			};
		case 'SET_ATT_TAGS':
			state.student.tags = action.value;
			return {
				...state,
				selected: action.value,
			};
		default:
			return state;
	}
}

function attendance (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.attendance || state;
		default:
			return state;
	}
}

function saving (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SAVED_ATT':
			return false;
		case 'SAVING_ATT':
			return true;
		default:
			return state;
	}
}

function holiday (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.holiday || state;
		default:
			return state;
	}
}

const reducer = combineReducers({
	students,
	filter,
	tag,
	attendance,
	saving,
	holiday,
});

export default reducer;