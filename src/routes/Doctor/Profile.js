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

import PersonalContactDetail from '../../components/Doctor/PersonalContactDetail';
import Award from '../../components/Doctor/Award';
import Membership from '../../components/Doctor/Membership';
import Service from '../../components/Doctor/Service';
import Experience from '../../components/Doctor/Experience';
import Registration from '../../components/Doctor/Registrations';
import Specialization from '../../components/Doctor/Specialization';
import Education from '../../components/Doctor/Education';
import Document from '../../components/Doctor/Document';
import ProfileView from '../../components/Doctor/ProfileView';
import ShiftDoctorFront from './ShiftDoctorFront';
import DoctorAddClinicFront from './DoctorAddClinicFront';
import ViewDoctorProfile from './ViewDoctorProfile';

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

const viewName = 'doctor_profile';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor_profile
}))
export default class DoctorProfile extends React.Component {
	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
    		let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.handleCreateNewProfileClick = event => {
			this.props.dispatch(
				actions.doctor_profile.createNewProfile(this.props)
			)
		}

		this.searchProfilesForm = event => {
			this.props.dispatch(
				actions.doctor_profile.getSearchProfileView()
			)
		}

		this.handleProfileSearchDataUpdate = event => {
			this.props.dispatch(actions.doctor_profile.updateProfileSearchData(event.target.name, event.target.value))
		}

		this.handleSelect = eventKey => {
			if(this.props.basicDetails.id == "") return false;
			if(eventKey === 'timing-info') this.props.dispatch(actions.doctor_profile.link_to_hospital_comp(this.props))
			this.props.dispatch({ type: 'UPDATE_TAB', tabKey: eventKey });
	  	}

	  	this.editProfile = event => {
	  		this.props.dispatch( actions.doctor_profile.edit(this.props) )
	  	}

	  	this.backToProfile = event => {
	  		this.props.dispatch( actions.doctor_profile.back_to_profile_view(this.props) )
	  	}

	  	this.handleClaimProfileRequest = event => {
	  		event.preventDefault();
	  		this.props.dispatch( actions.doctor_profile.sendClaimRequest(this.props, event.target.getAttribute('data-item-id')) )
	  	}

	  	this.cancelClaimRequest = event => {
	  		this.props.dispatch( actions.doctor_profile.cancelClaimRequest(this.props) )
	  	}

	  	this.handleViewDoctorProfileClick = event => {
	  		let itemId = event.target.dataset.itemid;
	  		this.props.dispatch( actions.doctor_profile.viewDoctorProfile(this.props, itemId) )
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor_profile.init(
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
			case 'VIEW_DOCTOR_PROFILE_SCREEN':
				content = this.viewDoctorProfile(__)
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
											<Col xs={6} md={9} lg={9} className='fg-white'>
												<h3>
													{ "SEARCH_PROFILE_VIEW" === this.props.viewState && __('Create Profile')}
													{ "WELCOME_SCREEN_VIEW" === this.props.viewState && __('Welcome to Wikicare')}
													{ "SEARCHED_PROFILES_VIEW" === this.props.viewState && __('Select your profile')}
													{ "PROFILE_VIEW" === this.props.viewState && __('My Profile')}
													{ "EDIT_PROFILE_VIEW" === this.props.viewState && __('Profile')}

													{
														"PROFILE_VIEW" === this.props.viewState && 0 === this.props.basicDetails.is_complete ?
														<span className="text-warning"> ({__('IncompleteProfile')})</span> :
														null
													}
													{ "VIEW_DOCTOR_PROFILE_SCREEN" === this.props.viewState && __('Profile Info')}
												</h3>
											</Col>
											<Col xs={6} md={3} lg={3} className="text-right">
												<h3>
													{
														this.props.viewState === 'PROFILE_VIEW' &&
														<Button inverse outlined style={{marginBottom: 5}} bsStyle='default' onClick={this.editProfile}>
															{__('Edit Profile')}
														</Button>
													}
													{
														this.props.viewState === 'EDIT_PROFILE_VIEW' && this.props.basicDetails.userId && 
														<Button inverse outlined style={{marginBottom: 5}} bsStyle='default' onClick={this.backToProfile} >
															{__('Back to profile')}
														</Button>
													}
													{ 
														"SEARCH_PROFILE_VIEW" === this.props.viewState && 
														this.props.session.associatedProfileData && 
														<Button inverse outlined style={{marginBottom: 5}} bsStyle='default' onClick={this.handleCreateNewProfileClick} >
															{__('Create New Profile')}
														</Button>
													}

													{ 
														"SEARCHED_PROFILES_VIEW" === this.props.viewState && 
														<Button inverse outlined style={{marginBottom: 5}} bsStyle='default' onClick={::this.backToSearch} >
															{__('Back to search')}
														</Button>
													}
													{
														"VIEW_DOCTOR_PROFILE_SCREEN" === this.props.viewState && 
														<Button inverse outlined style={{marginBottom: 5}} bsStyle='default' onClick={::this.backToSearchList} >
															{__('Back to search list')}
														</Button>	
													}
												</h3>
											</Col>
										</Row>
									</Grid>
								</PanelHeader>
								<PanelBody>
									<Grid className='abc'>
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
							<p dangerouslySetInnerHTML={{__html: __("It's let you reach your patients {{text1}}, {{text2}} like this.",{
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
									<img src="/imgs/icons/free-q-a.png"/>
									<p>{__('Wikicare profile lets you visible to the 100s of patients searching on wikicare app.')}</p>
								</div>
							</Col>
							<Col xs={12} sm={12} md={4} lg={4}>
								<div className='text-center img-blck'>
									<img src="/imgs/icons/chat-consult.png"/>
									<p>{__('Wikicare profile lets you online practice with patients.')}</p>
								</div>
							</Col>
							<Col xs={12} sm={12} md={4} lg={4}>
								<div className='text-center img-blck'>
									<img src="/imgs/icons/online-followups.png"/>
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

	renderprofileView(__) {
		return (
			<ProfileView data={this.props}/>
		);
	}

	renderEditProfileView(__) {
		return (
			<Accordion activeKey={this.props.activeTab}>
            	<BPanel header={__('Personal and Contact details')} eventKey="personal-info" onSelect={this.handleSelect}>
              		<PersonalContactDetail />
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'education-spec-info'} data-form-key='personal_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Education & Specialization')} eventKey="education-spec-info" onSelect={this.handleSelect}>
            		<Form className="edu_spec_info_form" id="edu_spec_info_form">
	            		<Education />
	            		<hr/>
	            		<Specialization />
	            	</Form>
            		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'registration-info'} data-form-key='edu_spec_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'personal-info'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Registration and Document')} eventKey="registration-info" onSelect={this.handleSelect}>
            		<Form className="reg_info_form">
            			<Registration />
            		</Form>
            		<br/>
            		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'ser-exp-info'} data-form-key='reg_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'education-spec-info'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Services & Experience')} eventKey="ser-exp-info" onSelect={this.handleSelect}>
            		<Form className="serv_exp_info_form">
            			<Service handleNewOptionClick={this.handleNewOptionClick}/>
            			<hr/>
            			<Experience />
            		</Form>
            		<br/>
            		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'award-mem-info'} data-form-key='serv_exp_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'timing-info'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Awards & Membership')} eventKey="award-mem-info" onSelect={this.handleSelect}>
            		<Form className="awd_mem_info_form">
            			<Award />
            			<hr/>
            			<Membership />
            		</Form>
            		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'photos-doc-info'} data-form-key='awd_mem_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'ser-exp-info'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Photos & Videos')} eventKey="photos-doc-info" onSelect={this.handleSelect}>
            		<Document data={this.props} />
              		<Row>
	                    <Col sm={12}>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'timing-info'} onClick={::this.changeTabs}>{__('Next')}</Button>
	                    	<Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'award-mem-info'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Clinics (Fees and Timings)')} eventKey="timing-info" onSelect={this.handleSelect}>
					<DoctorAddClinicFront  { ...this.props } />
              		{ /*<ShiftDoctorFront { ...this.props } /> */ }
            	</BPanel>
          	</Accordion>
		);
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
								<Image src={(this.props.profileSearchHelperData.requested_claimed_profile_detail.doctor_profile_pic ? imageUrl+'/'+this.props.profileSearchHelperData.requested_claimed_profile_detail.doctor_profile_pic : '/imgs/noimage.png')} className="img-responsive" circle/>
							</Col>
							<Col sm={9}>
								<h4>{this.props.profileSearchHelperData.requested_claimed_profile_detail.doctorprofiledetails[0].name}</h4>
								{contactInfo.join(" | ")}<br/>
								<p>
									{text_truncate(this.props.profileSearchHelperData.requested_claimed_profile_detail.doctorprofiledetails[0].about_doctor, 160)}
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
								<ControlLabel>{__('Doctor Name')} <span className='text-danger'>*</span></ControlLabel>
								<FormControl
									type='text'
									placeholder={__('Doctor Name')}
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
	          				<img src="/imgs/doct/phone.png" />
	          			</Col>
	          		</Row>
	        	</div>
			);
		}
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
						<Button outlined lg bsStyle='lightgreen' onClick={this.handleCreateNewProfileClick}>{__('Click to create new profile')}</Button>
					</div>
				}
			</div>
		)
	}
	handleProfileSearch() {
		this.props.dispatch(actions.doctor_profile.getProfilesToClaim(this.props, this.props.profileSearch))
	}
	renderSearchedProfiles(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let tagtypeIds = utilsActions.tagtypeIds();
	    let specializationTagId = tagtypeIds.SpecializationTagId;
	    let specializationTags = [];
	    item.doctortags.map((tagdetails) => {
	      	if(tagdetails.tagtypeId == specializationTagId) specializationTags.push(tagdetails.tag.tagdetails[0].title)
	    })

		let contactEmail = [], contactMobile = [], education = [];
		item.contactinformations.map((conItem) => {
			if(conItem.type === 'email') { contactEmail.push(conItem.value) }
			if(conItem.type === 'mobile') { contactMobile.push(conItem.value) }
		})
		let getTotalExperience = utilsActions.getTotalExperienceOfDoctor(item.doctorexperiences)
		item.doctoreducations.map((conItem) => {
			education.push(conItem.tag.tagdetails[0].title)
		})
		return (
			<Row key={'sp-'+index} className="srch-list-item">
				<div style={{padding: '32px 0px'}}>
					<Col xs={12} md={2} lg={2}>
	      				<Image src={imageUrl + item.doctor_profile_pic} circle />
	      			</Col>
	      			<Col xs={12} md={7} lg={7}>
	      				<h4>{item.doctorprofiledetails[0].name}</h4>
	      				<p>
							{specializationTags.join(" , ")} { specializationTags.length > 0 && " | " }
							{ education.join(" , ") } { education.length > 0 && " | " }
							{ getTotalExperience > 0 ? getTotalExperience+__(" year(s) exp.") : null }
							{ (specializationTags.length > 0 || education.length > 0 || getTotalExperience > 0) && <br/> }


			              	{contactEmail.join(" | ")} | {contactMobile.join(" | ")}<br/>
			              	{item.doctorprofiledetails[0].address_line_1} | {item.city.citydetails[0].name} | {item.state.statedetails[0].name} | {item.country.countrydetails[0].name}
			            </p>
	      			</Col>
	      			<Col xs={12} md={3} lg={3}>
	      				<div>
	      					<Button outlined bsStyle='lightgreen' data-itemid={item.id} onClick={this.handleViewDoctorProfileClick}>{__('View profile')}&nbsp;</Button>
	      					<Button outlined bsStyle='lightgreen' data-item-id={item.id} style={{marginTop: '9px'}} onClick={this.handleClaimProfileRequest}>{__('Claim profile')}</Button>
	      				</div>
	      			</Col>
      			</div>
      		</Row>
		)
	}

	saveData(event) {
		const saveActions = {
			personal_info_form: 'saveBasicInfo',
			edu_spec_info_form: 'saveEduSpecInfo',
			reg_info_form: 'saveRegistrationInfo',
			serv_exp_info_form: 'saveExpInfo',
			awd_mem_info_form: 'saveAwdMemInfo',
			doc_form: 'saveDoc'
		}
		this.props.dispatch(
			actions.doctor_profile[saveActions[event.target.getAttribute('data-form-key')]](this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.'+event.target.getAttribute('data-form-key'))), event.target.getAttribute('data-tab-key'))
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

    sendClinicClaimrequest(event) {
    	this.props.dispatch({type: 'SHOW_SEARCHED_PROFILES'})
    }

    viewDoctorProfile(__) {
    	return (
    		<div key={'view-doc-profile'}>
    			<ViewDoctorProfile data={this.props.viewOtherDoctorProfile} handleClaimProfileRequest={this.handleClaimProfileRequest} />
    		</div>
    	)
    }
}
