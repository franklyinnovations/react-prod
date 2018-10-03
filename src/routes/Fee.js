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
import reducer from '../redux/reducers/fee';
import * as actions from '../redux/actions/fee';
addView('fee', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Panel,
	Button,
	Select,
	Loading,
	Clearfix,
	Checkbox,
	HelpBlock,
	DataTable,
	FormGroup,
	Datepicker,
	PanelGroup,
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
export default class Fee extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'fee');
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
	viewList = () => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
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
	update = (feehead, feeallocation, name) => event => this.props.dispatch({
		type: 'UPDATE_FEE_INSTALLMENT_DATA',
		name,
		feehead,
		feeallocation,
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
		if (this.props.item !== false) {
			return (
				<View actions={
					<View.Actions>
						<View.Action onClick={this.viewList}>
							<Text>Back</Text>
						</View.Action>
					</View.Actions>
				}>
					{this.renderEditForm(__)}
				</View>
			);
		}
		return (
			firstTime ?
			<View>{this.renderFirstMessage()}</View> : 
			<View
				search={this.props.query}
				filters={this.renderFilters(__)}
				actions={this.renderViewActions(__)}>
				{this.renderData(__)}
			</View>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Fee</Text></h3>
						<div>
							<Text>In this part, you will define fee of every class.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						btnText='Add Fee'
						text='Let’s Add Now'
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
					name='boardId'
					onChange={this.updateFilter}
					title={__('Curriculum Type')}
					options={this.props.meta.boards}
					placeholder={__('Curriculum Type')}
					value={filterValue(filters, 'boardId', null)}/>
				<Select
					name='classId'
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					options={this.props.meta.classes}
					value={filterValue(filters, 'classId', null)}/>
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
							<td className='tw-40'><Text>Curriculum Type</Text></td>
							<td className='tw-40'><Text>Class</Text></td>
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
				<td className='tw-40'>{item.board.boarddetails[0].alias}</td>
				<td className='tw-40'>{item.class.classesdetails[0].name}</td>
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

	renderEditForm() {
		let {item, errors, meta} = this.props;
		if (item === null) return <Loading/>;
		return (
			<React.Fragment>
				<FormGroup validationState={errors.classes ? 'error' : null}>
					<ControlLabel>
						{item.id ? <Text>Class</Text> : <Text>Classes</Text>}
					</ControlLabel>
					<Select
						name='classes'
						multi={!item.id}
						disabled={!!item.id}
						value={item.classes}
						options={meta.classes}
						onChange={this.updateData}/>
					<HelpBlock>{errors.classes}</HelpBlock>
				</FormGroup>
				<FormGroup>
					<ControlLabel>
						<Text>Penalties</Text>
					</ControlLabel>
					<Select
						multi
						name='feepenalties'
						value={item.feepenalties}
						onChange={this.updateData}
						options={meta.feepenalties}/>
				</FormGroup>
				<FormGroup>
					<Checkbox
						name='is_active'
						onChange={this.updateData}
						value={this.props.item.is_active}>
						<ControlLabel><Text>Status</Text></ControlLabel>
					</Checkbox>
				</FormGroup>
				<PanelGroup id='fee-feeheads'>
					{
						item.feeheads.map((feehead, feeheadIndex) =>
							<Panel key={feehead.id}>
								<Panel.Heading>
									{feehead.feeheaddetails[0].name}
								</Panel.Heading>
								<Panel.Body>
									<Row>
										{
											feehead.feeallocations.map((feeallocation, index) =>
												<React.Fragment key={index}>
													<Col md={6}>
														<div className='card'>
															<strong><Text>Installment</Text>&nbsp; {index + 1}</strong>
															<Row>
																<Col md={6}>
																	<FormGroup validationState={feeallocation.errors.amount ? 'error' : null}>
																		<ControlLabel>
																			<Text>Amount</Text>
																		</ControlLabel>
																		<FormControl
																			value={feeallocation.amount}
																			onChange={this.update(feeheadIndex, index, 'amount')}/>
																		<HelpBlock>{feeallocation.errors.amount}</HelpBlock>
																	</FormGroup>
																</Col>
																<Col md={6}>
																	<FormGroup validationState={feeallocation.errors.date ? 'error' : null}>
																		<ControlLabel>
																			<Text>Due Date</Text>
																		</ControlLabel>
																		<Datepicker
																			value={feeallocation.date}
																			onChange={this.update(feeheadIndex, index, 'date')}/>
																		<HelpBlock>{feeallocation.errors.date}</HelpBlock>
																	</FormGroup>
																</Col>
															</Row>
														</div>
													</Col>
													{index % 2 === 1 && <Clearfix/>}
												</React.Fragment>
											)
										}
									</Row>
								</Panel.Body>
							</Panel>
						)
					}
				</PanelGroup>
				<Button onClick={this.viewList}>
					<Text>Cancel</Text>
				</Button>
				&nbsp;&nbsp;
				<Button bsStyle='primary' onClick={this.save}>
					<Text>Submit</Text>
				</Button>
			</React.Fragment>
		);
	}
}

