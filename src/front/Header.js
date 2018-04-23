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
export default class Header extends React.Component {
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<header className="main-header">
			    <div className="container">
					<div className="row">
						<div className="col-sm-12">
							<div className="logo">
								<IndexLink to="/">
									<img src='/imgs/home/top-logo.png'/>
								</IndexLink>
							</div>
							<nav className="site-nav">
								<ul className="menu">
									<li className={this.props.location.pathname === '/about-us' ? 'active':''}>
										<Link to="/about-us">{__('About')}</Link>
									</li> 
									<li className={this.props.location.pathname === '/subscription-plans' ? 'active':''}>
										<Link to="/subscription-plans">{__('Pricing')}</Link>
									</li> 
									<li className={this.props.location.pathname === '/features' ? 'active':''}>
										<Link to="/features">{__('Features')}</Link>
									</li>
									{
										!this.props.session.id &&
										<li className={this.props.location.pathname === '/login' ? 'active':''}>
											<Link to="/login">{__('Login')}</Link>
										</li>
									}
								</ul>
								{
									(this.props.session && this.props.session.id) ?
									<span className="extra-links">
										<Link to='/login' className="switch-language">{__('Dashboard')}</Link>
									</span>
									:
									<span className="extra-links">
										<Link to='/login?tab=signup' className="switch-language">{__('Get Started')}</Link>
									</span>
								}
								<span className="extra-links">
									{
										this.props.lang.code === "en" ?
										<a href="javascript:void(0)" className="switch-language" data-id={2} data-dir={'rl'} data-code={'ar'} onClick={::this.handleLangChange}>ar</a> :
										<a href="javascript:void(0)" className="switch-language" data-id={1} data-dir={'lr'} data-code={'en'} onClick={::this.handleLangChange}>en</a>		
									}
								</span>
							</nav>
							<a className="menu-icon"><span/></a>
						</div>
					</div>
				</div> 
			</header>
		);
	}

	handleLangChange(event) {
		let elem = event.target;
		window.location.href = '/setLanguage/' + elem.dataset['id'] 
			+ '/' + elem.dataset['dir'] 
			+ '/' + elem.dataset['code'];
	}
}
