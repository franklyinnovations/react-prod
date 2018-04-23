import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import makeTranslater from "../translate";

import actions from '../redux/actions';

import {
	Row,
	Col,
	Icon,
	Grid,
	Form,
	Badge,
	Panel,
	Button,
	PanelBody,
	FormGroup,
	LoremIpsum,
	InputGroup,
	FormControl,
	ButtonGroup,
	ButtonToolbar,
	PanelContainer,
} from '@sketchpixy/rubix';

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	...state.view.login
}))
export default class Login extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.login.init());
	}

	login(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.dispatch(
			actions.login.sendRequest(
				this.props.username,
				this.props.password
			)
		);
	}

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (

			<div className="login-bg">
			    <div className="front-container">
			      <div className="row">
			        <div className="col-md-12 col-sm-7 col-xs-12">

			          <div className="loginContent pt-50">
                                   <div className="login-page" style={{backgroundColor:'#009eb3',padding:15,width:'50%',margin:'auto'}}>
			            <h2>{__('LOGIN')}</h2>
			            <Form onSubmit={::this.login} className="loginForm" >
			              <div className="form-group">
			                <FormControl
								autoFocus
								type='text'
								className='form-control'
								placeholder={__('User Name')}
								onChange={::this.updateUsername}
								value={this.props.username}
							/>
			              </div>
			              <div className="form-group">
			                <FormControl
								type='password'
								className='form-control'
								placeholder={__('Password')}
								onChange={::this.updatePassword}
								value={this.props.password}
							/>
			              </div>
			              <div className="form-group">
			                <Button type='submit' className="btn orange-btn" onClick={::this.login}>{__('Login')}</Button>
			                <a className="forgotpass" href="/forgot-password">{__('Forgot password')}?</a>
			              </div>
			            </Form>
			          </div>
			        </div>
			      </div>
			  </div>
			</div>
                        </div>
		);
	}

	updateUsername(event) {
		this.props.dispatch(actions.login.updateUsername(event.target.value));
	}

	updatePassword(event) {
		this.props.dispatch(actions.login.updatePassword(event.target.value));
	}
}
