import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		default:
			return state;
	}	
}

function items(state = [], action) {
	let itemId;
	switch(action.type) {
		case 'INIT_MODULE':
			return action.proxylist.data.data;
		case 'DELETE_PROXY':
			itemId = parseInt(action.itemId);
			return state.filter(item => item.id !== itemId);
		default:
			return state;
	}
}

const defaultDataItem = {
	bcsmapId:null,
	timetableallocationId:'',
	teacherId:'',
	date:''
}
function item(state = defaultDataItem, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return defaultDataItem;
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			return newState;
		case 'SET_AVAILABLE_TEACHER':
			return {
				...state,
				teacherId: '',
			}
		case 'SET_AVAILABLE_PERIOD':
			return {
				...state,
				teacherId: '',
				timetableallocationId:''
			}
		default:
			return state;
	}
}

function errors(state = {}, action){
	switch(action.type) {
		case 'INIT_MODULE':
			return {};
		case 'SET_PROXY_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.proxylist.data.totalData,
				pageCount: action.proxylist.data.pageCount,
				pageLimit: action.proxylist.data.pageLimit,
				currentPage: action.proxylist.data.currentPage
			};
		default:
			return state;
	}
}

const defaultHelperData = {
	data:[],
	bcsmap: [],
	period:[],
	teacher:[],
	loadingPeriods: false,
	loadingTeachers: false

};

function helperData (state = defaultHelperData, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				...defaultHelperData,
				bcsmap:action.data.data.map(item => ({
					value: item.id + '-' + item.bcsMapId,
					label: item.bcsmap.board.boarddetails[0].alias +'-'+item.bcsmap.class.classesdetails[0].name+'-'+item.bcsmap.section.sectiondetails[0].name
				}))
			};
		case 'LOADING_CLASS_PERIODS': 
			return {
				...state,
				loadingPeriods: true
			};
		case 'SET_AVAILABLE_PERIOD':
			return {
				...state,
				period:action.data.map(item => ({
					value: item.id,
					label:item.period
				})),
				teacher: [],
				loadingPeriods: false,
				loadingTeachers: false,
			};
		case 'LOADING_TEACHERS': 
			return {
				...state,
				loadingTeachers: true
			};
		case 'SET_AVAILABLE_TEACHER':
			return {
				...state,
				teacher:action.data.map(item => ({
					value: item.id,
					label:item.user.userdetails[0].fullname
				})),
				loadingPeriods: false,
				loadingTeachers: false
			};
		default:
			return state;
	}
}

function filter(state, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state || {};
		case 'RESET_PROXY_CLASS_FILTERS':
			return {};
		case 'UPDATE_PROXY_CLASS_FILTER':
		case 'REMOVE_PROXY_CLASS_FILTERS':
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

const defaultQueryData = {
	queryItems: [],
	filters: [],
}
function query(state = defaultQueryData, action){
	switch(action.type){
		case 'INIT_MODULE':
			return {
				queryItems:action.query,
				filters: action.query
			};
		case 'RESET_PROXY_CLASS_FILTERS':
			return {...defaultQueryData}
		case 'UPDATE_PROXY_CLASS_FILTER':
		case 'REMOVE_PROXY_CLASS_FILTERS':
			let filters = state.filters.filter(item => item.name !== action.name);
			if (action.value) {
				filters.push({name: action.name, label:action.label, value:action.valueLable});
			}
			return {...state, filters}
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	item,
	helperData,
	items,
	errors,
	pageInfo,
	filter,
	query
});

export default reducer;