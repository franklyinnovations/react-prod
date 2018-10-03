import React from 'react';
import {connect} from 'react-redux';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/bulk_upload_question';
import * as actions from '../redux/actions/bulk_upload_question';
addView('bulk_upload_question', reducer);

import {
	Row,
	Col,
	View,
	Form,
	Text,
	Panel,
	Button,
	Select,
	Loading,
	ListGroup,
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel,
	ListGroupItem,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class BulkUploadQuestion extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	downloadSample = () => window.location = this.props.session.servicePath + 
				'public/sample_bulkquestion/default_xls_for_bulk_questions.xlsx';
	upload = () => {
		let __ = window.__;
		if (!this.props.selector.classId)
			return Messenger().post({
				type: 'error',
				message: __('Please Select Class')
			});
		if (!this.props.selector.subjectId)
			return Messenger().post({
				type: 'error',
				message: __('Please Select Subject')
			});
		if (!this.props.selector.questionControlType)
			return Messenger().post({
				type: 'error',
				message: __('Please Select Question Type')
			});
		if (!document.getElementById('excelfile').value)
			return Messenger().post({
				type: 'error',
				message: __('Please upload a excel file')
			});

		this.props.dispatch(
			actions.upload(
				this.props,
				new FormData(
					document.getElementById('bulk-upload-question-form')
				)
			)
		);
	};
	updateSelector = event => this.props.dispatch({
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
	cancel = () => this.props.router.push('/exam/upload-bulk-questions');
	save = () => this.props.dispatch(actions.save(this.props));

	render() {
		if (this.props.loading) return <Loading/>;
		let questionControlType = this.props.selector.questionControlType,
			questionControlTypeId = '', question_type_slug = '';
		if (questionControlType) {
			[question_type_slug, questionControlTypeId] = questionControlType.split('-');
		}
		return (
			<View actions={this.renderViewActions()}>
				<Form id='bulk-upload-question-form'>
					<Row>
						<Col md={4}>
							<FormGroup
								controlId='classId'
								validationState={this.props.errors.classId ? 'error': null}>
								<ControlLabel><Text>Class</Text></ControlLabel>
								<Select
									name='classId'
									onChange={this.changeClass}
									options={this.props.meta.bcs_list}
									value={this.props.selector.classId}/>
								<HelpBlock>{this.props.errors.classId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup
								controlId='subjectId'
								validationState={this.props.errors.subjectId ? 'error': null}>
								<ControlLabel><Text>Subject</Text></ControlLabel>
								<Select
									name='subjectId'
									onChange={this.updateSelector}
									options={this.props.meta.subjects}
									value={this.props.selector.subjectId}/>
								<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup
								controlId='questionControlTypeId'
								validationState={this.props.errors.questionControlTypeId ? 'error': null}>
								<ControlLabel><Text>Question Type</Text></ControlLabel>
								<Select
									name='questionControlType'
									onChange={this.updateSelector}
									value={this.props.selector.questionControlType}
									options={this.props.meta.question_control_types}/>
								<HelpBlock>{this.props.errors.questionControlTypeId}</HelpBlock>
							</FormGroup>
							<input type='hidden' name='question_type_slug' value={question_type_slug} />
							<input type='hidden' name='questionControlTypeId' value={questionControlTypeId} />
						</Col>
						<Col md={4}>
							<FormGroup>
								<ControlLabel><Text>Upload Excel File</Text></ControlLabel>
								<FormControl 
									type='file'
									id='excelfile'
									name='question_image'/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<ControlLabel className='invisible'>H</ControlLabel>
								<div>
									<Button
										bsStyle='primary'
										onClick={this.upload}>
										<Text>Show Data</Text>
									</Button>
								</div>
							</FormGroup>
						</Col>
					</Row>
				</Form>
				{
					this.props.errors.length > 0 &&
					<Panel bsStyle='danger'>
						<Panel.Heading>
							<Panel.Title>
								<Text>Validation Failed. Please fix and upload excel again.</Text>
							</Panel.Title>
						</Panel.Heading>
						<Panel.Body>
							<ListGroup>
								{
									this.props.errors.map((error, index) => (
										<ListGroupItem bsStyle='danger' key={index}>{error}</ListGroupItem>
									))
								}
							</ListGroup>
						</Panel.Body>
					</Panel>
				}
				<React.Fragment>
					{
						this.props.meta.questions.map((item, index) => (
							<Panel key={index}>
								<Panel.Heading>
									<Panel.Title>
										<Text options={{index: index + 1}}>Question [[index]]</Text>
									</Panel.Title>
								</Panel.Heading>
								<Panel.Body>
									<p dangerouslySetInnerHTML={item.questionHtml}/>
									<hr/>
									<ul>
										{
											item.optionsHtml.map((option, index) =>
												<li
													key={index}
													dangerouslySetInnerHTML={option}
													className={
														item.question_options[index].is_answered_marked ?
														'text-success' : undefined
													}/>
											)
										}
									</ul>
								</Panel.Body>
							</Panel>
						))
					}
				</React.Fragment>
				{
					this.props.meta.questions.length > 0 &&
					<div>
						<Button onClick={this.cancel}>
							<Text>Cancel</Text>
						</Button>
						&nbsp;&nbsp;
						<Button bsStyle='primary' onClick={this.save}>
							<Text>Upload Questions</Text>
						</Button>
					</div>
				}
			</View>
		);
	}

	renderViewActions() {
		return (
			<View.Actions>
				<View.Action onClick={this.downloadSample}>
					<Text>Download Sample Excel</Text>
				</View.Action>
			</View.Actions>
		);
	}
}

