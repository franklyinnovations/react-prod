import {combineReducers} from 'redux';

function selector (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				roleId: 'all',
				date: action.date,
				isattendance: true
			};
		case 'UPDATING_EMPATTENDANCE_LIST':	
		case 'UPDATE_SELECTOR':
			return {
				...state,
				[action.name]: action.value,
				isattendance: true
			};
		case 'SAVING_EMPATTENDANCE':
			return {
				...state,
				isattendance: false
			};
		case 'RESET_EMP_ATT_FILTER':{
			let newState = {...state};
			newState.fullname = '';
			newState.mobile = '';
			newState.email = '';
			return newState;
		}
		default:
			return state;
	}
}

function items (state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'UPDATE_EMPATTENDANCE_LIST':
			return makeData(action.data);
		case 'UPDATING_EMPATTENDANCE_LIST':
			return null;
		case 'UPDATE_DATA_VALUE_ATTENDANCE': {
			let newState = [...state];
			let itemIndex = action.itemIndex;
			newState[itemIndex]['attendancestatus'] = action.value;
			return newState;	
		}
		case 'RESET_EMP_ATT_FILTER':
			return state.map(item => {
				item.hide = false;
				return item;
			});
		case 'APPLY_EMP_ATT_FILTER': {
			let {fullname, mobile, email} = action.filter;
			fullname = fullname.toLowerCase();
			mobile = mobile.toLowerCase();
			email = email.toLowerCase();
			return state.map(item => {
				item.hide = item.userdetails[0].fullname
					.toLowerCase().indexOf(fullname) === -1;
				item.hide = item.hide || item.mobile
					.toLowerCase().indexOf(mobile) === -1;
				item.hide = item.hide || item.email
					.toLowerCase().indexOf(email) === -1;
				return item;
			});
		}
		case 'UPDATE_ALL_EMP_ATT': {
			let newState = state.map(item => {
				item.attendancestatus = parseInt(action.value);
				return item;
			});
			return newState;
		}
		default:
			return state;
	}
}


function meta (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				roles: action.roles,
				isattendance: true
			};	
		default:
			return state;
	}
}

function errors (state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'SAVING_EMPATTENDANCE':
			return {};	
		case 'DATE_FIELD':
			return action.errors;		
		default:
			return state;
	}
}

function saving(state = false, action){
	switch(action.type){
		case 'INIT_MODULE':
		case 'UPDATE_EMPATTENDANCE_LIST':
			return false;
		case 'SAVING_EMPATTENDANCE':
			return true;
		default:
			return state;
	}
}

function makeData(data) {
	return data.map(function (item) {
		if (item.empattendances.length > 0) {
			item.attendancestatus = item.empattendances[0].attendancestatus;
		} else {
			item.attendancestatus = 1;
		}
		return item;
	});
}

export default combineReducers({
	selector,
	items,
	meta,
	errors,
	saving,
});