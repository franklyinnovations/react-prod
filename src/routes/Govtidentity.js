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
import reducer from '../redux/reducers/govtidentity';
import * as actions from '../redux/actions/govtidentity';
addView('govtidentity', reducer);

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
export default class Govtidentity extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'govtidentity');
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

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
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

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Government Identity</Text> :
									<Text>Add Government Identity</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<FormGroup
									controlId='name'
									validationState={this.props.errors.name ? 'error': null}>
									<ControlLabel><Text>Name</Text></ControlLabel>
									<FormControl
										autoFocus
										name='name'
										type='text'
										placeholder={__('Name')}
										onChange={this.updateData}
										value={this.props.item.name}/>
									<HelpBlock>{this.props.errors.name}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='alias'
									validationState={this.props.errors.alias ? 'error': null}>
									<ControlLabel><Text>Short Name</Text></ControlLabel>
									<FormControl
										name='alias'
										type='text'
										onChange={this.updateData}
										value={this.props.item.alias}
										placeholder={__('Short Name')}/>
									<HelpBlock>{this.props.errors.alias}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='countryId'
									validationState={this.props.errors.countryId ? 'error': null}>
									<ControlLabel><Text>Country</Text></ControlLabel>
									<Select
										name='countryId'
										onChange={this.updateData}
										value={this.props.item.countryId}
										options={this.props.meta.countries}/>
									<HelpBlock>{this.props.errors.countryId}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='code'
									validationState={this.props.errors.display_order ? 'error': null}>
									<ControlLabel><Text>Display Order</Text></ControlLabel>
									<FormControl
										type='text'
										name='display_order'
										onChange={this.updateData}
										placeholder={__('Display Order')}
										value={this.props.item.display_order}/>
									<HelpBlock>{this.props.errors.display_order}</HelpBlock>
								</FormGroup>
								<Row>
									<Col xs={6}>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
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
			</React.Fragment>
		);
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
					onChange={this.updateFilter}
					name='govtidentitydetail__name'
					value={filterValue(filters, 'govtidentitydetail__name', '')} />
				<FormControl
					type='text'
					title={__('Short Name')}
					onChange={this.updateFilter}
					placeholder={__('Short Name')}
					name='govtidentitydetail__alias'
					value={filterValue(filters, 'govtidentitydetail__alias', '')} />
				<FormControl
					type='text'
					name='countrydetail__name'
					title={__('Country Name')}
					onChange={this.updateFilter}
					placeholder={__('Country Name')}
					value={filterValue(filters, 'countrydetail__name', '')} />
				<FormControl
					type='text'
					title={__('Display Order')}
					onChange={this.updateFilter}
					placeholder={__('Display Order')}
					name='govtidentity__display_order'
					value={filterValue(filters, 'govtidentity__display_order', '')} />
				<Select
					title={__('Status')}
					onChange={this.updateFilter}
					name='govtidentity__is_active'
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'govtidentity__is_active', null)}/>
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
							<td className='tw-20'><Text>Name</Text></td>
							<td className='tw-20'><Text>Short Name</Text></td>
							<td className='tw-20'><Text>Country</Text></td>
							<td className='tw-20'><Text>Display Order</Text></td>
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
				<td className='tw-20'>{item.govtidentitydetails[0].name}</td>
				<td className='tw-20'>{item.govtidentitydetails[0].alias}</td>
				<td className='tw-20'>{item.country.countrydetails[0].name}</td>
				<td className='tw-20'>{item.display_order}</td>
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
					</DataTable.Actions>
				</td>
			</tr>
		));
	}
}

