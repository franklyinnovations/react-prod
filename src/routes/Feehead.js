import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {
	feeTypeOptions,
	vehicleTypeOptions,
	transportationFeeTypeOptions,
} from '../utils/fee';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/feehead';
import * as actions from '../redux/actions/feehead';
addView('feehead', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Modal,
	Button,
	Select,
	Loading,
	Checkbox,
	HelpBlock,
	DataTable,
	FormGroup,
	Pagination,
	FormControl,
	ClickButton,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Feehead extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'feehead');
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
		this.props.router.push(this.props.router.location);
	};
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	startAdd = () => this.props.dispatch({
		type: 'START_ADD_FHD',
		data: {
			name: '',
			alias: '',
			type: null,
			is_active: 1,
			routeId: null,
			vehicle_type: null,
			routeaddressId: null,
			no_of_installments: '',
			transportationFeeType: null,
		},
	});
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	save = () => this.props.dispatch(actions.save(this.props));
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
			+event.currentTarget.getAttribute('data-item-status'),
		)
	);
	remove = event => this.props.dispatch(
		actions.remove(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
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
					firstTime ?
					<View>{this.renderFirstMessage()}</View> : 
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData(__)}
					</View>
				}
				{this.renderEditForm(__)}
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Fee Heads</Text></h3>
						<div>
							<Text>In this part, you will be creating all the Fee Heads.</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>Tuition Fee, Hostel Fee, Transportation Fee etc.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Fee Head'
						onClick={this.startAdd}/>
				}
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<Select
					name='type'
					title={__('Fee Type')}
					onChange={this.updateFilter}
					placeholder={__('Fee Type')}
					options={feeTypeOptions(__)}
					value={filterValue(filters, 'type', null)}/>
				<FormControl
					type='text'
					name='name'
					title={__('Name')}
					placeholder={__('Name')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'name', '')} />
				<FormControl
					type='text'
					name='alias'
					title={__('Short Name')}
					onChange={this.updateFilter}
					placeholder={__('Short Name')}
					value={filterValue(filters, 'alias', '')} />
				<FormControl
					type='text'
					name='no_of_installments'
					onChange={this.updateFilter}
					title={__('No. Of Installments')}
					placeholder={__('No. Of Installments')}
					value={filterValue(filters, 'no_of_installments', '')} />
				<Select
					name='is_active'
					title={__('Status')}
					onChange={this.updateFilter}
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'is_active', null)}/>
			</View.Filters>
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

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-20'><Text>Fee Type</Text></td>
							<td className='tw-20'><Text>Name</Text></td>
							<td className='tw-20'><Text>Short Name</Text></td>
							<td className='tw-20'><Text>No. Of Installments</Text></td>
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						data-item-id={item.id}
						value={item.is_active}
						onChange={this.changeStatus}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						title={getStatusTitle(item.is_active, __)}/>
				</td>
				<td className='tw-20'>{item.type}</td>
				<td className='tw-20'>{item.feeheaddetails[0].name}</td>
				<td className='tw-20'>{item.feeheaddetails[0].alias}</td>
				<td className='tw-20'>{item.no_of_installments}</td>
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

	renderEditForm(__) {
		let {item, errors, meta} = this.props,
			editing = item && !!item.id;
		return (
			<Modal
				show={item !== false}
				onHide={this.hideDataModal}>
				{
					this.props.item &&
					<Modal.Header closeButton>
						<Modal.Title>
							{
								item.id ?
								<Text>Edit Fee Head</Text> :
								<Text>Add Fee Head</Text>
							}
						</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body>
					{item === null && <Loading/>}
					{
						item &&
						<React.Fragment>
							<FormGroup validationState={errors.type ? 'error' : null}>
								<ControlLabel><Text>Fee Type</Text></ControlLabel>
								<Select
									name='type'
									value={item.type}
									disabled={editing}
									onChange={this.updateData}
									options={feeTypeOptions(__)}/>
								<HelpBlock>{errors.type}</HelpBlock>
							</FormGroup>
							{
								item.type === 'Transportation' &&
								<React.Fragment>
									<FormGroup validationState={errors.vehicle_type ? 'error' : null}>
										<ControlLabel><Text>Vehicle Type</Text></ControlLabel>
										<Select
											disabled={editing}
											name='vehicle_type'
											value={item.vehicle_type}
											onChange={this.updateData}
											options={vehicleTypeOptions(__)}/>
										<HelpBlock>{errors.vehicle_type}</HelpBlock>
									</FormGroup>
									<FormGroup validationState={errors.transportationFeeType ? 'error' : null}>
										<ControlLabel><Text>Transportation Fee Type</Text></ControlLabel>
										<Select
											disabled={editing}
											onChange={this.updateData}
											name='transportationFeeType'
											value={item.transportationFeeType}
											options={transportationFeeTypeOptions(__)}/>
										<HelpBlock>{errors.transportationFeeType}</HelpBlock>
									</FormGroup>
									{
										item.transportationFeeType && 
										item.transportationFeeType !== 'lumsum' &&
										<FormGroup validationState={errors.routeId ? 'error' : null}>
											<ControlLabel><Text>Route</Text></ControlLabel>
											<Select
												name='routeId'
												disabled={editing}
												value={item.routeId}
												onChange={this.updateData}
												isLoading={meta.routes === null}
												options={meta.routes || undefined}/>
											<HelpBlock>{errors.routeId}</HelpBlock>
										</FormGroup>
									}
									{
										item.transportationFeeType === 'stoppage' &&
										<FormGroup validationState={errors.routeaddressId ? 'error' : null}>
											<ControlLabel><Text>Stoppage</Text></ControlLabel>
											<Select
												disabled={editing}
												name='routeaddressId'
												onChange={this.updateData}
												value={item.routeaddressId}
												isLoading={meta.routeaddresses === null}
												options={meta.routeaddresses || undefined}/>
											<HelpBlock>{errors.routeaddressId}</HelpBlock>
										</FormGroup>
									}
								</React.Fragment>
							}
							<FormGroup validationState={errors.name ? 'error' : null}>
								<ControlLabel><Text>Name</Text></ControlLabel>
								<FormControl 
									name='name'
									value={item.name}
									placeholder={__('Name')}
									onChange={this.updateData}/>
								<HelpBlock>{errors.name}</HelpBlock>
							</FormGroup>
							<FormGroup validationState={errors.alias ? 'error' : null}>
								<ControlLabel><Text>Short Name</Text></ControlLabel>
								<FormControl 
									name='alias'
									value={item.alias}
									onChange={this.updateData}
									placeholder={__('Short Name')}/>
								<HelpBlock>{errors.alias}</HelpBlock>
							</FormGroup>
							<FormGroup validationState={errors.no_of_installments ? 'error' : null}>
								<ControlLabel><Text>No. of Installments</Text></ControlLabel>
								<FormControl 
									name='no_of_installments'
									onChange={this.updateData}
									value={item.no_of_installments}
									placeholder={__('No. of Installments')}/>
								<HelpBlock>{errors.no_of_installments}</HelpBlock>
							</FormGroup>
							<Row>
								<Col xs={6}>
									<Checkbox
										name='is_active'
										onChange={this.updateData}
										value={item.is_active}>
										<ControlLabel><Text>Status</Text></ControlLabel>
									</Checkbox>
								</Col>
								<Col xs={6} className='text-right'>
									<Button
										bsStyle='primary'
										onClick={this.save}>
										<Text>Submit</Text>
									</Button>
								</Col>
							</Row>
						</React.Fragment>
					}
				</Modal.Body>
			</Modal>
		);
	}

	componentDidUpdate(prevProps) {
		if (!this.props.item || !prevProps.item) return;

		if (this.props.item.type !== prevProps.item.type) {
			if (this.props.item.type !== 'Transportation') {
				this.props.dispatch({type: 'RESET_FHD_TRANSPORT'});
			}
		} 
		if (this.props.item.transportationFeeType !== prevProps.item.transportationFeeType) {
			if (this.props.item.transportationFeeType && this.props.item.transportationFeeType !== 'lumsum') {
				this.props.dispatch(actions.loadRoutes(this.props));
			}
		}
		if (this.props.item.transportationFeeType === 'stoppage') {
			if (this.props.item.routeId !== prevProps.item.routeId) {
				this.props.dispatch(actions.loadRouteAddresses(this.props));
			}
		}
	}
}

