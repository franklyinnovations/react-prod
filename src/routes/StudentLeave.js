import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	bcsName,
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentleave';
import * as actions from '../redux/actions/studentleave';
addView('studentleave', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Label,
	Table,
	Modal,
	Button,
	Select,
	Loading,
	DateView,
	DataTable,
	Pagination,
	FormControl,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class StudentLeave extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

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

	
	view = event => this.props.dispatch(
		actions.viewData(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.getAttribute('data-status'),
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
		return (
			firstTime ?
			<View>{this.renderFirstMessage()}</View> : 
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData()}
				</View>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>View Student Leave</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								<Table bordered striped condensed>
									<tbody>		
										<tr>
											<td className='tw-35'><strong><Text>Class</Text></strong></td>
											<td>{bcsName(this.props.item.bcsmap)}</td>
										</tr>
										<tr>
											<td className='tw-35'><strong><Text>Roll Number</Text></strong></td>
											<td>{this.props.item.user.student.studentrecord.roll_no}</td>
										</tr>
										<tr>
											<td><strong><Text>Name</Text></strong></td>
											<td>{this.props.item.user.userdetails[0].fullname}</td>
										</tr>
										<tr>
											<td><strong><Text>Total Days</Text></strong></td>
											<td>
												{
													this.props.item.duration === 0.5 ?
													__('Half Day') + ' (' + __(this.props.item.halfday === 1 ? 'First Half':'Second Half') + ')'
												:
													this.props.item.duration
												}
											</td>
										</tr>
										<tr>
											<td><strong><Text>Start Date</Text></strong></td>
											<td><DateView>{this.props.item.start_date}</DateView></td>
										</tr>
										<tr>
											<td><strong><Text>End Date</Text></strong></td>
											<td><DateView>{this.props.item.end_date}</DateView></td>
										</tr>
										<tr>
											<td><strong><Text>Submitted</Text>:</strong></td>
											<td><DateView>{this.props.item.createdAt}</DateView></td>
										</tr>
										<tr>
											<td><strong><Text>Reason</Text></strong></td>
											<td>
												{
													this.props.item.tagId == 0 ?
													this.props.item.comment : this.props.item.tag.tagdetails[0].description
												}
											</td>
										</tr>
										<tr>
											<td><strong>{__('Status')}</strong></td>
											<td>{StudentLeave.getStatusLabel(this.props.item.leavestatus)}</td>
										</tr>
									</tbody>
								</Table>
								{
									this.props.item.leavestatus !== 2 &&
									<div className='text-right'>
										{
											this.props.item.leavestatus !== 1 && 
											<Button
												data-status='1'
												bsStyle='primary'
												onClick={this.changeStatus}
												disabled={this.props.saving}
												data-item-id={this.props.item.id}>
												<Text>Approve</Text>
											</Button>
										}
										&nbsp;&nbsp;
										{
											this.props.item.leavestatus !== 3 && 
											<Button
												bsStyle='danger'
												data-status='3'
												onClick={this.changeStatus}
												disabled={this.props.saving}
												data-item-id={this.props.item.id}>
												<Text>Reject</Text>
											</Button>
										}
									</div>
								}
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
						<h3><Text>Student Leaves</Text></h3>
						<div>
							<Text>In this part, you will be managing Student Leaves.</Text>
						</div>
						<div>
							<Text>All applied leaves by students will be shown here.</Text>
						</div>
					</Col>
				</Row>
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
					title={__('Name')}
					placeholder={__('Name')}
					name='userdetail__fullname'
					onChange={this.updateFilter}
					value={filterValue(filters, 'userdetail__fullname', '')}/>
				{
					this.props.session.user_type == 'institute' &&
					<Select
						title={__('Class')}
						placeholder={__('Class')}
						onChange={this.updateFilter}
						name='studentleave__bcsMapId__eq'
						options={this.props.meta.bcsmaps}
						value={filterValue(filters, 'studentleave__bcsMapId__eq', '')}/>
				}
				<Select
					title={__('Status')}
					placeholder={__('Status')}
					onChange={this.updateFilter}
					name="studentleave__leavestatus"
					options={StudentLeave.getStatusOptions(__)}
					value={filterValue(filters, 'studentleave__leavestatus', null)}/>
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderData() {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-14'><Text>Status</Text></td>
							<td className='tw-14'><Text>Roll Number</Text></td>
							<td className='tw-14'><Text>Name</Text></td>
							{
								this.props.session.user_type == 'institute' &&
								<td className='tw-14'><Text>Class</Text></td>
							}
							<td className='tw-14'><Text>Total Days</Text></td>
							<td className='tw-14'><Text>Start Date</Text></td>
							<td className='tw-14'><Text>End Date</Text></td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows()}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-14'>
					{StudentLeave.getStatusLabel(item.leavestatus)}
				</td>
				<td className='tw-14'>
					{item.user.student.studentrecord.roll_no}
				</td>
				<td className='tw-14'>
					{item.user.userdetails[0].fullname}
				</td>
				{
					this.props.session.user_type == 'institute' &&
					<td className='tw-14'>{bcsName(item.bcsmap)}</td>
				}
				<td className='tw-14'>
					{
						item.duration === 0.5 ?
						<Text>{item.halfday === 1 ? 'First Half' : 'Second Half'}</Text>:
						item.duration
					}
				</td>
				<td className='tw-14'>
					<DateView>{item.start_date}</DateView>
				</td>
				<td className='tw-14'>
					<DateView>{item.end_date}</DateView>
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.id}/>
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	static getStatusLabel(status) {
		switch (status) {
			case 0:
				return <Label bsStyle='warning'><Text>Pending</Text></Label>;
			case 1:
				return <Label bsStyle='success'><Text>Approved</Text></Label>;
			case 2:
				return <Label bsStyle='danger'><Text>Cancelled</Text></Label>;
			case 3:
				return <Label bsStyle='danger'><Text>Rejected</Text></Label>;
			case -1:
				return <Label bsStyle='warning'><Text>Updating</Text></Label>;
		}
	}

	static getStatusOptions(__) {
		return [
			{
				value: '0',
				label: __('Pending')
			},
			{
				value: '1',
				label: __('Approved')
			},
			{
				value: '2',
				label: __('Cancelled')
			},
			{
				value: '3',
				label: __('Rejected')
			}
		];
	}

}