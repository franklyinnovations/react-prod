import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default class Checkbox extends React.Component {

	static displayName = 'Checkbox';

	static propTypes = {
		value: PropTypes.oneOf([0, false, 1, true, -1, null, undefined]),
	};

	static defaultProps = {
		icons : [
			{
				glyph: 'fa-times-circle',
				bundle: 'far',
				text: 'text-danger',
			},
			{
				bundle: 'far',
				glyph: 'fa-check-circle',
				text: 'text-success',
			},
			{
				bundle: 'fas',
				glyph: 'fa-spinner',
				text: 'text-info',
			},
		]
	};

	state = {
		value: this.props.defaultValue || 0,
	};

	changeValue = () => {
		if (this.props.disabled) return;
		let value;
		switch(this.state.value) {
			case -1:
			case null:
				return;
			case 1:
				value = 0;
				break;
			case true:
				value = false;
				break;
			case 0:
				value = 1;
				break;
			case false:
				value = true;
				break;
		}
		let cb = this.props.onChange && (() => {
			this.props.onChange({
				currentTarget: {
					value,
					name: this.props.name,
					getAttribute: name => this.props[name],
				}
			});
		});
		this.setState({value}, cb);
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.value !== undefined && nextProps.value !== prevState.value)
			return {
				value: nextProps.value
			};
		return null;
	}

	render() {
		let {children, className, inline, disabled, icons, ...props} = this.props, icon;
		switch (this.state.value) {
			case 0:
			case false:
				icon = 0;
				break;
			case 1:
			case true:
				icon = 1;
				break;
			case -1:
			case null:
				icon = 2;
		}
		const {glyph, bundle, text} = icons[icon];
		return (
			<div className={
				'custom checkbox' +
				(inline ? '-inline' : '') +
				(disabled ? ' read-only' : '') +
				(className ? ' ' + className : '')
			} {...props} defaultValue={undefined}>
				<Icon
					tabIndex='0'
					onClick={this.changeValue}
					className={text}
					bundle={bundle}
					glyph={glyph}/>
				{children}
				<input type='hidden' name={this.props.name} value={
					this.props.inputValue || (this.state.value ? '1' : '0')
				}/>
			</div>
		);
	}
}
