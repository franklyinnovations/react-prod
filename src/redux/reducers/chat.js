import {combineReducers} from 'redux';
import moment from 'moment';
import emojione from 'emojione_minimal';
import {
	createDayString,
	getLocalTime,
	MESSAGE_TYPE_TEXT,
} from '../../utils';


function users(state = null, action) {
	switch (action.type) {
		case 'INIT_CHAT':
			return action.users;
		case 'ADD_CHAT_USER':
			return [{id: action.userId, visible: true, loading: true}, ...state];
		case 'SET_CHAT_USER_DATA':
			return state.map(user => {
				if (user.id === action.user.id)
					return action.user;
				return user;
			});
		case 'CHANGE_CHAT_USER_ONLINE_STATUS':
			return state.map(user => {
				if (user.id === action.userId)
					user.online = action.status;
				return user;
			});
		case 'CHANGE_MESSAGE_STATUS': {
			if (action.status === 3) {
				return state.map(user => {
					if (user.id === action.userId)
						user.unread -= 1;
					return user;
				});
			}
			return state;
		}
		case 'RECEIVED_CHAT_MESSAGE':
		case 'GOT_CHAT_MESSAGE':
			return state.map(user => {
				if (user.id === action.message.senderId)
					user.unread += 1;
				return user;
			});
		case 'CHAT_SEARCH': {
			let text = action.text.toLowerCase();
			return state.map(user => {
				user.visible = user.loading || user.userdetails[0].fullname.toLowerCase().indexOf(text) !== -1;
				return user;
			});
		}
		default:
			return state;
	}
}

function conversations(state = [], action) {
	switch (action.type) {
		case 'ADD_CHAT_CONVERSATION':
			return [
				...state,
				{
					user: action.user,
					shown: true,
					message: '',
					messages: [],
					loading: true,
					typing: false,
					online: !!action.online,
				},
			];
		case 'REMOVE_CHAT_USER':
			return state.filter(conversation => conversation.user.id !== action.userId);
		case 'UPDATE_CHAT_MESSAGE':
			return updateConversation(
				state,
				action.userId,
				conversation => conversation.message = action.value
			);
		case 'ADD_CHAT_MESSAGES':
			return updateConversation(
				state,
				action.userId,
				conversation => {
					let messages = action.messages,
						allMessages = [],
						currentDate = conversation.messages[0]
							? moment(conversation.messages[0].createdAt).startOf('day').toDate().getTime()
							: moment().startOf('day').toDate().getTime();
					for (let i = 0; i < messages.length; i++) {
						let message = messages[i];
						message.createdAt = getLocalTime(message.createdAt);
						if (message.type === 0)
							message.data = emojione.unicodeToImage(emojione.escapeHTML(message.data));
						if (currentDate > message.createdAt && allMessages.length !== 0) {
							allMessages.push(createDayString(currentDate));
							currentDate = moment(message.createdAt).startOf('day').toDate().getTime();
						}
						allMessages.push(message);
					}
					conversation.messages = [...allMessages.reverse(), ...conversation.messages];
					conversation.more = action.more;
					conversation.loading = false;
				},
			);
		case 'SEND_CHAT_MESSAGE':
			return updateConversation(
				state,
				action.message.receiverId,
				conversation => {
					if (action.message.type === MESSAGE_TYPE_TEXT)
						conversation.message = '';
					action.message.createdAt = Date.now();
					addMessage(conversation.messages, action.message);
				}
			);
		case 'RECEIVED_CHAT_MESSAGE':
			return updateConversation(
				state,
				action.message.senderId,
				conversation => {
					action.message.createdAt = getLocalTime(action.message.createdAt);
					addMessage(conversation.messages, action.message);
				}
			);
		case 'GOT_MY_CHAT_MESSAGE':
			return updateConversation(
				state,
				action.message.receiverId,
				conversation => {
					action.message.createdAt = getLocalTime(action.message.createdAt);
					addMessage(conversation.messages, action.message);
				}
			);
		case 'CHAT_MESSAGE_SENT':
			return state.map(conversation => {
				conversation.messages = conversation.messages.map(message => {
					if (message.uid === action.message.uid) {
						message.msg_status = 1;
						message.createdAt = action.message.createdAt;
						message.id = action.message.id;
					}
					return message;
				});
				return conversation;
			});
		case 'CHAT_MESSAGE_FAILED':
			return state.map(conversation => {
				conversation.messages = conversation.messages.map(message => {
					if (message.uid === action.uid)
						message.msg_status = -1;
					return message;
				});
				return conversation;
			});
		case 'CHANGE_MESSAGE_STATUS':
			return state.map(conversation => {
				conversation.messages = conversation.messages.map(message => {
					if (message.id === action.id)
						message.msg_status = action.status;
					return message;
				});
				return conversation;
			});
		case 'UPDATE_MESSAGE_FILE':
			return state.map(conversation => {
				conversation.messages = conversation.messages.map(message => {
					if (message.uid === action.uid)
						message.data = action.url;
					return message;
				});
				return conversation;
			});
		case 'CHANGE_CHAT_TYPING_STATUS':
			return updateConversation(
				state,
				action.userId,
				conversation => conversation.typing = action.status
			);
		case 'CHANGE_CHAT_USER_ONLINE_STATUS':
			return updateConversation(
				state,
				action.userId,
				conversation => {
					conversation.online = action.status;
					if (!action.status)
						conversation.typing = false;
				}
			);
		case 'CHAT_PREVIEW_FILE':
			return updateConversation(
				state,
				action.receiverId,
				conversation => {
					conversation.file = action.file;
				}
			);
		default:
			return state;
	}
}

function selector(state = {user_type: null}, action) {
	switch (action.type) {
		case 'INIT_CHAT':
			return {
				...state,
				permissions: action.permissions.reduce((acc, item) => (acc[item] = true, acc), {}),
				permissionCount: Object.keys(action.permissions).length,
			};
		case 'START_CHAT_USER_SELECTOR': {
			let loadingClasses = (action.user_type === 'student' || action.user_type === 'parent');
			return {
				...state,
				bcsMapId: null,
				studentId: null,
				userId: null,
				user_type: action.user_type,
				students: false,
				bcsmaps:  loadingClasses ? null : false,
				users: loadingClasses ? false : null,
			};
		}
		case 'CLOSE_CHAT_USER_SELECTOR':
			return {
				...state,
				user_type: null,
			};
		case 'SET_CHAT_TEACHERS':
		case 'SET_CHAT_ADMINS':
			return {
				...state,
				users: action.users,
			};
		case 'SET_CHAT_CLASSES':
			return {
				...state,
				bcsmaps: action.bcsmaps,
			};
		case 'CHAT_LOADING_STUDENTS': {
			let students = null, users = null;
			if (state.user_type === 'student')
				students = false;
			else
				users = false;
			return {
				...state,
				students,
				users,
				studentId: null,
				userId: null,
				bcsMapId: action.bcsMapId,
			};
		}
		case 'CHAT_SET_STUDENTS':
			return {
				...state,
				[state.user_type === 'student' ? 'users' : 'students']: action.students,
			};
		case 'CHAT_RESET_BCSMAP':
			return {
				...state,
				bcsMapId: null,
				studentId: null,
				userId: null,
				students: false,
				users: false,
			};
		case 'CHAT_LOADING_PARENTS':
			return {
				...state,
				studentId: action.userId,
				parents: null,
				userId: null,
			};
		case 'CHAT_SET_PARENTS':
			return {
				...state,
				users: action.users,
			};
		case 'CHAT_RESET_STUDENT':
			return {
				...state,
				studentId: null,
				parents: null,
				userId: null
			};
		case 'CHAT_CHANGE_USER':
			return {
				...state,
				userId: action.userId,
			};
		case 'ADD_CHAT_USER':
			return {
				...state,
				user_type: null,
			};
		default:
			return state;
	}
}

function meta(state = {online: false, unread: 0, search: ''}, action) {
	switch (action.type) {
		case 'SET_CHAT_ONLINE_STATUS':
			return {
				...state,
				online: action.status
			};
		case 'INIT_CHAT':
			return {
				...state,
				unread: action.users.reduce((sum, user) => sum + user.unread, 0),
			};
		case 'SET_CHAT_USER_DATA':
			return {
				...state,
				unread: state.unread + action.user.unread,
			};
		case 'CHANGE_MESSAGE_STATUS':
			if (action.status === 3 && action.userId)
				return {
					...state,
					unread: state.unread - 1
				};
			else
				return state;
		case 'RECEIVED_CHAT_MESSAGE':
		case 'GOT_CHAT_MESSAGE':
			return {
				...state,
				unread: state.unread + 1
			};
		case 'CHAT_SEARCH':
			return {
				...state,
				search: action.text,
			};
		default:
			return state;
	}
}

export default combineReducers({
	users,
	conversations,
	selector,
	meta,
});

function updateConversation(_conversations, userId, updater) {
	let conversations = [..._conversations];
	for (let i = conversations.length - 1; i >= 0; i--) {
		if (conversations[i].user.id === userId)
			updater(conversations[i]);
	}
	return conversations;
}

function addMessage(messages, message) {
	let lastMessage = messages[messages.length - 1];
	if (lastMessage) {
		let today = moment().startOf('day').toDate().getTime();
		if (moment(lastMessage.createdAt).startOf('day').toDate().getTime() < today)
			messages.push(createDayString(today));
	}
	if (message.type === 0)
		message.data = emojione.unicodeToImage(emojione.escapeHTML(message.data));
	messages.push(message);
}