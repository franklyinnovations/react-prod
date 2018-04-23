import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import Banner from '../front/Banner';
import Footer from '../front/Footer';

import {
	Button,
	FormGroup,
	FormControl,
	Tabs,
	Tab,
	HelpBlock,
} from '@sketchpixy/rubix';

@connect(state => ({...state.view.resetpassword}))
export default class Signup extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.resetpassword.init());
	}

	update = e => {
		this.props.dispatch({
			type: e.target.getAttribute('data-action-type'),
			name: e.target.name,
			value: e.target.value
		});
	};

	resetPassword = e => {
		e.preventDefault();
		e.stopPropagation();
		if (this.props.sendingRequest) return;
		this.props.dispatch(
			actions.resetpassword.sendRequest(
				this.props.newPassword,
				this.props.confirmPassword,
				this.props.routeParams.token,
				this.props.router,
			)
		);
	};

	render() {
		return (
			<div id='front2'>
				<Banner>
					<div className="loginContent pt-50">
						<div className="login-page ld-wrapper" style={{backgroundColor:'#009eb3',padding:15,width:'100%', maxWidth: '540px', margin:'auto'}}>
							<div className='text-center'>
								<h3
									style={{color: '#333', marginTop: 0}}>
									Reset Password
								</h3>
							</div>
							<FormGroup
								controlId='newPassword'
								validationState={this.props.errors.newPassword ? 'error': null}
							>
								<FormControl
									type="password"
									placeholder="New Password"
									name='newPassword'
									data-action-type='UPDATE_RP_DATA_VALUE'
									value={this.props.newPassword}
									onChange={this.update}
								/>
								<HelpBlock>{this.props.errors.newPassword}</HelpBlock>
							</FormGroup>
							<FormGroup
								controlId='confirmPassword'
								validationState={this.props.errors.confirmPassword ? 'error': null}
							>
								<FormControl
									type="password"
									placeholder="Confirm Password"
									name='confirmPassword'
									data-action-type='UPDATE_RP_DATA_VALUE'
									value={this.props.confirmPassword}
									onChange={this.update}
								/>
								<HelpBlock>{this.props.errors.confirmPassword}</HelpBlock>
							</FormGroup>
							<div className="form-group">
								<Button
									type='submit'
									lg
									className="btl"
									onClick={this.resetPassword}>
									Reset Password
								</Button>
							</div>
						</div>
					</div>
				</Banner>
				<Footer/>
			</div>
		);
	}
}
