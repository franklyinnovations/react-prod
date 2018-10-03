import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
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
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Modal,
	Loading,
	DateView,
	ClickButton,
	Pagination,
	Datepicker,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/vehiclebreakdown';
import * as actions from '../redux/actions/vehiclebreakdown';
addView('vehiclebreakdown', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class VehicleBreakdown extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'vehiclebreakdown');

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
			message: window.__('Are you sure you want to delete this Breakdown?'),
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
			this.props.router.createPath(
				this.props.location, {
					...this.props.location.query,
					page: page
				}
			)
		);
	};

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
									<Text>Edit Vehicle Breakdown</Text> :
									<Text>Add Vehicle Breakdown</Text>
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
									controlId='rvdhsmapId'
									validationState={this.props.errors.rvdhsmapId ? 'error': null}>
									<ControlLabel><Text>Vehicle</Text></ControlLabel>
									<Select
										autoFocus
										name='rvdhsmapId'
										placeholder={__('Vehicle')}
										value={this.props.item.rvdhsmapId}
										options={this.props.meta.rvdhsmaps}
										onChange={this.updateData}/>
									<HelpBlock>{this.props.errors.rvdhsmapId}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='replacementRvdhsmapId'
									validationState={this.props.errors.replacementRvdhsmapId ? 'error': null}>
									<ControlLabel><Text>Replacement Vehicle</Text></ControlLabel>
									<Select
										name='replacementRvdhsmapId'
										placeholder={__('Replacement Vehicle')}
										value={this.props.item.replacementRvdhsmapId}
										options={this.props.meta.rvdhsmaps}
										onChange={this.updateData}/>
									<HelpBlock>{this.props.errors.replacementRvdhsmapId}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='date'
									validationState={this.props.errors.date ? 'error': null}>
									<ControlLabel><Text>Date</Text></ControlLabel>
									<Datepicker
										name='date'
										placeholder={__('Date')}
										value={this.props.item.date}
										onChange={this.updateData}/>
									<HelpBlock>{this.props.errors.date}</HelpBlock>
								</FormGroup>
								<div className='text-right'>
									<Button
										onClick={this.save}
										bsStyle='primary'>
										<Text>Submit</Text>
									</Button>
								</div>
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
						<h3><Text>Vehicle Breakdown</Text></h3>
						<div>
							<Text>
								In case if you are suffering from any student's transport vehicle breakdown, then handle here by adding breakdown details.
							</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Vehicle Breakdown'
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
							<td className='tw-25'>
								<Text>Vehicle</Text>
							</td>
							<td className='tw-25'>
								<Text>Replacement Vehicle</Text>
							</td>
							<td className='tw-15'>
								<Text>Date</Text>
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
				<td className='tw-25'>{item.rvdhsmap.vehicle.vehicledetails[0].name}</td>
				<td className='tw-25'>{item.replacementRvdhsmap.vehicle.vehicledetails[0].name}</td>
				<td className='tw-15'><DateView>{item.date}</DateView></td>
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
					name='rvdhsmapId'
					title={__('Vehicle')}
					placeholder={__('Select Vehicle')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'rvdhsmapId', null)}
					options={this.props.meta.rvdhsmaps}/>
				<Select
					name='replacementRvdhsmapId'
					onChange={this.updateFilter}
					title={__('Replacement Vehicle')}
					placeholder={__('Select Replacement Vehicle')}
					value={filterValue(filters, 'replacementRvdhsmapId', null)}
					options={this.props.meta.rvdhsmaps}/>
			</View.Filters>
		);
	}
}