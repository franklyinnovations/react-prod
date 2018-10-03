import api, {makeApiData} from '../../api';
import moment from 'moment';

const view = 'holiday';

export function init() {
	return {
		type: 'INIT_MODULE_SYNC',
		view
	};
}

export async function loadEvents(state, start, end) {
	let {data: {events}} = await api({
		url: '/admin/holiday/events',
		data: makeApiData(state, {start, end}),
	});
	return events.map(item => ({
		id: item.id,
		title: item.holidaydetails[0].name,
		start: moment(item.start_date).format('YYYY-MM-DD'),
		end: moment(item.end_date).add(1, 'days').format('YYYY-MM-DD'),
	}));	
}

export function showModal(data) {
	return {
		type: 'SHOW_HOLIDAY_MODAL',
		data
	};
}

export function closeModal() {
	return {
		type: 'CLOSE_HOLIDAY_MODAL'
	};
}


export function save(state) {
	return async dispatch => {
		if(! state.item.name.trim()){
			dispatch({
				type: 'SET_HOLIDAY_ERRORS',
				errors: {
					name: window.__('This is a required field.')
				}
			});
			return false;
		}
		dispatch({type: 'SEND_HOLIDAY_ADD_REQUEST'});
		let {data: {data}} = await api({
			data: makeApiData(state, {
				id: state.item.id,
				name:state.item.name,
				userId: state.session.id,
				end_date:state.item.end_date,
				start_date:state.item.start_date,
			}),
			url: '/admin/holiday/addEvent'
		});
		dispatch({type: 'ADD_HOLIDAY_SUCCESS'});
		return data ? data.id : true;
	};
}

export function remove(state) {
	return async dispatch => {
		dispatch({type: 'SEND_HOLIDAY_REMOVE_REQUEST'});
		await api({
			data: makeApiData(state, {
				id: state.item.id,
			}),
			url: '/admin/holiday/removeEvent'
		});
		dispatch({type: 'DELETE_HOLIDAY_SUCCESS'});
	};
}
