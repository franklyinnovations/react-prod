import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	getInputValue,
	dayLeaveOptions,
	dialog
} from '../utils';

import {
	Row,
	Col,
	Clearfix,
	Text,
	View,
	Popover,
	Button,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Modal,
	Icon,
	DateView,
	Loading,
	Datepicker,
	Table,
	Tabs,
	Tab,
	Alert,
	Label,
	Panel,
	OverlayTrigger,
} from '../components';

let C3Chart;
import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/dashboardnew';
import * as actions from '../redux/actions/dashboardnew';
addView('dashboardnew', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class Dashboard extends React.Component {
	static fetchData(store) {
		return store.dispatch(
			actions.init(store.getState())
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code,
		);

		let tiles;
		if (this.props.session.masterId === 1) {
			return <View/>;
		} else {
			return (
				<React.Fragment>
					{tiles}
					<Graphs __={__}/>
				</React.Fragment>
			);
		}
	}
}


@connect(state => ({
	session: state.session,
	lang: state.lang,
	...state.view.state,
}))
class Graphs extends React.Component {

	formatMarksLabel = index => {
		let mark = this.props.graphs.marks.json[index];
		return mark ? mark.name : '';
	};

	formatAttendancesLabel = index => {
		let attendance = this.props.graphs.attendances.json[index];
		return attendance ? attendance.name : '';
	};

	updateAssignments = event => {
		this.props.dispatch(
			actions.updateAssignments(
				this.props,
				event.currentTarget.name,
				getInputValue(event.currentTarget)
			)
		);
	};

	updateTeacherDiary = event => {
		this.props.dispatch(
			actions.updateTeacherDiary(
				this.props,
				event.currentTarget.name,
				getInputValue(event.currentTarget)
			)
		);
	};

	showAllpendingDiary = () => {
		this.props.dispatch({
			type: 'SHOW_TEACHER_DIARY_MODEL',
		});
	};

	showAllpendingAssignment = () => {
		this.props.dispatch({
			type: 'SHOW_TEACHER_ASSIGNMENT_MODEL',
		});
	};

	showClassWiseAttendance = () => {
		this.props.dispatch({
			type: 'SHOW_CLASSWISE_ATTENDANCE_MODEL',
			dateAttendance: this.props.helperData.dateAttendance
		});
	};

	updateAttendance = event => {
		this.props.dispatch(
			actions.updateAttendance(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	updateAttendanceClassWise = event => {
		this.props.dispatch(
			actions.updateAttendanceClassWise(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	updateFee = event => {
		this.props.dispatch(
			actions.updateFee(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	proxyClasses = event => this.props.dispatch(
		actions.proxyClasses(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	getProxyTeachers = event => {
		this.props.dispatch(
			actions.getProxyTeachers(
				this.props,
				event.currentTarget.name,
				getInputValue(event.currentTarget)
			)
		);
	};

	saveProxyClasses = () => {
		if (this.props.helperData.teacherClass === null){
			this.props.dispatch({
				type: 'TEACHER_CLASS',
				errors: {
					timetableallocationId: window.__('This is required field.')
				},
			});
		}else{
			this.props.dispatch(
				actions.saveProxy(this.props)
			);
		}
	};

	updateSelector = event => {
		this.props.dispatch({
			type: 'UPDATE_SELECTOR',
			name: event.currentTarget.name,
			value: getInputValue(event.currentTarget)
		});
	};

	deleteProxyClasses = event => {
		let itemId = event.target.getAttribute('data-item-id');
		dialog.confirm({
			message: window.__('Are you absolutely sure to delete the proxy?'),
			callback: confirmed => {
				if(confirmed) {
					this.props.dispatch(
						actions.deleteProxy(this.props, itemId)
					);
				}
			}
		});
	};

	upcomingProxy = event => this.props.dispatch(
		actions.upcomingProxy(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	getUpcomingProxyClasses = event => this.props.dispatch(
		actions.upcomingProxyClasses(
			this.props,
			event.currentTarget.name,
			getInputValue(event.currentTarget)
		)
	);

	leaveDetail = event => this.props.dispatch(
		actions.leaveDetail(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-status'),
			)
		);
	};

	reject = () => this.props.dispatch(actions.reject(this.props));

	updateMarks = event => {
		this.props.dispatch(
			actions.updateMarks(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	updateTeacherSchedule = event => {
		this.props.dispatch(
			actions.updateTeacherSchedule(
				this.props,
				event.currentTarget.name,
				getInputValue(event.currentTarget)
			)
		);
	};

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	componentDidMount() {
		import('react-c3js')
			.then(c3Chart => {
				C3Chart = c3Chart.default;
				return this.props.dispatch(actions.loadGraphs(this.props));
			})
			.then(() => setTimeout(() => $(window).trigger('resize'), 300));
	}

	render() {
		const __ = this.props.__, user_type = this.props.session.user_type;
		if (this.props.session.masterId === 1) return <View/>;
		return (
			<View>
				<Row className='dashboard-graphs dashboard'>
					<Col sm={12} md={4}>
						<div className="status-graphs">
							<div className="inner-boxes" style={{background:'#e74e32'}}>
								<div className="row">
									<div className="col-xs-6">
										<h4>{__('Students Status')}</h4>
									</div>
									<div className="col-xs-6">
										<FormGroup>
											<Datepicker
												onChange={this.updateAttendance}
												name='dateAttendance'
												datepicker={{
													minDate: this.props.session.selectedSession.start_date,
													maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
												}}
												value={this.props.helperData.dateAttendance}
											/>
										</FormGroup>
									</div>
								</div>	
							</div>
							<div className="box-sapret">
								<Row className="total-values">
									<Col xs={4}>
										<Text>Present</Text>{' : '}{this.props.graphs.classwiseattendances ? this.props.graphs.classwiseattendances.present : 0}
									</Col>
									<Col xs={4}>
										<Text>Absent</Text>{' : '}{this.props.graphs.classwiseattendances ? this.props.graphs.classwiseattendances.absent : 0}
									</Col>
									<Col xs={4}>
										<Text>Late</Text>{' : '}{this.props.graphs.classwiseattendances ? this.props.graphs.classwiseattendances.late : 0}
									</Col>
								</Row>	
								<div className="att-graph">					
									{
										this.props.graphs.attendances ?
										<C3Chart
											style={{direction: 'ltr'}}
											axis={{
												x: {
													type: 'category',
												}
											}}
											data={this.props.graphs.attendances}/> :
										<Loading/>
									}
								</div>
								<div className="text-center view-all-btns">
									<Button
										onClick={this.showClassWiseAttendance}
										bsSize='xsmall'
										bsStyle='primary'
										disabled={this.props.graphs.showAttendance ? false : true}>
										<Text>View All</Text>
									</Button>
								</div>
								{
									this.props.graphs.showAttendance &&
									<React.Fragment>	
										<Modal
											className="attendances-popup"
											bsSize='lg'
											backdrop='static'
											onHide={this.hideDataModal}
											show={this.props.helperData.classwiseattendancemodal}>
											{
												<Modal.Header closeButton>
													<Modal.Title>
														<Text>Class Wise Attendances</Text>
													</Modal.Title>
												</Modal.Header>
											}
											<Modal.Body>
												{
													this.props.graphs.classwiseattendances ?
												<React.Fragment>
													<Row className="dashboard-tab-head">
														<Col md={3}>
															<FormGroup>
																<Datepicker
																	onChange={this.updateAttendanceClassWise}
																	name='dateAttendanceClassWise'
																	datepicker={{
																		minDate: this.props.session.selectedSession.start_date,
																		maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
																	}}
																	value={this.props.helperData.dateAttendanceClassWise}
																/>
															</FormGroup>
														</Col>
														<Col md={6}>
															<div className="total-attend">
																<span className="total-st"><span><Text>Total</Text></span>{' : '}{this.props.graphs.classwiseattendances.totalstrength}{' '}</span>
																<span className="pr"><span><Text>Present</Text></span>{' : '}{this.props.graphs.classwiseattendances.present}{' '}</span>
																<span className="ab"><span><Text>Absent</Text></span>{' : '}{this.props.graphs.classwiseattendances.absent}{' '}</span>
																<span className="late"><span><Text>Late</Text></span>{' : '}{this.props.graphs.classwiseattendances.late}</span>
															</div>
														</Col>
														<Col md={3}>
															<div className="attendances-simble">
																<span><Text>Present</Text>{' '}</span>
																<span><Text>Absent</Text>{' '}</span>
																<span><Text>Late</Text></span>
															</div>
														</Col>
													</Row>
													<Row className="dashboard-table">
														<Col md={12}>
															<Table bordered responsive condensed className="student-tables">
																<tbody>
																	{
																		this.props.graphs.classwiseattendances.data.map((item, index)=>
																			<tr key={index}>
																				{
																					item.bcsmaps.map((item1, index1) =>
																						<td key={index1} className="fixed-width-td">
																							<Table bordered condensed>
																								<tbody>
																									<tr>
																										<th colSpan='3'>
																											<span className='pull-left'>{item1.bname+'-'+item1.name}</span>
																											<span className='pull-right'>{item1.total}</span>
																										</th>
																									</tr>
																									<tr>
																										<td className='tw-33 pr'>
																											{item1.present}
																										</td>
																										<td className='tw-33 ab'>
																											{item1.absent}
																										</td>
																										<td className='tw-33 late'>
																											{item1.late}
																										</td>
																									</tr>
																								</tbody>
																							</Table>
																						</td>
																					)
																				}
																			</tr>
																		)
																	}
																</tbody>
															</Table>
														</Col>
													</Row>
												</React.Fragment>:
												<Loading/>
												}
											</Modal.Body>
										</Modal>
									</React.Fragment>
								}
							</div>
							
						</div>
					</Col>
					<Col sm={12} md={4}>
						<Row>
							<Col md={12}>
								<div className="inner-boxes" style={{background:'#369f5b'}}>
									<div className="row">
										<div className="col-xs-6">
											<h4>{__('Assignment Status')}</h4>					
										</div>
										<div className="col-xs-6">						   		
											<FormGroup>
												<Datepicker
													onChange={this.updateAssignments}
													name='dateAssignments'
													datepicker={{
														minDate: this.props.session.selectedSession.start_date,
														maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
													}}
													value={this.props.helperData.dateAssignments}
												/>
											</FormGroup>
										</div>
									</div>
								</div>
								<div className="box-sapret">
									<Row className="total-values">
										<Col xs={6}>
											<Text>Total Given</Text>{' : '}{this.props.graphs.assignments ? this.props.graphs.assignments.total : 0}
										</Col>
										<Col xs={6} className="text-right">
											<Text>Total Reviewed</Text>{' : '}{this.props.graphs.assignments ? this.props.graphs.assignments.reviewed : 0}
										</Col>
									</Row>
									<Row>
										<Col md={12}>
											<FormGroup>
												<ControlLabel>
													<Text>Class Wise Assignment Status</Text>
												</ControlLabel>
												<Select
													name='bcsMapIdAssignments'
													value={this.props.helperData.bcsMapIdAssignments}
													onChange={this.updateAssignments}
													placeholder={__('Please Select Class')}
													options={this.props.helperData.bcsmaps}/>
											</FormGroup>
										</Col>
										<Clearfix/>
										<Col xs={6}>
											<Text>Total Given</Text>{' : '}{this.props.graphs.assignments ? this.props.graphs.assignments.totalbybcsmapid : 0}
										</Col>
										<Col xs={6} className="text-right">
											<Text>Total Reviewed</Text>{' : '}{this.props.graphs.assignments ? this.props.graphs.assignments.reviewedbybcsmapid : 0}
										</Col>
										<Clearfix/>
									</Row>
								
									<React.Fragment>
										<div className="text-center view-all-btns">
											<Button
												onClick={this.showAllpendingAssignment}
												bsSize='xsmall'
												bsStyle='primary'
												disabled={this.props.helperData.bcsMapIdAssignments ? false : true}>
												<Text>Pending Assignments</Text>
											</Button>
										</div>
										<Modal
											bsSize='lg'
											backdrop='static'
											onHide={this.hideDataModal}
											show={this.props.helperData.pendingassignmentmodal}>
											{
												<Modal.Header closeButton>
													<Modal.Title>
														<Text>Pending Assignments</Text>
													</Modal.Title>
												</Modal.Header>
											}
											<Modal.Body>
												{
													this.props.graphs.assignments && this.props.graphs.assignments.pendingsubjectsbybcsmap.length > 0 ?
													<Table responsive bordered striped>
														<thead>
															<tr>
																<th><Text>Subject Name</Text></th>
															</tr>
														</thead>
														<tbody>
															{
																this.props.graphs.assignments.pendingsubjectsbybcsmap.map(
																	item => 
																		<tr key={item.id}>
																			<td>{item.subject.subjectdetails[0].name}</td>
																		</tr>
																)
															}
														</tbody>
													</Table>:
													<Alert><Text>No pending assignments found, on selected class.</Text></Alert>
												}	
											</Modal.Body>
										</Modal>
									</React.Fragment>
								</div>
							</Col>
							<Col md={12}>
								<div className="inner-boxes" style={{background:'#00a7d9'}}>
									<div className="row">
										<div className="col-xs-6">
											<h4>{__('Teacher Diary')}</h4>					
										</div>
										<div className="col-xs-6">						   		
											<FormGroup>
												<Datepicker
													onChange={this.updateTeacherDiary}
													name='dateTeacherDiary'
													datepicker={{
														minDate: this.props.session.selectedSession.start_date,
														maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
													}}
													value={this.props.helperData.dateTeacherDiary}
												/>
											</FormGroup>
										</div>
									</div>								
								</div>
								<div className="box-sapret">
									<Row className="total-values">
										<Col xs={6}>
											<Text>Total Filled</Text>{' : '}{this.props.graphs.classreports ? this.props.graphs.classreports.filled : 0}
										</Col>
										<Col xs={6} className="text-right">
											<Text>Total Pending</Text>{' : '}{this.props.graphs.classreports ? this.props.graphs.classreports.pending : 0}
										</Col>
									</Row>
									<Row>
										<Col md={12}>
											<FormGroup>
												<ControlLabel>
													<Text>Class Wise Teacher Diary Status</Text>
												</ControlLabel>
												<Select
													name='bcsMapIdTeacherDiary'
													value={this.props.helperData.bcsMapIdTeacherDiary}
													onChange={this.updateTeacherDiary}
													placeholder={__('Please Select Class')}
													options={this.props.helperData.bcsmaps}/>
											</FormGroup>
										</Col>
										<Clearfix/>
										<Col xs={6}>
											<Text>Total Filled</Text>{' : '}{this.props.graphs.classreports ? this.props.graphs.classreports.filledbybcsmapid : 0}
										</Col>
										<Col xs={6} className="text-right">
											<Text>Total Pending</Text>{' : '}{this.props.graphs.classreports ? this.props.graphs.classreports.pendingbybcsmapid : 0}
										</Col>
										<Clearfix/>
									</Row>
									<React.Fragment>
										<div className="text-center view-all-btns">
											<Button
												onClick={this.showAllpendingDiary}
												bsSize='xsmall'
												bsStyle='primary'
												disabled={this.props.helperData.bcsMapIdTeacherDiary ? false : true}>
												<Text>Pending Teacher Diary</Text>
											</Button>
										</div>
										<Modal
											bsSize='lg'
											backdrop='static'
											onHide={this.hideDataModal}
											show={this.props.helperData.teacherdiarymodal}>
											{
												<Modal.Header closeButton>
													<Modal.Title>
														<Text>Pending Teacher Diary</Text>
													</Modal.Title>
												</Modal.Header>
											}
											<Modal.Body>
												{
													this.props.graphs.classreports && this.props.graphs.classreports.pendingteachersbybcsmap.length > 0 ?
													<Table responsive bordered striped>
														<thead>
															<tr>
																<th><Text>Teacher Name</Text></th>
															</tr>
														</thead>
														<tbody>
															{
																this.props.graphs.classreports.pendingteachersbybcsmap.map(
																	item => 
																		<tr key={item.id}>
																			<td>{item.user.userdetails[0].fullname}</td>
																		</tr>
																)
															}
														</tbody>
													</Table>:
													<Alert><Text>No pending teachers found, on selected class.</Text></Alert>
												}
											</Modal.Body>
										</Modal>
									</React.Fragment>
								</div>
							</Col>
						</Row>
					</Col>
					{
						(user_type === 'institute' || user_type === 'admin') &&
						<Col sm={12} md={4}>
							<div>
								<div className="inner-boxes" style={{background:'#e53d3d'}}>
									<div className="row">
										<div className="col-xs-6">
											<h4>{__('Fee Status')}</h4>				
										</div>
										<div className="col-xs-6">						   		
											<FormGroup>
												<Datepicker
													onChange={this.updateFee}
													name='dateFee'
													datepicker={{
														minDate: this.props.session.selectedSession.start_date,
														maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
													}}
													value={this.props.helperData.dateFee}
												/>
											</FormGroup>
										</div>
									</div>	
								</div>
								<div className="box-sapret">	
									<div className="fee-graph">
										{
											this.props.graphs.fees ? 
											<C3Chart style={{direction: 'ltr'}} data={this.props.graphs.fees}/> :
											<Loading/>
										}
									</div>	
								</div>	
							</div>
						</Col>
					}	
				</Row>
				<Row>
					<Col sm={12}>
						<div className="full-boxes-section">
							<div className="full-boxes" style={{background:'#86cbea'}}>
								<div className="row">
									<div className="col-xs-6">
										<h4>{__('Absent Teachers123')}</h4>				
									</div>
									<div className="col-xs-6">						   		
										{
											this.props.graphs.absentteachersrecord &&
											<div className="total-attend">
												<span className="total-st"><span><Text>Total</Text></span>{' : '}{this.props.graphs.absentteachersrecord.total}{' '}</span>
												<span className="pr"><span><Text>Present</Text></span>{' : '}{this.props.graphs.absentteachersrecord.present}{' '}</span>
												<span className="ab"><span><Text>Absent</Text></span>{' : '}{this.props.graphs.absentteachersrecord.absent}{' '}</span>
											</div>
										}
									</div>
								</div>	
							</div>	
							<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
								<Tab eventKey={1} title={__('Today')}>
									<Table bordered responsive condensed>
										<thead>
											<tr>
												<th className='tw-5'><Text>S.No.</Text></th>
												<th className='tw-25'><Text>Name</Text></th>
												<th className='tw-15'><Text>Mobile</Text></th>
												<th className='tw-45'><Text>Classes & Subjects</Text></th>
												<th className='tw-10'><Text>Action</Text></th>
											</tr>
										</thead>
										<tbody>
											{
												(this.props.graphs.absentteachersrecord && this.props.graphs.absentteachersrecord.data.length) ?
													this.props.graphs.absentteachersrecord.data.map((item,index)=>
														<tr key={index}>
															<td>{index + 1}</td>
															<td>
																{item.user.userdetails[0].fullname} {' '}
																{
																	item.empleave && 
																	<span className="dash-onleave">
																		<Text>On Leave</Text>
																		{
																			item.empleave.halfday &&
																				' ('+dayLeaveOptions(item.empleave.halfday, __)+')'
																		}
																	</span>		
																}
															</td>
															<td>{item.user.mobile}</td>
															<td>
																{
																	item.teacher.timetableallocations.length > 0 ?
																	Array.prototype.map.call(item.teacher.timetableallocations, item1 => item1.teachersubject).join(', ')
																	: 'N/A'
																}
															</td>
															<td>
																<Button
																	onClick={this.proxyClasses}
																	bsSize='xsmall'
																	bsStyle='primary'
																	data-item-id={item.teacher.id}
																	disabled={item.teacher.timetableallocations.length > 0 ? false : true}>
																	<Text>Set Proxy</Text>
																</Button>
															</td>
														</tr>
													)
												:<tr>
													<td colSpan='5'>
														<Alert><Text>You have not taken today's attendance yet.</Text></Alert>
													</td>
												</tr>
											}
										</tbody>
									</Table>
									{
										this.props.items.teacherclasses.length > 0 &&
										this.renderTodayProxyModel(__)
									}
								</Tab>
								<Tab eventKey={2} title={__('Upcoming')}>
									<Table bordered responsive condensed>
										<thead>
											<tr>
												<th className='tw-5'><Text>S.No.</Text></th>
												<th className='tw-25'><Text>Name</Text></th>
												<th className='tw-15'><Text>Mobile</Text></th>
												<th className='tw-30'><Text>Date</Text></th>
												<th className='tw-10'><Text>Leave Status</Text></th>
												<th className='tw-15'><Text>Action</Text></th>
											</tr>	
										</thead>
										<tbody>
											{
												(this.props.graphs.upcomingempleaves && this.props.graphs.upcomingempleaves.length) ?
													this.props.graphs.upcomingempleaves.map((item,index)=>
														<tr key={index}>
															<td>{index + 1}</td>
															<td>
																{item.user.userdetails[0].fullname}
																{
																	item.halfday && 
																	<span className="dash-onleave">
																		{
																			' ('+dayLeaveOptions(item.halfday, __)+')'
																		}
																	</span>		
																}
															</td>
															<td>{item.user.mobile}</td>
															<td>{moment(item.start_date).format('DD MMM YY')+' - '+moment(item.end_date).format('DD MMM YY')}</td>
															<td>{Graphs.empStatusLabel(item.leavestatus)}</td>
															<td>
																<Button
																	onClick={this.upcomingProxy}
																	bsSize='xsmall'
																	bsStyle='primary'
																	data-item-id={item.id}>
																	<Text>Set Proxy</Text>
																</Button>{' '}
																<Button
																	onClick={this.leaveDetail}
																	bsSize='xsmall'
																	bsStyle='primary'
																	data-item-id={item.id}>
																	<Text>View Leave</Text>
																</Button>
															</td>
														</tr>
													)
												:<tr>
													<td colSpan='6'>
														<Alert><Text>No upcoming leaves.</Text></Alert>
													</td>
												</tr>
											}
										</tbody>
									</Table>
									{
										this.props.items.upcomingproxydata &&
										this.renderUpcomingProxyModel()
									}
									{
										this.props.items.empleaveinfo &&
										this.renderLeaveModel(__)
									}
								</Tab>
							</Tabs>
						</div>	
					</Col>
				</Row>
				<br/>
				<Row>
					<Col sm={12}>
						<div className="full-boxes-section">
							<div className="full-boxes" style={{background:'#86cbea'}}>
								<div className="row">
									<div className="col-xs-2">
										<h4>{__('Teacher Schedules')}</h4>				
									</div>
									<div className="col-xs-2">
										<FormGroup>
											<Datepicker
												onChange={this.updateTeacherSchedule}
												name='dateTeacherSchedule'
												datepicker={{
													minDate: this.props.session.selectedSession.start_date,
													maxDate: this.props.session.selectedSession.end_date,
												}}
												value={this.props.helperData.dateTeacherSchedule}
											/>
										</FormGroup>
									</div>
									<div className="col-xs-8">						   		
										{
											this.props.graphs.absentteachersrecord &&
											<div className="total-attend">
												<span className="pr"><span><Text>Total Teachers</Text></span>{' : '}{this.props.graphs.teachersdailyschedule ? this.props.graphs.teachersdailyschedule.totalteacher : 0}</span>
												<span className="ab"><span><Text>Scheduled Classes</Text></span>{' : '}{this.props.graphs.teachersdailyschedule ? this.props.graphs.teachersdailyschedule.totalschedule : 0}</span>
											</div>
										}
									</div>
								</div>	
							</div>	
							<Table bordered responsive striped>
								<thead>
								</thead>
								<tbody>
									{ 
										this.props.graphs.teachersdailyschedule &&
										this.props.graphs.teachersdailyschedule.teachers &&
										<React.Fragment>
											<tr key={0}>
												<td style={{width:'150px', verticalAlign:'middle'}}>
													<Icon glyph='fa-arrow-down'/>{' '}
													<Text>Teacher</Text>{'/'}
													<Text>Classes</Text>{' '}
													<Icon glyph='fa-arrow-right'/>
												</td>
												{
													this.props.graphs.teachersdailyschedule.teacherSchedules.length > 0 &&
													this.props.graphs.teachersdailyschedule.teacherSchedules.map((schedule, index2)=> {
														return (
															<td key={index2} style={{verticalAlign:'middle',background:'#ccc'}}>
																{
																	schedule.bcsmap.class.classesdetails[0].name+'-'+schedule.bcsmap.section.sectiondetails[0].name
																}
															</td>
														);
													})
												}
											</tr>
											{this.props.graphs.teachersdailyschedule.teachers.map((teacher, index)=> this.renderTeacherScheduleRow(teacher, index, __))}
										</React.Fragment>
									}
								</tbody>
							</Table>
						</div>	
					</Col>
				</Row>
			</View>
		);
	}

	renderTeacherScheduleRow(teacher, index, __){
		return (
			<tr key={index}>
				<td style={{width:'100px', verticalAlign:'middle', background:'#ccc'}}>
					{teacher.user.userdetails[0].fullname}
				</td>
				{
					this.props.graphs.teachersdailyschedule.teacherSchedules.length > 0 &&
					this.props.graphs.teachersdailyschedule.teacherSchedules.map((schedule, index2)=> {
						return (
							<td key={index2} style={{verticalAlign:'middle'}}>
								{
									schedule.timetableallocations.map(item1 =>
										item1.teacherId === teacher.id &&
										<OverlayTrigger rootClose trigger="click" placement="left" overlay={
											<Popover>
												<Icon bundle='far' glyph='fa-clock' title={__('Timing')}/>&nbsp;
												<span>{moment(item1.start_time, ['HH:mm:ss']).format('hh:mm a')}{'-'}{moment(item1.end_time, ['HH:mm:ss']).format('hh:mm a')}</span><br/>
												<Icon bundle='far' glyph='fa-file' title={__('Subject')}/>&nbsp;	
												<span>{item1.subject.subjectdetails[0].name}</span><br/>
												<Icon bundle='far' glyph='fa-user' title={__('Period')}/>&nbsp;
												<span>{item1.period}</span>
											</Popover>
										}>
											<Icon className='text-success ml-2' glyph='fa-dot-circle' title={__('Click to view')}/>
										</OverlayTrigger>
									)
								}
							</td>
						);
					})
				}
			</tr>
		);
	}

	renderTodayProxyModel(__){
		return (
			<Modal
				className="todaysproxy-popup"
				bsSize='lg'
				backdrop='static'
				onHide={this.hideDataModal}
				show={this.props.items.todayproxy}>
				{
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Proxy Manager</Text>
						</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body>
					{
						this.props.items.proxyclasses ?
					<React.Fragment>
						<Panel>
							<Panel.Heading>
								<div className="proxy-teacher-head">
									<span><span><Text>Teacher Name</Text></span>{' : '}{this.props.items.proxyclasses.user.userdetails[0].fullname}</span>
								</div>
							</Panel.Heading>
							<Panel.Body>
								<Row>
									<Col md={5}>
										<FormGroup validationState={this.props.errors.timetableallocationId ? 'error' : null}>
											<ControlLabel>
												<Text>Teacher Classes</Text>
											</ControlLabel>
											<Select
												name='teacherClass'
												value={this.props.helperData.teacherClass}
												onChange={this.getProxyTeachers}
												placeholder={__('Please Select Teacher Class')}
												options={this.props.items.teacherclasses}/>
											<HelpBlock>{this.props.errors.timetableallocationId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={5}>
										<FormGroup validationState={this.props.errors.teacherId ? 'error' : null}>
											<ControlLabel>
												<Text>Available Teachers</Text>
											</ControlLabel>
											<Select
												name='proxyTeacher'
												value={this.props.helperData.proxyTeacher}
												onChange={this.updateSelector}
												placeholder={__('Please Select Proxy Teacher')}
												options={this.props.items.proxyteachers}/>
											<HelpBlock>{this.props.errors.teacherId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={2}>
										<Button
											style={{marginTop:'25px'}}
											onClick={this.saveProxyClasses}
											bsSize='sm'
											bsStyle='primary'>
											<Text>Set Proxy</Text>
										</Button>
									</Col>
								</Row>
							</Panel.Body>	
						</Panel>	
						<Row>
							<Col md={12}>
								<Table bordered responsive condensed striped className="proxy-tables">
									<thead>
										<tr>
											<th className='tw-40'><Text>Teacher Classes</Text></th>
											<th className='tw-40'><Text>Proxy Teacher</Text></th>
											<th className='tw-20'><Text>Action</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.items.proxycount ?
											this.props.items.proxyclasses.timetableallocations.map((item, index)=>
												(
													item.proxy_classes.length > 0 &&
													<tr key={index}>
														<td>{item.teachersubject+'-'+window.__('Period')+':'+item.period}</td>
														<td>{item.proxy_classes[0].teacher.user.userdetails[0].fullname}</td>
														<td>
															<Button
																onClick={this.deleteProxyClasses}
																bsSize='xsmall'
																bsStyle='primary'
																data-item-id={item.proxy_classes[0].id}>
																<Text>Delete</Text>
															</Button>
														</td>
													</tr>
												))
											: (<tr> 
												<td colSpan={3}>
													<Alert><Text>Yet to set proxy.</Text></Alert>
												</td>
											</tr>)
										}
									</tbody>
								</Table>
							</Col>
						</Row>
					</React.Fragment>:
					<Loading/>
					}
				</Modal.Body>
			</Modal>
		);
	}

	renderUpcomingProxyModel(){
		return (
			<Modal
				className="upcomingproxy-popup"
				bsSize='lg'
				backdrop='static'
				onHide={this.hideDataModal}
				show={this.props.items.upcomingproxy}>
				{
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Proxy Manager</Text>
						</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body>
					{
						this.props.items.upcomingproxydata ?
					<React.Fragment>
						<div className="inner-boxes">
							<div className="row">
								<div className="col-sm-7 proxydate">
									<h4><Text>Select Proxy Date</Text>{': '}</h4>
									<FormGroup>
										<Datepicker
											onChange={this.getUpcomingProxyClasses}
											name='upcomingproxydate'
											datepicker={{
												minDate: (moment().format('YYYY-MM-DD') > this.props.items.upcomingproxydata.start_date) ? moment().format('YYYY-MM-DD') : moment(this.props.items.upcomingproxydata.start_date).format('YYYY-MM-DD'),
												maxDate: moment(this.props.items.upcomingproxydata.end_date).format('YYYY-MM-DD'),
											}}
											value={this.props.helperData.upcomingproxydate}
										/>
									</FormGroup>
								</div>
							</div>	
						</div>
						<Panel>
							<Panel.Heading>
								<div className="upcomingproxy-teacher-head">
									<Row>
										<Col sm={6}>
											<span><span><Text>Teacher Name</Text></span>{' : '}
												{this.props.items.upcomingproxydata.user.userdetails[0].fullname}
											</span>
										</Col>
										<Col sm={6}>
											<span className="pull-right upcomingproxybox">
												<span><Text>From</Text>{':'}</span>
												<DateView>{this.props.items.upcomingproxydata.start_date}</DateView>
												<span><Text>To</Text>{':'}</span>
												<DateView>{this.props.items.upcomingproxydata.end_date}</DateView>
											</span>
										</Col>
									</Row>
								</div>
							</Panel.Heading>
							<Panel.Body>
								{
									this.props.items.proxydate !== null && this.props.items.teacherclasses.length === 0 &&
									<Alert bsStyle='danger' bsSize='small'>
										<Text>Classes have not assigned to teacher on selected date.</Text>
									</Alert>
								}
								<Row>
									<Col md={5}>
										<FormGroup validationState={this.props.errors.timetableallocationId ? 'error' : null}>
											<ControlLabel>
												<Text>Teacher Classes</Text>
											</ControlLabel>
											<Select
												name='teacherClass'
												value={this.props.helperData.teacherClass}
												onChange={this.getProxyTeachers}
												placeholder={__('Please Select Teacher Class')}
												options={this.props.items.teacherclasses}/>
											<HelpBlock>{this.props.errors.timetableallocationId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={5}>
										<FormGroup validationState={this.props.errors.teacherId ? 'error' : null}>
											<ControlLabel>
												<Text>Available Teachers</Text>
											</ControlLabel>
											<Select
												name='proxyTeacher'
												value={this.props.helperData.proxyTeacher}
												onChange={this.updateSelector}
												placeholder={__('Please Select Proxy Teacher')}
												options={this.props.items.proxyteachers}/>
											<HelpBlock>{this.props.errors.teacherId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={2}>
										<Button
											style={{marginTop:'25px'}}
											onClick={this.saveProxyClasses}
											bsSize='sm'
											bsStyle='primary'>
											<Text>Set Proxy</Text>
										</Button>
									</Col>
								</Row>
							</Panel.Body>	
						</Panel>	
						<Row>
							<Col md={12}>
								<Table bordered responsive condensed striped className="proxy-tables">
									<thead>
										<tr>
											<th className='tw-40'><Text>Teacher Classes</Text></th>
											<th className='tw-40'><Text>Proxy Teacher</Text></th>
											<th className='tw-20'><Text>Action</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.items.proxycount === 'loading' ? 
											<tr> 
												<td colSpan={3}>
													<Loading/>
												</td>
											</tr>:
											this.props.items.proxycount && this.props.items.proxyclasses ?
											this.props.items.proxyclasses.timetableallocations.map((item, index)=>
												(
													item.proxy_classes.length > 0 &&
													<tr key={index}>
														<td>{item.teachersubject+'-'+window.__('Period')+':'+item.period}</td>
														<td>{item.proxy_classes[0].teacher.user.userdetails[0].fullname}</td>
														<td>
															<Button
																onClick={this.deleteProxyClasses}
																bsSize='xsmall'
																bsStyle='primary'
																data-item-id={item.proxy_classes[0].id}>
																<Text>Delete</Text>
															</Button>
														</td>
													</tr>
												))
											: (<tr> 
												<td colSpan={3}>
													<Alert><Text>Yet to set proxy.</Text></Alert>
												</td>
											</tr>)
										}
									</tbody>
								</Table>
							</Col>
						</Row>
					</React.Fragment>:
					<Loading/>
					}
				</Modal.Body>
			</Modal>
		);
	}

	renderLeaveModel(__){
		return (
			<Modal
				backdrop='static'
				onHide={this.hideDataModal}
				show={this.props.items.leaveinfo}>
				{
					this.props.items.empleaveinfo &&
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Leave Details</Text>
						</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body className='listheading'>
					{this.props.items.empleaveinfo === null && <Loading/>}
					{
						this.props.items.empleaveinfo &&
							<React.Fragment>
								<Table bordered striped condensed>
									<tbody>		
										<tr>
											<td style={{width: 200}}>
												<Text>Employee Name</Text>
											</td>
											<td>
												{this.props.items.empleaveinfo.user.userdetails[0].fullname}
											</td>
										</tr>

										{(this.props.session.user_type === 'institute' || this.props.session.user_type === 'admin') && 
											<tr>
												<td style={{width: 200}}>
													<Text>User Type</Text>
												</td>
												<td style={{textTransform: 'capitalize'}}>
													<Text>{this.props.items.empleaveinfo.user_type}</Text>
												</td>
											</tr>
										}
										<tr>
											<td>
												<Text>Leave Type</Text>
											</td>
											<td>{this.props.items.empleaveinfo.empleavetype.empleavetypedetails[0].name}</td>
										</tr>
										<tr>
											<td>
												<Text>Total Days</Text>
											</td>
											<td>
												{
													this.props.items.empleaveinfo.duration === 0.5 ?
													<Text>{this.props.items.empleaveinfo.halfday === 1 ? 'First Half' : 'Second Half'}</Text> :
													this.props.items.empleaveinfo.duration
												}
											</td>
										</tr>
										<tr>
											<td>
												<Text>Description</Text>
											</td>
											<td>
												{
													this.props.items.empleaveinfo.tagId ? 
													this.props.items.empleaveinfo.tag.tagdetails[0].description :
													this.props.items.empleaveinfo.comment
												}
											</td>
										</tr>
										<tr>
											<td>
												<Text>Start Date</Text>
											</td>
											<td><DateView>{this.props.items.empleaveinfo.start_date}</DateView></td>
										</tr>
										<tr>
											<td>
												<Text>End Date</Text>
											</td>
											<td><DateView>{this.props.items.empleaveinfo.end_date}</DateView></td>
										</tr>
										<tr>
											<td>
												<Text>Submitted</Text>
											</td>
											<td><DateView>{this.props.items.empleaveinfo.createdAt}</DateView></td>
										</tr>
										{
											this.props.items.empleaveinfo.leavestatus === 3 &&
											<tr>
												<td>
													<Text>Reject Reason</Text>
												</td>
												<td>{this.props.items.empleaveinfo.reject_reason}</td>
											</tr>
										}
										<tr>
											<td>
												<Text>Status</Text>
											</td>
											<td>{Graphs.empStatusLabel(this.props.items.empleaveinfo.leavestatus, __)}</td>
										</tr>
									</tbody>
								</Table> 
								<Row>
									<Col xs={12} className='text-right'>
										{
											(
												this.props.session.user_type === 'institute' ||
												this.props.session.user_type === 'institute'
											) ?
											(
												this.props.items.empleaveinfo.leavestatus !== 2 &&
												<React.Fragment>
													{
														this.props.items.empleaveinfo.leavestatus !== 1 && 
														<Button
															bsStyle='success'
															data-item-status='1'
															onClick={this.changeStatus}
															disabled={this.props.saving}>
															<Text>Approve</Text>
														</Button>
													}
													{' '}
													{
														this.props.items.empleaveinfo.leavestatus !== 3 && 
														<Button
															bsStyle='danger'
															onClick={this.reject}
															disabled={this.props.saving}>
															<Text>Reject</Text>
														</Button>
													}
												</React.Fragment>
											) : 
											(
												this.props.session.user_type === 'teacher' &&
												this.props.session.id === this.props.items.empleaveinfo.userId &&
												this.props.items.empleaveinfo.leavestatus === 0 &&
												<Button
													bsStyle='danger'
													data-item-status='2'
													onClick={this.changeStatus}>
													<Text>Cancel</Text>
												</Button>
											)
										}
									</Col>
								</Row>
							</React.Fragment>
					}	
				</Modal.Body>
			</Modal>
		);
	}

	static empStatusLabel(status) {
		switch (status) {
			case 0:
				return <Label bsStyle='warning'><Text>Pending</Text></Label>;
			case 1:
				return <Label bsStyle='success'><Text>Approved</Text></Label>;
			case 2:
				return <Label bsStyle='danger'><Text>Cancelled</Text></Label>;
			case 3:
				return <Label bsStyle='danger'><Text>Rejected</Text></Label>;
			case -1:
				return <Label bsStyle='warning'><Text>Updating</Text></Label>;
		}
	}
}