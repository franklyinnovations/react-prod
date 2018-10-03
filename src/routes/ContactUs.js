import React from 'react';
import {connect} from 'react-redux';

import  {
	FormGroup,
	HelpBlock
} from '../components';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';

import {getInputValue} from '../utils';
import makeTranslater from '../translate';

import * as actions from '../redux/actions/contactUs';
import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/contactUs';
addView('contactUs', reducer);

@connect(state => ({
	lang: state.lang,
	translations: state.translations,
	...state.view.state,
}))
export default class ContactUs extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init());
	}

	update = event => this.props.dispatch(
		actions.update(
			event.target.getAttribute('data-action-type'),
			event.target.name,
			getInputValue(event.target)
		)
	);

	submit = () => this.props.dispatch(actions.submit(this.props));

	constructor(props) {
		super(props);
		this.handleUpdate = event => this.update(
			event.target.getAttribute('data-action-type'),
			event.target.name,
			getInputValue(event.target),
		);
	}

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front' className='home-pg'>
				<Header/>
				<Banner inner>
					<h1>{_('Contact Us')}</h1>
				</Banner>
				<section className="contact-section">
					<a href="javascript:void(0)" className="map-btn">
						<i className="far fa-map"/>
						<span>{_('See map')}</span>
					</a>
					<div className="contact-wrapper cloudy-bg">
						<div className="container">
							<div className="row">
								<div className="col-md-6">
									<div className="site-form">
										<h2 className="contact-heading">
											{_('Kindly share your Contact details. We will get in touch with you.')}
										</h2>
										<div>
											<FormGroup validationState={this.props.errors.nature_of_interest ? 'error': null}>
												<select
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.nature_of_interest}
													className="form-control"
													name="nature_of_interest">
													<option value=""> --{_('The nature of your interest')}-- </option>
													<option value="I would like to partner, to resell further."> {_('I would like to partner, to resell further.')} </option>
													<option value="I wish to consider it for School."> {_('I wish to consider it for School.')} </option>
													<option value="I wish to consider it for an Educational Institution."> {_('I wish to consider it for an Educational Institution.')} </option>
												</select>
												<HelpBlock>{this.props.nature_of_interest}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.organization_name ? 'error' : null}>
												<input
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.organization_name}
													name="organization_name"
													className="form-control"
													placeholder={_('School / Organization Name')}/>
													<HelpBlock>{this.props.errors.organization_name}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.name ? 'error' : null}>
												<input
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.name}
													name="name"
													className="form-control"
													placeholder={_('Contact Person Name')}/>
												<HelpBlock>{this.props.errors.name}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.mobile ? 'error' : null}>
												<input
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.mobile}
													name="mobile"
													className="form-control"
													placeholder={_('Mobile Number')}/>
												<HelpBlock>{this.props.errors.mobile}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.email ? 'error' : null}>
												<input
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.email}
													name="email"
													className="form-control"
													placeholder={_('Email Address')}/>
												<HelpBlock>{this.props.errors.email}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.countryId ? 'error' : null}>
												<select
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.countryId}
													className="form-control"
													name='countryId'>
													<option value="" key={0}>{_('Please Select Country')}</option>
													{
														this.props.item.countries.map(
															country => (
																<option
																	key={country.value}
																	value={country.value}>
																	{country.label}
																</option>
															)
														)
													}
												</select>
												<HelpBlock>{this.props.errors.countryId}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.skypeId ? 'error' : null}>
												<input
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.skypeId}
													name="skypeId"
													className="form-control"
													placeholder={_('Skype Id')}/>
												<HelpBlock>{this.props.errors.skypeId}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.try_demo ? 'error' : null}>
												<select
													disabled={!this.props.item.nature_of_interest}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.try_demo}
													className="form-control"
													name="try_demo">
													<option value="">---{_('Interested in Demo')}---</option>
													<option value="Yes">{_('Yes')}</option>
													<option value="No">{_('No')}</option>
												</select>
												<HelpBlock>{this.props.errors.try_demo}</HelpBlock>
											</FormGroup>
											<FormGroup validationState={this.props.errors.query ? 'error' : null}>
												<textarea
													disabled={!this.props.item.query}
													data-action-type="UPDATE_CONTACT_US_DATA"
													onChange={this.update}
													value={this.props.item.query}
													name="query"
													disabled={!this.props.item.nature_of_interest}
													className="form-control" placeholder={_('Your Query')}/>
												<HelpBlock >{this.props.errors.query}</HelpBlock>
											</FormGroup>
											<div className="form-group">
												<input
													disabled={!this.props.item.nature_of_interest}
													onClick={this.submit}
													type="submit"
													value={_('SUBMIT')}
													className="btn btn-rouned btn-primary"/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<h2 className="contact-heading">
										{_('Contact Information')}
									</h2>
									<h3 className="contact-subheading">
										{_('Pateast Edutech Software LLP')}
									</h3>
									<ul className="contact-info">
										<li><b>{_('INDIA')}</b></li>
										<li><i className="fas fa-map-marker-alt"></i> {_('G-267, Sitapura Industrial area, Jaipur, India, 302022.')}</li>
										<li><a href="tel:91-8952953777"><i className="fas fa-phone-volume"></i> 91-8952953777</a></li>
										<li><a href="mailto:info@pateast.co"> <i className="fas fa-envelope"></i> info@pateast.co</a></li>
									</ul>
									<ul className="contact-info">
										<li><b>{_('OMAN')}</b></li>
										<li><i className="fas fa-map-marker-alt"></i>{_('Apartment No.11, Building No.47, Al maha, 35 street, Muscat, Oman, Postcode - 112')}</li>
										<li><a href="tel:00968-99227710"><i className="fas fa-phone-volume"></i> 00968-99227710</a></li>
									</ul>
								</div>
							</div>
						</div>
						<div className="happy-kids-inner">
							<img src="/imgs/front/happy-kids.png" alt="" />
						</div>
					</div>
					<div className="map-wrapper">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.7608926962725!2d75.8387069508489!3d26.783890771988737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5e3da88156b%3A0xc0aedc60fe944e2c!2sPlanet+Web+Solutions+Pvt.+Ltd.!5e0!3m2!1sen!2sin!4v1516700407944"
							frameBorder="0"
							style={{border:0}}
							allowFullScreen/>
					</div>
				</section>
				<Footer/>
			</div>
		);
	}
}