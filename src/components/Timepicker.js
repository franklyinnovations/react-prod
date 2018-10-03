import React from 'react';
import moment from 'moment';
import FormControl from 'react-bootstrap/lib/FormControl';

export default class Timepicker extends React.Component {

	constructor(props) {
		super(props);

		const invalidValue = !moment(this.props.value, 'HH:mm:ss').isValid();
		this.state = {value: invalidValue ? Timepicker.defaultProps.value : this.props.value};
		if (invalidValue) this.triggerOnChange();

		this.hours = [];
		for (let i = 0; i < 12; i++) {
			this.hours.push(
				<option key={i} value={i+1}>{'' + (i < 9 ? ('0' + (i+1)) : (i + 1))}</option>
			);
		}

		this.minutes = [];
		for (let i = 0; i < 60; i+=5) {
			this.minutes.push(
				<option key={i} value={i}>{'' + (i < 10 ? ('0' + i) : i)}</option>
			);
		}

		this.meridiems = [
			<option key='am' value='am'>am</option>,
			<option key='pm' value='pm'>pm</option>,
		];
	}

	change = event => {
		let val = moment(this.state.value, 'HH:mm:ss'),
			value = event.target.value,
			name = event.target.getAttribute('data-name');
		if (name === 'meridiem') {
			val = moment(val.format('h') + ':' + val.format('m') + ':' + value, 'h:m:a');
		} else {
			val.set(name, parseInt(value));
		}
		this.value = val.format('HH:mm:ss');
	};

	triggerOnChange = () => {
		if (this.props.onChange) {
			this.props.onChange({currentTarget: this});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.value = nextProps.value;
	}

	render() {
		let value = moment(this.state.value, 'HH:mm:ss');
		return (
			<div className='timepicker'>
				<FormControl
					data-name='hour'
					onChange={this.change}
					componentClass='select'
					value={value.format('h')}>
					{this.hours}
				</FormControl>
				<FormControl
					data-name='minute'
					onChange={this.change}
					componentClass='select'
					value={value.format('m')}>
					{this.minutes}
				</FormControl>
				<FormControl
					data-name='meridiem'
					onChange={this.change}
					componentClass='select'
					value={value.format('a')}>
					{this.meridiems}
				</FormControl>
				<input type='hidden' name={this.props.name} value={this.state.value}/>
			</div>
		);
	}

	get value() {
		return this.state.value;
	}

	set value(val) {
		if (val === this.state.value) return;
		this.setState({
			value: moment(val, 'HH:mm:ss').isValid() ? 
				val : Timepicker.defaultProps.value
		}, this.triggerOnChange);
	}

	get name() {
		return this.props.name;
	}
}

Timepicker.defaultProps = {
	value: '06:00:00'
};