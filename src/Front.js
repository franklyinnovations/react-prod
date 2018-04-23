import React from 'react';
import {connect} from 'react-redux';

@connect(state => ({location: state.location}))
export default class Front extends React.Component {
	componentDidUpdate(prevProps) {
		$(window).scrollTop(0);
	}

	render() {
		return this.props.children;
	}
}