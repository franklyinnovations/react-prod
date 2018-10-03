import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Link} from 'react-router';
import makeTranslater from '../translate';

import {
	dialog,
	bcsName,
	moduleActions,
	getColumnColor
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentclasses';
import * as actions from '../redux/actions/studentclasses';
addView('studentclasses', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Alert,
	Table,
	Panel,
	Loading,
	FormGroup,
	Datepicker,
	FormControl,
	ControlLabel,
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

export default class studentClasses extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = {
		assignment: moduleActions(this.props.session.modules, 'assignment'),
	};

	weekly = () => this.props.dispatch(actions.loadWeekly(this.props));

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
			document.cookie = 'pacdd=' + date.format('YYYY-MM-DD') + ';expires=' + 
				new Date(Date.now() + 86400 * 365).toUTCString();
			this.props.dispatch({
				type: 'SET_ATT_DATE',
				day,
				cookies: document.cookie,
				date: event.currentTarget.value,
			});
		}
	};

	showPDF = event => {
		let itemId = event.currentTarget.getAttribute('data-item-id');
		window.open('/timetable/'+itemId+'/timetable.pdf', '_blank');
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.weekdays !== false) return this.renderWeekDays(__);
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
				{this.props.bcsmaps !== false && this.renderClasses(classes)}
			</View>
		);
	}

	renderWeekDays(__) {
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
						<View>
							<div className='page-header'>
								<Row>
									<Col md={6}>
										<Text>Weekly Schedule</Text>
									</Col>
									<Col md={6} className='text-right'>
										<View.Actions>
											<View.Action
												onClick={this.showPDF}
												data-item-id={this.props.meta.timetableId}>
												<Text>Download</Text>
											</View.Action>
										</View.Actions>
									</Col>
								</Row>
							</div>
							<div>
								<Col xs={12} className="tt-info">
									<Row>
										<Col md={6}>
											<div className="form-group">
												<div className="div-txt">
													<Text>Class</Text>:-&nbsp;
													{
														this.props.meta.studentclass.board.boarddetails[0].alias+'/'+
														this.props.meta.studentclass.class.classesdetails[0].name+'/'+
														this.props.meta.studentclass.section.sectiondetails[0].name
													}
												</div>
											</div>
										</Col>
										<Col md={6}>
											<div className="form-group">
												<div className="div-txt">
													<Text>Class Teacher</Text>:-&nbsp;
													{this.props.meta.classteacher.user.userdetails[0].fullname}
												</div>
											</div>
										</Col>
									</Row>
								</Col>
								<Row>
									<Col xs={12}>
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
																			<React.Fragment key={item.classes[index].id}>
																				{item.classes[index].is_break === 1 &&
																					<td key={item.classes[index].id} className='breaktt'>
																						<div className='text-center'>
																							<Icon glyph='fa-coffee'/>&nbsp;
																							{__('Break')}&nbsp;
																							<Icon glyph='fa-utensils'/>	
																						</div>
																					</td>
																				}
																				{!item.classes[index].is_break &&
																					<td key={item.classes[index].id} style={{background: getColumnColor()}}>
																						<div>
																							<Icon bundle='far' glyph='fa-clock' title={__('Timing')}/>&nbsp;
																							{item.classes[index].time}
																							<br/>
																							<Icon bundle='far' glyph='fa-file' title={__('Subject')}/>&nbsp;
																							<span>
																								{
																									item.classes[index].subject ?
																									item.classes[index].subject.subjectdetails[0].name:__('N/A')
																								}
																							</span>
																							<br/>
																							<Icon bundle='far' glyph='fa-user' title={__('Teacher')}/>&nbsp;
																							<span>
																								{
																									item.classes[index].teacher ?
																									item.classes[index].teacher.user.userdetails[0].fullname:__('N/A')
																								}
																							</span>
																						</div>
																					</td>
																				}
																			</React.Fragment>
																		);
																	})
																}
															</tr>
														);
													})
												}
											</tbody>
										</Table>
									</Col>
								</Row>
							</div>		
							
						</View>
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
			<div id='att-classes'>
				{
					this.props.bcsmaps.map(item =>
						<Panel key={item.id} eventKey={item.id}>
							<Panel.Heading>
								<div>
									<strong>{bcsName(item.bcsmap)}</strong>
								</div>
								<div>
									<Text>Class Teacher</Text>: &nbsp;
									{item.teacher.user.userdetails[0].fullname}
								</div>
							</Panel.Heading>
							<Panel.Body>
								<Row>
									{
										item.timetableallocations.map(tta =>
											<Col key={tta.id} md={6}>
												<TeacherClass
													tta={tta}
													date={date}
													item={item}
													assignment={classes && this.permissions.assignment.view}
												/>
											</Col>
										)
									}
								</Row>
							</Panel.Body>
						</Panel>
					)
				}
			</div>
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
	translations: state.translations,
	lang: state.lang,
}))
class TeacherClass extends React.PureComponent {

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
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div className='card'>
				<Row>
					<Col md={8}>
						<div>
							<Icon bundle='far' glyph='fa-clock' title={__('Timing')}/>&nbsp;
							{this.props.tta.time}
						</div>
						<div>
							<Icon bundle='far' glyph='fa-file' title={__('Subject')}/>&nbsp;
							{this.props.tta.subject.subjectdetails[0].name}
							,&nbsp;
							<Text>Period</Text> {this.props.tta.period}
						</div>
						<div>
							<Icon bundle='far' glyph='fa-user' title={__('Teacher')}/>&nbsp;
							{this.props.tta.teacher.user.userdetails[0].fullname}
						</div>
					</Col>
					<Col md={4} className='text-right'>
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