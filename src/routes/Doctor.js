import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import makeTranslater from '../translate';
import {makeApiData} from '../api';
import {getStatusLabel} from '../utils';
import {getYears} from '../utils';
import Document from '../components/DoctorDocument';
import DoctorAddClinic from '../components/DoctorAddClinic';
import {imageUrl} from '../../api/config';
import Gmap from '../components/Common/Gmap';
import {getSalutation} from '../utils';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate} from '../utils';

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	Radio,
	PanelTabContainer,
	Nav,
	NavItem,
	Tab,
	Tabs,
	BPanel,
	Well,
	Image,
	Modal,
	OverlayTrigger,
	Tooltip,
	Popover
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'doctor';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor
}))

export default class Doctor extends React.Component {

	constructor(props) {
		super(props);
		this.yearValues = getYears();

    	this.handleDataUpdate = event => {
    		let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.handleSpecializationUpdate = event => {
			let value = event.target.value;
    		if(value.length <= 3) this.updateData(event.target.name, value);
		}

		this.handleEdit = event => { this.edit(event.target.getAttribute('data-item-id')) };
		this.handleState = event => {
			this.changeStatus(
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
			)
		};

		this.handleSelect = key => {
			if (key === undefined) return;
			if(key === "add_clinic") this.props.dispatch(actions.doctor.link_to_hospital_comp(this.props));
			this.props.dispatch(actions.doctor.updateTabKey(key));
	  	}

	  	this.handleCountryUpdate = event => {
			let value = event.target.value;
			this.props.dispatch(
				actions.doctor.getStates(
					this.props, value
				)
			)
			this.updateData(event.target.name, value);

			var index = event.target.selectedIndex, optionElement = event.target.childNodes[index], country_name =  optionElement.getAttribute('data-name');
  			this.updateGoogleMapAdressData('country_name', country_name)
		}

		this.handleStateUpdate = event => {
			let value = event.target.value;
			this.props.dispatch(
				actions.doctor.getCities(
					this.props, value
				)
			)
			this.updateData(event.target.name, value);

			var index = event.target.selectedIndex, optionElement = event.target.childNodes[index], state_name =  optionElement.getAttribute('data-name');
			this.updateGoogleMapAdressData('state_name', state_name)
		}

		this.handleCityUpdate = event => {
			let value = event.target.value;
			this.updateData(event.target.name, value);

			var index = event.target.selectedIndex, optionElement = event.target.childNodes[index], city_name =  optionElement.getAttribute('data-name');
			this.updateGoogleMapAdressData('city_name', city_name)
		}

		this.hendleProfilePicUploadIconClick = (e) => {
			e.preventDefault();
			let getElem = ReactDOM.findDOMNode(this).querySelector('.profile-pic')
			getElem.click();
		}

		this.handleProfilePicChange = event => {
			if (event.target.files && event.target.files[0]) {
				if(-1 === ["image/jpeg", "image/png"].indexOf(event.target.files[0].type)) {
					Messenger().post({
                		type: 'error',
                		message: window.__('Only images are allowed')
            		});
					return false;
				}
				let reader = new FileReader();
	            reader.onload = (e) => {
	            	let getImgElem = ReactDOM.findDOMNode(this).querySelector('.prf-pic-img-preview')
	            	getImgElem.src = e.target.result;
	            };
	            reader.readAsDataURL(event.target.files[0]);
	        }
	    }

	    this.closeClaimRequestDetailModal = () => {
    		this.props.dispatch({
				type: 'CLOSE_MODAL'
			});
  		}

	    this.handleViewClaimRequestDetail = event => {
	    	event.preventDefault();

	    	let dataItemId = "SPAN" === event.target.nodeName ? event.target.parentNode.getAttribute('data-item-id') : event.target.getAttribute('data-item-id');
	    	this.props.dispatch(
	    		actions.doctor.viewClaimRequestDetail(this.props, dataItemId)
	    	)
	    	this.setState({claimRequestDetailModalVisibleState: true})
		}

		this.handleClaimRequest = event => {
			let action_type = event.target.getAttribute('data-action-type');
			this.props.dispatch(
				actions.doctor.handleClaimRequest(this.props, action_type)
			)
		}

		this.handlePendingVerifiedStatus = event => {
			event.preventDefault();
			let docProfileId = event.target.getAttribute('data-item-id');
			vex.dialog.open({
	  			message: window.__('Are you sure ?'),
	  			buttons: [
			        $.extend({}, vex.dialog.buttons.YES, { text: window.__('Yes') }),
			        $.extend({}, vex.dialog.buttons.NO, { text: window.__('Cancel') })
			    ],
	  			callback: (status) => {
	  				if(status) {
	  					this.props.dispatch(actions.doctor.verifystatus(this.props, docProfileId))
	  				}
	  			}
			});
		}

		this.handleIsLiveStatus = event => {
			let value = event.target.checked ? 1 : 0;
			this.props.dispatch(
				actions.doctor.changeIsLiveStatus(this.props, event.target.getAttribute('data-item-id'), value)
			)
		}

		this.handleAddMoreEmailMobile = event => {
			event.preventDefault();
			this.props.dispatch(
				actions.doctor.addMoreEmailMobile(this.props, event.target.getAttribute('data-type'))
			)
		}

		this.handleContactDataUpdate = event => {
			if(event.target.getAttribute('data-action-type') === "is_primary") {
				let targetName = event.target.name.split("__")[0];
				this.props.dispatch(
					actions.doctor.updateEmailMobile(
						this.props, 
						event.target.getAttribute('data-type'), 
						event.target.getAttribute('data-index'), 
						targetName, 
						1
					)
				)
			} else {
				this.props.dispatch(
					actions.doctor.updateEmailMobile(
						this.props, 
						event.target.getAttribute('data-type'), 
						event.target.getAttribute('data-index'), 
						event.target.name, 
						event.target.value
					)
				)
			}
		}

		this.handleRemoveContactEmailMobile = event => {
			this.props.dispatch(
				actions.doctor.removeEmailMobile(
					this.props, 
					event.target.getAttribute('data-type'), 
					event.target.getAttribute('data-index')
				)
			)
		}

		this.changeTabKey = event => {
			this.props.dispatch(actions.doctor.updateTabKey(event.target.getAttribute('data-tab-key')));
		}

	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor.init(
				store.getState()
			)
		);
	}

	componentWillReceiveProps(nextProps){
		if(this.props.activeTabKey !== nextProps.activeTabKey){
			$(window).scrollTop(0);
		}
	}

	render() {
		let modalVisible = this.props.claimRequestDetail.modalDisplay;
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__);
				break;
			default:
				content = this.renderList(__);
		}

		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Doctors')}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.startAdd}
												>
													{__('Add New')}
												</Button>}
												{this.props.viewState === 'DATA_FORM' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.viewList}
												>
													{__('View List')}
												</Button>}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>

				<Col xs={12}>
					<Modal show={modalVisible} onHide={this.closeClaimRequestDetailModal}>
				        <Modal.Header closeButton>
				          	<Modal.Title>{__('Claim Request by')}</Modal.Title>
				        </Modal.Header>
				        <Modal.Body>
				        	{
								this.props.claimRequestDetail.isLoading && <p>{__('Loading details')}.....</p>
							}
				        	{
								!this.props.claimRequestDetail.isLoading && null !== this.props.claimRequestDetail.data && 
								<Row>
					          		<Col sm={12}>
					          			<p><strong>{__('Name')}</strong> : {this.props.claimRequestDetail.data.user.userdetails[0].fullname}</p>
					          			<p><strong>{__('Email')}</strong> : {this.props.claimRequestDetail.data.user.email}</p>
					          			<p><strong>{__('Mobile')}</strong> : {this.props.claimRequestDetail.data.user.mobile}</p>
					          		</Col>
					          	</Row>
							}
				        </Modal.Body>
				        <Modal.Footer>
				          	<Button bsStyle='danger' disabled={this.props.claimRequestDetail.isLoading} data-action-type='rejected' onClick={this.handleClaimRequest}>{__('Reject')}</Button>
				          	<Button bsStyle='primary' disabled={this.props.claimRequestDetail.isLoading} data-action-type='approved' onClick={this.handleClaimRequest}>{__('Approve')}</Button>
				        </Modal.Footer>
				    </Modal>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="country-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'6%'}>{__('S No.')}</th>
								<th>{__('Doctor ID')}</th>
								<th>{__('Name')}</th>
								<th>{__('Email')}</th>
								<th>{__('ClaimStatus')}</th>
								<th>{__('Status')}</th>
								<th>{__('VerificationStatus')}</th>
								<th>{__('Live')}</th>
								<th>{__('Actions')}</th>
							</tr>

							<tr>
								<td></td>
								<td></td>
								<td>
									<FormControl
						             	type='text'
						             	onChange={this.makeFilter('doctorprofiledetail__name')}
						             	value={this.props.filter.doctorprofiledetail__name || ''}
						             	placeholder={__('Name') }
						            />
								</td>
								<td>
									<FormControl
						             	type='text'
						             	onChange={this.makeFilter('contactinformation__value')}
						             	value={this.props.filter.contactinformation__value || ''}
						             	placeholder={__('Email') }
						            />
								</td>
								<td>
									<FormControl
						                componentClass="select"
						                placeholder="select"
						                onChange={this.makeFilter('doctorprofile__claim_status')}
						                value={this.props.filter.doctorprofile__claim_status || ''}
						                >
						                  	<option value=''>{__('Select')}</option>
						                  	<option value='non-claimed'>{__('Not Claimed')}</option>
						                  	<option value='pending'>{__('Pending')}</option>
						                  	<option value='approved'>{__('Approved')}</option>
						                  	<option value='user-created'>{__('User Created')}</option>
						                  	
						            </FormControl>
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('doctorprofile__is_active')}
										value={this.props.filter.doctorprofile__is_active || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Active')}</option>
										<option value='0'>{__('Inactive')}</option>
									</FormControl>
								</td>
								<td>
									<FormControl
						                componentClass="select"
						                placeholder="select"
						                onChange={this.makeFilter('doctorprofile__verified_status')}
						                value={this.props.filter.doctorprofile__verified_status || ''}
						                >
						                  	<option value=''>{__('Select')}</option>
						                  	<option value='pending'>{__('Pending')}</option>
						                  	<option value='verified'>{__('Verified')}</option>
						                  	<option value='incomplete-profile'>{__('Profile Incomplete')}</option>
						                  	
						            </FormControl>
									
								</td>
								<td>
									<FormControl
						                componentClass="select"
						                placeholder="select"
						                onChange={this.makeFilter('doctorprofile__is_live')}
						                value={this.props.filter.doctorprofile__is_live || ''}
						                >
						                  	<option value=''>{__('Select')}</option>
						                  	<option value='1'>{__('Live')}</option>
						                  	<option value='0'>{__('Not Live')}</option>
						                  	
						            </FormControl>
								</td>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={::this.search}
									/>
										<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={::this.reset}
									/>
								</td>
							</tr>
						</thead>
						<tbody>
							{this.props.doctors.map(this.getDataRow, this)}
							{this.props.doctors.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	}

	renderAdd(__) {
		let salutations = getSalutation(__);
		return (
			<Row>
				<Col xs={12} md={12} lg={12}>
					<Tabs activeKey={this.props.activeTabKey} onSelect={this.handleSelect} id="beg-tab">
						<Tab eventKey={'basic_details'} title={__('Basic Details')}><br/>
							<Form className='doctor-basic-info-form'>
								<Row>
									<Col xs={9} md={9}>
										<Row>
											<Col xs={2} md={2}>
												<FormGroup
														controlId='salutation'
														validationState={this.props.errors.salutation ? 'error': null}
													>
													<ControlLabel>{__('Title')}</ControlLabel>
													<FormControl
														componentClass="select"
														placeholder="select"
														onChange={this.handleDataUpdate}
														name='salutation'
														value={this.props.doctorBasicDetails.salutation}
													>
														{
															salutations.map((value, index) =>
																<option value={value.value} key={'salutation-'+value.value}>{
																	value.value
																}</option>
															)
														}
													</FormControl>
												</FormGroup>
											</Col>
									      	<Col xs={10} md={10}>
												<FormGroup
													controlId='name'
													validationState={this.props.errors.name ? 'error': null}
												>
													<ControlLabel>{__('Doctor Name')}</ControlLabel>
													<FormControl
														type='text'
														placeholder={__('Doctor Name')}
														value={this.props.doctorBasicDetails.name}
														name='name'
														onChange={this.handleDataUpdate}
													/>
													<HelpBlock>{this.props.errors.name}</HelpBlock>
												</FormGroup>
											</Col>
											<Col xs={6} md={6}>
												<FormGroup>
							                      	<ControlLabel>{__('Gender')}</ControlLabel>
							                      	<div>
							                        	<Radio inline value='male' onChange={this.handleDataUpdate} checked={'male' === this.props.doctorBasicDetails.gender} name='gender'>{__('Male')}</Radio>
							                        	<Radio inline value='female' onChange={this.handleDataUpdate} checked={'female' === this.props.doctorBasicDetails.gender} name='gender'>{__('Female')}</Radio>
							                      </div>
							                    </FormGroup>
											</Col>
									    </Row>
									</Col>
									<Col xs={3} md={3}>
										<Image src={(this.props.doctorBasicDetails.doctor_profile_pic ? imageUrl+'/'+this.props.doctorBasicDetails.doctor_profile_pic : '/imgs/noimage.png')} thumbnail style={{maxHeight: '100px'}} className="prf-pic-img-preview"/>
										<div>
												<a style={{fontSize: 14}} href="#" onClick={this.hendleProfilePicUploadIconClick}>{__('Upload Profile Photo')}</a>
												<input type="file" className='hide profile-pic' name="doctor_profile_pic" onChange={this.handleProfilePicChange}/>
										</div>
									</Col>
								</Row>
								<Row>
									<Col sm={12}><h4>{__('Contact Details')}</h4></Col>
									<Col xs={6} md={6}>
										<Row>
											<Col sm={12}>
												<FormGroup>
													<ControlLabel>{__('Email')} </ControlLabel>
												</FormGroup>
											</Col>
											{
												this.props.contactInformations.emails.map((item, itemIndex) => 
													<div key={'contact-email-'+itemIndex}>
													<Col sm={itemIndex === 0 ? 12 : 10}>
														<FormGroup
															controlId={'email___'+itemIndex}
															validationState={this.props.errors['email___'+itemIndex] ? 'error': null}
														>
															<InputGroup>
							                              		<FormControl
																	type='text'
																	placeholder={__('Email')}
																	value={this.props.contactInformations.emails[itemIndex].value}
																	name='value'
																	onChange={this.handleContactDataUpdate}
																	data-index={itemIndex}
																	data-type='emails'
																	data-action-type='info'
																/>
							                                	<InputGroup.Addon>
							                                  		<input type='radio' data-action-type='is_primary' name='is_primary__email' data-type='emails' data-index={itemIndex} onChange={this.handleContactDataUpdate} checked={this.props.contactInformations.emails[itemIndex].is_primary === 1 ? true : false}/>
							                                	</InputGroup.Addon>
							                              	</InputGroup>
							                              	<HelpBlock>{this.props.errors['email___'+itemIndex]}</HelpBlock>
							                            </FormGroup>
													</Col>
													{
														itemIndex != 0 && 
														<Col sm={2}>
															<Icon
																className={'fg-deepred'}
																style={{fontSize: 20}}
																glyph={'icon-simple-line-icons-close'}
																data-index={itemIndex}
																title={__('Remove')}
																data-type='emails'
																onClick={this.handleRemoveContactEmailMobile}
															/>
														</Col>
													}
													</div>
												)
											}
											{ 
												this.props.contactInformations.emails.length < 3 && 
												<Col sm={12} className='text-right'>
													<a href="#" onClick={this.handleAddMoreEmailMobile} data-type="email">+ {__('Add More')}</a>
												</Col>
											}
										</Row>
									</Col>
									<Col xs={6} md={6}>
										<Row>
											<Col sm={12}>
												<FormGroup>
													<ControlLabel>{__('Mobile')} </ControlLabel>
												</FormGroup>
											</Col>
											{
												this.props.contactInformations.mobiles.map((item, itemIndex) => 
													<div key={'contact-mobile-'+itemIndex}>
													<Col sm={itemIndex === 0 ? 12 : 10}>
														<FormGroup
															controlId={'mobile___'+itemIndex}
															validationState={this.props.errors['mobile___'+itemIndex] ? 'error': null}
														>
															<InputGroup>
							                              		<FormControl
																	type='text'
																	placeholder={__('Mobile')}
																	value={this.props.contactInformations.mobiles[itemIndex].value}
																	name='value'
																	onChange={this.handleContactDataUpdate}
																	data-index={itemIndex}
																	data-type='mobiles'
																	data-action-type='info'
																/>
							                                	<InputGroup.Addon>
							                                  		<input type='radio' data-action-type='is_primary' name='is_primary__mobile' data-type='mobiles' data-index={itemIndex} onChange={this.handleContactDataUpdate} checked={this.props.contactInformations.mobiles[itemIndex].is_primary === 1 ? true : false}/>
							                                	</InputGroup.Addon>
							                              	</InputGroup>
															<HelpBlock>{this.props.errors['mobile___'+itemIndex]}</HelpBlock>
														</FormGroup>
													</Col>
													{
														itemIndex != 0 && 
														<Col sm={2}>
															<Icon
																className={'fg-deepred'}
																style={{fontSize: 20}}
																glyph={'icon-simple-line-icons-close'}
																data-index={itemIndex}
																title={__('Remove')}
																data-type='mobiles'
																onClick={this.handleRemoveContactEmailMobile}
															/>
														</Col>
													}
													</div>
												)
											}
											{ 
												this.props.contactInformations.mobiles.length < 3 && 
												<Col sm={12} className='text-right'>
													<a href="#" onClick={this.handleAddMoreEmailMobile} data-type="mobile">+ {__('Add More')}</a>
												</Col>
											}
										</Row>
									</Col>
								</Row>
								<Row>
							      	<Col xs={12} md={12}>
										<FormGroup controlId="about_doctor" validationState={this.props.errors.about_doctor ? 'error': null}>
											<ControlLabel>{__('About The Doctor')}</ControlLabel>
											<FormControl
												componentClass="textarea"
												name='about_doctor'
												placeholder={__('About The Doctor')}
												value={this.props.doctorBasicDetails.about_doctor}
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.about_doctor}</HelpBlock>
										</FormGroup>
									</Col>
							    </Row>
								<Row>
							      	<Col xs={12} md={12}>
										<Row>
											<Col xs={6} md={6}>

												<FormGroup
														controlId='countryId'
														validationState={this.props.errors.countryId ? 'error': null}
													>
													<FormControl
														componentClass="select"
														placeholder="select"
														onChange={this.handleCountryUpdate}
														name='countryId'
														value={this.props.doctorBasicDetails.countryId}
													>
														<option value="">{__('Select Country')}</option>
														{
															this.props.helperData.countries.map((value, index) =>
																<option value={value.id} key={'country-'+value.id} data-name={value.countrydetails[0].name}>{
																	value.countrydetails[0].name
																}</option>
															)
														}
													</FormControl>
													<HelpBlock>{this.props.errors.countryId}</HelpBlock>
												</FormGroup>
												<FormGroup
														controlId='stateId'
														validationState={this.props.errors.stateId ? 'error': null}
													>
													<FormControl
														componentClass="select"
														placeholder="select"
														onChange={this.handleStateUpdate}
														name='stateId'
														value={this.props.doctorBasicDetails.stateId}
													>
														<option value="">{__('Select State')}</option>
														{
															this.props.helperData.states.map((value, index) =>
																<option value={value.id} key={'state-'+value.id} data-name={value.statedetails[0].name}>{
																	value.statedetails[0].name
																}</option>
															)
														}
													</FormControl>
													<HelpBlock>{this.props.errors.stateId}</HelpBlock>
												</FormGroup>
												<FormGroup
													controlId='cityId'
													validationState={this.props.errors.cityId ? 'error': null}
												>
													<FormControl
														componentClass="select"
														placeholder="select"
														onChange={this.handleCityUpdate}
														name='cityId'
														value={this.props.doctorBasicDetails.cityId}
													>
														<option value="">{__('Select City')}</option>
														{
															this.props.helperData.cities.map((value, index) =>
																<option value={value.id} key={'city-'+value.id} data-name={value.citydetails[0].name}>{
																	value.citydetails[0].name
																}</option>
															)
														}
													</FormControl>
													<HelpBlock>{this.props.errors.cityId}</HelpBlock>
												</FormGroup>
												<FormGroup
													controlId="address_line_1"
													validationState={this.props.errors.address_line_1 ? 'error': null}>
													<FormControl
														componentClass="textarea" name='address_line_1'
														placeholder={__('Enter Address')}
														value={this.props.doctorBasicDetails.address_line_1}
														onChange={this.handleDataUpdate}
													/>
													<HelpBlock>{this.props.errors.address_line_1}</HelpBlock>
												</FormGroup>
												<FormGroup
														controlId='postal_code'
														validationState={this.props.errors.postal_code ? 'error': null}
													>
													<FormControl
														type='text'
														placeholder={__('Postal Code')}
														value={this.props.doctorBasicDetails.postal_code}
														name='postal_code'
														onChange={this.handleDataUpdate}
													/>
													<HelpBlock>{this.props.errors.postal_code}</HelpBlock>
												</FormGroup>
												<FormGroup controlId='is_active'>
													<Checkbox
														name='is_active'
														onChange={this.handleDataUpdate}
														checked={this.props.doctorBasicDetails.is_active}
														>
														{__('Active')}
													</Checkbox>
												</FormGroup>
											</Col>
											<Col md={6}>
												<Gmap 
													//data={this.props} 
													address={this.props.doctorBasicDetails.address_line_1} 
													country_name={this.props.helperData.country_name}
													state_name={this.props.helperData.state_name}
													city_name={this.props.helperData.city_name}
													base={'doctor'}
												/>
											</Col>
									    </Row>
									</Col>
							    </Row>
							    <Row>
									<Col sm={6}>
										<div>
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={::this.viewList}>
												{__('Cancel')}
											</Button>{' '}
										</div>
										<br/>
									</Col>
									<Col sm={6} className='text-right'>
										<div>
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={::this.saveBasicInfo}>
												{__('Save & Next')}
											</Button>
										</div>
										<br/>
									</Col>
								</Row>
							</Form>
						</Tab>
						<Tab eventKey={'photos_videos'} title={__('Photos / Videos')} disabled={this.props.doctorBasicDetails.id ? false : true}><br/>
							<Row>
								<Col sm={12}>
									<Document
		  								data={this.props}
		  							/>
								</Col>
								<Col sm={6}>
									<div>
										<Button
											outlined
											bsStyle='lightgreen'
											data-tab-key='basic_details'
											onClick={::this.changeTabKey}>
											{__('Previous')}
										</Button>{' '}
									</div>
									<br/>
								</Col>
								<Col sm={6}>
									<div className='text-right'>
										<Button
											outlined
											bsStyle='lightgreen'
											data-tab-key='additional_info'
											onClick={::this.changeTabKey}>
											{__('Next')}
										</Button>
									</div>
									<br/>
								</Col>
							</Row>
						</Tab>

						<Tab eventKey={'additional_info'} title={__('Additional Information')} disabled={this.props.doctorBasicDetails.id ? false : true}><br/>
							<Form className='doctor-additional-info-form'>
								<BPanel key="education" header={__('Education')}>
									<Row>
										<Col sm={12} data-vvv={this.props.doctorEducations}>
											{this.props.doctorEducations.map(this.renderEducationAddView, this)}
										</Col>
										<Col sm={12} className='text-right'>
											<Button
												bsStyle="primary"
												data-action-type='ADD_MORE_EDUCATION'
												onClick={::this.addMoreAdditionalInfo}>
												{0 < this.props.doctorEducations.length ? __('Add More') : __('Add')}
											</Button>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="specialization" header={__('Specialization')}>
									<Row>
										<Col sm={12}>
											<FormGroup controlId="specializations" validationState={this.props.errors.specializations ? 'error': null}>
												<ControlLabel>{__('Specialization')} <span className='text-info' style={{fontSize: '12px'}}>({__('Max 3 allowed')})</span></ControlLabel>
												<Select
													multi
													name='specializations'
													onChange={this.handleSpecializationUpdate}
													value={this.props.doctorAdditionalInfo.specializations}
													options={
														this.props.helperData.specialization_tags
													}/>
												<HelpBlock>{this.props.errors.specializations}</HelpBlock>
											</FormGroup>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="services" header={__('Services')}>
									<Row>
										<Col sm={12}>
											<FormGroup controlId="services" validationState={this.props.errors.services ? 'error': null}>
												<ControlLabel>{__('Services')}</ControlLabel>
												<Select
													multi
													name='services'
													onChange={this.handleDataUpdate}
													value={this.props.doctorAdditionalInfo.services}
													options={this.props.helperData.service_tags}/>
												<HelpBlock>{this.props.errors.services}</HelpBlock>
											</FormGroup>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="experience" header={__('Experience')}>
									<Row>
										<Col sm={12}>
											{this.props.doctorExperiences.map(this.renderExperienceAddView, this)}
										</Col>
										<Col sm={12} className='text-right'>
											<Button
												bsStyle="primary"
												data-action-type='ADD_MORE_EXPERIENCE'
												onClick={::this.addMoreAdditionalInfo}>
												{0 < this.props.doctorExperiences.length ? __('Add More') : __('Add')}
											</Button>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="registration" header={__('Registration')}>
									<Row>
										<Col sm={12}>
											{this.props.doctorRegistrations.map(this.renderRegistrationAddView, this)}
										</Col>
										<Col sm={12} className='text-right'>
											<Button
												bsStyle="primary"
												data-action-type='ADD_MORE_REGISTRATION'
												onClick={::this.addMoreAdditionalInfo}>
												{0 < this.props.doctorRegistrations.length ? __('Add More') : __('Add')}
											</Button>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="awards" header={__('Awards')}>
									<Row>
										<Col sm={12}>
											{this.props.doctorAwards.map(this.renderAwardAddView, this)}
										</Col>
										<Col sm={12} className='text-right'>
											<Button
												bsStyle="primary"
												data-action-type='ADD_MORE_AWARD'
												onClick={::this.addMoreAdditionalInfo}>
												{0 < this.props.doctorAwards.length ? __('Add More') : __('Add')}
											</Button>
										</Col>
									</Row>
								</BPanel>
								<BPanel key="memberships" header={__('Memberships')}>
									<Row>
										<Col sm={12}>
											<FormGroup controlId="memberships" validationState={this.props.errors.memberships ? 'error': null}>
												<ControlLabel>{__('Memberships')}</ControlLabel>
												<Select
													multi
													name='memberships'
													onChange={this.handleDataUpdate}
													value={this.props.doctorAdditionalInfo.memberships}
													options={this.props.helperData.membership_tags}/>
												<HelpBlock>{this.props.errors.memberships}</HelpBlock>
											</FormGroup>
										</Col>
									</Row>
								</BPanel>
							</Form>
							<Row>
								<Col sm={6}>
									<Button
										outlined
										bsStyle='lightgreen'
										data-tab-key='photos_videos'
										onClick={::this.changeTabKey}>
										{__('Previous')}
									</Button>{' '}
								</Col>
								<Col sm={6} className='text-right'>
									<Button
										outlined
										bsStyle='lightgreen'
										onClick={::this.saveAdditionalInfo}>
										{__('Save & Next')}
									</Button>
								</Col>
								<br/>
								<br/>
							</Row>
						</Tab>

						<Tab eventKey={'add_clinic'} title={__('Hospitals')} disabled={this.props.doctorBasicDetails.id ? false : true}>
							<br/>
							<DoctorAddClinic {...this.props} />
						</Tab>

					</Tabs>
				</Col>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		const tooltip = (<Tooltip id='tooltip'> View Claim Request Detail</Tooltip>)
		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{item.id}</td>
				<td>{text_truncate(item.doctorprofiledetails[0].name, 20)}</td>
				<td>{item.contactinformations.length > 0 ? text_truncate(item.contactinformations[0].value, 20) : null}</td>
				<td>
					{ 
						"pending" === item.claim_status ? 
						<a href="#" data-item-id={item.id} title={__('ViewClaimRequestDetail')} onClick={this.handleViewClaimRequestDetail}>{getClaimStatusLabel(item.claim_status, __)}</a> : 
						(
							("approved" === item.claim_status || "user-created" === item.claim_status) && item.user !== null ? 
							<OverlayTrigger 
								trigger={["hover", "focus"]}
								placement="top" 
								rootClose
								overlay={
									<Popover id={'dp-'+index} title={__('Details of user')}>
										<p><strong>{__('Name')}: </strong> {item.user.userdetails[0].fullname}</p>
										<p><strong>{__('Email')}: </strong> {item.user.email}</p>
										<p><strong>{__('Mobile')}: </strong> {item.user.mobile}</p>
									</Popover>
								}
							>
	  							
	  							<a onClick={(e) => { return false; }}>{getClaimStatusLabel(item.claim_status, __)}</a>
							</OverlayTrigger> : 
							getClaimStatusLabel(item.claim_status, __)
						)
					}
				</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					{
						(item.userId && "pending" === item.verified_status) ? <a href="#" data-item-id={item.id} title={__('ClickToApproveRequest')} onClick={this.handlePendingVerifiedStatus}>{getVerificationStatusLabel(item.verified_status, __)}</a> : getVerificationStatusLabel(item.verified_status, __)	
					}
				</td>
				<td>
					{ 
						1 === item.is_live ? 
						<Icon
							className={'fg-green'}
							style={{fontSize: 20}}
							glyph={'climacon moon new'}
						/> : 
						<Icon
			              	className={'fg-red'}
			              	style={{fontSize: 20}}
			              	glyph={'climacon moon new'}
			            />
					}
				</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						title={__('Status')}
						data-item-status={item.is_active}
					/>
				</td>
			</tr>
		)
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-check';
			case 1:
				return 'icon-simple-line-icons-close';
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={8} className='text-center'>{__('No data found')}</td>
			</tr>
		)
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	search() {
		this.props.router.push('/admin/doctors');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/doctors');
	}

	startAdd() {
		this.props.dispatch(actions.doctor.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.doctor.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.doctor.edit(this.props, itemId));
	}

	saveBasicInfo() {
		this.props.dispatch(
			actions.doctor.saveBasicInfo(this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.doctor-basic-info-form')))
		);
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.doctor.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}

	renderAwardAddView(data, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<div key={'award-'+index}>
				<Row>
					<Col sm={6}>
						<FormGroup controlId="award_gratitude_title" validationState={this.props.errors['award_gratitude_title_'+index] ? 'error': null} >

						  	<FormControl
								type='text'
								placeholder={__('Awards / Gratitude Title')}
								value={this.props.doctorAwards[index].award_gratitude_title}
								name='award_gratitude_title'
								data-index={index}
								data-action-type={'UPDATE_AWARD_INPUT_VALUE'}
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['award_gratitude_title_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={4}>
						<FormGroup controlId="award_year" validationState={this.props.errors['award_year_'+index] ? 'error': null} >

						  	<FormControl
								componentClass="select"
								onChange={::this.updateAdditionalInfoInput}
								name='award_year'
								value={this.props.doctorAwards[index].award_year}
								data-index={index}
								data-action-type={'UPDATE_AWARD_INPUT_VALUE'}
							>
								<option value="">{__('Award Year')}</option>
								{
									this.yearValues.map((value, index) =>
										<option value={value} key={'year-'+value}>{
											value
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['award_year_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={2}>
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-close'}
							data-id={index}
							data-action-type="REMOVE_AWARD"
							onClick={::this.removeAdditionalInfo}
						/>
					</Col>
				</Row>
			</div>
		);
	}
	
	renderRegistrationAddView(data, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Well key={'regiatration-'+index}>
				<Row>
					<Col sm={12} className='text-right'>
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-close'}
							data-id={index}
							data-action-type="REMOVE_REGISTRATION"
							onClick={::this.removeAdditionalInfo}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={6}>
						<FormGroup controlId="council_registration_number" validationState={this.props.errors['council_registration_number_'+index] ? 'error': null} >
							<ControlLabel>{__('Council Registration Number')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('Council Registration Number')}
								value={this.props.doctorRegistrations[index].council_registration_number}
								name='council_registration_number'
								data-index={index}
								data-action-type={'UPDATE_REGISTRATION_INPUT_VALUE'}
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['council_registration_number_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId="council_name" validationState={this.props.errors['council_name_'+index] ? 'error': null} >
							<ControlLabel>{__('Council Name')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('Council Name')}
								value={this.props.doctorRegistrations[index].council_name}
								name='council_name'
								data-index={index}
								data-action-type={'UPDATE_REGISTRATION_INPUT_VALUE'}
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['council_name_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId="year_of_registration" validationState={this.props.errors['year_of_registration_'+index] ? 'error': null} >
							<ControlLabel>{__('Year of Registration')}</ControlLabel>
						  	<FormControl
								componentClass="select"
								onChange={::this.updateAdditionalInfoInput}
								name='year_of_registration'
								value={this.props.doctorRegistrations[index].year_of_registration}
								data-index={index}
								data-action-type={'UPDATE_REGISTRATION_INPUT_VALUE'}
							>
								<option value="">{__('Year of Registration')}</option>
								{
									this.yearValues.map((value, index) =>
										<option value={value} key={'year-'+value}>{
											value
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['year_of_registration_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId="formControlsFile" validationState={this.props.errors['reg_proof_'+index] ? 'error': null} >
							<ControlLabel>{__('Registration Proof')}</ControlLabel>
	                      	<FormControl type="file" name={'reg_proof___'+index}/>
	                      	<HelpBlock>{this.props.errors['reg_proof_'+index]}</HelpBlock>
	                    </FormGroup>
					</Col>
				</Row>
			</Well>
		);
	}
	

	renderExperienceAddView(data, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Well key={'experience-'+index}>
				<Row>
					<Col sm={12} className='text-right'>
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-close'}
							data-id={index}
							data-action-type="REMOVE_EXPERIENCE"
							onClick={::this.removeAdditionalInfo}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={6}>
						<FormGroup controlId="clinic_hospital_name" validationState={this.props.errors['clinic_hospital_name_'+index] ? 'error': null} >
							<ControlLabel>{__('Clinic / Hospital Name')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('Clinic / Hospital Name')}
								value={this.props.doctorExperiences[index].clinic_hospital_name}
								name='clinic_hospital_name'
								data-index={index}
								data-action-type="UPDATE_EXPERIENCE_INPUT_VALUE"
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['clinic_hospital_name_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId="designation" validationState={this.props.errors['clinic_hospital_name_'+index] ? 'error': null} >
							<ControlLabel>{__('Role / Designation')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('Role / Designation')}
								value={this.props.doctorExperiences[index].designation}
								name='designation'
								data-index={index}
								data-action-type="UPDATE_EXPERIENCE_INPUT_VALUE"
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['clinic_hospital_name_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col sm={4}>
						<FormGroup controlId="city_name" validationState={this.props.errors['city_name_'+index] ? 'error': null} >
							<ControlLabel>{__('City Name')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('City Name')}
								value={this.props.doctorExperiences[index].city_name}
								name='city_name'
								data-index={index}
								data-action-type="UPDATE_EXPERIENCE_INPUT_VALUE"
								onChange={::this.updateAdditionalInfoInput}
							/>
							<HelpBlock>{this.props.errors['city_name_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={4}>
						<FormGroup controlId="duration_from" validationState={this.props.errors['duration_from_'+index] ? 'error': null} >
							<ControlLabel>{__('Duration From')}</ControlLabel>
						  	<FormControl
								componentClass="select"
								onChange={::this.updateAdditionalInfoInput}
								name='duration_from'
								value={this.props.doctorExperiences[index].duration_from}
								data-index={index}
								data-action-type="UPDATE_EXPERIENCE_INPUT_VALUE"
							>
								<option value="">{__('Select')}</option>
								{
									this.yearValues.map((value, index) =>
										<option value={value} key={'year-'+value}>{
											value
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['duration_from_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={4}>
						<FormGroup controlId="duration_to" validationState={this.props.errors['duration_to_'+index] ? 'error': null} >
							<ControlLabel>{__('Duration To')}</ControlLabel>
						  	<FormControl
								componentClass="select"
								onChange={::this.updateAdditionalInfoInput}
								name='duration_to'
								value={this.props.doctorExperiences[index].duration_to}
								data-index={index}
								data-action-type="UPDATE_EXPERIENCE_INPUT_VALUE"
							>
								<option value="">{__('Select')}</option>
								{
									this.yearValues.map((value, index) =>
										<option value={value} key={'year-'+value}>{
											value
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['duration_to_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
			</Well>
		);
	}
	
	renderEducationAddView(data, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Well key={'education-'+index}>
				<Row>
					<Col sm={12} className='text-right'>
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-close'}
							data-id={index}
							data-action-type="REMOVE_EDUCATION"
							onClick={::this.removeAdditionalInfo}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={6}>
						<FormGroup controlId="tagtypeId" validationState={this.props.errors['tagtypeId_'+index] ? 'error': null} >
							<ControlLabel>{__('Qualification')}</ControlLabel>
							<FormControl
								componentClass="select"
								placeholder="select"
								onChange={::this.updateAdditionalInfoInput}
								name='tagtypeId'
								value={this.props.doctorEducations[index].tagtypeId}
								data-index={index}
								data-action-type="UPDATE_EDUCATION_INPUT_VALUE"
							>
								<option value="">{__('Qualification')}</option>
								{
									this.props.helperData.qualification_tags.map((value, index) =>
										<option value={value.value} key={'qual-tag-'+value.value}>{
											value.label
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['tagtypeId_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId="college_name" validationState={this.props.errors['college_name_'+index] ? 'error': null}>
							<ControlLabel>{__('College')}</ControlLabel>
						  	<FormControl
								type='text'
								placeholder={__('College')}
								value={this.props.doctorEducations[index].college_name}
								name='college_name'
								onChange={::this.updateAdditionalInfoInput}
								data-index={index}
								data-action-type="UPDATE_EDUCATION_INPUT_VALUE"
							/>
							<HelpBlock>{this.props.errors['college_name_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col sm={6}>
						<FormGroup controlId="year_of_passing" validationState={this.props.errors['year_of_passing_'+index] ? 'error': null}>
							<ControlLabel>{__('Year of passing')}</ControlLabel>
						  	<FormControl
								componentClass="select"
								onChange={::this.updateAdditionalInfoInput}
								name='year_of_passing'
								value={this.props.doctorEducations[index].year_of_passing}
								data-index={index}
								data-action-type="UPDATE_EDUCATION_INPUT_VALUE"
							>
								<option value="">{__('Select year')}</option>
								{
									this.yearValues.map((value, index) =>
										<option value={value} key={'year-'+value}>{
											value
										}</option>
									)
								}
							</FormControl>
							<HelpBlock>{this.props.errors['year_of_passing_'+index]}</HelpBlock>
						</FormGroup>
					</Col>
					<Col sm={6}>
						<FormGroup controlId={'education_'+index} validationState={this.props.errors['edu_proof_'+index] ? 'error': null}>
							<ControlLabel>{__('Qualification Proof')}</ControlLabel>
	                      	<FormControl type="file" name={'edu_proof___'+index} />
	                      	<HelpBlock>{this.props.errors['edu_proof_'+index]}</HelpBlock>
	                    </FormGroup>
					</Col>
				</Row>
			</Well>
		);
	}
	
	saveAdditionalInfo() {
		this.props.dispatch(
			actions.doctor.saveAdditionalInfo(
	   			this.props,
	   			new FormData(ReactDOM.findDOMNode(this).querySelector('.doctor-additional-info-form'))
	   		)
		);
	}

	updateGoogleMapAdressData(slug, value) {
		this.props.dispatch({
			type: 'UPDATE_GMAP_ADDRESS_VALUE',
			slug: slug,
			value: value
		});
	}

	addMoreAdditionalInfo(event) {
		let data_action = event.target.getAttribute('data-action-type');
		if(data_action) {
			this.props.dispatch({
				type: data_action,
				doctorProfileId: this.props.doctorBasicDetails.id
			});
		}
	}
	removeAdditionalInfo(event) {
		let index = event.target.getAttribute('data-id'), actionType = event.target.getAttribute('data-action-type');
		if(index && actionType) this.props.dispatch({ type: actionType, index })
	}
	updateAdditionalInfoInput(event) {
		let name = event.target.name, value = event.target.value, index = event.target.getAttribute('data-index'), actionType = event.target.getAttribute('data-action-type');
		if(actionType && index) this.props.dispatch({ type: actionType, name, value, dataIndex: index })
	}
}
