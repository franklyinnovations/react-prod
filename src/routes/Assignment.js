import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {
	getAssignmentStatus
} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/assignment';
import * as actions from '../redux/actions/assignment';
addView('assignment', reducer);

import {
	Row,
	Col,
	Icon,
	Label,
	View,
	Form,
	Text,
	Modal,
	Alert,
	Button,
	Select,
	Loading,
	Clearfix,
	DateView,
	HelpBlock,
	DataTable,
	FormGroup,
	TextEditor,
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

export default class Assignment extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'assignment');
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
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	changeClass = event => this.props.dispatch(
		actions.changeClass(
			this.props,
			event.currentTarget.value,
		)
	);
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('assignment-form'))
		)
	);
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			event.currentTarget.getAttribute('data-item-status'),
			event.currentTarget.getAttribute('data-item-oldstatus'),
		)
	);
	remove = event => this.props.dispatch(
		actions.remove(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
	view = event => this.props.dispatch(
		actions.viewMappedQuestions(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	handleDelete = event => {
		var itemId = event.currentTarget.getAttribute('data-item-id');
		vex.dialog.confirm({
			message: 'Are you absolutely sure you want to delete the Assignment?',
			callback: (value) => {
				if(value) {
					this.props.dispatch(
						actions.deleteItem(
							this.props,
							itemId
						)
					);
				}
			}
		});
	};

	handleRemark = event => this.props.dispatch(
		actions.remarks(
			this.props,
			event.currentTarget.getAttribute('data-item-id'),
			event.currentTarget.getAttribute('data-item-bcsmapid')
		)
	);

	launchTagModal = event => this.props.dispatch(
		actions.showTagModal(
			event.currentTarget.getAttribute('data-student-id')
		)
	);

	handleTagUpdate = event => this.props.dispatch(
		actions.tagUpdate(
			event.currentTarget.getAttribute('data-student-id'),
			event.currentTarget.getAttribute('data-tag-id')
		)
	);

	closeTagModal = () => {
		this.props.dispatch(actions.closeTagModal());
	};

	saveRemark = () => {
		this.props.dispatch(
			actions.saveRemark(
				this.props,
				new FormData(document.getElementById('add-remark-form'))
			)
		);
	};

	showFile = event => {
		window.open(
			this.props.session.servicePath +
			event.currentTarget.getAttribute('data-item-url'),
			'_blank'
		);
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
		if (this.props.remark !== false) return this.renderRemark(__);
		return (
			<React.Fragment>
				{
					firstTime ?
					<View>{this.renderFirstMessage()}</View> : 
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData(__)}
					</View>
				}	
				<Modal
					bsSize='large'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Assignment</Text> :
									<Text>Add Assignment</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Form id='assignment-form'>
								<input type="hidden" name="id" value={this.props.item.id}/>
								<input type="hidden" name="assignmentdetails[id]" value={this.props.item.detailId}/>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='bcsMapId'
											validationState={this.props.errors.bcsMapId ? 'error': null}
										>
											<ControlLabel><Text>Class</Text></ControlLabel>
											<Select
												className='form-control'
												name="bcsMapId"
												placeholder={__('Class')}
												onChange={this.changeClass}
												value={this.props.item.bcsMapId}
												options={this.props.helperData.bcsmaps}
											/>
											<HelpBlock>{this.props.errors.bcsMapId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='subjectId'
											validationState={this.props.errors.subjectId ? 'error': null}
										>
											<ControlLabel><Text>Subject</Text></ControlLabel>
											<Select
												className='form-control'
												name="subjectId"
												placeholder={__('Subject')}
												onChange={this.updateData}
												value={this.props.item.subjectId}
												options={this.props.helperData.subjects}
												isLoading={this.props.helperData.loadingSubject}
											/>
											<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={12}>
										<FormGroup
											controlId='assignmentdetails[title]'
											validationState={this.props.errors.title ? 'error': null}
										>
											<ControlLabel><Text>Assignment Title</Text></ControlLabel>
											<FormControl
												placeholder={__('Assignment Title')}
												name='assignmentdetails[title]'
												onChange={this.updateData}
												value={this.props.item['assignmentdetails[title]']}
											/>
											<HelpBlock>{this.props.errors.title}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>	
										<FormGroup
											controlId='start_date'
											validationState={this.props.errors.start_date ? 'error': null}
										>
											<ControlLabel><Text>Start Date</Text></ControlLabel>
											<Datepicker
												datepicker={{
													minDate: this.props.session.selectedSession.start_date,
													maxDate: this.props.session.selectedSession.end_date,
												}}
												placeholder={__('Start Date')}
												value={this.props.item.start_date}
												onChange={this.updateData}
												className='form-control'
												name='start_date'/>
											<HelpBlock>{this.props.errors.start_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>	
										<FormGroup
											controlId='end_date'
											validationState={this.props.errors.end_date ? 'error': null}
										>
											<ControlLabel><Text>End Date</Text></ControlLabel>
											<Datepicker
												datepicker={{
													minDate: this.props.session.selectedSession.start_date,
													maxDate: this.props.session.selectedSession.end_date,
												}}
												placeholder={__('End Date')}
												value={this.props.item.end_date}
												onChange={this.updateData}
												className='form-control'
												name='end_date'/>
											<HelpBlock>{this.props.errors.end_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup
											controlId='comment'
											validationState={this.props.errors.comment ? 'error': null}
										>
											<ControlLabel><Text>Assignment Comment</Text></ControlLabel>
											<TextEditor
												placeholder={__('Assignment Comment')}
												name='assignmentdetails[comment]'
												defaultValue={this.props.item['assignmentdetails[comment]']}
											/>
											<HelpBlock>{this.props.errors.comment}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='assignment_file'
											validationState={this.props.errors.assignment_file ? 'error': null}
										>
											<ControlLabel><Text>Upload File</Text></ControlLabel>
											<FormControl name='assignment_file' type='file'/>
											<HelpBlock>{this.props.errors.assignment_file}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									{this.props.item.id && this.props.item.assignment_file &&
										<Col md={6} style={{marginBottom:'10px'}}>
											<a 
												href={this.props.session.servicePath + this.props.item.assignment_file}
												target='_blank'
												rel='noopener noreferrer'
												title={__('View File')}
											>
												<Icon 
													style={{fontSize: 20}}
													glyph={'icon-flatline-file'}
												/>
												{this.props.item.assignment_file_name}
											</a>
										</Col>
									}
								</Row>
								<div className='text-right'>
									<Button
										bsStyle='primary'
										onClick={this.save}
										disabled={this.props.saving}>
										<Text>Submit</Text>
									</Button>
								</div>
							</Form>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Assignment</Text></h3>
						<div>
							<Text>In this part, you will be creating all the Assignment in a school session.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Assignment'
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
					title={__('Title')}
					placeholder={__('Assignment Title')}
					onChange={this.updateFilter}
					name='assignmentdetail__title'
					value={filterValue(filters, 'assignmentdetail__title', '')} />
				<Select
					title={__('Class')}
					placeholder={__('Select Class')}
					onChange={this.updateFilter}
					name='assignment__bcsMapId__eq'
					options={this.props.helperData.bcsmaps}
					value={filterValue(filters, 'assignment__bcsMapId__eq', '')} />
				<Select
					title={__('Subject')}
					placeholder={__('Select Subject')}
					onChange={this.updateFilter}
					name='assignment__subjectId__eq'
					options={this.props.helperData.subjects}
					value={filterValue(filters, 'assignment__subjectId__eq', '')} />
				<Select
					title={__('Status')}
					name='assignment__assignment_status'
					onChange={this.updateFilter}
					options={getAssignmentStatus(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'assignment__assignment_status', null)}/>
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
							<td className='tw-10'><Text>Status</Text></td>
							<td className='tw-15'><Text>Title</Text></td>
							<td className='tw-15'><Text>Class</Text></td>
							<td className='tw-15'><Text>Subject</Text></td>
							<td className='tw-15'><Text>File Type</Text></td>
							<td className='tw-10'><Text>Start Date</Text></td>
							<td className='tw-10'><Text>End Date</Text></td>
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
			return <DataTable.NoDataRow colSpan={7}/>;
		}
		return this.props.items.map((item) => (
			<tr key={item.id}>
				<td className='tw-10'>{Assignment.getAssignmentStatusLabel(item.assignment_status)}</td>
				<td className='tw-15'>{item.assignmentdetails[0].title}</td>
				<td className='tw-15'>{item.bcsmap.board.boarddetails[0].alias+' - '+item.bcsmap.class.classesdetails[0].name +' - '+ item.bcsmap.section.sectiondetails[0].name}</td>
				<td className='tw-15'>{item.subject.subjectdetails[0].name}</td>
				<td className='tw-15'>{item.assignment_type ? item.assignment_file.substr(item.assignment_file.lastIndexOf('.')+1) : __('N/A')}</td>
				<td className='tw-10'><DateView>{item.start_date}</DateView></td>
				<td className='tw-10'><DateView>{item.end_date}</DateView></td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							item.assignment_status === 'Draft' &&
							<React.Fragment>
								{this.permissions.edit &&
									<DataTable.Action
										text='Edit'
										glyph='fa-edit'
										onClick={this.edit}
										data-item-id={item.id}/>
								}
								{this.permissions.status &&	
									<DataTable.Action
										text='Publish'
										glyph='fa-cloud-upload-alt'
										onClick={this.changeStatus}
										data-item-status='Published'
										data-item-oldstatus={item.assignment_status}
										data-item-id={item.id}/>
								}
								{this.permissions.delete &&	
									<DataTable.Action
										text='Delete'
										glyph='fa-trash'
										onClick={this.handleDelete}
										data-item-id={item.id}/>	
								}
							</React.Fragment>		
						}
						{ 
							item.assignment_status === 'Published' &&
							<React.Fragment>
								{this.permissions.status &&	
									<DataTable.Action
										text='Cancelled'
										glyph='fa-ban'
										onClick={this.changeStatus}
										data-item-status='Canceled'
										data-item-oldstatus={item.assignment_status}
										data-item-id={item.id}/>
								}
								{this.permissions.status &&	
									<DataTable.Action
										text='Review'
										glyph='fa-eye'
										onClick={this.handleRemark}
										data-item-bcsmapid={item.bcsMapId}
										data-item-id={item.id}/>	
								}
							</React.Fragment>
						}
						{
							(item.assignment_file && item.assignment_status !== 'Canceled') &&
							<DataTable.Action
								text='View File'
								glyph='fa-image'
								onClick={this.showFile}
								data-item-url={item.assignment_file}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderRemark(__) {
		if (this.props.remark === null) return <Loading/>;
		let tagArr = [];
		if(this.props.remark.at_tags['tag_'+this.props.remark.studentId]) {	
			tagArr = this.props.remark.at_tags['tag_'+this.props.remark.studentId].split(',');
		}
		return (
			<React.Fragment>
				{this.props.remark.students.length > 0 &&
					<View>	
						<Row>
							<Col xs={12}>
								<Alert className='bg-orange fg-darkgrayishblue75'>
									<Text>You must have to submit all students remark to complete this assignment.</Text>
								</Alert>
							</Col>
						</Row>
						<Form id='add-remark-form'>
							<input type="hidden" name="assignmentId" value={this.props.remark.assignmentId}/>
							<div className="studentList">
								{this.renderStudentRow(this.props.remark.students, __)}
							</div>
						</Form>
						<Row>
							<Col xs={12}>
								<div>
									<Button
										onClick={this.reset}>
										<Text>Cancel</Text>
									</Button>{' '}
									<Button
										bsStyle='primary'
										onClick={this.saveRemark}>
										<Text>Submit</Text>
									</Button>
								</div>
								<br/>
							</Col>
						</Row>
					</View>
				}
				{this.props.remark.students.length === 0 && 
					<React.Fragment>
						<Row>
							<Col xs={12}>
								<div className='text-right'>
									<Button
										onClick={this.reset}>
										<Text>View List</Text>
									</Button>
								</div>
								<br/>
							</Col>
						</Row>
						<Alert><Text>No Record Found!</Text></Alert>
					</React.Fragment>
				}
				<Modal show={this.props.remark.showTagModal} onHide={this.closeTagModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title><Text>Select Tags</Text></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div id="tag-container">
							{this.props.remark.tags.map((item) => {
								return <span
									key={item.id}
									className={'tag-box-item '+ (tagArr.indexOf(item.id.toString()) !== -1 ? 'active' : null)}
									data-toggle="tooltip"
									data-tag-id={item.id}
									data-student-id={this.props.remark.studentId}
									title={item.tagdetails[0].description}
									data-placement="bottom"
									onClick={this.handleTagUpdate}
								>
									{item.tagdetails[0].title}
								</span>;
							})}
							{this.props.remark.tags.length === 0 && __('No tags were found')}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<div className='text-center'>
							<Button 
								onClick={this.closeTagModal} 
								bsStyle='primary'>
								<Text>Done</Text>
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</React.Fragment>	
		);
	}

	renderStudentRow(students, __) {
		return (
			<div>
				{students.map((item, index) => {
					return (
						<div 
							key={index}
							className="callout box-class box1"
						>
							<Row key={item.id}>
								<Col md={5}>
									<div className="box-leftcont atstname">
										<div className="student-img-holder">
											<img src={this.props.session.servicePath+item.student.user.user_image } />
										</div>
										<ul className="list-unstyled student-mark-list">
											<li><strong><Text>Enroll</Text>:</strong> { item.student.enrollment_no } </li>
											<li><strong><Text>Roll No</Text>:</strong> { item.roll_no } </li>
											<li><strong><Text>Student</Text>:</strong> {item.student.user.userdetails[0].fullname} </li>
											<li><strong><Text>Father</Text>:</strong> { item.student.studentdetails[0].father_name + ' (' + item.student.father_contact + ')'}</li>
										</ul>
									</div>
								</Col>
								<Col md={7}>
									<div className="action-icons custom">
										<ul>
											<li>
												<input
													type="hidden"
													name={'assignmentremark['+index+'][tags]'}
													value={this.props.remark.at_tags['tag_'+item.student.id]}
												/>
												<span
													className="tag-link"
													data-student-id={item.student.id}
													onClick={this.launchTagModal}
												>
													<i className="fa fa-tag"></i> 
													<Text>Add Tags</Text>
												</span>
											</li>
											<li>
												{item.student.assignmentremark &&
													<input
														type="hidden"
														name={'assignmentremark['+index+'][id]'}
														value={item.student.assignmentremark.id}
													/>
												}
												<input
													type="hidden"
													name={'assignmentremark['+index+'][assignmentId]'}
													value={this.props.remark.assignmentId}
												/>
												<input
													type="hidden"
													name={'assignmentremark['+index+'][studentId]'}
													value={item.student.id}
												/>
											</li>
										</ul>
									</div>
								</Col>
								{this.props.remark.at_tags['tag_'+item.student.id] &&
									<Col md={12} className="p-l-r-0">
										<div id={'student-tags-'+item.student.id} className="student-tags">
											{this.props.remark.at_tags['tag_'+item.student.id].split(',').map((tagId) => {
												return (
													<span
														key={tagId}
														data-toggle="tooltip"
														title={this.props.remark.tagsDesc[tagId] ? this.props.remark.tagsDesc[tagId].tagdetails[0].description : ''}
													>
														{this.props.remark.tagsDesc[tagId] ? this.props.remark.tagsDesc[tagId].tagdetails[0].title : ''}
														<Icon
															className={'delete-tag'}
															glyph={'fa fa-times'}
															title={__('Remove')}
															data-tag-id={tagId}
															data-student-id={item.student.id}
															onClick={this.handleTagUpdate}
														/>
													</span>
												);
											})}
										</div>
									</Col>
								}
							</Row>
						</div>
					);
				})}
			</div>
		);
	}

	static getAssignmentStatusLabel(status) {
		switch (status) {
			case 'Draft':
				return <Label bsStyle="primary"><Text>Draft</Text></Label>;
			case 'Published':
				return <Label bsStyle="success"><Text>Published</Text></Label>;
			case 'Canceled':
				return <Label bsStyle="danger"><Text>Cancelled</Text></Label>;
			case 'Completed':
				return <Label bsStyle="warning"><Text>Completed</Text></Label>;
			case -1:
				return <Label bsStyle="warning"><Text>Updating</Text></Label>;
		}
	}
}
