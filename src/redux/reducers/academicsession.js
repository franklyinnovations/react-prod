import {combineReducers} from 'redux';

function viewState(state = null, action) {
  switch(action.type) {
    case 'INIT_MODULE':
      return 'LIST';
    default:
      return state;
  } 
}

function academicsession(state = null, action) {
  switch(action.type) {
    case 'INIT_MODULE':
      return action.data.data;
    default:
      return state;
  }
}

function errors(state = null, action) {
  switch(action.type) {
    case 'INIT_MODULE':
      return {};
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

function filter(state = null, action) {
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
      return state;
  }
}

const reducer = combineReducers({
  viewState,
  academicsession,
  errors,
  pageInfo,
  filter
});

export default reducer;