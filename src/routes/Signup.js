import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
//import Signup from '../components/Signup';
import { webUrl } from '../../api/config';
import actions from '../redux/actions';
import Header from '../front/Header';
import Footer from '../front/Footer';
import makeTranslater from '../translate';

import {
	Row,
	Col,
	Icon,
	Grid,
	Form,
	Badge,
	Panel,
	Button,
	PanelBody,
	FormGroup,
	LoremIpsum,
	InputGroup,
	FormControl,
	ButtonGroup,
	ButtonToolbar,
	PanelContainer,
	Tabs,
	Tab,
	HelpBlock,
	Checkbox
} from '@sketchpixy/rubix';

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	location: state.location,
	...state.view.signup
}))
export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'login'
		}

		this.props.dispatch(actions.signup.getSignupMetaData());
	}

	static fetchData(store) {
		store.dispatch(actions.signup.init());
	}

	componentWillMount(){
		if(this.props.location && this.props.location.query && this.props.location.query.tab ==='signup'){
			this.setState({activeTab: 'signup'});

			if(this.props.location.query.name){
				this.props.dispatch(
					actions.signup.updateSignUpData(
						'name',
						this.props.location.query.name
					)
				);
			}

			if(this.props.location.query.mobile){
				this.props.dispatch(
					actions.signup.updateSignUpData(
						'mobile',
						this.props.location.query.mobile
					)
				);
			}
		}

	};

	handleUpdateEmail = event => {
		this.props.dispatch({
			type: 'UPDATE_FORGOT_PASSWORD_EMAIL',
			name: event.target.name,
			value: event.target.value
		});
	};

	handleSelect(eventKey) {
		this.setState({activeTab: eventKey})
	}

	showForgotPassword() {
		this.props.dispatch({
			type: 'SHOW_FORGOT_PASSWORD'
		});
	}

	login(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.dispatch(
			actions.signup.sendLoginRequest(
				this.props.login.email,
				this.props.login.password
			)
		);
	}

	signup(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.dispatch(
			actions.signup.sendSignupRequest(
				this.props,
				this.props.signup
			)
		);
	}

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<div id='front2'>
				<Header />
				<div className="bg-gray-color">
					<div className="patient-search-sec">		 
					</div>
					<div className="patient-search-detail-sec patient-search-login">
						<div className="container">
							<div className="row">
								<div className="col-md-6">
									<div className="doctor-banner-detail">
										<h1>{__('Patients are looking for healers like you!')}</h1>
										<p>{__('Wikicare offers a whole new approach to practising medicine. With our unique patient care and practice management options, medical practice is smarter, simpler and secure. Join our team of medical professionals and start healing today.')}
									   </p>										
										 <img src="/imgs/home/dr-thumb.png" />
									</div>
								</div>
								<div className="col-md-6">
									<div className="doctor-banner-forms">
										<div className="ld-wrapper">						{
												this.props.forgotPassword ? this.renderForgotPassword():
												<Tabs defaultActiveKey={this.state.activeTab} onSelect={::this.handleSelect} id="user-login-tab">
													<Tab eventKey={'login'} title={__('Login')}><br/>
														<Form onSubmit={::this.login} className="loginForm" >
															<FormGroup
																controlId='username'
																validationState={this.props.errors.username ? 'error': null}
															>	 
																<label>{__('Email ID / Mobile Number')}</label>
																<FormControl
																	autoFocus
																	type='text'
																	className='form-control'
																	onChange={::this.updateLoginEmail}
																	value={this.props.login.username}
																/>
																<HelpBlock>{this.props.errors.username}</HelpBlock>
															</FormGroup>
															<FormGroup
																controlId='userpassword'
																validationState={this.props.errors.userpassword ? 'error': null}
															>	 
																<label>{__('Password')}</label>
																<FormControl
																	type='password'
																	className='form-control'	
																	onChange={::this.updateLoginPassword}
																	value={this.props.login.password}
																/>
																<HelpBlock>{this.props.errors.userpassword}</HelpBlock>
															</FormGroup>
															{/*<FormGroup
																controlId='agreed_to_terms'
																validationState={this.props.errors.agreed_to_terms ? 'error': null}
															>
																<div>
																	<Checkbox checked={this.props.signup.agreed_to_terms} onChange={::this.handleSignUpData} inline value='1' name='agreed_to_terms'><span className="icon-holder"></span> 
																	Login with OTP instead of password</Checkbox>
																</div>
																<HelpBlock>{this.props.errors.agreed_to_terms}</HelpBlock>
															</FormGroup>*/}
															<div className="form-group">
																<input
																	type='submit'
																	value={__('Login')}
																	className="submit"
																	onClick={::this.login} />			
															</div>
															<div className="form-group text-center">
																<a 
																	className="forgotpass"
																	onClick={::this.showForgotPassword}>
																	{__('Forgot password')}?
																</a>										
															</div>	
														</Form>
													</Tab>
													<Tab eventKey={'signup'} title={__('Signup')}><br/>
														<Form className="signupForm" onSubmit={::this.signup}>
															<FormControl
																name='user_type'
																type="hidden"
																value={this.props.signup.user_type}
															>
															</FormControl>
															<Row>
																<Col xs={12} md={12}>
																	<FormGroup
																		controlId='roleId'
																		validationState={this.props.errors.roleId ? 'error': null}
																	>	 <label>{__('Role')}</label>
																		<FormControl
																			componentClass="select"
																			placeholder="select"
																			name='roleId'
																			onChange={::this.handleSignUpRoleChange}
																			value={this.props.signup.roleId}
																		>
																			<option value="" data-role-slug="">{__('Select Role')}</option>
																			{
																				this.props.helperData.roles.map((item, index) =>
																					<option value={item.id} key={'option-'+index} data-role-slug={item.slug}>{item.roledetails[0].name}</option>
																				)
																			}
																		</FormControl>
																		<HelpBlock>{this.props.errors.roleId}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col xs={12} md={12}>
																	<FormGroup
																		controlId='name'
																		validationState={this.props.errors.fullname ? 'error': null}
																	>	 <label>{__('Full Name')}</label>
																		<FormControl
																			type='text'
																			className='form-control'
																			name='name'
																			onChange={::this.handleSignUpData}
																			value={this.props.signup.name}
																			placeholder=""
																		/>
																		<HelpBlock>{this.props.errors.fullname}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col xs={4} md={4}>
																	<FormGroup
																		controlId='phone_code'
																		validationState={this.props.errors.phone_code ? 'error': null}
																	>	 <label>{__('Mobile Number')}</label>
																		<FormControl
																			componentClass="select"
																			placeholder="select"
																			name='phone_code'
																			onChange={::this.handleSignUpData}
																			value={this.props.signup.phone_code}
																		>
																			<option value="+91">+91(IND)</option>
																			<option value="+966">+966(SAU)</option>
																		</FormControl>
																		<HelpBlock>{this.props.errors.phone_code}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col xs={8} md={8}>
																	<FormGroup
																		controlId='mobile'
																		validationState={this.props.errors.mobile ? 'error': null}
																	>	 <label>&nbsp;</label>
																		<FormControl
																			type='text'
																			className='form-control'
																			name='mobile'
																			onChange={::this.handleSignUpData}
																			value={this.props.signup.mobile}
																			placeholder=""
																		/>
																		<HelpBlock>{this.props.errors.mobile}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col xs={12} md={12}>
																	<FormGroup
																		controlId='email'
																		validationState={this.props.errors.email ? 'error': null}
																	>	 
																		<label>{__('Email Id')}</label>
																		<FormControl
																			type='text'
																			className='form-control'
																			name='email'
																			onChange={::this.handleSignUpData}
																			value={this.props.signup.email}
																			placeholder=""
																		/>
																		<HelpBlock>{this.props.errors.email}</HelpBlock>
																	</FormGroup>
																</Col>
																
																<Col xs={12} md={12}>
																	<FormGroup
																		controlId='password'
																		validationState={this.props.errors.password ? 'error': null}
																	>	 
																	<label>{__('Create Password')}</label>
																		<FormControl
																			type='password'
																			className='form-control'
																			name='password'
																			onChange={::this.handleSignUpData}
																			value={this.props.signup.password}
																			placeholder=""
																		/>
																		<HelpBlock>{this.props.errors.password}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col xs={12} md={12}>
																	<FormGroup
																		controlId='agreed_to_terms'
																		validationState={this.props.errors.agreed_to_terms ? 'error': null}
																	>
																		<div>
																			<Checkbox checked={this.props.signup.agreed_to_terms} onChange={::this.handleSignUpData} inline value='1' name='agreed_to_terms'><span className="icon-holder"></span> {__('I agree for Signing Terms & Conditions')}</Checkbox>
																		</div>
																		<HelpBlock>{this.props.errors.agreed_to_terms}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
															<div className="form-group">
																<input
																	type='submit'
																	className="submit"
																	value={__('Signup')}
																	onClick={::this.signup}/>
															</div>
														</Form>
													</Tab>
												</Tabs>
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="create-wiki-profile create-wiki-login">
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<div className="row">
									<div id="create-profile-ad">
										<div className="col-sm-12">
											<h3>{__('Create your Wikicare profile in 3 simple steps')}</h3>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/register-icon.png" />
											<h4>{__('Register or find yourself on Wikicare.com')}</h4>
											<p>
												{__('Enter your name, email id, mobile number and clinic or establishment name.')}
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/profile-info-icon.png" />
											<h4>{__('Add your profile information')}</h4>
											<p>
												{__('Fill your about you and your practice including your medical registration, fees, timings and more.')}'
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/help-icon.png" />
											<h4>{__('Help us verify your details')}</h4>
											<p>
												{__('Complete our a simple verification process online, and go live.')}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}

	renderForgotPassword() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<div className="forgotForm">
				<div className='text-center'>
					<h2>
						{__('Forgot Password')}
					</h2>
				</div>
				<FormGroup
					controlId='email'
					validationState={this.props.errors.email ? 'error': null}
				>	 <label>{__('Email')}</label>
					<FormControl
						autoFocus
						type='text'
						name='email'
						className='form-control'
						placeholder=''
						onChange={this.handleUpdateEmail}
						value={this.props.forgotPassword.email}
					/>
					<HelpBlock>{this.props.errors.email}</HelpBlock>
				</FormGroup>
				<div className="form-group">
					<input
						type='submit'
						value={__('Submit')}
						className="submit"
						onClick={::this.forgotPassword}						
					/>
				</div>
				<div className="form-group text-center">					
					<a 
						className="forgotpass"
						onClick={::this.showForgotPassword}>
						{__('Back To Login')}
					</a>
				</div>
			</div>
		);
	}

	forgotPassword() {
		this.props.dispatch(
			actions.signup.forgotPassword(this.props)
		);
	}

	updateLoginEmail(event) {
		this.props.dispatch(actions.signup.updateLoginEmail(event.target.value));
	}

	updateLoginPassword(event) {
		this.props.dispatch(actions.signup.updateLoginPassword(event.target.value));
	}

	updateLoginData(event) {
		this.props.dispatch(actions.signup.updateLoginData(event.target.name, event.target.value))
	}

	updateSignUpData(event) {
		this.props.dispatch(actions.signup.updateSignUpData(event.target.name, event.target.value))
	}

	handleSignUpData(event) {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked ? 1 : 0;
		else
			value = event.target.value;

		this.props.dispatch(
			actions.signup.updateSignUpData(
				event.target.name,
				value
			)
		)
	}

	handleSignUpRoleChange(event) {
		var index = event.target.selectedIndex;
		var optionElement = event.target.childNodes[index]
		var user_type =	optionElement.getAttribute('data-role-slug');

		this.props.dispatch(
			actions.signup.updateSignUpRoleData(
				event.target.name,
				event.target.value,
				user_type
			)
		)
	}
}
