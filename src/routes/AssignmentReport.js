import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	messenger,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/assignmentreport';
import * as actions from '../redux/actions/assignmentreport';
addView('assignmentreport', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Table,
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
export default class AssignmentReport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_AR_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value
	});

	load = () => {
		let {start, end, teachers} = this.props.selector;
		if (teachers.length === 0) {
			return messenger.post({
				type: 'error',
				message: window.__('Please select a teacher'),
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
					<Col xs={12}>
						<ControlLabel><Text>Teachers</Text></ControlLabel>
						<FormGroup>
							<Select
								multi
								name='teachers'
								onChange={this.update}
								value={this.props.selector.teachers}
								options={this.props.meta.teachers}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>From</Text></ControlLabel>
						<FormGroup>
							<Datepicker
								name='start'
								onChange={this.update}
								placeholder={__('From')}
								value={this.props.selector.start}
								data-action-type='UPDATE_AR_SELECTOR'/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>To</Text></ControlLabel>
						<FormGroup>
							<Datepicker
								name='end'
								placeholder={__('To')}
								onChange={this.update}
								value={this.props.selector.end}/>
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
	teachers: state.view.state.teachers,
}))
class Report extends React.Component {
	render() {
		let {teachers} = this.props;
		if (teachers === false) return null;
		if (teachers === null) return <Loading/>;
		return (
			<React.Fragment>
				<Table bordered condensed responsive striped>
					<tbody>
						<tr key='heading'>
							<td><Text>Teacher</Text></td>
							<td><Text>Draft</Text></td>
							<td><Text>Published</Text></td>
							<td><Text>Cancelled</Text></td>
							<td><Text>Completed</Text></td>
						</tr>
						{
							teachers.map(teacher => (
								<tr key={teacher.id}>
									<td>
										{teacher.user.userdetails[0].fullname}
									</td>
									<td>{teacher.Draft}</td>
									<td>{teacher.Published}</td>
									<td>{teacher.Canceled}</td>
									<td>{teacher.Completed}</td>
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