export * as chat from './chat';

import api from '../../api';
import {getInputValue} from '../../utils';


export function changeAcademicSession(session, selectedSession, state) {
	return dispatch => {
		api({
			url: '/session',
			data: {
				...session,
				selectedSession
			}
		}).then(() => {
			dispatch({
				type: 'SET_SELECTED_SESSION',
				session: selectedSession
			});
			state.router.push(state.router.location);
		});
	};
}

export function update(type, name, value) {
	return {
		type,
		name,
		value
	};
}

export function updateFilter(event) {
	let value = getInputValue(event.currentTarget);
	return {
		type: 'UPDATE_FILTER',
		value,
		valueLabel: event.currentTarget.type === 'react-select' ?
			event.currentTarget.optionLabel: value,
		name:  event.currentTarget.name,
		label: event.currentTarget.title,
	};
}

export function setCookie(name: string, value: string, expires: Date) {
	document.cookie = name + '=' + value + ';' + expires.toUTCString();
	return {
		type: 'SET_COOKIE',
		name,
		value,
		cookie: document.cookie,
	};
}