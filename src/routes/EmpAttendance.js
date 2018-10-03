import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {getInputValue, dayLeaveOptions} from '../utils';

import makeTranslater from '../translate';

import {
	Row,
	Col,
	Text,
	View,
	Button,
	Alert,
	Select,
	Loading,
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel,
	Datepicker,
	Radio,
	Panel,
	ServiceImage,
	Clearfix
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/empattendance';
import * as actions from  '../redux/actions/empattendance';
addView('empattendance', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	lang: state.lang,
	translations: state.translations,
	...state.view.state,
}))
export default class EmpAttendance extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	updateEmpAttendance = event => {
		this.props.dispatch(
			actions.updateEmpAttendance(
				this.props,
				event.currentTarget.name,
				getInputValue(event.currentTarget)
			)
		);
	};

	updateSelector = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch({type: 'UPDATE_SELECTOR', name, value});
	};

	loadEmployees = event => {
		event.preventDefault();
		this.props.dispatch(actions.loadEmployees(this.props));
	};

	handleDataUpdate = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE_ATTENDANCE',
		name: event.currentTarget.name,
		itemIndex: parseInt(event.currentTarget.getAttribute('data-index')),
		value: getInputValue(event.currentTarget)
	});

	saveEmpAttendance = () => {
		if (!this.props.selector.date){
			this.props.dispatch({
				type: 'DATE_FIELD',
				errors: {
					date: window.__('This is required field.')
				},
			});
			return Messenger().post({
				type: 'error',
				message: window.__('Please Select Date')
			});
		}
		this.props.dispatch(
			actions.save(this.props)
		);
	};

	applyFilter = event => {
		event.preventDefault();
		this.props.dispatch({
			type: 'APPLY_EMP_ATT_FILTER',
			filter: {
				fullname: this.props.selector.fullname || '',
				mobile: this.props.selector.mobile || '',
				email: this.props.selector.email || ''
			},
		});
	};

	reset = event => {
		event.preventDefault();
		this.props.dispatch({
			type: 'RESET_EMP_ATT_FILTER'
		});
	};

	markAll = event => {
		this.props.dispatch({
			type: 'UPDATE_ALL_EMP_ATT',
			value: event.currentTarget.getAttribute('data-value')
		});
	};

	render() {
		if (this.props.loading) return <Loading/>;
		const __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<form>
				<View>
					<Row>
						<Col md={3}>
							<FormGroup validationState={this.props.errors.date ? 'error' : null}>
								<ControlLabel>
									<Text>Date</Text>
								</ControlLabel>
								<Datepicker
									onChange={this.updateEmpAttendance}
									name='date'
									datepicker={{
										minDate: this.props.session.selectedSession.start_date,
										maxDate: (moment().format('YYYY-MM-DD') < this.props.session.selectedSession.end_date && moment().format('YYYY-MM-DD') > this.props.session.selectedSession.start_date) ? moment().format('YYYY-MM-DD') : this.props.session.selectedSession.end_date,
									}}
									value={this.props.selector.date}
								/>
								<HelpBlock>{this.props.errors.date}</HelpBlock>
							</FormGroup>
						</Col>	
						<Col md={3}>
							<FormGroup validationState={this.props.errors.roleId ? 'error' : null}>
								<ControlLabel>
									<Text>User Role</Text>
								</ControlLabel>
								<Select
									name='roleId'
									onChange={this.updateEmpAttendance}
									value={this.props.selector.roleId}
									options={[
										{
											value: 'all',
											label: 'All'
										},
										...this.props.meta.roles
									]}/>
								<HelpBlock>{this.props.errors.roleId}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Panel>
						<Panel.Heading><Text>Search By</Text></Panel.Heading>
						<Panel.Body>
							<Row>	
								<Col md={4}>
									<FormGroup>
										<ControlLabel>
											<Text>Employee Name</Text>
										</ControlLabel>
										<FormControl
											name='fullname'
											placeholder={__('Name')}
											onChange={this.updateSelector}
											value={this.props.selector.fullname || ''}/>
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
											value={this.props.selector.mobile || ''}/>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup>
										<ControlLabel>
											<Text>Email</Text>
										</ControlLabel>
										<FormControl
											name='email'
											placeholder={__('Email')}
											onChange={this.updateSelector}
											value={this.props.selector.email || ''}/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<Button
										type='submit'
										onClick={this.applyFilter}
										bsStyle='primary'>
										<Text>Go</Text>
									</Button>
									{' '}
									<Button
										type='submit'
										onClick={this.reset}
										bsStyle='primary'>
										<Text>Reset</Text>
									</Button>
								</Col>	
							</Row>
						</Panel.Body>		
					</Panel>
					{
						this.props.items && this.props.items.length > 0 && this.props.items[0].empattendances.length === 0 && this.props.selector.isattendance &&
						<Alert><Text>You have not taken attendance yet.</Text></Alert>
					}
					
					{this.renderEmployees(__)}
				</View>
			</form>
		);
	}

	renderEmployees(__) {
		let items = this.props.items;
		if (items && items.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No employees found</Text>
				</Alert>
			);

		let visibles = 0;
		return (
			items === null ? <Loading />:
			<React.Fragment>
				<Row>
					<Col md={12}>
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
									data-value={4}
									onClick={this.markAll}
									className='active late'>
									H
								</span>
								<label className='late'>
									-
									<Text>All Half Day</Text>
								</label>&nbsp;&nbsp;
								<span
									data-value={2}
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
					{
						items && items.map((item, index) =>
							<React.Fragment key={item.id}>
								<Col md={6} className={item.hide ? 'hide' : (++visibles && '')}>
									<div className='card'>
										<Row>
											<Col md={2}>
												<ServiceImage
													width='75'
													height='75'
													src={item.user_image}
													className='img img-circle pull-left'/>
											</Col>
											<Col md={6}>
												<div>
													<strong><Text>Name</Text>:&nbsp;</strong>
													{item.userdetails[0].fullname} 
												</div>
												<div>
													<strong><Text>Email</Text>:&nbsp;</strong>
													{item.email} 
												</div>
												<div>
													<strong><Text>Mobile</Text>:&nbsp;</strong>
													{item.mobile} 
												</div>
											</Col>
											<Col md={4} className='text-right'>
												{
													item.empleaves.length > 0 ?
													<div className="emp-onleave">
														<Text>On Leave</Text>
														{
															item.empleaves[0].halfday &&
																' ('+dayLeaveOptions(item.empleaves[0].halfday, __)+')'
														}
													</div>	
													:
													<FormGroup
														controlId={'attendancestatus'+index}
														className='empattendance'
													>
														<Radio
															className={'custom-chkbx custom-chkbx1 '+ (item.attendancestatus == 1 ? 'checked': '')}
															inline
															title={__('Present')}
															defaultValue='1'
															data-index={index}
															name={'attendancestatus'+index}
															onChange={this.handleDataUpdate}
															checked={item.attendancestatus == 1 ? true : false}
														>
														</Radio>
														<Radio
															className={'custom-chkbx custom-chkbx3 '+ (item.attendancestatus == 4 ? 'checked': '')}
															inline
															title={__('Present')}
															defaultValue='4'
															data-index={index}
															name={'attendancestatus'+index}
															onChange={this.handleDataUpdate}
															checked={item.attendancestatus == 4 ? true : false}
														>
														</Radio>
														<Radio	
															className={'custom-chkbx custom-chkbx0 '+ ((item.attendancestatus == 2 || item.attendancestatus == 3) ? 'checked': '')}
															inline
															title={__('Absent')}
															defaultValue='2'
															data-index={index}
															name={'attendancestatus'+index}
															onChange={this.handleDataUpdate}
															checked={(item.attendancestatus == 2 || item.attendancestatus == 3) ? true : false}
														>
														</Radio>
													</FormGroup>
												}
											</Col>
										</Row>
									</div>
								</Col>
								{visibles % 2 === 0 && <Clearfix/>}
							</React.Fragment>
						)
					}
				</Row>
				{
					items !== null &&
					<Button 
						onClick={this.saveEmpAttendance} 
						bsStyle='primary'
						disabled={this.props.saving}>
						<Text>Submit</Text>
					</Button>
				}
			</React.Fragment>
		);
	}

}