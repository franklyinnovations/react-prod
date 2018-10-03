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
	getSalutation,
	getSMSProvider,
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
	Checkbox,
	FormControl,
	InputGroup,
	Modal,
	Loading,
	Pagination,
	ServiceImage,
	Notification,
	BCheckbox,
	Tabs,
	Tab
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/institute';
import * as actions from '../redux/actions/institute';
addView('institute', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class Institute extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'institute');

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

	updateFilter = event => this.props.dispatch(
		actions.updateFilter(event)
	);

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

	remove = event => {
		var itemId = event.currentTarget.getAttribute('data-item-id');
		vex.dialog.confirm({
			message: window.__('Are you sure you want to delete the Institute?'),
			callback: (value) => {
				if(value) {
					this.props.dispatch(
						actions.remove(
							this.props,
							itemId
						)
					);
				}
			}
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

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	changeStatus = event => {
		let roleId = event.currentTarget.getAttribute('data-item-roleid');
		if (roleId === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please fill all necessary information of institute.'),
			});
			return;
		}
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	handleDataUpdate = event => this.updateData(
		event.currentTarget.name,
		getInputValue(event.currentTarget)
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

	handleEdit = event => {
		this.props.dispatch(
			actions.edit(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

	save = () => {
		let data = new FormData(document.getElementById('instituteaddform'));

		if(document.getElementsByName('institute[countryId]').length === 0){
			data.append('institute[countryId]', '');
		}
		if(document.getElementsByName('institute[stateId]').length === 0){
			data.append('institute[stateId]', '');
		}
		if(document.getElementsByName('institute[cityId]').length === 0){
			data.append('institute[cityId]', '');
		}
		if(document.getElementsByName('roleId').length === 0){
			data.append('roleId', '');
		}
		if(document.getElementsByName('institute[themeId]').length === 0){
			data.append('institute[themeId]', '');
		}
		if(document.getElementsByName('govtIdentityId').length === 0){
			data.append('govtIdentityId', '');
		}
		if(document.getElementsByName('institute[timezone]').length === 0){
			data.append('institute[timezone]', '');
		}
		if(document.getElementsByName('secondary_lang').length === 0){
			data.append('secondary_lang', '');
		}

		this.props.dispatch(
			actions.save(
				this.props,
				data
			)
		);
	};

	handleEmailSent = event => {
		this.props.dispatch(
			actions.emailSent(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

	handleEmailSentBank = event => {
		this.props.dispatch(
			actions.emailSentBank(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

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
			type: 'UPDATE_CHECKBOX_INSTITUTE',
			id: id
		});
	};

	handleAuthKeyUpdate = event => {
		this.props.dispatch(
			actions.updateAuthKeyData(
				event.currentTarget.name, 
				getInputValue(event.currentTarget)
			)
		);
	};

	handleAuthKeyModal = event => {
		this.props.dispatch(
			actions.authKeyModal(
				this.props,
				event.currentTarget.getAttribute('data-item-id')
			)
		);
	};

	handleSaveAuthKey = () => this.props.dispatch(
		actions.saveAuthKey(this.props)
	);

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
					className='institute-popup'
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
									<Text>Edit Institute</Text> :
									<Text>Add Institute</Text>
								}
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<div className='module-form module-padding'>
								<Form id="instituteaddform">
									<input type="hidden" name="id" value={this.props.item.id}/>
									<input type="hidden" name="institute[id]" value={this.props.item.instituteId}/>
									<input type="hidden" name="institute_detail[id]" value={this.props.item.institutedetailId}/>
									<Tabs
										onSelect={this.changeTab}
										activeKey={this.props.tabbing.activateKey}
										className='add-studenat-tab-content' 
										id="controlled-tab-example">
										<Tab eventKey={1} title={__('Basic Information')}>
											<Grid fluid>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='institute_name'
															validationState={this.props.errors.name ? 'error': null}
														>
															<ControlLabel><Text>Institute Name</Text></ControlLabel>
															<FormControl
																placeholder={__('Institute Name')}
																name='institute_detail[name]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute_detail[name]']}
															/>
															<HelpBlock>{this.props.errors.name}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='alias'
															validationState={this.props.errors.alias ? 'error': null}
														>
															<ControlLabel><Text>Short Name</Text></ControlLabel>
															<FormControl
																placeholder={__('Short Name')}
																name='institute_detail[alias]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute_detail[alias]']}
															/>
															<HelpBlock>{this.props.errors.alias}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='countryId'
															validationState={this.props.errors.countryId ? 'error': null}
														>
															<ControlLabel><Text>Country</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[countryId]"
																placeholder={__('Country')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[countryId]']}
																options={this.props.helperData.countries}
															/>
															<HelpBlock>{this.props.errors.countryId}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='stateId'
															validationState={this.props.errors.stateId ? 'error': null}
														>
															<ControlLabel><Text>State</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[stateId]"
																placeholder={__('State')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[stateId]']}
																isLoading={this.props.helperData.loadingStates}
																options={this.props.helperData.states}
															/>
															<HelpBlock>{this.props.errors.stateId}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='cityId'
															validationState={this.props.errors.cityId ? 'error': null}
														>
															<ControlLabel><Text>City</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[cityId]"
																placeholder={__('City')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[cityId]']}
																isLoading={this.props.helperData.loadingCities}
																options={this.props.helperData.cities}
															/>
															<HelpBlock>{this.props.errors.cityId}</HelpBlock>
														</FormGroup>
														<FormGroup
															controlId='zip_code'
															validationState={this.props.errors.zip_code ? 'error': null}
														>
															<ControlLabel><Text>Zip Code</Text></ControlLabel>
															<FormControl
																placeholder={__('Zip Code')}
																name='institute[zip_code]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[zip_code]']}
															/>
															<HelpBlock>{this.props.errors.zip_code}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='address'
															validationState={this.props.errors.address ? 'error': null}
														>
															<ControlLabel><Text>Address</Text></ControlLabel>
															<FormControl
																componentClass='textarea'
																rows='5'
																placeholder={__('Address')}
																name='institute_detail[address]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute_detail[address]']}
															/>
															<HelpBlock>{this.props.errors.address}</HelpBlock>
														</FormGroup>
														{
															this.props.item.parentId === 0 &&
															<FormControl.Static>
																<Text>State</Text>:&nbsp;{this.props.item.stateName}
																<br/>
																<Text>City</Text>:&nbsp;{this.props.item.cityName}
															</FormControl.Static>
														}
														<FormGroup
															controlId='tagline'
															validationState={this.props.errors.tagline ? 'error': null}
														>
															<ControlLabel><Text>Tag Line</Text></ControlLabel>
															<FormControl
																componentClass='textarea'
																rows='5'
																placeholder={__('Tag Line')}
																name='institute_detail[tagline]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute_detail[tagline]']}
															/>
															<HelpBlock>{this.props.errors.tagline}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup controlId='is_institute'>
															<Checkbox
																name='institute[is_institute]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['institute[is_institute]']}
																value={this.props.item['institute[is_institute]']}
															>
															&nbsp;&nbsp;
																{__('Is this institute has Head Office')}
															</Checkbox>
														</FormGroup>
													</Col>
												</Row>
												{this.props.item['institute[is_institute]'] === true &&
													<Row>
														<Col md={6}>
															<FormGroup
																controlId='parentInstituteId'
																validationState={this.props.errors.is_institute ? 'error': null}
															>
																<ControlLabel><Text>Parent Institute</Text></ControlLabel>
																<Select
																	className='form-control'
																	name="institute[parentInstituteId]"
																	placeholder={__('Parent Institute')}
																	onChange={this.handleDataUpdate}
																	value={this.props.item['institute[parentInstituteId]']}
																	options={this.props.helperData.institutes}
																/>
																<HelpBlock>{this.props.errors.is_institute}</HelpBlock>
															</FormGroup>
														</Col>
													</Row>
												}
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
										<Tab eventKey={2} title={__('Official Contact Details')}>
											<Grid fluid>
												<Row>
													<Col md={3}>
														<FormGroup
															controlId='salutation'
															validationState={this.props.errors.salutation ? 'error': null}
														>
															<ControlLabel><Text>Salutation</Text></ControlLabel>
															<Select
																className='form-control'
																name="salutation"
																placeholder={__('Salutation')}
																onChange={this.handleDataUpdate}
																value={this.props.item.salutation}
																options={getSalutation(__)}
															/>
															<HelpBlock>{this.props.errors.salutation}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={9}>
														<FormGroup
															controlId='fullname'
															validationState={this.props.errors.fullname ? 'error': null}
														>
															<ControlLabel><Text>Name</Text></ControlLabel>
															<FormControl
																placeholder='Name'
																name='user_detail[fullname]'
																onChange={this.handleDataUpdate}
																value={this.props.item['user_detail[fullname]']}
															/>
															<HelpBlock>{this.props.errors.fullname}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='registration_number'
															validationState={this.props.errors.registration_number ? 'error': null}
														>
															<ControlLabel><Text>Institute Registration Number</Text></ControlLabel>
															<FormControl
																placeholder={__('Institute Registration Number')}
																name='institute[registration_number]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[registration_number]']}
															/>
															<HelpBlock>{this.props.errors.registration_number}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='email'
															validationState={this.props.errors.email ? 'error': null}
														>
															<ControlLabel><Text>Email</Text></ControlLabel>
															<FormControl
																placeholder={__('Email')}
																name='email'
																onChange={this.handleDataUpdate}
																value={this.props.item.email}
															/>
															<HelpBlock>{this.props.errors.email}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='password'
															validationState={this.props.errors.password ? 'error': null}
														>
															<ControlLabel><Text>Password</Text></ControlLabel>
															{this.props.item.id ? 
															<InputGroup>
																<FormControl
																	type='password'
																	placeholder='Password'
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
													<Col md={6}>
														<FormGroup
															controlId='confirm_password'
															validationState={this.props.errors.confirm_password ? 'error': null}
														>
															<ControlLabel><Text>Confirm Password</Text></ControlLabel>
															<FormControl
																type='password'
																placeholder='Confirm Password'
																name='confirm_password'
																onChange={this.handleDataUpdate}
																value={this.props.item.confirm_password}
																disabled={this.props.item.id && !this.props.item.editablePassword}
															/>
															<HelpBlock>{this.props.errors.confirm_password}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='roleId'
															validationState={this.props.errors.roleId ? 'error': null}
														>
															<ControlLabel><Text>Role</Text></ControlLabel>
															<Select
																className='form-control'
																name="roleId"
																placeholder={__('Role')}
																onChange={this.handleDataUpdate}
																value={this.props.item.roleId}
																options={this.props.helperData.roles}
															/>
															<HelpBlock>{this.props.errors.roleId}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='themeId'
															validationState={this.props.errors.themeId ? 'error': null}
														>
															<ControlLabel><Text>Theme</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[themeId]"
																placeholder={__('Theme')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[themeId]']}
																options={this.props.helperData.themes}
															/>
															<HelpBlock>{this.props.errors.themeId}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='website_url'
															validationState={this.props.errors.website_url ? 'error': null}
														>
															<ControlLabel><Text>Website Url</Text></ControlLabel>
															<FormControl
																placeholder={__('Website Url')}
																name='institute[website_url]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[website_url]']}
															/>
															<HelpBlock>{this.props.errors.website_url}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='phone'
															validationState={this.props.errors.phone ? 'error': null}
														>
															<ControlLabel><Text>Phone</Text></ControlLabel>
															<FormControl
																placeholder={__('Phone')}
																name='institute[phone]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[phone]']}
															/>
															<HelpBlock>{this.props.errors.phone}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='mobile'
															validationState={this.props.errors.mobile ? 'error': null}
														>
															<ControlLabel><Text>Mobile</Text></ControlLabel>
															<FormControl
																placeholder='Mobile'
																name='mobile'
																onChange={this.handleDataUpdate}
																value={this.props.item.mobile}
															/>
															<HelpBlock>{this.props.errors.mobile}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='alternate_mobile'
															validationState={this.props.errors.alternate_mobile ? 'error': null}
														>
															<ControlLabel><Text>Alternate Mobile</Text></ControlLabel>
															<FormControl
																placeholder='Alternate Mobile'
																name='alternate_mobile'
																onChange={this.handleDataUpdate}
																value={this.props.item.alternate_mobile}
															/>
															<HelpBlock>{this.props.errors.alternate_mobile}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='govtIdentityId'
															validationState={this.props.errors.govtIdentityId ? 'error': null}
														>
															<ControlLabel><Text>Government Identity</Text></ControlLabel>
															<Select
																className='form-control'
																name="govtIdentityId"
																placeholder={__('Government Identity')}
																onChange={this.handleDataUpdate}
																value={this.props.item.govtIdentityId}
																options={this.props.helperData.identities}
															/>
															<HelpBlock>{this.props.errors.govtIdentityId}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='govt_identity_number'
															validationState={this.props.errors.govt_identity_number ? 'error': null}
														>
															<ControlLabel><Text>Government Identity Number</Text></ControlLabel>
															<FormControl
																placeholder='Government Identity Number'
																name='govt_identity_number'
																onChange={this.handleDataUpdate}
																value={this.props.item.govt_identity_number}
															/>
															<HelpBlock>{this.props.errors.govt_identity_number}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={4}>
														<FormGroup
															controlId='secondary_lang'
															validationState={this.props.errors.secondary_lang ? 'error': null}
														>
															<ControlLabel><Text>Secondary Language</Text></ControlLabel>
															<Select
																className='form-control'
																name="secondary_lang"
																placeholder={__('Secondary Language')}
																onChange={this.handleDataUpdate}
																value={this.props.item.secondary_lang}
																options={this.props.helperData.languages}
															/>
															<HelpBlock>{this.props.errors.secondary_lang}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='sms_provider'
															validationState={this.props.errors.sms_provider ? 'error': null}
														>
															<ControlLabel><Text>SMS Provider</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[sms_provider]"
																placeholder={__('SMS Provider')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[sms_provider]']}
																options={getSMSProvider(__)}
															/>
															<HelpBlock>{this.props.errors.sms_provider}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={4}>
														<FormGroup
															controlId='date_format'
															validationState={this.props.errors.date_format ? 'error': null}
														>
															<ControlLabel><Text>Date Format</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[date_format]"
																placeholder={__('Date Format')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[date_format]']}
																options={this.props.helperData.date_formats}
															/>
															<HelpBlock>{this.props.errors.date_format}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='min_admission_years_box'
														>
															<ControlLabel><Text>Age Limit for Admission</Text></ControlLabel>
															<Row>
																<Col md={6}>
																	<FormGroup
																		controlId='min_admission_years'
																		validationState={this.props.errors.min_admission_years ? 'error': null}
																	>
																		<FormControl
																			placeholder={__('Years')}
																			name='institute[min_admission_years]'
																			onChange={this.handleDataUpdate}
																			value={this.props.item['institute[min_admission_years]']}
																		/>
																		<HelpBlock>{this.props.errors.min_admission_years}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col md={6}>
																	<FormGroup
																		controlId='min_admission_months'
																		validationState={this.props.errors.min_admission_months ? 'error': null}
																	>
																		<FormControl
																			placeholder={__('Months')}
																			name='institute[min_admission_months]'
																			onChange={this.handleDataUpdate}
																			value={this.props.item['institute[min_admission_months]']}
																		/>
																		<HelpBlock>{this.props.errors.min_admission_months}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='timezone'
															validationState={this.props.errors.timezone ? 'error': null}
														>
															<ControlLabel><Text>Timezone</Text></ControlLabel>
															<Select
																className='form-control'
																name="institute[timezone]"
																placeholder={__('Timezone')}
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[timezone]']}
																options={this.props.helperData.timezones}
															/>
															<HelpBlock>{this.props.errors.timezone}</HelpBlock>
														</FormGroup>
													</Col>
												</Row>
												<Row>
													<Col sm={6} md={3}>
														<FormGroup
															controlId='user_image'
															validationState={this.props.errors.user_image ? 'error': null}
														>
															<ControlLabel><Text>Profile Image</Text></ControlLabel>
															<FormControl name='user_image' type='file'/>
															<HelpBlock>{this.props.errors.user_image}</HelpBlock>
														</FormGroup>
														{this.props.item.id &&
															<ServiceImage
																src={this.props.item.user_image}
																width='96'
																height='96'
																className='img-rounded'
															/>
														}
													</Col>
													<Col sm={6} md={3}>
														<FormGroup
															controlId='institute_image'
															validationState={this.props.errors.institute_image ? 'error': null}
														>
															<ControlLabel>{__('Institute Image')}</ControlLabel>
															<FormControl name='institute_image' type='file'/>
															<HelpBlock>{this.props.errors.institute_image}</HelpBlock>
														</FormGroup>
														{this.props.item.id &&
															<ServiceImage
																src={this.props.item.institute_image}
																width='96'
																height='96'
																className='img-rounded'
															/>
														}
													</Col>
													<Col sm={6} md={3}>
														<FormGroup
															controlId='institute_logo'
															validationState={this.props.errors.institute_image ? 'error': null}
														>
															<ControlLabel><Text>Institute Logo</Text></ControlLabel>
															<FormControl name='institute_logo' type='file'/>
															<HelpBlock>{this.props.errors.institute_logo}</HelpBlock>
														</FormGroup>
														{this.props.item.id &&
															<ServiceImage
																src={this.props.item.institute_logo}
																width='96'
																height='96'
																className='img-rounded'
															/>
														}
													</Col>
													<Col sm={6} md={3}>
														<FormGroup
															controlId='govt_identity_image'
															validationState={this.props.errors.govt_identity_image ? 'error': null}
														>
															<ControlLabel><Text>Government Identity Image</Text></ControlLabel>
															<FormControl name='govt_identity_image' type='file'/>
															<HelpBlock>{this.props.errors.govt_identity_image}</HelpBlock>
														</FormGroup>
														{this.props.item.id &&
															<ServiceImage
																src={this.props.item.govt_identity_image}
																width='96'
																height='96'
																className='img-rounded'
															/>
														}
													</Col>
												</Row>
												<br/>
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
										<Tab eventKey={3} title={__('Bank Details & Other Settings')}>
											<Grid fluid>
												<Row>
													<Col md={6}>
														<FormGroup
															controlId='bank_name'
															validationState={this.props.errors.bank_name ? 'error': null}
														>
															<ControlLabel><Text>Bank Name</Text></ControlLabel>
															<FormControl
																placeholder={__('Bank Name')}
																name='institute[bank_name]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[bank_name]']}
															/>
															<HelpBlock>{this.props.errors.bank_name}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='ifsc_code'
															validationState={this.props.errors.ifsc_code ? 'error': null}
														>
															<ControlLabel><Text>IFSC code</Text></ControlLabel>
															<FormControl
																placeholder={__('IFSC code')}
																name='institute[ifsc_code]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[ifsc_code]']}
															/>
															<HelpBlock>{this.props.errors.ifsc_code}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='bank_branch'
															validationState={this.props.errors.bank_branch ? 'error': null}
														>
															<ControlLabel><Text>Bank Branch</Text></ControlLabel>
															<FormControl
																placeholder={__('Bank Branch')}
																name='institute[bank_branch]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[bank_branch]']}
															/>
															<HelpBlock>{this.props.errors.bank_branch}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='account_no'
															validationState={this.props.errors.account_no ? 'error': null}
														>
															<ControlLabel><Text>Account Number</Text></ControlLabel>
															<FormControl
																placeholder={__('Account Number')}
																name='institute[account_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[account_no]']}
															/>
															<HelpBlock>{this.props.errors.account_no}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='pan_no'
															validationState={this.props.errors.pan_no ? 'error': null}
														>
															<ControlLabel><Text>PAN Card Number</Text></ControlLabel>
															<FormControl
																placeholder={__('PAN Card Number')}
																name='institute[pan_no]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[pan_no]']}
															/>
															<HelpBlock>{this.props.errors.pan_no}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='bank_challan_charges'
															validationState={this.props.errors.bank_challan_charges ? 'error': null}
														>
															<ControlLabel><Text>Challan Charges by Bank</Text></ControlLabel>
															<FormControl
																placeholder={__('Challan Charges by Bank')}
																name='institute[bank_challan_charges]'
																onChange={this.handleDataUpdate}
																value={this.props.item['institute[bank_challan_charges]']}
															/>
															<HelpBlock>{this.props.errors.bank_challan_charges}</HelpBlock>
														</FormGroup>
													</Col>
													<Col md={6}>
														<FormGroup
															controlId='cheque_image'
															validationState={this.props.errors.cheque_image ? 'error': null}
														>
															<ControlLabel><Text>Cheque Image</Text></ControlLabel>
															<FormControl name='cheque_image' type='file'/>
															<HelpBlock>{this.props.errors.cheque_image}</HelpBlock>
														</FormGroup>
														{this.props.item.id &&
															<ServiceImage
																src={this.props.item['cheque_image']}
																width='96'
																height='96'
																className='img-rounded'
															/>
														}
													</Col>
													<Col xs={12}>
														<FormGroup controlId='fee_active'>
															<Checkbox
																disabled={this.props.item.allow_fee_app}
																name='institute[fee_active]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['institute[fee_active]']}
																value={this.props.item['institute[fee_active]']}
															>
															&nbsp;&nbsp;
																<Text>Show Fee on Mobile APP</Text>
															</Checkbox>
														</FormGroup>
													</Col>
													<Col xs={12}>
														<FormGroup controlId='digest'>
															<Checkbox
																disabled={this.props.item.digest}
																name='institute[digest]'
																onChange={this.handleDataUpdate}
																checked={this.props.item['institute[digest]']}
																value={this.props.item['institute[digest]']}
															>
															&nbsp;&nbsp;
																<Text>Email Digest</Text>
															</Checkbox>
														</FormGroup>
													</Col>
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
															data-tab-key={2}
															disabled={this.props.saving}
														>
															<Text>Back</Text>
														</Button>
														<Button
															bsStyle='primary'
															onClick={this.save}
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
					<View.Action 
						onClick={this.handleNotificationModal}
						data-modal='sms'>
						<Text>Send SMS</Text>
					</View.Action>
				}
				{
					this.permissions.sendemail &&
					<View.Action 
						onClick={this.handleNotificationModal}
						data-modal='email'>
						<Text>Send Email</Text>
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
					title={__('Institute Name')}
					placeholder={__('Institute Name')}
					name='institutedetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'institutedetail__name', '')} />
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
							<td className='tw-20'><Text>Name</Text></td>
							<td className='tw-15'><Text>Email</Text></td>
							<td className='tw-15'><Text>Mobile</Text></td>
							<td className='tw-15'><Text>User Name</Text></td>
							<td className='tw-10'><Text>Created</Text></td>
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
					actions={actions} __={__} />
				<Modal show={this.props.helperData.authKeyModal} onHide={this.hideDataModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Update SMS Provider Auth Key')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div id="tag-container">
							{this.props.helperData.loadingIcon &&
								<div className='text-center'>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 64}}
										glyph={'icon-fontello-spin4'}
									/>
								</div>
							}
							{!this.props.helperData.loadingIcon &&
								<div>
									<FormGroup
										controlId='smsProviderAuthKey'
										validationState={this.props.errors.smsProviderAuthKey ? 'error': null}
									>
										<ControlLabel>
											{__('SMS Provider')}{': '}
											{this.props.helperData.smsProvider && getSMSProvider(__).find(
												item => item.value === this.props.helperData.smsProvider
											).label}
										</ControlLabel>
										<FormControl
											placeholder={__('Auth Key')}
											title={__('Auth Key')}
											name='smsProviderAuthKey'
											onChange={this.handleAuthKeyUpdate}
											value={this.props.helperData.smsProviderAuthKey}
										/>
										<HelpBlock>{this.props.errors.smsProviderAuthKey}</HelpBlock>
									</FormGroup>
									<FormGroup
										controlId='smsSenderName'
										validationState={this.props.errors.smsSenderName ? 'error': null}
									>
										<FormControl
											placeholder={__('Sender Name')}
											title={__('Sender Name')}
											name='smsSenderName'
											onChange={this.handleAuthKeyUpdate}
											value={this.props.helperData.smsSenderName}
										/>
										<HelpBlock>{this.props.errors.smsSenderName}</HelpBlock>
									</FormGroup>
								</div>
							}
						</div>
					</Modal.Body>
					<Modal.Footer className='text-center'>
						<div className='text-center'>
							<Button
								onClick={this.handleSaveAuthKey}
								bsStyle='primary'
								disabled={this.props.saving}
							>
								{__(this.props.saving ? 'Saving' : 'Submit')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>	
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
						data-item-roleid={item.user.roleId}
						disabled={!this.permissions.status}
						value={item.user.is_active}/>
				</td>
				<td className='tw-20'>{item.institutedetails[0].name}</td>
				<td className='tw-15'>{item.user.email}</td>
				<td className='tw-15'>{item.user.mobile}</td>
				<td className='tw-15'>{item.user.user_name}</td>
				<td className='tw-10'>{moment(item.createdAt).format('YYYY/MM/DD')}</td>
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
							this.permissions.sendemail &&
							<DataTable.Action
								glyph='fa-envelope'
								text='Send Login Info'
								onClick={this.handleEmailSent}
								data-item-id={item.id}/>
						}
						{
							this.permissions.smsprovider &&
							<DataTable.Action
								glyph='fa-key'
								text='SMS Provider Auth Key'
								onClick={this.handleAuthKeyModal}
								data-item-id={item.id}/>
						}
						{
							this.permissions.sendemail &&
							<DataTable.Action
								glyph='fa-envelope'
								text='Send Email To TPSL'
								onClick={this.handleEmailSentBank}
								data-item-id={item.id}
								data-item-status={item.user.is_active}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	updateData(name, value) {
		this.props.dispatch(actions.updateData(name, value));

		let countryId, stateId;
		if (name === 'institute[countryId]') countryId = value;
		if (name === 'institute[stateId]') stateId = value;

		if (value !== '' && name === 'institute[countryId]') {
			this.props.dispatch(
				actions.updateAvailableState(
					this.props,
					countryId
				)
			);
		}

		if (value !== '' && name === 'institute[stateId]') {
			this.props.dispatch(
				actions.updateAvailableCity(
					this.props,
					stateId
				)
			);
		}
	}
}