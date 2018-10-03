import React from 'react';
import ReactSelect from 'react-select';

export default class Select extends React.Component {

	onChange = value => {
		if (! this.props.onChange) return;
		let {multi, name, title, valueKey, labelKey} = this.props;
		this.props.onChange({
			currentTarget: {
				name,
				title,
				type: 'react-select',
				getAttribute: attr => this.props[attr],
				optionLabel: value && value[labelKey],
				value: multi ? value.map(x => x[valueKey]) : (value && value[valueKey]),
			},
		});
	};

	render() {
		return (
			<div>
				<ReactSelect
					instanceId={this.props.name}
					{...this.props}
					onChange={this.onChange}/>
				{
					(this.props.multi ? this.props.value.length === 0 : this.props.value === null) &&
					<input type='hidden' name={this.props.name} value=''/>
				}
			</div>
		);
	}
}

Select.defaultProps = {
	valueKey: 'value',
	labelKey: 'label',
};

export class SelectCreatable extends React.Component {

	onChange = value => {
		if (! this.props.onChange) return;
		let {multi, name, title, valueKey, labelKey} = this.props;
		this.props.onChange({
			currentTarget: {
				name,
				title,
				type: 'react-select',
				getAttribute: attr => this.props[attr],
				optionLabel: value && value[labelKey],
				value: multi ? value.map(x => x[valueKey]) : (value && value[valueKey]),
			},
		});
	};

	render() {
		return (
			<div>
				<ReactSelect.Creatable
					{...this.props}
					onChange={this.onChange}
					instanceId={this.props.name}/>
				{
					(this.props.multi ? this.props.value.length === 0 : !this.props.value) &&
					<input type="hidden" name={this.props.name} value=''/>
				}
			</div>
		);
	}
}

SelectCreatable.defaultProps = {
	valueKey: 'value',
	labelKey: 'label',
};

