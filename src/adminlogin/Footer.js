import React from 'react';

import {
	Row,
	Col,
	Grid,
} from '@sketchpixy/rubix';

export default class Footer extends React.Component {
	state = {
		version: 0
	};

	componentDidMount() {
		this.setState({
			version: document.body.getAttribute('data-version')
		});
	}

	render() {
		var year = new Date().getFullYear();
		return (
			<footer className="footer">
			</footer>
		);
	}
}
