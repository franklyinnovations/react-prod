import React from 'react';
import {connect} from 'react-redux';

const RenderOnFetch = 
	connect(state => ({fetching: state.fetching}))(
		({fetching, Component, props}) =>
			!fetching && Component.component && <Component.component {...props}/>
	);

export default function Loadable(loader) {

	class Component extends React.Component {

		static component = null;

		static async load() {
			return Component.component = (await loader()).default;
		}

		render() {
			return <RenderOnFetch Component={Component} props={this.props}/>;
		}
	}

	return Component;
}