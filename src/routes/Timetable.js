import React from 'react';
import ReactDOM from 'react-dom';
import url from 'url';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';
import {
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue
} from '../utils';

import {
	Row,
	Col,
	Table,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
	Checkbox,
	BCheckbox,
	HelpBlock,
	Modal,
	Radio,
	Pagination,
	Loading,
	Select,
	Timepicker
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/timetable';
import * as actions from '../redux/actions/timetable';
addView('timetable', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))

export default class Timetable extends React.Component {

	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	constructor(props) {
		super(props);
		this.hours = [];
		for (let i = 0; i < 12; i++) {
			this.hours.push(
				<option key={i} value={(i < 9 ? ('0' + (i+1)) : (i + 1))}>{'' + (i < 9 ? ('0' + (i+1)) : (i + 1))}</option>
			);
		}

		this.minutes = [];
		for (let i = 0; i < 60; i+=5) {
			this.minutes.push(
				<option key={i} value={(i < 10 ? ('0' + i) : i)}>{'' + (i < 10 ? ('0' + i) : i)}</option>
			);
		}
	}

	permissions = moduleActions(this.props.session.modules, 'timetable');

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

	handleDataUpdate = event => {
		this.props.dispatch(
			actions.updateData(
				event.currentTarget.name, 
				getInputValue(event.currentTarget)
			)
		);
	};

	handleEditUpdate = event => this.updateEditData(
		event.currentTarget.name,
		getInputValue(event.currentTarget)
	);

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	timeShiftModal = () => {
		this.props.dispatch(
			actions.timeShiftModal()
		);
	};

	startAddNew = () => {
		this.props.dispatch(actions.startAdd(this.props));
	};

	handleEdit = event => {
		this.props.dispatch(
			actions.edit(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

	showPDF = event => {
		let itemId = event.currentTarget.getAttribute('data-item-id');
		window.open('/timetable/'+itemId+'/timetable.pdf', '_blank');
	};

	handleSendNotification = event => {
		this.props.dispatch(
			actions.sendNotification(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

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

	handleDelete = event => {
		var timetableId = event.currentTarget.getAttribute('data-item-id');
		vex.dialog.confirm({
			message: window.__('Are you absolutely sure you want to delete the Time table?'),
			callback: (value) => {
				if(value) {
					this.deleteItem(timetableId);
				}
			}
		});
	};

	handleTimetableEdit = event => {
		this.props.dispatch(
			actions.showEditModal(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.getAttribute('data-start-time'),
				event.currentTarget.getAttribute('data-end-time'),
				event.currentTarget.getAttribute('data-subject'),
				event.currentTarget.getAttribute('data-teacher'),
				event.currentTarget.getAttribute('data-weekday'),
				event.currentTarget.getAttribute('data-timetableid'),
				event.currentTarget.getAttribute('data-is_break'),
				event.currentTarget.getAttribute('data-tag-id'),
				event.currentTarget.getAttribute('data-icon')
			)
		);
	};

	handleCopyTimetable = event => {
		let itemId = event.currentTarget.getAttribute('data-item-id'),
			start_time	= event.currentTarget.getAttribute('data-start-time'),
			end_time = event.currentTarget.getAttribute('data-end-time'),
			subjectId =	event.currentTarget.getAttribute('data-subject'),
			teacherId = event.currentTarget.getAttribute('data-teacher');
		vex.dialog.confirm({
			message: 'It will copy schedule to those slots in the week which have same time slot. Please ensure before proceeding.',
			callback: (value) => {
				if(value) {
					this.copyTimetable(itemId, start_time, end_time, subjectId, teacherId);
				}
			}
		});
	};	

	launchTeacherModal = event => this.showTeacherModal(
		event.currentTarget.getAttribute('data-teacher-id'),
		event.currentTarget.getAttribute('data-timetableid')
	);

	handleChangeClassTeacher = () => this.changeClassTeacher();

	handleAssignSave = () => this.assignSave();

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState === 'EDIT_FORM') return this.renderEdit(__);

		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
				<Modal
					bsSize='lg'
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.helperData.addTimeTableModel}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<Modal.Title>
								<Text>Add Time Table</Text>
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Form id='timetable-add'>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='bcsMapId'
											validationState={this.props.errors.bcsMapId ? 'error': null}
										>
											<ControlLabel>{__('Class')}</ControlLabel>
											<Select
												className='form-control'
												name="bcsMapId"
												placeholder={__('Select Class')}
												onChange={this.handleDataUpdate}
												value={this.props.item.bcsMapId}
												options={this.props.helperData.bcsmaps}
											/>
											<HelpBlock>{this.props.errors.bcsMapId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='classteacherId'
											validationState={this.props.errors.classteacherId ? 'error': null}
										>
											<ControlLabel>{__('Class Teacher')}</ControlLabel>
											<Select
												className='form-control'
												name="classteacherId"
												placeholder={__('Select Class Teacher')}
												onChange={this.handleDataUpdate}
												value={this.props.item.classteacherId}
												options={this.props.helperData.classTeachers}
											/>
											<HelpBlock>{this.props.errors.classteacherId}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md={12}>
										<FormGroup
											controlId='weekday'
											validationState={this.props.errors.weekday ? 'error': null}
										>
											<ControlLabel>{__('Weekdays')}</ControlLabel>
											<div>
												<BCheckbox inline value='Sunday' name='weekday[]'>
													Sunday
												</BCheckbox>
												<BCheckbox inline defaultValue='Monday' name='weekday[]'>
													Monday
												</BCheckbox>
												<BCheckbox inline defaultValue='Tuesday' name='weekday[]'>
													Tuesday
												</BCheckbox>
												<BCheckbox inline defaultValue='Wednesday' name='weekday[]'>
													Wednesday
												</BCheckbox>
												<BCheckbox inline defaultValue='Thursday' name='weekday[]'>
													Thursday
												</BCheckbox>
												<BCheckbox inline defaultValue='Friday' name='weekday[]'>
													Friday
												</BCheckbox>
												<BCheckbox inline defaultValue='Saturday' name='weekday[]'>
													Saturday
												</BCheckbox>
											</div>
											<HelpBlock>{this.props.errors.weekday}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='period_no'
											validationState={this.props.errors.period_no ? 'error': null}
										>
											<ControlLabel>{__('No. Of Period')}</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('No. Of Period')}
												value={this.props.item.period_no}
												name='period_no'
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.period_no}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='start_time'
											validationState={this.props.errors.start_time ? 'error': null}
										>
											<ControlLabel>{__('Start Time')}</ControlLabel>
											<Timepicker
												name='start_time'
												onChange={this.handleDataUpdate}
												value={this.props.item.start_time}
											/>
											<HelpBlock>{this.props.errors.start_time}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md={12} className='text-right'>
										<div>
											<Button
												bsStyle='primary'
												onClick={::this.save}
												disabled={this.props.saving}
											>
												{__(this.props.saving ? 'Saving' : 'Submit')}
											</Button>
										</div>
										<br/>
									</Col>
								</Row>
							</Form>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{(this.props.viewState === 'DATA_FORM' || this.props.viewState === 'LIST') &&
					<React.Fragment>
						{
							this.permissions.add &&
							<View.Action onClick={this.startAddNew}>
								<Text>Add New</Text>
							</View.Action>
						}
						{
							this.permissions.shifttime &&
							<View.Action onClick={this.timeShiftModal}>
								<Text>Shift Timing</Text>
							</View.Action>
						}
						<View.Action onClick={this.toggleFilters} title={__('Filters')}>
							<Icon glyph='fa-filter'/>
						</View.Action>
						<View.Action onClick={this.reset} title={__('Reset')}>
							<Icon glyph='fa-redo-alt'/>
						</View.Action>
					</React.Fragment>
				}

			</View.Actions>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-25'><Text>Class</Text></td>
							<td className='tw-25'><Text>Class Teacher</Text></td>
							<td className='tw-12'><Text>Periods</Text></td>
							<td className='tw-20'><Text>Start Time</Text></td>
							<td className='tw-10'>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows(__)}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
				<Modal 
					backdrop='static'
					show={this.props.helperData.showTeacherModal} 
					onHide={this.hideDataModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Change Class Teacher')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div id="tag-container">
							{this.props.item &&
								<div className='text-center'>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 64}}
										glyph={'icon-fontello-spin4'}
									/>
								</div>
							}
							{this.props.item &&
								<FormGroup
									controlId='classteacherId'
									validationState={this.props.errors.classteacherId ? 'error': null}
								>
									<Select
										className='form-control'
										onChange={this.handleDataUpdate}
										name='classteacherId'
										placeholder={__('Class Teacher')}
										value={this.props.item.classteacherId || ''}
										options={this.props.helperData.classTeachers}
									/>
									<HelpBlock>{this.props.errors.classteacherId}</HelpBlock>
								</FormGroup>
							}
						</div>
					</Modal.Body>
					<Modal.Footer className='text-center'>
						<div className='text-center'>
							<Button
								onClick={this.handleChangeClassTeacher}
								bsStyle='primary'
								disabled={this.props.saving}
							>
								{__(this.props.saving ? 'Saving' : 'Submit')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>

				{/* Time Shift Module */}
				<Modal 
					backdrop='static'
					show={this.props.helperData.timeShiftModal} 
					onHide={this.hideDataModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Shift Your Existing Timetable')}</Modal.Title>
						<p>{__('This action will be update the time in all timetables for this academic session.')}</p>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Form ref={el => this.timeshift = el}>
								<Col md={6} className='text-right'>
									<div className='shifttimealign'>
										<Radio
											defaultChecked
											inline
											defaultValue='addtime'
											name='shift_type'
										>
											{__('Add')}
										</Radio>
										<Radio
											inline
											defaultValue='subtime'
											name='shift_type'
										>
											{__('Reduce')}
										</Radio>
									</div>
								</Col>
								<Col md={6}>
									<FormControl
										name='hour'
										style={{width:'70px', display:'inline'}}
										componentClass='select'
									>
										{this.hours}
									</FormControl>
									<FormControl
										name='minute'
										style={{width:'70px', marginLeft:'5px', display:'inline'}}
										componentClass='select'
									>
										{this.minutes}
									</FormControl>
								</Col>
							</Form>
						</Row>
					</Modal.Body>
					<Modal.Footer className='text-center'>
						<div className='text-center'>
							<Button
								onClick={::this.submitTimeShift}
								bsStyle='primary'
								disabled={this.props.saving}
							>
								{__(this.props.saving ? 'Saving' : 'Submit')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		);
	}

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={3}/>;
		}

		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						readOnly={!this.permissions.status}
						title={getStatusTitle(item.is_active, __)}
						onChange={this.changeStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						value={item.is_active}/>
				</td>
				<td className='tw-25'>{item.bcsmap.board.boarddetails[0].alias+' - '+item.bcsmap.class.classesdetails[0].name +' - '+ item.bcsmap.section.sectiondetails[0].name}</td>
				<td className='tw-25'>
					{
						this.permissions.add &&
						<Icon
							className={'icon-primary'}
							glyph='fa-edit'
							title={__('Change')}
							data-timetableid={item.id}
							data-teacher-id={item.teacher.id}
							onClick={this.launchTeacherModal}>
							&nbsp;
						</Icon>	

					}
					{item.teacher.user.userdetails[0].fullname}
				</td>
				<td className='tw-12'>{item.period_no}</td>
				<td className='tw-20'>{moment(item.start_time, ['HH:mm:ss']).format('h:mm A')}</td>
				<td className='tw-10'>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.handleEdit}
								data-item-id={item.id}/>
						}
						<DataTable.Action
							text='PDF'
							glyph='fa-file'
							onClick={this.showPDF}
							data-item-id={item.id}/>
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Delete'
								glyph='fa-trash'
								onClick={this.handleDelete}
								data-item-id={item.id}/>
						}
						{
							this.permissions.notification &&
							<DataTable.Action
								text='Send Notification'
								glyph='fa-bullhorn'
								onClick={this.handleSendNotification}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderEdit(__){
		return (
			<React.Fragment>
				<View>
					<div className='text-right'>
						<View.Actions>
							<View.Action
								onClick={this.showPDF}
								data-item-id={this.props.item.timetableData.id}>
								<Text>Download</Text>
							</View.Action>
							<View.Action onClick={this.reset}>
								<Text>View List</Text>
							</View.Action>
						</View.Actions>
					</div>
					<div>
						<Col xs={12} className="tt-info">
							<Row>
								<Col md={3}>
									<div className="form-group">
										<div className="div-txt">
											<strong>{__('Class')}:- </strong>
											{
												this.props.item.timetableData.bcsmap.board.boarddetails[0].alias+'/'+
												this.props.item.timetableData.bcsmap.class.classesdetails[0].name+'/'+
												this.props.item.timetableData.bcsmap.section.sectiondetails[0].name
											}
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="form-group">
										<div className="div-txt">
											<strong>{__('Class Teacher')}:- </strong>
											{this.props.item.timetableData.teacher.user.userdetails[0].fullname}
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="form-group">
										<div className="div-txt">
											<strong>{__('Total Period')}:- </strong>
											{this.props.item.timetableData.period_no}
										</div>
									</div>
								</Col>
								<Col md={3}>
									<div className="form-group">
										<div className="div-txt">
											<strong>{__('Start Time')}:- </strong>
											{moment(this.props.item.timetableData.start_time, ['HH:mm:ss']).format('h:mm A')}
										</div>
									</div>
								</Col>
							</Row>
						
						</Col>
						<Row>
							<Col xs={12}>
								<Table bordered responsive  className="timetable pateast-tables-tt pateast-edit-tables-tt">
									<tbody>
										{this.renderTimetableRow(__)}
									</tbody>
								</Table>
							</Col>
						</Row>
					</div>
					<Modal 
						backdrop='static'
						show={this.props.taEdit.showEditModal} 
						onHide={::this.closeEditModal}>
						<Modal.Header 
							closeButton 
							className="text-center">
							<Modal.Title>{__('Assign Subject/Teacher')}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div id="tag-container">
								{this.props.taEdit.loadingIcon &&
									<div className='text-center'>
										<Icon
											className={'fg-darkcyan'}
											style={{fontSize: 64}}
											glyph={'fa-spinner'}
										/>
									</div>
								}
								{!this.props.taEdit.loadingIcon &&
										<div>
											<Row>
												<Col md={6}>
													<FormGroup
														controlId='start_time'
														validationState={this.props.errors.start_time ? 'error': null}
													>
														<ControlLabel>{__('Start Time')}</ControlLabel>
														<Timepicker
															name='start_time'
															onChange={this.handleEditUpdate}
															value={this.props.taEdit.start_time}
														/>
														<HelpBlock>{this.props.errors.start_time}</HelpBlock>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup
														controlId='end_time'
														validationState={this.props.errors.end_time ? 'error': null}
													>
														<ControlLabel>{__('End Time')}</ControlLabel>
														<Timepicker
															name='end_time'
															onChange={this.handleEditUpdate}
															value={this.props.taEdit.end_time}
														/>
														<HelpBlock>{this.props.errors.end_time}</HelpBlock>
													</FormGroup>
												</Col>
											</Row>
											<Row>
												<Col md={12}>
													<FormGroup>
														<Radio
															inline
															name="is_break"
															value={0}
															checked={+this.props.taEdit.is_break === 0 ? true:false}
															onChange={this.handleEditUpdate}>
															<Text>Regular Classes</Text>
														</Radio>{' '}
														<Radio
															inline
															name="is_break"
															value={1}
															checked={+this.props.taEdit.is_break === 1 ? true:false}
															onChange={this.handleEditUpdate}>
															<Text>Break / Other</Text>
														</Radio>
													</FormGroup>
												</Col>
											</Row>
											<Row>
												{
													+this.props.taEdit.is_break ?
													<React.Fragment>
														<Col md={6}>
															<FormGroup
																controlId='tagId'
																validationState={this.props.errors.tagId ? 'error': null}
															>
																<ControlLabel>{__('Type')}</ControlLabel>
																<Select
																	className='form-control'
																	name="tagId"
																	placeholder={__('Type')}
																	onChange={this.handleEditUpdate}
																	value={this.props.taEdit.tagId}
																	options={this.props.helperData.tags}
																/>
																<HelpBlock>{this.props.errors.tagId}</HelpBlock>
															</FormGroup>
														</Col>
														<Col md={12}>
															<FormGroup>
																<Radio
																	inline
																	name="icon"
																	value={'fa-utensils'}
																	checked={this.props.taEdit.icon === 'fa-utensils' ? true:false}
																	onChange={this.handleEditUpdate}>
																	<Icon
																		className='timetable-icon'
																		glyph='fa-utensils'
																		title={__('Lunch')}/>
																</Radio>{' '}
																<Radio
																	inline
																	name="icon"
																	value={'fa-pray'}
																	checked={this.props.taEdit.icon === 'fa-pray' ? true:false}
																	onChange={this.handleEditUpdate}>
																	<Icon
																		className='timetable-icon'
																		glyph='fa-pray'
																		title={__('Pray')}/>
																</Radio>{' '}
																<Radio
																	inline
																	name="icon"
																	value={'fa-basketball-ball'}
																	checked={this.props.taEdit.icon === 'fa-basketball-ball' ? true:false}
																	onChange={this.handleEditUpdate}>
																	<Icon
																		className='timetable-icon'
																		glyph='fa-basketball-ball'
																		title={__('Sports')}/>
																</Radio>{' '}
																<Radio
																	inline
																	name="icon"
																	value={'fa-coffee'}
																	checked={this.props.taEdit.icon === 'fa-coffee' ? true:false}
																	onChange={this.handleEditUpdate}>
																	<Icon
																		className='timetable-icon'
																		glyph='fa-coffee'
																		title={__('Coffee')}/>
																</Radio>{' '}
																<Radio
																	inline
																	name="icon"
																	value={'fa-flask'}
																	checked={this.props.taEdit.icon === 'fa-flask' ? true:false}
																	onChange={this.handleEditUpdate}>
																	<Icon
																		className='timetable-icon'
																		glyph='fa-flask'
																		title={__('Lab Or Practical')}/>
																</Radio>{' '}
															</FormGroup>
														</Col>
													</React.Fragment>
													:
													<React.Fragment>
														<Col md={6}>
															<FormGroup
																controlId='subjectId'
																validationState={this.props.errors.subjectId ? 'error': null}
															>
																<ControlLabel>{__('Subject')}</ControlLabel>
																<Select
																	className='form-control'
																	name="subjectId"
																	placeholder={__('Subject')}
																	onChange={this.handleEditUpdate}
																	value={this.props.taEdit.subjectId}
																	options={this.props.helperData.subjects}
																/>
																<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
															</FormGroup>
														</Col>
														<Col md={6}>
															<FormGroup
																controlId='teacherId'
																validationState={this.props.errors.teacherId ? 'error': null}
															>
																<ControlLabel>{__('Teacher')}</ControlLabel>
																<Select
																	className='form-control'
																	name="teacherId"
																	placeholder={__('Teacher')}
																	onChange={this.handleEditUpdate}
																	value={this.props.taEdit.teacherId}
																	isLoading={this.props.taEdit.loadingTeacher}
																	options={this.props.taEdit.teachers}
																/>
																<HelpBlock>{this.props.errors.teacherId}</HelpBlock>
															</FormGroup>
														</Col>
													</React.Fragment>
												}
											</Row>
										</div>
								}
							</div>
						</Modal.Body>
						<Modal.Footer>
							<div className='text-center'>
								<Button
									data-item-id={this.props.taEdit.id}
									onClick={this.handleAssignSave}
									bsStyle='primary'
									disabled={this.props.saving}
								>
									{__(this.props.saving ? 'Saving' : 'Submit')}
								</Button>
							</div>
						</Modal.Footer>
					</Modal>
				</View>
			</React.Fragment>
		);
	}

	renderTimetableRow(__){
		let numRows = 0;

		for (let i = this.props.item.weekdays.length - 1; i >= 0; i--) {
			numRows = Math.max(this.props.item.timetableallocations[this.props.item.weekdays[i]].length, numRows);
		}

		return (
			this.props.item.timetableData.timetableallocations &&
			<React.Fragment>
				<tr>
					{
						this.props.item.weekdays.map((day, index)=> 
							this.props.item.timetableallocations[day].length > 0 &&
							<td
								key={index}
								data-count={this.props.item.countRow++}
								style={{width:'100px', textAlign:'center'}}>
								{__(day)}
							</td>
						)
					}
				</tr>
				{
					Array.apply(null, {length: numRows}).map((item, index) => {
						let count = 0;
						return (
							<tr key={index}>
								{
									this.props.item.weekdays.map((day)=>
										this.props.item.timetableallocations[day] && 
										this.props.item.timetableallocations[day].length > 0 &&
										this.renderColumn(__, this.props.item.timetableallocations[day], index, count++)
									)
								}
							</tr>
						);
					})
				}
			</React.Fragment>
		);
	}

	renderColumn(__, items, index, index2) {
		let item = items[index];
		return (
			<React.Fragment key={index2}>
				{item.is_break === 1 &&
					<td key={index2} className='breaktt'>
						<div className='period-box'>
							<div className='text-right'>
								<Icon
									bundle='far'
									glyph='fa-edit'
									title={__('Edit')}
									onClick={this.handleTimetableEdit}
									data-item-id={item.id}
									data-start-time={item.start_time}
									data-end-time={item.end_time}
									data-subject={item.subjectId}
									data-teacher={item.teacherId}
									data-weekday={item.weekday}
									data-timetableid={item.timetableId}
									data-is_break={item.is_break}
									data-tag-id={item.tagId}
									data-icon={item.icon}
								/>
								{index2 < 1 &&
									<Icon
										bundle='far'
										glyph='fa-copy'
										title={__('Copy')}
										onClick={this.handleCopyTimetable}
										data-item-id={item.id}
										data-start-time={item.start_time}
										data-end-time={item.end_time}
										data-subject={item.subjectId}
										data-teacher={item.teacherId}
									/>
								}
							</div>
							<div className='period-detail'>
								<div className="timingName">
									<Icon bundle='far' glyph='fa-clock' title={__('Timing')}/>&nbsp;
									<span>
										{item.start_time ? ' '+moment(item.start_time, ["HH:mm:ss"]).format('hh:mm a') : ' --'}
										<span className='txt'>{' '+'-'+' '}</span>
										{item.end_time ? moment(item.end_time, ["HH:mm:ss"]).format('hh:mm a') : '--'}
									</span>
								</div>
								<div className='col-break'>
									<Icon bundle='fas' glyph={item.icon}/>&nbsp;
									{item.tag && item.tag.tagdetails[0].title}
								</div>
							</div>
						</div>
					</td>
				}
				{!item.is_break &&
					<td key={index2} style={{background: item.color, color: '#fff'}}>
						<div className='period-box'>
							<div className='text-right'>
								<Icon
									bundle='far'
									glyph='fa-edit'
									title={__('Edit')}
									onClick={this.handleTimetableEdit}
									data-item-id={item.id}
									data-start-time={item.start_time}
									data-end-time={item.end_time}
									data-subject={item.subjectId}
									data-teacher={item.teacherId}
									data-weekday={item.weekday}
									data-timetableid={item.timetableId}
									data-is_break={item.is_break}
									data-break_name={item.break_name}
								/>
								{index2 < 1 &&
									<Icon
										bundle='far'
										glyph='fa-copy'
										title={__('Copy')}
										onClick={this.handleCopyTimetable}
										data-item-id={item.id}
										data-start-time={item.start_time}
										data-end-time={item.end_time}
										data-subject={item.subjectId}
										data-teacher={item.teacherId}
									/>
								}
							</div>
							<div className='period-detail'>
								<div className="timingName">
									<Icon bundle='far' glyph='fa-clock' title={__('Timing')}/>&nbsp;
									<span>
										{item.start_time ? ' '+moment(item.start_time, ["HH:mm:ss"]).format('hh:mm a') : ' --'}
										<span className='txt'>{' '+'-'+' '}</span>
										{item.end_time ? moment(item.end_time, ["HH:mm:ss"]).format('hh:mm a') : '--'}
									</span>
								</div>
								<div className="subjectName">
									<Icon bundle='far' glyph='fa-file' title={__('Subject')}/>&nbsp;
									<span>
										{item.subject ? item.subject.subjectdetails[0].name : __('N/A')}
									</span>
								</div>
								<div className="teacherName">
									<Icon bundle='far' glyph='fa-user' title={__('Teacher')}/>&nbsp;
									<span>
										{item.teacher ? item.teacher.user.userdetails[0].fullname : __('N/A')}
									</span>
								</div>
							</div>
						</div>
					</td>
				}
			</React.Fragment>
		);
	}
	
	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<Select
					title={__('Name')}
					placeholder={__('Class')}
					name='timetable__bcsMapId__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'timetable__bcsMapId__eq', null)}
					options={this.props.helperData.bcsmaps}/>
				<FormControl
					type='text'
					title={__('Class Teacher')}
					placeholder={__('Class Teacher')}
					name='userdetail__fullname'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullname', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='timetable__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'timetable__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	save() {
		this.props.dispatch(
			actions.save(
				this.props, 
				new FormData(document.getElementById('timetable-add'))
			)
		);
	}

	deleteItem(itemId) {
		this.props.dispatch(
			actions.deleteItem(
				this.props,
				itemId
			)
		);
	}

	showTeacherModal(teacherId, timetableId) {
		this.props.dispatch(
			actions.showTeacherModal(
				this.props,
				teacherId,
				timetableId
			)
		);
	}

	changeClassTeacher(){
		this.props.dispatch(actions.changeClassTeacher(this.props));
	}

	updateEditData(name, value) {
		this.props.dispatch(actions.updateEditData(name, value));

		let subjectId;
		if (name === 'subjectId') subjectId = value;
		if (value !== '' && name === 'subjectId') {
			this.props.dispatch(
				actions.updateAvailableTeacher(
					this.props,
					subjectId
				)
			);
		}
	}

	closeEditModal(){
		this.props.dispatch(actions.closeEditModal());
	}

	assignSave(){
		this.props.dispatch(actions.assignSave(this.props));
	}

	copyTimetable(itemId, start_time, end_time, subjectId, teacherId) {
		this.props.dispatch(
			actions.copyTimetable(
				this.props,
				itemId,
				start_time,
				end_time,
				subjectId,
				teacherId
			)
		);
	}

	submitTimeShift(){
		let data = new FormData(ReactDOM.findDOMNode(this.timeshift));
		this.props.dispatch(
			actions.submitTimeShift(this.props, data)
		);
	}
}
