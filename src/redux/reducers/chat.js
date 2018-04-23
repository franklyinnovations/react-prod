import {combineReducers} from 'redux';
import emojione from 'emojione';

function viewState(state = 'NEW', action) {
	switch(action.type) {
		case 'CHANGE_CHAT_VIEW':
			return action.chatView;
		default:
			return state;
	}
}

function items(state = [], action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'LOAD_CHAT_CONSULTS':
			return action.chatConsults;
		case 'SEND_CHAT_MESSAGE':
			return state.map(item => {
				if (item.id === action.chatconsultId)
					item.chatconsultmessage = action.message;
				return item;
			});
		case 'ADD_MY_CHAT_MESSAGE':
		case 'ADD_CHAT_MESSAGE':
			return state.map(item => {
				if (item.id === action.message.chatconsultId) {
					item.chatconsultmessage = action.message;
					if (action.unread)
						item.unread += action.unread;
				}
				return item;
			});
		case 'CHANGE_CHAT_VIEW':
			return [];
		case 'ADD_CHAT_CONSULT':
			return [
				action.chatconsult,
				...state,
			];
		case 'CHAT_MESSAGE_SEEN':
			if (action.chatconsultId) {
				return state.map(chatconsult => {
					if (chatconsult.id === action.chatconsultId)
						chatconsult.unread--;
					return chatconsult;
				});
				return chatconsult;
			}
		default:
			return state;
	}
}

function item(state = false, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'LOAD_CHAT_CONSULTS':
		case 'CHANGE_CHAT_VIEW':
			return false;
		case 'LOADING_CHAT_CONSULT':
			return null;
		case 'LOAD_CHAT_CONSULT':
			return action.chatconsult;
		case 'SEND_CHAT_MESSAGE':
			let message = action.message;
			if (action.message.type === 0) {
				message = {
					...action.message,
					data: emojione.unicodeToImage(emojione.escapeHTML(message.data))
				};
			}
			return {
				...state,
				chatconsultmessages: [...state.chatconsultmessages, message],
			};
		case 'ADD_MY_CHAT_MESSAGE':
		case 'ADD_CHAT_MESSAGE':
			if (state && state.id === action.message.chatconsultId) {
				let message = action.message;
				if (action.message.type === 0) {
					message = {
						...action.message,
						data: emojione.unicodeToImage(emojione.escapeHTML(message.data))
					};
				}
				return {
					...state,
					chatconsultmessages: [...state.chatconsultmessages, message]
				};
			} else {
				return state;
			}
		case 'UPDATE_MESSAGE_FILE':
			if (state && state.id === action.chatconsultId) {
				return {
					...state,
					chatconsultmessages: state.chatconsultmessages.map(message => {
						if (message.uid === action.uid)
							message.data = action.url;
						return message;
					}),
				};
			} else {
				return state;
			}
		case 'CHAT_MESSAGE_SENT':
			if (!state) return state;
			return {
				...state,
				chatconsultmessages: state.chatconsultmessages.map(message => {
					if (message.uid === action.message.uid) {
						message.id = action.message.id;
						message.status = 1;
					}
					return message;
				}),
			};
		case 'CHAT_MESSAGE_RECEIVED':
			if (!state) return state;
			return {
				...state,
				chatconsultmessages: state.chatconsultmessages.map(message => {
					if (message.id === action.messageId)
						message.status = 2;
					return message;
				}),
			};
		case 'CHAT_MESSAGE_SEEN':
			if (!state) return state;
			return {
				...state,
				chatconsultmessages: state.chatconsultmessages.map(message => {
					if (message.id === action.messageId)
						message.status = 3;
					return message;
				}),
			};
		default:
			return state;
	}
}

function itemdetail(state = false, action) {
	switch(action.type) {
		case 'LOADING_CHAT_CONSULT_DETAIL':
			return null;
		case 'LOAD_CHAT_CONSULT_DETAIL':
			return action.chatconsult;
		case 'CLOSE_CHAT_CONSULT_DETAIL':
			return false;
		default:
			return state;
	}
}

function filter(state = {}, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return state;
		case 'RESET_FILTERS':
			return {};
		case 'UPDATE_FILTER':
			let newState = {...state};
			if (action.value) {
				newState[action.name] = action.value;
			} else {
				delete newState[action.name];
			}
			return newState;
		default:
			return state;
	}
}

function meta(state = {message: '', search: '', pageInfo: false}, action) {
	switch(action.type) {
		case 'LOAD_CHAT_CONSULTS':
			return {
				...state,
				pageInfo: action.pageInfo,
				commission: action.pageInfo.commissionRate||0
			};
		case 'UPDATE_CHAT_MESSAGE':
			return {
				...state,
				message: action.value,
			};
		case 'UPDATE_CHAT_SEARCH':
			return {
				...state,
				search: action.value,
			};
		case 'CHANGE_CHAT_VIEW':
			return {
				...state,
				search: '',
			};
		case 'SEND_CHAT_MESSAGE':
			if (action.message.type === 0) {
				return {
					...state,
					message: '',
				};
			} else {
				return state;
			}
		case 'LOAD_CHAT_CONSULT':
			return {
				...state,
				message: '',
			};
		default:
			return state;
	}
}

const reducer = combineReducers({
	viewState,
	items,
	item,
	itemdetail,
	filter,
	meta,
});

export default reducer;