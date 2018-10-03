import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';
import {
	FormGroup,
	HelpBlock,
} from '../components';

import makeTranslater from '../translate';
import {getInputValue} from '../utils';

import * as actions from '../redux/actions/partners';
import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/partners';
addView('partners', reducer);

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Partners extends React.Component {
	static fetchData(store) {
		store.dispatch(actions.init());
	}

	update = event => this.props.dispatch(
		actions.update(
			event.target.getAttribute('data-action-type'),
			event.target.name,
			getInputValue(event.target)
		)
	);

	submit = () => this.props.dispatch(actions.submit(this.props));

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front'>
				<Header/>
				<Banner inner>
					<h1>{_('RESELLER PARTNER')}</h1>
				</Banner>
				<section className="faq-section cloudy-bg partner-section">
					<div className="heading-container">
						<h2 className="section-heading">{_('Know Your Benefits')}</h2>
						<p>
							<strong>{_('Partners are the extensions of Pateast')}</strong>
							<br/>
							{_('We partner with innovative organizations whose domain expertise is in Education sector and have engaged relationships with Educational institutions in their geographies')}
						</p>
						<ul className="center-btns">
							<li><a href="#" className="btn btn-rouned btn-primary">{_('Become a Partner')}</a></li>
							<li><Link to="/dealregistration" className="btn btn-rouned btn-primary">{_('Deal Registration')}</Link></li>
						</ul>
					</div>
					<div className="faq-container">
						<div className="container">
							<div className="row">
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon1.png" className="img-responsive"/></span>
										<h2>{_('Partner Dashboard')}</h2>
										<p>{_('You can create new institute account and configure complete solution directly from your dashboard.')} {_('You will have all permissions to configure new institute account and manage.')}</p>
									</div>
								</div>
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon2.png" className="img-responsive"/></span>
										<h2>{_('Training & Support Material')}</h2>
										<p>{_('Conduct training session including technical & implementation training, sales & marketing, and access to support materials like as user manual, corporate brochure etc.')} </p>
									</div>
								</div>
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon3.png" className="img-responsive"/></span>
										<h2>{_('Native 24*7 Support')}</h2>
										<p>{_('You will get prompt & efficient support from pateast team by Skype, email and Phone.')}</p>
									</div>
								</div>
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon4.png" className="img-responsive"/></span>
										<h2>{_('Partnership Agreement')}</h2>
										<p>{_('We sign a partnership agreement with all legal terms & conditions.')} {_('We ensure 100% transparency at all business and technical levels.')}</p>
									</div>
								</div>
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon5.png" className="img-responsive"/></span>
										<h2>{_('Auto updates configuration')}</h2>
										<p>{_('You will be getting auto updates on email about new feature updates and product enhancement.')}' </p>
									</div>
								</div>
								<div className="col-sm-6 col-md-4">
									<div className="partner-boxes">
										<span className="partner-icon"><img src="/imgs/front/partner-icon1.png" className="img-responsive"/></span>
										<h2>{_('Trusted Partnership opportunity')}</h2>
										<p>{_('Get an opportunity to work with highly growing education system and Trusted Partnership & opportunity of shared growth with Pateast.')}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="happy-kids-inner">
						<img src="/imgs/front/happy-kids.png"/>
					</div>
				</section>
				<section className="request-section">
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<div className="heading-area">
									<h2 className="heading">{_('Let’s work together')}</h2>
									<h3 className="sub-heading">
										<strong>{_('Complete Pateast partner program enquiry form')}</strong>
										<br/>
										{_('If you would like to become pateast partner or wish to learn more about this program, please provide use your information using the Partner Inquiry and a member of our team will contact you within 2 business days')}
									</h3>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12">
								<div className="site-form partner-form">
									<div className="row">
										<div>
											<div className="col-sm-4">
												<FormGroup validationState={this.props.errors.partner_name ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Partner name')+' *'}
														name='partner_name'
														onChange={this.update}
														value={this.props.item.partner_name}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.partner_name}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-4">
												<FormGroup validationState={this.props.errors.company_name ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Company name')+' *'}
														name='company_name'
														onChange={this.update}
														value={this.props.item.company_name}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.company_name}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-4">
												<FormGroup validationState={this.props.errors.website_url ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Website URL')}
														name='website_url'
														onChange={this.update}
														value={this.props.item.website_url}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.website_url}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-12">
												<FormGroup validationState={this.props.errors.address ? 'error' : null}>
													<textarea
														className="form-control"
														placeholder={_('Address')+' *'}
														name='address'
														onChange={this.update}
														value={this.props.item.address}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.address}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-12">
												<div className="form-heading-text">
													{_('Contact Person Detail')}
												</div>
											</div>
											<div className="col-sm-6">
												<FormGroup validationState={this.props.errors.name ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Name of contact person')+' *'}
														name='name'
														onChange={this.update}
														value={this.props.item.name}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.name}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-6">
												<FormGroup validationState={this.props.errors.designation ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Designation')+' *'}
														name='designation'
														onChange={this.update}
														value={this.props.item.designation}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.designation}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-6">
												<FormGroup validationState={this.props.errors.mobile ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Mobile number')+' *'}
														name='mobile'
														onChange={this.update}
														value={this.props.item.mobile}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.mobile}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-6">
												<FormGroup validationState={this.props.errors.email ? 'error' : null}>
													<input
														type="text"
														className="form-control"
														placeholder={_('Email ID')+' *'}
														name='email'
														onChange={this.update}
														value={this.props.item.email}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.email}</HelpBlock>
												</FormGroup>
											</div>
											 <div className="col-sm-12">
												<div className="form-heading-text">
													{_('Business Detail')}
												</div>
											</div>
											<div className="col-sm-12">
												<FormGroup validationState={this.props.errors.about_business ? 'error' : null}>
													<textarea
														className="form-control"
														placeholder={_('About your existing business')+' *'}
														name='about_business'
														onChange={this.update}
														value={this.props.item.about_business}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.about_business}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-12">
												<FormGroup validationState={this.props.errors.message ? 'error' : null}>
													<textarea
														className="form-control"
														placeholder={_('Message')+' *'}
														name='message'
														onChange={this.update}
														value={this.props.item.message}
														data-action-type='UPDATE_PARTNERS_DATA'/>
													<HelpBlock>{this.props.errors.message}</HelpBlock>
												</FormGroup>
											</div>
											<div className="col-sm-12 text-center">
												<div className="submit-form">
													<input
														type="submit"
														className="btn btn-rouned btn-secondary"
														value={_('Submit')}
														onClick={this.submit}/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<span className="school-bus"> <img src="/imgs/front/kids-with-bus.png"/> </span>
				</section>
				<Footer/>
			</div>
		);
	}
}