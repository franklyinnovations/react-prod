import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';

class DateView extends React.PureComponent {

	static dispalyName = 'DateView';

	static defaultProps = {
		format: 'DD/MM/YYYY'
	};

	render () {
		let format = this.props.format;
		if (this.props.time) format += ' hh:mm A';
		return this.props.children && moment(this.props.children).format(format);
	}
}

export default connect((state) => ({
	format: state.session.userdetails ? state.session.userdetails.date_format : undefined,
}))(DateView);