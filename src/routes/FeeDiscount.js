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

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/feediscount';
import * as actions from '../redux/actions/feediscount';
addView('feediscount', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Radio,
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
export default class FeeDiscount extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'feediscount');
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
		type: 'START_ADD_FDT',
		data: {
			name: '',
			value: '',
			type: '1',
			is_active: 1,
			feeheadId: null,
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
						<h3><Text>Fee Discounts</Text></h3>
						<div>
							<Text>In this part, you will be creating Fee Discounts.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						onClick={this.startAdd}
						btnText='Add Fee Discount'/>
				}
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					name='name'
					title={__('Name')}
					placeholder={__('Name')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'name', '')} />
				<Select
					name='feeheadId'
					title={__('Fee Head')}
					onChange={this.updateFilter}
					placeholder={__('Fee Head')}
					options={this.props.meta.feeheads}
					value={filterValue(filters, 'feeheadId', null)}/>
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
							<td className='tw-25'><Text>Name</Text></td>
							<td className='tw-25'><Text>Fee Head</Text></td>
							<td className='tw-25'><Text>Discount</Text></td>
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
				<td className='tw-25'>{item.feediscountdetails[0].name}</td>
				<td className='tw-25'>{item.feehead.feeheaddetails[0].name}</td>
				<td className='tw-25'>
					{item.type === 1 ? (item.value + '%') : item.value}
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

	renderEditForm(__) {
		let {item, errors, meta} = this.props;
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
								<Text>Edit Fee Discount</Text> :
								<Text>Add Fee Discount</Text>
							}
						</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body>
					{item === null && <Loading/>}
					{
						item &&
						<React.Fragment>
							<FormGroup validationState={errors.name ? 'error' : null}>
								<ControlLabel><Text>Name</Text></ControlLabel>
								<FormControl 
									name='name'
									value={item.name}
									placeholder={__('Name')}
									onChange={this.updateData}/>
								<HelpBlock>{errors.name}</HelpBlock>
							</FormGroup>
							<FormGroup validationState={errors.value ? 'error' : null}>
								<ControlLabel><Text>Discount</Text></ControlLabel>
								<FormControl 
									name='value'
									value={item.value}
									onChange={this.updateData}
									placeholder={__('Discount')}/>
								<HelpBlock>{errors.value}</HelpBlock>
							</FormGroup>
							<FormGroup>
								<Radio
									inline
									value='1'
									name='type'
									onChange={this.updateData}
									checked={item.type === '1'}>
									<Text>Percentage</Text>
								</Radio>
								<Radio
									inline
									value='2'
									name='type'
									onChange={this.updateData}
									checked={item.type === '2'}>
									<Text>Fix Amount</Text>
								</Radio>
							</FormGroup>
							<FormGroup validationState={errors.feeheadId ? 'error' : null}>
								<ControlLabel><Text>Fee Head</Text></ControlLabel>
								<Select
									name='feeheadId'
									value={item.feeheadId}
									options={meta.feeheads}
									onChange={this.updateData}/>
								<HelpBlock>{errors.feeheadId}</HelpBlock>
							</FormGroup>
							<Row>
								<Col xs={6}>
									<Checkbox
										name='is_active'
										value={item.is_active}
										onChange={this.updateData}>
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
				this.props.dispatch({type: 'RESET_FDT_TRANSPORT'});
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

