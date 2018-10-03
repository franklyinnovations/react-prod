import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	bcsName,
	filterValue,
	moduleActions,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/lmschapter';
import * as actions from '../redux/actions/lmschapter';
addView('lmschapter', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Form,
	Modal,
	Table,
	Alert,
	Button,
	Select,
	Loading,
	Checkbox,
	HelpBlock,
	DataTable,
	FormGroup,
	TextEditor,
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
export default class LmsChapter extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'lmschapter');
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
	addChapter = () => this.props.dispatch({
		type: 'ADD_LCR_CHAPTER',
		data: {
			name: '',
			errors: {},
			is_active: 1,
			chapter_number: '',
		},
	});
	removeChapter = index => () => this.props.dispatch({
		type: 'REMOVE_LCR_CHAPTER',
		index,
	});
	updateDataWithIndex = index => event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE_INDEX',
		index,
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	save = () => this.props.dispatch(actions.save(this.props));
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
			+event.currentTarget.getAttribute('data-item-status'),
		)
	);

	viewTopics = event => this.props.dispatch(
		actions.viewTopics(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
	addTopic = event => this.props.dispatch({
		type: 'LCR_ADD_TOPIC',
		data: {
			name: '',
			content: '',
			is_active: 1,
			lmsdocuments: [],
			deletedDocuments: [],
			lmschapterId: +event.currentTarget.getAttribute('data-item-id'),
		},
	});
	editTopic = event => this.props.dispatch(
		actions.editTopic(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
	deleteDocument = event => this.props.dispatch({
		type: 'DELETE_LCR_DOCUMENT',
		id: +event.currentTarget.getAttribute('data-item-id'),
	});
	saveTopic = () => this.props.dispatch(
		actions.saveTopic(
			this.props,
			new FormData(document.getElementById('topic-data-form')),
		)
	);
	changeTopicStatus = event => this.props.dispatch(
		actions.changeTopicStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
			+event.currentTarget.getAttribute('data-item-status'),
		)
	);
	deleteTopic = event => this.props.dispatch(
		actions.deleteTopic(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.getAttribute('data-chapter-id'),
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
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Chapter</Text> :
									<Text>Add Chapter</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{this.props.item && this.renderEditForm(__)}
					</Modal.Body>
				</Modal>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.topics !== false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Topics</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.topics === null && <Loading/>}
						{this.props.topics && this.renderTopics(__)}
					</Modal.Body>
				</Modal>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.topic !== false}>
					{
						this.props.topic &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.topic.id ?
									<Text>Edit Topic</Text> :
									<Text>Add Topic</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.topic === null && <Loading/>}
						{this.props.topic && this.renderTopicEditForm(__)}
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
						<h3><Text>Chapters</Text></h3>
						<div>
							<Text>In this part, you will be creating chapters.</Text>
						</div>
					</Col>
				</Row>
				<ClickButton
					side='left'
					glyph='fa-plus'
					text='Let’s Add Now'
					btnText='Add Chapter'
					onClick={this.startAdd}/>
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
					onChange={this.updateFilter}
					name='lmschapterdetail__name'
					value={filterValue(filters, 'lmschapterdetail__name', '')} />
				<Select
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					name='lmschapter__bcsmapId__eq'
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'lmschapter__bcsmapId__eq', '')} />
				<Select
					title={__('Subject')}
					placeholder={__('Subject')}
					onChange={this.updateFilter}
					name='lmschapter__subjectId__eq'
					options={this.props.meta.subjects}
					value={filterValue(filters, 'lmschapter__subjectId__eq', '')} />
				<Select
					title={__('Status')}
					name='lmschapter__is_active'
					onChange={this.updateFilter}
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'lmschapter__is_active', null)}/>
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
							<td className='tw-15'><Text>Class</Text></td>
							<td className='tw-15'><Text>Subject</Text></td>
							<td className='tw-15'><Text>Chapter No.</Text></td>
							<td className='tw-15'><Text>Chapter Name</Text></td>
							<td className='tw-15'><Text>Topics</Text></td>
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
		return this.props.items.map(item =>
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
				<td className='tw-15'>{bcsName(item.bcsmap)}</td>
				<td className='tw-15'>{item.subject.subjectdetails[0].name}</td>
				<td className='tw-15'>{item.lmschapterdetails[0].chapter_number}</td>
				<td className='tw-15'>{item.lmschapterdetails[0].name}</td>
				<td className='tw-15'>{item.topics}</td>
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
							this.permissions.addtopic &&
							<DataTable.Action
								text='Add Topic'
								onClick={this.addTopic}
								glyph='fa-plus-circle'
								data-item-id={item.id}/>
						}
						{
							this.permissions.viewtopic &&
							<DataTable.Action
								text='View Topics'
								glyph='fa-list-ul'
								data-item-id={item.id}
								onClick={this.viewTopics}/>
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
		);
	}

	renderEditForm(__) {
		let {item, errors, meta} = this.props;
		return (
			<React.Fragment>
				<FormGroup
					controlId='bcsmapId'
					validationState={this.props.errors.bcsmapId ? 'error': null}>
					<ControlLabel><Text>Class</Text></ControlLabel>
					<Select
						name='bcsmapId'
						value={item.bcsmapId}
						options={meta.bcsmaps}
						onChange={this.updateData}/>
					<HelpBlock>{errors.bcsmapId}</HelpBlock>
				</FormGroup>
				<FormGroup
					controlId='subjectId'
					validationState={this.props.errors.subjectId ? 'error': null}>
					<ControlLabel><Text>Subject</Text></ControlLabel>
					<Select
						name='subjectId'
						value={item.subjectId}
						options={meta.subjects}
						onChange={this.updateData}/>
					<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
				</FormGroup>
				{item.id ? this.renderEditPart(__) : this.renderAddPart(__)}
			</React.Fragment>
		);
	}

	renderEditPart(__) {
		let {item, errors} = this.props;
		return (
			<React.Fragment>
				<FormGroup
					controlId='name'
					validationState={errors.name ? 'error': null}>
					<ControlLabel><Text>Chapter Name</Text></ControlLabel>
					<FormControl
						type='text'
						name='name'
						value={item.name}
						placeholder={__('Name')}
						onChange={this.updateData}/>
					<HelpBlock>{errors.name}</HelpBlock>
				</FormGroup>
				<FormGroup
					controlId='chapter_number'
					validationState={errors.chapter_number ? 'error': null}>
					<ControlLabel><Text>Chapter No.</Text></ControlLabel>
					<FormControl
						type='text'
						name='chapter_number'
						onChange={this.updateData}
						value={item.chapter_number}
						placeholder={__('Chapter Number')}/>
					<HelpBlock>{errors.chapter_number}</HelpBlock>
				</FormGroup>
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
							onClick={this.save}>
							<Text>Submit</Text>
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	}

	renderAddPart(__) {
		return (
			<React.Fragment>
				{
					this.props.item.chapters.map((item, index) => 
						<Row key={index}>
							<Col xs={12}>
								<FormGroup validationState={item.errors.name ? 'error': null}>
									<ControlLabel><Text>Chapter Name</Text></ControlLabel>
									<FormControl
										type='text'
										name='name'
										value={item.name}
										placeholder={__('Name')}
										onChange={this.updateDataWithIndex(index)}/>
									<HelpBlock>{item.errors.name}</HelpBlock>
								</FormGroup>
							</Col>
							<Col xs={6}>
								<FormGroup validationState={item.errors.chapter_number ? 'error': null}>
									<ControlLabel><Text>Chapter No.</Text></ControlLabel>
									<FormControl
										type='text'
										name='chapter_number'
										value={item.chapter_number}
										onChange={this.updateDataWithIndex(index)}
										placeholder={__('Chapter Number')}/>
									<HelpBlock>{item.errors.chapter_number}</HelpBlock>
								</FormGroup>
							</Col>
							<Col xs={4}>
								<FormGroup>
									<ControlLabel className='invisible'>H</ControlLabel>
									<FormControl.Static componentClass='div'>
										<Checkbox
											inline
											name='is_active'
											value={item.is_active}
											onChange={this.updateDataWithIndex(index)}>
											<ControlLabel><Text>Status</Text></ControlLabel>
										</Checkbox>
									</FormControl.Static>
								</FormGroup>
							</Col>
							<Col xs={2} className='text-right'>
								<FormGroup>
									<ControlLabel className='invisible'>H</ControlLabel>
									<div>
										<Button
											bsStyle='danger'
											title={__('Delete')}
											onClick={this.removeChapter(index)}>
											<Icon glyph='fa-trash'/>
										</Button>
									</div>
								</FormGroup>
							</Col>
						</Row>
					)
				}
				<div>
					<Button bsStyle='primary' onClick={this.addChapter}>
						<Text>Add More</Text>
					</Button>	
				</div>
				<div className='text-right'>
					<Button
						bsStyle='primary'
						onClick={this.save}>
						<Text>Submit</Text>
					</Button>
				</div>
			</React.Fragment>
		);
	}

	renderTopics(__) {
		let topics = this.props.topics;
		if (topics.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No result found.</Text>
				</Alert>
			);
		return (
			<Table>
				<thead>
					<tr>
						<th className='tw-20'><Text>Status</Text></th>
						<th className='tw-50'><Text>Name</Text></th>
						<th><Text>Actions</Text></th>
					</tr>
				</thead>
				<tbody>
					{
						topics.map(item =>
							<tr key={item.id}>
								<td className='tw-20'>
									<Checkbox
										inline
										data-item-id={item.id}
										value={item.is_active}
										onChange={this.changeTopicStatus}
										data-item-status={item.is_active}
										disabled={!this.permissions.topicstatus}
										title={getStatusTitle(item.is_active, __)}/>
								</td>
								<td className='tw-50'>{item.lmstopicdetails[0].name}</td>
								<td className='text-primary'>
									{
										this.permissions.edittopic &&
										<Icon
											glyph='fa-edit'
											title={__('Edit')}
											data-item-id={item.id}
											onClick={this.editTopic}/>
									}
									&nbsp;&nbsp;
									{
										this.permissions.deletetopic &&
										!item.removing &&
										<Icon
											glyph='fa-trash'
											title={__('Delete')}
											data-item-id={item.id}
											onClick={this.deleteTopic}
											data-chapter-id={item.lmschapterId}/>
									}
								</td>
							</tr>
						)
					}
				</tbody>
			</Table>
		);
	}

	renderTopicEditForm(__) {
		let {topic, errors} = this.props;
		return (
			<Form id='topic-data-form'>
				<FormGroup
					controlId='name'
					validationState={errors.name ? 'error': null}>
					<ControlLabel><Text>Topic Name</Text></ControlLabel>
					<FormControl
						type='text'
						defaultValue={topic.name}
						name='lmstopicdetail[name]'
						placeholder={__('Topic Name')}/>
					<HelpBlock>{errors.name}</HelpBlock>
				</FormGroup>
				<FormGroup
					controlId='content'
					validationState={errors.content ? 'error': null}>
					<ControlLabel><Text>Add Points to be Remember</Text></ControlLabel>
					<TextEditor
						defaultValue={topic.content}
						name='lmstopicdetail[content]'/>
					<HelpBlock>{errors.content}</HelpBlock>
				</FormGroup>
				<FormGroup
					controlId='lmsdocuments'
					validationState={this.props.errors.lmsdocuments ? 'error': null}>
					<ControlLabel><Text>Upload Video/PPT/Notes in PDF/Worksheets</Text></ControlLabel>
					<FormControl name='lmsdocuments' type='file' multiple/>
					<HelpBlock><Text>Max. 25 MB each</Text></HelpBlock>
					{
						this.props.topic.lmsdocuments.map(item =>
							<div key={item.id}>
								{item.name}
								&nbsp;
								&nbsp;
								<Icon
									glyph='fa-trash'
									data-item-id={item.id}
									className='text-primary'
									onClick={this.deleteDocument}/>
							</div>
						)
					}
				</FormGroup>
				<Row>
					<Col xs={6}>
						<Checkbox name='is_active' defaultValue={topic.is_active}>
							<ControlLabel><Text>Status</Text></ControlLabel>
						</Checkbox>
					</Col>
					<Col xs={6} className='text-right'>
						<Button
							bsStyle='primary'
							onClick={this.saveTopic}
							disabled={this.props.saving}>
							<Text>Submit</Text>
						</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}

