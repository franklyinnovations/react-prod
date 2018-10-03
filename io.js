'use strict';

import proxy from 'http-proxy';
import {apiUrl} from './api/config';

const proxyServer = proxy.createProxyServer({
	target: apiUrl + '/socket.io',
});

proxyServer.on('proxyReq', (proxyReq, req) => {
	if (req.session.siteAdmin && req.session.siteAdmin.oauth) {
		proxyReq.setHeader('token', req.session.siteAdmin.oauth.access_token);
	}
});

proxyServer.on('error', (err, req, res) => res.end());

export default function io(req, res) {
	proxyServer.web(req, res);
}

export function websocket(req, socket, head) {
	proxyServer.ws(req, socket, head);
}