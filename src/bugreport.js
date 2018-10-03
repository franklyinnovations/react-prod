import axios from 'axios';
import {enableBugReport, showBugReport, webApiUrl} from './config';
import {dialog} from './utils';

export default function createBugReporter (_initialState, replace, redirect) {
	let initialState = _initialState, events = [];

	async function bugreport (error) {
		if (!error) return;
		const {data} = await axios({
			method: 'post',
			url: webApiUrl + '/bug/report',
			data: {
				events,
				initialState,
				error: error ? (error.stack || error.message || error) : error,
			}
		});
		if (showBugReport && dialog) {
			dialog.alert('Bug report id ' + data.id);
		}
	}

	function handleError(error) {
		if (process.env.NODE_ENV !== 'production')
			console.error(error.stack || error);

		switch (error) {
			case 'SERVICE_DOWN':
			case 'SERVER_DOWN':
				replace('/503');
				return;
			case 'INVALID_SESSION':
				return redirect('/logout');
			case 'ACCESS_DENIED':
				replace('/401');
				return;
			case 'INTERNAL_ERROR':
			case 'UNKNOWN_ERROR':
			default:
				replace('/500');
				break;
		}

		if (enableBugReport)
			bugreport(error);
	}

	const middleware = ({getState}) => next => action => {
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
	};

	return {middleware, bugreport};
}