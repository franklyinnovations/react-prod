import api, {makeErrors, makeApiData} from '../../api';

const view = 'map_tag';

export function init(state){
	let params = {
		...state.location.query
	}
	if(state.view && state.view.viewName == view)
		params = Object.assign(params, state.view.map_tag.filter);

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/maptags',
			cookies: state.cookies,
			data: makeApiData(state),
		}).then(function({data}) {
			dispatch({
				type: 'INIT_MODULE',
				view,
				data,
				stopLoading: true
			})
		})
	}
}

export function startAdd(state) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/admin/maptags/add'
		})
		.then(({data}) => {
			dispatch({
				type: 'START_ADD',
				data,
				stopLoading: true
			});
		});
	}
}

export function viewList() {
	return {
		type: 'VIEW_LIST'
	}
}

export function save(state) {
	var getData = state.addData;
	var errors = {}
	
	Object.keys(getData).forEach(function(key) {
		if(key != 'id')
	    	if(typeof getData[key] === 'object') {
	    		getData[key].length === 0 && (errors[key] = 'This field is required');
	    	} else if(getData[key] == '') {
				errors[key] = 'This field is required';
	    	}
	});

	if(Object.keys(errors).length > 0) {
		return dispatch => {
			return dispatch({
				type: 'SET_ERRORS',
				errors: errors	
			})
		}
	}
	
	let data = makeApiData(
		state,
		{id: getData.id, mappedtags: getData}
	);
	
	let apiUrlToSave = getData.id == '' ? '/admin/maptags/save' : '/admin/maptags/update';

	return dispatch => {
		return api({
			data,
			url: apiUrlToSave
		})
		.then(({data}) => {
			if(data.status) {
				dispatch(init(state))
			} else {
				dispatch({
					type: 'SET_ERRORS',
					errors: {}
				})
			}
		});
	}
}

export function deletetag(state, itemId) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state, {id: itemId}),
			url: '/admin/maptags/delete'
		})
		.then(({data}) => {
			if(data.status) {
				dispatch(init(state))
			} else {
				dispatch({
					type: 'SET_ERRORS',
					errors: {},
					stopLoading: true
				})
			}
		});
	}
}

export function edit(state, editHelData) {
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state, editHelData),
			url: '/admin/maptags/edit'
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
	}
}
