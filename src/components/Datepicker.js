import React from 'react';
import ReactDOM from 'react-dom';

import {
	Icon,
	InputGroup,
	FormControl,
} from '@sketchpixy/rubix';


export default class Datepicker extends React.Component {

	open = () => $(this.el).focus();

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== undefined)
			$(this.el).data('DateTimePicker').date(nextProps.value);
	}

	render() {
		return (
			<InputGroup>
				<FormControl
					ref={this.gotEl}
					id={this.props.id}
					name={this.props.name}
					className={this.props.className}
					placeholder={this.props.placeholder}/>
				<InputGroup.Addon onClick={this.open}>
					<Icon glyph='icon-fontello-calendar-1'/>
				</InputGroup.Addon>
			</InputGroup>
		);
	}

	gotEl = (el) => {
		if(el) {
			this.el = ReactDOM.findDOMNode(el);
			$(this.el)
				.datetimepicker(this.props.datepicker)
				.on('dp.change', () => {
					if (this.props.onChange)
						this.props.onChange({target: this});
				});
				if (this.props.value !== undefined)
					$(this.el).data('DateTimePicker').date(this.props.value);
		} else {
			let data = $(this.el).data('DateTimePicker');
			if (data) data.destroy();
		}
	};

	get name() {
		return this.props.name;
	}

	get value() {
		return $(this.el).data('DateTimePicker').date();
	}

	getAttribute(name) {
		return this.props[name];
	}
}
