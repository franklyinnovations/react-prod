import React from 'react';
import {connect} from 'react-redux';
import {IndexLink, Link} from 'react-router';

import {
	Clearfix,
	FormGroup,
	HelpBlock,
} from '../components';

import makeTranslater from '../translate';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/login';
import * as actions from '../redux/actions/login';
addView('login', reducer);


@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Login extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init());
	}

	login = e => {
		e.preventDefault();
		e.stopPropagation();
		if (this.props.sendingRequest) return;
		this.props.dispatch(
			actions.sendRequest(
				this.props.username,
				this.props.password
			)
		);
	};

	update = e => {
		this.props.dispatch(
			actions.update(
				e.target.getAttribute('data-action-type'),
				e.target.name,
				e.target.value
			)
		);
	};

	showForgotPassword = () => this.props.dispatch(actions.showForgotPassword());
	showLogin = () => this.props.dispatch(actions.showLogin());

	forgotPassword = e => {
		e.preventDefault();
		e.stopPropagation();
		this.props.dispatch(
			actions.forgotPassword(
				this.props.username,
			)
		);
	};


	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code),
			content;
		switch(this.props.viewState) {
			case 'FORGOT_PASSWORD_FORM':
			case 'SET_FORGOT_PASSWORD_ERRORS':
			case 'SEND_FORGOT_PASSWORD_REQUEST':
				content = this.renderForgotPasswordForm(_);
				break;
			default:
				content = this.renderLoginForm(_);
		}
		return (
			<div id='front' className='home-pg'>
				<header className="site-header login-header">
					<div className="logo">
						<IndexLink to="/">
							<img src="/imgs/front/pateast-logo-white.png" alt="Pateast" />
						</IndexLink>
					</div>
					<IndexLink to='/' className="btn btn-rouned btn-primary gohome">
						{_('Go to Home')}
						<i className="fa fa-long-arrow-alt-right"></i>
					</IndexLink>
				</header>
				<div className="login-banner-section">
					<span className="banner-top"/>
					<div className="container">
						<div className="row">
							<div className="col-sm-12">{content}</div>
						</div>
					</div>
					<div className="login-vectors">
						<span className="login-watch">
							<img src="/imgs/front/login-watch.png" className="img-responsive"/>
						</span>
						<span className="login-user">
							<img src="/imgs/front/login-user.png" className="img-responsive"/>
						</span>
						<span className="banner-bottom"/>
					</div>
				</div>
			</div>
		);
	}

	renderLoginForm(_) {
		return (
			<form className="login-inner-box" onSubmit={this.login}>
				<h2 className="heading">{_('Login')}</h2>
				<ul className="login-form">
					<li className="username">
						<input
							type="text"
							placeholder={_('Username')}
							name='username'
							data-action-type='UPDATE_LOGIN_USERNAME'
							value={this.props.username}
							onChange={this.update}/>
					</li>
					<Clearfix/>
					<FormGroup validationState={this.props.errors.username ? 'error' : null}>
						<HelpBlock>{this.props.errors.username}</HelpBlock>
					</FormGroup>
					<li className="login-password">
						<input
							type="password"
							placeholder={_('Password')}
							name='password'
							data-action-type='UPDATE_LOGIN_PASSWORD'
							value={this.props.password}
							onChange={this.update}/>
					</li>
					<Clearfix/>
					<FormGroup validationState={this.props.errors.password ? 'error' : null}>
						<HelpBlock>{this.props.errors.password}</HelpBlock>
					</FormGroup>
					<li>
						<FormGroup validationState={this.props.errors.message ? 'error' : null}>
							<HelpBlock>{this.props.errors.message}</HelpBlock>
						</FormGroup>
						<button
							onClick={this.login}
							type="submit"
							className="btn btn-rouned btn-primary">
							{_('Login')}
						</button>{' '}
						<button
							onClick={this.showForgotPassword}
							className="btn btn-rouned btn-forgot">
							{_('Forgot Password?')}
						</button>
					</li>
					<li>
						{_('Don\'t have an account?')}&nbsp;<Link to='/sign-up'>{_('Sign Up')}</Link>
					</li>
				</ul>
			</form>
		);
	}

	renderForgotPasswordForm(_) {
		return (
			<form className="login-inner-box" onSubmit={this.forgotPassword}>
				<h2 className="heading">{_('Forgot Password')}</h2>
				<ul className="login-form">
					<li className="username">
						<input
							type="text"
							placeholder={_('Username')}
							name='username'
							data-action-type='UPDATE_LOGIN_USERNAME'
							value={this.props.username}
							onChange={this.update}/>
					</li>
					<Clearfix/>
					<FormGroup validationState={this.props.errors.username ? 'error' : null}>
						<HelpBlock>{this.props.errors.username}</HelpBlock>
					</FormGroup>
					<li>
						<FormGroup validationState={this.props.errors.message ? 'error' : null}>
							<HelpBlock>{this.props.errors.message}</HelpBlock>
						</FormGroup>
						<button
							onClick={this.forgotPassword}
							type="submit"
							className="btn btn-rouned btn-primary">
							{_('Submit')}
						</button>{' '}
						<button
							onClick={this.showLogin}
							className="btn btn-rouned btn-forgot">
							{_('Login')}
						</button>
					</li>
				</ul>
			</form>
		);
	}

	updatePassword(event) {
		this.props.dispatch(actions.updatePassword(event.target.value));
	}
}
