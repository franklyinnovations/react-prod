import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';

import makeTranslater from '../translate';

import {makeApiData} from '../api';

import {getStatusLabel} from '../utils';

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	BPanel,
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
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'role';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.role
}))
export default class Role extends React.Component {
	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.handleEdit = event => {
			this.edit(event.target.getAttribute('data-item-id'));
		};

		this.handleState = event => {
			this.changeStatus(
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
			)
		};

		this.updateCheckBox = event => {
			var modelName = event.target.getAttribute('data-model-name');
			var modelCheck = event.target.getAttribute('data-model-checked');
			var rp = [];
			$('.chk input[data-model-name='+modelName+']').each(function(){
				if($(this).val() && $(this).is(':checked')) rp.push(parseInt($(this).val()));
			});
			if(modelName == modelCheck) {
				rp = [];
				if(event.target.checked) {
					$('.chk input[data-model-name='+modelName+']').each(function(){
						if($(this).val()) rp.push(parseInt($(this).val()));
					});
				}
			} else if (event.target.checked && modelCheck !== modelName+'_view') {
				rp.push(parseInt($('.chk input[data-model-checked='+modelName+'_view]').val()));
			} else if (modelCheck === modelName+'_view' && !event.target.checked) {
				rp = [];
			}
			this.checkedStatus(modelName, rp);
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.role.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__);
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
											<h3>{__('Role')}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.startAddNew}
												>
													{__('Add New')}
												</Button>}
												{this.props.viewState === 'DATA_FORM' &&
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
			<Row key="role-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th>{__('S No.')}</th>
								<th>{__('Name')}</th>
								<th>{__('Status')}</th>
								<th>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('roledetail__name')}
										value={this.props.filter.roledetail__name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('role__is_active')}
										value={this.props.filter.role__is_active || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Active')}</option>
										<option value='0'>{__('Inactive')}</option>
									</FormControl>
								</td>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={::this.search}
									/>
									<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={::this.reset}
									/>
								</td>
							</tr>
						</thead>
						<tbody>
						{this.props.items.map(this.getDataRow, this)}
						{this.props.items.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	}

	renderAdd(__) {
		return (
			<Row>
				<Col xs={12}>
					<Form>
						<Row>
							<Col xs={6}>
								<FormGroup
									controlId='name'
									validationState={this.props.errors.name ? 'error': null}
								>
									<ControlLabel>{__('Name')}</ControlLabel>
									<FormControl
										type='text'
										placeholder={__('Name')}
										value={this.props.item.name}
										name='name'
										onChange={this.handleDataUpdate}
									/>
									<HelpBlock>{this.props.errors.name}</HelpBlock>
								</FormGroup>
								<FormGroup controlId='is_active'>
									<Checkbox
										name='is_active'
										onChange={this.handleDataUpdate}
										checked={this.props.item.is_active}
										>
										{__('Active')}
									</Checkbox>
								</FormGroup>
							</Col>
						</Row>
						<BPanel header={__('Permissions')}>
							<Row>
								<Col xs={12}>
									<FormGroup>
										<Row>
											{this.props.helperData.permissions.map((item, key) => {
												return (
													<Col key={key} xs={3} className="permission-box">
														<div>
															<Checkbox 
																name=''
																defaultValue=''
																data-model-name={item.model}
																data-model-checked={item.model}
																onChange={this.updateCheckBox}
																className="chk"
																checked={!!this.props.item.rolepermissions[item.model] && this.props.item.rolepermissions[item.model].length !== 0}
															>
																{__(item.model)}
															</Checkbox>
															<ul className="list-unstyled">
																{item[item.model].map((item2, key2) => {
																	return (
																		<li key={key2}>
																			<Checkbox
																				name='permissionIds[]'
																				defaultValue={item2.id}
																				data-model-name={item.model}
																				data-model-checked={item.model+'_'+item2.action}
																				onChange={this.updateCheckBox}
																				className="chk"
																				checked={!!this.props.item.rolepermissions[item.model] && this.props.item.rolepermissions[item.model].indexOf(item2.id) !== -1}
																			>
																				{__(item2.action)}
																			</Checkbox>
																		</li>
																	);
																})}
															</ul>
														</div>
													</Col>
												);	
											})}
										</Row>
									</FormGroup>
								</Col>
							</Row>
						</BPanel>
					</Form>
					<Row>
						<Col xs={12}>
							<div>
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.viewList}>
									{__('Cancel')}
								</Button>{' '}
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.save}>
									{__('Submit')}
								</Button>
							</div>
							<br/>
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<tr key={item.id}>
				<td>{index+1}</td>
				<td>{item.roledetails[0].name}</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						data-item-status={item.is_active}
					/>
				</td>
			</tr>
		)
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-check';
			case 1:
				return 'icon-simple-line-icons-close';
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={7}>{__('No data found')}</td>
			</tr>
		)
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	updateData(name, value) {
		this.props.dispatch(actions.role.updateData(name, value));
	}

	checkedStatus(model, permissions){
		this.props.dispatch(actions.role.checkedStatus(model, permissions));
	}

	search() {
		this.props.router.push('/admin/role');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/role');
	}

	startAddNew() {
		this.props.dispatch(actions.role.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.role.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.role.edit(this.props, itemId));
	}

	save() {
		this.props.dispatch(
			actions.role.save(this.props, this.props.session.id)
		);
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.role.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}
}

