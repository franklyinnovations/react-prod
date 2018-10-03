import url from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import {Provider} from 'react-redux';
import {createReduxStore} from './store';
import {fetchDataOnServer} from './utils';
import locales from '../locales';

export default function renderHTMLString (routes, req, callback) {
	const store = createReduxStore(),
		theUrl = url.parse(req.originalUrl, true),
		code = (req.session.lang && req.session.lang.code) || 'en';

	store.dispatch({
		type: 'INIT_APP',
		session: req.session,
		cookie: req.headers.cookie,
		query: theUrl.query,
		pathname: theUrl.pathname,
		lang: req.session.lang || {},
		translations: {
			[code]: locales[code],
		},
	});

	match({ routes: routes(store), location: req.url}, (error, redirectLocation, renderProps) => {
		if (redirectLocation) callback(null, redirectLocation);

		if (!renderProps) {
			return callback('renderProps not defined!');
		}

		fetchDataOnServer(renderProps, store).then(() => {
			if (error) {
				callback(error);
			} else {
				try {
					callback(null, null, {
						content: ReactDOMServer.renderToString(
							<Provider store={store} key='provider'>
								<RouterContext {...renderProps} />
							</Provider>
						),
						data: store.getState()
					});
				} catch (err) {
					callback(err);
				}
			}
		}).catch(callback);
	});
}