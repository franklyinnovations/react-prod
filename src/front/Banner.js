import React from 'react';
import {IndexLink, Link} from 'react-router';

export default class Banner extends React.Component {
	render() {
		return (
			<div id='top-banner-home'>
				{this.props.children}
			</div>
		);
	}
}
