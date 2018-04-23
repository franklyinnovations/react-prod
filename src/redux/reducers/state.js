import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_STATE_LIST':
			return 'LIST';
		case 'START_ADD_STATE':
		case 'SET_STATE_EDIT_DATA':
			return 'DATA_FORM';
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

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD_STATE':
		case 'SET_STATE_EDIT_DATA':
			return {};
		case 'SET_STATE_ERRORS':
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

const defaultDataItem = {
	name: '',
	alias: '',
	countryId: '',
	code: '',
	is_active: ''
}

function item(state = defaultDataItem, action) {
	switch(action.type) {
		case 'START_ADD_STATE':
			return defaultDataItem;
		case 'SET_STATE_EDIT_DATA':
			return {
				id: action.data.data.id,
				code: action.data.data.code,
				alias: action.data.data.alias,
				countryId: action.data.data.countryId,
				name: action.data.data.statedetails[0].name,
				detailId: action.data.data.statedetails[0].id,
				is_active: action.data.data.is_active
			};
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		default:
			return state;
	}
}

const defaultHelperData = {
	countries: []
};

function helperData (state = defaultHelperData, action) {
    switch(action.type) {
            
		case 'START_ADD_STATE': 
			return {
				countries: action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				}))
			};
		case 'SET_STATE_EDIT_DATA':
			return {
				countries: action.data.countries.map(item => ({
					value: item.id,
					label: item.countrydetails[0].name
				}))
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	errors,
	pageInfo,
	filter,
	item,
	helperData
});

export default reducer;