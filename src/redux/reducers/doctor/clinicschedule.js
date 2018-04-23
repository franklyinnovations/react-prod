import { combineReducers } from 'redux';

function hospital(state = null, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				hospital_name: action.data.hospital_name,
				address: action.data.address,
				active_schedule: action.data.active_schedule,
			};
		default:
			return state;
	}
}

function items(state = [], action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return action.data.data;
		default:
			return state;
	}
}

function pageInfo(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage,
			};
		default:
			return state;
	}
}

function filter(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state;
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			let newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state;
	}
}

function helperData(state = {}, action) {
	switch (action.type) {
		case 'INIT_MODULE':
			return {
				list: action.list
			};
		default:
			return state;
	}
}

export default combineReducers({
	hospital,
	items,
	pageInfo,
	filter,
	helperData,
});
