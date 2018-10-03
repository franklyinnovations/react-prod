import React from 'react';
import {connect} from 'react-redux';
import api, {makeApiData} from '../api';

import {
	Row,
	Col,
	Text,
	Button,
	Select,
	Checkbox,
	FormGroup,
	HelpBlock,
	FormControl,
	ControlLabel,
	ServiceImage,
} from '../components';


import {
	getInputValue,
} from '../utils';

@connect(state => ({
	session: state.session,
	lang: state.lang,
	marksheetbuilderId: state.view.state.selector.marksheetbuilderId,
	creator: state.view.state.meta.creator,
	...state.view.state.creator.data
}))
class Creator extends React.Component {
	update = event => this.props.dispatch({
		type: event.target.getAttribute('data-action-type'),
		name: event.target.name,
		value: getInputValue(event.target)
	});

	updateRemark = event => this.props.dispatch({
		type: 'UPDATE_MS_REMARK',
		studentIndex: event.target.getAttribute('data-student-index'),
		value: getInputValue(event.target),
	});

	updateResult = event => this.props.dispatch({
		type: 'UPDATE_MS_RESULT',
		studentIndex: event.target.getAttribute('data-student-index'),
		value: getInputValue(event.target),
	});

	save = () => {
		let errors = this.validate();
		if (Object.keys(errors).length !== 0) {
			this.props.dispatch({
				type: 'SET_MS_DATA_ERRORS',
				errors,
			});
			return;
		}
		this.props.dispatch(
			async dispatch => {
				dispatch({type: 'SAVE_MS_DATA'});

				await api({
					url: '/admin/marksheet/save',
					data: makeApiData(this.props, {
						marksheet: {
							id: this.props.marksheet.id,
							academicSessionId: this.props.session.selectedSession.id,
							marksheetbuilderId: this.props.marksheetbuilderId,
							data: JSON.stringify({}),
							marksheetrecords: this.props.meta.students.map(
								(student, index) => ({
									studentId: student.id,
									marksheetId: this.props.marksheet.id,
									data: JSON.stringify({
										remark: this.props.marksheet.marksheetrecords[index].remark,
										result: this.props.marksheet.marksheetrecords[index].result,
									}),
								})
							)
						},
					}),
				});

				dispatch({type: 'MS_DATA_SAVED'});
			}
		);
	};

	validate = () => {
		let errors = {};
		this.props.marksheet.marksheetrecords.forEach((marksheetrecord, index) => {
			if (marksheetrecord.remark === null)
				errors['remark' + index] = window.__('This is required field');
			if (marksheetrecord.result === null)
				errors['result' + index] = window.__('This is required field');
		});
		return errors;
	};

	render() {
		let __ = window.__;
		return (
			<Row>
				<Col xs={12}>
					<h3><Text>Marksheet Information</Text></h3>
				</Col>
				<Col xs={12} className='student-marks-table'>
					{
						this.props.meta.students.map((student, index) => (
							<Row key={student.id}>
								<Col md={3} className='student-profileinfo'>
									<div>
										<ServiceImage
											width={60}
											className='img-circle'
											src={student.user.user_image}/>
									</div>
									<div>
										<b>{student.user.userdetails[0].fullname}</b>
									</div>
									<div><Text>Roll No.</Text> {student.studentrecord.roll_no}</div>
								</Col>
								<Col md={3} mdOffset={3}>
									<FormGroup validationState={this.props.errors['remark' + index] ? 'error' : null}>
										<ControlLabel><Text>Remark</Text></ControlLabel>
										<Select
											value={this.props.marksheet.marksheetrecords[index].remark}
											onChange={this.updateRemark}
											data-student-index={index}
											options={this.props.meta.remarks}
											placeholder={__('Remark')}/>
										<HelpBlock>{this.props.errors['remark' + index]}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={3}>
									<FormGroup validationState={this.props.errors['result' + index] ? 'error' : null}>
										<ControlLabel><Text>Result</Text></ControlLabel>
										<Select
											value={this.props.marksheet.marksheetrecords[index].result}
											onChange={this.updateResult}
											data-student-index={index}
											options={this.props.meta.results}
											placeholder={__('Result')}/>
										<HelpBlock>{this.props.errors['result' + index]}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
						))
					}
				</Col>
				<Col xs={12}>
					<Button onClick={this.save} bsStyle='primary'>
						<Text>Save</Text>
					</Button>
				</Col>
			</Row>
		);
	}

	static createState () {
		return {
			saved: false,
			meta: {},
			data: {},
		};
	}
}

@connect(state => ({
	...state.view.state.editor,
}))
export default class Lithium extends React.Component {

	updateSettings = event => {
		this.props.updateSettings(event);
	};

	render() {
		let {settings, errors} = this.props,
			updateSettings = this.updateSettings;
		return (
			<Row>
				<Col xs={12}>
					<FormGroup>
						<ControlLabel><Text>Custom Text - 1</Text></ControlLabel>
						<FormControl
							name='customText1'
							value={settings.customText1}
							onChange={updateSettings}/>
					</FormGroup>
					<FormGroup>
						<ControlLabel><Text>Custom Text - 2</Text></ControlLabel>
						<FormControl
							name='customText2'
							value={settings.customText2}
							onChange={updateSettings}/>
					</FormGroup>
					<FormGroup>
						<ControlLabel><Text>Marksheet Title</Text></ControlLabel>
						<FormControl
							name='title'
							value={settings.title}
							onChange={updateSettings}/>
					</FormGroup>
					<FormGroup validationState={errors.subjects ? 'error' : null}>
						<ControlLabel><Text>Subjects</Text></ControlLabel>
						<Select
							multi
							name='subjects'
							value={settings.subjects}
							onChange={updateSettings}
							options={this.props.options.subjects}/>
						<HelpBlock>{errors.subjects}</HelpBlock>
					</FormGroup>
					<FormGroup>
						<Checkbox
							name='subjectcategories'
							onChange={updateSettings}
							value={!!settings.subjectcategories}>
							<ControlLabel><Text>Subject Categories</Text></ControlLabel>
						</Checkbox>
					</FormGroup>
					<div>
						{
							settings.subjectcategories &&
							this.props.options.subjects.map(
								subject => (
									settings.subjects.indexOf(subject.value) !== -1 &&
									<FormGroup
										key={subject.value}
										validationState={errors['s' + subject.value] ? 'error' : null}>
										<ControlLabel>{subject.label}</ControlLabel>
										<Select
											multi
											onChange={updateSettings}
											name={'s' + subject.value}
											options={subject.subjectcategories}
											value={settings['s' + subject.value] || []}/>
										<HelpBlock>{errors['s' + subject.value]}</HelpBlock>
									</FormGroup>
								)
							)
						}
					</div>
					<FormGroup validationState={errors.subjectExams ? 'error' : null}>
						<ControlLabel><Text>Exams</Text></ControlLabel>
						<Select
							multi
							name='subjectExams'
							onChange={updateSettings}
							value={settings.subjectExams}
							options={this.props.options.examheads}/>
						<HelpBlock>{errors.subjectExams}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.activities ? 'error' : null}>
						<ControlLabel><Text>Activities</Text></ControlLabel>
						<Select
							multi
							name='activities'
							onChange={updateSettings}
							value={settings.activities}
							options={this.props.options.activities}/>
						<HelpBlock>{errors.activities}</HelpBlock>
					</FormGroup>
					<FormGroup>
						<Checkbox
							name='subActivities'
							onChange={updateSettings}
							value={settings.subActivities}>
							<ControlLabel><Text>Sub Activities</Text></ControlLabel>
						</Checkbox>
					</FormGroup>
					<FormGroup validationState={errors.activityExams ? 'error' : null}>
						<ControlLabel><Text>Exams</Text></ControlLabel>
						<Select
							multi
							name='activityExams'
							onChange={updateSettings}
							value={settings.activityExams}
							options={this.props.options.examheads}/>
						<HelpBlock>{errors.activityExams}</HelpBlock>
					</FormGroup>
					<FormGroup>
						<Checkbox
							name='abbreviations'
							onChange={updateSettings}
							value={settings.abbreviations}>
							<ControlLabel><Text>Abbreviations</Text></ControlLabel>
						</Checkbox>
					</FormGroup>
				</Col>
			</Row>
		);
	}

	static transformTemplateData(data) {
		data.options.examheads.forEach((examhead, index, examheads) => {
			examheads[index] = {
				label: examhead.examheaddetails[0].name,
				value: examhead.id,
			};
		});

		data.options.subjects.forEach((subject, index, subjects) => {
			subjects[index] = {
				label: subject.subjectdetails[0].name,
				value: subject.id,
				subjectcategories: subject.subjectcategories.map(
					subjectcategory => ({
						label: subjectcategory.subjectcategorydetails[0].name,
						value: subjectcategory.id
					})
				)
			};
		});

		data.options.activities.forEach((activity, index, activities) => {
			activities[index] = {
				label: activity.activitydetails[0].name,
				value: activity.id,
			};
		});

		data.settings = {
			customText1: '',
			customText2: '',
			subjectExams: [],
			activityExams: [],
			subjects: [],
			activities: [],
			abbreviations: true,
			title: window.__('Marksheet'),
			subActivities: false,
			subjectcategories: false,
			...JSON.parse(data.settings),
		};
	}

	static validateSettings(_settings) {
		let
			__ = window.__,
			errors = {},
			settings = JSON.parse(JSON.stringify(_settings));
		if (settings.subjects.length === 0)
			errors.subjects = __('This is a required field.');
		if (settings.activities.length === 0)
			errors.activities = __('This is a required field.');
		if (settings.subjectExams.length === 0)
			errors.subjectExams = __('This is a required field.');
		if (settings.activityExams.length === 0)
			errors.activityExams = __('This is a required field.');

		const subjectcategories = [];
		if (settings.subjectcategories) {
			for (let i = settings.subjects.length - 1; i >= 0; i--) {
				let cats = settings['s' + settings.subjects[i]];
				if (!cats || cats.length === 0) {
					errors['s' + settings.subjects[i]] = __('This is a required field.');
				} else {
					subjectcategories.push(...cats);
				}
			}
			settings.subjectcategories = subjectcategories;
		} else {
			settings.subjectcategories = false;
		}

		return {
			settings,
			errors: Object.keys(errors).length !== 0 && errors,
		};
	}

	static creator = Creator;
}

