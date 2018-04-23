import api from '../../api';

export function sendRequest(username, userpassword) {
	return dispatch => api({
		method: 'post',
		url: '/login',
		data: {
			username, userpassword
		},
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(({data}) => {
		if (data.status !== false) // for superadmin
                    if(data.roleId==0){
			window.location.href = '/admin/dashboard';
                    }

	})
	.catch(error => console.error);
}

export function init() {
	return {
		type: 'INIT_MODULE',
		view: 'login'
	};
}

export function updatePassword(value) {
	return {
		type: 'LOGIN_UPDATE_PASSWORD',
		value
	};
}

export function updateUsername(value) {
	return {
		type: 'LOGIN_UPDATE_USERNAME',
		value
	};
}