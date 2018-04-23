import React from 'react';

import ReactSelect from 'react-select';

export default class Select extends React.Component {
	constructor(props) {
		super(props);
		this.empty = this.props.multi ? this.props.value.length === 0 : !this.props.value;
		this.onChange = (value) => {
			this.empty = this.props.multi ? value.length === 0 : value === null;
			if (this.props.onChange)
				this.props.onChange({
					target: {
						value: this.props.multi ? value.map(x => x.value) : (value && value.value),
						name: this.props.name
					}
				});
		};

		this.selectProps = {...this.props};
		delete this.selectProps.onChange;
	}

	componentWillReceiveProps(nextProps) {
		this.selectProps = {...nextProps};
		this.empty = nextProps.multi ? nextProps.value.length === 0 : !nextProps.value;
		delete this.selectProps.onChange;
	}

	render() {
		return (
			<div>
				{ 
					(typeof this.selectProps.isCreatable != "undefined" && this.selectProps.isCreatable) ? 
					<ReactSelect.Creatable {...this.selectProps} onChange={this.onChange}/> : 
					<ReactSelect {...this.selectProps} onChange={this.onChange}/>
				}
				{
					this.empty &&
					<input type="hidden" name={this.props.name} value=''/>
				}
			</div>
		)
	}
}
