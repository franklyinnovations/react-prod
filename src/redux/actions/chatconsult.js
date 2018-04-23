import api, {makeApiData} from '../../api';

const view = 'chatconsult';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		let params = {
			...state.location.query
		}
		if(state.view && state.view.viewName == view)
			params = Object.assign(params, state.view.chatconsult.filter);

		const {data} = await api({
			params,
			url: '/admin/chatconsult',
			cookies: state.cookies,
			data: makeApiData(state),
		});

		dispatch({
			type: 'INIT_MODULE',
			data,
			view,
			stopLoading: true
		});
	};
}

export function viewChatconsult(state, itemId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_CHAT_CONSULT',
		});

		let {data: {data: chatconsult}} = await api({
			url: '/admin/chatconsult/view',
			data: makeApiData(state, {
				chatconsultId: itemId,
			})
		});

		dispatch({
			type: 'LOAD_CHAT_CONSULT',
			chatconsult,
		});
	};
}