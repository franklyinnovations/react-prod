import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Icon from './Icon';

class Datepicker extends React.Component {

	static defaultProps = {
		format: 'DD/MM/YYYY',
		valueFormat: 'YYYY-MM-DD',
	};

	elRef = React.createRef();
	open = () => $(this.elRef.current).focus();

	render() {
		/*eslint no-unused-vars: off*/
		let {className, name, value, format, valueFormat, time, ...props} = this.props;
		delete props.onChange, delete props.dispatch, delete props.datepicker;
		if (time) valueFormat += ' hh:mm A';
		return (
			<span className='input-group'>
				<input
					{...props}
					ref={this.elRef}
					className={classnames('form-control', className)}/>
				<input
					name={name}
					type='hidden'
					value={value ? moment(value, format).format(valueFormat) : ''}/>
				<span className='input-group-addon' onClick={this.open}>
					<Icon glyph='fa-calendar-alt'/>
				</span>
			</span>
		);
	}

	async componentDidMount() {
		await Datepicker.loadPlugin();
		let datetimepicker = {...this.props.datepicker};
		if (datetimepicker.format === undefined)
			datetimepicker.format = this.props.format;
		if (this.props.time) datetimepicker.format += ' hh:mm A';
		if (datetimepicker.widgetPositioning === undefined)
			datetimepicker.widgetPositioning = {
				horizontal: 'auto',
				vertical: 'bottom',
			};
		$(this.elRef.current).datetimepicker(datetimepicker);
		if (this.props.value !== undefined)
			$(this.elRef.current).data('DateTimePicker').date(this.props.value);
		$(this.elRef.current).on('dp.change', () => {
			this.props.onChange && this.props.onChange({
				target: this,
				currentTarget: this,
			});
		});
	}

	componentDidUpdate() {
		if (this.value !== this.props.value) {
			let data = $(this.elRef.current).data('DateTimePicker');
			data && data.date(this.props.value);
		}
	}

	componentWillUnmount() {
		let data = $(this.elRef.current).data('DateTimePicker');
		if (data) data.destroy();
	}

	get name() {
		return this.props.name;
	}

	get value() {
		let data = $(this.elRef.current).data('DateTimePicker');
		if (data)
			return data.date() && data.date().format(data.format());
		else
			return this.props.value;
	}

	getAttribute(name) {
		return this.props[name];
	}

	static async loadPlugin() {
		await import('eonasdan-bootstrap-datetimepicker');
		$.fn.datetimepicker.defaults.icons = {
			time: 'fas fa-clock',
			date: 'fas fa-calendar',
			up: 'fas fa-chevron-up',
			down: 'fas fa-chevron-down',
			previous: 'fas fa-chevron-left',
			next: 'fas fa-chevron-right',
			today: 'fas fa-screenshot',
			clear: 'fas fa-trash',
			close: 'fas fa-times'
		};
	}
}

export default connect((state) => ({
	format: state.session.userdetails ? state.session.userdetails.date_format : undefined,
}))(Datepicker);
