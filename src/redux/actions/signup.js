import api, {makeErrors} from '../../api';

const view = 'signup';

export function init() {
	return async dispatch => {
		dispatch({type: 'LOADING_MODULE', view});
		let [
			{data: {data: timezones}},
			{data: countries},
			{data: languages},
			{data: {data: dateformats}},
		] = await Promise.all([
			api({
				url: '/admin/utils/timezones',
			}),
			api({
				url: '/admin/country/list',
			}),
			api({
				url: '/admin/language/signuplist',
			}),
			api({
				url: '/admin/utils/date-formats',
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			timezones,
			languages,
			dateformats,
			countries: countries.map(item => ({
				value: item.id,
				label: item.countrydetails[0].name,
			})),
			data: {
				name: '',
				alias: '',
				address: '',
				zip_code: '',
				cityName: '',
				stateName: '',
				date_format: '',
				countryId: '',
				salutation: '',
				fullname: '',
				secondary_lang: '',
				email: '',
				phone: '',
				mobile: '',
				timezone: '',
			}
		});
	};
}

export function submit(state) {
	return async dispatch => {
		dispatch({type: 'SEND_SIGNUP_REQUEST'});
		let item = state.item;
		let {data} = await api({
			data: {
				lang: state.lang.code,
				langId: state.lang.id,
				user: {
					email: item.email,
					mobile: item.mobile,
					salutation: item.salutation,
					secondary_lang: item.secondary_lang,
				},
				institute: {
					phone: item.phone,
					timezone: item.timezone,
					countryId: item.countryId,
					stateName: item.stateName,
					cityName: item.cityName,
					zip_code: item.zip_code,
					date_format: item.date_format,
				},
				userdetail: {
					fullname: item.fullname,
				},
				institutedetail: {
					name: item.name,
					alias: item.alias,
					address: item.address,
				},
			},
			url: '/admin/sign-up',
		});

		if (data.errors) {
			dispatch({
				type: 'SET_SIGNUP_ERRORS',
				errors: makeErrors(data.errors),
			});
		} else {
			dispatch({type: 'SIGNUP_DONE'});
		}
	};
}