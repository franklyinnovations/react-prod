import emojione from 'emojione_minimal';

import api, {makeApiData} from '../../api';
import {socket} from '../../io';
import {bcsName, getServerTime} from '../../utils';

export function init(state) {
	return async dispatch => {
		let id = state.session.id;
		let {data} = await api({
			url: '/admin/chat',
			data: makeApiData(state, {
				id: state.session.id,
			}),
		});
		if (state.session.id === state.session.masterId) {
			let index = data.permissions.indexOf('institute');
			if (index !== -1)
				data.permissions.splice(index, 1);
		}
		dispatch({
			type: 'INIT_CHAT',
			users: data.conversations.map(message => {
				let user = message.senderId === id ? message.receiver : message.sender;
				user.online = !!message.online;
				user.unread = message.unread;
				user.visible = true;
				delete message.receiver;
				delete message.sender;
				return user;
			}),
			permissions: data.permissions,
		});
	};
}

export function startConversation(state, user) {
	return async dispatch => {
		let conversations = state.chat.conversations;
		for (let i = conversations.length - 1; i >= 0; i--) {
			if (conversations[i].user.id === user.id)
				return;
		}
		dispatch({
			type: 'ADD_CHAT_CONVERSATION',
			user,
		});
		let {data: {messages, more}} = await api({
			url: '/admin/chat/messages',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.id,
				otherUserId: user.id,
				old: true,
				createdAt: getServerTime(Date.now()),
			}),
		});
		dispatch({
			type: 'ADD_CHAT_MESSAGES',
			more,
			messages,
			userId: user.id,
		});
	};
}

export function loadMoreMessages(state, userId, createdAt) {
	return async dispatch => {
		let {data: {messages, more}} = await api({
			url: '/admin/chat/messages',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
				userId: state.session.id,
				otherUserId: userId,
				old: true,
				createdAt: getServerTime(createdAt),
			}),
		});
		dispatch({
			type: 'ADD_CHAT_MESSAGES',
			more,
			messages,
			userId: userId,
		});
	};
}

export function closeConversation(userId) {
	return {
		type: 'REMOVE_CHAT_USER',
		userId,
	};
}

export function updateMessage(userId, value) {
	return {
		type: 'UPDATE_CHAT_MESSAGE',
		userId,
		value,
	};
}

export function sendMessage(message, userId) {
	if (message.type === 0)
		message.data = emojione.shortnameToUnicode(message.data);
	socket.emit('send-message', message);
	message.senderId = userId;
	message.msg_status = 0;
	return {
		type: 'SEND_CHAT_MESSAGE',
		message,
	};
}

export function gotMessage(state, message) {
	let conversations = state.chat.conversations;
	for (let i = 0; i < conversations.length; i++) {
		if (conversations[i].user.id === message.senderId) {
			socket.emit('received', message.id);
			message.msg_status = 2;
			return {
				type: 'RECEIVED_CHAT_MESSAGE',
				message,
			};
		}
	}

	let users = state.chat.users;
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === message.senderId) {
			message.msg_status = 2;
			return {
				type: 'GOT_CHAT_MESSAGE',
				message,
			};
		}
	}

	return addChatUser(state, message.senderId, false);
}

export function gotMyMessage(state, message) {
	return {
		type: 'GOT_MY_CHAT_MESSAGE',
		message,
	};
}

export function setOnlineStatus(status) {
	return {
		type: 'SET_CHAT_ONLINE_STATUS',
		status,
	};
}

export function messageSent(message) {
	return {
		type: 'CHAT_MESSAGE_SENT',
		message,
		status: 1,
	};
}

export function messageFailed(uid) {
	return {
		type: 'CHAT_MESSAGE_FAILED',
		uid,
	};
}

export function messageSeen(id) {
	return {
		type: 'CHANGE_MESSAGE_STATUS',
		id,
		status: 3,
	};
}

export function messageReceived(id) {
	return {
		type: 'CHANGE_MESSAGE_STATUS',
		id,
		status: 2,
	};
}

export function sawMessage(id, userId) {
	socket.emit('seen', id);
	return {
		type: 'CHANGE_MESSAGE_STATUS',
		id,
		userId,
		status: 3,
	};
}

export function changeTypingStatus(userId, status) {
	return {
		type: 'CHANGE_CHAT_TYPING_STATUS',
		status,
		userId,
	};
}

export function uploadFile(state, data, message) {
	return async dispatch => {
		message.senderId = state.session.id;
		message.msg_status = 0;
		dispatch({
			type: 'SEND_CHAT_MESSAGE',
			message,
		});
		let response;
		try {
			response = await api({
				url: '/admin/chat/file',
				data: makeApiData(state, data)
			});
		} catch (err) {
			throw err;
		}
		dispatch({
			type: 'UPDATE_MESSAGE_FILE',
			url: response.data.url,
			uid: message.uid,
		});
		socket.emit('send-message', message);
	};
}

export function startSelection(state, user_type) {
	if (user_type === 'institute') {
		let {chat: {users}} = state, userId = state.session.masterId;
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === userId) {
				return startConversation(state, users[i]);
			}
		}
		return addChatUser(state, userId);
	}
	return async dispatch => {
		dispatch({
			type: 'START_CHAT_USER_SELECTOR',
			user_type,
		});

		switch (user_type) {
			case 'teacher': {
				let {data} = await api({
					url: '/admin/chat/teachers',
					data: makeApiData(state),
				});
				dispatch({
					type: 'SET_CHAT_TEACHERS',
					users: data.data.map(user => ({
						value: user.id,
						label: user.userdetails[0].fullname,
					})),
				});
				break;
			}
			case 'admin': {
				let {data} = await api({
					url: '/admin/chat/admins',
					data: makeApiData(state),
				});
				dispatch({
					type: 'SET_CHAT_ADMINS',
					users: data.data.map(user => ({
						value: user.id,
						label: user.userdetails[0].fullname,
					})),
				});
				break;
			}
			case 'student':
			case 'parent': {
				let {data} = await api({
					url: '/admin/utils/bcsBy' + ((state.user_type === 'teacher') ?
						'Teacher' : 'Institute'),
					data: makeApiData(state, {
						academicSessionId: state.session.selectedSession.id,
						userId: state.session.userdetails.userId,
					}),
				});
				dispatch({
					type: 'SET_CHAT_CLASSES',
					bcsmaps: data.data.map(({bcsmap}) => ({
						value: bcsmap.id,
						label: bcsName(bcsmap),
					})),
				});
				break;
			}
		}
	};
}

export function closeUserSelector() {
	return {
		type: 'CLOSE_CHAT_USER_SELECTOR',
	};
}

export function changeBcsmap(state, bcsMapId) {
	if (!bcsMapId) {
		return {
			type: 'CHAT_RESET_BCSMAP',
		};
	}

	return async dispatch => {
		dispatch({
			type: 'CHAT_LOADING_STUDENTS',
			bcsMapId,
		});

		let {data} = await api({
			url: '/admin/chat/students',
			data: makeApiData(state, {
				bcsMapId,
				user_type: state.session.user_type,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		dispatch({
			type: 'CHAT_SET_STUDENTS',
			students: data.data.map(studentrecord => ({
				label: studentrecord.student.user.userdetails[0].fullname,
				value: studentrecord.student.user.id,
			}))
		});
	};
}

export function changeStudent(state, userId) {
	if (!userId) {
		return {
			type: 'CHAT_RESET_STUDENT',
		};
	}

	return async dispatch => {
		dispatch({
			type: 'CHAT_LOADING_PARENTS',
			userId,
		});

		let {data} = await api({
			url: '/admin/chat/parents',
			data: makeApiData(state, {
				studentUserId: userId,
				userId: state.session.userdetails.userId,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		dispatch({
			type: 'CHAT_SET_PARENTS',
			users: data.data.map(user => ({
				label: user.userdetails[0].fullname,
				value: user.id,
			}))
		});
	};
}

export function changeUser(userId) {
	return {
		type: 'CHAT_CHANGE_USER',
		userId,
	}
}

export function addChatUser(state, userId, start = true) {
	return async dispatch => {
		dispatch({
			type: 'ADD_CHAT_USER',
			userId,
		});
		let {data} = await api({
			url: '/admin/chat/user',
			data: makeApiData(state, {
				id: userId,
				userId: state.session.id,
				academicSessionId: state.session.selectedSession.id,
			})
		});

		socket.emit('is-online', [userId], users => {
			data.user.online = users.length !== 0;
			data.user.visible = true;
			dispatch({
				type: 'SET_CHAT_USER_DATA',
				user: data.user,
			});
			if (start)
				dispatch(startConversation(state, data.user));
		});
	};
}

export function setUserOnlineStatus(userId, status) {
	return {
		type: 'CHANGE_CHAT_USER_ONLINE_STATUS',
		userId,
		status,
	}
}

export function search(text) {
	return {
		type: 'CHAT_SEARCH',
		text,
	}
}