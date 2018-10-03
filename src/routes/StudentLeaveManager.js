import React from 'react';
import url from 'url';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	Select,
	DateView,
	FormGroup,
	FormControl,
	Datepicker,
	HelpBlock,
	ControlLabel,
	Modal,
	Label,
	Loading,
	Pagination,
	Table,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentleavemanager';
import * as actions from '../redux/actions/studentleavemanager';
addView('studentleavemanager', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class StudentLeaveManager extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	//permissions = moduleActions(this.props.session.modules, 'StudentLeaveManager');

	toggleFilters = () => {
		if (this.props.filters === null) {
			this.props.dispatch({
				type: 'SHOW_FILTERS',
				filters: filtersFromQuery(this.props.query)
			});
		} else {
			this.props.dispatch({
				type: 'HIDE_FILTERS',
			});
		}
	};

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	search = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: queryFromFilters(this.props.filters),
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	reset = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [],
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-status'),
			)
		);
	};

	reject = () => this.props.dispatch(actions.reject(this.props));

	view = event => this.props.dispatch(
		actions.viewItem(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};

	updateData = event => {
		let action = actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		);
		if (action.name === 'StudentLeaveManagerTypeId') {
			if (action.value)
				action.balance = this.props.meta.leavetypes
					.find(({value}) => value === action.value)
					.balance;
			else
				action.balance = 0;
		} else if (action.name === 'start_date' || action.name === 'end_date') {
			action.date_format = this.props.session.userdetails.date_format;
		}
		this.props.dispatch(action);
	};

	save = () => this.props.dispatch(actions.save(this.props));

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<React.Fragment>
				{
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData()}
					</View>
				}
				<Modal
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Leave Details</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body className='listheading'>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								{
									this.props.item.id ?
									<Table bordered striped condensed>
										<tbody>		
											<tr>
												<td style={{width: 200}}>
													<Text>Student Name</Text>
												</td>
												<td>
													{this.props.item.user.userdetails[0].fullname}
												</td>
											</tr>
											<tr>
												<td>
													<Text>Total Days</Text>
												</td>
												<td>
													{
														this.props.item.duration === 0.5 ?
														<Text>{this.props.item.halfday === 1 ? 'First Half' : 'Second Half'}</Text> :
														this.props.item.duration
													}
												</td>
											</tr>
											<tr>
												<td>
													<Text>Description</Text>
												</td>
												<td>
													{
														this.props.item.tagId ? 
														this.props.item.tag.tagdetails[0].description :
														this.props.item.comment
													}
												</td>
											</tr>
											<tr>
												<td>
													<Text>Start Date</Text>
												</td>
												<td><DateView>{this.props.item.start_date}</DateView></td>
											</tr>
											<tr>
												<td>
													<Text>End Date</Text>
												</td>
												<td><DateView>{this.props.item.end_date}</DateView></td>
											</tr>
											<tr>
												<td>
													<Text>Submitted</Text>
												</td>
												<td><DateView>{this.props.item.createdAt}</DateView></td>
											</tr>
											{
												this.props.item.leavestatus === 3 &&
												<tr>
													<td>
														<Text>Reject Reason</Text>
													</td>
													<td>{this.props.item.reject_reason}</td>
												</tr>
											}
											<tr>
												<td>
													<Text>Status</Text>
												</td>
												<td>{StudentLeaveManager.statusLabel(this.props.item.leavestatus, __)}</td>
											</tr>
										</tbody>
									</Table> :
									<Row>
										<Col md={6}>
											<FormGroup
												controlId='start_date'
												validationState={this.props.errors.start_date ? 'error': null}>
												<ControlLabel><Text>Start Date</Text></ControlLabel>
												<Datepicker
													datepicker={{
														minDate: new Date(),
														maxDate: this.props.session.selectedSession.end_date,
														useCurrent: false,
													}}
													placeholder={__('Start Date')}
													value={this.props.item.start_date}
													onChange={this.updateData}
													name='start_date'/>
												<HelpBlock>{this.props.errors.start_date}</HelpBlock>
											</FormGroup>
										</Col>
										<Col md={6}>
											<FormGroup
												controlId='end_date'
												validationState={this.props.errors.end_date ? 'error': null}>
												<ControlLabel><Text>End Date</Text></ControlLabel>
												<Datepicker
													datepicker={{
														minDate: new Date(),
														maxDate: this.props.session.selectedSession.end_date,
														useCurrent: false,
													}}
													placeholder={__('End Date')}
													value={this.props.item.end_date}
													onChange={this.updateData}
													name='end_date'/>
												<HelpBlock>{this.props.errors.end_date}</HelpBlock>
											</FormGroup>
										</Col>
										{
											(this.props.item.duration === 0.5 || this.props.item.duration === 1) &&
											<React.Fragment>
												<Clearfix/>
												<Col md={6}>
													<FormGroup
														controlId='leaveDay'
														validationState={this.props.errors.leaveDay ? 'error': null}>
														<ControlLabel>
															<Text>Duration</Text>
														</ControlLabel>
														<Select
															name='leaveDay'
															clearable={false}
															onChange={this.updateData}
															value={this.props.item.leaveDay}
															options={StudentLeaveManager.getLeaveDurationOptions(__)}/>
														<HelpBlock>{this.props.errors.leaveDay}</HelpBlock>
													</FormGroup>
												</Col>
												{
													this.props.item.leaveDay === 1 &&
													<Col md={6}>
														<FormGroup
															controlId='halfday'
															validationState={this.props.errors.halfday ? 'error': null}>
															<ControlLabel>{__('Half Day')}</ControlLabel>
															<Select
																name='halfday'
																clearable={false}
																onChange={this.updateData}
																value={this.props.item.halfday}
																options={StudentLeaveManager.getHalfDayOptions(__)}/>
															<HelpBlock>{this.props.errors.halfday}</HelpBlock>
														</FormGroup>
													</Col>
												}
											</React.Fragment>
										}
										<Clearfix/>
										<Col md={6}>
											<FormGroup
												controlId='tagId'
												validationState={this.props.errors.tagId ? 'error': null}>
												<ControlLabel><Text>Reason</Text></ControlLabel>
												<Select
													name='tagId'
													onChange={this.updateData}
													value={this.props.item.tagId}
													options={this.props.meta.tags}/>
												<HelpBlock>{this.props.errors.tagId}</HelpBlock>
											</FormGroup>
										</Col>
										{
											this.props.item.tagId === 0 &&
											<Col md={6}>
												<FormGroup
													controlId='comment'
													validationState={this.props.errors.comment ? 'error': null}>
													<ControlLabel><Text>Comment</Text></ControlLabel>
													<FormControl
														type='text'
														placeholder={__('Comment')}
														value={this.props.item.comment}
														name='comment'
														onChange={this.updateData}/>
													<HelpBlock>{this.props.errors.comment}</HelpBlock>
												</FormGroup>
											</Col>
										}
									</Row>
								}
								<Row>
									<Col xs={12} className='text-right'>
										{
											this.props.item.id ? 
											(
												(
													this.props.session.user_type === 'student' &&
													this.props.session.id === this.props.item.userId &&
													this.props.item.leavestatus === 0 &&
													<Button
														bsStyle='danger'
														data-item-status='2'
														onClick={this.changeStatus}>
														<Text>Cancel</Text>
													</Button>
												)
											) :
											<Button onClick={this.save} bsStyle='primary'>
												<Text>Submit</Text>
											</Button>
										}
									</Col>
								</Row>
							</React.Fragment>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-15'>
								<Text>Total Days</Text>
							</td>
							<td className='tw-20'>
								<Text>Start Date</Text>
							</td>
							<td className='tw-20'>
								<Text>End Date</Text>
							</td>
							<td>
								<Text>Status</Text>
							</td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows(__)}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					//this.permissions.add &&
					this.props.session.user_type !== 'institute' &&
					moment(this.props.session.selectedSession.end_date).isSameOrAfter(new Date()) &&
					<View.Action onClick={this.startAdd} title={__('Filters')}>
						<Text>Apply</Text>
					</View.Action>
				}
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={6}/>;
		}

		return this.props.items.map(item => (
			<tr key={item.id}>
				<td  className='tw-15'>
					{
						item.duration === 0.5 ?
						<Text>{item.halfday === 1 ? 'First Half' : 'Second Half'}</Text> :
						item.duration
					}
				</td>
				<td className='tw-20'>
					<DateView>{item.start_date}</DateView>
				</td>
				<td className='tw-20'>
					<DateView>{item.end_date}</DateView>
				</td>
				{(this.props.session.user_type === 'institute' || this.props.session.user_type === 'admin') && 
					<td className='tw-12' style={{textTransform: 'capitalize'}}>{item.user_type}</td>
				}
				<td>
					{StudentLeaveManager.statusLabel(item.leavestatus)}
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							//this.permissions.view &&
							<DataTable.Action
								text='View'
								glyph='fa-eye'
								onClick={this.view}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				{
					this.props.session.user_type === 'institute' &&
			
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='userdetail__fullname'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullname', '')} />
				}	
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='StudentLeaveManager__leavestatus'
					onChange={this.updateFilter}
					value={filterValue(filters, 'StudentLeaveManager__leavestatus', null)}
					options={StudentLeaveManager.getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	static getLeaveDurationOptions(__) {
		return [
			{
				value: 0,
				label: __('Full Day')
			},
			{
				value: 1,
				label: __('Half Day')
			}
		];
	}

	static getHalfDayOptions(__) {
		return [
			{
				value: 1,
				label: __('First Half')
			},
			{
				value: 2,
				label: __('Second Half')
			}
		];
	}

	static getStatusOptions(__) {
		return [
			{
				value: 0,
				label: __('Pending')
			},
			{
				value: 1,
				label: __('Approved')
			},
			{
				value: 2,
				label: __('Cancelled')
			},
			{
				value: 3,
				label: __('Rejected')
			},
		];	
	}

	static statusLabel(status) {
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