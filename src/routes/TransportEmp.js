import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	getStatusOptions,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	Form,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	InputGroup,
	Modal,
	Loading,
	ClickButton,
	Pagination,
	ServiceImage,
	Datepicker,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/transportemp';
import * as actions from '../redux/actions/transportemp';
addView('transportemp', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class TransportEmp extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'transportemp');

	toggleFilters = () => {
		if (this.props.filters === null) {
			this.props.dispatch({
				type: 'SHOW_FILTERS',
				filters: filtersFromQuery(this.props.query)
			});
		} else {
			this.props.dispatch({
				type: 'HIDE_FILTERS',
			});
		}
	};

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	search = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: queryFromFilters(this.props.filters),
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	reset = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [],
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				parseInt(event.currentTarget.getAttribute('data-item-id')),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Driver/Helper?'),
		});
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('transportemp-data-form')),
		)
	);

	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
					this.props.query.length === 0 &&
					this.props.pageInfo.currentPage === 1;
		return (
			<React.Fragment>
				{
					firstTime ?
					<View>{this.renderFirstMessage()}</View> : 
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData()}
					</View>
				}
				<Modal
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Driver/Helper</Text> :
									<Text>Add Driver/Helper</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<Form id='transportemp-data-form' className='row'>
									<input type='hidden' name='id' value={this.props.item.id}/>
									<input type='hidden' name='user_detail[id]' value={this.props.item.detailId}/>
									{
										this.props.item.id &&
										<input type='hidden' name='user_type' value={this.props.item.user_type}/>
									}
									<Col md={6}>
										<FormGroup
											controlId='user_type'
											validationState={this.props.errors.user_type ? 'error': null}>
											<ControlLabel>
												<Text>Type</Text>
											</ControlLabel>
											<Select
												className='form-control'
												name='user_type'
												disabled= {this.props.item.id ? true : false}
												onChange={this.updateData}
												value={this.props.item.user_type}
												options={TransportEmp.transportempOptions(__)}/>
											<HelpBlock>{this.props.errors.user_type}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='fullname'
											validationState={this.props.errors.fullname ? 'error': null}>
											<ControlLabel>
												<Text>Name</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('Name')}
												value={this.props.item['user_detail[fullname]']}
												name="user_detail[fullname]"
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.fullname}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='mobile'
											validationState={this.props.errors.mobile ? 'error': null}>
											<ControlLabel>
												<Text>Mobile</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('Mobile')}
												value={this.props.item.mobile}
												name='mobile'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.mobile}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='govt_identity_number'
											validationState={this.props.errors.govt_identity_number ? 'error': null}>
											<ControlLabel>
												<Text>License Number</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('License Number')}
												value={this.props.item.govt_identity_number}
												name='govt_identity_number'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.govt_identity_number}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='govt_identity_expiry'
											validationState={this.props.errors.govt_identity_expiry ? 'error': null}>
											<ControlLabel>
												<Text>License Expiry Date</Text>
											</ControlLabel>
											<Datepicker
												placeholder={__('License Expiry Date')}
												value={this.props.item.govt_identity_expiry}
												name='govt_identity_expiry'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.govt_identity_expiry}</HelpBlock>
										</FormGroup>
									</Col>
									{
										this.props.item.id &&
										<Col md={6}>
											<FormGroup
												controlId='password'
												validationState={this.props.errors.password ? 'error': null}>
												<ControlLabel><Text>Password</Text></ControlLabel>
												{
													this.props.item.id ?
													<InputGroup>
														<FormControl
															type='password'
															placeholder='Password'
															name='password'
															onChange={this.updateData}
															value={this.props.item.password}
															disabled={!this.props.item.editablePassword}/>
														<InputGroup.Addon>
															<input
																type='checkbox'
																checked={this.props.item.editablePassword}
																onChange={this.updateData}
																name='editablePassword'/>
														</InputGroup.Addon>
													</InputGroup> :
													<FormControl
														type='password'
														placeholder='Password'
														name='password'
														onChange={this.updateData}
														value={this.props.item.password}/>
												}
												<HelpBlock>{this.props.errors.password}</HelpBlock>
											</FormGroup>
										</Col>
									}
									<Clearfix/>
									<Col xs={12}>
										<FormGroup
											controlId='address'
											validationState={this.props.errors.address ? 'error': null}>
											<ControlLabel>
												<Text>Address</Text>
											</ControlLabel>
											<FormControl
												rows='4'
												componentClass='textarea'
												placeholder={__('Address')}
												name="user_detail[address]"
												onChange={this.updateData}
												value={this.props.item['user_detail[address]']}/>
											<HelpBlock>{this.props.errors.address}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup
											controlId='user_image'
											validationState={this.props.errors.user_image ? 'error': null}>
											<ControlLabel>{__('Profile Image')}</ControlLabel>
											<FormControl name='user_image' type='file'/>
											<HelpBlock>{this.props.errors.user_image}</HelpBlock>
										</FormGroup>
									</Col>
									{
										this.props.item.id &&
										<Col sm={12}>
											<ServiceImage
												src={this.props.item.user_image}
												width='96'
												height='96'
												className='img-rounded'/>
										</Col>
									}
									<Col md={12}>
										<FormGroup
											controlId='govt_identity_image'
											validationState={this.props.errors.govt_identity_image ? 'error': null}>
											<ControlLabel>{__('License Image')}</ControlLabel>
											<FormControl name='govt_identity_image' type='file'/>
											<HelpBlock>{this.props.errors.govt_identity_image}</HelpBlock>
										</FormGroup>
									</Col>
									{
										this.props.item.id &&
										<Col sm={12}>
											<input
												type='hidden'
												name='govt_identity_image'
												value={this.props.item.govt_identity_image}/>
											<ServiceImage
												src={this.props.item.govt_identity_image}
												width='96'
												height='96'
												className='img-rounded'/>
										</Col>
									}
									<Col md={6}>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
											<ControlLabel><Text>Status</Text></ControlLabel>
										</Checkbox>
									</Col>
									<Col md={6} className='text-right'>
										<Button
											onClick={this.save}
											bsStyle='primary'
											disabled={this.props.saving}>
											<Text>Submit</Text>
										</Button>
									</Col>
								</Form>
							</React.Fragment>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Driver/Helper</Text></h3>
						<div>
							<Text>
								Add Drivers and vehicle helpers to handle the entire student's transportation in the school.
							</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Driver/Helper'
						glyph='fa-plus'
						side='left'
						onClick={this.startAdd}/>
				}
			</div>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'>
								<Text>Status</Text>
							</td>
							<td className='tw-20'>
								<Text>Name</Text>
							</td>
							<td className='tw-15'>
								<Text>Username</Text>
							</td>
							<td className='tw-15'>
								<Text>License No.</Text>
							</td>
							<td className='tw-15'>
								<Text>Mobile</Text>
							</td>
							<td className='tw-15'>
								<Text>User Type</Text>
							</td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows(__)}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAdd}>
						<Text>Add New</Text>
					</View.Action>
				}
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={6}/>;
		}

		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						onChange={this.changeStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						value={item.is_active}/>
				</td>
				<td className='tw-20'>{item.userdetails[0].fullname}</td>
				<td className='tw-15'>{item.user_name}</td>
				<td className='tw-15'>{item.govt_identity_number}</td>
				<td className='tw-15'>{item.mobile}</td>
				<td className='tw-15 text-capitalize'>
					<Text>{item.user_type}</Text>
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='userdetail__fullname'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullname', '')} />
				<FormControl
					type='text'
					onChange={this.updateFilter}
					title={__('Licence Number')}
					name='user__govt_identity_number'
					placeholder={__('Licence Number')}
					value={filterValue(filters, 'user__govt_identity_number', '')} />
				<FormControl
					type='text'
					name='user__mobile'
					title={__('Mobile')}
					placeholder={__('Mobile')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__mobile', '')} />
				<Select
					title={__('User Type')}
					placeholder={__('Select User Type')}
					name='user__user_type'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__user_type', null)}
					options={TransportEmp.transportempOptions(__)}/>
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='user__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	static transportempOptions(__) {
		return [
			{label: __('Driver'), value: 'driver'},
			{label: __('Helper'), value: 'helper'},
		];
	}
}