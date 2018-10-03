require('es6-promise').polyfill();
import 'react-hot-loader';

import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

import App, {preloadComponents} from './App';
import {enableBugReport} from './config';
import {setupReducers, createReduxStore, prependMiddlewares} from './store';
import reducers from './redux/reducers';
import createBugReporter from './bugreport';
import {dialog, messenger} from './utils';

function getData() {
	let element = document.getElementById('preloadedData');
	return element ? JSON.parse(element.textContent) : '';
}

async function main() {
	let history;

	function replace(url) {
		history.push(url);
	}

	function redirect(url) {
		window.location.href = url;
	}

	const initialState = getData(),
		{middleware, bugreport} = createBugReporter(initialState, replace, redirect);
	if (process.env.NODE_ENV === 'production')
		prependMiddlewares(middleware);
	setupReducers(reducers);
	const store = createReduxStore(initialState);
	history = syncHistoryWithStore(Modernizr.history ? browserHistory : hashHistory, store);
	if (enableBugReport) {
		$(window).keydown(event => {
			if (!(event.altKey && event.ctrlKey && event.shiftKey && event.key === 'B')) return;
			dialog.prompt({
				message: 'Report a bug',
				placeholder: 'Name',
				callback: bugreport,
			});
		});
	}

	await preloadComponents(history, store);
	ReactDOM.hydrate(
		<App store={store} history={history}/>,
		document.getElementById('app-container'),
	);
	

	if (module.hot) {
		module.hot.accept('./redux/reducers', () => {
			// reload reducers again
			let newReducers = require('./redux/reducers').default;
			setupReducers(newReducers);
			store.replaceReducer(newReducers);
		});

		module.hot.addStatusHandler(status => {
			if (status === 'idle')
				messenger.post('Hot update');
		});
	}
}

main();