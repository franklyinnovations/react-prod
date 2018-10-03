import React from 'react';
import {connect} from 'react-redux';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/paper_map_with_question';
import * as actions from '../redux/actions/paper_map_with_question';
addView('paper_map_with_question', reducer);

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
	HelpBlock,
	BCheckbox,
	InputGroup,
	FormGroup,
	FormControl,
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
export default class PaperMapWithQuestion extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

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
	changeSubject = event => this.props.dispatch(
		actions.changeSubject(
			this.props,
			event.currentTarget.value,
		)
	);
	changePaper = event => {
		let value = event.currentTarget.value,
			paper = this.props.meta.exampapers.find(item => item.id === value);
		this.props.dispatch({type: 'SET_PMQ_PAPER', paper});
	};
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('pmq-form'))
		)
	);
	cancel = () => this.props.router.push(this.props.router.location);

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				<Row>
					<Col md={6}>
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
					<Col md={6}>
						<FormGroup
							controlId='subjectId'
							validationState={this.props.errors.subjectId ? 'error': null}>
							<ControlLabel><Text>Subject</Text></ControlLabel>
							<Select
								name='subjectId'
								onChange={this.changeSubject}
								options={this.props.meta.subjects}
								value={this.props.selector.subjectId}/>
							<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Form id='pmq-form'>
					<Row>
						<Col md={4}>
							<FormGroup
								controlId='examPaperId'
								validationState={this.props.errors.examPaperId ? 'error': null}>
								<ControlLabel><Text>Exam Paper</Text></ControlLabel>
								<Select
									name='examPaperId'
									onChange={this.changePaper}
									options={this.props.meta.exampapers}
									value={this.props.meta.paper && this.props.meta.paper.id}/>
								<HelpBlock>{this.props.errors.examPaperId}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					{
						this.props.meta.paper &&
						<Panel>
							<Panel.Heading>
								<Panel.Title>
									<Text>Exam Paper Detail</Text>
								</Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<Row>
									<Col md={6}>
										<Text>Total no of questions</Text>
										&nbsp;:&nbsp;
										{this.props.meta.paper.total_questions}
									</Col>
									<Col md={6}>
										<Text>Max marks</Text>
										&nbsp;:&nbsp;
										{this.props.meta.paper.max_marks}
									</Col>
								</Row>
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
										<ul className='que-options'>
											{
												item.optionsHtml.map((option, index) =>
													<li
														key={index}
														dangerouslySetInnerHTML={option}/>
												)
											}
										</ul>
										<Row>
											<Col md={4}>
												<FormGroup
													controlId={'question_mark___'+item.id}
													validationState={this.props.errors['question_mark___' + item.id] ? 'error': null}>
													<ControlLabel><Text>Question Mark</Text></ControlLabel>
													<FormControl
														type='text'
														name={'question_mark___'+item.id}/>
													<HelpBlock>{this.props.errors['question_mark___'+item.id]}</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={4}>
												<FormGroup
													controlId={'negative_marking_marks___'+item.id}
													validationState={this.props.errors['negative_marking_marks___'+item.id] ? 'error': null}>
													<ControlLabel><Text>Is negative marking allowed</Text></ControlLabel>
													<OptionalFormControl
														type='text'
														placeholder='Negative Marks'
														name={'negative_marking_marks___'+item.id}
														checkboxName={'is_negative_marking_allowed___'+item.id}/>
													<HelpBlock>{this.props.errors['negative_marking_marks___'+item.id]}</HelpBlock>
												</FormGroup>
											</Col>
											{
												this.props.meta.paper &&
												this.props.meta.paper.exampapersections.length !== 0 &&
												<Col md={4}>
													<FormGroup
														controlId={'examPaperSectionId___'+item.id}
														validationState={this.props.errors['examPaperSectionId___'+item.id] ? 'error': null}>
														<ControlLabel><Text>Select Section</Text></ControlLabel>
														<UncontrolledSelect
															valueKey='id'
															labelKey='section_title'
															name={'examPaperSectionId___'+item.id}
															options={this.props.meta.paper.exampapersections}/>
														<HelpBlock>{this.props.errors['examPaperSectionId___'+item.id]}</HelpBlock>
													</FormGroup>
												</Col>
											}
										</Row>
										<BCheckbox name='is_mapped[]' value={item.id}>
											<Text>Select for Paper</Text>
										</BCheckbox>
									</Panel.Body>
								</Panel>
							))
						}
					</React.Fragment>
					{
						this.props.meta.paper &&
						<React.Fragment>
							<Button onClick={this.cancel}>
								<Text>Cancel</Text>
							</Button>
							&nbsp;&nbsp;
							<Button bsStyle='primary' onClick={this.save}>
								<Text>Save</Text>
							</Button>
						</React.Fragment>
					}
				</Form>
			</View>
		);
	}
}

class UncontrolledSelect extends React.PureComponent {

	state = {value : this.props.defaultValue};
	update = event => this.setState({value: event.currentTarget.value});

	render() {
		return (
			<Select
				onChange={this.update}
				value={this.state.value}
				{...this.props}/>
		);
	}
}

class OptionalFormControl extends React.PureComponent {

	state = {disabled: true};
	update = event => this.setState({disabled: !event.currentTarget.checked});

	render() {
		let {checkboxName, ...props} = this.props;
		return (
			<InputGroup>
				<InputGroup.Addon>
					<input onChange={this.update} type='checkbox' name={checkboxName} />
				</InputGroup.Addon>
				<FormControl
					{...props}
					disabled={this.state.disabled}/>
			</InputGroup>
		);
	}
}