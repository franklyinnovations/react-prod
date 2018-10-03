import api, {makeApiData} from '../../api';
import {bcsName} from '../../utils';

const view = 'lmsstudymaterial';
export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			url: '/admin/lmsstudymaterial',
			cookies: state.cookies,
			data: makeApiData(state),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: data.bcsmaps.map(item => ({
				value: item.id,
				label: bcsName(item),
			})),
		});
	};
}

export function changeClass(state, value) {
	if (value === null) {
		return {type: 'RESET_LSM_CLASS'};
	}
	return async dispatch => {
		dispatch({type: 'CHANGING_LSM_CLASS', value});
		let {data: {data}} = await api({
			url: '/admin/lmsstudymaterial/getSubjects',
			data: makeApiData(state, {bcsmapId: value}),
		});
		dispatch({
			type: 'SET_LSM_SUBJECTS',
			data: data.map(item => ({
				value: item.subject.id,
				label: item.subject.subjectdetails[0].name,
			})),
		});
	};
}

export function changeSubject(state, value) {
	if (value === null) {
		return {type: 'RESET_LSM_SUBJECT'};
	}
	return async dispatch => {
		dispatch({type: 'CHANGING_LSM_SUBJECT', value});
		let {data: {data}} = await api({
			url: '/admin/lmsstudymaterial/getChapters',
			data: makeApiData(state, {
				subjectId: value,
				bcsmapId: state.selector.bcsmapId,
			}),
		});
		dispatch({
			type: 'SET_LSM_CHAPTERS',
			data: data.map(item => ({
				value: item.id,
				label: item.lmschapterdetails[0].name,
			})),
		});
	};
}

export function changeChapter(state, value) {
	if (value === null) {
		return {type: 'RESET_LSM_CHAPTER'};
	}
	return async dispatch => {
		dispatch({type: 'CHANGING_LSM_CHAPTER', value});
		let {data: {data}} = await api({
			url: '/admin/lmsstudymaterial/getTopics',
			data: makeApiData(state, {lmschapterId: value})
		});
		dispatch({
			type: 'SET_LSM_TOPICS',
			data: data.map(item => ({
				value: item.id,
				label: item.lmstopicdetails[0].name,
			})),
		});
	};
}


export function load(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_LSM_DATA'});
		let {data: {data}} = await api({
			url: '/admin/lmsstudymaterial/loadStudyMaterial',
			data: makeApiData(state, {lmstopicId: state.selector.topicId}),
		});
		let
			notes = [],
			presentations = [],
			videos_animation = [],
			content = data ? data.lmstopicdetails[0].content : '';
		content = {__html: content};
		const videoFormats = ['.mp4','.avi','.wmv','.mov', '.webm'],
			presentationFormats = ['.ppt', '.pptx'],
			notesFormats = ['.png','.jpg','.jpeg','.gif', '.pdf', '.xls',
				'.xlsx', '.doc','.docx', '.txt'];
		if(data) {
			for (var i = data.lmstopicdocuments.length - 1; i >= 0; i--) {
				if(videoFormats.indexOf(data.lmstopicdocuments[i].type) !== -1){
					videos_animation.push(data.lmstopicdocuments[i]);
				} else if(notesFormats.indexOf(data.lmstopicdocuments[i].type) !== -1){
					notes.push(data.lmstopicdocuments[i]);
				} else if(presentationFormats.indexOf(data.lmstopicdocuments[i].type) !== -1){
					presentations.push(data.lmstopicdocuments[i]);
				}
			}
		}

		dispatch({
			type: 'SET_LSM_DATA',
			data: {videos_animation, presentations, notes, content},
		});
	};
}
