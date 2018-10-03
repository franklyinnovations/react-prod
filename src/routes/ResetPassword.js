import React from 'react';
import { connect } from 'react-redux';
import {IndexLink} from 'react-router';
import {
	Form,
	FormGroup,
	HelpBlock,
	Clearfix,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/resetpassword';
import * as actions from '../redux/actions/resetpassword';
addView('resetpassword', reducer);

@connect(state => ({...state.view.state}))
export default class ResetPassword extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init());
	}

	update = e => {
		this.props.dispatch(
			actions.update(
				e.target.getAttribute('data-action-type'),
				e.target.name,
				e.target.value
			)
		);
	};

	resetPassword = e => {
		e.preventDefault();
		e.stopPropagation();
		if (this.props.sendingRequest) return;
		this.props.dispatch(
			actions.sendRequest(
				this.props.newPassword,
				this.props.confirmPassword,
				this.props.routeParams.token,
				this.props.router,
			)
		);
	};

	render() {
		return (
			<div id='front' className='home-pg'>
				<header className="site-header login-header">
					<div className="logo">
						<IndexLink to="/">
							<img src="/imgs/front/pateast-logo-white.png" alt="Pateast" />
						</IndexLink>
					</div>
				</header>
				<div className="login-banner-section">
					<span className="banner-top"/>
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<Form onSubmit={this.resetPassword} className="login-inner-box">
									<h2>Reset Password</h2>
									<ul className='login-form'>
										<li className="login-password">
											<input
												type="password"
												placeholder="New Password"
												name='newPassword'
												data-action-type='UPDATE_RP_DATA_VALUE'
												value={this.props.newPassword}
												onChange={this.update}/>
										</li>
										<Clearfix/>
										<FormGroup validationState={this.props.errors.newPassword ? 'error' : null}>
											<HelpBlock>{this.props.errors.newPassword}</HelpBlock>
										</FormGroup>
										<li className="login-password">
											<input
												type="password"
												placeholder="Confirm Password"
												name='confirmPassword'
												data-action-type='UPDATE_RP_DATA_VALUE'
												value={this.props.confirmPassword}
												onChange={this.update}/>
										</li>
										<Clearfix/>
										<FormGroup validationState={this.props.errors.confirmPassword ? 'error' : null}>
											<HelpBlock>{this.props.errors.confirmPassword}</HelpBlock>
										</FormGroup>
										<li>
											<FormGroup validationState={this.props.errors.message ? 'error' : null}>
												<HelpBlock>{this.props.errors.message}</HelpBlock>
											</FormGroup>
											<button
												onClick={this.resetPassword}
												type="submit"
												className="btn btn-rouned btn-primary">
												Reset Password
											</button>{' '}
										</li>
									</ul>
								</Form>
							</div>
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
}
