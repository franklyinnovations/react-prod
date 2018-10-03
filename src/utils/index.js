import moment from 'moment';

export async function grabPromises(components, params, store) {
	return  Promise.all(
		flattenComponents(components)
			.filter(component => component.fetchData instanceof Function)
			.map(component => component.fetchData(store, params))
	);
}

function addComponent(components, component) {
	if (!component) return;
	if (component.load)
		components.push(component.load());
	else
		components.push(component);
}

export function flattenComponents(components) {
	const flattened = [];
	for (let i = components.length - 1; i >= 0; i--) {
		let component = components[i];
		if (typeof component === 'object') {
			for (let value of Object.values(component)) {
				addComponent(flattened, value);
			}
		} else {
			addComponent(flattened, component);
		}
	}
	return flattened;
}

export async function fetchDataOnServer({ components, params }, store) {
	await grabPromises(components, params, store);
	store.dispatch({type: 'DONE_FETCHING'});
}

export function getColumnColor() {
	let colors = ['#E99F18','#1BA1E2','#2199AF','#EA6B75','#AB89E0', '#219AAF', '#E09A19','#E8424E', '#FD8A65', '#AC85B2'];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const days = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

export const marksheetTemplates = [
	'hydrogen',
	'helium',
	'lithium',
	'beryllium',
	'boron',
];

export function mapRange() {
	let start, end, step, fn = arguments[arguments.length - 1];
	switch (arguments.length) {
		case 2:
			start = 0;
			end = arguments[0];
			step = Math.sign(end);
			break;
		case 3:
			start = arguments[0];
			end = arguments[1];
			step = Math.sign(end - start);
			break;
		case 4:
			start = arguments[0];
			end = arguments[1];
			step = arguments[2];
			break;
		default:
			throw new Error('Invalid Range');
	}
	if (step * (end - start) < 0) throw new Error('Invalid Range');
	if (step === 0) {
		if (end - start === 0)
			return [];
		else
			throw new Error('Invalid Range');
	}
	let result = new Array(Math.floor((end - start) / step));
	for (let i = start; i < end; i += step)
		result[i] = fn(i, result);
	return result;
}

export function getCookie(name: string, cookie: string) {
	let cookies = cookie.split(';');
	for (let i = cookies.length - 1; i >= 0; i--)
		if (cookies[i].trim().startsWith(name))
			return cookies[i].trim().substring(name.length + 1);
	return undefined;
}

export function getInputValue(el) {
	let value;
	if (el.type === 'checkbox')
		value = el.checked;
	else if (el.type === 'select-multiple') {
		value = [];
		let options = el.options;
		for (let i = options.length - 1; i >= 0; i--) {
			if (options[i].selected)
				value.push(options[i].value);
		}
	}
	else
		value = el.value;
	return value;
}

export function getStatusTitle(status, __) {
	switch (status) {
		case 0:
			return __('Active');
		case 1:
			return __('Inactive');
		case -1:
			return __('Updating');
	}
}

export function getStatusOptions(__) {
	return [
		{
			value: '1',
			label: __('Active')
		},
		{
			value: '0',
			label: __('Inactive')
		},
	];
}

export function dayLeaveOptions(status, __) {
	switch (status) {
		case 1:
			return __('First Half');
		case 2:
			return __('Second Half');
	}
}

export function bcsName(bcsmap) {
	return bcsmap.board.boarddetails[0].alias
		+ ' - ' + bcsmap.class.classesdetails[0].name
		+ ' - ' + bcsmap.section.sectiondetails[0].name;
}

export function getServerTime(time) {
	return time;
}

export function getLocalTime(time) {
	return time;
}

export function createDayString(time) {
	return moment(time).calendar(null, {
		sameDay: '[Today]',
		nextDay: '[Tomorrow]',
		nextWeek: 'dddd',
		lastDay: '[Yesterday]',
		lastWeek: 'dddd',
		sameElse: 'Do MMM YYYY'
	});
}

export function createTimeString(time) {
	return moment(time).format('hh:mm a');
}

let googleLibPromise;

export function loadGoogleMapLib() {
	if (window.google) return Promise.resolve(window.google);
	if (googleLibPromise) return googleLibPromise;
	return googleLibPromise = new Promise((resolve) => {
		window.initGoogleMapLib = () => resolve(window.google);
		let script = document.createElement('script');
		script.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyAPDNmdqAA3Tf0mbCxRWc3a3H3xNfb19YA&libraries=places&callback=initGoogleMapLib';
		document.head.appendChild(script);
	});
}

export const TAG_TYPE_EXAM = 1;
export const TAG_TYPE_CONDUCT = 5;
export const TAG_TYPE_REMARK = 6;
export const TAG_TYPE_RESULT = 7;
export const MESSAGE_TYPE_TEXT = 0;

export let messenger = false;
if (typeof Messenger !== 'undefined')
	messenger = Messenger();

export let dialog = false;
if (typeof vex !== 'undefined')
	dialog = vex.dialog;

export function getDate(date) {
	return moment.isMoment(date) ? date.format('YYYY/MM/DD') : moment(date).format('YYYY/MM/DD');
}

export function getDateAndTime(date) {
	return (moment.isMoment(date) ? date : moment(date)).format('Do MMM YYYY hh:mm A');
}

export function filtersFromQuery(query) {
	let filters = {};
	for (let i = query.length - 1; i >= 0; i--) {
		filters[query[i].name] = {
			label: query[i].label,
			value: query[i].value,
			valueLabel: query[i].valueLabel,
		};
	}
	return filters;
}

export function filterValue(filter, name, defaultValue) {
	return (name in filter) ? filter[name].value : defaultValue;
}

export function queryFromFilters(filters) {
	let query = [];
	for (let name in filters) {
		if (filters[name].value !== '' && filters[name].value !== null)
			query.push({
				name,
				...filters[name],
			});
	}
	return query;
}

export function paramsFromState(state, view) {
	let params = {...state.location.query};
	if (state.view && state.view.name === view && state.view.state.query) {
		let query = state.view.state.query;
		for (let param of query) {
			params[param.name] = param.value;
		}
	}
	return params;
}

export function moduleActions(modules, module) {
	let result = {};
	if (modules[module]) {
		modules[module].forEach(action => result[action] = true);
	}
	return result;
}

let downloadlink = null;
export function downloadString(str, type, download, target) {
	let a;
	if (downloadlink) {
		a = downloadlink;
	} else {
		a = downloadlink = document.createElement('a');
		a.style.display = 'none';
		document.body.appendChild(a);
	}
	a.download = download;
	a.target = target;
	a.href = URL.createObjectURL(new Blob([str],{type}));
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 100);
}

let fileInput = null, inputRequest = null;
export async function getFile() {
	let input;
	if (fileInput) {
		input = fileInput;
	} else {
		input = fileInput = document.createElement('input');
		input.setAttribute('type', 'file');
		input.style.display = 'none';
		document.body.appendChild(input);
		input.onchange = () => inputRequest && inputRequest.resolve(input.files);
		$(window).on('focus', inputRequest && inputRequest.resolve([])); 
	}

	return new Promise(resolve => {
		inputRequest = {resolve};
		input.click();
	});
}

export function freeFileInput() {
	fileInput.value = '';
	inputRequest = null;
}

export function idenitity(item) {
	return item;
}

export function objectify(array, {id: idHash, key: keyHash, value: valueHash = idenitity}, ...hashings) {
	let result = new Map(), hash = createObjectHash(idHash, keyHash);
	for (let i = array.length - 1; i >= 0; i--) {
		let key = hash(array[i]),
			value = valueHash(array[i]),
			group = result.get(key);
		if (group)
			group.push(value);
		else
			result.set(key, [value]);
	}
	if (hashings.length === 0)
		return result;
	for (let [key, group] of result)
		result.set(key, objectify(group, ...hashings));
	return result;
}

export function createObjectHash(hash, generate = idenitity) {
	let map = new Map;
	return item => {
		let key = hash(item), result = map.get(key);
		if (result) return result;
		let value = generate(item);
		map.set(key, value);
		return value;
	};
}

export function mapify(array, {key, value = idenitity}) {
	let map = new Map;
	for (let i = array.length - 1; i >= 0; i--) {
		map.set(key(array[i]), value(array[i]));
	}
	return map;
}

export function mapAndFilter(array, fn, thisArg) {
	let result = [];
	for (let i = 0, len = array.length, value; i < len; i++) {
		value = fn.call(thisArg, array[i], i, array);
		if (value !== false) {
			result.push(value);
		}
	}
	return result;
}

export function isHtmlEmpty(html) {
	let div = document.createElement('div');
	div.innerHTML = html;
	return !(div.textContent || div.innerText);
}