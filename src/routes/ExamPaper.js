import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	filterValue,
	moduleActions,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/exam_paper';
import * as actions from '../redux/actions/exam_paper';
addView('exam_paper', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Form,
	Text,
	Modal,
	Panel,
	Table,
	Button,
	Select,
	Loading,
	Checkbox,
	DateView,
	Clearfix,
	HelpBlock,
	DataTable,
	FormGroup,
	InputGroup,
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
export default class ExamPaper extends React.Component {

	static nextPaperSectionID = 1;
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'exam_paper');
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
	addSurveySection = () => {
		if (this.props.item.section_title.trim()) {
			this.props.dispatch({
				type: 'ADD_EXP_SECTION',
				id: ExamPaper.nextPaperSectionID++, 
				title: this.props.item.section_title,
			});
		}
	};
	removeSurveySection = event => this.props.dispatch({
		type: 'REMOVE_EXP_SECTION',
		index: +event.currentTarget.getAttribute('data-index'),
	});
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('exam-paper-form'))
		)
	);
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
			+event.currentTarget.getAttribute('data-item-status'),
		)
	);
	changePublishStatus = event => this.props.dispatch(
		actions.changePublishStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-index'),
		)
	);
	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Exam Paper?'),
		});
	};
	view = event => this.props.dispatch(
		actions.viewMappedQuestions(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
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
									<Text>Edit Exam Paper</Text> :
									<Text>Add Exam Paper</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Form id='exam-paper-form'>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='paper_title'
											validationState={this.props.errors.paper_title ? 'error': null}>
											<ControlLabel><Text>Paper Name</Text></ControlLabel>
											<FormControl
												autoFocus
												type='text'
												name='paper_title'
												onChange={this.updateData}
												placeholder={__('Paper Name')}
												value={this.props.item.paper_title}/>
											<HelpBlock>{this.props.errors.paper_title}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='max_marks'
											validationState={this.props.errors.max_marks ? 'error': null}>
											<ControlLabel><Text>Max Marks</Text></ControlLabel>
											<FormControl
												type='text'
												name='max_marks'
												onChange={this.updateData}
												placeholder={__('Max Marks')}
												value={this.props.item.max_marks}/>
											<HelpBlock>{this.props.errors.max_marks}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='total_questions'
											validationState={this.props.errors.total_questions ? 'error': null}>
											<ControlLabel><Text>No. of Questions</Text></ControlLabel>
											<FormControl
												type='text'
												name='total_questions'
												onChange={this.updateData}
												placeholder={__('No. of Questions')}
												value={this.props.item.total_questions}/>
											<HelpBlock>{this.props.errors.total_questions}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='classId'
											validationState={this.props.errors.classId ? 'error': null}>
											<ControlLabel><Text>Class</Text></ControlLabel>
											<Select
												name='classId'
												placeholder={__('Class')}
												onChange={this.changeClass}
												value={this.props.item.classId}
												options={this.props.meta.bcs_list}/>
											<HelpBlock>{this.props.errors.classId}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='subjectId'
											validationState={this.props.errors.subjectId ? 'error': null}>
											<ControlLabel><Text>Subject</Text></ControlLabel>
											<Select
												name='subjectId'
												onChange={this.updateData}
												placeholder={__('Subject')}
												options={this.props.meta.subjects}
												value={this.props.item.subjectId}/>
											<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='published_date'
											validationState={this.props.errors.published_date ? 'error': null}>
											<ControlLabel><Text>Published Date</Text></ControlLabel>
											<Datepicker
												name='published_date'
												onChange={this.updateData}
												placeholder={__('Published Date')}
												value={this.props.item.published_date}
												datepicker={{
													minDate: this.props.session.selectedSession.start_date,
													maxDate: this.props.session.selectedSession.end_date,
												}}/>
											<HelpBlock>{this.props.errors.published_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='tags_for_search'
											validationState={this.props.errors.tags_for_search ? 'error': null}>
											<ControlLabel><Text>Tags for Search (Comma seperated)</Text></ControlLabel>
											<FormControl
												type='text'
												name='tags_for_search'
												onChange={this.updateData}
												placeholder={__('Tags for Search')}
												value={this.props.item.tags_for_search}/>
											<HelpBlock>{this.props.errors.tags_for_search}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='duration'
											validationState={this.props.errors.duration ? 'error': null}>
											<ControlLabel><Text>Duration in Minutes</Text></ControlLabel>
											<FormControl
												type='text'
												name='duration'
												onChange={this.updateData}
												value={this.props.item.duration}
												placeholder={__('Duration in Minutes')}/>
											<HelpBlock>{this.props.errors.duration}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col xs={12} md={12} lg={12}>
										<FormGroup
											controlId='comments'
											validationState={this.props.errors.comments ? 'error': null}>
											<ControlLabel><Text>Comments or Instructions</Text></ControlLabel>
											<FormControl
												rows='3'
												name='comments'
												onChange={this.updateData}
												componentClass='textarea'
												value={this.props.item.comments}
												placeholder={__('Comments or Instructions')}/>
											<HelpBlock>{this.props.errors.comments}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='section_title'
											validationState={this.props.errors.section_title ? 'error': null}>
											<ControlLabel><Text>Sections in Paper</Text></ControlLabel>
											<InputGroup>
												<FormControl
													type='text'
													name='section_title'
													onChange={this.updateData}
													disabled={!!this.props.item.id}
													placeholder={__('Sections in Paper')}
													value={this.props.item.section_title}/>
												<InputGroup.Addon onClick={this.addSurveySection}>
													<Icon glyph='fa-plus'/>
												</InputGroup.Addon>
											</InputGroup>
										</FormGroup>
									</Col>
								</Row>
								{
									this.props.surveySections.length > 0 &&
									<Table bordered responsive>
										<thead>
											<tr>
												<th><Text>S.No.</Text></th>
												<th><Text>Section</Text></th>
												{
													!this.props.item.id && <th><Text>Action</Text></th>
												}
											</tr>
										</thead>
										<tbody>
											{
												this.props.surveySections.map((item, index) => 
													<tr key={index}>
														<td>{index+1}</td>
														<td>{item}</td>
														{
															!this.props.item.id &&
															<td>
																<Button
																	data-index={index}
																	title={__('Remove')}
																	onClick={this.removeSurveySection}>
																	<Icon glyph='fa-trash'/>
																</Button>
															</td>
														}
													</tr>
												)
											}
										</tbody>
									</Table>
								}
								<Row>
									<Col xs={6}>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
											<ControlLabel><Text>Status</Text></ControlLabel>
										</Checkbox>
									</Col>
									<Col xs={6} className='text-right'>
										<Button
											bsStyle='primary'
											onClick={this.save}
											disabled={this.props.saving}>
											<Text>Submit</Text>
										</Button>
									</Col>
								</Row>
							</Form>
						}
					</Modal.Body>
				</Modal>
				<Modal
					bsSize='large'
					onHide={this.hideDataModal}
					show={this.props.questions !== false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Mapped Questions</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.questions === null && <Loading/>}
						{
							this.props.questions && 
							this.props.questions.map((item, index) =>
								<Panel key={item.id}>
									<Panel.Heading>
										<Panel.Title>
											<Text options={{index: index + 1}}>Question [[index]]</Text>
										</Panel.Title>
									</Panel.Heading>
									<Panel.Body>
										<p dangerouslySetInnerHTML={item.questionHtml}/>
										{
											item.optionsHtml.length !== 0 &&
											<React.Fragment>
												<hr/>
												<ul className='que-options'>
													{
														item.optionsHtml.map((option, index) =>
															<li
																key={index}
																dangerouslySetInnerHTML={option}/>
														)
													}
												</ul>
											</React.Fragment>
										}
									</Panel.Body>
								</Panel>
							)
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
						<h3><Text>Exam Papers</Text></h3>
						<div>
							<Text>In this part, you will be creating all the Exam Papers in a school session.</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>First Test, Half Yearly, Final Term etc.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Exam Paper'
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
					placeholder={__('Title')}
					onChange={this.updateFilter}
					name='exampaperdetail__paper_title'
					value={filterValue(filters, 'exampaperdetail__paper_title', '')} />
				<Select
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					name='exampaper__classId__eq'
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'exampaper__classId__eq', '')} />
				<Select
					title={__('Subject')}
					placeholder={__('Subject')}
					onChange={this.updateFilter}
					name='exampaper__subjectId__eq'
					options={this.props.meta.subject_list}
					value={filterValue(filters, 'exampaper__subjectId__eq', '')} />
				<Select
					title={__('Status')}
					name='exampaper__is_active'
					onChange={this.updateFilter}
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'exampaper__is_active', null)}/>
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
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-15'><Text>Paper Title</Text></td>
							<td className='tw-15'><Text>Duration (min.)</Text></td>
							<td className='tw-15'><Text>Max. Marks</Text></td>
							<td className='tw-15'><Text>No. of Questions</Text></td>
							<td className='tw-15'><Text>Published Date</Text></td>
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
		return this.props.items.map((item, index) => (
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
				<td className='tw-15'>{item.exampaperdetails[0].paper_title}</td>
				<td className='tw-15'>{item.duration}</td>
				<td className='tw-15'>{item.max_marks}</td>
				<td className='tw-15'>{item.total_questions}</td>
				<td className='tw-15'><DateView>{item.published_date}</DateView></td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.publish && (
							item.is_published === 1 ?
							<DataTable.Action
								text='Un-Publish'
								data-item-index={index}
								glyph='fa-cloud-download-alt'
								onClick={this.changePublishStatus}/> :
							<DataTable.Action
								text='Publish'
								data-item-index={index}
								glyph='fa-cloud-upload-alt'
								onClick={this.changePublishStatus}/>
							)
						}
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
						{
							item.mapped_questions.length > 0 &&
							<DataTable.Action
								glyph='fa-eye'
								onClick={this.view}
								data-item-id={item.id}
								text='View mapped questions'/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}
}

