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

import {getSalutation} from '../utils/options';

import {
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	Form,
	FormGroup,
	InputGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Loading,
	Pagination,
	Modal,
	ServiceImage,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/user';
import * as actions from '../redux/actions/user';
addView('user', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class User extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'user');

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

	save = () => {
		this.props.dispatch(
			actions.save(
				this.props,
				new FormData(document.getElementById('user-data-form'))
			)
		);
	};

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
					bsSize='lg'
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit User</Text> :
									<Text>Add User</Text>
								}
							</Modal.Title>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Form className='row' id='user-data-form'>
								<input type="hidden" name="id" value={this.props.item.id}/>
								<input type="hidden" name="user_detail[id]" value={this.props.item.detailId}/>
								<Col md={3}>
									<FormGroup
										controlId='salutation'
										validationState={this.props.errors.salutation ? 'error': null}>
										<ControlLabel><Text>Salutation</Text></ControlLabel>
										<Select
											name='salutation'
											value={this.props.item.salutation}
											onChange={this.updateData}
											placeholder={__('Please Select Salutation')}
											options={getSalutation(__)}/>
										<HelpBlock>{this.props.errors.salutation}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={9}>
									<FormGroup
										controlId='name'
										validationState={this.props.errors.fullname ? 'error': null}>
										<ControlLabel><Text>Name</Text></ControlLabel>
										<FormControl
											type='text'
											name='user_detail[fullname]'
											placeholder={__('Name')}
											value={this.props.item['user_detail[fullname]']}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.fullname}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={6}>
									<FormGroup
										controlId='roleId'
										validationState={this.props.errors.roleId ? 'error': null}>
										<ControlLabel><Text>Role</Text></ControlLabel>
										<Select
											name='roleId'
											placeholder={__('Role')}
											value={this.props.item.roleId}
											onChange={this.updateData}
											options={this.props.meta.roles}/>
										<HelpBlock>{this.props.errors.roleId}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup
										controlId='email'
										validationState={this.props.errors.email ? 'error': null}>
										<ControlLabel><Text>Email</Text></ControlLabel>
										<FormControl
											type='text'
											name='email'
											placeholder={__('Email')}
											value={this.props.item.email}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.email}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={6}>
									<FormGroup
										controlId='mobile'
										validationState={this.props.errors.mobile ? 'error': null}>
										<ControlLabel><Text>Mobile</Text></ControlLabel>
										<FormControl
											type='text'
											name='mobile'
											placeholder={__('Mobile')}
											value={this.props.item.mobile}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.mobile}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup
										controlId='alternate_mobile'
										validationState={this.props.errors.alternate_mobile ? 'error': null}>
										<ControlLabel><Text>Alternate Mobile</Text></ControlLabel>
										<FormControl
											type='text'
											name='alternate_mobile'
											placeholder={__('Alternate Mobile')}
											value={this.props.item.alternate_mobile}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.alternate_mobile}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={6}>
									<FormGroup
										controlId='password'
										validationState={this.props.errors.password ? 'error': null}>
										<ControlLabel>{__('Password')}</ControlLabel>
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
														type="checkbox"
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
								<Col md={6}>
									<FormGroup
										controlId='confirm_password'
										validationState={this.props.errors.confirm_password ? 'error': null}>
										<ControlLabel>{__('Confirm Password')}</ControlLabel>
										<FormControl
											type='password'
											placeholder='Confirm Password'
											name='confirm_password'
											onChange={this.updateData}
											value={this.props.item.confirm_password}
											disabled={this.props.item.id && !this.props.item.editablePassword}/>
										<HelpBlock>{this.props.errors.confirm_password}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col sm={12}>
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
										bsStyle='primary'>
										<Text>Submit</Text>
									</Button>
								</Col>
							</Form>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-22'><Text>Name</Text></td>
							<td className='tw-25'><Text>Email</Text></td>
							<td className='tw-12'><Text>Mobile</Text></td>
							<td className='tw-12'><Text>User Name</Text></td>
							<td className='tw-12'><Text>Role</Text></td>
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
				<td className='tw-22'>{item.userdetails[0].fullname}</td>
				<td className='tw-25'>{item.email}</td>
				<td className='tw-12'>{item.mobile}</td>
				<td className='tw-12'>{item.user_name}</td>
				<td className='tw-12'>{item.role.roledetails[0].name}</td>
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
					title={__('Email')}
					placeholder={__('Email')}
					name='user__email'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__email', '')} />
				<FormControl
					type='text'
					title={__('Mobile')}
					placeholder={__('Mobile')}
					name='user__mobile'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__mobile', '')} />
				<FormControl
					type='text'
					title={__('User Name')}
					placeholder={__('User Name')}
					name='user__user_name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__user_name', '')} />
				<Select
					title={__('User Role')}
					placeholder={__('Select User Role')}
					name='user__roleId__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__roleId__eq', null)}
					options={this.props.meta.roles}/>	
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='user__is_active__eq'
					onChange={this.updateFilter}
					value={filterValue(filters, 'user__is_active__eq', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}
}
