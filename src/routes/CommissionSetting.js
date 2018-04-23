import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import actions from '../redux/actions';
import Loading from '../components/Loading';
import Select from '../components/Select';
import makeTranslater from '../translate';

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
	Well,
	BPanel
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'commissionsetting';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class CommissionSetting extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.commissionsetting.init(
				store.getState()
			)
		);
	}

	handleUpdateSetting = event => {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked;
		else
			value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_COMMISSION_DATA_VALUE',
			name: event.target.name,
			value
		});
	};

	handleSaveGlobalCommission = event =>{
		this.props.dispatch(
			actions.commissionsetting.saveGlobalCommission(this.props, event.target.getAttribute('data-type'))
		);
	};

	handleDelete = event => {
		let itemId = event.target.getAttribute('data-item-id'),
			itemIndex = event.target.getAttribute('data-index');
		vex.dialog.confirm({
			message: window.__("Are you absolutely sure to delete the commission?"),
			callback: (value) => {
				if(value) {
					this.props.dispatch(
						actions.commissionsetting.deleteCommission(
							this.props,
							itemId,
							itemIndex
						)
					)
				}
			}
		});
	};

	handleEditGlobalCommission = event => this.props.dispatch({
		type: 'UPDATE_GLOBAL_COMMISSION'
	});

	saveDSC() {
		this.props.dispatch(
			actions.commissionsetting.saveDSC(this.props)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
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
											<h3>{__("Commission Settings")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
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
			<Row key="commissionsetting-list">
				<Col xs={12}>
					<BPanel
						className="panel-oc-setting"
						header={__("Chat Consult Commission Fee")}>
						<Grid>
							<Row>
								<Col xs={12}>
									<Col md={4} componentClass={ControlLabel}>{__('Global Chat Commission Fee')}:</Col>
									{
										this.props.updateGlobal &&
										<Col md={3}>
											<FormGroup
												controlId='chat_consult'
												validationState={this.props.errors.chat_consult ? 'error': null}>
												<FormControl 
													type='text'
													placeholder={__('Percentage')}
													name='chat_consult'
													value={this.props.item.chat_consult}
													onChange={this.handleUpdateSetting}/>
												<HelpBlock>{this.props.errors.chat_consult}</HelpBlock>
											</FormGroup>
										</Col>
									}
									{
										this.props.updateGlobal ?
										<Col md={3} componentClass={ControlLabel}>
											 ({__('In Percentage')})
										</Col>
										:
										<Col md={6} componentClass={ControlLabel}>
											<span style={{marginLeft: '25px'}}>{this.props.item.chat_consult+'%'}</span>
										</Col>
									}
									<Col md={2} className='text-right'>
										{
											this.props.updateGlobal ?
											<Button
												outlined
												bsStyle='lightgreen'
												data-type='chat_consult'
												onClick={this.handleSaveGlobalCommission}
												disabled={this.props.saving.chat_consult}
												>
												{this.props.saving.chat_consult ? __('Updating'):__('Save')}
											</Button>
											:
											<Button
												outlined
												bsStyle='lightgreen'
												data-type='chat_consult'
												onClick={this.handleEditGlobalCommission}
												>
												{__('Edit')}
											</Button>
										}
									</Col>
								</Col>
							</Row>
							<hr />
							<Row>
								<Col xs={12}>
									<Col md={4} componentClass={ControlLabel}>
										{__('Doctor Specific Commission Fee')}:
									</Col>
									<Col md={2}>
										<FormGroup
											controlId='doctorId'
											validationState={this.props.errors.doctorId ? 'error': null}>
											<FormControl 
												type='text'
												placeholder={__('Doctor Id')}
												name='doctorId'
												value={this.props.item.doctorId}
												onChange={this.handleUpdateSetting}/>
											<HelpBlock>{this.props.errors.doctorId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={2}>
										<FormGroup
											controlId='doctorId'
											validationState={this.props.errors.doctor_percentage ? 'error': null}>
											<FormControl 
												type='text'
												placeholder={__('Percentage')}
												name='doctor_percentage'
												value={this.props.item.doctor_percentage}
												onChange={this.handleUpdateSetting}/>
											<HelpBlock>{this.props.errors.doctor_percentage}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={2} componentClass={ControlLabel}>
										(In Percentage)
									</Col>
									<Col md={2} className='text-right'>
										<Button
											outlined
											bsStyle='lightgreen'
											onClick={::this.saveDSC}
											disabled={this.props.saving.dsc}
											>
											{this.props.saving.dsc ? __('Updating'):__('Save')}
										</Button>
									</Col>
								</Col>

								<Col xs={12}>
									<Col md={4}>
									</Col>
									<Col md={8}>
										<Table bordered condensed striped>
											<thead>
												<tr>
													<th>{__('Doctor ID')}</th>
													<th>{__('Name')}</th>
													<th>{__('Commission')}{' %'}</th>
													<th>{__('Action')}</th>
												</tr>
											</thead>
											<tbody>
												{
													this.props.item.dscs.map((item, index) =>
														item.loading ? 
														<tr className='text-center' key={item.id}>
															<td colSpan={4}>{__('Deleting Commission...')}</td>
														</tr>
														:
														<tr key={item.id}>
															<td>{item.doctorprofileId}</td>
															<td>{item.doctorprofile.doctorprofiledetails[0].name}</td>
															<td>{item.percentage}</td>
															<td>
																<Icon
																	title={__('Delete')}
																	className={'fg-danger'}
																	style={{fontSize: 20}}
																	glyph={'icon-flatline-trash'}
																	data-item-id={item.id}
																	data-index={index}
																	onClick={this.handleDelete}
																/>	
															</td>
														</tr>
													)
												}
												{
													this.props.item.dscs.length === 0 &&
													<tr className='text-center'>
														<td colSpan={4}>{__('No Records!!!')}</td>
													</tr>
												}
											</tbody>
										</Table>
									</Col>
								</Col>
							</Row>
						</Grid>
					</BPanel>
				</Col>
			</Row>
		);
	};
}

