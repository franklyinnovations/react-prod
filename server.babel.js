import http from 'http';
import https from 'https';
import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import _FileStore from 'session-file-store';

import {setupReducers} from './src/store';
import renderHTMLString from './src/renderHTMLString';
import RubixAssetMiddleware from './src/RubixAssetMiddleware';

import {
	host,
	port,
	ssl_options,
	ssl_port,
	liveWebsite,
} from './api/config';
import io, {websocket} from './io';
import api from './api';
import extra from './extra';
import routes from './src/routes';
import reducers from './src/redux/reducers';
import Redirect from './src/Redirect';

const ltr = RubixAssetMiddleware('ltr'),
	rtl = RubixAssetMiddleware('rtl');

function assetMiddleware(req, res, next) {
	if (req.session.lang && ((req.session.lang.dir || req.session.lang.f_dir) === 'rl'))
		rtl(req, res, next);
	else
		ltr(req, res, next);
}

setupReducers(reducers);

const FileStore = _FileStore(session);
const the_session = session({
	name: 'session',
	secret: ['key1', 'key2'],
	resave: false,
	saveUninitialized: false,
	store: new FileStore({
		path: '../react-sessions',
		ttl: 31536000
	})
});

let app = express();

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
	if (req.hostname !== host) {
		res.redirect((ssl_options ? 'https://' : 'http://') + host + req.originalUrl);
	} else {
		next();
	}
});

app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(the_session);

app.get('/setLanguage/:id/:dir/:code', function (req, res) {
	req.session.lang = req.params;
	req.session.save(() => res.redirect(req.headers.referer || '/'));
});

app.get('/setAcademicSession/:id', function (req, res) {
	let sessionId = parseInt(req.params.id),
		academicSessions = req.session.siteAdmin.userdetails.academicSessions;
	for (let i = academicSessions.length - 1; i >= 0; i--) {
		if (academicSessions[i].id === sessionId) {
			req.session.siteAdmin.selectedSession = academicSessions[i];
			break;
		}
	}
	req.session.save(() => res.redirect(req.headers.referer || '/'));
});

app.use(extra);
app.use(api);
app.use('/socket.io', io);

app.get('*', assetMiddleware, (req, res, next) => {
	renderHTMLString(routes, req, (error, redirectLocation, data) => {
		if (error instanceof Redirect) {
			res.redirect(error.url);
		} else if (error) {
			switch (error) {
				case 'SERVICE_DOWN':
				case 'SERVER_DOWN':
					return res.redirect('/503');
				case 'INVALID_SESSION':
					delete req.session.siteAdmin;
					return res.redirect('/login');
				case 'ACCESS_DENIED':
					return res.redirect('/401');
				case 'INTERNAL_ERROR':
				case 'UNKNOWN_ERROR':
				default:
					if (process.env.NODE_ENV === 'development')
						next(error);
					else
						return res.redirect('/500');
			}
		} else if (redirectLocation) {
			res.redirect(redirectLocation.pathname + redirectLocation.search);
		} else {
			res.render('index', {
				liveWebsite,
				content: data.content,
				data: JSON.stringify(data.data).replace(/\//g, '\\/'),
			});
		}
	});
});

if (ssl_options) {
	/*eslint no-console: 'off'*/
	const server = https.createServer(ssl_options, app);
	server.on('upgrade', websocket);
	server.listen(ssl_port, () => {
		console.log(`Node.js app is running on ${ssl_port}`);
	});

	http.createServer((req, res) => {
		let hostname = req.headers.host;
		if (hostname) {
			if (!hostname.startsWith('www')) hostname = 'www.' + hostname;
			res.writeHead(301, {'location': 'https://' + hostname + req.url});
			res.end();
		} else {
			res.statusCode = 500;
			res.end();
		}
	}).listen(port);
} else {
	const server = http.createServer(app);
	server.on('upgrade', websocket);
	server.listen(port, () => {
		console.log(`Node.js app is running on ${port}`);
	});
}