import React from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router';

import actions from '../../redux/actions';
import Loading from '../../components/Loading';
import Select from '../../components/Select';

import makeTranslater from '../../translate';

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
	Well,
	BPanel,
	Clearfix
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'onlineconsult';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class OnlineConsult extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buttonConsult: false
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.onlineconsult.init(
				store.getState()
			)
		);
	}

	handleAvailableConsult = event => {
		vex.dialog.confirm({
			message: window.__("Do you want to disable online consultation (Free QA's & Chat Consult)."),
			callback: (value) => {
				if(value) {
					this.props.dispatch(
						actions.onlineconsult.getStart(this.props, 0)
					);
				}
			}
		});
	};

	handleNotificationFreeQA = event => {
		this.props.dispatch(
			actions.onlineconsult.notificationFreeQA(this.props, event.target.getAttribute('data-name'))
		);
	};

	handleGetStart = event => {
		this.props.dispatch(
			actions.onlineconsult.getStart(this.props, 1)
		);
	};

	handleUpdateSetting = event => {
		let name,value;
		if(event.target.type === 'button'){
			name = event.target.getAttribute('data-name');
			value = this.props.item[name] ? 0:1;
		} else {
			name = event.target.name;
			value = event.target.value;
		}

		this.props.dispatch({
			type: 'OC_UPDATE_SETTING_VALUE',
			name,
			value
		});
	};

	editSetting(){
		this.props.dispatch(
			actions.onlineconsult.editSetting(this.props)
		);
	}

	viewList(){
		this.props.dispatch({
			type: 'VIEW_OC_HOME'
		});
	}

	showEditView(){
		this.props.dispatch({
			type: 'SHOW_EDIT_FQA_SETTING'
		});
	}

	save(){
		this.props.dispatch(
			actions.onlineconsult.saveSetting(this.props)
		);
	}

	chatConsult(){
		if(this.props.availability.chat){
			this.props.router.push(this.props.session.user_type === 'doctor' ? '/doctor/chat':'/doh/chat');
		} else {
			vex.dialog.confirm({
				message: window.__("Please update account details for chat consult."),
				callback: (value) => {
					if(value) {
						this.props.dispatch(
							actions.onlineconsult.editSetting(this.props)
						);
					}
				}
			});
		}
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderSetting(__);
				break;
			default:
				content = this.props.availability.status ? this.renderList(__):this.renderGetStart(__);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false}>
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={12} className='fg-white'>
											<h3>{__('Online Consultation')}</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderGetStart(__) {
		return (
			<Row key="onlineconsult-start">
				<Col xs={12} className="oc-getstart-box">
					<Grid>
						<Row>
							<Col xs={3} className="text-center">
								<img src="/imgs/common/free-q-a.png"/>
								<Clearfix />
								<strong>{__("Free Q & A's")}</strong>
							</Col>
							<Col xs={9}>
								<strong>
									{__('Provide free answers for patients questions to build reputation and generate Direct Chat consultation leads.')}
								</strong>
							</Col>
						</Row>
						<hr />
						<Row>
							<Col xs={3} className="text-center">
								<img src="/imgs/common/chat-consult.png" width='100'/>
								<Clearfix />
								<strong>{__("Chat Consult(Paid)")}</strong>
							</Col>
							<Col xs={9}>
								<strong>
									{__('Be available for Online consultation practice and allow patients globally to consult with you online.')}
								</strong>
							</Col>
						</Row>
						<hr />
						<Row>
							<Col xs={3} className="text-center">
								<img src="/imgs/common/online-followups.png" width='100'/>
								<Clearfix />
								<strong>{__("Online Followups")}</strong>
							</Col>
							<Col xs={9}>
								<strong>
									{__('Let your  patients followup online in chat consult and give them suggestion online.')}
								</strong>
							</Col>
							<Clearfix />
							<Col xs={12} className="text-right">
								<Button
									outlined
									onClick={this.handleGetStart}>
									{__('Get Started')}
								</Button>
								<br />
							</Col>
						</Row>
					</Grid>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="section-list">
				<Col xs={12} className="text-right">
					<Icon
						style={{fontSize: 20}}
						glyph={'icon-fontello-cog-1'}
						onClick={::this.editSetting}
					/>
				</Col>
				<Col xs={12} className="text-center">
					<Link
						style={{margin: '10px auto', width: '300px', display: 'block'}}
						className="well"
						to={this.props.session.user_type === 'doctor' ? '/doctor/freeqa':'/doh/freeqa'}>
						{__('Free Q & A\'s')}
					</Link>
					<Link
						style={{margin: '10px auto', width: '300px', display: 'block', cursor: 'pointer'}}
						className="well"
						onClick={::this.chatConsult}>
						{__('Chat Consults')}
					</Link>
					<br />
				</Col>
			</Row>
		);
	}

	renderSetting(__){
		return (
			<Row>
				<Col md={12} className='text-right' style={{marginBottom: '10px'}}>
					{__('Available for Consult')}
					{': '}
					<Button
						className={'btn-lg btn-toggle' + (this.props.item.available_for_consult ? ' active':'')}
						data-toggle="button"
						aria-pressed="false"
						onClick={this.handleAvailableConsult}>
						<div className="handle"></div>
					</Button>
				</Col>
				<Col md={12}>
					<BPanel
						className="panel-oc-setting"
						header={__("Free QA's")}>
						<Grid>
							<Row>
								<Col md={6}>
									<label>{__('Notification for Free QAs')}</label>
								</Col>
								<Col md={6} className="text-right">
									{
										this.props.item.freeqa_notification === 'UPDATING' ?
										__('Updating')+'...':
										<Button
											className={'btn-lg btn-toggle' + (this.props.item.freeqa_notification ? ' active':'')}
											data-toggle="button"
											aria-pressed="false"
											data-name={'freeqa_notification'}
											onClick={this.handleNotificationFreeQA}>
											<div className="handle"></div>
										</Button>
									}
								</Col>
							</Row>
						</Grid>
					</BPanel>
					<BPanel
						className="panel-oc-setting"
						header={__("Chat Consult")}>
						<Grid>
							<Row>
								<Col md={6}>
									<label>{__('Notification for Chat Consult')}</label>
								</Col>
								<Col md={6} className="text-right">
									{
										this.props.item.chat_notification === 'UPDATING' ?
										__('Updating')+'...':
										<Button
											className={'btn-lg btn-toggle' + (this.props.item.chat_notification ? ' active':'')}
											data-toggle="button"
											aria-pressed="false"
											data-name={'chat_notification'}
											onClick={this.handleNotificationFreeQA}>
											<div className="handle"></div>
										</Button>
									}
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<div className="title">
										{__('Bank Account Details')}
									</div>
								</Col>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='account_holder_name'
									validationState={this.props.errors.account_holder_name ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Account Holder Name')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.item.account_holder_name:
											<FormControl
												type='text'
												placeholder={__('Account Holder Name')}
												name='account_holder_name'
												value={this.props.item.account_holder_name}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.account_holder_name}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='account_number'
									validationState={this.props.errors.account_number ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Account Number')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.item.account_number:
											<FormControl 
												type='text'
												placeholder={__('Account Number')}
												name='account_number'
												value={this.props.item.account_number}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.account_number}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='account_type'
									validationState={this.props.errors.account_type ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Account Type')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? (this.props.item.account_type === 1 ? __('Saving'):__('Current')):
											<Select
												name='account_type'
												clearable={false}
												value={this.props.item.account_type}
												onChange={this.handleUpdateSetting}
												options={
													[{
														label: __('Saving'),
														value: 1
													}, {
														label: __('Current'),
														value: 2
													}]
												}/>
										}
										<HelpBlock>{this.props.errors.account_type}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>

							<Row>
								<Col md={12}>
									<div className="title">
										{__('Bank Details')}
									</div>
								</Col>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='bank_name'
									validationState={this.props.errors.bank_name ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Bank Name')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.item.bank_name:
											<FormControl
												type='text'
												placeholder={__('Bank Name')}
												name='bank_name'
												value={this.props.item.bank_name}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.bank_name}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='bank_branch_city'
									validationState={this.props.errors.bank_branch_city ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Bank Branch City')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.item.bank_branch_city:
											<FormControl
												type='text'
												placeholder={__('Bank Branch City')}
												name='bank_branch_city'
												value={this.props.item.bank_branch_city}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.bank_branch_city}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='bank_ifsc_code'
									validationState={this.props.errors.bank_ifsc_code ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Bank IFSC Code')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.item.bank_ifsc_code:
											<FormControl
												type='text'
												placeholder={__('Bank IFSC Code')}
												name='bank_ifsc_code'
												value={this.props.item.bank_ifsc_code}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.bank_ifsc_code}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>

							<Row>
								<Col md={12}>
									<div className="title">
										{__('Payment Details')}
									</div>
								</Col>
							</Row>
							<Row className="field">
								<FormGroup
									controlId='consultation_fee'
									validationState={this.props.errors.consultation_fee ? 'error': null}>
									<Col md={6} componentClass={ControlLabel}>{__('Consultation Fee')}</Col>
									<Col md={6}>
										{
											this.props.item.viewOnly ? this.props.session.currency+this.props.item.consultation_fee :
											<FormControl
												type='text'
												placeholder='Consultation Fee'
												name='consultation_fee'
												value={this.props.item.consultation_fee}
												onChange={this.handleUpdateSetting}/>
										}
										<HelpBlock>{this.props.errors.consultation_fee}</HelpBlock>
									</Col>
								</FormGroup>
							</Row>
							{
								this.props.item.viewOnly &&
								<div>
									<Row>
										<Col md={12}>
											<div className="title">
												{__('Consultation Charges')}
											</div>
										</Col>
									</Row>
									<Row className="field">
										<Col md={6}>{__('Amount patient would charge')}</Col>
										<Col md={6}>{this.props.session.currency+this.props.item.consultation_fee}</Col>
									</Row>
									<Row className="field">
										<Col md={6}>{__('Amount you will receive')}</Col>
										<Col md={6}>
											{
												this.props.session.currency +
												(
													this.props.item.consultation_fee-(
														(this.props.item.consultation_fee*this.props.item.commission)/100
													)
												)
											}
										</Col>
									</Row>
									<Row className="field">
										<Col md={6}>{__('Wikicare Fee + Taxes')}</Col>
										<Col md={6}>{this.props.session.currency+((this.props.item.consultation_fee*this.props.item.commission)/100)}</Col>
									</Row>
								</div>
							}
							<Row>
								<Col md={12} className="text-center">
									<br />
									<div>
										<Button
											outlined
											bsStyle='default'
											onClick={::this.viewList}
											disabled={this.props.saving}
										>
											{__('Cancel')}
										</Button>{' '}
										{
											this.props.item.viewOnly ?
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={::this.showEditView}
											>
												{__('Edit')}
											</Button>
											:
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={::this.save}
												disabled={this.props.saving}
											>
												{__(this.props.saving ? 'Saving' : 'Submit')}
											</Button>
										}
									</div>
								</Col>
							</Row>
						</Grid>
					</BPanel>
				</Col>
			</Row>
		);
	}
}

