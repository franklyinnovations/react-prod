import React from 'react';
import {connect} from 'react-redux';

import {getInputValue} from '../utils';

import makeTranslater from '../translate';

import {
	Row,
	Col,
	Text,
	View,
	Button,
	Alert,
	Table,
	Select,
	Loading,
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentroute';
import * as actions from  '../redux/actions/studentroute';
addView('studentroute', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	lang: state.lang,
	translations: state.translations,
	...state.view.state,
}))
export default class StudentRoute extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	updateSelector = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch({type: 'UPDATE_SELECTOR', name, value});

		if (name === 'routeId')
			this.props.dispatch(actions.loadRvdhsmaps(this.props, value));
	};

	loadStudents = event => {
		event.preventDefault();
		this.props.dispatch(actions.loadStudents(this.props));
	};

	reset = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [],
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	save = () => this.props.dispatch(actions.save(this.props));

	render() {
		if (this.props.loading) return <Loading/>;
		const __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View>
				<form>
					<Row>
						<Col md={4}>
							<FormGroup validationState={this.props.errors.routeId ? 'error' : null}>
								<ControlLabel>
									<Text>Route</Text>
								</ControlLabel>
								<Select
									valueKey='id'
									labelKey='name'
									name='routeId'
									onChange={this.updateSelector}
									options={this.props.meta.routes}
									value={this.props.selector.routeId}/>
								<HelpBlock>{this.props.errors.routeId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup validationState={this.props.errors.rvdhsmapId ? 'error' : null}>
								<ControlLabel>
									<Text>Vehicle</Text>
								</ControlLabel>
								<Select
									name='rvdhsmapId'
									onChange={this.updateSelector}
									value={this.props.selector.rvdhsmapId}
									loading={this.props.meta.rvdhsmaps === null}
									options={this.props.meta.rvdhsmaps || undefined}/>
								<HelpBlock>{this.props.errors.rvdhsmapId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup validationState={this.props.errors.bcsmapId ? 'error' : null}>
								<ControlLabel>
									<Text>Class</Text>
								</ControlLabel>
								<Select
									valueKey='id'
									labelKey='name'
									name='bcsmapId'
									onChange={this.updateSelector}
									options={this.props.meta.bcsmaps}
									value={this.props.selector.bcsmapId}/>
								<HelpBlock>{this.props.errors.bcsmapId}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					{
						this.props.selector.bcsmapId === null &&
						<Alert bsStyle='warning'>
							<Text>
								Please select a class to view students who are not mapped to any route.
							</Text>
						</Alert>
					}
					<Row>
						<Col md={4}>
							<FormGroup>
								<ControlLabel>
									<Text>Zip Code</Text>
								</ControlLabel>
								<FormControl
									name='zip_code'
									placeholder={__('Zip Code')}
									onChange={this.updateSelector}
									value={this.props.selector.zip_code}/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<ControlLabel>
									<Text>Enrollment No</Text>
								</ControlLabel>
								<FormControl
									name='enrollment_no'
									placeholder={__('Enrollment No')}
									onChange={this.updateSelector}
									value={this.props.selector.enrollment_no}/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<ControlLabel>
									<Text>Name</Text>
								</ControlLabel>
								<FormControl
									name='name'
									placeholder={__('Name')}
									onChange={this.updateSelector}
									value={this.props.selector.name}/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<ControlLabel>
									<Text>Mobile</Text>
								</ControlLabel>
								<FormControl
									name='mobile'
									placeholder={__('Mobile')}
									onChange={this.updateSelector}
									value={this.props.selector.mobile}/>
							</FormGroup>
						</Col>
						{
							this.props.meta.stats &&
							<Col md={4}>
								<FormGroup>
									<ControlLabel>
										<Text>Stats</Text>
									</ControlLabel>
									{this.renderStats()}
								</FormGroup>
							</Col>
						}
					</Row>
					<FormGroup>
						<Button
							type='submit'
							bsStyle='primary'
							onClick={this.loadStudents}>
							<Text>Go</Text>
						</Button>
						{' '}
						<Button
							type='submit'
							onClick={this.reset}
							bsStyle='primary'>
							<Text>Reset</Text>
						</Button>
					</FormGroup>
				</form>
				{
					this.props.meta.routes.length === 0 &&
					<Alert bsStyle='warning'>
						<Text>
							No active routes found.
						</Text>
					</Alert>
				}
				{
					this.props.meta.rvdhsmaps && this.props.meta.rvdhsmaps.length === 0 &&
					<Alert bsStyle='warning'>
						<Text>No active vehicle is mapped to selected route.</Text>
					</Alert>
				}
				{this.renderStudents()}
			</View>
		);
	}

	renderStudents() {
		let items = this.props.items;
		if (items === false) return false;
		if (items === null) return <Loading/>;
		if (items.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No students found</Text>
				</Alert>
			);
		return (
			<React.Fragment>
				<Table bordered condensed striped>
					<thead>
						<tr>
							<th className='tw-20'><Text>Student Info</Text></th>
							<th className='tw-20'><Text>Address</Text></th>
							<th className='tw-30'><Text>Pickup Point</Text></th>
							<th className='tw-30'><Text>Drop Point</Text></th>
						</tr>
					</thead>
					<tbody>
						{
							items.map((item, index) =>
								<StudentRouteSelector
									item={item}
									index={index}
									key={item.id}
									meta={this.props.meta}
									dispatch={this.props.dispatch}/>
							)
						}
					</tbody>
				</Table>
				{
					this.props.errors.drops &&
					<Alert bsStyle='danger'>
						<Text>Vehicle is overloaded during Drop.</Text>
					</Alert>
				}
				{
					this.props.errors.pickups &&
					<Alert bsStyle='danger'>
						<Text>Vehicle is overloaded during Pickup.</Text>
					</Alert>
				}
				<Button onClick={this.save} bsStyle='primary'>
					<Text>Save</Text>
				</Button>
			</React.Fragment>
		);
	}

	renderStats() {
		let stats = this.props.meta.stats;
		return (
			<FormControl.Static bsStyle='info'>
				<Text>Total Seats</Text>
				{': '} {stats.seats},
				&nbsp;&nbsp;
				<Text>Pickups</Text>
				{': '} {stats.pickups},
				&nbsp;&nbsp;
				<Text>Drops</Text>
				{': '} {stats.drops}
			</FormControl.Static>
		);
	}
}

class StudentRouteSelector extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_STUDENT',
		index: this.props.index,
		value: event.currentTarget.value,
		name: event.currentTarget.name,
	});

	render() {
		let item = this.props.item, meta = this.props.meta;
		return (
			<tr>
				<td className='tw-20'>
					<div><strong><Text>En.No.</Text></strong>{': '}{item.enrollment_no}</div>
					<div><strong><Text>Name</Text></strong>{': '}{item.user.userdetails[0].fullname}</div>
					<div><strong><Text>{'Father\'s Name'}</Text></strong>{': '}{item.studentdetails[0].father_name}</div>
					<div><strong><Text>Mobile</Text></strong>{': '}{item.user.mobile}</div>
				</td>
				<td className='tw-20'>
					<div>{item.studentdetails[0].address}</div>
					{
						item.zip_code &&
						<div><Text>Zip Code</Text>:{item.zip_code}</div>
					}
				</td>
				<td className='tw-30'>
					<Select
						name='pickupId'
						onChange={this.update}
						options={meta.rvdhsmapaddresses}
						value={item.rvdhsmaprecord.pickupId}/>
				</td>
				<td className='tw-30'>
					<Select
						name='dropId'
						onChange={this.update}
						options={meta.rvdhsmapaddresses}
						value={item.rvdhsmaprecord.dropId}/>
				</td>
			</tr>
		);
	}
}