import React from 'react';
import {connect} from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';
import {
	Text,
	Loading,
	Clearfix,
	FormGroup,
	HelpBlock,
	FormControl,
} from '../components';

import makeTranslater from '../translate';
import {getSalutation} from '../utils/options';

import * as actions from '../redux/actions/signup';
import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/signup';
addView('signup', reducer);

@connect(state => ({
	...state.view.state,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
}))
export default class SignUp extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	submit = event => {
		event.preventDefault();
		this.props.dispatch(actions.submit(this.props));
	};

	render() {
		return (
			<div id='front'>
				<Header/>
				<Banner inner>
					<h1><Text>Sign Up</Text></h1>
				</Banner>
				{this.props.loading ? <Loading/> : this.renderSignUp()}
				<Footer/>
			</div>
		);
	}

	renderSignUp() {
		let {errors, item, meta} = this.props,
			_ = makeTranslater(this.props.translations, this.props.lang.code);
		if (!item) return (
			<section className="contact-section">
				<div className="contact-wrapper cloudy-bg partner-section">
					<div className="container">
						<div className='row'>
							<div className='col-xs-12'>
								<Text>Thank you for Sign Up as Institute. We are reviewing your application. 
								We shall get back to you soon in 48 hours.</Text>
							</div>
						</div>
						<div className="happy-kids-inner">
							<img src="/imgs/front/happy-kids.png"/>
						</div>
					</div>
				</div>
			</section>
		);
		return (
			<section className="contact-section">
				<div className="contact-wrapper cloudy-bg partner-section">
					<div className="container">
						<div className="row">
							<form className='site-form'>
								<div className='col-md-6'>
									<FormGroup validationState={errors.name ? 'error' : null}>
										<FormControl
											type='text' 
											name='name'
											onChange={this.update}
											value={item.name}
											placeholder={_('Institute Name')}/>
										<HelpBlock>{errors.name}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.alias ? 'error' : null}>
										<FormControl
											type='text' 
											name='alias'
											value={item.alias}
											onChange={this.update}
											placeholder={_('Institute Short Name')}/>
										<HelpBlock>{errors.alias}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-6'>
									<FormGroup validationState={errors.countryId ? 'error' : null}>
										<FormControl
											name='countryId'
											onChange={this.update}
											componentClass='select'
											value={item.countryId}>
											<option key={0} value=''>
												{_('Country')}
											</option>
											{
												meta.countries.map(({label, value}) => 
													<option value={value} key={value}>{label}</option>
												)
											}
										</FormControl>
										<HelpBlock>{errors.countryId}</HelpBlock>
									</FormGroup>
									<FormGroup validationState={errors.stateName ? 'error' : null}>
										<FormControl
											type='text'
											name='stateName'
											value={item.stateName}
											onChange={this.update}
											placeholder={_('State')}/>
										<HelpBlock>{errors.stateName}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.address ? 'error' : null}>
										<FormControl
											name='address'
											value={item.address}
											onChange={this.update}
											componentClass='textarea'
											placeholder={_('Address')}/>
										<HelpBlock>{errors.address}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-6'>
									<FormGroup validationState={errors.cityName ? 'error' : null}>
										<FormControl
											type='text'
											name='cityName'
											value={item.cityName}
											onChange={this.update}
											placeholder={_('City')}/>
										<HelpBlock>{errors.cityName}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.zip_code ? 'error' : null}>
										<FormControl
											type='text' 
											name='zip_code'
											value={item.zip_code}
											onChange={this.update}
											placeholder={_('Zip Code')}/>
										<HelpBlock>{errors.zip_code}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-3'>
									<FormGroup validationState={errors.salutation ? 'error' : null}>
										<FormControl
											type='text'
											name='salutation'
											onChange={this.update}
											componentClass='select'
											value={item.salutation}
											placeholder={_('Salutation')}>
											<option key={0}>{_('Salutation')}</option>
											{
												getSalutation(_).map(({label, value}) =>
													<option key={value} value={value}>{label}</option>
												)
											}
										</FormControl>
										<HelpBlock>{errors.salutation}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-9'>
									<FormGroup validationState={errors.fullname ? 'error' : null}>
										<FormControl
											type='text' 
											name='fullname'
											onChange={this.update}
											placeholder={_('Institute Admin Name')}
											value={item.fullname}/>
										<HelpBlock>{errors.fullname}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-6'>
									<FormGroup validationState={errors.email ? 'error' : null}>
										<FormControl
											type='text' 
											name='email'
											value={item.email}
											onChange={this.update}
											placeholder={_('Email')}/>
										<HelpBlock>{errors.email}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.phone ? 'error' : null}>
										<FormControl
											type='text' 
											name='phone'
											value={item.phone}
											onChange={this.update}
											placeholder={_('Phone')}/>
										<HelpBlock>{errors.phone}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-6'>
									<FormGroup validationState={errors.mobile ? 'error' : null}>
										<FormControl
											type='text' 
											name='mobile'
											value={item.mobile}
											onChange={this.update}
											placeholder={_('Mobile')}/>
										<HelpBlock>{errors.mobile}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.timezone ? 'error' : null}>
										<FormControl
											name='timezone'
											value={item.timezone}
											onChange={this.update}
											componentClass='select'
											placeholder={_('Timezone')}>
											<option>{_('Timezone')}</option>
											{
												meta.timezones.map(timezone => 
													<option key={timezone} value={timezone}>
														{timezone}
													</option>
												)
											}
										</FormControl>
										<HelpBlock>{errors.timezone}</HelpBlock>
									</FormGroup>
								</div>
								<Clearfix/>
								<div className='col-md-6'>
									<FormGroup validationState={errors.secondary_lang ? 'error' : null}>
										<FormControl
											name='secondary_lang'
											onChange={this.update}
											componentClass='select'
											value={item.secondary_lang}>
											<option>{_('Secondary Language (English is Primary Language)')}</option>
											{
												meta.languages.map(language => 
													<option key={language.id} value={language.id}>
														{language.name}
													</option>
												)
											}
										</FormControl>
										<HelpBlock>{errors.secondary_lang}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup validationState={errors.date_format ? 'error' : null}>
										<FormControl
											name='date_format'
											onChange={this.update}
											componentClass='select'
											value={item.date_format}>
											<option>{_('Date Format')}</option>
											{
												meta.dateformats.map(formart => 
													<option key={formart} value={formart}>
														{formart}
													</option>
												)
											}
										</FormControl>
										<HelpBlock>{errors.date_format}</HelpBlock>
									</FormGroup>
								</div>
								<div className='col-xs-12' style={{marginTop: 40}}>
									<div className='form-group text-center'>
										<input onClick={this.submit} type="submit" value={_('Submit')} className="btn btn-rouned btn-primary"/>
									</div>
								</div>
							</form>
						</div>
						<div className="happy-kids-inner">
							<img src="/imgs/front/happy-kids.png"/>
						</div>
					</div>
				</div>
			</section>
		);
	}
}