import React from 'react';
import {IndexLink, Link} from 'react-router';

export default class Banner extends React.Component {
	render() {
		return (
			<div id='top-banner-simple'>
				<div>
				    <img src='/imgs/home/career-banner.jpg'/>
					<h3>{this.props.title}</h3>
				</div>
			</div>
		);
	}
}
