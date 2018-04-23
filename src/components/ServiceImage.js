import React from 'react';

export default function ServiceImage(props) {
	return <img {...props} onError={onImageError}/>
}

function onImageError(event) {
	event.target.src = '/imgs/noimage.png';
}