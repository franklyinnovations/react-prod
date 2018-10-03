import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';

import api from '../api';
import makeTranslater from '../translate';

import {
	dialog,
	getInputValue,
} from '../utils';

import {
	getGender,
	getDigestIntervalOptions,
} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/profile';
import * as actions from '../redux/actions/profile';
addView('profile', reducer);

import {
	Row,
	Col,
	Text,
	View,
	Icon,
	Panel,
	Table,
	Button,
	Select,
	Loading,
	Clearfix,
	HelpBlock,
	FormGroup,
	Datepicker,
	FormControl,
	ServiceImage,
	AddressInput,
	ControlLabel,
} from '../components';

@connect(state => ({
	lang: state.lang,
	session: state.session,
	translations: state.translations,
	loading: state.view.loading || false,
	digests: !!state.view.state.digests,
}))
export default class Profile extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	state = {activePanel: 'a'};
	changePanel = activePanel => this.setState({activePanel});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View>
				<div className='panel-group'>
					<UserProfile
						changePanel={this.changePanel}
						expanded={this.state.activePanel === 'a'}/>
					<Password
						changePanel={this.changePanel}
						expanded={this.state.activePanel === 'b'}/>
					<Username
						changePanel={this.changePanel}
						expanded={this.state.activePanel === 'c'}/>
					<Defaults
						changePanel={this.changePanel}
						expanded={this.state.activePanel === 'd'}/>
					{
						this.props.session.user_type === 'teacher' &&
						<TeacherProfile
							__={__}
							changePanel={this.changePanel}
							expanded={this.state.activePanel === 'e'}/>
					}
					{
						this.props.session.user_type === 'institute' &&
						<InstituteProfile
							__={__}
							changePanel={this.changePanel}
							expanded={this.state.activePanel === 'f'}/>
					}
					{
						this.props.digests && this.props.session.user_type !== 'student' &&
						<Digests
							changePanel={this.changePanel}
							expanded={this.state.activePanel === 'g'}/>
					}
				</div>
			</View>
		);
	}
}

@connect(state => state.view.state.user || {notReady: true})
class UserProfile extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_USER_DATA',
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget),
	});

	submit = async () => {
		await this.props.dispatch(actions.saveUserProfile(
			new FormData(document.getElementById('user-profile-data'))
		));
		$('#user-profile-data input[type=file]').val('');
	};

	changePanel = () => this.props.changePanel('a');

	render() {
		return this.props.notReady ||(
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Profile</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row componentClass='form' id='user-profile-data'>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.fullname ? 'error' : null}>
									<ControlLabel><Text>Name</Text></ControlLabel>
									<FormControl
										type='text'
										name='fullname'
										onChange={this.update}
										value={this.props.fullname}/>
									<HelpBlock>{this.props.errors.fullname}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.email ? 'error' : null}>
									<ControlLabel><Text>Email</Text></ControlLabel>
									<FormControl
										type='text'
										name='email'
										onChange={this.update}
										value={this.props.email}/>
									<HelpBlock>{this.props.errors.email}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.mobile ? 'error' : null}>
									<ControlLabel><Text>Mobile</Text></ControlLabel>
									<FormControl
										type='text'
										name='mobile'
										onChange={this.update}
										value={this.props.mobile}/>
									<HelpBlock>{this.props.errors.mobile}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<FormGroup
								controlId='user_image'
								validationState={this.props.errors.user_image ? 'error': null}>
								<Col md={4}>
									<ControlLabel><Text>Profile Image</Text></ControlLabel>
									<FormControl name='user_image' type='file'/>
									<HelpBlock>{this.props.errors.user_image}</HelpBlock>
								</Col>
								<Col md={4}>
									{
										this.props.user_image &&
										<ServiceImage src={this.props.user_image} width='96' height='96'/>
									}
								</Col>
								<Clearfix/>
							</FormGroup>
							<FormGroup
								controlId='signature'
								validationState={this.props.errors.signature ? 'error': null}>
								<Col md={4}>
									<ControlLabel><Text>Signature</Text></ControlLabel>
									<FormControl name='signature' type='file'/>
									<HelpBlock>{this.props.errors.signature}</HelpBlock>
								</Col>
								<Col md={4}>
									{
										this.props.signature &&
										<ServiceImage src={this.props.signature} width='96' height='96'/>
									}
								</Col>
								<Clearfix/>
							</FormGroup>
							<Col xs={12}>
								<Button
									bsStyle='primary'
									onClick={this.submit}
									disabled={this.props.saving}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}
}

@connect(state => state.view.state.password || {notReady: true})
class Password extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_PASSWORD_DATA',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = () => this.props.dispatch(actions.changePassword());

	changePanel = () => this.props.changePanel('b');

	render() {
		return this.props.notReady || (
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Password</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.curr_password ? 'error' : null}>
									<ControlLabel><Text>Current Password</Text></ControlLabel>
									<FormControl
										type='password'
										name='curr_password'
										onChange={this.update}
										value={this.props.curr_password}/>
									<HelpBlock>{this.props.errors.curr_password}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={this.props.errors.password ? 'error' : null}>
									<ControlLabel><Text>New Password</Text></ControlLabel>
									<FormControl
										name='password'
										type='password'
										onChange={this.update}
										value={this.props.password}/>
									<HelpBlock>{this.props.errors.password}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={this.props.errors.confirm_password ? 'error' : null}>
									<ControlLabel><Text>Confirm Password</Text></ControlLabel>
									<FormControl
										type='password'
										onChange={this.update}
										name='confirm_password'
										value={this.props.confirm_password}/>
									<HelpBlock>{this.props.errors.confirm_password}</HelpBlock>
								</FormGroup>
								<Button disabled={this.props.saving} bsStyle='primary' onClick={this.submit}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}
}

@connect(state => state.view.state.username || {notReady: true})
class Username extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_USERNAME_DATA',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = () => this.props.dispatch(actions.changeUsername());

	changePanel = () => this.props.changePanel('c');

	render() {
		return this.props.notReady ||(
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Username</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.user_name ? 'error' : null}>
									<ControlLabel><Text>Username</Text></ControlLabel>
									<FormControl
										type='text'
										name='user_name'
										onChange={this.update}
										value={this.props.user_name}/>
									<HelpBlock>{this.props.errors.user_name}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={this.props.errors.curr_password ? 'error' : null}>
									<ControlLabel><Text>Password</Text></ControlLabel>
									<FormControl
										type='password'
										name='curr_password'
										onChange={this.update}
										value={this.props.curr_password}/>
									<HelpBlock>{this.props.errors.curr_password}</HelpBlock>
								</FormGroup>
								<Button disabled={this.props.saving} bsStyle='primary' onClick={this.submit}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}
}

@connect(state => state.view.state.defaults ? ({
	...state.view.state.defaults,
	superadmin: state.session.masterId === 1,
	languages: state.session.languages.map(language => ({
		label: language.name,
		value: language.id,
	})),
	academicSessions: state.session.userdetails.academicSessions.map(session => ({
		label: session.academicsessiondetails[0].name,
		value: session.id,
	})),
}) : {notReady: true})
class Defaults extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_DEFAULTS_DATA',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = () => this.props.dispatch(actions.changeDefaults());

	changePanel = () => this.props.changePanel('d');

	render() {
		return this.props.notReady || (
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Defaults</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row>
							<Col md={4}>
								<FormGroup>
									<ControlLabel><Text>Language</Text></ControlLabel>
									<Select
										clearable={false}
										name='default_lang'
										onChange={this.update}
										options={this.props.languages}
										value={this.props.default_lang}
										resetValue={this.props.languages[0].value}/>
								</FormGroup>
								{
									this.props.superadmin ||
									<FormGroup>
										<ControlLabel><Text>Academic Session</Text></ControlLabel>
										<Select
											clearable={false}
											onChange={this.update}
											name='defaultSessionId'
											value={this.props.defaultSessionId}
											options={this.props.academicSessions}
											resetValue={this.props.academicSessions[0].value}/>
									</FormGroup>
								}
								<Button disabled={this.props.saving} bsStyle='primary' onClick={this.submit}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}
}

@connect(state =>
	({
		...state.view.state.teacher, date_format: state.session.userdetails.date_format
	}) ||
	({notReady: true})
)
class TeacherProfile extends React.Component {

	expIndex = 0;
	generateExperience = item => ({
		end: null,
		remark: '',
		start: null,
		institute_name: '',
		...item,
		uid: this.expIndex++,
	});

	qualIndex = 0;
	generateQualification = item => ({
		name: '',
		image: '',
		endYear: '',
		startYear: '',
		institute_name: '',
		...item,
		uid: this.qualIndex++,
	});

	state = {
		experiences: this.props.experiences.map(this.generateExperience),
		qualifications: this.props.qualifications.map(this.generateQualification),
	};

	updateExperience = experiences => this.setState({experiences});	
	updateQualification = qualifications => this.setState({qualifications});

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_TEACHER_DATA',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = async () => {
		let experiences = this.buildExperiences(),
			qualifications = this.buildQualifications();
		if (experiences === null || qualifications === null) return;
		let formData = new FormData(document.getElementById('teacher-profile-data'));
		formData.append('teacherdetail[experiences]', JSON.stringify(experiences));
		formData.append('teacherdetail[qualifications]', JSON.stringify(qualifications));
		await this.props.dispatch(actions.saveTeacherProfile(formData));
		$('#teacher-profile-data input[type=file]').val('');
	};

	changePanel = () => this.props.changePanel('e');

	render() {
		let __ = this.props.__;
		return this.props.notReady || (
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Teacher Profile</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<form id='teacher-profile-data'>
							<Row>
								<Col md={4}>
									<FormGroup
										controlId='gender'
										validationState={this.props.errors.gender ? 'error': null}>
										<ControlLabel><Text>Gender</Text></ControlLabel>
										<Select
											name='gender'
											onChange={this.update}
											options={getGender(__)}
											value={this.props.gender}/>
										<HelpBlock>{this.props.errors.gender}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='marital_status'
										validationState={this.props.errors.marital_status ? 'error': null}>
										<ControlLabel><Text>Marital Status</Text></ControlLabel>
										<Select
											name='marital_status'
											onChange={this.update}
											value={this.props.marital_status}
											options={TeacherProfile.maritalStatusOptions(__)}/>
										<HelpBlock>{this.props.errors.marital_status}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={4}>
									<FormGroup
										controlId='join_date'
										validationState={this.props.errors.join_date ? 'error': null}>
										<ControlLabel><Text>Date Of Join</Text></ControlLabel>
										<Datepicker
											name='join_date'
											onChange={this.update}
											value={this.props.join_date}
											datepicker={{
												maxDate: new Date,
											}}/>
										<HelpBlock>{this.props.errors.join_date}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup
										controlId='dob'
										validationState={this.props.errors.dob ? 'error': null}>
										<ControlLabel><Text>Date Of Birth</Text></ControlLabel>
										<Datepicker
											name='dob'
											onChange={this.update}
											value={this.props.dob}
											datepicker={{
												maxDate: new Date,
											}}/>
										<HelpBlock>{this.props.errors.dob}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
							<AddressInput
								__={__}
								value={this.props.address}
								errors={this.props.errors.address}
								names={TeacherProfile.addressInputNames}/>
							<h3><Text>Qualification</Text></h3>
							<QualificationTable
								__={__}
								items={this.state.qualifications}
								onChange={this.updateQualification}
								generateItem={this.generateQualification}/>
							<h3><Text>Experience</Text></h3>
							<ExperienceTable
								__={__}
								items={this.state.experiences}
								onChange={this.updateExperience}
								generateItem={this.generateExperience}/>
						</form>
						<Button
							bsStyle='primary'
							onClick={this.submit}
							disabled={this.props.saving}>
							<Text>Submit</Text>
						</Button>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props.experiences !== prevProps.experiences) {
			let experiences = this.props.experiences;
			if (experiences.length === 0) {
				experiences = [this.generateExperience()];
			} else {
				experiences = experiences.map(this.generateExperience);
			}
			let date_format = this.props.date_format;
			experiences.forEach(item => {
				if (item.start) item.start = moment(item.start, 'YYYY-MM-DD').format(date_format);
				if (item.end) item.end = moment(item.end, 'YYYY-MM-DD').format(date_format);
			});
			this.setState({experiences});
		}
		if (this.props.qualifications !== prevProps.qualifications) {
			let qualifications = this.props.qualifications;
			if (qualifications.length === 0) {
				qualifications = [this.generateQualification()];
			} else {
				qualifications = qualifications.map(this.generateQualification);
			}
			this.setState({qualifications});
		}
	}

	buildExperiences() {
		let result = [],
			date_format = this.props.date_format,
			items = this.state.experiences, error = false;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			result.push({
				...item,
				error: item.start && item.end && 
					moment(item.start, date_format).isSameOrAfter(moment(item.end, date_format)),
			});
			if (!result[i].error)
				delete result[i].error;
			else
				error = true;
		}
		this.setState({experiences: result});
		if (error) {
			return null;
		} else {
			return result
				.filter(e =>
					e.institute_name.trim() ||
					e.remark.trim() ||
					e.start ||
					e.end
				)
				.map(e => ({
					...e,
					start: e.start ? moment(e.start, date_format).format('YYYY-MM-DD'): '',
					end: e.end ? moment(e.end, date_format).format('YYYY-MM-DD') : '',
				}));
		}
	}

	buildQualifications() {
		let
			result = [],
			error = false,
			items = this.state.qualifications,
			year = new Date().getFullYear();
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			result.push({
				...item,
				display_order: i,
				error: (parseInt(item.endYear) > year) || (
					item.startYear && item.endYear &&
					parseInt(item.startYear) > parseInt(item.endYear)),
			});
			if (!result[i].error)
				delete result[i].error;
			else
				error = true;
		}
		this.setState({qualifications: result});
		if (error) {
			return null;
		} else {
			return result.filter(q => 
				q.institute_name.trim() ||
				q.name.trim() ||
				q.startYear.trim() ||
				q.endYear.trim()
			);
		}
	}

	static maritalStatusOptions(__) {
		return [
			{value:'single', label: __('Single')},
			{value:'married', label: __('Married')},
			{value:'divorced', label: __('Divorced')},
			{value:'widow', label: __('Widow')},
		];
	}

	static addressInputNames = {
		cityId: 'cityId',
		stateId: 'stateId',
		countryId: 'countryId',
		address: 'teacherdetail[address]',
	};
}

class ExperienceTable extends React.PureComponent {

	renderItems = (items, update, add, remove) => (
		<Table>
			<thead>
				<tr>
					<td><Text>Institute Name</Text></td>
					<td><Text>Start Date</Text></td>
					<td><Text>End Date</Text></td>
					<td><Text>Remark</Text></td>
					<td><Text>Actions</Text></td>
				</tr>
			</thead>
			<tbody>
				{
					items.map((item, index) =>
						<tr key={item.uid}>
							<td>
								<FormControl
									value={item.institute_name}
									onChange={update(index, 'institute_name')}/>
							</td>
							<td>
								<Datepicker
									datepicker={{
										maxDate: new Date,
									}}
									value={item.start}
									onChange={update(index, 'start')}/>
							</td>
							<td>
								<div className={'relative' + (item.error ? ' has-feedback has-error' : '')}>
									<Datepicker
										datepicker={{
											maxDate: new Date,
										}}
										value={item.end}
										onChange={update(index, 'end')}/>
								</div>
							</td>
							<td>
								<FormControl
									value={item.remark}
									onChange={update(index, 'remark')}/>
							</td>
							<td>
								<Button title={this.props.__('Add')} onClick={add(index)}>
									<Icon glyph='fa-plus'/>
								</Button>
								&nbsp;
								<Button title={this.props.__('Delete')} onClick={remove(index)}>
									<Icon glyph='fa-trash'/>
								</Button>
							</td>
						</tr>
					)
				}
			</tbody>
		</Table>
	);

	render() {
		return (
			<DynamicTable
				items={this.props.items}
				renderer={this.renderItems}
				onChange={this.props.onChange}
				generateItem={this.props.generateItem}/>
		);
	}
}

@connect(state => ({session: state.session}))
class QualificationTable extends React.Component {

	renderItems = (items, update, add, remove) => (
		<Table>
			<thead>
				<tr>
					<td><Text>Institute Name</Text></td>
					<td><Text>Qualification</Text></td>
					<td><Text>Start Year</Text></td>
					<td><Text>End Year</Text></td>
					<td><Text>Document</Text></td>
					<td><Text>Actions</Text></td>
				</tr>
			</thead>
			<tbody>
				{
					items.map((item, index) =>
						<tr key={item.uid}>
							<td>
								<FormControl
									value={item.institute_name}
									onChange={update(index, 'institute_name')}/>
							</td>
							<td>
								<FormControl
									value={item.name}
									onChange={update(index, 'name')}/>
							</td>
							<td>
								<FormControl
									type='number'
									value={item.startYear}
									onChange={update(index, 'startYear')}/>
							</td>
							<td>
								<div className={'relative' + (item.error ? ' has-feedback has-error' : '')}>
									<FormControl
										type='number'
										value={item.endYear}
										onChange={update(index, 'endYear')}/>
									{item.error && <Icon className='form-control-feedback' glyph='fa-times'/>}
								</div>
							</td>
							<td>
								<input
									type='file'
									className='inline'
									style={{width: 180}}
									name={'qualification-image-' + index}/>
								{
									!!item.image &&
									<a
										target='_blank'
										rel='noopener noreferrer'
										href={this.props.session.servicePath + item.image}>
										<Icon glyph='fa-file'/>
									</a>
								}
							</td>
							<td>
								<Button title={this.props.__('Add')} onClick={add(index)}>
									<Icon glyph='fa-plus'/>
								</Button>
								&nbsp;
								<Button title={this.props.__('remove')} onClick={remove(index)}>
									<Icon glyph='fa-trash'/>
								</Button>
							</td>
						</tr>
					)
				}
			</tbody>
		</Table>
	);

	render() {
		return (
			<DynamicTable
				items={this.props.items}
				renderer={this.renderItems}
				onChange={this.props.onChange}
				generateItem={this.props.generateItem}/>
		);
	}
}

class DynamicTable extends React.PureComponent {

	update = (index, name) => event => {
		let items = [...this.props.items];
		items[index][name] = event.currentTarget.value;
		this.setItems(items);
	};

	add = index => () => {
		let items = [...this.props.items];
		items.splice(index + 1, 0, this.props.generateItem());
		this.setItems(items);
	};

	remove = index => () => {
		dialog.confirm({
			message: window.__('Are you absolutely sure you want to delete this?'),
			callback: value => {
				if (! value) return;
				if (this.props.items.length === 1) {
					this.setItems([this.props.generateItem()]);
					return;
				}
				let items = [...this.props.items];
				items.splice(index, 1);
				this.setItems(items);
			}
		});
	};

	render() {
		return this.props.renderer(
			this.props.items,
			this.update,
			this.add,
			this.remove,
		);
	}

	componentDidMount() {
		if (this.props.items.length === 0)
			this.add(-1)();
	}

	setItems (items) {
		this.props.onChange(items);
	}
}

@connect(state => state.view.state.institute || {notReady: true})
class InstituteProfile extends React.Component {

	state = {date_formats: undefined};

	update = event => this.props.dispatch({
		type: 'UPDATE_PROFILE_INSTITUTE_DATA',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = async () => {
		let formData = new FormData(document.getElementById('institute-profile-data'));
		await this.props.dispatch(actions.saveInsituteProfile(formData));
	};

	changePanel = () => this.props.changePanel('f');

	render() {
		let __ = this.props.__;
		return this.props.notReady || (
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Institute Profile</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row componentClass='form' id='institute-profile-data'>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.date_format ? 'error' : null}>
									<ControlLabel><Text>Date Format</Text></ControlLabel>
									<Select
										labelKey='value'
										name='date_format'
										onChange={this.update}
										value={this.props.date_format}
										options={this.state.date_formats}
										isLoading={!this.state.date_formats}/>
									<HelpBlock>{this.props.errors.date_format}</HelpBlock>
								</FormGroup>
								<ControlLabel><Text>Age Limit for Admission</Text></ControlLabel>
								<Row>
									<Col xs={6}>
										<FormGroup validationState={this.props.errors.min_admission_years ? 'error' : null}>
											<FormControl
												type='text'
												onChange={this.update}
												placeholder={__('Years')}
												name='min_admission_years'
												value={this.props.min_admission_years}/>
											<HelpBlock>{this.props.errors.min_admission_years}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={6}>
										<FormGroup validationState={this.props.errors.min_admission_months ? 'error' : null}>
											<FormControl
												type='text'
												onChange={this.update}
												placeholder={__('Months')}
												name='min_admission_months'
												value={this.props.min_admission_months}/>
											<HelpBlock>{this.props.errors.min_admission_months}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
							</Col>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.tagline ? 'error' : null}>
									<ControlLabel><Text>Tag Line</Text></ControlLabel>
									<FormControl
										rows='5'
										name='tagline'
										onChange={this.update}
										componentClass='textarea'
										value={this.props.tagline}/>
									<HelpBlock>{this.props.errors.tagline}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.bank_name ? 'error' : null}>
									<ControlLabel><Text>Bank Name</Text></ControlLabel>
									<FormControl
										name='bank_name'
										onChange={this.update}
										placeholder={__('Bank Name')}
										value={this.props.bank_name}/>
									<HelpBlock>{this.props.errors.bank_name}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.ifsc_code ? 'error' : null}>
									<ControlLabel><Text>IFSC Code</Text></ControlLabel>
									<FormControl
										name='ifsc_code'
										onChange={this.update}
										value={this.props.ifsc_code}
										placeholder={__('IFSC Code')}/>
									<HelpBlock>{this.props.errors.ifsc_code}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.bank_branch ? 'error' : null}>
									<ControlLabel><Text>Bank Branch</Text></ControlLabel>
									<FormControl
										name='bank_branch'
										onChange={this.update}
										value={this.props.bank_branch}
										placeholder={__('Bank Branch')}/>
									<HelpBlock>{this.props.errors.bank_branch}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.account_no ? 'error' : null}>
									<ControlLabel><Text>Account No.</Text></ControlLabel>
									<FormControl
										name='account_no'
										onChange={this.update}
										value={this.props.account_no}
										placeholder={__('Account No.')}/>
									<HelpBlock>{this.props.errors.account_no}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.pan_no ? 'error' : null}>
									<ControlLabel><Text>Pan No.</Text></ControlLabel>
									<FormControl
										name='pan_no'
										onChange={this.update}
										value={this.props.pan_no}
										placeholder={__('Pan No.')}/>
									<HelpBlock>{this.props.errors.pan_no}</HelpBlock>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.bank_challan_charges ? 'error' : null}>
									<ControlLabel><Text>Bank Challan Charges</Text></ControlLabel>
									<FormControl
										onChange={this.update}
										name='bank_challan_charges'
										value={this.props.bank_challan_charges}
										placeholder={__('Bank Challan Charges')}/>
									<HelpBlock>{this.props.errors.bank_challan_charges}</HelpBlock>
								</FormGroup>
							</Col>
							<Clearfix/>
							<Col md={4}>
								<FormGroup validationState={this.props.errors.attendance_type ? 'error' : null}>
									<ControlLabel><Text>Attendance Type</Text></ControlLabel>
									<Select
										name='attendance_type'
										onChange={this.update}
										clearable={false}
										placeholder={__('Attendance Type')}
										value={this.props.attendance_type}
										options={[
											{
												value: 1,
												label: __('Day Wise')
											}, {
												value: 2,
												label: __('Slot Wise')
											}, {
												value: 3,
												label: __('Both')
											}
										]}/>
									<HelpBlock>{this.props.errors.attendance_type}</HelpBlock>
								</FormGroup>
							</Col>
							{
								(this.props.attendance_type === 1 || this.props.attendance_type === 3) &&
								<Col md={4}>
									<FormGroup validationState={this.props.errors.attendance_access ? 'error' : null}>
										<ControlLabel><Text>Who will take day wise attendance</Text></ControlLabel>
										<Select
											name='attendance_access'
											onChange={this.update}
											clearable={false}
											placeholder={__('Attendance Access')}
											value={this.props.attendance_access}
											options={[
												{
													value: 1,
													label: __('Only Class Teacher')
												}, {
													value: 2,
													label: __('All Teachers')
												}
											]}/>
										<HelpBlock>{this.props.errors.attendance_access}</HelpBlock>
									</FormGroup>
								</Col>
							}
							<Clearfix/>
							<Col xs={12}>
								<Button
									bsStyle='primary'
									onClick={this.submit}
									disabled={this.props.saving}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}

	componentDidMount() {
		this.loadDateFormats();
	}

	async loadDateFormats() {
		let {data: {data}} = await api({
			url: '/admin/utils/date-formats'
		});
		this.setState({
			date_formats: data.map(item => ({
				value: item,
			}))
		});
	}
}

@connect(state => state.view.state.digests || {notReady: true})
class Digests extends React.Component {

	update = event => this.props.dispatch({
		type: 'UPDATE_DIGEST_INTERVAL',
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget),
	});

	submit = async () => {
		await this.props.dispatch(actions.saveDigests(this.props));
	};

	changePanel = () => this.props.changePanel('g');

	render() {
		return this.props.notReady || (
			<Panel
				bsStyle='primary'
				onToggle={this.changePanel}
				expanded={this.props.expanded}>
				<Panel.Toggle componentClass={Panel.Heading}>
					<Panel.Title>
						<Text>Digests</Text>
					</Panel.Title>
				</Panel.Toggle>
				<Panel.Collapse>
					<Panel.Body>
						<Row>
							{
								this.props.items.map((item, index) =>
									<React.Fragment key={item.model}>
										<Col md={4}>
											<FormGroup>
												<ControlLabel>
													<Text>{item.label}</Text>
												</ControlLabel>
												<Select
													clearable={false}
													name={item.model}
													onChange={this.update}
													value={item.interval}
													options={getDigestIntervalOptions()}/>
											</FormGroup>
										</Col>
										{index % 2 === 1 && <Clearfix/>}
									</React.Fragment>
								)
							}
						</Row>
						<Button disabled={this.props.saving} bsStyle='primary' onClick={this.submit}>
							<Text>Submit</Text>
						</Button>
					</Panel.Body>
				</Panel.Collapse>
			</Panel>
		);
	}
}