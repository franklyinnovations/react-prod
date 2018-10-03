import {combineReducers} from 'redux';

function viewState(state = null, action) {
  switch(action.type) {
    case 'INIT_MODULE':
    case 'VIEW_SUBJECTCATEGORY_LIST':
      return 'LIST';
    case 'START_ADD_SUBJECTCATEGORY':
    case 'SET_SUBJECTCATEGORY_EDIT_DATA':
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
      return state.map(subject => {
        if (subject.id === itemId)
          subject.is_active = parseInt(action.status);
        return subject;
      });
    default:
      return state;
  }
}

function errors(state = {}, action) {
  switch(action.type) {
    case 'INIT_MODULE':
    case 'START_ADD_SUBJECTCATEGORY':
    case 'SET_SUBJECTCATEGORY_EDIT_DATA':
      return {};
    case 'SET_SUBJECTCATEGORY_ERRORS':
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
    case 'REMOVE_FILTERS':
      newState = {...state};
      delete newState[action.name];
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
    case 'RESET_FILTERS':
      return {...defaultQueryData}
    case 'UPDATE_FILTER':
    case 'REMOVE_FILTERS':
      let filters = state.filters.filter(item => item.name !== action.name);
      if (action.value) {
        filters.push({name: action.name, label:action.label, value:action.valueLable});
      }
      return {...state, filters}
    default:
      return state;
  }
}

const defaultDataItem = {
  name: '',
  subjectId:'',
  is_active: true,
}

function item(state = defaultDataItem, action) {
  switch(action.type) {
    case 'START_ADD_SUBJECTCATEGORY':
      return defaultDataItem;
    case 'SET_SUBJECTCATEGORY_EDIT_DATA':
      return {
        id: action.data.data.id,
        subjectId: action.data.data.subjectId,
        display_order: action.data.data.display_order,
        name: action.data.data.subjectcategorydetails[0].name,
        detailId: action.data.data.subjectcategorydetails[0].id,
        is_active: action.data.data.is_active,
      };
    case 'UPDATE_DATA_VALUE':
      let newState = {...state};
      newState[action.name] = action.value;
      if(action.name === 'subjectId' && !action.value){
        newState[action.name] = '';
      }
      return newState;
    default:
      return state;
  }
}

const defaultHelperData = {
  subjects: [],
};

function helperData (state = defaultHelperData, action) {
  switch(action.type) {
    case 'START_ADD_SUBJECTCATEGORY':
    case 'SET_SUBJECTCATEGORY_EDIT_DATA':
      return {
        subjects: action.data.subjects.map(item => ({
          value: item.id,
          label: item.subjectdetails[0].name
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
  query,
  helperData,
});

export default reducer;