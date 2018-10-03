import React from 'react';
import {connect} from 'react-redux';

function ServiceImage({src, servicePath, absolute = false, play, ...props}) {
	let Component = /\.mp4$/i.test(src) ? Video : 'img';
	return (
		<Component
			{...props}
			dispatch={undefined}
			onError={onImageError}
			src={absolute ? src : servicePath + src}
			play={Component === 'img' ? undefined : play}/>
	);
}

function onImageError(event) {
	if (event.target.tagName === 'img')
		event.target.src = '/imgs/noimage.png';
}

function Video({play=true, ...props}) {
	return (
		play ?
		<video controls preload='metadata' {...props}/> : 
		<ServiceImage {...props} src='/imgs/admin/video.png' absolute/>
	);
}

export default connect(state => ({servicePath: state.session.servicePath}))(ServiceImage);