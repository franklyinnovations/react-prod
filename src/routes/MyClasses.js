import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Link} from 'react-router';

import {
	dialog,
	bcsName,
	messenger,
	isHtmlEmpty,
	moduleActions,
	getColumnColor
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/myclasses';
import * as actions from '../redux/actions/myclasses';
addView('myclasses', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Alert,
	Modal,
	Table,
	Panel,
	Button,
	Loading,
	FormGroup,
	PanelGroup,
	TextEditor,
	Datepicker,
	FormControl,
	ControlLabel
} from '../components';

@connect(state => ({
	session: state.session,
	cookies: state.cookies,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Attendance extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}
	permissions = {
		assignment: moduleActions(this.props.session.modules, 'assignment'),
		classreport: moduleActions(this.props.session.modules, 'classreport'),
	};
	weekly = () => this.props.dispatch(actions.loadWeekly(this.props));
	classReport = (tt, tta) => this.props.dispatch(
		actions.classReport(this.props, tt, tta)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateDate = event => {
		let date = moment(
				event.currentTarget.value,
				this.props.session.userdetails.date_format
			),
			day = date.format('dddd');
		if (!event.currentTarget.value) {
			this.props.dispatch({type: 'RESET_ATT_DATE'});
		} else {
			document.cookie = 'pacd=' + date.format('YYYY-MM-DD') + ';expires=' + 
				new Date(Date.now() + 86400 * 365).toUTCString();
			this.props.dispatch({
				type: 'SET_ATT_DATE',
				day,
				cookies: document.cookie,
				date: event.currentTarget.value,
			});
		}
	};
	saveClassReport = () => {
		let report = document.getElementById('att-report').value;
		if (isHtmlEmpty(report)) {
			messenger.post({
				type: 'error',
				message: window.__('Report can not be empty'),
			});
			return;
		}
		this.props.dispatch(actions.saveClassReport(this.props, report));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		if (this.props.weekdays !== false) return this.renderWeekDays();
		let classes = this.props.router.location.pathname.indexOf('classes') !== -1;
		return (
			<View actions={
				<React.Fragment>
					<Col md={4}>
						<div className='form-horizontal'>
							<FormGroup>
								<Col className='text-left' componentClass={ControlLabel} md={2}>
									<Text>Date</Text>
								</Col>
								<Col md={10}>
									<Datepicker
										datepicker={{
											minDate: this.props.session.selectedSession.start_date,
											maxDate: this.props.session.selectedSession.end_date,
										}}
										onChange={this.updateDate}
										value={this.props.meta.date}/>
								</Col>
							</FormGroup>
						</div>
					</Col>
					{
						classes &&
						<Col md={8}>
							<Row>
								<View.Actions>
									<View.Action onClick={this.weekly}>
										<Text>Weekly Schedule</Text>
									</View.Action>
								</View.Actions>
							</Row>
						</Col>
					}
				</React.Fragment>
			}>
				<div className='page-header'>
					<FormControl.Static>
						<Text options={this.props.meta}>Schedule of [[day]]</Text>
					</FormControl.Static>
				</div>
				<React.Fragment>
					{this.props.bcsmaps !== false && this.renderClasses(classes)}
					{this.renderClassReport()}
				</React.Fragment>
			</View>
		);
	}

	renderWeekDays() {
		let numRows = 0;
		if(this.props.weekdays) {
			for (let i = this.props.weekdays.length - 1; i >= 0; i--) {
				numRows = Math.max(this.props.weekdays[i].classes.length, numRows);
			}
		}

		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.hideDataModal}>
						<Text>Back</Text>
					</View.Action>
				</View.Actions>
			}>
				{
					this.props.weekdays === null ? <Loading/> :
					<React.Fragment>
						<div className='page-header'>
							<Row>
								<Col md={6}>
									<Text>Weekly Schedule</Text>
								</Col>
								<Col md={6} className='text-right'>
									<a
										href={
											'/weekly/' +this.props.session.id+ '/' +
											this.props.session.userdetails.userId +
											'/timetable.pdf'
										}
										target='_blank'
										rel='noopener noreferrer'>
										<Text>Download</Text>
									</a>
								</Col>
							</Row>
						</div>
						<Table responsive condensed bordered className="weekly-schedule">
							<tbody>
								<tr>
									{
										this.props.weekdays.map((item, index) =>
											<td key={index} style={{textAlign: 'center'}}>
												<Text>{item.day}</Text>
											</td>
										)
									}
								</tr>
								{
									Array.apply(null, {length: numRows}).map((i, index) => {
										return (
											<tr key={index}>
												{
													this.props.weekdays.map(item => {
														return (
															item.classes[index] ?
															<td key={item.classes[index].id} style={{background: getColumnColor()}}>
																<strong>{bcsName(item.classes[index].timetable.bcsmap)}</strong>
																<br/>
																{item.classes[index].time}
																<br/>
																{item.classes[index].subject.subjectdetails[0].name}
																,&nbsp;
																<Text>Period</Text> {item.classes[index].period}
															</td>
															:
															<td></td>
														);
													})
												}
											</tr>
										);
									})
								}
							</tbody>
						</Table>
					</React.Fragment>
				}
			</View>
		);
	}

	renderClasses(classes) {
		if (this.props.bcsmaps === null) return <Loading/>;
		if (this.props.bcsmaps.length === 0)
			return <Alert bsStyle='warning'><Text>No classes found.</Text></Alert>;
		let date = moment(
			this.props.meta.date,
			this.props.session.userdetails.date_format
		).format('YYYY-MM-DD');
		return (
			<PanelGroup accordion id='att-classes'>
				{
					this.props.bcsmaps.map(item =>
						<Panel key={item.id} eventKey={item.id}>
							<Panel.Heading>
								<div>
									<strong>{bcsName(item.bcsmap)}</strong>
									<Panel.Toggle className='pull-right lead'>
										<Icon glyph='fa-chevron-circle-down'/>
									</Panel.Toggle>
								</div>
								{
									item.studentrecord !== null &&
									<div>
										<Text options={{number: item.studentrecord.toString()}}>
											[[number]] Students
										</Text>
										&nbsp;
										<Link to={'/my-student?bcsMapId=' + item.bcsMapId + '&date=' + date}>
											<Icon glyph='fa-eye'/>
										</Link>
									</div>
								}
								<div>
									<Text>Class Teacher</Text>: &nbsp;
									{item.teacher.user.userdetails[0].fullname}
								</div>
							</Panel.Heading>
							<Panel.Body collapsible>
								<Row>
									{
										item.timetableallocations.map(tta =>
											<Col key={tta.id} md={6}>
												<TeacherClass
													tta={tta}
													date={date}
													item={item}
													assignment={classes && this.permissions.assignment.view}
													classReport={classes &&
														this.permissions.classreport.view && this.classReport
													}/>
											</Col>
										)
									}
								</Row>
							</Panel.Body>
						</Panel>
					)
				}
			</PanelGroup>
		);
	}

	renderClassReport() {
		return (
			<Modal
				onHide={this.hideDataModal}
				show={this.props.classReport !== false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<Text options={this.props.classReport}>Report for [[nameOfClass]]</Text>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						this.props.classReport &&
						<React.Fragment>
							<p>
								<Text>Subject</Text>:&nbsp;
								{this.props.classReport.timetableallocation.subject.subjectdetails[0].name}
							</p>
							<p>
								<Text>Date</Text>:&nbsp;
								{this.props.meta.date}
							</p>
							<p>
								<Text>Time</Text>:&nbsp;
								{this.props.classReport.timetableallocation.time}
							</p>
							{
								this.props.classReport.report === null ? <Loading/> :
								<React.Fragment>
									<TextEditor
										id='att-report'
										disabled={this.props.classReport.report.is_locked}
										defaultValue={this.props.classReport.report.content}/>
									{
										(this.permissions.classreport.add &&
											!this.props.classReport.report.is_locked) &&
										<div className='text-right'>
											<Button
												bsStyle='primary'
												onClick={this.saveClassReport}>
												<Text>Submit</Text>
											</Button>
										</div>
									}
								</React.Fragment>
							}
						</React.Fragment>
					}
				</Modal.Body>
			</Modal>
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props.meta.date !== prevProps.meta.date)
			this.props.dispatch(actions.loadClasses(this.props));
	}
}

@connect(state => ({
	selectedSession: state.session.selectedSession,
	date_format: state.session.userdetails.date_format,
}))
class TeacherClass extends React.PureComponent {

	classReport = () => {
		let date = moment(this.props.date, 'YYYY-MM-DD'),
			inAcademicSession = date.isSameOrAfter(
				this.props.selectedSession.start_date, 'YYYY-MM-DD'
			) && date.isSameOrBefore(
				this.props.selectedSession.end_date, 'YYYY-MM-DD'
			);
		if (date.isAfter(moment().startOf('day'))) {
			dialog.alert(window.__('Not allow to submit report of future date.'));
		} else if (!inAcademicSession) {
			dialog.alert(window.__('Selected date out of academic session.'));
		} else {
			this.props.classReport(this.props.item, this.props.tta);
		}
	};

	attendance = event => {
		let date = moment(this.props.date, 'YYYY-MM-DD'),
			inAcademicSession = date.isSameOrAfter(
				this.props.selectedSession.start_date, 'YYYY-MM-DD'
			) && date.isSameOrBefore(
				this.props.selectedSession.end_date, 'YYYY-MM-DD'
			);
		if (date.isAfter(moment().startOf('day'))) {
			dialog.alert(window.__('Not allow to take attendance of future date.'));
			event.preventDefault();
		} else if (!inAcademicSession) {
			dialog.alert(window.__('Selected date out of academic session.'));
			event.preventDefault();
		}
	};

	render() {
		return (
			<div className='card'>
				<Row>
					<Col md={4}>
						<div>{this.props.tta.time}</div>
						<div>
							{this.props.tta.subject.subjectdetails[0].name}
							,&nbsp;
							<Text>Period</Text> {this.props.tta.period}
						</div>
					</Col>
					<Col md={8} className='text-right'>
						<Link
							onClick={this.attendance}
							className='btn btn-default'
							to={'/student-attendance/attendance/' + this.props.date + ',' + this.props.tta.token}>
							<Text>Attendance</Text>
						</Link>
						&nbsp;
						{
							this.props.classReport &&
							<Button onClick={this.classReport}>
								<Text>Class Report</Text>
							</Button>
						}
						&nbsp;
						{
							this.props.assignment &&
							<Link className='btn btn-default' to='/assignment/setup'>
								<Text>Assignment</Text>
							</Link>
						}
					</Col>
				</Row>
			</div>
		);
	}
}