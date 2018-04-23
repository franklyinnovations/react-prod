import url from 'url';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Router, match, RouterContext, hashHistory, browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware as origApplyMiddleware, compose } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import { FetchData, fetchDataOnServer, reducer as fetching } from '../redux-fetch-data';

import isBrowser from '../isBrowser';
import locales from '../../locales';

let isRouterSet = false, reducer;

export let store, history;

export function setupReducers(reducers) {
	reducer = combineReducers({
		...reducers,
		fetching: fetching,
		routing: routerReducer,
	});
}

export function replaceReducers(reducers) {
	setupReducers(reducers);
	store.replaceReducer(reducer);
}

function getData() {
	let element = document.getElementById('preloadedData');
	return element ? JSON.parse(element.textContent) : '';
}

let middlewares = [ thunk ];

export function prependMiddleware(...args) {
	return middlewares.unshift(...args);
}

function createStoreWithMiddleware() {
	return compose(
		origApplyMiddleware(...middlewares),
		isBrowser() && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
	)(createStore);
}

export function createReduxStore(initialState) {
	return (createStoreWithMiddleware())(reducer, initialState);
}

function onFetchData(props) {
	return <FetchData {...props} />;
}

export default function render(routes, onRender) {

	if (!onRender) onRender = function() {};

	if (isBrowser()) {
		// in browser

		if (!isRouterSet) {
			isRouterSet = true;
			history = (Modernizr.history ? browserHistory : hashHistory);

			const initialState = getData();
			store = createReduxStore(initialState);
			history = syncHistoryWithStore(history, store);
		}

		let Component = routes(store);
		let dynamicRoutes = (
			<Provider store={store} key='provider'>
				<Router history={history} render={onFetchData}>
					{Component}
				</Router>
			</Provider>
		);

		ReactDOM.render(
			<AppContainer>
				{dynamicRoutes}
			</AppContainer>,
			document.getElementById('app-container'),
			onRender
		);
	}
}

export function renderHTMLString(routes, req, callback) {
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

	// in server
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
							<AppContainer>
								<Provider store={store} key='provider'>
									<RouterContext {...renderProps} />
								</Provider>
							</AppContainer>
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
