import React from 'react';
import url from 'url';
import moment from 'moment';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
	dialog,
} from '../utils';

import {
	getGender,
	getSalutation,
} from '../utils/options';

import {
	Row,
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	Form,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Datepicker,
	Checkbox,
	FormControl,
	InputGroup,
	Modal,
	Loading,
	ClickButton,
	Pagination,
	ServiceImage,
	Panel,
	AddressInput,
} from '../components';

import SMSInput from '../components/SMSInput';
import EmailInput from '../components/EmailInput';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/teacher';
import * as actions from '../redux/actions/teacher';
addView('teacher', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Teacher extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'teacher');

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

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

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
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Teacher?'),
		});
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	save = () => {
		if (!this.props.item.id) {
			this.props.dispatch(actions.save(this.props));
			return;
		}

		let formData = new FormData(document.getElementById('teacher-data-form'));
		let errors = validateQualifications(this.props.item.qualifications);
		errors = errors || validateExperieces(this.props.item.experiences);
		this.props.dispatch(
			actions.setTableErrors(
				this.props.item.qualifications,
				this.props.item.experiences
			)
		);
		if (errors) return;
		formData.append(
			'teacher_detail[qualifications]',
			JSON.stringify(
				this.props.item.qualifications.filter(
					q => 
						q.institute_name.trim() ||
						q.name.trim() ||
						q.startYear.trim() ||
						q.endYear.trim()

				)
			)
		);
		formData.append(
			'teacher_detail[experiences]',
			JSON.stringify(
				this.props.item.experiences.filter(
					e =>
						e.institute_name.trim() ||
						e.remark.trim() ||
						e.start ||
						e.end
				)
					.map(e => ({
						...e,
						start: e.start ? e.start: '',
						end: e.end ? e.end : '',
					}))
			)
		);

		this.props.dispatch(actions.save(this.props, formData));
	};

	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};

	toggleOne = event => {
		let index = parseInt(event.currentTarget.getAttribute('data-index'));
		this.props.dispatch({
			type: 'TOGGLE_TEACHER_SELECTION',
			index,
			value: event.currentTarget.checked,
		});
	};

	toggleAll = event => this.props.dispatch({
		type: 'TOGGLE_ALL_TEACHER_SELECTION',
		value: event.currentTarget.checked,
	});

	emptySelection = () => {
		for (let i = this.props.items.length - 1; i >= 0; i--) {
			if (this.props.items[i].selected)
				return false;
		}
		return true;
	};

	clearSelection = () => this.props.dispatch(actions.clearSelection());
	sendSMS = formData => this.props.dispatch(actions.sendSMS(this.props, formData));
	sendEmail = formData => this.props.dispatch(actions.sendEmail(this.props, formData));
	sendLoginInfo = event => this.props.dispatch(
		actions.sendLoginInfo(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
		)
	);
	viewSubjects = event => this.props.dispatch(
		actions.viewSubjects(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
		)
	);
	hideSubjects = () => this.props.dispatch(actions.hideSubjects());

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.meta.formType === 'EDIT') return this.renderEditForm();

		const firstTime = this.props.pageInfo.totalData === 0 &&
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
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<Modal.Title>
								<Text>Add Teacher</Text>
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<Row>
									<Col md={4}>
										<FormGroup
											controlId='salutation'
											validationState={this.props.errors.salutation ? 'error': null}>
											<ControlLabel>{__('Salutation')}</ControlLabel>
											<Select
												name='salutation'
												placeholder={__('Salutation')}
												onChange={this.updateData}
												value={this.props.item.salutation}
												options={getSalutation(__)}/>
											<HelpBlock>{this.props.errors.salutation}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={8}>
										<FormGroup
											controlId='name'
											validationState={this.props.errors.fullname ? 'error': null}>
											<ControlLabel><Text>Name</Text></ControlLabel>
											<FormControl
												autoFocus
												name='name'
												type='text'
												placeholder={__('Name')}
												value={this.props.item.name}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.fullname}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='email'
											validationState={this.props.errors.email ? 'error': null}>
											<ControlLabel><Text>Email</Text></ControlLabel>
											<FormControl
												name='email'
												type='text'
												placeholder={__('Email')}
												value={this.props.item.email}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.email}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='mobile'
											validationState={this.props.errors.mobile ? 'error': null}>
											<ControlLabel><Text>Mobile</Text></ControlLabel>
											<FormControl
												name='mobile'
												type='text'
												placeholder={__('Mobile')}
												value={this.props.item.mobile}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.mobile}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col xs={12}>
										<FormGroup
											controlId='subjects'
											validationState={this.props.errors.subjectId ? 'error': null}>
											<ControlLabel><Text>Subjects</Text></ControlLabel>
											<Select
												multi
												name='subjects'
												placeholder={__('Subjects')}
												value={this.props.item.subjects}
												onChange={this.updateData}
												options={this.props.meta.subjects}/>
											<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md={6}>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
											<ControlLabel><Text>Status</Text></ControlLabel>
										</Checkbox>
									</Col>
									<Col md={6} className='text-right'>
										<Button
											onClick={this.save}
											bsStyle='primary'>
											<Text>Submit</Text>
										</Button>
									</Col>
								</Row>
							</React.Fragment>
						}
					</Modal.Body>
				</Modal>
				<Modal
					onHide={this.hideSubjects}
					show={this.props.subjects !== false}>
					<Modal.Header closeButton>
						<Modal.Title><Text>Subjects</Text></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.subjects === null && <Loading/>}
						{
							this.props.subjects && (
								this.props.subjects.length === 0 ?
								<Text>No Result Found</Text> : 
								<ul>
									{
										this.props.subjects.map((subject, index) => 
											<li key={index}>{subject}</li>
										)
									}
								</ul>
							)
						}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.hideSubjects}>
							<Text>Close</Text>
						</Button>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Teacher</Text></h3>
						<p>
							<Text>
								A teacher is a person who helps others to acquire knowledge.
							</Text>
						</p>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Teacher'
						glyph='fa-plus'
						side='left'
						onClick={this.startAdd}/>
				}
			</div>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-5'>
								<input
									type='checkbox'
									onChange={this.toggleAll}
									checked={this.props.meta.allSelected || false}/>
							</td>
							<td className='tw-8'>
								<Text>Status</Text>
							</td>
							<td className='tw-22'>
								<Text>Name</Text>
							</td>
							<td className='tw-25'>
								<Text>Email</Text>
							</td>
							<td className='tw-15'>
								<Text>Mobile</Text>
							</td>
							<td className='tw-15'>
								<Text>User Name</Text>
							</td>
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

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAdd}>
						<Text>Add New</Text>
					</View.Action>
				}
				{
					this.permissions.sendsms &&
					<SMSInput onSubmit={this.sendSMS} onCancel={this.clearSelection} disabled={this.emptySelection}/>
				}
				{
					this.permissions.sendemail &&
					<EmailInput onSubmit={this.sendEmail} onCancel={this.clearSelection} disabled={this.emptySelection}/>
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={6}/>;
		}

		return this.props.items.map((item, index) => (
			<tr key={item.user.id}>
				<td className='tw-5'>
					<input
						type='checkbox'
						data-index={index}
						onChange={this.toggleOne}
						checked={item.selected || false}/>
				</td>
				<td className='tw-8'>
					<Checkbox
						inline
						title={getStatusTitle(item.user.is_active, __)}
						onChange={this.changeStatus}
						data-item-id={item.user.id}
						data-item-status={item.user.is_active}
						disabled={!this.permissions.status}
						value={item.user.is_active}/>
				</td>
				<td className='tw-22'>{item.user.userdetails[0].fullname}</td>
				<td className='tw-25'>{item.user.email}</td>
				<td className='tw-15'>{item.user.mobile}</td>
				<td className='tw-15'>{item.user.user_name}</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.user.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.user.id}/>
						}
						{
							this.permissions.sendsms &&
							<DataTable.Action
								glyph='fa-envelope'
								text='Send Login Info'
								onClick={this.sendLoginInfo}
								data-item-id={item.id}/>
						}
						<DataTable.Action
							glyph='fa-book'
							text='View Subjects'
							onClick={this.viewSubjects}
							data-item-id={item.id}/>
					</DataTable.Actions>
				</td>
			</tr>
		));
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
					name='userdetail__fullName'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullName', '')} />
				<FormControl
					type='text'
					title={__('Email')}
					placeholder={__('Email')}
					name='user__email'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__email', '')} />	
				<FormControl
					type='text'
					title={__('Mobile')}
					placeholder={__('Mobile')}
					name='user__mobile'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__mobile', '')} />
				<FormControl
					type='text'
					title={__('User Name')}
					placeholder={__('User Name')}
					name='user__user_name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__user_name', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='user__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderEditForm() {
		let __ = window.__;
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.reset} title={__('View List')}>
						<Text>View List</Text>
					</View.Action>
				</View.Actions>
			}>
				{this.props.item === null && <Loading />}
				{
					this.props.item &&
					<Form id='teacher-data-form'>
						<input type='hidden' name='id' value={this.props.item.id}/>
						<input type='hidden' name='teacher[id]' value={this.props.item['teacher[id]']}/>
						<input type='hidden' name='user_image' value={this.props.item.user_image}/>
						<input type='hidden' name='teacher_detail[id]' value={this.props.item['teacher_detail[id]']}/>
						<Panel>
							<Panel.Heading>
								<Panel.Title>
									<Text options={{module: 'Teacher', lang: 'English'}}>
										Please enter [[module]] information in [[lang]]
									</Text>
								</Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<Row>
									<Col md={3}>
										<FormGroup
											controlId='salutation'
											validationState={this.props.errors.salutation ? 'error': null}>
											<ControlLabel>{__('Salutation')}</ControlLabel>
											<Select
												name='salutation'
												placeholder={__('Please Select Salutation')}
												onChange={this.updateData}
												value={this.props.item.salutation}
												options={getSalutation(__)}/>
											<HelpBlock>{this.props.errors.salutation}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={9}>
										<FormGroup
											controlId='fullname'
											validationState={this.props.errors.fullname ? 'error': null}>
											<ControlLabel>{__('Name')}</ControlLabel>
											<FormControl
												name='user_detail[fullname]'
												placeholder={__('Name')}
												onChange={this.updateData}
												value={this.props.item['user_detail[fullname]']}/>
											<HelpBlock>{this.props.errors.fullname}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='gender'
											validationState={this.props.errors.gender ? 'error': null}>
											<ControlLabel>{__('Gender')}</ControlLabel>
											<Select
												name='teacher[gender]'
												placeholder={__('Please Select Gender')}
												onChange={this.updateData}
												value={this.props.item['teacher[gender]']}
												options={getGender(__)}/>
											<HelpBlock>{this.props.errors.gender}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='marital_status'
											validationState={this.props.errors.marital_status ? 'error': null}>
											<ControlLabel>{__('Marital Status')}</ControlLabel>
											<Select
												name='teacher[marital_status]'
												placeholder={__('Please Select Marital Status')}
												onChange={this.updateData}
												value={this.props.item['teacher[marital_status]']}
												options={Teacher.maritalStatusOptions(__)}/>
											<HelpBlock>{this.props.errors.marital_status}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<AddressInput
									__={__}
									value={this.props.item.address}
									errors={this.props.errors.address}
									names={Teacher.addressInputNames}/>
							</Panel.Body>
						</Panel>
						<Panel>
							<Panel.Heading>
								<Panel.Title>
									<Text>Qualification And Experience</Text>
								</Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<h3 style={{marginTop: 0}}>{__('Qualification')}</h3>
								<table className='table'>
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
									<tbody>{this.renderQualifications()}</tbody>
								</table>
								<h3 style={{marginTop: 0}}>{__('Experience')}</h3>
								<table className='table'>
									<thead>
										<tr>
											<td><Text>Institute Name</Text></td>
											<td><Text>Start Date</Text></td>
											<td><Text>End Date</Text></td>
											<td><Text>Remark</Text></td>
											<td><Text>Actions</Text></td>
										</tr>
									</thead>
									<tbody>{this.renderExperiences()}</tbody>
								</table>
							</Panel.Body>
						</Panel>
						<Panel>
							<Panel.Heading>
								<Panel.Title>
									<Text>General Information</Text>
								</Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<Row>
									<Col xs={6}>
										<FormGroup
											controlId='subjects'
											validationState={this.props.errors.subjectId ? 'error': null}>
											<ControlLabel>{__('Subject Specializations')}</ControlLabel>
											<Select
												multi
												name='teacher[subjectId]'
												placeholder={__('Please Select Subjects')}
												onChange={this.updateData}
												value={this.props.item['teacher[subjectId]']}
												options={this.props.meta.subjects}/>
											<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={6}>
										<FormGroup
											controlId='mobile'
											validationState={this.props.errors.mobile ? 'error': null}>
											<ControlLabel>{__('Mobile')}</ControlLabel>
											<FormControl
												name='mobile'
												placeholder={__('Mobile')}
												onChange={this.updateData}
												value={this.props.item.mobile}/>
											<HelpBlock>{this.props.errors.mobile}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col xs={6}>
										<FormGroup
											controlId='email'
											validationState={this.props.errors.email ? 'error': null}>
											<ControlLabel>{__('Email')}</ControlLabel>
											<FormControl
												name='email'
												placeholder={__('Email')}
												onChange={this.updateData}
												value={this.props.item.email}/>
											<HelpBlock>{this.props.errors.email}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={6}>
										<FormGroup
											controlId='password'
											validationState={this.props.errors.password ? 'error': null}>
											<ControlLabel>{__('Password')}</ControlLabel>
											{
												this.props.item.id ?
												<InputGroup>
													<FormControl
														type='password'
														placeholder={__('Password')}
														name='password'
														onChange={this.updateData}
														value={this.props.item.password}
														disabled={!this.props.item.editablePassword}/>
													<InputGroup.Addon>
														<input
															type="checkbox"
															checked={this.props.item.editablePassword}
															onChange={this.updateData}
															name='editablePassword'/>
													</InputGroup.Addon>
												</InputGroup> :
												<FormControl
													type='password'
													placeholder={__('Password')}
													name='password'
													onChange={this.updateData}
													value={this.props.item.password}/>
											}
											<HelpBlock>{this.props.errors.password}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col xs={6}>
										<FormGroup
											controlId='join_date'
											validationState={this.props.errors.join_date ? 'error': null}>
											<ControlLabel>{__('Date Of Join')}</ControlLabel>
											<Datepicker
												datepicker={{
													maxDate: new Date(),
												}}
												value={this.props.item['teacher[join_date]']}
												onChange={this.updateData}
												name='teacher[join_date]'
												placeholder={__('Date Of Join')}/>
											<HelpBlock>{this.props.errors.join_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={6}>
										<FormGroup
											controlId='dob'
											validationState={this.props.errors.dob ? 'error': null}>
											<ControlLabel>{__('Date Of Birth')}</ControlLabel>
											<Datepicker
												datepicker={{
													maxDate: new Date(),
												}}
												value={this.props.item['teacher[dob]']}
												onChange={this.updateData}
												name='teacher[dob]'
												placeholder={__('Date Of Birth')}/>
											<HelpBlock>{this.props.errors.dob}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col sm={12}>
										<FormGroup
											controlId='user_image'
											validationState={this.props.errors.user_image ? 'error': null}>
											<ControlLabel>{__('Profile Image')}</ControlLabel>
											<FormControl name='user_image' type='file'/>
											<HelpBlock>{this.props.errors.user_image}</HelpBlock>
										</FormGroup>
									</Col>
									{
										!!this.props.item.id &&
										<Col sm={12}>
											<ServiceImage
												src={this.props.item.user_image}
												width='96'
												height='96'
												className='img-rounded'/>
										</Col>
									}
								</Row>
							</Panel.Body>
						</Panel>
						<div>
							<Checkbox
								name='is_active'
								onChange={this.updateData}
								value={this.props.item.is_active}>
								<ControlLabel>
									<Text>Status</Text>
								</ControlLabel>
							</Checkbox>
						</div>
						<Button onClick={this.hideDataModal}>
							<Text>Cancel</Text>
						</Button>
						{' '}
						<Button
							onClick={this.save}
							bsStyle='primary'>
							<Text>Submit</Text>
						</Button>
					</Form>
				}
			</View>
		);
	}

	renderQualifications() {
		let __ = window.__;
		return this.props.item.qualifications.map(
			(item, index) => 
				<tr key={index}>
					<td>
						<FormControl
							value={item.institute_name}
							placeholder={__('Institute Name')}
							onChange={
								event => this.updateTableData({
									name: 'institute_name',
									table: 'qua',
									index
								}, event.currentTarget.value)
							}/>
					</td>
					<td>
						<FormControl
							value={item.name}
							placeholder={__('Qualification')}
							onChange={
								event => this.updateTableData({
									name: 'name',
									table: 'qua',
									index
								}, event.currentTarget.value)
							}/>
					</td>
					<td>
						<FormControl
							value={item.startYear}
							type='number'
							placeholder={__('Start Year')}
							onChange={
								event => this.updateTableData({
									name: 'startYear',
									table: 'qua',
									index
								}, event.currentTarget.value)
							}/>
					</td>
					<td>
						<FormGroup
							style={{marginBottom: 0}}
							validationState={item.error ?  'error': null}>
							<FormControl
								placeholder={__('End Year')}
								value={item.endYear}
								type='number'
								onChange={
									event => this.updateTableData({
										name: 'endYear',
										table: 'qua',
										index
									}, event.currentTarget.value)
								}
							/>
							{item.error && <FormControl.Feedback />}
						</FormGroup>
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
					{this.renderActionButtons(index, 'qua')}
				</tr>
		);
	}

	renderExperiences() {
		let __ = window.__;
		return this.props.item.experiences.map(
			(item, index) => 
				<tr key={index}>
					<td>
						<FormControl
							value={item.institute_name}
							placeholder={__('Institute Name')}
							onChange={
								event => this.updateTableData({
									name: 'institute_name',
									table: 'exp',
									index
								}, event.currentTarget.value)
							}/>
					</td>
					<td style={{position: 'relative'}}>
						<Datepicker
							placeholder={__('Start Date')}
							datepicker={{
								maxDate: new Date(),
							}}
							onChange={
								event => this.updateTableData({
									name: 'start',
									table: 'exp',
									index
								}, event.currentTarget.value)
							}
							value={item.start}
							name={'exp-start-date-' + index}/>
					</td>
					<td style={{position: 'relative'}}>
						<FormGroup
							style={{marginBottom: 0}}
							validationState={item.error ? 'error' : null}>
							<Datepicker
								placeholder={__('End Date')}
								datepicker={{
									maxDate: new Date(),
								}}
								onChange={
									event => this.updateTableData({
										name: 'end',
										table: 'exp',
										index
									}, event.currentTarget.value)
								}
								value={item.end}
								name={'exp-end-date-' + index}/>
							{item.error && <FormControl.Feedback />}
						</FormGroup>
					</td>
					<td>
						<FormControl
							placeholder={__('Remark')}
							value={item.remark}
							onChange={
								event => this.updateTableData({
									name: 'remark',
									table: 'exp',
									index
								}, event.currentTarget.value)
							}/>
					</td>
					{this.renderActionButtons(index, 'exp')}
				</tr>
		);
	}

	renderActionButtons(index, type) {
		return (
			<td>
				<Button title={window.__('Add')} onClick={() => this.updateTable(type, index, 'ADD')}>
					<Icon glyph='fa-plus'/>
				</Button>
				&nbsp;
				<Button title={window.__('Delete')} onClick={() => this.updateTable(type, index, 'DELETE')}>
					<Icon glyph='fa-trash'/>
				</Button>
			</td>
		);
	}

	updateTable(table, index, action) {
		if(action === 'DELETE'){
			dialog.confirm({
				message: 'Are you absolutely sure you want to delete this?',
				callback: (value) => {
					if (value) {
						this.props.dispatch(actions.updateTable(table, index, action));
					}
				}
			});
		} else {
			this.props.dispatch(actions.updateTable(table, index, action));
		}
	}

	updateTableData(info, value) {
		this.props.dispatch(actions.updateTableData(info, value));
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
		countryId: 'teacher[countryId]',
		stateId: 'teacher[stateId]',
		cityId: 'teacher[cityId]',
		address: 'teacher_detail[address]',
	};
}

function validateExperieces(experiences) {
	let error = false;
	for (let i = experiences.length - 1; i >= 0; i--) {
		if (experiences[i].start && experiences[i].end &&
				moment(experiences[i].start, 'YYYY-MM-DD').isSameOrAfter(moment(experiences[i].end, 'YYYY-MM-DD')))
			experiences[i].error = error = true;
		else
			delete experiences[i].error;
	}
	return error;
}

function validateQualifications(qualifications) {
	let error = false, year = new Date().getFullYear();
	for (let i = qualifications.length - 1; i >= 0; i--) {
		qualifications[i].display_order = i;
		if ((qualifications[i].startYear && qualifications[i].endYear) &&
				((parseInt(qualifications[i].startYear) > parseInt(qualifications[i].endYear))
					|| (parseInt(qualifications[i].endYear) > year)))
			qualifications[i].error = error = true;
		else
			qualifications[i].error = false;
	}
	return error;
}