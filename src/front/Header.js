import React from 'react';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';

import makeTranslater from '../translate';
import {lanugages} from '../config';

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	location: state.location,
	lanugages: (state.session && state.session.lanugages) || lanugages,
	logged: state.session && !!state.session.id
}))
export default class Footer extends React.Component {

	state = {
		showLanguageLinks: false,
	};

	showLanguageLinks = () => this.setState({showLanguageLinks: !this.state.showLanguageLinks});

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		let viewName = this.props.location.pathname;
		return (
			<header className='site-header'>
				<div id="top"/>
				<div className='logo'>
					<IndexLink to='/'>
						<img src='/imgs/front/logo.png'/>
					</IndexLink>
				</div>
				<nav className='site-nav'>
					<ul className='menu'>
						<li className={viewName === '/' ? 'active' : ''}>
							<IndexLink to='/'>{_('Home')}</IndexLink>
						</li>
						{' '}
						<li className={viewName === '/features' ? 'active' : ''}>
							<Link to='/features'>{_('Features')}</Link>
						</li>
						{' '}
						<li className={(viewName === '/partners' || viewName === '/dealregistration') ? 'active' : ''}>
							<Link to='/partners'>{_('Partner')}</Link>
						</li>
						{' '}
						<li className={viewName === '/contact-us' ? 'active' : ''}>
							<Link to="/contact-us">{_('Contact')}</Link>
						</li>
						{' '}
					</ul>
					{' '}
					<span className="extra-links">
						{' '}
						<Link to='/sign-up' className="free-demo">{_('Register/Sign Up')}</Link>
						{' '}
						{
							this.props.logged ? 
							<Link to='/dashboard' className="login-btn">{_('Dashboard')}</Link> :
							<Link to='/login' className="login-btn">{_('Login')}</Link>
						}
						{' '}
						<a
							href='javascript:void(0)'
							className="switch-language"
							onClick={this.showLanguageLinks}>
							{this.props.lang.code}
						</a>
						{' '}
						{
							this.state.showLanguageLinks &&
							<div className='language-links'>
								{
									this.props.lanugages.map(
										lang => (
											this.props.lang.code !== lang.code &&
											<a
												key={lang.id}
												href={
													`/setLanguage/${lang.id}/${lang.dir}/${lang.code}`
												}>
												{lang.code}
											</a>
										)
									)
								}
							</div>
						}
					</span>
					{' '}
				</nav>
				<span className='menu-icon'><span/></span>
			</header>
		);
	}
}


export function Banner({bottom = false, children, students = false, inner = false}) {
	return (
		<section className={'banner-section' + (inner ? ' inner-page' : '')}>
			<span className='banner-top'></span>
			{bottom && <span className='banner-bottom'></span>}
			<div className='banner-content'>
				{children}
			</div>
			{
				students &&
				<div className='banner-mobile-holder'>
					<div>
						<div className="banner-mobile-img">
							<img src="/imgs/front/banner-mobile.png" alt="" className="img-responsive" />
						</div>
						<ul className="banner-students">
							<li><img src="/imgs/front/child-img-1.png"/></li>
							<li><img src="/imgs/front/child-img-2.png"/></li>
							<li><img src="/imgs/front/child-img-3.png"/></li>
							<li><img src="/imgs/front/child-img-4.png"/></li>
						</ul>
					</div>
				</div>
			}
		</section>
	);
}