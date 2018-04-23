import {combineReducers} from 'redux';

function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_ADMIN_FQA_LIST':
			return 'LIST';
		case 'SET_CHAT_PAYMENT_VIEW_DATA':
		case 'SET_CHAT_PAYMENT_PAID_VIEW_DATA':
			return 'VIEW_DATA';
		default:
			return state;
	}	
}

function viewlist(state = {list: 'DUE_LIST', loading:false}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				list: 'DUE_LIST',
				loading:false
			};
		case 'CHANGE_CP_VIEW_LIST':
			return {
				list: action.name,
				loading: true
			};
		case 'INIT_LIST':
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}	
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'INIT_LIST':
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

function timestamp(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.data.timestamp;
		default:
			return state;
	}
}

function globalcommission(state = 0, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return action.globalcommission;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'INIT_LIST':
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

function item(state = {data: []}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				data: []
			};
		case 'SET_CHAT_PAYMENT_VIEW_DATA':
			return {
				doctor: action.doctor.user ? action.doctor.salutation+' '+action.doctor.user.userdetails[0].fullname:'',
				data: action.data,
				commission: action.commission
			};
		case 'SET_CHAT_PAYMENT_PAID_VIEW_DATA':
			return {
				data: action.data
			}
		default:
			return state;
	}
}

function errors(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'CLOSE_CHAT_PAYMENT_MODAL':
			return {};
		case 'SET_CP_RELEASE_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function acdetails(state = {showModal: false, data: {}}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {showModal: false, data: {}};
		case 'SHOW_CHAT_PAYMENT_ACDETAIL_MODAL':
			return {
				showModal: true,
				data: 'LOADING'
			};
		case 'SET_CHAT_PAYMENT_ACDETAIL_DATA': 
			return {
				...state,
				data: action.data
			};
		case 'CLOSE_CHAT_PAYMENT_MODAL':
			return {
				showModal: false,
				data: {}
			};
		default:
			return state;
	}
}

function release(state = {showModal: false, reference_no: '', doctorprofileId: ''}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				showModal: false,
				reference_no: '',
				doctorprofileId: ''
			};
		case 'SHOW_CHAT_PAYMENT_RELEASE_MODAL': 
			return {
				showModal: true,
				reference_no: '',
				doctorprofileId: action.doctorprofileId
			};
		case 'UPDATE_CP_RELEASE_VALUE':
			let stateData = {...state};
			if(action.name){
				stateData[action.name] = action.value;
			}
			return stateData;
		case 'CLOSE_CHAT_PAYMENT_MODAL':
			return {
				showModal: false,
				reference_no: '',
				doctorprofileId: ''
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	pageInfo,
	filter,
	item,
	errors,
	timestamp,
	acdetails,
	release,
	viewlist,
	globalcommission
});

export default reducer;