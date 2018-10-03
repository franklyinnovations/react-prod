import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
} from '../utils';

import {
	Grid,
	Row,
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Loading,
	Pagination,
	Panel,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/role';
import * as actions from '../redux/actions/role';
addView('role', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Role extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'role');

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
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Role?'),
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

	updateModuleFilter = event => {
		let filter = getInputValue(event.currentTarget).toLowerCase();
		this.props.dispatch({
			type: 'UPDATE_ROLE_MODULE_FITLER',
			permissions: this.props.meta.permissions.map(permission => {
				permission.hidden = window.__(permission.model).toLowerCase().indexOf(filter) === -1;
				return permission;
			}),
			value: getInputValue(event.currentTarget),
		});
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.item === false)
			return (
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
			);

		let visiblePermissions = 0;
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.reset} title={__('View List')}>
						<Text>View List</Text>
					</View.Action>
				</View.Actions>
			}>
				{
					this.props.item === null ? <Loading/> : 
					<React.Fragment>
						<Row>
							<Col md={6}>
								<FormGroup
									controlId='name'
									validationState={this.props.errors.name ? 'error': null}>
									<ControlLabel><Text>Name</Text></ControlLabel>
									<FormControl
										autoFocus
										name='name'
										type='text'
										placeholder={__('Name')}
										value={this.props.item.name}
										onChange={this.updateData}/>
									<HelpBlock>{this.props.errors.name}</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col md={6}>
								<Checkbox
									name='is_active'
									onChange={this.updateData}
									value={this.props.item.is_active}>
									<ControlLabel><Text>Status</Text></ControlLabel>
								</Checkbox>
							</Col>
						</Row>
						<Panel>
							<Panel.Heading>
								<Panel.Title><Text>Permission</Text></Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<React.Fragment>
									<Row>
										<Col mdOffset={3} md={6}>
											<FormGroup>
												<ControlLabel><Text>Search</Text></ControlLabel>
												<FormControl
													onChange={this.updateModuleFilter}
													value={this.props.item.query}/>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										{
											this.props.meta.permissions.map(
												permission =>
													!permission.hidden &&
													<React.Fragment key={permission.model}>
														<PermissionBox
															{...permission}
															value={this.props.item.permissionIds}
															dispatch={this.props.dispatch}/>
														{visiblePermissions++ % 4 === 3 && <Clearfix/>}
													</React.Fragment>
											)
										}
									</Row>
								</React.Fragment>
							</Panel.Body>
						</Panel>
						<Button onClick={this.hideDataModal}>
							<Text>Cancel</Text>
						</Button>
						{' '}
						<Button
							onClick={this.save}
							bsStyle='primary'>
							<Text>Submit</Text>
						</Button>
					</React.Fragment>
				}
			</View>
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
							<td>
								<Text>Name</Text>
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={3}/>;
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
				<td>{item.roledetails[0].name}</td>
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
					name='roledetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'roledetail__name', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='role__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'role__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}
}

class PermissionBox extends React.Component {

	toggleAll = () => this.props.dispatch({
		type: this.any() ? 'REMOVE_ROLE_PERMISSION' : 'ADD_ROLE_PERMISSION',
		ids: this.props.permissions.map(permission => permission.id)
	});

	toggleOne = event => {
		let permission = this.props.permissions[parseInt(event.target.getAttribute('data-index'))];
		if (this.props.value[permission.id]) {
			this.props.dispatch({
				type: 'REMOVE_ROLE_PERMISSION',
				ids: permission.action !== 'view' ? [permission.id] :
					this.props.permissions.map(permission => permission.id)
			});
		} else {
			this.props.dispatch({
				type: 'ADD_ROLE_PERMISSION',
				ids: [permission.id, this.viewPermissionId()],
			});
		}
	};

	render () {
		let {model, permissions, value} = this.props;

		return (
			<Col className='permission-box' md={3}>
				<Grid fluid>
					<Row key={0}>
						<Col xs={2}>
							<input type='checkbox' checked={this.any()} onChange={this.toggleAll}/>
						</Col>
						<Col xs={10}><Text>{model}</Text></Col>
					</Row>
					{
						permissions.map((permission, index) =>
							<Row key={permission.id}>
								<Col xs={2}>
									<input
										type='checkbox'
										data-index={index}
										onChange={this.toggleOne}
										checked={value[permission.id] !== undefined}/>
								</Col>
								<Col xs={10}><Text>{permission.action}</Text></Col>
							</Row>
						)
					}
				</Grid>
			</Col>
		);
	}

	any() {
		return this.props.permissions.some(({id}) => this.props.value[id] !== undefined);
	}

	viewPermissionId() {
		let permission = this.props.permissions.find(({action}) => action === 'view');
		return permission && permission.id;
	}
}