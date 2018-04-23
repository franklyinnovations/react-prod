import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
function viewState(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'VIEW_LIST':
			return 'LIST';
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return 'DATA_FORM';
		default:
			return state;
	}
}

function myschedule(state = [], action) {

	switch(action.type) {
		case 'INIT_MODULE':

			return {data:action.data.data.data,active_schedule:action.data.data.active_schedule,hospital_name:action.data.data.hospital_name,address:action.data.data.address};
		case 'CHANGE_ITEM_STATUS':
			var itemId = parseInt(action.itemId);
			return state.map(doctor => {
				if (doctor.id === itemId)
					doctor.is_active = parseInt(action.status);
				return doctor;
			});
		default:
			return state;
	}
}

function errors(state = {}, action) {
	
	switch(action.type) {
		case 'INIT_MODULE':
		case 'START_ADD':
		case 'SET_EDIT_DATA':
			return {};
		case 'INIT_ERRORS':
			return {};
		case 'SET_ERRORS':
			return action.errors;
		default:
			return state;
	}
}

function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.data.totalData,
				pageCount: action.data.data.pageCount,
				pageLimit: action.data.data.pageLimit,
				currentPage: action.data.data.currentPage
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
	id: '',
	article_image: '',
	'article_details[title]': '',
	'article_details[body]': '',
	article_tags: [],
	status: '',
	isVisibleSug:false,
	model_email:'',
	model_name:'',
	model_mobile:'',
	model_id:'',
	suggestion:'',
	isDisableContinueBtn:true,
	isVisibleBlock:false,
	from_date:moment().format('YYYY-MM-DD'),
	to_date:moment().format('YYYY-MM-DD'),
	leave_details:'',
	hospital_id:'',
	status_id:'',
	scheduleList:[],
	isDisableBlockBtn:true
}

function modelData(state = defaultDataItem, action) {
 	switch(action.type) {
		case 'START_ADD':
			return defaultDataItem;
		case 'UPDATE_DATA_VALUE':
			let newState = {...state};
			newState[action.name] = action.value;
			if(action.name=='suggestion') 
			newState['isDisableContinueBtn'] = true;

			if(action.name=='leave_details') 
			newState['isDisableBlockBtn'] = true;

			if(action.name=='suggestion' && action.value !=''){
				newState['isDisableContinueBtn'] = false;
			}
			
			if(action.name=='leave_details' && action.value !=''){
				newState['isDisableBlockBtn'] = false;
			}
			return newState;

		case 'UPDATE_DATA_POPUP':
			var getData = action.data;
			return {
				...state,
				isVisibleBlock:true,
				scheduleList:getData
			}	
		case 'SET_EDIT_DATA':
			let getData = action.data.data.data;
			return {
				...state,
				id: getData.id,
				status: getData.status
			}
		default:
			return state;
	}
}

const defaultHelperData = {
	article_tags: [],
	displayViewDetailModal: false,
	displayPublishArticleModal: false
};

function helperData (state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
			var list = action.data.list;

			return {
				...state, 
				list: list.map(item => {
					return {label: item.hospital_name, value: item.id}
				})
			}
		case 'START_ADD':
		default:
			return state;
	}
}

function modalActivity(state = null, action) {
	switch(action.type) {
		case 'CLOSE_MODAL':
			return {displayViewDetailModal: false, displayPublishArticleModal: false}
		case 'SHOW_MODAL':
			let prevState = {...state}
			prevState[action.modal] = true;
			return prevState;
		default:
			return {displayViewDetailModal: false, displayPublishArticleModal: false}

	}
}

const reducer = combineReducers({
	viewState,
	myschedule,
	errors,
	pageInfo,
	filter,
	modelData,
	helperData,
	modalActivity
});

export default reducer;
