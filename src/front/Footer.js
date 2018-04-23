import React from 'react';
import {connect} from 'react-redux';
import {IndexLink, Link} from 'react-router';
import makeTranslater from '../translate';

@connect(state => ({
	session: state.session,
	location: state.location,
	translations: state.translations,
	lang: state.lang
}))
export default class Footer extends React.Component {
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<footer className="main-footer">
				<div className="container">
					<div className="row">
						<div className="col-sm-6 col-md-3">
							<div className="footer-links">
								<h4>{__('Wikicare')}</h4>
								<ul className="foot-links">
									<li><Link to="/">{__('Home')}</Link></li>
									<li><Link to="/about-us">{__('About Us')}</Link></li>
									<li><Link to="/features">{__('Features')}</Link></li>
									<li><Link to="/article">{__('Article')}</Link></li>
									<li><Link to="/careers">{__('Careers')}</Link></li>
									<li><Link to="/login">{__('Login')}</Link></li>
									<li><Link to="/login?tab=signup">{__('Register')}</Link></li>
									<li><Link to="#">{__('Contact Us')}</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-sm-6 col-md-3">
							<div className="footer-links">
								<h4>{__('Wikicare For patients')}</h4>
								<ul className="foot-links">
									<li><a href="#">{__('Search Doctors/Clinic & Hospitals')}</a></li>
									<li><a href="#">{__('Get Appointment')}</a></li>
									<li><a href="#">{__('Get Medicines')}</a></li>
									<li><a href="#">{__('Health Articles')}</a></li>
									<li><a href="#">{__('Wikicare App')}</a></li>
								</ul>
							</div>
						</div>
						<div className="col-sm-6 col-md-3">
							<div className="footer-links">
								<h4>{__('Wikicare for Doctors/ Clinics & hospitals')}</h4>
								<ul className="foot-links">
									<li><a href="#">{__('Wikicare Profile')}</a></li>
									<li><Link href="/online-consult">{__('Online Consult')}</Link></li>
									<li><a href="#">{__('Appointments')}</a></li>
									<li><a href="#">{__('Health Articles')}</a></li>
								</ul>
							</div>
						</div>
						<div className="col-sm-6 col-md-3">
							<div className="footer-links">
								<h4>{__('Social')}</h4>
								<ul className="foot-links">
									<li><a href="#">{__('Facebook')}</a></li>
									<li><a href="#">{__('Twitter')}</a></li>
									<li><a href="#">{__('Youtube')}</a></li>
									<li><a href="#">{__('Linkedin')}</a></li>
								</ul>
							</div>
						</div>
					</div>
					<div className="row text-center">
						<div className="col-sm-12">
							<div className="footer-logo"> 
								<img src='/imgs/home/footer-logo.png' alt="img"/>
							</div>
							<div className="copyright-link"> 
								<p>&copy; 2018 - Wikicare. {__('All rights reserved')}.
									<a href="#">{__('Terms & Conditions')}</a>
									<Link to="/privacy-policy">{__('Privacy Policy')}</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		);
	}
}
