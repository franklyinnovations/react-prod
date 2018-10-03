import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {
	getAssignmentStatus
} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentassignment';
import * as actions from '../redux/actions/studentassignment';
addView('studentassignment', reducer);

import {
	Row,
	Col,
	Icon,
	Label,
	View,
	Table,
	Text,
	Modal,
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

export default class StudentAssignment extends React.Component {

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

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	
	remove = event => this.props.dispatch(
		actions.remove(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	view = event => this.props.dispatch(
		actions.viewData(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	showFile = event => {
		window.open(
			this.props.session.servicePath +
			event.currentTarget.getAttribute('data-item-url'),
			'_blank'
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
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Assignment Detail</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Table bordered>
								<tbody>
									<tr>
										<td>{__('Title')}</td>
										<td>{this.props.item.assignmenttitle}</td>
									</tr>
									<tr>
										<td>{__('subject')}</td>
										<td>{this.props.item.created_by}</td>
									</tr>
									<tr>
										<td>{__('Start Date')}</td>
										<td>{this.props.item.start_date}</td>
									</tr>
									<tr>
										<td>{__('End Date')}</td>
										<td>{this.props.item.end_date}</td>
									</tr>
									<tr>
										<td>{__('Created By')}</td>
										<td>{this.props.item.created_by}</td>
									</tr>
									<tr>
										<td>{__('Description')}</td>
										<td><div dangerouslySetInnerHTML={{__html:this.props.item.assignmentcomment}}/></td>
									</tr>
									{
										this.props.item.assignment_file &&
											<tr>
												<td>{__('File')}</td>
												<td>
													<div>
														<a
															target='_blank'
															className='btn btn-primary'
															href={this.props.session.servicePath + this.props.item.assignment_file}
															rel='noopener noreferrer'
															title={__('View File')}>
															<Text>Download File</Text>
														</a>
													</div>
												</td>
											</tr>
									}
									<tr>
										<td>{__('Remarks')}</td>
										<td>{this.props.item.assignmentremarks}</td>
									</tr>
								</tbody>
							</Table>
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
						<h3><Text>Assignment</Text></h3>
						<div>
							<Text>In this part, you will check all the Assignment of your class.</Text>
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
					title={__('Title')}
					placeholder={__('Assignment Title')}
					onChange={this.updateFilter}
					name='assignmentdetail__title'
					value={filterValue(filters, 'assignmentdetail__title', '')} />
				<Select
					title={__('Class')}
					placeholder={__('Select Class')}
					onChange={this.updateFilter}
					name='assignment__bcsMapId__eq'
					options={this.props.helperData.bcsmaps}
					value={filterValue(filters, 'assignment__bcsMapId__eq', '')} />
				<Select
					title={__('Subject')}
					placeholder={__('Select Subject')}
					onChange={this.updateFilter}
					name='assignment__subjectId__eq'
					options={this.props.helperData.subjects}
					value={filterValue(filters, 'assignment__subjectId__eq', '')} />
				<Select
					title={__('Status')}
					name='assignment__assignment_status'
					onChange={this.updateFilter}
					options={getAssignmentStatus(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'assignment__assignment_status', null)}/>
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

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-10'><Text>Status</Text></td>
							<td className='tw-15'><Text>Title</Text></td>
							<td className='tw-15'><Text>Created By</Text></td>
							<td className='tw-15'><Text>Subject</Text></td>
							<td className='tw-15'><Text>File Type</Text></td>
							<td className='tw-10'><Text>Start Date</Text></td>
							<td className='tw-10'><Text>End Date</Text></td>
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
			return <DataTable.NoDataRow colSpan={7}/>;
		}
		return this.props.items.map((item) => (
			<tr key={item.id}>
				<td className='tw-10'>{StudentAssignment.getAssignmentStatusLabel(item.assignment_status)}</td>
				<td className='tw-15'>{item.assignmentdetails[0].title}</td>
				<td className='tw-15'>{item.user.userdetails[0].fullname}</td>
				<td className='tw-15'>{item.subject.subjectdetails[0].name}</td>
				<td className='tw-15'>{item.assignment_type ? item.assignment_file.substr(item.assignment_file.lastIndexOf('.')+1) : __('N/A')}</td>
				<td className='tw-10'><DateView>{item.start_date}</DateView></td>
				<td className='tw-10'><DateView>{item.end_date}</DateView></td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View Assignment'
							glyph='fa-eye'
							onClick={this.view}
							data-item-bcsmapid={item.bcsMapId}
							data-item-id={item.id}/>
						{
							(item.assignment_file && item.assignment_status !== 'Canceled') &&
							<DataTable.Action
								text='View File'
								glyph='fa-image'
								onClick={this.showFile}
								data-item-url={item.assignment_file}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	static getAssignmentStatusLabel(status) {
		switch (status) {
			case 'Draft':
				return <Label bsStyle="primary"><Text>Draft</Text></Label>;
			case 'Published':
				return <Label bsStyle="success"><Text>Published</Text></Label>;
			case 'Canceled':
				return <Label bsStyle="danger"><Text>Cancelled</Text></Label>;
			case 'Completed':
				return <Label bsStyle="warning"><Text>Completed</Text></Label>;
			case -1:
				return <Label bsStyle="warning"><Text>Updating</Text></Label>;
		}
	}
}
