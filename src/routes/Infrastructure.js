import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

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
import makeTranslater from '../translate';

import {
	Row,
	Col,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	FormGroup,
	InputGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Modal,
	Loading,
	ClickButton,
	Pagination,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/infrastructure';
import * as actions from '../redux/actions/infrastructure';
addView('infrastructure', reducer);


@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Infrastructure extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'infrastructure');

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

	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Infrastructure?'),
		});
	};

	save = () => this.props.dispatch(actions.save(this.props));

	next = () => this.props.router.push('/setup/bcsmap');

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

	updateInfratypeEditor = () => this.props.dispatch(
		actions.updateInfratypeEditor(this.props)
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
									<Text>Edit Infrastructure</Text> :
									<Text>Add Infrastructure</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<Row>
									<Col xs={6}>
										{
											this.props.item.infratypeName === null ?
											<FormGroup
												controlId='infratypeId'
												validationState={this.props.errors.infratypeId ? 'error': null}>
												<ControlLabel><Text>Infra Type</Text></ControlLabel>
												<InputGroup>
													<Select
														name='infratypeId'
														className='form-control'
														onChange={this.updateData}
														value={this.props.item.infratypeId}
														options={this.props.meta.infratypes}/>
													{' '}
													<InputGroup.Addon onClick={this.updateInfratypeEditor}
														title={
																this.props.item.infratypeId === null ? 
																	__('Click here to add') : __('Click here to edit')
														}>
														<Icon 
															glyph={
																this.props.item.infratypeId === null ? 
																	'fa-plus' : 'fa-edit'
															}
														/>
													</InputGroup.Addon>
												</InputGroup>
												<HelpBlock>{this.props.errors.infratypeId}</HelpBlock>
											</FormGroup> :
											<FormGroup
												controlId='infratypeName'
												validationState={this.props.errors.infratypeName ? 'error': null}>
												<ControlLabel><Text>Infra Type</Text></ControlLabel>
												<InputGroup>
													<FormControl
														type='text'
														name='infratypeName'
														placeholder={__('Infra Type')}
														value={this.props.item.infratypeName}
														onChange={this.updateData}/>
													<InputGroup.Addon onClick={this.updateInfratypeEditor}
														title={
															this.props.item.saving ? 
																'' : __('Save infra type')
														}>
														<Icon glyph={
															this.props.item.saving ? 'fa-spinner' : 'fa-check'}
														/>
													</InputGroup.Addon>
												</InputGroup>
												<HelpBlock>{this.props.errors.infratypeName}</HelpBlock>
											</FormGroup>
										}
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='code'
											validationState={this.props.errors.code ? 'error': null}>
											<ControlLabel><Text>Infra Code</Text></ControlLabel>
											<FormControl
												name='code'
												type='text'
												placeholder={__('Code')}
												value={this.props.item.code}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.code}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={12}>
										<FormGroup
											controlId='remarks'
											validationState={this.props.errors.remarks ? 'error': null}>
											<ControlLabel><Text>Remarks/Details</Text></ControlLabel>
											<FormControl
												name='remarks'
												componentClass='textarea'
												rows='4'
												placeholder={__('Remarks/Details')}
												value={this.props.item.remarks}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.remarks}</HelpBlock>
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
									<Col md={6} className='text-right'>
										<Button
											onClick={this.save}
											bsStyle='primary'>
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

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Infrastructure</Text></h3>
						<div>
							<Text>In this section, you are going to add school infrastructure details</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>Rooms, Labs etc.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Infrastructure'
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
							<td className='tw-40'>
								<Text>Remarks/Details</Text>
							</td>
							<td className='tw-20'>
								<Text>Code</Text>
							</td>
							<td className='tw-20'>
								<Text>Type</Text>
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
			return <DataTable.NoDataRow colSpan={6}/>;
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
				<td className='tw-40'>{item.infrastructuredetails[0].remarks}</td>
				<td className='tw-20'>{item.infrastructuredetails[0].code}</td>
				<td className='tw-20'>{item.infratype.infratypedetails[0].name}</td>
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
				<Select
					type='text'
					title={__('Type')}
					placeholder={__('Type')}
					name='typeId'
					onChange={this.updateFilter}
					options={this.props.meta.infratypes}
					value={filterValue(filters, 'typeId', '')}/>
				<FormControl
					type='text'
					title={__('Code')}
					placeholder={__('Code')}
					name='code'
					onChange={this.updateFilter}
					value={filterValue(filters, 'code', '')} />
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
}