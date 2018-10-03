export function query(state = [], action){
	switch(action.type){
		case 'SET_QUERY':
			return action.query;
		case 'REMOVE_QUERY':
			return state.filter(item => item.name !== action.name);
		default:
			return state;
	}
}

export function filters(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
		case 'RESET_FILTERS':
		case 'SET_QUERY':
		case 'HIDE_FILTERS':
			return null;
		case 'UPDATE_FILTER':
			return {
				...state,
				[action.name]: {
					label: action.label,
					value: action.value,
					valueLabel: action.valueLabel,
				},
			};
		case 'SHOW_FILTERS':
			return action.filters;
		default:
			return state;
	}
}

export function pageInfo(state = null, action) {
	switch(action.type) {
		case 'INIT_MODULE':
			return {
				totalData: action.data.totalData,
				pageCount: action.data.pageCount,
				pageLimit: action.data.pageLimit,
				currentPage: action.data.currentPage
			};
		default:
			return state;
	}
}

