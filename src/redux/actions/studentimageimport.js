import api, {makeApiData} from '../../api';

const view = 'studentimageimport';

export function init() {
	return {
		type: 'INIT_MODULE_SYNC',
		view,
	};
}

export  function upload(state, formData) {
	return async dispatch => {
		dispatch({type: 'START_SII_UPLOAD'});
		let {data: result} = await api({
			url: '/admin/import/image',
			data: makeApiData(state, formData),
		});
		dispatch({type: 'SII_UPLOAD_DONE', result});
	};
}