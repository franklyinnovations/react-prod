import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
	Clearfix,
	Text,
	View,
	Button,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Timepicker,
	Loading,
	Table,
} from '../components';

import * as actions from '../redux/actions/maproutevehicle';
import reducer from '../redux/reducers/maproutevehicle';
import {addView} from '../redux/reducers/views';
addView('maproutevehicle', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class MapRouteVehicle extends React.Component {

	static fetchData(store, params) {
		return store.dispatch(actions.init(store.getState(), params));
	}

	updateData = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);

		this.props.dispatch(actions.update('UPDATE_DATA_VALUE', name, value));

		if (name === 'routeId') {
			this.props.dispatch(actions.loadRouteAddresses(this.props, value));
		}
	};

	updateTime = event => this.props.dispatch({
		type: 'UPDATE_TIME_VALUE',
		name: event.currentTarget.props.name,
		index: event.currentTarget.props.dataIndex,
		value: getInputValue(event.currentTarget),
	});

	goBack = () => this.props.router.goBack();

	save = () => this.props.dispatch(actions.save(this.props));

	render() {
		if (this.props.loading) return <Loading/>;

		let __ = makeTranslater(this.props.translations, this.props.lang.code);

		return (
			<View>
				<Row>
					<Col md={6}>
						<FormGroup
							controlId='driverId'
							validationState={this.props.errors.driverId ? 'error': null}>
							<ControlLabel><Text>Driver</Text></ControlLabel>
							<Select
								name="driverId"
								onChange={this.updateData}
								title={__('Select Driver')}
								value={this.props.item.driverId}
								placeholder={__('Select Driver')}
								options={this.props.meta.drivers}/>
							<HelpBlock>{this.props.errors.driverId}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='helperId'
							validationState={this.props.errors.helperId ? 'error': null}>
							<ControlLabel><Text>Helper</Text></ControlLabel>
							<Select
								name='helperId'
								onChange={this.updateData}
								title={__('Select Helper')}
								value={this.props.item.helperId}
								placeholder={__('Select Helper')}
								options={this.props.meta.helpers}/>
							<HelpBlock>{this.props.errors.helperId}</HelpBlock>
						</FormGroup>
					</Col>
					<Clearfix/>
					<Col md={6}>
						<FormGroup
							controlId='routeId'
							validationState={this.props.errors.routeId ? 'error': null}>
							<ControlLabel><Text>Route</Text></ControlLabel>
							<Select
								name='routeId'
								onChange={this.updateData}
								title={__('Select Route')}
								value={this.props.item.routeId}
								placeholder={__('Select Route')}
								options={this.props.meta.routes}/>
							<HelpBlock>{this.props.errors.routeId}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				{
					this.props.addresses !== false &&
					<Table>
						<thead>
							<tr>
								<th className='tw-50'><Text>Address</Text></th>
								<th className='tw-25'><Text>Pick-Up Time</Text></th>
								<th className='tw-25'><Text>Drop Time</Text></th>
							</tr>
						</thead>
						<tbody>
							{
								this.props.addresses === null ?
								<tr key={0}>
									<td colSpan='3'><Loading/></td>
								</tr> : this.renderAddresses()
							}
						</tbody>
					</Table>
				}
				<Button onClick={this.goBack}>
					<Text>Cancel</Text>
				</Button>
				{' '}
				<Button onClick={this.save} bsStyle='primary'>
					<Text>Submit</Text>
				</Button>
			</View>
		);
	}


	renderAddresses() {
		return this.props.addresses.map(
			(address, index) => 
				<tr key={address.routeaddressId}>
					<td>{address.label}</td>
					<td>
						<Timepicker
							name='pick_up_time'
							dataIndex={index}
							value={address.pick_up_time}
							onChange={this.updateTime}/>
					</td>
					<td>
						<Timepicker
							name='drop_time'
							dataIndex={index}
							value={address.drop_time}
							onChange={this.updateTime}/>
					</td>
				</tr>
		);
	}

}