import React from 'react';
import {connect} from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';
import {
	FormGroup,
	HelpBlock,
	Clearfix,
} from '../components';

import makeTranslater from '../translate';
import {getInputValue} from '../utils';

import * as actions from '../redux/actions/dealregistration';
import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/dealregistration';
addView('dealregistration', reducer);

@connect(state => ({
	...state.view.state,
	translations: state.translations,
	lang: state.lang,
}))
export default class DealRegistration extends React.Component {

	static fetchData(store) {
		return store.dispatch(
			actions.init(
				store.getState()
			)
		);
	}

	update = event => {
		this.props.dispatch(
			actions.update(
				event.target.getAttribute('data-action-type'),
				event.target.name,
				getInputValue(event.target)
			)
		);
		if (event.target.name === 'countryId') {
			this.props.dispatch(
				actions.updateAvailableState(this.props, getInputValue(event.target))
			);
		}
	}
	submit = () => this.props.dispatch(actions.submit(this.props));

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front'>
				<Header/>
				<Banner inner>
					<h1>{_('Lead Registration Form')}</h1>
				</Banner>
				<section className="contact-section">
					<div className="contact-wrapper cloudy-bg partner-section">
						<div className="container">
							<div className="row">
								<div className='site-form'>
									<div className="col-md-12">
										<h2 className="contact-heading text-center">
											{_('Lead Registration Form')}
										</h2>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.prospect_name ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.prospect_name}
												name='prospect_name'
												type="text" 
												className="form-control" 
												placeholder={_("Prospect's Name")}
												/>
												<HelpBlock>{this.props.errors.prospect_name}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.email ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.email}
												name='email'
												type="text" 
												className="form-control" 
												placeholder={_("Prospect's Email Address")}
												/>
												<HelpBlock>{this.props.errors.email}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.phone ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.phone}
												name='phone'
												type="text" 
												className="form-control" 
												placeholder={_("Prospect's Phone Number")}
												/>
												<HelpBlock>{this.props.errors.phone}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.institution ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.institution}
												name='institution'
												type="text" 
												className="form-control" 
												placeholder={_("Prospect's Institution/Organization Name")}
												/>
												<HelpBlock>{this.props.errors.institution}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.business_url ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.business_url}
												name='business_url'
												type="text" 
												className="form-control" 
												placeholder={_("Prospect's Business Website/URL")}
												/>
												<HelpBlock>{this.props.errors.business_url}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.institute_erp ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.institute_erp}
												name='institute_erp'
												type="text" 
												className="form-control" 
												placeholder={_("Institution/School for which School-ERP is required")}
												/>
												<HelpBlock>{this.props.errors.institute_erp}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.countryId ? 'error' : null}>
											<select
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.countryId}
												name='countryId'
												className="form-control">
												<option key={0} value=''>{_('Please Select Country')}</option>
												{
													this.props.helperData.countries.map(
														country => (
															<option
																key={country.id}
																value={country.id}>
																{country.countrydetails[0].name}
															</option>
														)
													)
												}
											</select>
											<HelpBlock>{this.props.errors.countryId}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.stateId ? 'error' : null}>
											<select
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.stateId}
												name='stateId'
												className="form-control">
												<option key={0} value=''>{_('Please Select State')}</option>
												{
													this.props.helperData.states.map(
														state => (
															<option
																key={state.id}
																value={state.id}>
																{state.statedetails[0].name}
															</option>
														)
													)
												}
											</select>
											<HelpBlock>{this.props.errors.stateId}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-12">
										<FormGroup validationState={this.props.errors.count_of_students ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.count_of_students}
												name='count_of_students'
												type="text" 
												className="form-control" 
												placeholder={_('Count of Students at the Institution/School')}/>
												<HelpBlock>{this.props.errors.count_of_students}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-12">
										<FormGroup validationState={this.props.errors.additional_info ? 'error' : null}>
											<textarea
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.additional_info}
												name='additional_info'
												className="form-control" 
												placeholder={_('Please share any additional information, that Pateast should know about the Deal upfront and can help us to support you.')}
												/>
												<HelpBlock>{this.props.errors.additional_info}</HelpBlock>
										</FormGroup>
									</div>   
									<div className="col-md-12">
										<h2 className="contact-heading text-center">
											{_('Your Contact Details')}
										</h2>
									</div>          
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.fullname ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.fullname}
												name='fullname'
												type="text" 
												className="form-control" 
												placeholder={_('Your Full Name')}
												/>
												<HelpBlock>{this.props.errors.fullname}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.email_address ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.email_address}
												name='email_address'
												type="text" 
												className="form-control" 
												placeholder={_('Your Email Address')}
												/>
												<HelpBlock>{this.props.errors.email_address}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.business_name ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.business_name}
												name='business_name'
												type="text" 
												className="form-control" 
												placeholder={_('Your Business Name')}
												/>
												<HelpBlock>{this.props.errors.business_name}</HelpBlock>
										</FormGroup>
									</div>
									<div className="col-md-6">
										<FormGroup validationState={this.props.errors.partner_code ? 'error' : null}>
											<input
												onChange={this.update}
												data-action-type='UPDATE_DEAL_DATA_VALUE'
												value={this.props.item.partner_code}
												name='partner_code'
												type="text" 
												className="form-control" 
												placeholder={_('Your Partner Code')}
												/>
												<HelpBlock>{this.props.errors.partner_code}</HelpBlock>
										</FormGroup>
									</div>
									<Clearfix/>
									<div className="col-md-12" style={{marginTop: 40}}>
										<div className="form-group text-center">
											<input onClick={this.submit} type="submit" value={_("Submit")} className="btn btn-rouned btn-primary"/>
										</div>
									</div>
								</div>
							</div>
							<div className="happy-kids-inner">
								<img src="/imgs/front/happy-kids.png"/>
							</div>
						</div>
					</div>
				</section>
				<Footer/>
			</div>
		);
	}
}