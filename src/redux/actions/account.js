import api, {makeApiData, makeErrors} from "../../api";

const view = 'account';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});

		dispatch({
			type: 'INIT_MODULE',
			view,
			user: {
				email: state.session.email,
				mobile: state.session.mobile,
				name: state.session.userdetails.fullname,
				default_lang: state.session.default_lang,
				curr_password: '',
				new_password: '', 
				confirm_new_password: '',

			},
			stopLoading: true
		})
	};
}

export function changePassword(state) {
	return async dispatch => {
		dispatch({
			type: 'ACCOUNT_START_CHANGE_PASSWORD',
		});
		let {curr_password, new_password, confirm_new_password} = state.item;
		let {data} = await api({
			url: '/account/change-password',
			data: makeApiData(state, {
				curr_password,
				new_password,
				confirm_new_password,
				id: state.session.id,
			})
		});
		if (data.errors) {
			dispatch({
				type: 'SET_ACCOUNT_PASSWORD_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({
				type: 'ACCOUNT_PASSWORD_CHANGED',
			});
		}
	};
}

export function save(state, formData) {
	return async dispatch => {
		dispatch({
			type: 'SAVE_ACCOUNT',
		});

		let {data} = await api({
			url: '/account/save',
			data: makeApiData(state, {
				id: state.session.id,
				email: state.item.email,
				mobile: state.item.mobile,
				name: state.item.name,
				default_lang: state.item.default_lang
			}),
		});

		if (data.errors) {
			dispatch({
				type: 'SET_ACCOUNT_SAVE_ERRORS',
				errors: makeErrors(data.errors),
			});
		}else if(!data.status){
			dispatch({
				type: 'SET_ACCOUNT_SAVE_ERRORS',
				errors: {},
			});
		}else {
			data = data.data;
			dispatch({
				type: 'ACCOUNT_SAVED',
				name: data.name,
				email: data.email,
				mobile: data.mobile,
				default_lang: data.default_lang
			});
		}
	};
}