import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	dialog,
	messenger,
	filterValue,
	moduleActions,
	getInputValue,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {getExamTypeOptions, getExamType} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/examschedule';
import * as actions from '../redux/actions/examschedule';
addView('examschedule', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Panel,
	Modal,
	Table,
	Button,
	Select,
	Loading,
	Clearfix,
	Checkbox,
	DateView,
	HelpBlock,
	DataTable,
	FormGroup,
	Timepicker,
	Datepicker,
	Pagination,
	FormControl,
	ClickButton,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class ExamSchedule extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'examschedule');
	view = event => this.props.dispatch(
		actions.viewSchedule(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
	hideSchedule = () => this.props.dispatch({type: 'HIDE_EXAMSCHEDULE'});
	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);
	save = () => this.props.dispatch(actions.save(this.props));
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
		)
	);
	sendNotification = event => this.props.dispatch(
		actions.sendNotification(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Exam Schedule?'),
		});
	};
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
		this.props.router.push(this.props.router.location);
	};
	viewList = () => this.props.router.push(this.props.router.location);
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	changeExamHead = event => this.props.dispatch(
		actions.changeExamHead(this.props, event.currentTarget.value)
	);
	changeClass = event => this.props.dispatch(
		actions.changeClass(this.props, event.currentTarget.value)
	);
	updateData = event => this.props.dispatch(
		actions.updateData(
			event.currentTarget.name,
			event.currentTarget.value
		)
	);

	editDetail = data => {
		this.props.dispatch({
			type: 'EDIT_EXAM_DETAIL',
			data: {
				...data,
				date: moment(data.date).format(this.props.session.userdetails.date_format),
			},
		});
	};
	cancelDetailEdit = () => this.props.dispatch({
		type: 'CANCEL_EXAM_DETAIL_EDIT'
	});
	removeDetail = event => {
		let id = +event.currentTarget.getAttribute('data-item-id');
		if (this.props.examscheduledetail.id === id) 
			return messenger.post({
				type: 'error',
				message: window.__('Can not delete item being edited'),
			});
		dialog.confirm({
			callback: value => value &&
				this.props.dispatch(actions.removeDetail(this.props, id)),
			message: window.__('Are you absolutely sure you want to delete this schedule?'),
		});
	};

	updateDetail = event => this.props.dispatch({
		type: 'UPDATE_EXAM_DETAIL_DATA',
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget),
	});
	saveDetail = () => this.props.dispatch(actions.saveDetail(this.props));

	changeActivity = event => this.props.dispatch(
		actions.changeActivity(this.props, event.currentTarget.value)
	);
	updateActivityData = event => this.props.dispatch({
		type: 'UPDATE_EXAM_ACTIVITY_DATA',
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget),
	});
	updateSubActivityMark = event => this.props.dispatch({
		type: 'UPDATE_SUBACTIVITY_MARK',
		value: event.currentTarget.value,
		index: event.currentTarget.getAttribute('data-item-index'),
	});
	saveActivitySchedule = () => {
		let data = this.props.item.subActivities.map((item, index) => ({
			date: this.props.activityschedule.date,
			examscheduleId: this.props.item.id,
			activityId: this.props.item.subActivities[index].id,
			max_marks: this.props.activityschedule.subActivityMarks[index]
		}));
		data.push({
			date: this.props.activityschedule.date,
			examscheduleId: this.props.item.id,
			activityId: this.props.activityschedule.activityId,
			max_marks: this.props.activityschedule.max_marks
		});
		let errors = validateActivitySchedule(data, window.__);
		if (Object.keys(errors).length === 0) {
			this.props.dispatch(
				actions.saveActivitySchedule(this.props, data)
			);
		} else {
			this.props.dispatch({
				type: 'SET_EXAM_ACTIVITY_SAVE_ERRORS',
				errors,
			});
		}
	};
	removeActivitySchedule = event => {
		let itemId = event.target.getAttribute('data-item-id'),
			activityId = event.target.getAttribute('data-activity-id');
		dialog.confirm({
			callback: value => value && this.props.dispatch(
				actions.removeActivitySchedule(this.props, itemId, activityId)),
			message: window.__('Are you absolutely sure you want to delete this activity?'),
		});
	};

	editCategory = event => this.props.dispatch(
		actions.editCategory(
			this.props,
			event.target.getAttribute('data-item-id'),
		)
	);
	hideCategory = () => this.props.dispatch({
		type: 'HIDE_CATEGORIES',
	});
	addCategory = () => {
		if (!this.props.item.subjectCategoryId)
			return messenger.post({
				message: window.__('Please select a subject category.'),
				type: 'error'
			});
		if (this.props.category.marks[this.props.item.subjectCategoryId] !== undefined)
			return messenger.post({
				message: window.__('This is already exist !!'),
				type: 'error'
			});
		let subjectcategory, subjectcategories = this.props.category.subjectcategories;
		for (let i = subjectcategories.length - 1; i >= 0; i--) {
			if (subjectcategories[i].value === this.props.item.subjectCategoryId) {
				subjectcategory = {
					id: subjectcategories[i].value,
					subjectcategorydetails: [{
						name: subjectcategories[i].label
					}]
				};
				break;
			}
		}
		this.props.dispatch({
			type: 'ADD_EXAM_CATEGORY',
			data: {
				max_marks: '',
				subjectcategory,
				examScheduleId: this.props.category.examScheduleId,
				subjectCategoryId: this.props.item.subjectCategoryId,
				examScheduleDetailId: this.props.category.examscheduledetail.id,
			},
		});
	};
	updateCategoryMark = (subjectCategoryId, value) => this.props.dispatch({
		type: 'UPDATE_EXAM_CATEGORY_MARK',
		subjectCategoryId,
		value,
	});
	saveCategory = () => {
		let data = {
				subjectId: this.props.category.examscheduledetail.subject.id,
				examScheduleId: this.props.category.examscheduledetail.examScheduleId,
				examScheduleDetailId: this.props.category.examscheduledetail.id,
				subjectcategory: this.props.category.examschedulesubjectcategory.map(
					item => ({
						...item,
						max_marks: this.props.category.marks[item.subjectCategoryId]
					})
				)
			},
			errors = validateCategory(
				data,
				this.props.category.examscheduledetail.max_mark,
				window.__
			);
		if (Object.keys(errors).length === 0) {
			this.props.dispatch(actions.saveCategory(this.props, data));
		} else {
			this.props.dispatch({
				type: 'SET_CATEGORY_ERRORS',
				errors
			});
		}
	};
	removeCategory = (subjectCategoryId, id) => this.props.dispatch({
		type: 'SEND_SUBCAT_DELETE_REQUEST',
		subjectCategoryId,
		id,
	});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState === 'LIST') {
			let firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
			if (firstTime) return <View>{this.renderFirstMessage()}</View>;
			return (
				<React.Fragment>
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData(__)}
					</View>
					<Modal
						bsSize='large'
						onHide={this.hideSchedule}
						show={this.props.examscheduledetails !== false}>
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Exam Schedule</Text>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{this.props.examscheduledetails === null && <Loading/>}
							{
								this.props.examscheduledetails &&
								<Table condensed striped>
									<thead>
										<tr>
											<th><Text>S.No.</Text></th>
											<th><Text>Subject</Text></th>
											<th><Text>Exam Type</Text></th>
											<th><Text>Date</Text></th>
											<th><Text>Start Time</Text></th>
											<th><Text>End Time</Text></th>
											<th><Text>Duration</Text></th>
											<th><Text>Max. Marks</Text></th>
											<th><Text>Min. Marks</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.examscheduledetails.map(
												ExamSchedule.renderExamScheduleDetail,
												this
											)
										}
										{
											this.props.examscheduledetails.length === 0 &&
											<tr>
												<td colSpan={9} className='text-center'>
													<Text>No Result Found</Text>
												</td>
											</tr>
										}
									</tbody>
								</Table>
							}
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={this.hideSchedule}>
								<Text>Close</Text>
							</Button>
						</Modal.Footer>
					</Modal>
				</React.Fragment>
			);
		}
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.reset} title={__('View List')}>
						<Text>View List</Text>
					</View.Action>
				</View.Actions>
			}>{this.renderForm(__)}</View>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Exam Schedules</Text></h3>
						<div>
							<Text>Schedule Examination, subject and class wise to conduct exam in the School.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Exam Schedule'
						onClick={this.startAdd}/>
				}
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='examheaddetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'examheaddetail__name', '')} />
				<Select
					onChange={this.updateFilter}
					title={__('Curriculum Type')}
					name='examschedule__boardId__eq'
					options={this.props.meta.boards}
					placeholder={__('Select Curriculum Type')}
					value={filterValue(filters, 'examschedule__boardId__eq', null)}/>
				<Select
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					name='examschedule__classId__eq'
					options={this.props.meta.allClasses}
					value={filterValue(filters, 'examschedule__classId__eq', '')} />
				<Select
					title={__('Status')}
					onChange={this.updateFilter}
					name='examschedule__is_active'
					placeholder={__('Select Status')}
					value={filterValue(filters, 'examschedule__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAdd}>
						<Text>Add New</Text>
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

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'>
								<Text>Status</Text>
							</td>
							<td className='tw-25'>
								<Text>Exam Name</Text>
							</td>
							<td className='tw-25'>
								<Text>Curriculum Type</Text>
							</td>
							<td className='tw-25'>
								<Text>Class</Text>
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						data-item-id={item.id}
						value={item.is_active}
						onChange={this.changeStatus}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						title={getStatusTitle(item.is_active, __)}/>
				</td>
				<td className='tw-25'>
					{item.examhead.examheaddetails[0].name}
				</td>
				<td className='tw-25'>
					{item.board.boarddetails[0].alias}
				</td>
				<td className='tw-25'>
					{item.class.classesdetails[0].name}
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.id}/>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.notification &&
							<DataTable.Action
								glyph='fa-bullhorn'
								data-item-id={item.id}
								text='Send Notification'
								onClick={this.sendNotification}/>
						}
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderForm(__) {
		return (
			<React.Fragment>
				<Panel>
					<Panel.Heading>
						<Panel.Title>
							<Text>Exam Schedule Information</Text>
						</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<Row>
							<Col md={4}>
								<FormGroup
									controlId='examhead'
									validationState={this.props.errors.examheadId ? 'error': null}>
									<ControlLabel>
										<Text>Exam Group</Text>
									</ControlLabel>
									<Select
										name='examheadId'
										onChange={this.changeExamHead}
										disabled={this.props.item.dirty}
										value={this.props.item.examheadId}
										options={this.props.meta.examheads}/>
									<HelpBlock>{this.props.errors.examheadId}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup
									controlId='cIds'
									validationState={this.props.errors.cIds ? 'error': null}>
									<ControlLabel>
										<Text>Class</Text>
									</ControlLabel>
									<Select
										name='cIds'
										onChange={this.changeClass}
										options={this.props.meta.classes}
										value={
											this.props.item.boardId ?
												this.props.item.boardId + '-' + this.props.item.classId :
												null
										}
										disabled={this.props.item.dirty}/>
									<HelpBlock>{this.props.errors.cIds}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={1}>
								<FormGroup>
									<HelpBlock className='invisible'>H</HelpBlock>
									<Checkbox
										name='is_active'
										onChange={this.updateData}
										checked={this.props.item.is_active}
										value={this.props.item.is_active}>
										&nbsp;
										<Text>Active</Text>
									</Checkbox>
								</FormGroup>
							</Col>
							<Col md={3}>
								<FormGroup>
									<HelpBlock className='invisible'>H</HelpBlock>
									<Checkbox
										name='has_activity'
										onChange={this.updateData}
										checked={this.props.item.has_activity}
										value={this.props.item.has_activity}>
										{' '}
										<Text>Do you want to include Activity?</Text>
									</Checkbox>
								</FormGroup>
							</Col>
						</Row>
						<Button
							bsStyle='primary'
							onClick={this.save}
							disabled={this.props.saving}>
							<Text>
								{
									this.props.saving ? 'Saving' : (
										this.props.item.id ? 'Update' : 'Save & Manage Schedule'
									)
								}
							</Text>
						</Button>
					</Panel.Body>
				</Panel>
				{
					!!this.props.item.id &&
					<Panel>
						<Panel.Heading>
							<Panel.Title>
								<Text>Manage Schedule</Text>
							</Panel.Title>
						</Panel.Heading>
						<Panel.Body>
							<Row>
								<Col md={4}>
									<FormGroup
										controlId='subjectId'
										validationState={this.props.errors.subjectId ? 'error': null}>
										<ControlLabel><Text>Subject</Text></ControlLabel>
										<Select
											name='subjectId'
											onChange={this.updateDetail}
											options={this.props.item.subjects}
											loading={this.props.item.loadingSubjects}
											value={this.props.examscheduledetail.subjectId}/>
										<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='exam_type'
										validationState={this.props.errors.exam_type ? 'error': null}>
										<ControlLabel><Text>Exam Type</Text></ControlLabel>
										<Select
											name='exam_type'
											onChange={this.updateDetail}
											options={getExamTypeOptions(__)}
											value={this.props.examscheduledetail.exam_type}/>
										<HelpBlock>{this.props.errors.exam_type}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='date'
										validationState={this.props.errors.date ? 'error': null}>
										<ControlLabel><Text>Date</Text></ControlLabel>
										<Datepicker
											name='date'
											onChange={this.updateDetail}
											value={this.props.examscheduledetail.date}
											datepicker={{
												minDate: this.props.session.selectedSession.start_date,
												maxDate: this.props.session.selectedSession.end_date
											}}/>
										<HelpBlock>{this.props.errors.date}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={3}>
									<FormGroup
										controlId='start_time'
										validationState={this.props.errors.start_time ? 'error': null}>
										<ControlLabel><Text>Start Time</Text></ControlLabel>
										<Timepicker
											name='start_time'
											onChange={this.updateDetail}
											value={this.props.examscheduledetail.start_time}/>
										<HelpBlock>{this.props.errors.start_time}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={3}>
									<FormGroup
										controlId='end_time'
										validationState={this.props.errors.end_time ? 'error': null}>
										<ControlLabel><Text>End Time</Text></ControlLabel>
										<Timepicker
											name='end_time'
											onChange={this.updateDetail}
											value={this.props.examscheduledetail.end_time}/>
										<HelpBlock>{this.props.errors.end_time}</HelpBlock>
									</FormGroup>
								</Col>
								<Col xs={2}>
									<FormGroup
										controlId='max_mark'
										validationState={this.props.errors.max_mark ? 'error': null}>
										<ControlLabel><Text>Max Marks</Text></ControlLabel>
										<FormControl
											type='text'
											onChange={this.updateDetail}
											name='max_mark'
											placeholder={__('Max Marks')}
											value={this.props.examscheduledetail.max_mark}/>
										<HelpBlock>{this.props.errors.max_mark}</HelpBlock>
									</FormGroup>
								</Col>
								<Col xs={2}>
									<FormGroup
										controlId='min_passing_mark'
										validationState={this.props.errors.max_mark || this.props.errors.min_passing_mark ? 'error': null}>
										<ControlLabel><Text>Min. Passing Marks</Text></ControlLabel>
										<FormControl
											type='text'
											onChange={this.updateDetail}
											name='min_passing_mark'
											placeholder={__('Min. Passing Marks')}
											value={this.props.examscheduledetail.min_passing_mark}/>
										<HelpBlock>{this.props.errors.min_passing_mark}</HelpBlock>
									</FormGroup>
								</Col>
								<Col xs={2}>
									<FormGroup>
										<ControlLabel className='invisible'>H</ControlLabel>
										<div>
											{
												!!this.props.examscheduledetail.id &&
												<Button
													key='cancel-btn'
													bsStyle='default'
													onClick={this.cancelDetailEdit}>
													<Text>Cancel</Text>
												</Button>
											}
											&nbsp;&nbsp;
											<Button
												key='save-btn'
												bsStyle='primary'
												onClick={this.saveDetail}>
												<Text>
													{this.props.examscheduledetail.id ? 'Update' : 'Add More'}
												</Text>
											</Button>
										</div>
									</FormGroup>
								</Col>
							</Row>
							{
								this.props.item.examscheduledetails.length !== 0 &&
								<Table condensed>
									<thead>
										<tr>
											<th><Text>S.No.</Text></th>
											<th><Text>Subject</Text></th>
											<th><Text>Exam Type</Text></th>
											<th><Text>Date</Text></th>
											<th><Text>Start Time</Text></th>
											<th><Text>End Time</Text></th>
											<th><Text>Duration</Text></th>
											<th><Text>Max. Marks</Text></th>
											<th><Text>Min. Passing Marks</Text></th>
											<th><Text>Actions</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.item.examscheduledetails.map(
												this.renderEditableExamScheduleDetail,
												this
											)
										}
									</tbody>
								</Table>
							}
						</Panel.Body>
					</Panel>
				}
				{
					!!this.props.item.id && !!this.props.item.has_activity &&
					<Panel>
						<Panel.Heading>
							<Panel.Title>
								<Text>Manage Activity</Text>
							</Panel.Title>
						</Panel.Heading>
						<Panel.Body>
							<Row>
								<Col md={4}>
									<FormGroup
										controlId='activityId'
										validationState={(this.props.errors.activityId || this.props.activityschedule.exists) ? 'error': null}>
										<ControlLabel><Text>Activity</Text></ControlLabel>
										<Select
											name='activityId'
											onChange={this.changeActivity}
											options={this.props.meta.activities}
											value={this.props.activityschedule.activityId}/>
										<HelpBlock>
											{
												this.props.errors.activityId || 
												(this.props.activityschedule.exists && <Text>This is already exist!!</Text>)
											}
										</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='date'
										validationState={
											this.props.errors.activityscheduledate ? 'error' : null
										}>
										<ControlLabel><Text>Date</Text></ControlLabel>
										<Datepicker
											name='date'
											datepicker={{
												minDate: this.props.session.selectedSession.start_date,
												maxDate: this.props.session.selectedSession.end_date,
											}}
											onChange={this.updateActivityData}
											value={this.props.activityschedule.date}/>
										<HelpBlock>{this.props.errors.activityscheduledate}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='max_marks'
										validationState={this.props.errors.max_marks ? 'error': null}>
										<ControlLabel><Text>Max Marks</Text></ControlLabel>
										<FormControl
											type='text'
											name='max_marks'
											placeholder={__('Max Marks')}
											onChange={this.updateActivityData}
											value={this.props.activityschedule.max_marks}/>
										<HelpBlock>{this.props.errors.max_marks}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								{
									this.props.item.subActivities.length !== 0 &&
									<Col xs={12} className='activityTop'>
										<Panel>
											<Panel.Heading>
												<Panel.Title>{__('Sub Activities')}</Panel.Title>
											</Panel.Heading>
											<Panel.Body className='form-horizontal'>
												{
													this.renderSubActivities(
														this.props.item.subActivities,
														__
													)
												}
											</Panel.Body>
										</Panel>
									</Col>
								}
							</Row>
							<FormGroup validationState={this.props.errors.totalError ? 'error': null}>
								<HelpBlock>
									{this.props.errors.totalError}
								</HelpBlock>
							</FormGroup>
							<FormGroup>
								<Button
									bsStyle='primary'
									onClick={this.saveActivitySchedule}
									disabled={this.props.item.savingActivtySchedule}>
									<Text>Add More</Text>
								</Button>
							</FormGroup>
							{
								this.props.item.activityschedules.length !== 0 &&
								<Table condensed>
									<thead>
										<tr>
											<th><Text>S.No.</Text></th>
											<th><Text>Activity</Text></th>
											<th><Text>Date</Text></th>
											<th><Text>Max. Marks</Text></th>
											<th><Text>Actions</Text></th>
										</tr>
									</thead>
									<tbody>
										{this.renderActivitySchedule(__)}
									</tbody>
								</Table>
							}
						</Panel.Body>
					</Panel>
				}
				<Button
					bsStyle='primary'
					onClick={this.viewList}
					disabled={this.props.saving}>
					<Text>Back</Text>
				</Button>
				<Modal
					onHide={this.hideCategory}
					show={this.props.category !== false}>
					<Modal.Header closeButton>
						<Modal.Title><Text>Subject Category</Text></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.category === null && <Loading/>}
						{
							this.props.category &&
							<React.Fragment>
								<Row>
									<Col xs={6}>
										<Text>Subject</Text>
										{': '}
										{this.props.category.examscheduledetail.subject.subjectdetails[0].name}
									</Col>
									<Col xs={6} className='text-right'>
										<Text>Max Mark</Text>
										{': '}
										{this.props.category.examscheduledetail.max_mark}
									</Col>
								</Row>
								<br/>
								<Row>
									<Col xs={12} md={8}>
										<Select
											name='subjectCategoryId'
											onChange={this.updateData}
											value={this.props.item.subjectCategoryId}
											options={this.props.category.subjectcategories}/>
									</Col>
									<Col xs={12} md={4}>
										<Button
											bsStyle='primary'
											onClick={this.addCategory}>
											<Text>Add</Text>
										</Button>
									</Col>
								</Row>
								<br/>
								<Table condensed>
									<tbody>
										{this.renderCategories(__)}
									</tbody>
								</Table>
								<Row>
									<Col xs={12}>
										<FormGroup
											validationState={this.props.errors.categoryTotalError ? 'error': null}>
											<HelpBlock>{this.props.errors.categoryTotalError}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
							</React.Fragment>
						}
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle='primary' onClick={this.saveCategory}>
							<Text>Save</Text>
						</Button>
						<Button bsStyle='primary' onClick={this.hideCategory}>
							<Text>Close</Text>
						</Button>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		);
	}

	renderEditableExamScheduleDetail(item, index) {
		let __ = window.__;
		return (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.subject.subjectdetails[0].name}</td>
				<td><Text>{getExamType(item.exam_type)}</Text></td>
				<td><DateView>{item.date}</DateView></td>
				<td>{moment(item.start_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{moment(item.end_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{item.duration}</td>
				<td>{item.max_mark}</td>
				<td>{item.min_passing_mark}</td>
				<td className='text-primary'>
					<Icon
						glyph='fa-edit'
						title={__('Edit')}
						onClick={() => this.editDetail(item)}/>
					&nbsp;
					&nbsp;
					<Icon
						glyph='fa-list-ul'
						data-item-id={item.id}
						onClick={this.editCategory}
						title={__('Edit subject categories')}/>
					&nbsp;
					&nbsp;
					<Icon
						title={__('Remove')}
						data-item-id={item.id}
						onClick={this.removeDetail}
						glyph={item.removing ? 'fa-spinner' : 'fa-trash'}/>
				</td>
			</tr>
		);
	}

	renderCategories(__) {
		return this.props.category.examschedulesubjectcategory.map(item => (
			<tr key={item.subjectCategoryId}>
				<td className='tw-70'>
					{item.subjectcategory.subjectcategorydetails[0].name}
				</td>
				<td>
					<FormGroup
						validationState={this.props.errors['categoryMarks' + item.subjectCategoryId] ? 'error': null}>
						<FormControl
							onChange={event => this.updateCategoryMark(
								item.subjectCategoryId,
								event.target.value
							)}
							value={this.props.category.marks[item.subjectCategoryId]}/>
					</FormGroup>
				</td>
				<td>
					<Icon
						title={__('Delete')}
						data-item-id={item.id}
						glyph={item.removing ? 'fa-spinner' : 'fa-trash'}
						onClick={() => this.removeCategory(
							item.subjectCategoryId,
							item.id
						)}/>
				</td>
			</tr>
		));
	}

	renderActivitySchedule(__) {
		let items = this.props.item.activityschedules, index = 0;
		return items.map(item => (
			item.activity.superActivityId === null && (++index) &&
			<tr key={item.id}>
				<td>{index}</td>
				<td>{item.activity.activitydetails[0].name}</td>
				<td><DateView>{item.date}</DateView></td>
				<td>{item.max_marks}</td>
				<td className='text-primary'>
					<Icon
						glyph='fa-trash'
						title={__('Remove')}
						data-item-id={item.id}
						data-activity-id={item.activity.id}
						onClick={this.removeActivitySchedule}/>
				</td>
			</tr>
		));
	}

	renderSubActivities(items, __) {
		return items.map((item, index) => (
			<Col md={6} key={item.id}>
				<Row>
					<Col xs={12} md={3}>
						<ControlLabel>{item.activitydetails[0].name}</ControlLabel>
					</Col>
					<Col xs={12} md={9}>
						<FormGroup
							validationState={
								this.props.errors['activityMarks' + index] ? 'error': null
							}>
							<FormControl
								type='text'
								data-item-index={index}
								placeholder={__('Max Marks')}
								onChange={this.updateSubActivityMark}
								value={this.props.activityschedule.subActivityMarks[index]}/>
							<HelpBlock>{this.props.errors['activityMarks' + index]}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
			</Col>
		));
	}

	static renderExamScheduleDetail(item, index) {
		return (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.subject.subjectdetails[0].name}</td>
				<td><Text>{getExamType(item.exam_type)}</Text></td>
				<td><DateView>{item.date}</DateView></td>
				<td>{moment(item.start_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{moment(item.end_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{item.duration}</td>
				<td>{item.max_mark}</td>
				<td>{item.min_passing_mark}</td>
			</tr>
		);
	}
}

function validateActivitySchedule(activityschedules, __) {
	let n = activityschedules.length - 1,
		errors = {},
		required = __('This is required field.'),
		maxLength = __('Marks can not have more than 5 digits.'),
		invalidMark = __('Please Enter Numeric Value.');

	if (!activityschedules[n].date)
		errors.activityscheduledate = required;
	if (!activityschedules[n].activityId)
		errors.activityId = required;

	let total = 0, mark;
	for (let i = 0; i < n; i++) {
		mark = activityschedules[i].max_marks;
		if (!mark)
			errors['activityMarks' + i] = required;
		else if (typeof mark === 'string' && mark.length > 5)
			errors['activityMarks' + i] = maxLength;
		else if (isNaN(mark = Number(mark)))
			errors['activityMarks' + i] = invalidMark;
		else if (mark == 0)
			errors['activityMarks' + i] = invalidMark;
		else
			total += mark;
	}

	mark = activityschedules[n].max_marks;
	if (!mark)
		errors['max_marks'] = required;
	else if (typeof mark === 'string' && mark.length > 5)
		errors['max_marks'] = maxLength;
	else if (isNaN(mark = Number(mark)))
		errors['max_marks'] = invalidMark;
	else if (mark == 0)
		errors['max_marks'] = invalidMark;

	if (n !== 0 && total !== mark)
		errors.totalError = __('Total of subactivity marks must be equal to activity mark.');
	return errors;
}

function validateCategory(data, max_marks, __) {
	let categories = data.subjectcategory,
		total = 0,
		errors = {},
		required = __('This is required field.'),
		invalidMark = __('Please Enter Numeric Value.'),
		maxLength = __('Marks can not have more than 5 digits.');

	for (let i = 0; i < categories.length; i++) {
		let mark = categories[i].max_marks;
		if (!mark)
			errors['categoryMarks' + categories[i].subjectCategoryId] = required;
		else if (typeof mark === 'string' && mark.length > 5)
			errors['categoryMarks' + categories[i].subjectCategoryId] = maxLength;
		else if (isNaN(mark = Number(mark)))
			errors['categoryMarks' + categories[i].subjectCategoryId] = invalidMark;
		else
			total += mark;
	}
	if (total !== max_marks) {
		errors.categoryTotalError = __('Total of category marks must be equal to max mark.');
	}
	return errors;
}