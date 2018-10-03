'use strict';

import {Router} from 'express';
import request from 'request';
import bodyParser from 'body-parser';

import {
	apiUrl,
	basicAuth,
	clientId,
	clientSecret
} from './config';

const router = Router(),
	jsonBodyParser = bodyParser.json();

router.get('/logout', (req, res) => {
	delete req.session.siteAdmin;
	req.session.save(() => res.redirect('/'));
});

router.get('/api/refresh_token', (req, res) => {
	request({
		method: 'POST',
		url: apiUrl + '/oauth/token',
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded'
		},
		form: {
			grant_type: 'refresh_token',
			username: req.session.siteAdmin.user_name,
			password: req.session.siteAdmin.password,
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: req.session.siteAdmin.oauth.refresh_token
		}
	}, (error, response, body) => {
		if (error) return res.status(503).end();
		let data;
		try {
			data = JSON.parse(body);
		} catch(err) {
			return res.status(500).end();
		}
		if (data.access_token) {
			req.session.siteAdmin.oauth = data;
			res.status(200).end();
		} else {
			res.status(401).end();
		}
	});
});

router.post('/api/session', jsonBodyParser, (req, res) => {
	req.body.oauth = req.session.siteAdmin.oauth;
	req.body.password = req.session.siteAdmin.password;
	req.session.siteAdmin = req.body;
	res.status(200).send({status: true});
});

router.post('/api/login', (req, res) => {
	if (req.session.siteAdmin) return res.send(req.session.siteAdmin);
	fetchApi(req)
		.then(({body}) => {
			let data = JSON.parse(body);
			if (! data.status) return data;
			return new Promise((resolve, reject) => {
				request({
					method: 'POST',
					url: apiUrl + '/oauth/token',
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/x-www-form-urlencoded'
					},
					form: {
						grant_type: 'password',
						username: data.data.user_name,
						password: data.data.password,
						client_id: clientId,
						client_secret: clientSecret
					}
				}, (error, response, body) => {
					if (error) return reject(error);
					req.session.siteAdmin = {
						...(data.data),
						primaryLangCode: data.primaryLang.code,
						primaryLangName: data.primaryLang.name,
						primaryLangDirection: data.primaryLang.direction,
						languages: data.languages,
						servicePath: data.servicePath,
						modules: data.modules,
						userdetails: data.userdetails,
						oauth: JSON.parse(body),
					};
					req.session.lang = {
						id: req.session.siteAdmin.default_lang,
						code: req.session.siteAdmin.primaryLangCode,
						dir: req.session.siteAdmin.primaryLangDirection
					};
					updateModules(req.session.siteAdmin);
					req.session.siteAdmin.selectedSession = getDefaultSession(req.session.siteAdmin);
					resolve(data);
				});
			});
		})
		.then(data => res.status(200).send(data.status ? req.session.siteAdmin : data))
		.catch(() => res.status(503).end());
});

router.post('/api/admin/profile2/save-institute', (req, res) => {
	fetchApi(req)
		.then(({response, body}) => {
			let data = JSON.parse(body);
			if (data.status === true) {
				req.session.siteAdmin.userdetails.date_format = data.data.date_format;
				req.session.save(() => res.status(response.statusCode).end(body));
			} else {
				res.status(response.statusCode).end(body);
			}
		})
		.catch(() => res.status(503).end());
});

router.post('/api/admin/profile2/changeDefaults', (req, res) => {
	fetchApi(req)
		.then(({response, body}) => {
			let data = JSON.parse(body);
			if (data.status === true) {
				req.session.siteAdmin.defaultSessionId = data.defaultSessionId;
				req.session.save(() => res.status(response.statusCode).end(body));
			} else {
				res.status(response.statusCode).end(body);
			}
		})
		.catch(() => res.status(503).end());
});

router.use('/api', proxyApi);

function fetchApi(req) {
	return new Promise((resolve, reject) => {
		req.pipe(request({
			url: apiUrl + req.originalUrl.substring(4),
			method: req.method,
			headers: {
				authorization: (req.session.siteAdmin && req.session.siteAdmin.oauth) ?
					'Bearer ' + req.session.siteAdmin.oauth.access_token : basicAuth
			}
		}, (error, response, body) => {
			if (error)
				reject(error);
			else
				resolve({response, body});
		}));
	});
}

function proxyApi(req, res) {
	let proxy = request({
		url: apiUrl + req.originalUrl.substring(4),
		method: req.method,
		headers: {
			authorization: (req.session.siteAdmin && req.session.siteAdmin.oauth) ?
				'Bearer ' + req.session.siteAdmin.oauth.access_token : basicAuth
		}
	});
	proxy.on('error', () => res.status(503).end());
	req.pipe(proxy);
	proxy.pipe(res);
}

function getDefaultSession(siteAdmin) {
	let defaultSessionId = siteAdmin.defaultSessionId,
		academicSessions = siteAdmin.userdetails.academicSessions;
	for (let i = academicSessions.length - 1; i >= 0; i--) {
		if (academicSessions[i].id === defaultSessionId)
			return academicSessions[i];
	}
	return academicSessions[0];
}

function updateModules(siteAdmin) {
	if (siteAdmin.id === 1) {
		siteAdmin.modules = {
			dashboard: ['view'],
			user: ['view', 'add', 'edit', 'status'],
			institute: ['view', 'add', 'edit', 'delete', 'status', 'sendsms', 'sendemail', 'smsprovider'],
			city: ['view', 'add', 'edit', 'status'],
			state: ['view', 'add', 'edit', 'status'],
			country: ['view', 'add', 'edit', 'status'],
			language: ['view', 'add', 'edit', 'status'],
			contact: ['view'],
			demorequest: ['view'],
			role: ['view', 'add', 'edit', 'status'],
			/*holiday: ['view', 'add', 'edit', 'delete'],*/
			emailprovider: ['view', 'status'],
			govtidentity: ['view', 'add', 'edit', 'status'],
			/*ticket: ['view','add','edit','status'],*/
			dealregistration:['view'],
			partner:['view']
		};
	} else if(siteAdmin.user_type === 'teacher') {
		siteAdmin.modules.studentleave = ['view', 'status'];
		siteAdmin.modules.mystudent = ['view'];
		siteAdmin.modules.teacherclasses = ['view'];
	} else if(siteAdmin.user_type === 'institute'){
		siteAdmin.modules.studentleave = ['view', 'status'];
	} else if(siteAdmin.user_type === 'student'){
		delete siteAdmin.modules.attendance;
		siteAdmin.modules.studentleave = ['view', 'add', 'status'];
		siteAdmin.modules.studentclasses = ['view'];
	}
}

export default router;
