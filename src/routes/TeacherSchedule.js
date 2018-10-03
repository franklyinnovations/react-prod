import React from 'react';
import {connect} from 'react-redux';

import {
	mapRange,
	messenger,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/teacherschedule';
import * as actions from '../redux/actions/teacherschedule';
addView('teacherschedule', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Table,
	Alert,
	Button,
	Select,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class TeacherSchedule extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_TS_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	load = () => {
		let {weekday, subjectId} = this.props.selector;
		if (subjectId === null)
			return messenger.post({
				message: window.__('Please select subject'),
				type: 'error',
			});
		if (weekday === null)
			return messenger.post({
				message: window.__('Please select weekday'),
				type: 'error',
			});

		this.props.dispatch(actions.load(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				<Row key='selector'>
					<Col md={6}>
						<ControlLabel><Text>Subject</Text></ControlLabel>
						<FormGroup>
							<Select
								name='subjectId'
								onChange={this.update}
								value={this.props.selector.subjectId}
								options={this.props.meta.subjects}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>Weekday</Text></ControlLabel>
						<FormGroup>
							<Select
								name='weekday'
								onChange={this.update}
								value={this.props.selector.weekday}
								options={this.props.meta.days}/>
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
		if (teachers === null)
			return (
				<Row>
					<Col xs={12}>
						{this.props.teachers === null && <Loading/>}
					</Col>
					<br/>
				</Row>
			);
		if (teachers.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No teachers found</Text>
				</Alert>
			);
		let cols = teachers.reduce((max, teacher) => Math.max(teacher.timetableallocations.length, max), 1);
		return (
			<React.Fragment>
				<Table bordered condensed responsive striped>
					<tbody>
						<tr key='heading'>
							<th><Text>Teacher</Text></th>
							<th colSpan={cols}><Text>Schedule</Text></th>
						</tr>
						{
							teachers.map(teacher => (
								<tr key={teacher.id}>
									<td key='name'>{teacher.user.userdetails[0].fullname}</td>
									{
										mapRange(cols, index => (
											<td key={index}>
												{
													index < teacher.timetableallocations.length ?
														teacher.timetableallocations[index].start_time
														+ ' - ' + teacher.timetableallocations[index].end_time :
														'-'
												}
											</td>
										))
									}
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
