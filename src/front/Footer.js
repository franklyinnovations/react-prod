import React from 'react';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';

import makeTranslater from "../translate";
import {lanugages} from '../config';

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	location: state.location,
	lanugages: (state.session && state.session.lanugages) || lanugages,
	logged: state.session && !!state.session.id
}))
export default class Footer extends React.Component {
	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<footer className="site-footer">
				<a href="#top" className="scroll-top" title="Scroll Top">
					<i className="fas fa-angle-double-up"/>
				</a>
				<div className="container">
					<div className="top-footer">
						<div className="row">
							<div className="col-sm-3 col-xs-6 col-xxs-12 top-footer-box">
								<h3>{_('Why Pateast')}</h3>
								<ul>
									<li><Link to="#">{_('Testimonials')}</Link></li>
									<li><Link to='/terms-condition'>{_('Terms & Conditions')}</Link></li>
									<li><Link to='/privacy-policy'>{_('Privacy Policy')}</Link></li>
									<li><Link to='/refund-policy'>{_('Refund & Cancellation Policy')}</Link></li>
								</ul>
							</div>
							<div className="col-sm-3 col-xs-6 col-xxs-12 top-footer-box">
								<h3>{_('Partner')}</h3>
								<ul>
									<li><Link to="/partners">{_('Partner Program')}</Link></li>
								</ul>
							</div>
							<div className="col-sm-3 col-xs-6 col-xxs-12 top-footer-box">
								<h3>{_('Company')}</h3>
								<ul>
									<li><IndexLink to="/">{_('Home')}</IndexLink></li>
									<li><a href="//blog.pateast.co">{_('Blog')}</a></li>
									<li><Link to="/contact-us">{_('Contact Us')}</Link></li>
									<li><Link to="/features">{_('Features')}</Link></li>
									<li><Link to="/faq">{_('FAQ')}</Link></li>
								</ul>
							</div>
						</div>
					</div>
					<div className="bottom-footer">
						<div className="copy-right-text">
							{_('Pateast © 2018, All Right Reserved.')}
						</div>
						<div className="footer-right-area">
							<div className="stores-btns">
								<a href="//itunes.apple.com/us/app/pateast/id1278331221?mt=8" target="_blank">
									<i className="fab fa-apple"></i>
									<small>{_('Available on the')}</small>
									{_('App Store')}
								</a>
								<a href="//play.google.com/store/apps/details?id=com.pws.pateast"  target="_blank">
									<i className="fab fa-google-play"></i>
									<small>{_('Available on the')}</small>
									{_('Google Play')}
								</a>
							</div>
							<ul className="follow-icons">
								<li>
									<a href="https://www.facebook.com/Pateastco/" target="_blank" className="icon-fb">
										<i className="fab fa-facebook-f"/>
									</a>
								</li>
								<li>
									<a href="https://twitter.com/pateastco" target="_blank" className="icon-twitter">
										<i className="fab fa-twitter"/>
									</a>
								</li>
								<li>
									<a href="https://www.linkedin.com/company/pateast-co" target="_blank" className="icon-linkedin">
										<i className="fab fa-linkedin-in"/>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		);
	}
}
