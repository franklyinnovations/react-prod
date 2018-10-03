import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {messenger} from '../utils';
import {getUserTypes} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/empleavereport';
import * as actions from '../redux/actions/empleavereport';
addView('empleavereport', reducer);


import {
	Row,
	Col,
	View,
	Text,
	Table,
	Alert,
	Select,
	Button,
	Loading,
	FormGroup,
	Datepicker,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class EmpLeaveReport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init());
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_ELR_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value
	});

	load = () => {
		let {start, end, user_type} = this.props.selector;
		if (user_type === null) {
			return messenger.post({
				type: 'error',
				message: window.__('Please select a user type'),
			});
		}
		let date_format = this.props.session.userdetails.date_format;
		if (start && end && moment(start, date_format).isAfter(moment(end, date_format), 'day')) {
			return messenger.post({
				type: 'error',
				message: window.__('Start date should be before end date'),
			});
		}
		this.props.dispatch(actions.load(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code,
		);
		return (
			<View>
				<Row key='selector'>
					<Col md={6}>
						<ControlLabel><Text>From</Text></ControlLabel>
						<FormGroup>
							<Datepicker
								name='start'
								onChange={this.update}
								placeholder={__('From')}
								value={this.props.selector.start}/>
						</FormGroup>
					</Col>
					<Col xs={12} md={6}>
						<ControlLabel><Text>To</Text></ControlLabel>
						<FormGroup>
							<Datepicker
								name='end'
								placeholder={__('To')}
								value={this.props.selector.end}/>
						</FormGroup>
					</Col>
					<Col xs={12} md={6}>
						<ControlLabel><Text>User Type</Text></ControlLabel>
						<FormGroup>
							<Select
								name='user_type'
								onChange={this.update}
								value={this.props.selector.user_type}
								options={getUserTypes(__)}/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup className='hidden-print'>
					<Button
						bsStyle='primary'
						onClick={this.load}>
						<Text>View</Text>
					</Button>
				</FormGroup>
				<Report/>
			</View>
		);
	}
}

@connect(state => ({
	users: state.view.state.users,
}))
class Report extends React.Component {
	render() {
		let {users} = this.props;
		if (users === false) return null;
		if (this.props.users === null) return <Loading/>;
		if (this.props.users.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No employee found</Text>
				</Alert>
			);
		return (
			<React.Fragment>
				<Table bordered condensed responsive striped>
					<tbody>
						<tr key='heading'>
							<td><Text>Employee</Text></td>
							<td><Text>Email</Text></td>
							<td><Text>Mobile</Text></td>
							<td><Text>Pending</Text></td>
							<td><Text>Approved</Text></td>
							<td><Text>Cancelled</Text></td>
							<td><Text>Rejected</Text></td>
						</tr>
						{
							users.map(user => (
								<tr key={user.id}>
									<td>{user.userdetails[0].fullname}</td>
									<td>{user.email}</td>
									<td>{user.mobile}</td>
									<td>{user.leaves[0]}</td>
									<td>{user.leaves[1]}</td>
									<td>{user.leaves[2]}</td>
									<td>{user.leaves[3]}</td>
								</tr>
							))
						}
					</tbody>
				</Table>
				<Button
					bsStyle='primary'
					onClick={window.print}
					className='hidden-print'>
					<Text>Print</Text>
				</Button>
			</React.Fragment>
		);
	}
}