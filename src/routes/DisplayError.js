import React from 'react';
import {IndexLink, withRouter} from 'react-router';

function DisplayError ({router}) {
	let message;
	switch (router.location.pathname) {
		case '/500':
			message = 'Internal Error';
			break;
		case '/503':
			message = 'Service Unavailable';
			break;
		case '/401':
			message = 'Access denied';
			break;
		case '/404':
		default:
			message = 'Page not found';
			break;
	}
	return (
		<div>
			<h1 className='text-center'>{message}</h1>
			<h3 className='text-center'><IndexLink to='/'>Home</IndexLink></h3>
		</div>
	);
}

export default withRouter(DisplayError);