import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';

import {
	getInputValue
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/attendancehome';
import * as actions from '../redux/actions/attendancehome';
addView('attendancehome', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Alert,
	Table,
	Radio,
	Button,
	Select,
	Loading,
	FormGroup,
	HelpBlock,
	Datepicker,
	ControlLabel,
	BCheckbox
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
export default class AttendanceHome extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	updateData = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch({
			type: 'UPDATE_ATT_DATA',
			name,
			value
		});

		if(name === 'date') {
			this.props.dispatch(actions.loadBcsmaps(this.props, value));
		}

		if(name === 'bcsMapId' && this.props.meta.select_type === 'slot') {
			this.props.dispatch(actions.loadSlot(this.props, value));
		}
	};

	next = () => {
		let errors = {};

		if(!this.props.meta.date || this.props.meta.date === ''){
			errors.date = window.__('This is a required field.');
		}

		if(this.props.meta.bcsMapId === ''){
			errors.bcsMapId = window.__('This is a required field.');
		}

		if(this.props.meta.select_type === 'slot' && this.props.meta.subjectId === ''){
			errors.subjectId = window.__('This is a required field.');
		}

		if(Object.keys(errors).length > 0){
			this.props.dispatch({
				type: 'ATT_ERRORS',
				errors
			});
		} else {
			if(this.props.meta.select_type === 'slot') {
				let token = this.props.meta.slot.find(item => item.value === this.props.meta.subjectId).token;
				let href = moment(this.props.meta.date, 'DD/MM/YYYY').format('YYYY-MM-DD')+','+token;
				this.props.router.push('/student-attendance/attendance/'+href);
			} else {
				this.props.dispatch(actions.loadDayWise(this.props));
			}
		}
	}

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				{
					this.props.isLoading ? <Loading /> :
					(this.props.day_wise ? this.renderDayWise():this.renderData())
				}
			</View>
		);
	}

	renderData() {
		let maxDate = moment(this.props.session.selectedSession.end_date).isAfter(moment()) ? moment():this.props.session.selectedSession.end_date;
		return (
			<Row>
				{
					this.props.meta.att_type === 3 &&
					<Col xs={12}>
						<FormGroup>
							<Radio
								inline
								name="select_type"
								value='day'
								checked={this.props.meta.select_type === 'day' ? true:false}
								onChange={this.updateData}>
								Day Wise
							</Radio>{' '}
							<Radio
								inline
								name="select_type"
								value='slot'
								checked={this.props.meta.select_type === 'slot' ? true:false}
								onChange={this.updateData}>
								Slot Wise
							</Radio>
						</FormGroup>
					</Col>
				}
				<Col xs={4}>
					<div className='form-horizontal'>
						<FormGroup
							controlId='date'
							validationState={this.props.errors.date ? 'error': null}>
							<Col className='text-left' componentClass={ControlLabel} md={2}>
								<Text>Date</Text>
							</Col>
							<Col md={10}>
								<Datepicker
									datepicker={{
										minDate: this.props.session.selectedSession.start_date,
										maxDate: maxDate,
									}}
									name='date'
									onChange={this.updateData}
									value={this.props.meta.date}/>
								<HelpBlock>{this.props.errors.date}</HelpBlock>
							</Col>
						</FormGroup>
					</div>
				</Col>
				<Col xs={4}>
					<div className='form-horizontal'>
						<FormGroup
							controlId='bcsMapId'
							validationState={this.props.errors.bcsMapId ? 'error': null}>
							<Col className='text-left' componentClass={ControlLabel} md={2}>
								<Text>Class</Text>
							</Col>
							<Col md={10}>
								<Select
									name='bcsMapId'
									onChange={this.updateData}
									value={this.props.meta.bcsMapId}
									isLoading={!this.props.meta.bcsmaps}
									options={this.props.meta.bcsmaps || []}/>
								<HelpBlock>{this.props.errors.bcsMapId}</HelpBlock>
							</Col>
						</FormGroup>
					</div>
				</Col>
				{
					this.props.meta.select_type === 'slot' &&
					<Col xs={4}>
						<div className='form-horizontal'>
							<FormGroup
								controlId='subjectId'
								validationState={this.props.errors.subjectId ? 'error': null}>
								<Col className='text-left' componentClass={ControlLabel} md={2}>
									<Text>Subject</Text>
								</Col>
								<Col md={10}>
									<Select
										name='subjectId'
										onChange={this.updateData}
										isLoading={!this.props.meta.slot}
										value= {this.props.meta.subjectId}
										options={this.props.meta.slot}/>
									<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
								</Col>
							</FormGroup>
						</div>
					</Col>
				}
				<Col xs={12}>
					<Button
						onClick={this.next}
						bsStyle='primary'>
						<Text>Next</Text>
					</Button>
				</Col>
			</Row>
		);
	};

	update = event => {
		this.props.dispatch({
			type: 'UPDATE_ATT_DAY_WISE',
			itemIndex: event.itemIndex,
			itemIndex2: event.itemIndex2,
			value: event.value
		});
	};

	checkMark = event => {
		let itemIndex = event.currentTarget.getAttribute('data-index'),
			value = getInputValue(event.currentTarget);
		let checkMark = this.props.check_mark;
		if(itemIndex === 'all'){
			if(value) {
				if(this.props.day_wise.length > 0) {
					this.props.day_wise[0].attendancerecords.forEach((item, index) => {
						checkMark[index] = true;
					});
				}
			} else {
				checkMark = {};
			}
		} else {
			if(value) {
				checkMark[itemIndex] = true;
			} else {
				delete checkMark[itemIndex];
			}
		}

		this.props.dispatch({
			type: 'UPDATE_ATT_CHECKBOX',
			value: checkMark
		});
	};

	markAll = event => {
		let value = event.currentTarget.getAttribute('data-value'),
			attendance = this.props.day_wise;
		if(Object.keys(this.props.check_mark).length === 0){
			vex.dialog.alert('Please select students for bulk update.');
		} else {
			Object.keys(this.props.check_mark).forEach(item => {
				attendance = attendance.map(item2 => {
					item2.attendancerecords[parseInt(item)].is_present = parseInt(value);
					return item2;
				});
			});
		}

		this.props.dispatch({
			type: 'UPDATE_MARKED_ATT',
			data: attendance
		});
	};

	backTab = () => {
		this.props.router.push('/student-attendance/attendance');
	};

	saveAttendance = () => {
		this.props.dispatch(actions.saveAttendance(this.props));
	};

	renderDayWise() {
		if(this.props.day_wise === false) return;
		let numRows = 0;
		if(this.props.day_wise.length > 0){
			numRows = this.props.day_wise[0].attendancerecords.length;
		}

		return (
			<Row>
				<Col xs={4}>
					<Button
						onClick={this.backTab}>
						<Text>Back</Text>
					</Button>
				</Col>

				{
					this.props.day_wise.length > 0 ?
					<React.Fragment>
						<Col xs={8}>
							<FormGroup>
								<div className='attendance-input text-right'>
									<span
										data-value={1}
										onClick={this.markAll}
										className='active present'>
										P
									</span>
									<label className='present'>
										-
										<Text>All Present</Text>
									</label>&nbsp;&nbsp;
									<span
										data-value={2}
										onClick={this.markAll}
										className='active late'>
										L
									</span>
									<label className='late'>
										-
										<Text>All Late</Text>
									</label>&nbsp;&nbsp;
									<span
										data-value={3}
										onClick={this.markAll}
										className='active absent'>
										A
									</span>
									<label className='absent'>
										-
										<Text>All Absent</Text>
									</label>&nbsp;&nbsp;
								</div>
							</FormGroup>
						</Col>
						<Col xs={12}>
							<Table bordered responsive>
								<tbody>
									{
										Array.apply(null, {length: numRows}).map((item, index) => {
											return (
												<React.Fragment key={index}>
													{
														index === 0 &&
														<tr>
															{
																this.props.day_wise.map((item2, index2) => 
																	<React.Fragment key={'hd'+index2}>
																		{
																			index2 === 0 &&
																			<th>
																				<BCheckbox
																					data-index={'all'}
																					checked={Object.keys(this.props.check_mark).length === numRows}
																					onChange={this.checkMark}>
																					<b><Text>Student</Text></b>
																				</BCheckbox>
																			</th>
																		}
																		<th>
																			{item2.attendancerecords[index].subject}
																		</th>
																	</React.Fragment>
																)
															}
														</tr>
													}
													<tr>
														{
															this.props.day_wise.map((item2, index2) => 
																<React.Fragment key={index2}>
																	{
																		index2 === 0 &&
																		<td>
																			<BCheckbox
																				data-index={index}
																				checked={this.props.check_mark[index] ? true:false}
																				onChange={this.checkMark}>
																				<b>{item2.attendancerecords[index].student}</b>
																			</BCheckbox>
																		</td>
																	}
																	<td>
																		<div className='attendance-input'>
																			<AttendanceInputOption
																				value={1}
																				className='present'
																				itemIndex={index}
																				itemIndex2={index2}
																				active={item2.attendancerecords[index].is_present === 1}
																				onSelect={this.update}>
																				P
																			</AttendanceInputOption>
																			<AttendanceInputOption
																				value={2}
																				className='late'
																				itemIndex={index}
																				itemIndex2={index2}
																				active={item2.attendancerecords[index].is_present === 2}
																				onSelect={this.update}>
																				L
																			</AttendanceInputOption>
																			<AttendanceInputOption
																				value={3}
																				className='absent'
																				itemIndex={index}
																				itemIndex2={index2}
																				active={item2.attendancerecords[index].is_present === 3}
																				onSelect={this.update}>
																				A
																			</AttendanceInputOption>
																		</div>
																	</td>
																</React.Fragment>
															)
														}
													</tr>
												</React.Fragment>
											);
										})
									}
								</tbody>
							</Table>
						</Col>
						<Col xs={12} className='text-center'>
							<Button
								bsStyle='primary'
								disabled={this.props.saving}
								onClick={this.saveAttendance}>
								<Text>{this.props.saving ? 'Saving...':'Submit'}</Text>
							</Button>
						</Col>
					</React.Fragment>
					:
					<Col xs={12}>
						<br />
						<Alert bsStyle='warning'><Text>No Student Found.</Text></Alert>
					</Col>
				}
			</Row>
		);
	}
}

class AttendanceInputOption extends React.PureComponent {

	select = () => this.props.onSelect(this.props);

	render() {
		return (
			<span
				onClick={this.select}
				className={classnames(
					this.props.active && 'active',
					this.props.className,
				)}>
				{this.props.children}
			</span>
		);
	}
}