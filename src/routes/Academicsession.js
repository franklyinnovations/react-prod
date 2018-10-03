import React from 'react';
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
	Row,
	Col,
	Icon,
	Text,
	View,
	Button,
	DateView,
	DataTable,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Datepicker,
	Checkbox,
	FormControl,
	Modal,
	Loading,
	Pagination,
	ClickButton,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/academicsession';
import * as actions from '../redux/actions/academicsession';
addView('academicsession', reducer);


@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Academicsession extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'academicsession');

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
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Academic Session?'),
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

	save = () => this.props.dispatch(
		actions.save(this.props, this.props.session.id)
	);

	next = () => this.props.router.push('/setup/curriculum');

	changePage = page => {
		this.props.router.push({
			pathname: this.props.location.pathname,
			query: {
				...this.props.location.query,
				page: page
			},
		});
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
									<Text>Edit Academic Session</Text> :
									<Text>Add Academic Session</Text>
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
									<Col xs={12}>
										<FormGroup
											controlId='name'
											validationState={this.props.errors.name ? 'error': null}>
											<ControlLabel><Text>Academic Session Name</Text></ControlLabel>
											<FormControl
												autoFocus
												type='text'
												placeholder={__('Name')}
												value={this.props.item.name}
												name='name'
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.name}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='start_date'
											validationState={this.props.errors.start_date ? 'error': null}>
											<ControlLabel><Text>Start Date</Text></ControlLabel>
											<Datepicker
												name='start_date'
												onChange={this.updateData}
												value={this.props.item.start_date}/>
											<HelpBlock>{this.props.errors.start_date}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='start_date'
											validationState={this.props.errors.end_date ? 'error': null}>
											<ControlLabel><Text>End Date</Text></ControlLabel>
											<Datepicker
												name='end_date'
												onChange={this.updateData}
												value={this.props.item.end_date}/>
											<HelpBlock>{this.props.errors.end_date}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md={6}>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
											<ControlLabel>Status</ControlLabel>
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
						<h3><Text>Academic Session</Text></h3>
						<div>
							<Text>
								The time during which a school holds classes or the period of time each year when the schools are open and peoples are studying.
							</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>2018-2019</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Lets Add Now'
						btnText='Add Academic Session'
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
							<td className='tw-30'>
								<Text>Name</Text>
							</td>
							<td className='tw-25'>
								<Text>Start Date</Text>
							</td>
							<td className='tw-25'>
								<Text>End Date</Text>
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
				<td className='tw-30'>{item.academicsessiondetails[0].name}</td>
				<td className='tw-25'>
					<DateView>{item.start_date}</DateView>
				</td>
				<td className='tw-25'>
					<DateView>{item.end_date}</DateView>
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
							this.props.session.selectedSession.id !== item.id &&
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
					name='academicsessiondetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'academicsessiondetail__name', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name="academicsession__is_active"
					onChange={this.updateFilter}
					value={filterValue(filters, 'academicsession__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}
}