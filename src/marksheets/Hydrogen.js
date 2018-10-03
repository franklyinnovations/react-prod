import React from 'react';
import {connect} from 'react-redux';

import {
	Row,
	Col,
	Text,
	Select,
	Checkbox,
	FormGroup,
	HelpBlock,
	FormControl,
	ControlLabel,
} from '../components';

import {
	messenger,
	getInputValue,
} from '../utils';

class Creator extends React.Component {
	render() {
		return null;
	}

	static createState () {
		return {
			saved: true,
			meta: {},
			data: {},
		};
	}
}

@connect(state => ({
	...state.view.state.editor,
}))
export default class Hydrogen extends React.Component {

	updateSettings = event => {
		if (event.currentTarget.name === 'preMidTermExams') {
			let value = getInputValue(event.currentTarget);
			value = value[value.length - 1];
			if (this.props.settings.preAnnualExams.indexOf(value) !== -1) {
				messenger.post({
					type: 'error',
					message: window.__('This is already a pre annual exam.'),
				});
				return;
			}
		}

		if (event.currentTarget.name === 'preAnnualExams') {
			let value = getInputValue(event.currentTarget);
			value = value[value.length - 1];
			if (this.props.settings.preMidTermExams.indexOf(value) !== -1) {
				messenger.post({
					type: 'error',
					message: window.__('This is already a pre mid term exam.'),
				});
				return;
			}
		}

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
					<FormGroup validationState={errors.preMidTermExams ? 'error' : null}>
						<ControlLabel><Text>Pre mid term exams</Text></ControlLabel>
						<Select
							multi
							name='preMidTermExams'
							value={settings.preMidTermExams}
							onChange={updateSettings}
							options={this.props.options.examheads}/>
						<HelpBlock>{errors.preMidTermExams}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.w1 ? 'error' : null}>
						<ControlLabel><Text>Weightage</Text></ControlLabel>
						<FormControl
							name='w1'
							type='text'
							value={settings.w1}
							onChange={updateSettings}/>
						<HelpBlock>{errors.w1}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.preAnnualExams ? 'error' : null}>
						<ControlLabel><Text>Pre annual exams</Text></ControlLabel>
						<Select
							multi
							name='preAnnualExams'
							onChange={updateSettings}
							value={settings.preAnnualExams}
							options={this.props.options.examheads}/>
						<HelpBlock>{errors.preAnnualExams}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.w2 ? 'error' : null}>
						<ControlLabel><Text>Weightage</Text></ControlLabel>
						<FormControl
							name='w2'
							type='text'
							value={settings.w2}
							onChange={updateSettings}/>
						<HelpBlock>{errors.w2}</HelpBlock>
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
							value={settings.activities}
							onChange={updateSettings}
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
			preMidTermExams: [],
			preAnnualExams: [],
			subjects: [],
			activities: [],
			w1: 50,
			w2: 50,
			abbreviations: true,
			...JSON.parse(data.settings),
		};
	}

	static validateSettings(_settings) {
		let errors = {},
			__ = window.__,
			settings = JSON.parse(JSON.stringify(_settings));
		settings.customText = settings.customText.trim();

		settings.w1 = typeof settings.w1 === 'string' ? settings.w1.trim() : settings.w1;
		if (settings.w1 === '') 
			errors.w1 = __('This is a required field.');
		else if (isNaN(Number(settings.w1)) || Number(settings.w1) <= 0)
			errors.w1 = __('Invalid Weightage.');
		else if (Number(settings.w1) > 999)
			errors.w1 = __('Can not be greater than 999.');

		settings.w2= typeof settings.w2 === 'string' ? settings.w2.trim() : settings.w2;
		if (settings.w2 === '') 
			errors.w2 = __('This is a required field.');
		else if (isNaN(Number(settings.w2)) || Number(settings.w2) <= 0)
			errors.w2 = __('Invalid Weightage.');
		else if (Number(settings.w2) > 999)
			errors.w2 = __('Can not be greater than 999.');

		if (settings.subjects.length === 0)
			errors.subjects = __('This is a required field.');

		if (settings.preMidTermExams.length === 0)
			errors.preMidTermExams = __('This is a required field.');

		if (settings.preAnnualExams.length === 0)
			errors.preAnnualExams = __('This is a required field.');

		return {
			settings,
			errors: Object.keys(errors).length !== 0 && errors,
		};
	}

	static creator = Creator;
}

