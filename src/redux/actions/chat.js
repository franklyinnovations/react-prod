import emojione from 'emojione';
import api, {makeApiData} from '../../api';
import {socket} from '../../io';

const view = 'chat';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});

		let {data: {data: chatConsults}} = await api({
			url: '/doctor/chat/list',
			cookies: state.cookies,
			data: makeApiData(state, {doctorProfileId: state.session.associatedProfileData.id}),
			hideMessage: true,
		});
		
		dispatch({
			type: 'INIT_MODULE',
			view,
			chatConsults,
			stopLoading: true
		});
	};
}

export function changeView(state, chatView, page = 1) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_CHAT_VIEW',
			chatView,
		});

		let {data: {data: chatConsults, pageInfo}} = await api({
			url: chatView === 'PAYMENT'? '/doctor/chat/transactions':'/doctor/chat/list',
			cookies: state.cookies,
			data: makeApiData(state, {
				page,
				chatView,
				doctorProfileId: state.session.associatedProfileData.id,
				...state.filter,
			}),
			hideMessage: true,
		});

		dispatch({
			type: 'LOAD_CHAT_CONSULTS',
			chatView,
			chatConsults,
			pageInfo,
		});
	};
}

export function loadConsult(state, chatconsultId) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_CHAT_CONSULT',
		});

		let {data: {data: chatconsult}} = await api({
			url: '/doctor/chat/consult',
			cookies: state.cookies,
			data: makeApiData(state, {
				chatconsultId,
				doctorProfileId: state.session.associatedProfileData.id,
			}),
			hideMessage: true,
		});

		chatconsult.chatconsultmessages.forEach(message => {
			if (message.type === 0) {
				message.data = emojione.unicodeToImage(emojione.escapeHTML(message.data));
			}
		});

		dispatch({
			type: 'LOAD_CHAT_CONSULT',
			chatconsult,
		});
	};
}

export function uploadFile(state, form, message) {
	return async dispatch => {
		dispatch({
			type: 'SEND_CHAT_MESSAGE',
			message,
		});
		let response;
		response = await api({
			url: '/chat/file',
			data: makeApiData(state, form)
		});
		dispatch({
			type: 'UPDATE_MESSAGE_FILE',
			url: response.data.url,
			uid: message.uid,
			chatconsultId: message.chatconsultId,
		});
		message.data = response.data.url;
		socket.emit('send-message', message);
	};
}

export function sendMessage(message, chatconsultId) {
	return async dispatch => {
		dispatch({
			type: 'SEND_CHAT_MESSAGE',
			message,
			chatconsultId,
		});
		socket.emit('send-message', message);
	};
}

export function gotMyMessage(state, message) {
	let {items} = state;
	for (let i = items.length - 1; i >= 0; i--) {
		if (items[i].id === message.chatconsultId) {
			return {
				type: 'ADD_MY_CHAT_MESSAGE',
				message,
			};
		}
	}
	return loadConsultItem(state, message.chatconsultId);
}

export function gotMessage(state, message) {
	socket.emit('received', message.id);
	let {items} = state;
	for (let i = items.length - 1; i >= 0; i--) {
		if (items[i].id === message.chatconsultId) {
			return {
				type: 'ADD_CHAT_MESSAGE',
				message,
				unread: 1,
			};
		}
	}
	return loadConsultItem(state, message.chatconsultId);
}

export function viewChatconsultDetail(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_CHAT_CONSULT_DETAIL',
		});

		let {data: {data: chatconsult}} = await api({
			url: '/admin/chatconsult/view',
			data: makeApiData(state, {
				chatconsultId: state.item.id,
			})
		});

		dispatch({
			type: 'LOAD_CHAT_CONSULT_DETAIL',
			chatconsult,
		});
	};
}

export function messageSent(message) {
	return {
		type: 'CHAT_MESSAGE_SENT',
		message,
	};
}

export function messageReceived(messageId) {
	return {
		type: 'CHAT_MESSAGE_RECEIVED',
		messageId,
	};
}

export function messageSeen(messageId) {
	return {
		type: 'CHAT_MESSAGE_SEEN',
		messageId,
	};
}

export function loadConsultItem(state, chatconsultId) {
	return async dispatch => {
		let {data: {data: [chatconsult]}} = await api({
			url: '/doctor/chat/list',
			data: makeApiData(state, {
				chatconsultId,
				doctorProfileId: state.session.associatedProfileData.id,
			}),
			hideMessage: true,
		});
		if (! chatconsult) return;
		dispatch({
			type: 'ADD_CHAT_CONSULT',
			chatconsult,
		});
	};
}

export function sawMessage(messageId, chatconsultId) {
	socket.emit('seen', messageId);
	return {
		type: 'CHAT_MESSAGE_SEEN',
		messageId,
		chatconsultId,
	};
}