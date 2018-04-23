import React from "react";

import {history} from "../rubix/node/redux-router";
import {enableBugReport, showBugReport, webApiUrl} from "./config";
import axios from "axios";
import {dialog} from "./utils";

let events = [], initialState = JSON.parse(document.getElementById('preloadedData').textContent);

export const bugReportMiddleware = (({getState}) => next => action => {
	if (action.constructor !== Function) {
		if (action.type === 'INIT_MODULE') {
			events = [];
			initialState = getState();
		}
		events.push(action);
	}
	try {
		let result = next(action);
		return (result && result.catch) ? result.catch(handleError) : result;
	} catch (error) {
		handleError(error);
	}
});

function handleError(error: any) {
	switch (error) {
		case 'SERVICE_DOWN':
		case 'SERVER_DOWN':
			history.push('/503');
			break;
		case 'INVALID_SESSION':
			return window.location.href = '/logout';
		case 'ACCESS_DENIED':
			history.push('/401');
			break;
		case 'INTERNAL_ERROR':
		case 'UNKNOWN_ERROR':
		default:
			history.push('/500');
			break;
	}
	if (enableBugReport)
		bugreport(error);
	if (process.env.NODE_ENV !== 'production')
		console.error(error);
}

export function bugreport (error: any) {
	if (!error) return;
	let report = axios({
		method: 'post',
		url: webApiUrl + '/bug/report',
		data: {
			events,
			initialState,
			error: error ? (error.stack || error.message || error) : error,
		}
	});
	if (showBugReport) {
		report.then(({data}) => {
			dialog.alert('Bug report id ' + data.id)
		});
	}
}

