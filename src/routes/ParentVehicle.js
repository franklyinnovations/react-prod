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
	Modal,
	Loading,
	ClickButton,
	Pagination,
	Datepicker,
	ServiceImage,
	Alert,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/parentvehicle';
import * as actions from '../redux/actions/parentvehicle';
addView('parentvehicle', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class ParentVehicle extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'parentvehicle');

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

	startAdd = () => this.props.dispatch(actions.startAdd());

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
			message: window.__('Are you sure you want to delete this Parent Vehicle Pass?'),
		});
	};

	updateData = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			name,
			value,
		));

		if(name == 'bcsmapId')
			this.props.dispatch(actions.loadStudents(this.props, value));
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

	hideQRCode = () => this.props.dispatch({type: 'HIDE_PARENTVEHICLE_QRCODE'});

	viewQRCode = event => this.props.dispatch(
		actions.viewQRCode(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	sendEmailQRCode = event => this.props.dispatch(
		actions.sendEmail(
			this.props, 
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
					this.props.query.length === 0 &&
					this.props.pageInfo.currentPage === 1;
		return (
			<React.Fragment>
				{
					this.props.qrcode ?
					<VehicleQrcode {...this.props.qrcode} hideQRCode={this.hideQRCode}/> : (
					firstTime ?
					<View>{this.renderFirstMessage()}</View> :
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData()}
					</View>)
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
									<Text>Edit Parent Vehicle Pass</Text> :
									<Text>Add Parent Vehicle Pass</Text>
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
									<input type="hidden" name="parentvehicledetail[id]" value={this.props.item.detailId}/>
									<input type="hidden" name="parentvehicledetail[parentvehicleId]" value={this.props.item.id}/>
									<Col md={6}>
										<FormGroup
											controlId='bcsmapId'
											validationState={this.props.errors.bcsmapId ? 'error': null}>
											<ControlLabel>
												<Text>Class</Text>
											</ControlLabel>
											<Select
												autoFocus
												name='bcsmapId'
												onChange={this.updateData}
												placeholder={__('Select Class')}
												value={this.props.item.bcsmapId}
												options={this.props.meta.bcsmaps}/>
											<HelpBlock>{this.props.errors.bcsmapId}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='studentId'
											validationState={this.props.errors.studentId ? 'error': null}>
											<ControlLabel>
												<Text>Student</Text>
											</ControlLabel>
											<Select
												isLoading={this.props.meta.students === null}
												name='studentId'
												onChange={this.updateData}
												placeholder={__('Select Student')}
												value={this.props.item.studentId}
												options={this.props.meta.students}/>
											<HelpBlock>{this.props.errors.studentId}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									{
										this.props.item.bcsmapId &&
										this.props.meta.students &&
										this.props.meta.students.length === 0 &&
										<Col xs={12}>
											<Alert>
												<Text>No student found in this class.</Text>
											</Alert>
										</Col>
									}
									<Col md={6}>
										<FormGroup
											controlId='number'
											validationState={this.props.errors.number ? 'error': null}>
											<ControlLabel>
												<Text>Vehicle Number</Text>
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
									<Col md={6}>
										<FormGroup
											controlId='vehicle_type'
											validationState={this.props.errors.vehicle_type ? 'error': null}>
											<ControlLabel>
												<Text>Vehicle Type</Text>
											</ControlLabel>
											<Select
												name='vehicle_type'
												onChange={this.updateData}
												placeholder={__('Select Vehicle Type')}
												value={this.props.item.vehicle_type}
												options={ParentVehicle.getVehicleTypeOptions(__)}/>
											<HelpBlock>{this.props.errors.vehicle_type}</HelpBlock>
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
												onChange={this.updateData}
												name='parentvehicledetail[model]'
												value={this.props.item['parentvehicledetail[model]']}
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
												name='parentvehicledetail[colour]'
												onChange={this.updateData}
												value={this.props.item['parentvehicledetail[colour]']}
												placeholder={__('Colour')}/>
											<HelpBlock>{this.props.errors.colour}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
									<Col md={6}>
										<FormGroup
											controlId='name'
											validationState={this.props.errors.owner ? 'error': null}>
											<ControlLabel>
												<Text>Registration Owner Name</Text>
											</ControlLabel>
											<FormControl
												type='text'
												placeholder={__('Registration Owner Name')}
												value={this.props.item['parentvehicledetail[owner]']}
												name='parentvehicledetail[owner]'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.owner}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='place'
											validationState={this.props.errors.place ? 'error': null}>
											<ControlLabel>
												<Text>Place of Vehicle Registration</Text>
											</ControlLabel>
											<FormControl
												type='text'
												name='parentvehicledetail[place]'
												onChange={this.updateData}
												value={this.props.item['parentvehicledetail[place]']}
												placeholder={__('Place of Vehicle Registration')}/>
											<HelpBlock>{this.props.errors.place}</HelpBlock>
										</FormGroup>
									</Col>
									<Clearfix/>
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
									<Clearfix/>
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
									</FormGroup>
									<Clearfix/>
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
										<input
											type='hidden'
											name='vehicle_document'
											value={this.props.item.vehicle_document}/>
										{
											this.props.item.id &&
											<Col md={6}>
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
										<input
											type='hidden'
											name='pollution_control_certificate'
											value={this.props.item.pollution_control_certificate}/>
										{
											this.props.item.id &&
											<Col md={6}>
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
										<input
											type='hidden'
											name='insurance_certificate'
											value={this.props.item.insurance_certificate}/>
										{
											this.props.item.id &&
											<Col md={6}>
												<ServiceImage
													src={this.props.item.insurance_certificate}
													width='96'
													height='96'
													className='img-rounded'/>
											</Col>
										}
										<Clearfix/>
									</FormGroup>
									<Clearfix/>
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
						<h3><Text>Parent Vehicle Passes</Text></h3>
						<div>
							<Text>
								{'Add Parent\'s Vehicle information to generate the Parent Vehicle Passes to allow in the School premises.'}
							</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Parent Vehicle Passes'
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
							<td className='tw-14'>
								<Text>Enrollment Number</Text>
							</td>
							<td className='tw-14'>
								<Text>Student Name</Text>
							</td>
							<td className='tw-14'>
								<Text>Father Name</Text>
							</td>
							<td className='tw-14'>
								<Text>Father Contact</Text>
							</td>
							<td className='tw-14'>
								<Text>Vechicle Number</Text>
							</td>
							<td className='tw-14'>
								<Text>Vehicle Type</Text>
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
				<td className='tw-14'>{item.student.enrollment_no}</td>
				<td className='tw-14'>{item.student.user.userdetails[0].fullname}</td>
				<td className='tw-14'>{item.student.studentdetails[0].father_name}</td>
				<td className='tw-14'>{item.student.father_contact}</td>
				<td className='tw-14'>{item.number}</td>
				<td className='tw-12 text-capitalize'>
					<Text>{item.vehicle_type}</Text>
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
						<DataTable.Action
							glyph='fa-qrcode'
							data-item-id={item.id}
							onClick={this.viewQRCode}
							text='QR Code'/>
						{
							this.permissions.sendemail &&
							<DataTable.Action
								glyph='fa-envelope'
								data-item-id={item.id}
								onClick={this.sendEmailQRCode}
								text='Email QR Code'/>	
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
					title={__('Enrollment Number')}
					placeholder={__('Enrollment Number')}
					name='enrollment_no'
					onChange={this.updateFilter}
					value={filterValue(filters, 'enrollment_no', '')} />
				<FormControl
					type='text'
					title={__('Student Name')}
					name='fullname'
					placeholder={__('Student Name')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'fullname', '')} />
				<FormControl
					type='text'
					title={__('Father Contact')}
					name='father_contact'
					placeholder={__('Father Contact')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'father_contact', '')} />	
				<FormControl
					type='text'
					title={__('Vehicle Number')}
					name='number'
					placeholder={__('Vehicle Number')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'number', '')} />	
				<Select
					title={__('Vehicle Type')}
					placeholder={__('Select Vehicle Type')}
					name='vehicle_type'
					onChange={this.updateFilter}
					value={filterValue(filters, 'vehicle_type', null)}
					options={ParentVehicle.getVehicleTypeOptions(__)}/>
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	static getVehicleTypeOptions(__) {
		return [
			{
				value: 'auto',
				label: __('Auto')
			},
			{
				value: 'bus',
				label: __('Bus')
			},
			{
				value: 'van',
				label: __('Van')
			}
		];
	}
}

class VehicleQrcode extends React.Component {

	state = {
		QRCode: false,	
	};

	render() {
		let QRCode = this.state.QRCode;
		if (!QRCode) return <Loading/>;
		return (
			<View className='parent-vehicle-qr-code'>
				<QRCode size={256} value={'' + this.props.id}/>
				<div className='hidden-print'>
					<Button onClick={this.props.hideQRCode}>Back</Button>
					{' '}
					<Button bsStyle='primary' onClick={window.print}>Download</Button>
				</div>
			</View>
		);
	}

	async componentDidMount() {
		$('#body').addClass('full-height-content');
		this.setState({
			QRCode: (await import('qrcode.react')).default
		});
	}

	componentWillUnmount() {
		$('#body').removeClass('full-height-content');
	}
}