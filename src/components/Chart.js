import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Loading from './Loading';

export default class Chart extends React.Component {

	static propTypes = {
		options: PropTypes.shape({
			data: PropTypes.object.isRequired,
		}).isRequired,
		onCreate: PropTypes.func,
	};

	state = {
		c3: false,
	};
	element = React.createRef();
	chart = false;

	render() {
		const	props = {...this.props};
		delete props.options;
		delete props.onCreate;
		return (
			<React.Fragment>
				<div
					{...props}
					ref={this.element}
					className={classnames(this.props.className, 'chart')}/>
				{!this.state.c3 && <Loading/>}
			</React.Fragment>
		);
	}

	async componentDidMount() {
		this.chart = null;
		const c3 = (await import('c3')).default;
		if (this.chart === false) return;
		this.setState({c3: true});
		this.chart = c3.generate({...this.props.options, bindto: this.element.current});
		if (this.props.onCreate) this.props.onCreate(this.chart);
	}

	componentDidUpdate(prevProps) {
		if (this.chart && prevProps.options.data !== this.props.options.data)
			this.chart.load(this.props.options.data);
	}

	componentWillUnmount() {
		this.chart && this.chart.destroy();
		this.chart = false;
	}
}