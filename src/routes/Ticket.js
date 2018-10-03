import React from 'react';
import ReactDOM from 'react-dom';
import url from 'url';
import {connect} from 'react-redux';

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	FormControl,
	ControlLabel,
	Checkbox,
	HelpBlock,
	Popover,
	Alert,
	Clearfix,
} from '../components';

import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import FilterButton from '../components/FilterButton';
import ServiceImage from '../components/ServiceImage';

import actions from '../redux/actions';
import makeTranslater from '../translate';
import {
	getInputValue,
	getStatusLabel,
	getStatusTitle,
	getStatusOptions,
	getStatusIcon,
	getTicketStatusLabel,
	getTicketStatusTitle,
	renderFilterLabel,
	getPriorityTitle,
	getTicketStatusOptions,
	getDateAndTime,
} from '../utils';

const viewName = 'ticket';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class Ticket extends React.Component {
	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			this.updateData(
				event.target.name,
				getInputValue(event.target)
			);
		};
		this.handleEditUpdate = event => this.updateEditData(
			event.target.name,
			getInputValue(event.target)
		);

		this.handleFilterUpdate = event => {
			let value, valueLable;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;

			if(event.target.type === 'react-select')
				valueLable = event.target.optionLabel;
			else
				valueLable = value;
			this.updateFilter(event.target.name, value, event.target.title, valueLable);
		};
		this.handleEdit = event => this.edit(event.target.getAttribute('data-item-id'));
		this.changeStatus = event => this.props.dispatch(
			actions.ticket.changeStatus(
				this.props,
				event.target.getAttribute('data-status'),
			)
		);

		this.changeClosedStatus = event => this.props.dispatch(
			actions.ticket.changeClosedStatus(
				this.props,
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-status'),
			)
		);

		this.permissions = {};
		if (this.props.session.modules.ticket) {
			this.props.session.modules.ticket.forEach(action => this.permissions[action] = true);
		}

		this.handleRemoveFilter = event => this.removeFilter(event.target.getAttribute('data-name'));
	}

	static fetchData(store) {
		return store.dispatch(
			actions.ticket.init(
				store.getState()
			)
		);
	}
	
	static ticketypeOptions(__) {
		return [
			{label: __('Dashboard'), value: 'Dashboard'},
			{label: __('School Setup'), value: 'School Setup'},
			{label: __('HRM'), value: 'HRM'},
			{label: __('Transport'), value: 'Transport'},
			{label: __('Finances'), value: 'Finances'},
			{label: __('TimeTable'), value: 'TimeTable'},
			{label: __('Student Management'), value: 'Student Management'},
			{label: __('Student Attendance'), value: 'Student Attendance'},
			{label: __('Exam Settings'), value: 'Exam Settings'},
			{label: __('Assignments'), value: 'Assignments'},
			{label: __('LMS'), value: 'LMS'},
			{label: __('General Management'), value: 'General Management'},
			{label: __('Reports'), value: 'Reports'},
			{label: __('Customer Support'), value: 'Customer Support'},
			{label: __('Other'), value: 'Other'},
		];
	}

	static ticketpriorityOptions(__) {
		return [
			{label: __('Low'), value: '0'},
			{label: __('Normal'), value: 1},
			{label: __('High'), value: 2},
		];
	}
 
	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__);
				break;
			case 'EDIT_FORM':
				content = this.renderEdit(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible module-container">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col md={6} className='fg-white'>
											<h3>{__('Support Ticket')}</h3>
										</Col>
										<Col md={6} className='text-right'>
											{
												this.props.viewState === 'LIST' &&
												<h3>
													<FilterButton
														__={__}
														reset={::this.reset}
														overlay={this.renderFilters(__)}
														ref_el={el=> this.filterIcon = el} />
													{
														this.permissions.add &&
														this.props.session.masterId !== 1 &&
														<Button
															inverse
															outlined
															style={{marginBottom: 5}}
															bsStyle='default'
															onClick={::this.startAddNew}>
															{__('Add New')}
														</Button>
													}
												</h3>
											}

											{
												(this.props.viewState === 'DATA_FORM' ||
												this.props.viewState === 'EDIT_FORM') &&
												<h3>
													<Button
														inverse
														outlined
														style={{marginBottom: 5}}
														bsStyle='default'
														onClick={::this.viewList}>
														{__('View List')}
													</Button>
												</h3>
											}
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderFilters(__) {
		return (
			<Popover
				className='filter-popover'
				id='ticket-filters'
				title={null}>
				<div>
					<Select
						name="ticket__type"
						title={__('Category')}
						onChange={this.handleFilterUpdate}
						value={this.props.filter.ticket__type || ''}
						options={Ticket.ticketypeOptions(__)}
						className='form-control'
						placeholder={__('Select Category')}/>
				</div>
				<div>
					<Select
						name="ticket__status"
						title={__('Status')}
						onChange={this.handleFilterUpdate}
						value={this.props.filter.ticket__status || ''}
						options={getTicketStatusOptions(__)}
						className='form-control'
						placeholder={__('Select Status')}/>
				</div>
				<div>
					<Select
						name="ticket__priority"
						title={__('Priority')}
						onChange={this.handleFilterUpdate}
						value={this.props.filter.ticket__priority || ''}
						options={Ticket.ticketpriorityOptions(__)}
						className='form-control'
						placeholder={__('Select Priority')}/>
				</div>
				<div>
					<Button onClick={::this.search}>{__('Search')}</Button>
				</div>
			</Popover>
		)
	}

	renderList(__) {
		return (
			<Row key='ticket-list' className='list-table'>
				<div className='filter-values'>
					{
						this.props.query.queryItems.map(
							item => renderFilterLabel(item, this.handleRemoveFilter)
						)
					}
				</div>
				<Col xs={12}>
					<Table condensed striped responsive className='module-table'>
						<thead>
							<tr>
								<th>{__('S.No.')}</th>
								<th>{__('Created')}</th>
								<th>{__('Client')}</th>
								<th>{__('Category')}</th>
								<th>{__('Status')}</th>
								<th>{__('Priority')}</th>
								<th>{__('Last Reply')}</th>
								<th>{__('Actions')}</th>
							</tr>
						</thead>
						<tbody>
						{this.renderDataRows(this.props.items, __)}
						{this.props.items.length === 0 && this.renderNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}/>
				</Col>
			</Row>
		);
	}
	
	renderDataRows (items, __) {
		return items.map((item, index) => 
			<tr key={item.id}>
				<td>
					{
						(this.props.pageInfo.currentPage - 1) * this.props.pageInfo.pageLimit
						+ index + 1
					}
				</td>
				<td>{getDateAndTime(item.createdAt)}</td>
				<td>{item.user.userdetails[0].fullname}</td>
				<td>{item.type}</td>
				<td>{getTicketStatusLabel(item.status, __)}</td>
				<td>{getPriorityTitle(item.priority, __)}</td>
				<td>{getDateAndTime(item.lastModified)}</td>
				<td>
					{
						(this.permissions.edit || this.permissions.view) &&
						<Icon
							className={'fg-green'}
							title={__('View')}
							style={{fontSize: 20}}
							glyph='icon-simple-line-icons-eye'
							onClick={this.handleEdit}
							data-item-id={item.id}
							data-index={index}/>
					}
					{''}
					{
						this.permissions.status && this.props.session.masterId !== 1 &&
						(item.status == 0 || item.status == 1 || item.status == 2 || item.status == 4) &&
						<Icon
							className={'fg-brown'}
							title={__('Closed')}
							style={{fontSize: 20}}
							glyph='icon-fontello-cancel-circled-1'
							onClick={this.changeClosedStatus}
							data-item-id={item.id}
							data-status='3'/>
					}
				</td>
			</tr>
		)
	}

	renderNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={6} className='text-center'>{__('No Result Found')}</td>
			</tr>
		)
	}

	renderAdd(__) {
		return (
			<div className="module-form module-padding">
				<Form>
					<Row>
						<Col xs={12} md={6}>
							<FormGroup
								controlId='type'
								validationState={this.props.errors.type ? 'error': null}>
								<ControlLabel>{__('Category')}</ControlLabel>
								<Select
									placeholder={__('Select Category')}
									className='form-control'
									name="ticket[type]"
									options={Ticket.ticketypeOptions(__)}
									onChange={this.handleDataUpdate}
									value={this.props.item['ticket[type]']}/>
								<HelpBlock>{this.props.errors.type}</HelpBlock>
							</FormGroup>
						</Col>
						<Col xs={12} md={6}>
							<FormGroup
								controlId='priority'
								validationState={this.props.errors.priority ? 'error': null}>
								<ControlLabel>{__('Priority')}</ControlLabel>
								<Select
									placeholder={__('Select Priority')}
									className='form-control'
									name='ticket[priority]'
									options={Ticket.ticketpriorityOptions(__)}
									onChange={this.handleDataUpdate}
									value={this.props.item['ticket[priority]']}/>
								<HelpBlock>{this.props.errors.priority}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12}>
							<FormGroup
								controlId='title'
								validationState={this.props.errors.title ? 'error': null}>
								<ControlLabel>{__('Title')}</ControlLabel>
								<FormControl
									placeholder={__('Title')}
									name='ticket[title]'
									onChange={this.handleDataUpdate}
									value={this.props.item['ticket[title]']}/>
								<HelpBlock>{this.props.errors.title}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12}>
							<FormGroup
								controlId='message'
								validationState={this.props.errors.message ? 'error': null}>
								<ControlLabel>{__('Message')}</ControlLabel>
									<FormControl
										rows='5'
										componentClass='textarea'
										placeholder={__('Message')}
										name="ticket[ticketmessage][message]"
										onChange={this.handleDataUpdate}
										value={this.props.item['ticket[ticketmessage][message]']}/>
								<HelpBlock>{this.props.errors.message}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<FormGroup
								controlId='files'
								validationState={this.props.errors.files ? 'error': null}>
								<ControlLabel>{__('Files')}</ControlLabel>
								<FormControl name='ticket_file' type='file' multiple/>
								<HelpBlock>{this.props.errors.files}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<div>
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.viewList}>
									{__('Cancel')}
								</Button>{' '}
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.save}>
									{__('Submit')}
								</Button>
							</div>
							<br/>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}

	renderEdit(__) {
		let {status} = this.props.edititem;
		return (
			<div className='support-ticket module-form module-padding'>
				<h3 style={{wordBreak:'break-all'}}>{this.props.edititem.title}</h3>
				<Row>
					<Col xs={6} md={4}>
						<strong>{__('Created')}:- </strong>{' '}
						<span>{getDateAndTime(this.props.edititem.createdAt)}</span>{' '}
					</Col>
				</Row>
				<Row>
					<Col xs={6} md={4}>
						<strong>{__('Modified')}:- </strong>{' '}
						<span>{getDateAndTime(this.props.edititem.date)}</span>
					</Col>
				</Row>
				<Row>
					{
						this.props.session.masterId === 1 &&
						<Col xs={12} md={6} className='text-right'>
							{
								(status == 0 || status == 4) &&
								<Button
									outlined
									bsStyle="primary"
									data-status='1'
									onClick={this.changeStatus}>
									{__('Processing')}
								</Button>
							}
							{' '}
							{
								(status == 0 || status == 1 || status == 4) &&
								<Button
									outlined
									bsStyle="success"
									data-status='2'
									onClick={this.changeStatus}>
									{__('Resolved')}
								</Button>
							}
							{' '}
							{
								(status == 0 || status == 1 || status == 2 || status == 4) &&
								<Button
									outlined
									bsStyle="danger"
									data-status='3'
									onClick={this.changeStatus}>
									{__('Closed')}
								</Button>
							}
							{' '}
							{
								status == 3 &&
								<Button
									outlined
									bsStyle="warning"
									data-status='4'
									onClick={this.changeStatus}>
									{__('RE-OPEN')}
								</Button>
							}
							{' '}
							{
								status === -1 &&
								<Button outlined bsStyle="warning" disabled>
									{__('Updating')}
								</Button>
							}
						</Col>	
					}
				</Row>
				<br/>
				<Table condensed striped bordered className='text-center'>
					<tbody>
						<tr>
							<td>{__('Id')}</td>
							<td>{__('Category')}</td>
							<td>{__('Status')}</td>
							<td>{__('Priority')}</td>
						</tr>
						<tr>
							<td>{this.props.edititem.id}</td>
							<td>{this.props.edititem.type}</td>
							<td>{getTicketStatusTitle(this.props.edititem.status, __)}</td>
							<td>{getPriorityTitle(this.props.edititem.priority,__)}</td>
						</tr>
					</tbody>
				</Table>
				<h3>{__('Conversation')}</h3>
				<Row className='conversation'>
					{
						this.props.edititem.ticketmessages.map((item) => 
							<Col xs={12} key={item.id}>
								<Col className='ticket-user-image'>
									<ServiceImage
										src={this.props.session.servicePath + item.user.user_image}
										width='70'
										height='70'/>
								</Col>
								<Col md={10}>
									<h4>{item.user.userdetails[0].fullname}</h4>
									<p>{getDateAndTime(item.createdAt)}</p>
									<p>{item.message}</p>
									{

									}
									{
										item.files && item.files.length !== 0 &&
										<div>
											<b>{__('Files')} : </b> 
											{
												item.files.map(
													file => (
														<a
															key={file}
															target='_blank'
															href={this.props.session.servicePath + file}>
															<Icon glyph='icon-simple-line-icons-doc'/>
														</a>
													)
												)
											}
										</div>
									}
								</Col>
							</Col>
						)
					}
				</Row>
				{
					status !== 3 &&
					<Form>
						<h4>{__('Reply')}</h4>
						<Row>
							<Col xs={12} md={12}>
							<input type="hidden" name="ticketmessage[ticketId]" value={this.props.edititem.id}/>
								<FormGroup
									controlId='message'
									validationState={this.props.errors.message ? 'error': null}>
									<ControlLabel>{__('Message')}</ControlLabel>
										<FormControl
											componentClass='textarea'
											rows='5'
											placeholder={__('Message')}
											name="ticketmessage[message]"
											onChange={this.handleEditUpdate}
											value={this.props.edititem['ticketmessage[message]']}/>
									<HelpBlock>{this.props.errors.message}</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={6}>
								<FormGroup
									controlId='files'
									validationState={this.props.errors.files ? 'error': null}>
									<ControlLabel>{__('Select Files:')}</ControlLabel>
									<FormControl name='ticket_file' type='file' multiple/>
									<HelpBlock>{this.props.errors.files}</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<div>
									<Button
										outlined
										bsStyle='lightgreen'
										onClick={::this.update}>
										{__('Reply')}
									</Button>
								</div>
								<br/>
							</Col>
						</Row>
					</Form>
				}
			</div>
		);
	}
	
	updateData(name,value) {
		this.props.dispatch(actions.ticket.updateData(name,value));
	}

	removeFilter(name){
		this.props.dispatch({
			type: 'REMOVE_TICKET_FILTERS',
			name,
		});
		this.props.router.push('/ticket');
	}

	updateFilter(name, value, label, valueLable) {
		this.props.dispatch({
			type: 'UPDATE_TICKET_FILTER',
			name,
			value,
			label,
			valueLable
		});
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	search() {
		this.props.router.push('/ticket');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_TICKET_FILTERS'
		});
		this.props.router.push('/ticket');
	}

	updateEditData(name, value) {
		this.props.dispatch(actions.ticket.updateEditData(name, value));
	}

	startAddNew() {
		this.props.dispatch(actions.ticket.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.ticket.viewList());
	}

	save() {
		this.props.dispatch(
			actions.ticket.save(
				this.props,
				new FormData(ReactDOM.findDOMNode(this).querySelector('form'))
			)
		);
	}

	update() {
		this.props.dispatch(
			actions.ticket.update(
				this.props,
				new FormData(ReactDOM.findDOMNode(this).querySelector('form'))
			)
		);
	}

	edit(itemId) {
		this.props.dispatch(
			actions.ticket.edit(
				this.props,
				itemId
			)
		)
	}
}
