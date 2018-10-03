import api, {makeErrors, makeApiData} from '../../api';

const view = 'subjectcategory';

export function init(state) {
    let filters = [],params = {
    ...state.location.query
  };
  if (state.view && state.view.viewName === view){
    params = Object.assign(params, state.view[view].filter);
    filters = state.view[view].query.filters;
  }
  return dispatch => {
    dispatch({
      type: 'LOADING_MODULE',
      view
    });
    return api({
      params,
      url: '/admin/subjectcategory',
      cookies: state.cookies,
      data: makeApiData(state),
    })
    .then(function ({data}) {
      dispatch({
        type: 'INIT_MODULE',
        view,
        data,
        query: filters,
        stopLoading: true,
      })
    })
  }
}

export function startAdd(state) {
  let data = makeApiData(state);
  return dispatch => {
    dispatch({
      type: 'LOADING_MODULE',
      view
    });

    return api({
      data: data,
      url: '/admin/subjectcategory/add'
    })
    .then(({data}) => {
      dispatch({
        type: 'START_ADD_SUBJECTCATEGORY',
        data,
        stopLoading: true,
      });
    });
  }
}

export function viewList() {
  return {
    type: 'VIEW_SUBJECTCATEGORY_LIST'
  }
}

export function save(state, userId) {
  let data = makeApiData(
    state,
    {
      id: state.item.id,
      subjectId: state.item.subjectId,
      subjectcategory_detail:
      {
        id: state.item.detailId,
        name: state.item.name,
      },
      userId
    }
  );

  if (state.item.is_active) data.is_active = 1;
  return dispatch => api({
    data,
    url: '/admin/subjectcategory/save'
  })
  .then(({data}) => {
    if (data.errors)
      return dispatch({
        type: 'SET_SUBJECTCATEGORY_ERRORS',
        errors: makeErrors(data.errors)
      });
    if (state.item.id) {
      dispatch(init(state));
    } else {
      state.router.push('/subjectcategory');
    }
  });
}

export function edit(state, itemId) {
  return dispatch => {
    dispatch({
      type: 'LOADING_MODULE',
      view
    });

    return api({
      data: makeApiData(state, {
        id:itemId
      }),
      url: '/admin/subjectcategory/edit/'
    })
    .then(({data}) => {
      dispatch({
        type: 'SET_SUBJECTCATEGORY_EDIT_DATA',
        data,
        stopLoading: true,
      });
    });
  }
}

export function changeStatus(state, itemId, status, oldstatus) {
  return dispatch => {
    dispatch({
      type: 'CHANGE_ITEM_STATUS',
      itemId,
      status: -1
    });

    return api({
      data: makeApiData(state),
      url: '/admin/subjectcategory/status/' + itemId + '/' + status
    })
    .then(({data}) => {
      dispatch({
        type: 'CHANGE_ITEM_STATUS',
        itemId,
        status: data.status ? status : oldstatus
      });
    });
  }
}