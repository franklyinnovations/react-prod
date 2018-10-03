import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	mapRange,
	messenger,
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/question';
import * as actions from '../redux/actions/question';
addView('question', reducer);

import {
	Row,
	Col,
	Icon,
	Form,
	View,
	Text,
	Alert,
	Modal,
	Panel,
	Button,
	Select,
	Loading,
	HelpBlock,
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
export default class Question extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'question');
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
		this.props.router.push(
			this.props.router.createPath(
				this.props.router.location.pathname
			)
		);
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
	updateQuestionOptions = () => {
		let {questionControlType, number_of_options, options} = this.props.item,
			numOptions = questionControlType === null ? null : (
				questionControlType.startsWith('text_type') ? 0 : (
					!/^\d+$/.test(number_of_options) ? null :
						parseInt(number_of_options)
				)
		);
		if (numOptions === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please enter valid option.'),
			});
			return;
		} else if (numOptions > 10) {
			messenger.post({
				type: 'error',
				message: window.__('Maximum 10 options allowed.'),
			});
			return;
		} else {
			this.props.dispatch({
				type: 'UPDATE_QUE_OPTIONS',
				options: options ? null : mapRange(numOptions, index => ({
					index,
				})),
			});
		}
	};
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(
				document.getElementById('question-data-form')
			),
		)
	);
	remove = event => this.props.dispatch(
		actions.remove(
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
									<Text>Edit Question</Text> :
									<Text>Add Question</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{this.props.item && this.renderDataForm(__)}
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
						<h3><Text>Questions</Text></h3>
						<div>
							<Text>
								In this part, you will be creating all the Exams in a school session.
							</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Questions'
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
				<Select
					title={__('Class')}
					name='question__classId__eq'
					onChange={this.updateFilter}
					placeholder={__('Select Class')}
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'question__classId__eq', null)}/>
				<Select
					title={__('Status')}
					onChange={this.updateFilter}
					name='question__subjectId__eq'
					placeholder={__('Select Subject')}
					options={this.props.meta.subject_list}
					value={filterValue(filters, 'question__subjectId__eq', null)}/>
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

	renderData() {
		let index = (this.props.pageInfo.currentPage - 1) * this.props.pageInfo.pageLimit;
		if (this.props.items.length === 0)
			return <Alert bsStyle='warning'><Text>No record found.</Text></Alert>;
		return (
			<React.Fragment>
				{
					this.props.items.map(item => 
						<Panel key={item.id}>
							<Panel.Heading>
								<Panel.Title>
									<Text options={{index: ++index}}>Question [[index]]</Text>
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
														dangerouslySetInnerHTML={option}
														className={
															item.questionoptions[index].is_answered_marked ?
															'text-success' : undefined
														}/>
												)
											}
										</ul>
									</React.Fragment>
								}
								{
									this.permissions.edit &&
									<Button
										bsStyle='primary'
										onClick={this.edit}
										data-item-id={item.id}>
										<Text>Edit</Text>
									</Button>
								}
								{
									this.permissions.edit && this.permissions.delete && 
									<React.Fragment>&nbsp;&nbsp;</React.Fragment>
								}
								{
									this.permissions.delete &&
									<Button
										bsStyle='danger'
										onClick={this.remove}
										data-item-id={item.id}>
										<Text>Remove</Text>
									</Button>
								}
							</Panel.Body>
						</Panel>
					)
				}
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderDataForm(__) {
		let options = !!this.props.item.options;
		return (
			<React.Fragment>
				<Form id='question-data-form'>
					<input type='hidden' value={this.props.item.id} name='id'/>
					<input type='hidden' name='question_type_slug' value={
						!this.props.item.questionControlType ? '' :
							this.props.item.questionControlType.split('-')[0]
					}/>
					<Row>
						<Col md={6}>
							<FormGroup
								controlId='classId'
								validationState={this.props.errors.classId ? 'error': null}>
								<ControlLabel><Text>Class</Text></ControlLabel>
								<Select
									name='classId'
									onChange={this.changeClass}
									value={this.props.item.classId}
									placeholder={__('Select Class')}
									options={this.props.meta.bcs_list}/>
								<HelpBlock>{this.props.errors.classId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup
								controlId='subjectId'
								validationState={this.props.errors.subjectId ? 'error': null}>
								<ControlLabel><Text>Subject</Text></ControlLabel>
								<Select
									name='subjectId'
									onChange={this.updateData}
									value={this.props.item.subjectId}
									options={this.props.meta.subjects}
									placeholder={__('Select Subject')}/>
								<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup
								controlId='time_to_attempt_question'
								validationState={this.props.errors.time_to_attempt_question ? 'error': null}>
								<ControlLabel>
									<Text>Recommended time to attempt the question (min)</Text>
								</ControlLabel>
								<FormControl
									type='text'
									onChange={this.updateData}
									name='time_to_attempt_question'
									placeholder={__('Recommended time')}
									value={this.props.item.time_to_attempt_question}/>
								<HelpBlock>{this.props.errors.time_to_attempt_question}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup
								controlId='tags_for_search'
								validationState={this.props.errors.tags_for_search ? 'error': null}>
								<ControlLabel>
									<Text>Tags for search (Comma seperated)</Text>
								</ControlLabel>
								<FormControl
									type='text'
									name='tags_for_search'
									onChange={this.updateData}
									placeholder={__('Tags for search')}
									value={this.props.item.tags_for_search}/>
								<HelpBlock>{this.props.errors.tags_for_search}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<FormGroup
						controlId='comments'
						validationState={this.props.errors.comments ? 'error': null}>
						<ControlLabel>
							<Text>Comments or Instructions for this question</Text>
						</ControlLabel>
						<FormControl
							rows='3'
							name='comments'
							componentClass='textarea'
							onChange={this.updateData}
							value={this.props.item.comments}/>
						<HelpBlock>{this.props.errors.comments}</HelpBlock>
					</FormGroup>
					<Panel>
						<Panel.Heading>
							<Panel.Title>
								<Text>Enter details here</Text>
							</Panel.Title>
						</Panel.Heading>
						<Panel.Body>
							<Row>
								<Col md={4}>
									<FormGroup
										controlId='questionControlType'
										validationState={this.props.errors.questionControlTypeId ? 'error': null}>
										<ControlLabel><Text>Question Type</Text></ControlLabel>
										<Select
											name='questionControlType'
											onChange={this.updateData}
											disabled={options || !!this.props.item.id}
											value={this.props.item.questionControlType}
											options={this.props.meta.question_control_types}/>
										<input type='hidden' name='questionControlTypeId' value={
											!this.props.item.questionControlType ? '' :
												this.props.item.questionControlType.split('-')[1]
										}/>
										<HelpBlock>{this.props.errors.questionControlTypeId}</HelpBlock>
									</FormGroup>
								</Col>
								{
									this.props.item.questionControlType &&
									!this.props.item.questionControlType.startsWith('text_type') &&
									<Col md={4}>
										<FormGroup
											controlId='number_of_options'
											validationState={this.props.errors.number_of_options ? 'error': null}>
											<ControlLabel>
												<Text>Number of options</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='number_of_options'
												onChange={this.updateData}
												placeholder={__('Number of options')}
												value={this.props.item.number_of_options}
												readOnly={options || !!this.props.item.id}/>
											<HelpBlock>{this.props.errors.number_of_options}</HelpBlock>
										</FormGroup>
									</Col>
								}
								{
									!this.props.item.id &&
									<Col md={4}>
										<FormGroup>
											<ControlLabel className='invisible'>H</ControlLabel>
											<div>
												<Button
													bsStyle='primary'
													onClick={this.updateQuestionOptions}>
													<Text>
														{options ? 'Edit Above Details' : 'Create Question'}
													</Text>
												</Button>
											</div>
										</FormGroup>
									</Col>
								}
							</Row>
							{options && this.renderQuestion(__)}
						</Panel.Body>
					</Panel>
				</Form>
				{
					options &&
					<div className='text-right'>
						<Button
							bsStyle='primary'
							onClick={this.save}
							disabled={this.props.saving}>
							<Text>Submit</Text>
						</Button>
					</div>
				}
			</React.Fragment>
		);
	}

	renderQuestion() {
		let type = this.props.item.questionControlType.split('-')[0]
			=== 'single_choice' ? 'radio' : 'checkbox';
		return (
			<Panel>
				<Panel.Heading>
					<Panel.Title>
						<Text>Create Question</Text>
					</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<p><Text>Question Detail</Text></p>
					<FormGroup validationState={this.props.errors.question_title ? 'error' : null}>
						<TextEditor name='question_title' defaultValue={this.props.item.question_title}/>
						<HelpBlock>{this.props.errors.question_title}</HelpBlock>
					</FormGroup>
					{
						this.props.item.options.length !== 0 &&
						<React.Fragment>
							<hr/>
							{
								this.props.item.options.map((option, index) =>
									<React.Fragment key={index}>
										<p><Text options={{index: index + 1}}>Option [[index]]</Text></p>
										<FormGroup validationState={this.props.errors['option_title_' + index] ? 'error' : null}>
											<TextEditor defaultValue={option.option_title} name={'option_title_' + index}/>
											<HelpBlock>{this.props.errors['option_title_' + index]}</HelpBlock>
										</FormGroup>
										{option.id && <input type='hidden' name={'option_id_' + index} value={option.id}/>}
										{
											type === 'radio' ?
											<div className='radio'>
												<label>
													<input
														type='radio'
														value={index}
														name='is_answered_marked'
														defaultChecked={option.is_answered_marked}/>
													<Text>Mark as answer</Text>
												</label>
											</div> :
											<div className='checkbox'>
												<label>
													<input
														value={index}
														type='checkbox'
														name='is_answer_marked[]'
														defaultChecked={option.is_answered_marked}/>
													<Text>Mark as answer</Text>
												</label>
											</div>
										}
									</React.Fragment>
								)
							}
						</React.Fragment>
					}
				</Panel.Body>
			</Panel>
		);
	}
}

