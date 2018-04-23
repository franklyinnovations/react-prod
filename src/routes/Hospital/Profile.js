import React from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

import actions from '../../redux/actions';
import Loading from '../../components/Loading';

import makeTranslater from '../../translate';
import Select from '../../components/Select';
import * as utilsActions from '../../utils';
import {imageUrl} from '../../../api/config';
import {text_truncate} from '../../utils';

import BasicDetail from '../../components/Hospital/BasicDetail';
import Award from '../../components/Hospital/Award';
import Membership from '../../components/Hospital/Membership';
import Specialization from '../../components/Hospital/Specialization';
import Service from '../../components/Hospital/Service';
import Document from '../../components/Hospital/Document';
import InsuranceCompanies from '../../components/Hospital/InsuranceCompanies';
import Shift from '../../components/Hospital/Shift';
import DoctorMap from '../../components/Hospital/DoctorMap';
import ProfileView from '../../components/Hospital/ProfileView';

import Pagination from '../../components/Pagination';
import ViewHospitalProfile from './ViewHospitalProfile';

import {
	getStatusLabel,
	getStatusIcon,
	getStatusTitle,
	getStatusOptions,
	renderFilterLabel,
} from '../../utils';

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
	Popover,
	Accordion,
	BPanel,
	Media,
	Well,
	Image,
	Jumbotron
}  from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'hospital_profile';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.hospital_profile
}))
export default class HospitalProfile extends React.Component {
	constructor(props) {
		super(props);

		this.handleProfileSearchDataUpdate = event => {
			this.updateProfileSearchData(event.target.name, event.target.value)
		}

		this.handleCreateNewProfileClick = event => {
			this.props.dispatch(
				actions.hospital_profile.createNewProfile(this.props)
			)
		}

		this.handleSelect = eventKey => {
			if(this.props.basicDetails.id == "") return false;
			this.props.dispatch({
	            type: 'UPDATE_TAB',
	            tabKey: eventKey
	        });
	  	}

	  	this.editProfile = event => {
	  		this.props.dispatch(
				actions.hospital_profile.edit(this.props)
			)
	  	}

	  	this.backToProfile = event => {
	  		this.props.dispatch(
				actions.hospital_profile.back_to_profile_view(this.props)
			)
	  	}

	  	this.handleClaimProfileRequest = event => {
	  		event.preventDefault();
	  		this.props.dispatch(
	  			actions.hospital_profile.sendClaimRequest(this.props, event.target.getAttribute('data-item-id'))
	  		)
	  	}

	  	this.cancelClaimRequest = event => {
	  		this.props.dispatch(
	  			actions.hospital_profile.cancelClaimRequest(this.props)
	  		)
	  	}

	  	this.searchProfilesForm = event => {
			this.props.dispatch(
				actions.hospital_profile.getSearchProfileView()
			)
		}

		this.handleViewHospitalProfileClick = event => {
	  		let itemId = event.target.dataset.itemid;
	  		this.props.dispatch(
	  			actions.hospital_profile.viewHospitalProfile(this.props, itemId)
	  		)
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.hospital_profile.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		
		switch(this.props.viewState) {
			case 'SEARCH_PROFILE_VIEW':
				content = this.searchProfilesView(__);
				break;
			case 'PROFILE_VIEW':
				content = this.renderprofileView(__);
				break;
			case 'EDIT_PROFILE_VIEW':
				content = this.renderEditProfileView(__)
				break;
			case 'WELCOME_SCREEN_VIEW':
				content = this.getWelcomeScreen(__)
				break;
			case 'SEARCHED_PROFILES_VIEW':
				content = this.searchedProfilesView(__)
				break;
			case 'VIEW_HOSPITAL_PROFILE_SCREEN':
				content = this.viewHospitalProfile(__)
				break;
			default:
				content = this.getWelcomeScreen(__);
		}
		
		return (
			<div id="profile-info">
				<Row>
					<Col xs={12}>
						<PanelContainer controls={false} className="overflow-visible">
							<Panel>
								<PanelHeader className='bg-green'>
									<Grid>
										<Row>
											<Col xs={6} md={8} lg={8} className='fg-white'>
												<h3>
													{ "WELCOME_SCREEN_VIEW" === this.props.viewState && __('Welcome to Wikicare')}
													{ "SEARCH_PROFILE_VIEW" === this.props.viewState && __('Create Profile')}
													{ "EDIT_PROFILE_VIEW" === this.props.viewState && __('Profile') }
													{ "PROFILE_VIEW" === this.props.viewState && __('My Profile')}
													{ "SEARCHED_PROFILES_VIEW" === this.props.viewState && __('Select your profile')}
													
													{
														"PROFILE_VIEW" === this.props.viewState && 0 === this.props.basicDetails.is_complete ?
														<span className="text-warning"> ({__('Profile Incomplete')})</span> :
														null
													}
													{ "VIEW_HOSPITAL_PROFILE_SCREEN" === this.props.viewState && __('Profile Info')}
												</h3>
											</Col>
											<Col xs={6} md={4} lg={4} className="text-right">
												<h3>
													{
														this.props.viewState === 'PROFILE_VIEW' &&
															<span>
																<Button
																	inverse
																	outlined
																	style={{marginBottom: 5}}
																	bsStyle='default'
																	onClick={this.editProfile}
																>
																	{__('Edit Profile')}
																</Button>
																<Button
																	inverse
																	outlined
																	style={{marginBottom: 5}}
																	bsStyle='default'
																	onClick={this.searchProfilesForm}
																>
																	{__('Add New Profile')}
																</Button>
															</span>
													}
													{
														this.props.viewState === 'EDIT_PROFILE_VIEW' && this.props.basicDetails.userId && 
														<Button
															inverse
															outlined
															style={{marginBottom: 5}}
															bsStyle='default'
															onClick={this.backToProfile}
														>
															{__('Back to profile')}
														</Button>
													}
													{ 
														"SEARCHED_PROFILES_VIEW" === this.props.viewState && 
														<Button
															inverse
															outlined
															style={{marginBottom: 5}}
															bsStyle='default'
															onClick={::this.backToSearch}
														>
															{__('Back to search')}
														</Button>
													}

													{
														"VIEW_HOSPITAL_PROFILE_SCREEN" === this.props.viewState && 
														<Button
															inverse
															outlined
															style={{marginBottom: 5}}
															bsStyle='default'
															onClick={::this.backToSearchList}
														>
															{__('Back to search list')}
														</Button>
													}
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
				</Row>
			</div>
		);
	}

	getWelcomeScreen(__) {
		return (
			<Row>
				<div id="welcome-screen-doc">
					<Col sm={12}>
						<div className='text-center wel-heading-blk'>
							<p dangerouslySetInnerHTML={{__html: __("Let's get started on {{text1}} by making your {{text2}}.",{
								text1: '<span>'+__('Wikicare')+'</span>', text2: '<span>'+__('Wikicare Profile')+'</span>'
							})}} />
							<p dangerouslySetInnerHTML={{__html: __("It's let you reach your patients {{text1}}, {{text2}}.",{
								text1: '<span>'+__('anytime')+'</span>', text2: '<span>'+__('anywhere')+'</span>'
							})}}/>
						</div>
					</Col>
					<Col sm={12} className='text-center dbl-line-img'>
						<img src='/imgs/doct/heading-after-line.png' />
					</Col>
					<Col sm={12}>
						<Row>
							<Col xs={12} sm={12} md={4} lg={4}>
								<div className='text-center img-blck'>
									<img src="/imgs/icons/hos_icon1.png"/>
									<p>{__('Wikicare profile lets your hospital/clinic visible to 100s of patients and to grow your practice.')}</p>
								</div>
							</Col>
							<Col xs={12} sm={12} md={4} lg={4}>
								<div className='text-center img-blck'>
									<img src="/imgs/icons/hos_icon3.png"/>
									<p>{__('Wikicare profile allows patients to book appointments for your clinic/hospital doctors online and reduce queues.')}</p>
								</div>
							</Col>
							<Col xs={12} sm={12} md={4} lg={4}>
								<div className='text-center img-blck'>
									<img src="/imgs/icons/hos_icon2.png"/>
									<p>{__('Wikicare profile gives access to all customer feedbacks.')}</p>
								</div>
							</Col>
						</Row>
					</Col>
					<Col sm={12}>
						<div className='text-center new-prfl-crt-blk'>
							<Button className="btn btn-lg" onClick={this.searchProfilesForm}>{__('Create Profile')}</Button>
						</div>
					</Col>
				</div>
			</Row>
		)
	}

	renderEditProfileView(__) {
		return (
			<Accordion activeKey={this.props.activeTab}>
            	<BPanel header={__('Clinic Details')} eventKey="basic-info-form" onSelect={this.handleSelect}>
            		<BasicDetail />
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} data-form-key='basic_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Specialization & Services')} eventKey="spec-services-info-form" onSelect={this.handleSelect}>
            		<Form className="spec_services_info_form">
            			<Specialization />
            			<hr/>
            			<Service />
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} data-form-key='spec_services_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'basic-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Awards & Memberships')} eventKey="awd-mem-info-form" onSelect={this.handleSelect}>
            		<Form className="awd_mem_info_form">
            			<Award />
            			<hr/>
            			<Membership />
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'documents-info-form'} data-form-key='awd_mem_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Clinic Photos/Videos/Certificates/Documents')} eventKey="documents-info-form" onSelect={this.handleSelect}>
            		<Document data={this.props} />
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'insur-comp-info-form'} onClick={::this.changeTabs}>{__('Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Insurance Companies')} eventKey="insur-comp-info-form" onSelect={this.handleSelect}>
            		<Form className="insur_comp_info_form">
            			<InsuranceCompanies />
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'clinic-timings-info-form'} data-form-key='insur_comp_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Clinic Timings')} eventKey="clinic-timings-info-form" onSelect={this.handleSelect}>
            		<Shift
	      				data={this.props}
    				/>
            	</BPanel>
            	<BPanel header={__('Doctors (Fee & Timings)')} eventKey="doc-fee-timings-info-form" onSelect={this.handleSelect}>
						{ this.props.basicDetails.is_freeze === 1 && <DoctorMap /> }
						{ this.props.basicDetails.is_freeze === 0 && <h3 className="text-center">{__('Please freeze your time first.')}</h3> }
              		<Row>
	                    <Col sm={12}>
	                        
	                    </Col>
	                </Row>
            	</BPanel>
          	</Accordion>
		);
	}

	searchedProfilesView(__) {
		return (
			<div id="searched-profiles-view">
				{this.props.searchedProfiles.isLoading && <Loading />}
				{
					this.props.searchedProfiles.data.length > 0 && 
					(
						<Row>
							<Col sm={12} className='srch-info-blk'>
								<div className='srch-info-blk-cnt'>
									<h4 dangerouslySetInnerHTML={{__html: __("We found {{text1}} matching profile.",{
										text1: this.props.searchedProfiles.data.length
									})}} />
									<p>{__('Please select your profile to claim')}</p>
								</div>
							</Col>
						</Row>
					)
				}
				{ 
					0 === this.props.searchedProfiles.data.length && 
					<Row>
						<Col sm={12}>
							<div className='text-center srch-info-blk-cnt'>
								<h4>{__('No matching profiles were found')}</h4>
							</div>
						</Col>
					</Row>
				}
				
				<div className='searched-profiles-listing'>
					{this.props.searchedProfiles.data.map(this.renderSearchedProfiles, this)}
				</div>

				{
					this.props.searchedProfiles.create_new_profile_btn_display && 
					<div className='text-center nw-prfl-lnk-blk'>
						<Button outlined lg bsStyle='lightgreen' onClick={this.handleCreateNewProfileClick}>{__('click to create new profile')}</Button>
					</div>
				}
			</div>
		)
	}

	searchProfilesView(__) {
		if(this.props.profileSearchHelperData.is_claim_request_pending) {
			let contactInfo = [];
			this.props.profileSearchHelperData.requested_claimed_profile_detail.contactinformations.map((val) => { contactInfo.push(val.value) })
			return (
				<Row>
					<Col xs={12} md={12} lg={12}>
						<BPanel header={__('This profile has been claimed successfully. Once your claim request will be approved, you will be able to manage the profile.')} bsStyle="info">
	  						<Col sm={3}>
								<Image src={(this.props.profileSearchHelperData.requested_claimed_profile_detail.hospital_logo ? imageUrl+'/'+this.props.profileSearchHelperData.requested_claimed_profile_detail.hospital_logo : '/imgs/noimage.png')} className="img-responsive" circle/>
							</Col>
							<Col sm={9}>
								<h4>{this.props.profileSearchHelperData.requested_claimed_profile_detail.hospitaldetails[0].hospital_name}</h4>
								{contactInfo.join(" | ")}<br/>
								<p>
									{text_truncate(this.props.profileSearchHelperData.requested_claimed_profile_detail.hospitaldetails[0].about_hospital, 160)}
								</p>
								<p><Button outlined bsStyle='lightgreen' onClick={::this.cancelClaimRequest}>{__('CancelRequest')}</Button></p>
							</Col>
						</BPanel>
					</Col>
				</Row>
			)
		} else {
			return (
				<div key="search-profile-form" id="doc-search-profile">
					<Row>
	          			<Col xs={12} md={6} lg={6} sm={12}>
	          				<FormGroup>
								<ControlLabel>{__('Clinic/Hospital Name')} <span className='text-danger'>*</span></ControlLabel>
								<FormControl
									type='text'
									placeholder={__('Name')}
									value={this.props.profileSearch.name}
									name='name'
									onChange={this.handleProfileSearchDataUpdate}
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>{__('Mobile')}</ControlLabel>
								<FormControl
									type='text'
									placeholder={__('Mobile')}
									value={this.props.profileSearch.mobile}
									name='mobile'
									onChange={this.handleProfileSearchDataUpdate}
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>{__('Email')}</ControlLabel>
								<FormControl
									type='text'
									placeholder={__('Email')}
									value={this.props.profileSearch.email}
									name='email'
									onChange={this.handleProfileSearchDataUpdate}
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>{__('City')} <span className='text-danger'>*</span></ControlLabel>
								<Select
									name='selected_city'
									onChange={this.handleProfileSearchDataUpdate}
									value={this.props.profileSearch.selected_city}
									options={this.props.profileSearchHelperData.cities}/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>{__('Specializations')} <span className='text-danger'>*</span></ControlLabel>
								<Select
									name='selected_specialization'
									onChange={this.handleProfileSearchDataUpdate}
									value={this.props.profileSearch.selected_specialization}
									options={this.props.profileSearchHelperData.specializations}/>
							</FormGroup>
						<FormGroup>
          					<Button 
          						onClick={::this.handleProfileSearch} 
          						disabled={!(this.props.profileSearch.name && this.props.profileSearch.selected_city && this.props.profileSearch.selected_specialization)}
          					>{__('Create Profile')}</Button>
          				</FormGroup>
	          			</Col>
	          			<Col xs={12} md={6} lg={6} sm={12} className='text-center'>
	          				<img src="/imgs/doct/hospital_profile.png" />
	          			</Col>
	          		</Row>
	        	</div>
			);
		}
	}

	renderprofileView(__) {
		return (
			<ProfileView data={this.props}/>
		);
	}

	renderSearchedProfiles(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let contactEmail = [], contactMobile = [];
		item.contactinformations.map((conItem) => {
			if(conItem.type === 'email' && conItem.is_primary === 1) { contactEmail.push(conItem.value) }
			if(conItem.type === 'mobile' && conItem.is_primary === 1) { contactMobile.push(conItem.value) }
		})
		return (
			<Row key={'sp-'+index} className="srch-list-item">
				<div style={{padding: '32px 0px'}}>
	      			<Col xs={12} md={2} lg={2}>
	      				<Image src={imageUrl + '/' + item.hospital_logo} circle />
	      			</Col>
	      			<Col xs={12} md={7} lg={7}>
	      				<h4>{item.hospitaldetails[0].hospital_name}</h4>
	      				<p>{contactEmail.join(" | ")} | {contactMobile.join(" | ")}</p>
	      				<p>{item.hospitaldetails[0].address} | {item.city.citydetails[0].name} | {item.state.statedetails[0].name} | {item.country.countrydetails[0].name}</p>
	      			</Col>
	      			<Col xs={12} md={3} lg={3}>
	      				<div>
	      					<Button outlined bsStyle='lightgreen' data-itemid={item.id} onClick={this.handleViewHospitalProfileClick}>{__('View profile')}&nbsp;</Button>
	      					<Button outlined bsStyle='lightgreen' style={{marginTop: '9px'}} data-item-id={item.id} onClick={this.handleClaimProfileRequest}>{__('Claim profile')}</Button>
	      				</div>
	      			</Col>
	      		</div>
      		</Row>
		)
	}

	updateProfileSearchData(name, value) {
		this.props.dispatch(actions.hospital_profile.updateProfileSearchData(name, value))
	}
	handleProfileSearch() {
		this.props.dispatch(actions.hospital_profile.getProfilesToClaim(this.props, this.props.profileSearch))
	}

	saveData(event) {
		const saveActions = {
			basic_info_form: 'saveBasicInfo',
			spec_services_info_form: 'saveSpecServInfo',
			awd_mem_info_form: 'saveAwardMembershipsInfo',
			insur_comp_info_form: 'saveInsuranceCompanies',
		}
		this.props.dispatch(
			actions.hospital_profile[saveActions[event.target.getAttribute('data-form-key')]](this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.'+event.target.getAttribute('data-form-key'))), event.target.getAttribute('data-tab-key'))
		);
    }

    changeTabs(event) {
    	this.props.dispatch({
            type: 'UPDATE_TAB',
            tabKey: event.target.getAttribute('data-tab-key')
        });
    }

    backToSearch() {
    	this.props.dispatch({type: 'BACK_TO_SEARCH'})
    }

    backToSearchList() {
    	this.props.dispatch({type: 'BACK_TO_SEARCH_LIST'})
    }

    viewHospitalProfile(__) {
    	return (
    		<div key={'view-hos-profile'}>
    			<ViewHospitalProfile data={this.props.viewOtherHospitalProfile} handleClaimProfileRequest={this.handleClaimProfileRequest} />
    		</div>
    	)
    }
}

