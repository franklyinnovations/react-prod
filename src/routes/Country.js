import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
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
	Loading,
	Pagination,
	Modal,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/country';
import * as actions from '../redux/actions/country';
addView('country', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Country extends React.Component {
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'country');

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

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	save = () => this.props.dispatch(actions.save(this.props));

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
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Country</Text> :
									<Text>Add Country</Text>
								}
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Form>
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
										onChange={this.updateData}
									/>
									<HelpBlock>{this.props.errors.name}</HelpBlock>
								</FormGroup>	
								<FormGroup 
									controlId="iso_code"
									validationState={this.props.errors.iso_code ? 'error': null}
								>
									<ControlLabel>{__('ISO Code')}</ControlLabel>
									<Select
										className='form-control'
										name="iso_code"
										onChange={this.updateData}
										value={this.props.item.iso_code}
										options={this.props.helperData.isoCodes}
									/>
									<HelpBlock>{this.props.errors.iso_code}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='code'
									validationState={this.props.errors.code ? 'error': null}
								>
									<ControlLabel>{__('Code')}</ControlLabel>
									<FormControl
										type='text'
										placeholder={__('Code')}
										value={this.props.item.code}
										name='code'
										onChange={this.updateData}
									/>
									<HelpBlock>{this.props.errors.code}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='currencyId'
									validationState={this.props.errors.currencyId ? 'error': null}
								>
									<ControlLabel>{__('Currency')}</ControlLabel>
									<Select
										className='form-control'
										name="currencyId"
										onChange={this.updateData}
										value={this.props.item.currencyId}
										options={this.props.helperData.currencies}
									/>
									<HelpBlock>{this.props.errors.currencyId}</HelpBlock>
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
											onClick={this.save}
											bsStyle='primary'>
											<Text>Submit</Text>
										</Button>
									</Col>
								</Row>
							</Form>
						}
					</Modal.Body>
				</Modal>
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

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='countrydetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'countrydetail__name', '')} />
				<Select
					title={__('ISO Code')}
					placeholder={__('Select ISO Code')}
					name='country__iso_code'
					onChange={this.updateFilter}
					value={filterValue(filters, 'country__iso_code', null)}
					options={this.props.helperData.isoCodes}/>
				<FormControl
					type='text'
					title={__('Country Code')}
					placeholder={__('Country Code')}
					name='country__code'
					onChange={this.updateFilter}
					value={filterValue(filters, 'country__code', '')} />
				<Select
					title={__('Currency')}
					placeholder={__('Select Currency')}
					name='country__currencyId__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'country__currencyId__eq', null)}
					options={this.props.helperData.currencies}/>	
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='country__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'country__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
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
							<td className='tw-25'>
								<Text>Name</Text>
							</td>
							<td className='tw-15'>
								<Text>ISO Code</Text>
							</td>
							<td className='tw-15'>
								<Text>Code</Text>
							</td>
							<td className='tw-20'>
								<Text>Currency</Text>
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						title={getStatusTitle(item.is_active, __)}
						onChange={this.changeStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						value={item.is_active}/>
				</td>
				<td className='tw-25'>
					{item.countrydetails[0].name}
				</td>
				<td className='tw-15'>
					{item.iso_code}
				</td>
				<td className='tw-15'>
					{item.code}
				</td>
				<td className='tw-20'>
					{item.currency.display_name}
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
}

