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
	vehicleTypeOptions
} from '../utils/fee';

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
	Modal,
	Loading,
	ClickButton,
	Pagination,
	Datepicker,
	ServiceImage,
	Timepicker,
	Table,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/vehicle';
import * as actions from '../redux/actions/vehicle';
addView('vehicle', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class Vehicle extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'vehicle');

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

	skipNext = () => {
		this.props.dispatch({
			type: 'MAP_ROUTE_SKIP',
			query: [],
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	startAdd = () => this.props.dispatch(actions.startAdd());

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());
	hideNextDataModal = () => {
		this.props.dispatch(
			actions.hideNextDataModal()
		);
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

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
			message: window.__('Are you sure you want to delete this Vehicle?'),
		});
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	updateDataNext = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);

		this.props.dispatch(actions.update('UPDATE_DATA_VALUE_NEXT', name, value));

		if (name === 'routeId') {
			this.props.dispatch(actions.loadRouteAddresses(this.props, value));
		}
	};

	saveNext = () => {
		this.props.dispatch(actions.saveNext(this.props));
	}

	updateTime = event => this.props.dispatch({
		type: 'UPDATE_TIME_VALUE',
		name: event.currentTarget.props.name,
		index: event.currentTarget.props.dataIndex,
		value: getInputValue(event.currentTarget),
	});

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	/*mapWithRoute = event => this.props.router.push(
		'/transport/vehicle/' +
		event.currentTarget.getAttribute('data-item-id') +
		'/route'
	);*/

	mapWithRoute = event => this.props.dispatch(
		actions.mapWithRoute(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('vehicle-data-form')),
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
					bsSize='lg'
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Vehicle</Text> :
									<Text>Add Vehicle</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<Form id='vehicle-data-form' className='row'>
									<input type="hidden" name="id" value={this.props.item.id}/>
									<input type="hidden" name="vehicle_detail[id]" value={this.props.item.detailId}/>
									<input type="hidden" name="vehicle_detail[vehicleId]" value={this.props.item.id}/>
									<Col md={6}>
										<FormGroup
											controlId='name'
											validationState={this.props.errors.name ? 'error': null}>
											<ControlLabel>
												<Text>Vehicle Name</Text>
											</ControlLabel>
											<FormControl
												autoFocus
												type='text'
												placeholder={__('Vehicle Name')}
												value={this.props.item['vehicle_detail[name]']}
												name='vehicle_detail[name]'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.name}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='number'
											validationState={this.props.errors.number ? 'error': null}>
											<ControlLabel>
												<Text>Vehicle Number (Ex: RJ14 DQ2345)</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='number'
												placeholder={__('Vehicle Number')}
												value={this.props.item.number}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.number}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='vehicle_type'
											validationState={this.props.errors.vehicle_type ? 'error': null}>
											<ControlLabel>
												<Text>Type</Text>
											</ControlLabel>
											<Select
												name='vehicle_type'
												onChange={this.updateData}
												placeholder={__('Select Vehicle Type')}
												value={this.props.item.vehicle_type}
												options={vehicleTypeOptions(__)}/>
											<HelpBlock>{this.props.errors.vehicle_type}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='total_seats'
											validationState={this.props.errors.total_seats ? 'error': null}>
											<ControlLabel>
												<Text>Total Seats</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('Total Seats')}
												value={this.props.item.total_seats}
												name='total_seats'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.total_seats}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='insurance_number'
											validationState={this.props.errors.insurance_number ? 'error': null}>
											<ControlLabel>
												<Text>Insurance Number</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('Insurance Number')}
												value={this.props.item.insurance_number}
												name='insurance_number'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.insurance_number}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='insurance_expiry_date'
											validationState={this.props.errors.insurance_expiry_date ? 'error': null}>
											<ControlLabel>
												<Text>Insurance Expiry Date</Text>
											</ControlLabel>
											<Datepicker
												onChange={this.updateData}
												name='insurance_expiry_date'
												value={this.props.item.insurance_expiry_date}
												placeholder={__('Insurance Expiry Date')}/>
											<HelpBlock>{this.props.errors.insurance_expiry_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='fuel_type'
											validationState={this.props.errors.fuel_type ? 'error': null}>
											<ControlLabel>
												<Text>Fuel Type</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='fuel_type'
												onChange={this.updateData}
												value={this.props.item.fuel_type}
												placeholder={__('Fuel Type')}/>
											<HelpBlock>{this.props.errors.fuel_type}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='model'
											validationState={this.props.errors.model ? 'error': null}>
											<ControlLabel>
												<Text>Model</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='vehicle_detail[model]'
												onChange={this.updateData}
												value={this.props.item['vehicle_detail[model]']}
												placeholder={__('Model')}/>
											<HelpBlock>{this.props.errors.model}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='make'
											validationState={this.props.errors.make ? 'error': null}>
											<ControlLabel>
												<Text>Make</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='make'
												onChange={this.updateData}
												value={this.props.item.make}
												placeholder={__('Make')}/>
											<HelpBlock>{this.props.errors.make}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='colour'
											validationState={this.props.errors.colour ? 'error': null}>
											<ControlLabel>
												<Text>Colour</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='vehicle_detail[colour]'
												onChange={this.updateData}
												value={this.props.item['vehicle_detail[colour]']}
												placeholder={__('Colour')}/>
											<HelpBlock>{this.props.errors.colour}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='place'
											validationState={this.props.errors.place ? 'error': null}>
											<ControlLabel>
												<Text>Place of Vehicle Registration</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='vehicle_detail[place]'
												onChange={this.updateData}
												value={this.props.item['vehicle_detail[place]']}
												placeholder={__('Place of Vehicle Registration')}/>
											<HelpBlock>{this.props.errors.place}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='registration_number'
											validationState={this.props.errors.registration_number ? 'error': null}>
											<ControlLabel>
												<Text>Vehicle Registration Number</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='registration_number'
												onChange={this.updateData}
												value={this.props.item.registration_number}
												placeholder={__('Vehicle Registration Number')}/>
											<HelpBlock>{this.props.errors.registration_number}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='pollution_control_number'
											validationState={this.props.errors.pollution_control_number ? 'error': null}>
											<ControlLabel>
												<Text>Pollution Control Number</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='pollution_control_number'
												onChange={this.updateData}
												value={this.props.item.pollution_control_number}
												placeholder={__('Pollution Control Number')}/>
											<HelpBlock>{this.props.errors.pollution_control_number}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='pollution_control_expiry_date'
											validationState={this.props.errors.pollution_control_expiry_date ? 'error': null}>
											<ControlLabel>
												<Text>Pollution Control Expiry Date</Text>
											</ControlLabel>
											<Datepicker
												name='pollution_control_expiry_date'
												onChange={this.updateData}
												value={this.props.item.pollution_control_expiry_date}
												placeholder={__('Pollution Control Expiry Date')}/>
											<HelpBlock>{this.props.errors.pollution_control_expiry_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<FormGroup
										controlId='vehicle_image'
										validationState={this.props.errors.vehicle_image ? 'error': null}>
										<Col md={6}>
											<ControlLabel>
												<Text>Vehicle Image</Text>
											</ControlLabel>
											<FormControl name='vehicle_image' type='file'/>
											<HelpBlock>{this.props.errors.vehicle_image}</HelpBlock>
										</Col>
										{
											this.props.item.id &&
											<Col md={6}>
												<input
													type='hidden'
													name='vehicle_image'
													value={this.props.item.vehicle_image}/>
												<ServiceImage
													src={this.props.item.vehicle_image}
													width='96'
													height='96'
													className='img-rounded'/>
											</Col>
										}
										<Clearfix/>
									</FormGroup>
									<FormGroup
										controlId='vehicle_document'
										validationState={this.props.errors.vehicle_document ? 'error': null}>
										<Col md={6}>
											<ControlLabel>
												<Text>Registration Copy</Text>
											</ControlLabel>
											<FormControl name='vehicle_document' type='file'/>
											<HelpBlock>{this.props.errors.vehicle_document}</HelpBlock>
										</Col>
										{
											this.props.item.id &&
											<Col md={6}>
												<input
													type='hidden'
													name='vehicle_document'
													value={this.props.item.vehicle_document}/>
												<ServiceImage
													src={this.props.item.vehicle_document}
													width='96'
													height='96'
													className='img-rounded'/>
											</Col>
										}
										<Clearfix/>
									</FormGroup>
									<FormGroup
										controlId='pollution_control_certificate'
										validationState={this.props.errors.pollution_control_certificate ? 'error': null}>
										<Col md={6}>
											<ControlLabel>
												<Text>Pollution Control Certificate</Text>
											</ControlLabel>
											<FormControl name='pollution_control_certificate' type='file'/>
											<HelpBlock>{this.props.errors.pollution_control_certificate}</HelpBlock>
										</Col>
										{
											this.props.item.id &&
											<Col md={6}>
												<input
													type='hidden'
													name='pollution_control_certificate'
													value={this.props.item.pollution_control_certificate}/>
												<ServiceImage
													src={this.props.item.pollution_control_certificate}
													width='96'
													height='96'
													className='img-rounded'/>
											</Col>
										}
										<Clearfix/>
									</FormGroup>
									<FormGroup
										controlId='insurance_certificate'
										validationState={this.props.errors.insurance_certificate ? 'error': null}>
										<Col md={6}>
											<ControlLabel>
												<Text>Insurance Certificate</Text>
											</ControlLabel>
											<FormControl name='insurance_certificate' type='file'/>
											<HelpBlock>{this.props.errors.insurance_certificate}</HelpBlock>
										</Col>
										{
											this.props.item.id &&
											<Col md={6}>
												<input
													type='hidden'
													name='insurance_certificate'
													value={this.props.item.insurance_certificate}/>
												<ServiceImage
													src={this.props.item.insurance_certificate}
													width='96'
													height='96'
													className='img-rounded'/>
											</Col>
										}
										<Clearfix/>
									</FormGroup>
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
											<Text>Save & Next</Text>
										</Button>
									</Col>
								</Form>
							</React.Fragment>
						}
					</Modal.Body>
				</Modal>
				<Modal
					bsSize='lg'
					backdrop='static'
					onHide={this.hideNextDataModal}
					show={this.props.itemNext !== false}>
					{
						this.props.itemNext &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.itemNext.id ?
									<Text>Map Routes & Drivers</Text> :
									<Text>Map Routes & Drivers</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						<View>
							<Row>
								<Col md={6}>
									<FormGroup
										controlId='driverId'
										validationState={this.props.errors.driverId ? 'error': null}>
										<ControlLabel><Text>Driver</Text></ControlLabel>
										<Select
											name="driverId"
											onChange={this.updateDataNext}
											title={__('Select Driver')}
											value={this.props.itemNext.driverId}
											placeholder={__('Select Driver')}
											options={this.props.meta.drivers}/>
										<HelpBlock>{this.props.errors.driverId}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup
										controlId='helperId'
										validationState={this.props.errors.helperId ? 'error': null}>
										<ControlLabel><Text>Helper</Text></ControlLabel>
										<Select
											name='helperId'
											onChange={this.updateDataNext}
											title={__('Select Helper')}
											value={this.props.itemNext.helperId}
											placeholder={__('Select Helper')}
											options={this.props.meta.helpers}/>
										<HelpBlock>{this.props.errors.helperId}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={6}>
									<FormGroup
										controlId='routeId'
										validationState={this.props.errors.routeId ? 'error': null}>
										<ControlLabel><Text>Route</Text></ControlLabel>
										<Select
											name='routeId'
											disabled={!!this.props.itemNext.id}
											onChange={this.updateDataNext}
											title={__('Select Route')}
											value={this.props.itemNext.routeId}
											placeholder={__('Select Route')}
											options={this.props.meta.routes}/>
										<HelpBlock>{this.props.errors.routeId}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
							{
								this.props.addresses !== false &&
								<Table>
									<thead>
										<tr>
											<th className='tw-40'><Text>Address</Text></th>
											<th className='tw-30'><Text>Pick-Up Time</Text></th>
											<th className='tw-30'><Text>Drop Time</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.addresses === null ?
											<tr key={0}>
												<td colSpan='3'><Loading/></td>
											</tr> : this.renderAddresses()
										}
									</tbody>
								</Table>
							}
							<Button onClick={this.skipNext} bsStyle='primary'>
								<Text>Skip</Text>
							</Button>
							{' '}
							<Button onClick={this.saveNext} bsStyle='primary'>
								<Text>Submit</Text>
							</Button>
						</View>
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
						<h3><Text>Vehicle</Text></h3>
						<div>
							<Text>
								Add your school vehicles used for student's transportation.
							</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>School Buses, School Van, School Autos etc.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Vehicle'
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
							<td className='tw-15'>
								<Text>Name</Text>
							</td>
							<td className='tw-15'>
								<Text>Number</Text>
							</td>
							<td className='tw-10'>
								<Text>Type</Text>
							</td>
							<td className='tw-15'>
								<Text>Model</Text>
							</td>
							<td className='tw-15'>
								<Text>Colour</Text>
							</td>
							<td className='tw-10'>
								<Text>Total Seats</Text>
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
				<td className='tw-15'>{item.vehicledetails[0].name}</td>
				<td className='tw-15'>{item.number}</td>
				<td className='tw-10 text-capitalize'>
					<Text>{item.vehicle_type}</Text>
				</td>
				<td className='tw-15'>
					<Text>{item.vehicledetails[0].model}</Text>
				</td>
				<td className='tw-15'>
					<Text>{item.vehicledetails[0].colour}</Text>
				</td>
				<td className='tw-10'>{item.total_seats}</td>
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
						<DataTable.Action
							glyph='fa-thumbtack'
							onClick={this.mapWithRoute}
							data-item-id={item.id}
							text='Map Routes & Drivers'/>
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
					name='vehicledetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'vehicledetail__name', '')} />
				<FormControl
					type='text'
					title={__('Number')}
					name='vehicle__number'
					placeholder={__('Number')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'vehicle__number', '')} />
				<Select
					title={__('Vehicle Type')}
					placeholder={__('Select Vehicle Type')}
					name='vehicle__vehicle_type'
					onChange={this.updateFilter}
					value={filterValue(filters, 'vehicle__vehicle_type', null)}
					options={vehicleTypeOptions(__)}/>
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='vehicle__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'vehicle__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderAddresses() {
		return this.props.addresses.map(
			(address, index) => 
				<tr key={address.routeaddressId}>
					<td>{address.label}</td>
					<td>
						<Timepicker
							name='pick_up_time'
							dataIndex={index}
							value={address.pick_up_time}
							onChange={this.updateTime}/>
					</td>
					<td>
						<Timepicker
							name='drop_time'
							dataIndex={index}
							value={address.drop_time}
							onChange={this.updateTime}/>
					</td>
				</tr>
		);
	}
}