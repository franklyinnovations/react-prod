import React from 'react';
import ReactDOM from "react-dom";

import {connect} from "react-redux";

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	BPanel,
	Clearfix,
	Popover,
} from '@sketchpixy/rubix';

import actions from '../redux/actions';

import Loading from "../components/Loading";
import makeTranslater from "../translate";
import Select from "../components/Select";
import {getInputValue} from "../utils";
import ServiceImage from "../components/ServiceImage";

@connect(state => ({
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
}))
export default class Account extends React.Component {
	
	static fetchData(store) {
		return store.dispatch(actions.account.init(store.getState()));
	}

	update = event => {
		this.props.dispatch({
			type: 'UPDATE_PROFILE_DATA',
			name: event.target.name,
			value: getInputValue(event.target)
		});
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible module-container">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col md={6} className='fg-white'>
											<h3>{__('Account Settings')}</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									<Row>
										<Col xs={12}>
											<User __={__} update={this.update}/>
											<Password __={__} update={this.update}/>
										</Col>
									</Row>
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}
}

@connect(state => ({
	session: state.session,
	lang: state.lang,
	...state.view.account,
}))
class User extends React.Component {
	save = () => this.props.dispatch(actions.account.save(this.props));
	render() {
		let {__} = this.props;
		return (
			<Row>
				<Col xs={12}>
					<h3>{__('Account Details')}</h3>
				</Col>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.fullname ? 'error' : null}>
						<ControlLabel>{__('Full Name')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							name='name'
							value={this.props.item.name}/>
						<HelpBlock>{this.props.errors.fullname}</HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.email ? 'error' : null}>
						<ControlLabel>{__('Email')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							name='email'
							value={this.props.item.email}/>
						<HelpBlock>{this.props.errors.email}</HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.mobile ? 'error' : null}>
						<ControlLabel>{__('Mobile')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							name='mobile'
							value={this.props.item.mobile}/>
						<HelpBlock>{this.props.errors.mobile}</HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<FormGroup>
						<ControlLabel>{__('Default Language')}</ControlLabel>
						<Select
							name='default_lang'
							data-action-type='UPDATE_PROFILE_DATA'
							value={this.props.item.default_lang}
							onChange={this.props.update}
							options={this.props.session.languages.map(item => ({
								label: item.name,
								value: item.id
							}))}
						/>
						<HelpBlock></HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={12}>
					<div>
						<br/>
						<Button
							outlined
							bsStyle='lightgreen'
							onClick={this.save}>
							{__(this.props.saving ? 'Saving' : 'Submit')}
						</Button>{' '}
					</div>
				</Col>
			</Row>
		);
	}
}

@connect(state => ({
	session: state.session,
	lang: state.lang,
	...state.view.account,
}))
class Password extends React.Component {
	save = () => this.props.dispatch(actions.account.changePassword(this.props));

	render() {
		let {__} = this.props;
		return (
			<Row>
				<Col xs={12}>
					<h3>{__('Password')}</h3>
				</Col>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.curr_password ? 'error' : null}>
						<ControlLabel>{__('Current Password')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							value={this.props.item.curr_password}
							name='curr_password'
							type='password'/>
						<HelpBlock>{this.props.errors.curr_password}</HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.new_password ? 'error' : null}>
						<ControlLabel>{__('New Password')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							value={this.props.item.new_password}
							name='new_password'
							type='password'/>
						<HelpBlock>{this.props.errors.new_password}</HelpBlock>
					</FormGroup>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<FormGroup validationState={this.props.errors.confirm_new_password ? 'error' : null}>
						<ControlLabel>{__('Confirm Password')}</ControlLabel>
						<FormControl
							onChange={this.props.update}
							data-action-type='UPDATE_PROFILE_DATA'
							value={this.props.item.confirm_new_password}
							name='confirm_new_password'
							type='password'/>
						<HelpBlock>{this.props.errors.confirm_new_password}</HelpBlock>
					</FormGroup>
				</Col>
				<Col xs={12}>
					<Button
						outlined
						bsStyle='lightgreen'
						onClick={this.save}>
						{__(this.props.saving ? 'Saving' : 'Submit')}
					</Button>
					<br/>
					<br/>
				</Col>
			</Row>
		);
	}
}
