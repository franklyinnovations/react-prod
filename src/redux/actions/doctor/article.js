import api, { makeErrors, makeApiData } from '../../../api';

const view = 'doctor_article';

export function init(state) {
	let	params = {
		...state.location.query
	};

	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		return api({
			params,
			url: '/doctor/article',
			cookies: state.cookies,
			data: makeApiData(state, {doctorProfileId: state.session.associatedProfileData.id}),
		})
		.then(function ({data}) {
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
			url: '/doctor/article/add'
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

export function edit(state, itemId) {
	let data = makeApiData(
		state,
		{
			id: itemId,
		}
	);
	return dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		return api({
			data: data,
			url: '/doctor/article/edit/'+itemId
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

export function save(state, formData, actionIndex) {
	formData.append('id', state.modelData.id)
	formData.append('userId', state.session.id)
	formData.append('status', actionIndex)
	formData.append('article_details[body]', state.modelData['article_details[body]'])
	let data = makeApiData(state, formData);
	
	return dispatch => api({
		data,
		url: '/doctor/article/save'
	}).then(({data}) => {
		if (data.errors)
			return dispatch({
				type: 'SET_ERRORS',
				errors: makeErrors(data.errors)
			});
		if(data.status) {
			dispatch(init(state));
		} else {
			return dispatch({
				type: 'SET_ERRORS',
				errors: {}
			});
		}
	});	
}