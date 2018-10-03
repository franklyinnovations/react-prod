import React from 'react';
import {connect} from 'react-redux';
import api, {makeApiData} from '../api';

import {
	Row,
	Col,
	Text,
	Select,
	Button,
	Checkbox,
	HelpBlock,
	FormGroup,
	Datepicker,
	FormControl,
	ControlLabel,
	ServiceImage,
} from '../components';

import {
	messenger,
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
		type: event.currentTarget.getAttribute('data-action-type'),
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget)
	});

	updateRemark = event => this.props.dispatch({
		type: 'UPDATE_MS_REMARK',
		studentIndex: event.currentTarget.getAttribute('data-student-index'),
		value: getInputValue(event.currentTarget),
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
							data: JSON.stringify({
								date: this.props.marksheet.data.date
							}),
							marksheetrecords: this.props.meta.students.map(
								(student, index) => ({
									studentId: student.id,
									marksheetId: this.props.marksheet.id,
									data: JSON.stringify({
										remarkId: this.props.marksheet.marksheetrecords[index].remarkId,
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
		if (this.props.marksheet.data.date === null)
			errors.date = window.__('This is required field');
		this.props.marksheet.marksheetrecords.forEach((marksheetrecord, index) => {
			if (marksheetrecord.remarkId === null)
				errors['remark' + index] = window.__('This is required field');
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
				<Col md={6}>
					<FormGroup
						controlId='date'
						validationState={this.props.errors.date ? 'error' : null}>
						<ControlLabel><Text>Date</Text></ControlLabel>
						<Datepicker
							name='date'
							value={this.props.marksheet.data.date}
							data-action-type='UPDATE_MS_DATE'
							onChange={this.update}
							placeholder={__('Date')}/>
						<HelpBlock>{this.props.errors.date}</HelpBlock>
					</FormGroup>
				</Col>
				<Col xs={12} className='student-marks-table'>
					{
						this.props.meta.students.map((student, index) => (
							<Row key={student.id}>
								<Col md={3} className='student-profileinfo'>
									<div>
										<ServiceImage
											src = {
												this.props.session.servicePath
												+ student.user.user_image
											}
											width={60}
											className='img-circle'/>
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
											value={this.props.marksheet.marksheetrecords[index].remarkId}
											onChange={this.updateRemark}
											data-student-index={index}
											options={this.props.meta.tags}
											placeholder={__('Remark')}/>
										<HelpBlock>{this.props.errors['remark' + index]}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
						))
					}
				</Col>
				<Col xs={12}>
					<Button
						bsStyle='primary'
						onClick={this.save}>
						<Text>Save</Text>
					</Button>
				</Col>
			</Row>
		);
	}
}

@connect(state => ({
	...state.view.state.editor,
}))
export default class Boron extends React.Component {
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
						<ControlLabel><Text>Custom Text</Text></ControlLabel>
						<FormControl
							name='customText'
							value={settings.customText}
							onChange={updateSettings}/>
					</FormGroup>
					<FormGroup validationState={errors.annualExams ? 'error' : null}>
						<ControlLabel><Text>Annual exams</Text></ControlLabel>
						<Select
							multi
							name='annualExams'
							onChange={updateSettings}
							value={settings.annualExams}
							options={this.props.options.examheads}/>
						<HelpBlock>{errors.annualExams}</HelpBlock>
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
						<ControlLabel><Text>Activities</Text></ControlLabel>
						<Select
							multi
							name='activities'
							onChange={updateSettings}
							value={settings.activities}
							options={this.props.options.activities}/>
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
			};
		});

		data.options.activities.forEach((activity, index, activities) => {
			activities[index] = {
				label: activity.activitydetails[0].name,
				value: activity.id,
			};
		});

		data.settings = {
			customText: '',
			annualExams: [],
			subjects: [],
			activities: [],
			abbreviations: true,
			...JSON.parse(data.settings),
		};
	}

	static validateSettings(_settings) {
		let errors = {},
			__ = window.__,
			settings = JSON.parse(JSON.stringify(_settings));

		if (settings.subjects.length === 0)
			errors.subjects = __('This is a required field.');

		if (settings.annualExams.length === 0)
			errors.annualExams = __('This is a required field.');

		return {
			settings,
			errors: Object.keys(errors).length !== 0 && errors,
		};
	}

	static creator = Creator;
}

