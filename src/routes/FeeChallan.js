import React from 'react';
import {connect} from 'react-redux';

import {webApiUrl} from '../config';
import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/feechallan';
import * as actions from '../redux/actions/feechallan';
addView('feechallan', reducer);


import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Label,
	Modal,
	Button,
	Select,
	Loading,
	DateView,
	FormGroup,
	DataTable,
	HelpBlock,
	Datepicker,
	Pagination,
	ClickButton,
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
export default class FeeChallan extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'challan');
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

	startAdd = () => this.props.router.push('/finances/fee-submission');
	view = event => window.open(
		webApiUrl + '/admin/feechallan/'
		+ event.currentTarget.getAttribute('data-item-id')
		+ '/challan.pdf'
		+ '?lang=' + this.props.lang.code
		+ '&langId=' + this.props.lang.id
		+ '&dir=' + this.props.lang.dir
	);
	mail = event => actions.mail(
		this.props,
		+event.currentTarget.getAttribute('data-item-id')
	);
	startApproval = event => this.props.dispatch({
		type: 'START_FCN_APPROVAL',
		data: {
			remarks: '',
			approval_date: null,
			id: +event.currentTarget.getAttribute('data-item-id'),
		}
	});
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	approve = () => this.props.dispatch(actions.approve(this.props));
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
				{this.renderApprovalForm()}
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Challans</Text></h3>
						<div>
							<Text>In this part, you will be managing challans.</Text>
						</div>
					</Col>
				</Row>
				<ClickButton
					side='left'
					glyph='fa-plus'
					text='Let’s Add Now'
					btnText='Add Challan'
					onClick={this.startAdd}/>
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
					name='challan_no'
					onChange={this.updateFilter}
					title={__('Challan Number')}
					placeholder={__('Challan Number')}
					value={filterValue(filters, 'challan_no', '')} />
				<FormControl
					type='text'
					name='enrollment_no'
					title={__('Enrollment Number')}
					onChange={this.updateFilter}
					placeholder={__('Enrollment Number')}
					value={filterValue(filters, 'enrollment_no', '')} />
				<Select
					name='approved'
					title={__('Status')}
					onChange={this.updateFilter}
					placeholder={__('Select Status')}
					options={FeeChallan.getStatusOptions(__)}
					value={filterValue(filters, 'approved', null)}/>
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
							<td className='tw-10'><Text>Status</Text></td>
							<td className='tw-16'><Text>Challan No.</Text></td>
							<td className='tw-16'><Text>Student</Text></td>
							<td className='tw-16'><Text>Enrollment No.</Text></td>
							<td className='tw-16'><Text>Date</Text></td>
							<td className='tw-16'><Text>Approval Date</Text></td>
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

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item =>
			<tr key={item.id}>
				<td className='tw-10'>
					{FeeChallan.getStatusLabel(item.approved)}
				</td>
				<td className='tw-16'>{item.id}</td>
				<td className='tw-16'>{item.student.user.userdetails[0].fullname}</td>
				<td className='tw-16'>{item.student.enrollment_no}</td>
				<td className='tw-16'>
					<DateView>{item.date}</DateView>
				</td>
				<td className='tw-16'>
					<DateView>{item.approval_date}</DateView>
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.id}/>
						<DataTable.Action
							text='Mail Challan'
							glyph='fa-envelope'
							onClick={this.mail}
							data-item-id={item.id}/>
						{
							!item.approved &&
							this.permissions.add &&
							<DataTable.Action
								text='Approve'
								data-item-id={item.id}
								glyph='fa-check-circle'
								onClick={this.startApproval}/>
						}
						{
							!item.approved &&
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
		);
	}

	renderApprovalForm() {
		let {approval, errors} = this.props;
		return (
			<Modal
				show={approval !== false}
				onHide={this.hideDataModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						<Text>Approve Challan</Text>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						approval &&
						<React.Fragment>
							<FormGroup validationState={errors.approval_date ? 'error' : null}>
								<ControlLabel><Text>Approval Date</Text></ControlLabel>
								<Datepicker
									name='approval_date'
									onChange={this.updateData}
									value={approval.approval_date}/>
								<HelpBlock>{errors.approval_date}</HelpBlock>
							</FormGroup>
							<FormGroup validationState={errors.remarks ? 'error' : null}>
								<ControlLabel><Text>Remarks</Text></ControlLabel>
								<FormControl
									rows='5'
									name='remarks'
									value={approval.remarks}
									componentClass='textarea'
									onChange={this.updateData}/>
								<HelpBlock>{errors.remarks}</HelpBlock>
							</FormGroup>
							<div className='text-right'>
								<Button
									bsStyle='primary'
									onClick={this.approve}
									disabled={this.props.saving}>
									<Text>Submit</Text>
								</Button>
							</div>
						</React.Fragment>
					}
				</Modal.Body>
			</Modal>
		);
	}

	static getStatusLabel(status) {
		switch (status) {
			case 0:
				return (
					<Label bsStyle='danger'>
						<Text>Pending</Text>
					</Label>
				);
			case 1:
				return (
					<Label bsStyle='success'>
						<Text>Approved</Text>
					</Label>
				);
			case -1:
				return (
					<Label bsStyle='warning'>
						<Text>Updating</Text>
					</Label>
				);
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
		];
	}
}