import chat from './chat';
import views from './views';

function session(state = {}, action) {
	switch (action.type) {
		case 'INIT_APP': {
			let siteAdmin = {...action.session.siteAdmin};
			delete siteAdmin.password;
			delete siteAdmin.oauth;
			return siteAdmin;
		}
		case 'SET_SELECTED_SESSION': {
			return {
				...state,
				selectedSession: action.session
			};
		}
		case 'SET_ACADEMICSESSIONS': {
			let siteAdmin = {...state};
			siteAdmin.userdetails.academicSessions = action.data;
			if (!siteAdmin.selectedSession)
				siteAdmin.selectedSession = action.data[0];
			return siteAdmin;
		}
		case 'PROFILE_SAVED': {
			let siteAdmin = {...state};
			siteAdmin.userdetails.user_image = action.user_image;
			if (siteAdmin.user_type !== 'institute')
				siteAdmin.userdetails.fullname = action.fullname;
			return siteAdmin;
		}
		case 'PROFILE_INSTITUTE_CHANGED':
			return {
				...state,
				userdetails: {
					...state.userdetails,
					date_format: action.data.date_format,
				},
			};
		case 'PROFILE_DEFAULTS_CHANGED':
			return {
				...state,
				...action.defaults
			};
		default:
			return state;
	}
}

function cookies(state = '', action) {
	switch (action.type) {
		case 'INIT_APP':
		case 'SET_COOKIE':
			return action.cookie || '';
		case 'SET_ATT_DATE':
			return action.cookies;
		default:
			return state;
	}
}

function view(state = {name: null, loading: true}, action) {
	let {name = null, state: viewState = undefined, loading} = state;
	switch (action.type) {
		case 'LOADING_MODULE': 
			return {
				loading: true,
				name: action.view,
				state: views[action.view](
					action.view === name ? viewState : undefined,
					action
				)
			};
		case 'INIT_MODULE': {
			if (name !== null && action.view !== name) {
				return state;
			} else {
				return {name, state: views[action.view](viewState, action)};
			}
		}
		case 'INIT_MODULE_SYNC':
			return {name: action.view, state: views[action.view](undefined, action)};
		default: {
			if (name === null || views[name] === undefined) {
				return state;
			} else {
				return {name, state: views[name](viewState, action), loading};
			}
		}
	}
}

function location(state = {query: {}, pathname: '/'}, action) {
	switch (action.type) {
		case '@@router/LOCATION_CHANGE':
			$(window).scrollTop(0);
			return {
				query: action.payload.query,
				pathname: action.payload.pathname,
			};
		case 'INIT_APP':
			return {
				query: action.query,
				pathname: action.pathname,
			};
		default:
			return state;
	}
}

const defaultLang = {
	id: 1,
	code: 'en',
	dir: 'lr',
};

function lang(state = defaultLang, action) {
	switch (action.type) {
		case 'INIT_APP':
			return {
				...state,
				...action.lang,
			};
		default:
			return state;
	}
}

function translations(state = {}, action) {
	switch (action.type) {
		case 'INIT_APP':
			return action.translations;
		default:
			return state;
	}
}

function fetching (state = false, action) {
	switch(action.type) {
		case 'DONE_FETCHING':
			return false;
		case 'START_FETCHING':
			return true;
		default:
			return state;
	}
}

module.exports = {
	view,
	location,
	session,
	cookies,
	lang,
	translations,
	chat,
	fetching,
};
