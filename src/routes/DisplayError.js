import React from 'react';
import {IndexLink, withRouter} from 'react-router';


function DisplayError ({router}) {
	let message,
		error;
	switch (router.location.pathname) {
		case '/500':
			error = '500';
			message = 'Internal Error';
			break;
		case '/503':
			error = '503';
			message = 'Service Unavailable';
			break;
		case '/401':
			error = '401';
			message = 'Access denied';
			break;
		case '/404':
		default:
			error = '404';
			message = 'Page not Found';
			break;
	}
	return (
		<div className="errorpage-content-section">   
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						<div className="errorpage-content">
							<div className="errorpage-vetor">
								<img src="/imgs/404-vector.png" />
							</div>
							<div className="errorpage-details">
								<h1>{error}</h1>
								<h2>{message}</h2>
							</div>
							<div className="errorpage-btns">
								<IndexLink to='/'>Go to Home</IndexLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(DisplayError);