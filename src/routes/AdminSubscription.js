import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../api/config';

import actions from '../redux/actions';
import Loading from '../components/Loading';
import Select from '../components/Select';
import TextEditor from '../components/TextEditor';
import makeTranslater from '../translate';
import {getStatusLabel} from '../utils';

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
	Clearfix,
	BPanel
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'adminsubscription';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class AdminSubscription extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.adminsubscription.init(
				store.getState()
			)
		);
	}

	handleDataUpdate = event => {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked;
		else
			value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_SUBSCRIPTION_VALUE',
			name: event.target.name,
			value
		});
	};

	handleTrialDataUpdate = event => {
		let value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_SUBSCRIPTION_TRIAL_VALUE',
			name: event.target.name,
			value
		});
	};

	handleEdit = event => {
		this.props.dispatch(
			actions.adminsubscription.edit(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		);
	};

	viewList = () => {
		this.props.dispatch(actions.adminsubscription.viewList())
	};

	save = () => {
		this.props.dispatch(actions.adminsubscription.save(this.props))
	};

	handleEditTrialSubscription = () => this.props.dispatch({
		type: 'EDIT_TRIAL_SUBSCRIPTION'
	});

	handleSaveTrialSubscription = event => this.props.dispatch(
		actions.adminsubscription.updateTrialSubscription(this.props)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'VIEW_DATA':
				content = this.renderEdit(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__("Subscription")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
											<h3>
												{this.props.viewState === 'VIEW_DATA' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.viewList}
												>
													{__('View List')}
												</Button>}
											</h3>
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

	renderList(__) {
		return (
			<Row key="country-list">
				<Col xs={12}>
					<BPanel
						className="panel-oc-setting"
						header={__("Trial Subscription Period")}>
						<Grid>
							<Row>
								<Col xs={12}>
									<Col md={4} componentClass={ControlLabel}>
										{__('Trial Period (In Days)')}:
									</Col>
									{
										this.props.trialSubscription.editable ?
										<Col md={6}>
											<FormGroup
												controlId='days'
												validationState={this.props.errors.days ? 'error': null}>
												<FormControl 
													type='text'
													placeholder={__('Days')}
													name='days'
													value={this.props.trialSubscription.days}
													onChange={this.handleTrialDataUpdate}/>
												<HelpBlock>{this.props.errors.days}</HelpBlock>
											</FormGroup>
										</Col> 
										:
										<Col md={6} componentClass={ControlLabel}>
											{this.props.trialSubscription.days}{' '}{__('Days')}
										</Col>
									}
									<Col md={2} className='text-right'>
										{
											this.props.trialSubscription.editable ?
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={this.handleSaveTrialSubscription}
												disabled={this.props.saving}
												>
												{this.props.saving ? __('Updating'):__('Save')}
											</Button>
											:
											<Button
												outlined
												bsStyle='lightgreen'
												onClick={this.handleEditTrialSubscription}
												>
												{__('Edit')}
											</Button>
										}
									</Col>
								</Col>
							</Row>
						</Grid>
					</BPanel>
					<BPanel
						className="panel-oc-setting"
						header={__("Subscription Plans")}>
						<Grid>
							<Row>
								<Col xs={12}>
									<Table condensed striped>
										<thead>
											<tr>
												<th width={'5%'}>{__('S No.')}</th>
												<th>{__('Role')}</th>
												<th>{__('Title')}</th>
												<th>{__('Monthly')}</th>
												<th>{__('Quaterly')}</th>
												<th>{__('Yearly')}</th>
												<th width={'9%'}>{__('Actions')}</th>
											</tr>
										</thead>
										<tbody>
										{this.props.items.map(this.getDataRow, this)}
										{this.props.items.length === 0 && this.getNoDataRow(__)}
										</tbody>
									</Table>
								</Col>
							</Row>
						</Grid>
					</BPanel>
				</Col>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<tr key={item.id}>
				<td>{(index+1)}</td>
				<td>{item.type}</td>
				<td>{item.title}</td>
				<td>{this.props.session.currency+item.monthly_amount}</td>
				<td>{this.props.session.currency+item.quaterly_amount}</td>
				<td>{this.props.session.currency+item.yearly_amount}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						title={__('Edit')}
						data-item-id={item.id}
					/>
				</td>
			</tr>
		)
	}

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={9}>{__('No data found')}</td>
			</tr>
		)
	}

	renderEdit(__) {
		let data = this.props.item;
		return (
			<div>
				<Row>
					<Col xs={6}>
						<FormGroup
							controlId='type'
							validationState={this.props.errors.type ? 'error': null}
						>
							<ControlLabel>{__('Role')}</ControlLabel>
							<Select
								name="type"
								placeholder={__('Please Select')}
								onChange={this.handleDataUpdate}
								value={this.props.item.type}
								disabled={true}
								options={
									[{
										label: 'Doctor',
										value: 'doctor'
									}, {
										label: 'Clinic',
										value: 'hospital'
									}, {
										label: 'Both',
										value: 'doctor_clinic_both'
									}]
								}
							/>
							<HelpBlock>{this.props.errors.type}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='title'
							validationState={this.props.errors.title ? 'error': null}
						>
							<ControlLabel>{__('Doctor Profile')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Doctor Profile')}
								value={this.props.item.title}
								name='title'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.title}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='monthly_amount'
							validationState={this.props.errors.monthly_amount ? 'error': null}
						>
							<ControlLabel>{__('Monthly')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Monthly')}
								value={this.props.item.monthly_amount}
								name='monthly_amount'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.monthly_amount}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='quaterly_amount'
							validationState={this.props.errors.quaterly_amount ? 'error': null}
						>
							<ControlLabel>{__('Quaterly')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Quaterly')}
								value={this.props.item.quaterly_amount}
								name='quaterly_amount'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.quaterly_amount}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='yearly_amount'
							validationState={this.props.errors.yearly_amount ? 'error': null}
						>
							<ControlLabel>{__('Yearly')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Yearly')}
								value={this.props.item.yearly_amount}
								name='yearly_amount'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.yearly_amount}</HelpBlock>
						</FormGroup>
					</Col>
					<Col xs={6}>
						<FormGroup
							controlId='features'
							validationState={this.props.errors.features ? 'error': null}
						>
							<ControlLabel>{__('Features')}</ControlLabel>
							<FormControl
								componentClass='textarea'
								rows='16'
								name='features'
								value={this.props.item.features}
								onChange={this.handleDataUpdate}/>
							<HelpBlock>{this.props.errors.features}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						<div>
							<Button
								outlined
								bsStyle='lightgreen'
								onClick={this.viewList}>
								{__('Cancel')}
							</Button>{' '}
							<Button
								outlined
								bsStyle='lightgreen'
								onClick={this.save}>
								{__('Submit')}
							</Button>
						</div>
						<br/>
					</Col>
				</Row>
			</div>
		);
	}
}

