import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RouterContext } from 'react-router';
import { grabPromises } from '../utils';

export default class FetchData extends Component {

	componentWillReceiveProps(nextProps) {
		if (this.props.lkey !== nextProps.lkey)
			this.fetchData(nextProps);
	}

	async fetchData(props) {
		this.context.store.dispatch({type: 'START_FETCHING'});
		await grabPromises(
			props.components,
			props.params,
			this.context.store
		);
		this.context.store.dispatch({type: 'DONE_FETCHING'});
	}

	render() {
		return <RouterContext {...this.props}/>;
	}
}

FetchData.propTypes = {
	fetching: PropTypes.bool.isRequired,
};

FetchData.defaultProps = {
	fetching: true
};

FetchData.contextTypes = {
	store: PropTypes.object.isRequired
};
