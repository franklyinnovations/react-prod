import api, {makeErrors, makeApiData} from '../../api';

const view = 'tag_for_approval';

export function init(state){
	let params = {
		...state.location.query
	}
	
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/admin/tag/for-approval',
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

export function startAdd() {
	return {
		type: 'START_ADD_TAG'
	}
}

export function viewList() {
	return {
		type: 'VIEW_LIST'
	}
}

export function save(state, userId) {
	let data = makeApiData(
		state,
		{
			id: state.tag.id,
			tagdetail:
			{
				title: state.tag.title,
				description: state.tag.description,
				id: state.tag.detailId
			},
			userId
		}
	);

	//if (!state.tag.id) {
		data.tagtypeId = state.tag.tagtypeId;
	//}

	return dispatch => {
		dispatch({
			type: 'SEND_ADD_TAG_REQUEST',
		});
		return api({
			data,
			url: '/admin/tag/save'
		})
		.then(({data}) => {
			if (data.errors)
				return dispatch({
					type: 'SET_TAG_SAVE_ERRORS',
					errors: makeErrors(data.errors)
				});
			if (state.tag.id) {
				dispatch(init(state));
			} else {
                            state.router.push('/admin/tag');
				//state.router.push('/tag');
			}
		});
	}
}

export function edit(state, itemId) {


	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: makeApiData(state),
			url: '/admin/tag/edit/' + itemId
		})
		.then(({data}) => {
			dispatch({
				type: 'SET_TAG_EDIT_DATA',
				data,
				stopLoading: true
			});
		});
	}
}

export function approveTag(state, id) {
	let data = makeApiData(
		state, { id: id }
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE'
		});

		return api({
			data: data,
			url: '/admin/tag/approve'
		})
		.then(({data}) => {
			if(data.status) {
				dispatch(init(state));
			} else {
				dispatch({
					type: 'SET_ERRORS',
					data,
					stopLoading: true
				});	
			}
		});
	}
}
