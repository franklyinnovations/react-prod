import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Icon extends React.Component {

	static propTypes = {
		bundle: PropTypes.string,
		glyph: PropTypes.string.isRequired,
	};

	static defaultProps = {
		bundle: 'fas',
	};

	render() {
		let {glyph, className, bundle, ...props} = {...this.props};
		return (
			<i
				{...props}
				className={classnames(bundle, glyph, className)}/>
		);
	}
}