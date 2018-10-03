import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	getInputValue,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {getLanguageDirection} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/language';
import * as actions from '../redux/actions/language';
addView('language', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Form,
	Modal,
	Radio,
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

export default class Language extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'language');
	startAdd = () => this.props.dispatch(actions.startAdd());
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);
	save = () => this.props.dispatch(actions.save(this.props));
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
		)
	);
	remove = event => this.props.dispatch(
		actions.remove(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);
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
									<Text>Edit Language</Text> :
									<Text>Add Language</Text>
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
											autoFocus
											type='text'
											placeholder={__('Name')}
											value={this.props.item.name}
											name='name'
											onChange={this.updateData}
										/>
										<HelpBlock>{this.props.errors.name}</HelpBlock>
									</FormGroup>
									<FormGroup
										controlId='code'
										validationState={this.props.errors.code ? 'error': null}
									>
										<ControlLabel>{__('Code')}</ControlLabel>
										<FormControl
											autoFocus
											type='text'
											placeholder={__('Code')}
											value={this.props.item.code}
											name='code'
											onChange={this.updateData}
										/>
										<HelpBlock>{this.props.errors.code}</HelpBlock>
									</FormGroup>
									<FormGroup
										controlId='direction'
										validationState={this.props.errors.direction ? 'error': null}
									>
										<ControlLabel>{__('Direction')}:</ControlLabel>
										&nbsp;&nbsp;&nbsp;
										<Radio 
											inline 
											defaultValue='lr'
											onChange={this.updateData}
											defaultChecked={this.props.item.direction === 'lr'} 
											name='direction'
										>
											{__('Left to Right')}
										</Radio>
										<Radio
											inline
											defaultValue='rl'
											defaultChecked={this.props.item.direction === 'rl'}
											onChange={this.updateData}
											name='direction'
										>
											{__('Right to Left')}
										</Radio>
										<HelpBlock>{this.props.errors.direction}</HelpBlock>
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
					name='name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'name', '')} />
				<FormControl
					type='text'
					title={__('Code')}
					placeholder={__('Code')}
					name='code'
					onChange={this.updateFilter}
					value={filterValue(filters, 'code', '')} />
				<Select
					title={__('Direction')}
					placeholder={__('Select Direction')}
					name='direction'
					onChange={this.updateFilter}
					value={filterValue(filters, 'direction', null)}
					options={getLanguageDirection(__)}/>	
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
							<td className='tw-25'>
								<Text>Code</Text>
							</td>
							<td className='tw-25'>
								<Text>Direction</Text>
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
					{item.name}
				</td>
				<td className='tw-25'>
					{item.code}
				</td>
				<td className='tw-25'>
					{(item.direction == 'rl') ? __('Right to Left') : __('Left to Right')}
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

