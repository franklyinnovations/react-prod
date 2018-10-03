import React from 'react';
import url from 'url';
import moment from 'moment';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
	messenger
} from '../utils';

import {
	getGender,
	getBloodGroup,
	getResCategory,
} from '../utils/options';

import {
	Grid,
	Row,
	Col,
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
	Pagination,
	ServiceImage,
	Panel,
	Notification,
	BCheckbox,
	Tabs,
	Tab
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/student';
import * as actions from '../redux/actions/student';
addView('student', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class Student extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'student');

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
			message: window.__('Are you sure you want to delete this Student?'),
		});
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

	handleDataUpdate = event => this.updateData(
		event.currentTarget.name,
		getInputValue(event.currentTarget)
	);

	handleDiscountUpdate = event => this.props.dispatch(
		actions.updateDiscountData(
			event.currentTarget.name,
			getInputValue(event.currentTarget)
		)
	);

	handleEdit = event => this.props.dispatch(
		actions.edit(
			this.props,
			event.currentTarget.getAttribute('data-item-id')
		)
	);

	sendLoginInfo = event => this.props.dispatch(
		actions.sendLoginInfo(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
		)
	);

	startAddNew = () => {
		this.props.dispatch(
			actions.startAdd(this.props)
		);
	};

	viewList = () => {
		this.props.dispatch(
			actions.viewList()
		);
	};

	save = () => {
		let data = new FormData(document.getElementById('studentaddform'));
		this.props.dispatch(
			actions.save(
				this.props,
				data
			)
		);
	};

	//---Notification modal-----
	handleNotificationModal = event => {
		if(this.props.notification.selectedIds.length > 0){
			this.props.dispatch(
				actions.notificationModal(
					event.currentTarget.getAttribute('data-modal')
				)
			);
		} else {
			vex.dialog.alert('No one is selected');
		}
	};

	handleCheckbox = event => {
		let id;
		if(event.currentTarget.getAttribute('data-item-id') === 'all' && event.currentTarget.checked){
			id = this.props.items.map(item => item.id);
			id.push('all');
		} else {
			id = [];
		}
		if(event.currentTarget.getAttribute('data-item-id') !== 'all'){
			id = event.currentTarget.getAttribute('data-item-id');
		}
		this.props.dispatch({
			type: 'UPDATE_CHECKBOX_STUDENT',
			id: id
		});
	};

	update = event => this.props.dispatch(
		actions.update(
			event.currentTarget.getAttribute('data-action-type'),
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);

	showExportDataModal = () => this.props.dispatch(
		actions.showExportDataModal()
	);

	hideExportDataModal = () => this.props.dispatch(
		actions.hideExportDataModal()
	);

	exportData = () => {
		if (this.props.selector.bcsMapId === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please select class'),
			});
			return;
		}
		this.props.dispatch(actions.exportData(this.props));
	};

	handleTabNext = event => {
		let activateKey = parseInt(event.currentTarget.getAttribute('data-tab-key'));
		let currentKey = parseInt(event.currentTarget.getAttribute('data-tab-currkey'));
		this.props.dispatch(
			actions.proceedNextStep(
				this.props,
				activateKey,
				currentKey
			)
		);
	};

	handleTabBack = event => {
		let activateKey = parseInt(event.currentTarget.getAttribute('data-tab-key'));
		this.props.dispatch({
			type: 'ACTIVATE_TAB',
			activateKey
		});
	};

	changeTab = activateKey => {
		if(this.props.item.id){
			this.props.dispatch(
				actions.proceedNextStep(
					this.props,
					activateKey,
					this.props.tabbing.activateKey
				)
			);
		}else{
			vex.dialog.alert('Please fill all necessary details and click on next to proceed.');
		}
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);

		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
				<Modal
					backdrop='static'
					show={this.props.selector.show}
					onHide={this.hideExportDataModal}>
					<Modal.Header closeButton>
						<Modal.Title>{__('Export Student Record')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<ControlLabel>{__('Class')}</ControlLabel>
							<Select
								placeholder={__('Please Select Class')}
								options={this.props.helperData.bcsmaps}
								className='form-control'
								onChange={this.update}
								name='bcsMapId'
								data-action-type='UPDATE_STUDENT_EXPORT_DATA_SELECTOR'
								value={this.props.selector.bcsMapId}/>
							<HelpBlock></HelpBlock>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={this.props.selector.loading}
							bsStyle='primary'
							onClick={this.exportData}>
							{__('Export')}
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					className='student-popup'
					bsSize='lg'
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Student</Text> :
									<Text>Add Student</Text>
								}
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<div className='module-form module-padding'>
								<Form id="studentaddform">
									<input type="hidden" name="id" value={this.props.item.id}/>
									<input type="hidden" name="student[id]" value={this.props.item.studentId}/>
									<input type="hidden" name="studentdetails[id]" value={this.props.item.studentdetailId} />
									<input type="hidden" name="roleId" value={this.props.helperData.roleId} />
									<input type="hidden" name="studentrecords[id]" value={this.props.item.studentrecordsId} />
									<Tabs
										onSelect={this.changeTab}
										activeKey={this.props.tabbing.activateKey}
										className='add-studenat-tab-content' 
										id="controlled-tab-example">
										<Tab eventKey={1} title={__('Official Details')}>
											<Grid fluid>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='bcsMapId'
															validationState={this.props.errors.bcsMapId ? 'error': null}
														>
															<ControlLabel>{__('Class')}</ControlLabel>
															<Select
																className='form-control'
																name="studentrecords[bcsMapId]"
																placeholder={__('Please Select Class')}
																onChange={this.handleDataUpdate}
																value={this.props.item['studentrecords[bcsMapId]']}
																options={this.props.helperData.bcsmaps}
																disabled={!!this.props.item.id}
															/>
															<HelpBlock>{this.props.errors.bcsMapId}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='enrollment_no'
															validationState={this.props.errors.enrollment_no ? 'error': null}
														>
															<ControlLabel>{__('Enrollment Number')}</ControlLabel>
															<FormControl
																placeholder={__('Enrollment Number')}
																name='student[enrollment_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[enrollment_no]']}
															/>
															<HelpBlock>{this.props.errors.enrollment_no}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='roll_no'
															validationState={this.props.errors.roll_no ? 'error': null}
														>
															<ControlLabel>{__('Roll Number')}</ControlLabel>
															<FormControl
																placeholder={__('Roll Number')}
																name='studentrecords[roll_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentrecords[roll_no]']}
															/>
															<HelpBlock>{this.props.errors.roll_no}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='form_no'
															validationState={this.props.errors.form_no ? 'error': null}
														>
															<ControlLabel>{__('Form Number')}</ControlLabel>
															<FormControl
																placeholder={__('Form Number')}
																name='student[form_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[form_no]']}
															/>
															<HelpBlock>{this.props.errors.form_no}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='fee_receipt_no'
															validationState={this.props.errors.fee_receipt_no ? 'error': null}
														>
															<ControlLabel>{__('Fee Receipt Number')}</ControlLabel>
															<FormControl
																placeholder={__('Fee Receipt Number')}
																name='student[fee_receipt_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[fee_receipt_no]']}
															/>
															<HelpBlock>{this.props.errors.fee_receipt_no}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='doa'
															validationState={this.props.errors.doa ? 'error': null}
														>
															<ControlLabel>{__('Admission Date')}</ControlLabel>
															<Datepicker
																datepicker={{
																	maxDate: new Date(),
																}}
																placeholder={__('Admission Date')}
																value={this.props.item['student[doa]']}
																onChange={this.handleDataUpdate}
																name='student[doa]'/>
															<HelpBlock>{this.props.errors.doa}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabNext}
															data-tab-key={2}
															data-tab-currkey={1}
														>
															<Text>Next</Text>
														</Button>
													</Col>
												</Row>
											</Grid>	
										</Tab>
										<Tab eventKey={2} title={__('Personal Details')}>
											<Grid fluid>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='fullname'
															validationState={this.props.errors.fullname ? 'error': null}
														>
															<ControlLabel>{__('Full Name')}</ControlLabel>
															<FormControl
																placeholder={__('Full Name')}
																name='userdetails[fullname]'
																onChange={this.handleDataUpdate}
																value={this.props.item['userdetails[fullname]']}
															/>
															<HelpBlock>{this.props.errors.fullname}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='gender'
															validationState={this.props.errors.gender ? 'error': null}
														>
															<ControlLabel>{__('Gender')}</ControlLabel>
															<Select
																className='form-control'
																name="student[gender]"
																placeholder={__('Please Select Gender')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[gender]']}
																options={getGender(__)}
															/>
															<HelpBlock>{this.props.errors.gender}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='mobile'
															validationState={this.props.errors.mobile ? 'error': null}
														>
															<ControlLabel>{__('Mobile Number')}</ControlLabel>
															<FormControl
																placeholder={__('Mobile Number')}
																name='mobile'
																onChange={this.handleDataUpdate}
																value={this.props.item.mobile}
															/>
															<HelpBlock>{this.props.errors.mobile}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='email'
															validationState={this.props.errors.email ? 'error': null}
														>
															<ControlLabel>{__('Email')}</ControlLabel>
															<FormControl
																placeholder={__('Email')}
																name='email'
																onChange={this.handleDataUpdate}
																value={this.props.item.email}
															/>
															<HelpBlock>{this.props.errors.email}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='password'
															validationState={this.props.errors.password ? 'error': null}
														>
															<ControlLabel>{__('Password')}</ControlLabel>
															{this.props.item.id ? 
															<InputGroup>
																<FormControl
																	type='password'
																	placeholder={__('Password')}
																	name='password'
																	onChange={this.handleDataUpdate}
																	value={this.props.item.password}
																	disabled={!this.props.item.editablePassword}
																/>
																<InputGroup.Addon>
																	<input
																		type="checkbox"
																		checked={this.props.item.editablePassword}
																		onChange={this.handleDataUpdate}
																		name='editablePassword'
																	/>
																</InputGroup.Addon>
															</InputGroup> :
															<FormControl
																type='password'
																placeholder='Password'
																name='password'
																onChange={this.handleDataUpdate}
																value={this.props.item.password}
															/>
															}
															<HelpBlock>{this.props.errors.password}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='dob'
															validationState={this.props.errors.dob ? 'error': null}
														>
															<ControlLabel>{__('Date of Birth')}</ControlLabel>
															<Datepicker
																datepicker={{
																	maxDate: new Date(),
																}}
																placeholder={__('Date of Birth')}
																value={this.props.item['student[dob]']}
																onChange={this.handleDataUpdate}
																name='student[dob]'/>
															<HelpBlock>{this.props.errors.dob}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={3}>
														<FormGroup
															controlId='age'
															validationState={this.props.errors.age ? 'error': null}
														>
															<ControlLabel>{__('Age')}</ControlLabel>
															<FormControl
																type='text'
																placeholder={__('Age')}
																value={calculateAge(moment(this.props.item['student[dob]'], this.props.session.userdetails.date_format).format('YYYY-MM-DD'), __)}
																name='age'
																readOnly
															/>
															<HelpBlock>{this.props.errors.age}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='birthplace'
															validationState={this.props.errors.birhplace ? 'error': null}
														>
															<ControlLabel>{__('Place of Birth')}</ControlLabel>
															<FormControl
																placeholder={__('Place of Birth')}
																name='studentdetails[birthplace]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[birthplace]']}
															/>
															<HelpBlock>{this.props.errors.birhplace}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='religion'
															validationState={this.props.errors.religion ? 'error': null}
														>
															<ControlLabel>{__('Religion')}</ControlLabel>
															<FormControl
																placeholder={__('Religion')}
																name='studentdetails[religion]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[religion]']}
															/>
															<HelpBlock>{this.props.errors.religion}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='nationality'
															validationState={this.props.errors.nationality ? 'error': null}
														>
															<ControlLabel>{__('Nationality')}</ControlLabel>
															<FormControl
																placeholder={__('Nationality')}
																name='studentdetails[nationality]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[nationality]']}
															/>
															<HelpBlock>{this.props.errors.nationality}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12}>
														<h4>{__('Communication Address')}</h4>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='countryId'
															validationState={this.props.errors.countryId ? 'error': null}
														>
															<ControlLabel>{__('Country')}</ControlLabel>
															<Select
																className='form-control'
																name="student[countryId]"
																placeholder={__('Please Select Country')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[countryId]']}
																options={this.props.helperData.countries}
															/>
															<HelpBlock>{this.props.errors.countryId}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='stateId'
															validationState={this.props.errors.stateId ? 'error': null}
														>
															<ControlLabel>{__('State')}</ControlLabel>
															<Select
																className='form-control'
																name="student[stateId]"
																placeholder={__('Please Select State')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[stateId]']}
																isLoading={this.props.helperData.loadingStates}
																options={this.props.helperData.states}
															/>
															<HelpBlock>{this.props.errors.stateId}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='cityId'
															validationState={this.props.errors.cityId ? 'error': null}
														>
															<ControlLabel>{__('City')}</ControlLabel>
															<Select
																className='form-control'
																name="student[cityId]"
																placeholder={__('Please Select City')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[cityId]']}
																isLoading={this.props.helperData.loadingCities}
																options={this.props.helperData.cities}
															/>
															<HelpBlock>{this.props.errors.cityId}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='address'
															validationState={this.props.errors.address ? 'error': null}
														>
															<ControlLabel>{__('Address')}</ControlLabel>
															<FormControl
																componentClass='textarea'
																rows='5'
																placeholder={__('Address')}
																name='studentdetails[address]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[address]']}
															/>
															<HelpBlock>{this.props.errors.address}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='zip_code'
															validationState={this.props.errors.zip_code ? 'error': null}
														>
															<ControlLabel>{__('Zip Code')}</ControlLabel>
															<FormControl
																placeholder={__('Zip Code')}
																name='student[zip_code]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[zip_code]']}
															/>
															<HelpBlock>{this.props.errors.zip_code}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12}>
														<h4>{__('Permanent Address')}</h4>
														<FormGroup controlId='same_as_comm_add'>
															<BCheckbox
																name='student[same_as_comm_add]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[same_as_comm_add]']}
																value='1'
															>
																{__('Same as communication address')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<Row style={{display:this.props.item['student[same_as_comm_add]'] ? 'none' : 'block'}}>
													<Col md={6}>
														<FormGroup
															controlId='countryId_2'
															validationState={this.props.errors.countryId_2 ? 'error': null}
														>
															<ControlLabel>{__('Country')}</ControlLabel>
															<Select
																className='form-control'
																name="student[countryId_2]"
																placeholder={__('Please Select Country')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[countryId_2]']}
																options={this.props.helperData.countries}
															/>
															<HelpBlock>{this.props.errors.countryId_2}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='stateId_2'
															validationState={this.props.errors.stateId_2 ? 'error': null}
														>
															<ControlLabel>{__('State')}</ControlLabel>
															<Select
																className='form-control'
																name="student[stateId_2]"
																placeholder={__('Please Select State')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[stateId_2]']}
																isLoading={this.props.helperData.loadingStates2}
																options={this.props.helperData.states2}
															/>
															<HelpBlock>{this.props.errors.stateId_2}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='cityId_2'
															validationState={this.props.errors.cityId_2 ? 'error': null}
														>
															<ControlLabel>{__('City')}</ControlLabel>
															<Select
																className='form-control'
																name="student[cityId_2]"
																placeholder={__('Please Select City')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[cityId_2]']}
																isLoading={this.props.helperData.loadingCities2}
																options={this.props.helperData.cities2}
															/>
															<HelpBlock>{this.props.errors.cityId_2}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='address_2'
															validationState={this.props.errors.address_2 ? 'error': null}
														>
															<ControlLabel>{__('Address')}</ControlLabel>
															<FormControl
																componentClass='textarea'
																rows='5'
																placeholder={__('Address')}
																name='studentdetails[address_2]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[address_2]']}
															/>
															<HelpBlock>{this.props.errors.address_2}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='zip_code2'
															validationState={this.props.errors.zip_code2 ? 'error': null}
														>
															<ControlLabel>{__('Zip Code')}</ControlLabel>
															<FormControl
																placeholder={__('Zip Code')}
																name='student[zip_code2]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[zip_code2]']}
															/>
															<HelpBlock>{this.props.errors.zip_code2}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='user_image'
															validationState={this.props.errors.user_image ? 'error': null}
														>
															<ControlLabel>{__('Profile Image')}</ControlLabel>
															<FormControl name='user_image' type='file'/>
															<HelpBlock>{this.props.errors.user_image}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<div>
																<ServiceImage
																	src={this.props.item.user_image}
																	width='96'
																	height='96'
																	className='img-rounded'
																/>
																<input type="hidden" defaultValue={this.props.item.user_image} name="user_image" />
															</div>
														</Col>
													}
												</Row>
												<Row>
													<Col md={12} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabBack}
															data-tab-key={1}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={this.handleTabNext}
															data-tab-key={3}
															data-tab-currkey={2}
														>
															<Text>Next</Text>
														</Button>
													</Col>
												</Row>
											</Grid>
										</Tab>
										<Tab eventKey={3} title={__('Family Information')}>
											<Grid fluid>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='father_name'
															validationState={this.props.errors.father_name ? 'error': null}
														>
															<ControlLabel>{__('Father\'s Name')}</ControlLabel>
															<FormControl
																placeholder={__('Father\'s Name')}
																name='studentdetails[father_name]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[father_name]']}
															/>
															<HelpBlock>{this.props.errors.father_name}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='father_occupation'
															validationState={this.props.errors.father_occupation ? 'error': null}
														>
															<ControlLabel>{__('Father\'s Occupation')}</ControlLabel>
															<FormControl
																placeholder={__('Father\'s Occupation')}
																name='studentdetails[father_occupation]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[father_occupation]']}
															/>
															<HelpBlock>{this.props.errors.father_occupation}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='father_email'
															validationState={this.props.errors.father_email ? 'error': null}
														>
															<ControlLabel>{__('Father\'s Email')}</ControlLabel>
															<FormControl
																placeholder={__('Father\'s Email')}
																name='student[father_email]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[father_email]']}
															/>
															<HelpBlock>{this.props.errors.father_email}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='father_contact'
															validationState={this.props.errors.father_contact ? 'error': null}
														>
															<ControlLabel>{__('Father\'s Contact')}</ControlLabel>
															<FormControl
																placeholder={__('Father\'s Contact')}
																name='student[father_contact]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[father_contact]']}
															/>
															<HelpBlock>{this.props.errors.father_contact}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='father_contact_alternate'
															validationState={this.props.errors.father_contact_alternate ? 'error': null}
														>
															<ControlLabel>{__('Father\'s Alternate Contact')}</ControlLabel>
															<FormControl
																placeholder={__('Father\'s Alternate Contact')}
																name='student[father_contact_alternate]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[father_contact_alternate]']}
															/>
															<HelpBlock>{this.props.errors.father_contact_alternate}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='mother_name'
															validationState={this.props.errors.mother_name ? 'error': null}
														>
															<ControlLabel>{__('Mother\'s Name')}</ControlLabel>
															<FormControl
																placeholder={__('Mother\'s Name')}
																name='studentdetails[mother_name]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[mother_name]']}
															/>
															<HelpBlock>{this.props.errors.mother_name}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='mother_occupation'
															validationState={this.props.errors.mother_occupation ? 'error': null}
														>
															<ControlLabel>{__('Mother\'s Occupation')}</ControlLabel>
															<FormControl
																placeholder={__('Mother\'s Occupation')}
																name='studentdetails[mother_occupation]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[mother_occupation]']}
															/>
															<HelpBlock>{this.props.errors.mother_occupation}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='mother_email'
															validationState={this.props.errors.mother_email ? 'error': null}
														>
															<ControlLabel>{__('Mother\'s Email')}</ControlLabel>
															<FormControl
																placeholder={__('Mother\'s Email')}
																name='student[mother_email]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[mother_email]']}
															/>
															<HelpBlock>{this.props.errors.mother_email}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='mother_contact'
															validationState={this.props.errors.mother_contact ? 'error': null}
														>
															<ControlLabel>{__('Mother\'s Contact')}</ControlLabel>
															<FormControl
																placeholder={__('Mother\'s Contact')}
																name='student[mother_contact]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[mother_contact]']}
															/>
															<HelpBlock>{this.props.errors.mother_contact}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='mother_contact_alternate'
															validationState={this.props.errors.mother_contact_alternate ? 'error': null}
														>
															<ControlLabel>{__('Mother\'s Alternate Contact')}</ControlLabel>
															<FormControl
																placeholder={__('Mother\'s Alternate Contact')}
																name='student[mother_contact_alternate]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[mother_contact_alternate]']}
															/>
															<HelpBlock>{this.props.errors.mother_contact_alternate}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_supervision'>
															<BCheckbox
																name='is_supervision'
																onChange={this.handleDataUpdate}
																checked={this.props.item.is_supervision}
																value='1'
															>
																{__('Is in guardian Supervision?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>

												<div style={{display:this.props.item.is_supervision ? 'block' : 'none'}}>
													<Row>
														<Col md={6}>
															<FormGroup
																controlId='guardian_name'
																validationState={this.props.errors.guardian_name ? 'error': null}
															>
																<ControlLabel>{__('Guardian Name')}</ControlLabel>
																<FormControl
																	placeholder={__('Guardian Name')}
																	name='studentdetails[guardian_name]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[guardian_name]']}
																/>
																<HelpBlock>{this.props.errors.guardian_name}</HelpBlock>
															</FormGroup>
														</Col>
														<Col md={6}>
															<FormGroup
																controlId='guardian_relationship'
																validationState={this.props.errors.guardian_relationship ? 'error': null}
															>
																<ControlLabel>{__('Guardian Relationship')}</ControlLabel>
																<FormControl
																	placeholder={__('Guardian Relationship')}
																	name='studentdetails[guardian_relationship]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[guardian_relationship]']}
																/>
																<HelpBlock>{this.props.errors.guardian_relationship}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>

													<Row>
														<Col md={6}>
															<FormGroup
																controlId='guardian_contact'
																validationState={this.props.errors.guardian_contact ? 'error': null}
															>
																<ControlLabel>{__('Guardian Contact')}</ControlLabel>
																<FormControl
																	placeholder={__('Guardian Contact')}
																	name='student[guardian_contact]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['student[guardian_contact]']}
																/>
																<HelpBlock>{this.props.errors.guardian_contact}</HelpBlock>
															</FormGroup>
															<FormGroup
																controlId='guardian_contact_alternate'
																validationState={this.props.errors.guardian_contact_alternate ? 'error': null}
															>
																<ControlLabel>{__('Guardian\'s Alternate Contact')}</ControlLabel>
																<FormControl
																	placeholder={__('Guardian\'s Alternate Contact')}
																	name='student[guardian_contact_alternate]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['student[guardian_contact_alternate]']}
																/>
																<HelpBlock>{this.props.errors.guardian_contact_alternate}</HelpBlock>
															</FormGroup>
														</Col>
														<Col md={6}>
															<FormGroup
																controlId='guardian_address'
																validationState={this.props.errors.guardian_address ? 'error': null}
															>
																<ControlLabel>{__('Address')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Enter Full Residencial Address')}
																	name='studentdetails[guardian_address]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[guardian_address]']}
																/>
																<HelpBlock>{this.props.errors.guardian_address}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='no_of_brother'
															validationState={this.props.errors.no_of_brother ? 'error': null}
														>
															<ControlLabel>{__('Number of Brothers')}</ControlLabel>
															<FormControl
																placeholder={__('Number of Brothers')}
																name='student[no_of_brother]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[no_of_brother]']}
															/>
															<HelpBlock>{this.props.errors.no_of_brother}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='no_of_sister'
															validationState={this.props.errors.no_of_sister ? 'error': null}
														>
															<ControlLabel>{__('Number of Sisters')}</ControlLabel>
															<FormControl
																placeholder={__('Number of Sisters')}
																name='student[no_of_sister]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[no_of_sister]']}
															/>
															<HelpBlock>{this.props.errors.no_of_sister}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='standard_of_living'
															validationState={this.props.errors.standard_of_living ? 'error': null}
														>
															<ControlLabel>{__('Standard of Living')}</ControlLabel>
															<FormControl
																placeholder={__('Standard of Living')}
																name='studentdetails[standard_of_living]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[standard_of_living]']}
															/>
															<HelpBlock>{this.props.errors.standard_of_living}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='no_of_brother_in_school'
															validationState={this.props.errors.no_of_brother_in_school ? 'error': null}
														>
															<ControlLabel>{__('Number of Brother in School')}</ControlLabel>
															<FormControl
																placeholder={__('Number of Brother in School')}
																name='student[no_of_brother_in_school]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[no_of_brother_in_school]']}
															/>
															<HelpBlock>{this.props.errors.no_of_brother_in_school}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='no_of_sister_in_school'
															validationState={this.props.errors.no_of_sister_in_school ? 'error': null}
														>
															<ControlLabel>{__('Number of Sister in School')}</ControlLabel>
															<FormControl
																placeholder={__('Number of Sister in School')}
																name='student[no_of_sister_in_school]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[no_of_sister_in_school]']}
															/>
															<HelpBlock>{this.props.errors.no_of_sister_in_school}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='rank_in_family'
															validationState={this.props.errors.rank_in_family ? 'error': null}
														>
															<ControlLabel>{__('Rank of Student in Family')}</ControlLabel>
															<FormControl
																placeholder={__('Rank of Student in Family')}
																name='student[rank_in_family]'
																onChange={this.handleDataUpdate}
																value={this.props.item['student[rank_in_family]']}
															/>
															<HelpBlock>{this.props.errors.rank_in_family}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabBack}
															data-tab-key={2}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={this.handleTabNext}
															data-tab-key={4}
															data-tab-currkey={3}
														>
															<Text>Next</Text>
														</Button>
													</Col>
												</Row>
											</Grid>	
										</Tab>
										<Tab eventKey={4} title={__('Health Information')}>
											<Grid fluid>
												<Row>
													<Col md={3}>
														<FormGroup
															controlId='height'
															validationState={this.props.errors.height ? 'error': null}
														>
															<ControlLabel>{__('Height')}</ControlLabel>
															<FormControl
																placeholder={__('Height')}
																name='studentdetails[height]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[height]']}
															/>
															<HelpBlock>{this.props.errors.height}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='birthmark'
															validationState={this.props.errors.birthmark ? 'error': null}
														>
															<ControlLabel>{__('Birthmark')}</ControlLabel>
															<FormControl
																placeholder={__('Birthmark')}
																name='studentdetails[birthmark]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[birthmark]']}
															/>
															<HelpBlock>{this.props.errors.birthmark}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='blood_group'
															validationState={this.props.errors.blood_group ? 'error': null}
														>
															<ControlLabel>{__('Blood Group')}</ControlLabel>
															<Select
																className='form-control'
																name="student[blood_group]"
																placeholder={__('Please Select Blood Group')}
																onChange={this.handleDataUpdate}
																value={this.props.item['student[blood_group]']}
																options={getBloodGroup(__)}
															/>
															<HelpBlock>{this.props.errors.blood_group}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={3}>
														<FormGroup
															controlId='weight'
															validationState={this.props.errors.weight ? 'error': null}
														>
															<ControlLabel>{__('Body Weight')}</ControlLabel>
															<FormControl
																placeholder={__('Body Weight')}
																name='studentdetails[weight]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[weight]']}
															/>
															<HelpBlock>{this.props.errors.weight}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_health_issue'>
															<BCheckbox
																name='student[is_health_issue]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[is_health_issue]']}
																value='1'
															>
																{__('Does child have any health issue?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<div style={{display:this.props.item['student[is_health_issue]'] ? 'block' : 'none'}}>
													<Row>
														<Col md={12}>
															<FormGroup
																controlId='health_issue_detail'
																validationState={this.props.errors.health_issue_detail ? 'error': null}
															>
																<ControlLabel>{__('Health issue details')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Health issue details')}
																	name='studentdetails[health_issue_detail]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[health_issue_detail]']}
																/>
																<HelpBlock>{this.props.errors.health_issue_detail}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_allergies'>
															<BCheckbox
																name='student[is_allergies]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[is_allergies]']}
																value='1'
															>
																{__('Does child have any allergies?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<div style={{display:this.props.item['student[is_allergies]'] ? 'block' : 'none'}}>
													<Row>
														<Col md={12}>
															<FormGroup
																controlId='Allergy details'
																validationState={this.props.errors.allergies_detail ? 'error': null}
															>
																<ControlLabel>{__('Allergy details')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Allergy details')}
																	name='studentdetails[allergies_detail]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[allergies_detail]']}
																/>
																<HelpBlock>{this.props.errors.allergies_detail}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_medicine'>
															<BCheckbox
																name='student[is_medicine]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[is_medicine]']}
																value='1'
															>
																{__('Is child taking Any Medicine?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<div style={{display:this.props.item['student[is_medicine]'] ? 'block' : 'none'}}>
													<Row>
														<Col md={12}>
															<FormGroup
																controlId='Medicine details'
																validationState={this.props.errors.medicine_detail ? 'error': null}
															>
																<ControlLabel>{__('Medicine details')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Medicine details')}
																	name='studentdetails[medicine_detail]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[medicine_detail]']}
																/>
																<HelpBlock>{this.props.errors.medicine_detail}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_asthma'>
															<BCheckbox
																name='student[is_asthma]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[is_asthma]']}
																value='1'
															>
																{__('Is child suffering with Asthma?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<div style={{display:this.props.item['student[is_asthma]'] ? 'block' : 'none'}}>
													<Row>
														<Col md={12}>
															<FormGroup
																controlId='Asthma details'
																validationState={this.props.errors.asthma_detail ? 'error': null}
															>
																<ControlLabel>{__('Asthma details')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Asthma details like medicine, suggestion to care child in case of Asthma attack, Suggestion or instruction given by Doctor to parents for caring the child.')}
																	name='studentdetails[asthma_detail]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[asthma_detail]']}
																/>
																<HelpBlock>{this.props.errors.asthma_detail}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={12}>
														<FormGroup controlId='is_disability'>
															<BCheckbox
																name='student[is_disability]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['student[is_disability]']}
																value='1'
															>
																{__('Does child has any disability?')}
															</BCheckbox>
														</FormGroup>
													</Col>
												</Row>
												<div style={{display:this.props.item['student[is_disability]'] ? 'block' : 'none'}}>
													<Row>
														<Col md={12}>
															<FormGroup
																controlId='Disability details'
																validationState={this.props.errors.disability_detail ? 'error': null}
															>
																<ControlLabel>{__('Disability details')}</ControlLabel>
																<FormControl
																	componentClass='textarea'
																	rows='4'
																	placeholder={__('Disability details')}
																	name='studentdetails[disability_detail]'
																	onChange={this.handleDataUpdate}
																	value={this.props.item['studentdetails[disability_detail]']}
																/>
																<HelpBlock>{this.props.errors.disability_detail}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												</div>
												<Row>
													<Col md={12} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabBack}
															data-tab-key={3}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={this.handleTabNext}
															data-tab-key={5}
															data-tab-currkey={4}
														>
															<Text>Next</Text>
														</Button>
													</Col>
												</Row>
											</Grid>	
										</Tab>
										<Tab eventKey={5} title={__('Other Information')}>
											<Grid fluid>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='feeDiscountId'
															validationState={this.props.errors.feeDiscountId ? 'error': null}
														>
															<ControlLabel>{__('Fee Discount')}</ControlLabel>

															<Select
																multi
																name="feeDiscountId"
																placeholder={__('Please Select Discount') }
																onChange={this.handleDataUpdate}
																value={this.props.item['feeDiscountId']}
																options={this.props.helperData.feediscount}
																className='form-control'
															/>


															<HelpBlock>{this.props.errors.feeDiscountId}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												{ 
													this.props.item.countryISOCode === 'IN' &&
													<Panel>
														<Panel.Heading>
															<Panel.Title>
																<Text>
																	India
																</Text>
															</Panel.Title>
														</Panel.Heading>
														<Panel.Body>
															<Row>
																<Col md={6}>
																	<FormGroup
																		controlId='res_category'
																		validationState={this.props.errors.res_category ? 'error': null}
																	>
																		<ControlLabel>{__('Category')}</ControlLabel>
																		<Select
																			className='form-control'
																			name="student[res_category]"
																			placeholder={__('Please Select Category')}
																			onChange={this.handleDataUpdate}
																			value={this.props.item['student[res_category]']}
																			options={getResCategory(__)}
																		/>
																		<HelpBlock>{this.props.errors.res_category}</HelpBlock>
																	</FormGroup>
																</Col>

																<Col md={6}>
																	<FormGroup
																		controlId='aadhar'
																		validationState={this.props.errors.aadhar ? 'error': null}
																	>
																		<ControlLabel>{__('Aadhar No')}</ControlLabel>
																		<FormControl
																			placeholder={__('Aadhar No')}
																			name='student[aadhar]'
																			onChange={this.handleDataUpdate}
																			value={this.props.item['student[aadhar]']}
																		/>
																		<HelpBlock>{this.props.errors.aadhar}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
														</Panel.Body>
													</Panel>
												}
												{ 
													this.props.item.countryISOCode === 'OM' &&
													<Panel>
														<Panel.Heading>
															<Panel.Title>
																<Text>
																	For Non Residentials
																</Text>
															</Panel.Title>
														</Panel.Heading>
														<Panel.Body>
															<Row>
																<Col md={6}>
																	<FormGroup
																		controlId='residancy_number'
																		validationState={this.props.errors.residancy_number ? 'error': null}
																	>
																		<ControlLabel>{__('Residency Number')}</ControlLabel>
																		<FormControl
																			placeholder={__('Residency Number')}
																			name='student[residancy_number]'
																			onChange={this.handleDataUpdate}
																			value={this.props.item['student[residancy_number]']}
																		/>
																		<HelpBlock>{this.props.errors.residancy_number}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col md={6}>
																	<FormGroup
																		controlId='rn_issuer'
																		validationState={this.props.errors.rn_issuer ? 'error': null}
																	>
																		<ControlLabel>{__('RN Issuer')}</ControlLabel>
																		<FormControl
																			placeholder={__('RN Issuer')}
																			name='student[rn_issuer]'
																			onChange={this.handleDataUpdate}
																			value={this.props.item['student[rn_issuer]']}
																		/>
																		<HelpBlock>{this.props.errors.rn_issuer}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
															<Row>
																<Col md={6}>
																	<FormGroup
																		controlId='date_of_release'
																		validationState={this.props.errors.date_of_release ? 'error': null}
																	>
																		<ControlLabel>{__('Date of Release')}</ControlLabel>
																		<Datepicker
																			placeholder={__('Date of Release')}
																			value={this.props.item['student[date_of_release]']}
																			onChange={this.handleDataUpdate}
																			name='student[date_of_release]'/>
																		<HelpBlock>{this.props.errors.date_of_release}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col md={6}>
																	<FormGroup
																		controlId='date_of_expiration'
																		validationState={this.props.errors.date_of_expiration ? 'error': null}
																	>
																		<ControlLabel>{__('Date of Expiration')}</ControlLabel>
																		<Datepicker
																			placeholder={__('Date of Expiration')}
																			value={this.props.item['student[date_of_expiration]']}
																			onChange={this.handleDataUpdate}
																			name='student[date_of_expiration]'/>
																		<HelpBlock>{this.props.errors.date_of_expiration}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
														</Panel.Body>
													</Panel>
												}
												<Row>
													<Col md={12} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabBack}
															data-tab-key={4}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={this.handleTabNext}
															data-tab-key={6}
															data-tab-currkey={5}
														>
															<Text>Next</Text>
														</Button>
													</Col>
												</Row>
											</Grid>	
										</Tab>
										<Tab eventKey={6} title={__('Qualification & Certificates')}>
											<Grid fluid>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='pre_school_name'
															validationState={this.props.errors.pre_school_name ? 'error': null}
														>
															<ControlLabel>{__('Previous Organization Name')}</ControlLabel>
															<FormControl
																placeholder={__('Previous Organization Name')}
																name='studentdetails[pre_school_name]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[pre_school_name]']}
															/>
															<HelpBlock>{this.props.errors.pre_school_name}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='pre_school_address'
															validationState={this.props.errors.pre_school_address ? 'error': null}
														>
															<ControlLabel>{__('Previous Organization Address')}</ControlLabel>
															<FormControl
																placeholder={__('Previous Organization Address')}
																name='studentdetails[pre_school_address]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[pre_school_address]']}
															/>
															<HelpBlock>{this.props.errors.pre_school_address}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='pre_qualification'
															validationState={this.props.errors.pre_qualification ? 'error': null}
														>
															<ControlLabel>{__('Previous Qualification')}</ControlLabel>
															<FormControl
																placeholder={__('Previous Qualification')}
																name='studentdetails[pre_qualification]'
																onChange={this.handleDataUpdate}
																value={this.props.item['studentdetails[pre_qualification]']}
															/>
															<HelpBlock>{this.props.errors.pre_qualification}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='mark_list_img'
															validationState={this.props.errors.mark_list_img ? 'error': null}
														>
															<ControlLabel>{__('Mark Sheet Image')}</ControlLabel>
															<FormControl name='mark_list_img' type='file'/>
															<HelpBlock>{this.props.errors.mark_list_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.mark_list_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='birth_certificate_img'
															validationState={this.props.errors.birth_certificate_img ? 'error': null}
														>
															<ControlLabel>{__('Birth Certificate Image')}</ControlLabel>
															<FormControl name='birth_certificate_img' type='file'/>
															<HelpBlock>{this.props.errors.mark_list_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.birth_certificate_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='tc_img'
															validationState={this.props.errors.tc_img ? 'error': null}
														>
															<ControlLabel>{__('TC Image')}</ControlLabel>
															<FormControl name='tc_img' type='file'/>
															<HelpBlock>{this.props.errors.tc_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.tc_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='cast_certificate_img'
															validationState={this.props.errors.cast_certificate_img ? 'error': null}
														>
															<ControlLabel>{__('Caste Certificate Image')}</ControlLabel>
															<FormControl name='cast_certificate_img' type='file'/>
															<HelpBlock>{this.props.errors.cast_certificate_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.cast_certificate_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='migration_certificate_img'
															validationState={this.props.errors.migration_certificate_img ? 'error': null}
														>
															<ControlLabel>{__('Migration Certificate Image')}</ControlLabel>
															<FormControl name='migration_certificate_img' type='file'/>
															<HelpBlock>{this.props.errors.migration_certificate_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.migration_certificate_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row style={{marginBottom: '10px'}}>
													<Col md={6}>
														<FormGroup
															controlId='affidavit_img'
															validationState={this.props.errors.affidavit_img ? 'error': null}
														>
															<ControlLabel>{__('Affidavit Image')}</ControlLabel>
															<FormControl name='affidavit_img' type='file'/>
															<HelpBlock>{this.props.errors.affidavit_img}</HelpBlock>
														</FormGroup>
													</Col>
													{this.props.item.id &&
														<Col md={6}>
															<ServiceImage
																src={this.props.item.affidavit_img}
																width='96'
																height='96'
																className='img-rounded'
															/>
														</Col>
													}
												</Row>
												<Row>
													<Col md={6}>
														<Checkbox
															name='is_active'
															onChange={this.handleDataUpdate}
															value={this.props.item.is_active}>
															<ControlLabel><Text>Status</Text></ControlLabel>
														</Checkbox>
													</Col>
													<Col md={6} className='text-right'>
														<Button
															bsStyle='primary'
															onClick={this.handleTabBack}
															data-tab-key={5}
															disabled={this.props.saving}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={::this.save}
															disabled={this.props.saving}
														>
															{__(this.props.saving ? 'Saving' : 'Submit')}
														</Button>
													</Col>
												</Row>
											</Grid>	
										</Tab>
									</Tabs>
								</Form>
							</div>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAddNew}>
						<Text>Add New</Text>
					</View.Action>
				}
				{
					this.permissions.sendsms &&
					<React.Fragment>
						<View.Action 
							onClick={this.handleNotificationModal}
							data-modal='discount'>
							<Text>Apply Discount</Text>
						</View.Action>
						<View.Action 
							onClick={this.handleNotificationModal}
							data-modal='sms'>
							<Text>Send SMS</Text>
						</View.Action>
					</React.Fragment>
				}
				{
					this.permissions.sendemail &&
					<View.Action 
						onClick={this.handleNotificationModal}
						data-modal='email'>
						<Text>Send Email</Text>
					</View.Action>
					
				}
				{
					this.permissions.view &&
					<View.Action 
						onClick={this.showExportDataModal}>
						<Text>Export</Text>
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

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='userdetail__fullname'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullname', '')} />
				<FormControl
					type='text'
					title={__('Enrollment Number')}
					placeholder={__('Enrollment Number')}
					name='student__enrollment_no'
					onChange={this.updateFilter}
					value={filterValue(filters, 'student__enrollment_no', '')} />
				<Select
					title={__('Class')}
					placeholder={__('Select Class')}
					name='studentrecord__bcsMapId__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'studentrecord__bcsMapId__eq', null)}
					options={this.props.helperData.bcsmaps}/>	
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
					name='user__is_active__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__is_active__eq', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-5'>
								<BCheckbox
									className='checkboxselect'
									name='check_all'
									data-item-id='all'
									onChange={this.handleCheckbox}
									checked={this.props.notification.checkedBox['all'] || false}
								/>
							</td>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-15'><Text>Name</Text></td>
							<td className='tw-15'><Text>Enroll. No.</Text></td>
							<td className='tw-15'><Text>Roll No.</Text></td>
							<td className='tw-15'><Text>Class</Text></td>
							<td className='tw-15'><Text>User Name</Text></td>
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
				<Notification 
					state={this.props} 
					actions={actions}
					onChangeEvent={this.handleDiscountUpdate} __={__} />
			</React.Fragment>
		);
	}

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={6}/>;
		}

		return this.props.items.map((item) => (
			<tr key={item.user.id}>
				<td className='tw-5'>
					<BCheckbox
						className='checkboxselect'
						name={item.id}
						data-item-id={item.id}
						onClick={this.handleCheckbox}
						checked={this.props.notification.checkedBox[item.id] || false}
					/>
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
				<td className='tw-15'>{item.user.userdetails[0].fullname}</td>
				<td className='tw-15'>{item.enrollment_no}</td>
				<td className='tw-15'>{item.studentrecord.roll_no}</td>
				<td className='tw-15'>{item.studentrecord.bcsmap.board.boarddetails[0].alias+'-'+item.studentrecord.bcsmap.class.classesdetails[0].name+'-'+item.studentrecord.bcsmap.section.sectiondetails[0].name}</td>
				<td className='tw-15'>{item.user.user_name}</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.user.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.handleEdit}
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
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	updateData(name, value) {
		this.props.dispatch(actions.updateData(name, value));

		let countryId, stateId, routeId, type=1;
		if (name === 'student[countryId]') countryId = value;
		if (name === 'student[countryId_2]') countryId = value, type = 2;
		if (name === 'student[stateId]') stateId = value;
		if (name === 'student[stateId_2]') stateId = value, type = 2;
		if (name === 'student[routeId]') routeId = value;

		if (value !== '' && (name === 'student[countryId]' || name === 'student[countryId_2]')) {
			this.props.dispatch(
				actions.updateAvailableState(
					this.props,
					countryId,
					type
				)
			);
		}

		if (value !== '' && (name === 'student[stateId]' || name === 'student[stateId_2]')) {
			this.props.dispatch(
				actions.updateAvailableCity(
					this.props,
					stateId,
					type
				)
			);
		}

		if (value !== '' && name === 'student[routeId]') {
			this.props.dispatch(
				actions.updateAvailableRouteAddress(
					this.props,
					routeId
				)
			);
		}
	}
}

function calculateAge(val, __) {
	let today = moment(), dob = moment(val),
		years, months, days;	
	if (! dob.isValid()) return;
	years = today.diff(dob, 'years');
	dob.add(years, 'years');
	months = today.diff(dob, 'months');
	dob.add(months, 'months');
	days = today.diff(dob, 'days');
	return years + ' '+ __('years') + ' ' + months + ' ' + __('months') + ' ' + days + ' ' + __('days');
}