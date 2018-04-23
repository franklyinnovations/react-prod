'use strict';

import Router from 'express';
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
		try {
			var data = JSON.parse(body);
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

router.get('/api/session', (req, res) => {
	res.send(req.session.siteAdmin || {})
});

router.delete('/api/session', (req, res) => {
	delete req.session.siteAdmin;
	res.status(200).end();
});

router.post('/api/session', jsonBodyParser, (req, res) => {
	req.body.oauth = req.session.siteAdmin.oauth;
	req.body.password = req.session.siteAdmin.password;
	req.session.siteAdmin = req.body;
	res.status(200).send({status: true});
});

router.post('/api/weblogin', (req, res) => {
	if (req.session.siteAdmin) return res.send(req.session.siteAdmin || {});
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
					associatedProfileData: data.associatedProfileData,
					allHospitalProfiles: data.allHospitalProfiles,
					currency: data.currency,
					oauth: JSON.parse(body)
				};
				req.session.lang = {
					id: req.session.siteAdmin.default_lang,
					code: req.session.siteAdmin.primaryLangCode,
					dir: req.session.siteAdmin.primaryLangDirection
				};
				resolve(data);
			});
		});
	})
	.then(data => res.status(200).send(data.status ? req.session.siteAdmin : data))
	.catch(() => res.status(503).end());
});

router.use('/api/account/save', (req, res) => {
	fetchApi(req)
	.then(({response, body}) => {
		let data = response.statusCode === 200 && JSON.parse(body);
		if (data && data.status) {
			req.session.siteAdmin.email = data.data.email;
			req.session.siteAdmin.mobile = data.data.mobile;
			req.session.siteAdmin.userdetails.fullname = data.data.name;
			req.session.siteAdmin.default_lang = data.data.default_lang;
			req.session.save(() => res.status(response.statusCode).end(body))
		} else {
			res.status(response.statusCode).end(body);
		}
	})
	.catch(error => res.status(503).end());
});

router.use('/api/admin/subscription/make-payment', (req, res) => {
	fetchApi(req)
	.then(({response, body}) => {
		let data = response.statusCode === 200 && JSON.parse(body);
		if (data && data.status) {
			req.session.siteAdmin.subscription = true;
			req.session.save(() => res.status(response.statusCode).end(body))
		} else {
			res.status(response.statusCode).end(body);
		}
	})
	.catch(error => res.status(503).end());
});

router.use('/api', (req, res) => {
	fetchApi(req)
	.then(({response, body}) => res.status(response.statusCode).end(body))
	.catch(error => res.status(503).end());
});

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

export default router;