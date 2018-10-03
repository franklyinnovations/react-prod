import React from 'react';
import {connect} from 'react-redux';

import {
	Grid,
	Row,
	Col,
	FormGroup,
	FormControl,
	ControlLabel,
	HelpBlock,
	Button,
	Nav,
	NavItem,
} from '../components';

import makeTranslater from '../translate';
import actions from '../redux/actions';
import Loading from '../components/Loading';
import {getInputValue} from '../utils';

@connect(state => ({
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.admission,
}))
export default class Admission extends React.Component {

	static fetchData(store, params) {
		return store.dispatch(actions.admission.init(store.getState(), params));
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div>
				<h3 className='text-center'>
					{this.props.academicsession.institute.institutedetails[0].name}
				</h3>
				<h2 className='text-center'>
					{
						__(
							'Admission Form For Session: {{name}}',
							{name: this.props.academicsession.academicsessiondetails[0].name}
						)
					}
				</h2>
				<h4 className='text-center'>
					{
						__(
							'Admission is allowed for those who have taken birth between {{start}} - {{end}}',
							{
								start: this.props.academicsession.min_admission_date,
								end: this.props.academicsession.max_admission_date,
							}
						)
					}
				</h4>
				{this.props.session ? <AdmissionForm/> : <AdmissionLogin/>}
			</div>
		);
	}
}

@connect(state => ({
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.admission,
}))
class AdmissionForm extends React.Component {
	render() {
		return (
			<div>{JSON.stringify(this.props)}</div>
		);
	}
}

@connect(state => ({
	errors: state.view.admission.errors,
	...state.view.admission.viewState,
}))
class AdmissionLogin extends React.Component {

	selectTab = tab => this.props.dispatch(actions.admission.selectTab(tab));
	update = event => this.props.dispatch(
		actions.update(
			event.target.getAttribute('data-action-type'),
			event.target.name,
			getInputValue(event.target),
		)
	);
	sendOtp = () => {
		let {mobile} = this.props;
		mobile = mobile.trim();
		if (mobile.length === 0)
			return this.props.dispatch(actions.admission.setErrors({
				mobile: 'This is required field'
			}));
		if (! /^\d{6,15}$/.test(mobile))
			return this.props.dispatch(actions.admission.setErrors({
				mobile: 'Invalid mobile'
			}));
		return this.props.dispatch(actions.admission.sendOtp());
	};
	resendOtp = () => this.props.dispatch(actions.admission.resendOtp());
	verifyOtp = () => {
		let {otp} = this.props;
		otp = otp.trim();
		if (otp.length === 0)
			return this.props.dispatch(actions.admission.setErrors({
				otp: 'This is required field',
			}));
		return this.props.dispatch(actions.admission.verifyOtp());
	};

	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12} md={6} mdOffset={3}>
						<h3>Login</h3>
					</Col>
					<Col xs={12} md={6} mdOffset={3}>
						<Nav
							bsStyle='tabs'
							activeKey={this.props.tab}
							onSelect={this.selectTab}>
							<NavItem eventKey='get-otp' title='GET OTP'>GET OTP</NavItem>
							<NavItem eventKey='verify-otp' title='VERIFY OTP'>VERIFY OTP</NavItem>
						</Nav>
					</Col>
				</Row>
				<br/>
				{
					this.props.tab === 'get-otp' &&
					<Row key='get-otp'>
						<Col xs={12} md={6} mdOffset={3}>
							<FormGroup validationState={this.props.errors.mobile ? 'error': null}>
								<ControlLabel>Parent's Mobile Number</ControlLabel>
								<FormControl
									value={this.props.mobile}
									data-action-type='UPDATE_ADMISSION_DATA'
									name='mobile'
									onChange={this.update}/>
								<HelpBlock>{this.props.errors.mobile}</HelpBlock>
							</FormGroup>
							<Button
								disabled={this.props.otpState === 'sending-otp'}
								onClick={this.sendOtp}
								bsStyle='primary'>
								Get OTP
							</Button>
						</Col>
					</Row>
				}
				{
					this.props.tab === 'verify-otp' &&
					<Row key='verify-otp'>
						<Col xs={12} md={6} mdOffset={3}>
							<FormGroup validationState={this.props.errors.otp ? 'error' : null}>
								<ControlLabel>OTP</ControlLabel>
								<FormControl
									value={this.props.otp}
									data-action-type='UPDATE_ADMISSION_DATA'
									name='otp'
									onChange={this.update}/>
								<HelpBlock>{this.props.errors.otp}</HelpBlock>
							</FormGroup>
							{
								this.props.canResendOtp &&
								<Button
									key='resend'
									onClick={this.resendOtp}>
									RESEND
								</Button>
							}
							{' '}
							<Button
								key='verify'
								onClick={this.verifyOtp}
								bsStyle='primary'>
								VERIFY
							</Button>
						</Col>
					</Row>
				}
			</Grid>
		);
	}
}
