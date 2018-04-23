'use strict';

import SocketIO from 'socket.io';
import SocketIOClient from 'socket.io-client';
import api from './src/api';
import {apiUrl} from './api/config';

const io = new SocketIO();

const nothing = () => undefined,
	serviceChatEvents = ['p_error', 'my-message', 'message-sent', 'message', 'seen', 'received'],
	clientChatEvents = ['send-message', 'seen', 'received', 'get-time'];

io
.use((client, next) => io.the_session(client.handshake, nothing, next))
.on('connection', client => {
	getService(client.handshake)
	.then((service) => {
		service.on('connect', () => {
			client.emit('connected');
		});

		service.on('disconnect', () => {
			client.emit('disconnected');
		});

		service.on('reconnect', () => {
			client.emit('connected');
		});

		client.on('disconnect', () => {
			service.disconnect(true);
		});

		client.on('error', error => {
			client.emit('p_error', error);
		});

		setChatServiceEvents(client, service);
		setChatClientEvents(client, service);
	})
	.catch(error => {
		console.error(error);
		client.emit('p_error', error, function () {
			client.disconnect(true);
		});
	});
});

async function getService(req) {
	if (!req.session.siteAdmin) throw 'NOT_LOGGED_IN';
	return SocketIOClient(apiUrl, {
		transportOptions: {
			polling: {
				extraHeaders: {
					token: req.session.siteAdmin.oauth.access_token
				}
			}
		}
	});
}

function setChatServiceEvents(client, service) {
	for (let i = serviceChatEvents.length - 1; i >= 0; i--) {
		service.on(
			serviceChatEvents[i],
			makeServiceEventHandler(serviceChatEvents[i], client)
		);
	}
}

function setChatClientEvents(client, service) {
	for (let i = clientChatEvents.length - 1; i >= 0; i--) {
		client.on(
			clientChatEvents[i],
			makeClientEventHandler(clientChatEvents[i], service)
		);
	}
}

function makeServiceEventHandler(event, client) {
	return function (...args) {
		client.emit(event, ...args);
	}
}

function makeClientEventHandler(event, service) {
	return function (...args) {
		service.emit(event, ...args);
	}
}

export default function (server, the_session) {
	io.the_session = the_session;
	io.attach(server);
};