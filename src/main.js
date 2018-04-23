require('es6-promise').polyfill();

import React from 'react';

import routes from './routes';
import render, {
	setupReducers,
	replaceReducers,
	prependMiddleware,
} from '../rubix/node/redux-router';

import reducers from './redux/reducers';
import {bugreport, bugReportMiddleware} from "./bugreport";
import {dialog} from "./utils";
import {enableBugReport, addGoogleTagManager} from "./config";
if (process.env.NODE_ENV === 'production')
	prependMiddleware(bugReportMiddleware);
if (enableBugReport) {
	$(window).keydown(event => {
		if (!(event.altKey && event.ctrlKey && event.shiftKey && event.key === 'B')) return;
		dialog.prompt({
			message: 'Report a bug',
			placeholder: 'Name',
			callback: bugreport,
		})
	});
}

setupReducers(reducers);
render(routes);

if (module.hot) {
	module.hot.accept('./routes', () => {
		// reload routes again
		require('./routes').default;
		render(routes);
	});

	module.hot.accept('./redux/reducers', () => {
		// reload reducers again
		let newReducers = require('./redux/reducers');
		replaceReducers(newReducers);
	});
}
