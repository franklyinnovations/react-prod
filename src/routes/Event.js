import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	dialog,
	filterValue,
	moduleActions,
	getInputValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';


import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/event';
import * as actions from '../redux/actions/event';
addView('event', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Modal,
	Button,
	Select,
	Loading,
	DateView,
	BCheckbox,
	HelpBlock,
	DataTable,
	FormGroup,
	Datepicker,
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
export default class Events extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'event');
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

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
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
		value: getInputValue(event.currentTarget),
	});
	fileInput = React.createRef();
	save = () => this.props.dispatch(actions.save(this.props, this.fileInput.current && this.fileInput.current.files[0]));
	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Event?'),
		});
	};
	sendNotification = event => this.props.dispatch(
		actions.sendNotification(
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
					bsSize='large'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Event</Text> :
									<Text>Add Event</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{this.props.item && this.renderEditForm(__)}
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
						<h3><Text>Events</Text></h3>
						<div>
							<Text>Schedule and manage events and activities in your school.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						btnText='Add Event'
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
				<FormControl
					type='text'
					title={__('Title')}
					name='eventdetail__title'
					placeholder={__('Title')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'eventdetail__title', '')} />
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

	renderData() {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-22'>
								<Text>Event Title</Text>
							</td>
							<td className='tw-22'>
								<Text>Start Time</Text>
							</td>
							<td className='tw-22'>
								<Text>End Time</Text>
							</td>
							<td className='tw-22'>
								<Text>Address</Text>
							</td>
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
				<td className='tw-22'>
					{item.eventdetails[0].title}
				</td>
				<td className='tw-22'>
					<DateView time>{item.start}</DateView>
				</td>
				<td className='tw-22'>
					<DateView time>{item.end}</DateView>
				</td>
				<td className='tw-22'>
					{item.eventdetails[0].venue}
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
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
						{
							this.permissions.notification &&
							<DataTable.Action
								glyph='fa-bullhorn'
								data-item-id={item.id}
								text='Send Notification'
								onClick={this.sendNotification}/>
						}
						{
							(item.file) &&
							<DataTable.Action
								text='View File'
								glyph='fa-image'
								onClick={this.showFile}
								data-item-url={item.file}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderEditForm(__) {
		let {item, errors, meta} = this.props,
			started = !!item.id && moment(
				item.start, this.props.session.userdetails.date_format + ' hh:mm:a'
			).isBefore(new Date);
		return (
			<React.Fragment>
				<Row>
					<Col md={6}>
						<FormGroup
							controlId='title'
							validationState={errors.title ? 'error': null}>
							<ControlLabel><Text>Title</Text></ControlLabel>
							<FormControl
								name='title'
								value={item.title}
								placeholder={__('Title')}
								onChange={this.updateData}/>
							<HelpBlock>{errors.title}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='start'
							validationState={errors.start ? 'error': null}>
							<ControlLabel><Text>Start Time</Text></ControlLabel>
							<Datepicker
								time
								name='start'
								value={item.start}
								disabled={started}
								onChange={this.updateData}
								placeholder={__('Start Time')}
								datepicker={{
									minDate: !started && new Date,
								}}/>
							<HelpBlock>{this.props.errors.start}</HelpBlock>	
						</FormGroup>
						<FormGroup
							controlId='end'
							validationState={errors.end ? 'error': null}>
							<ControlLabel><Text>End Time</Text></ControlLabel>
							<Datepicker
								time
								name='end'
								value={item.end}
								disabled={started}
								onChange={this.updateData}
								placeholder={__('End Time')}
								datepicker={{
									minDate: !started && new Date,
								}}/>
							<HelpBlock>{this.props.errors.end}</HelpBlock>	
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='bcsmaps'
							validationState={errors.bcsmaps ? 'error': null}>
							<ControlLabel><Text>Class</Text></ControlLabel>
							<Select
								multi
								name='bcsmaps'
								options={meta.bcsmaps}
								onChange={this.updateData}
								value={this.props.item.bcsmaps}/>
							<HelpBlock>{errors.bcsMapId}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='details'
							validationState={errors.details ? 'error': null}>
							<ControlLabel><Text>Details</Text></ControlLabel>
							<FormControl
								rows='4'
								name='details'
								value={item.details}
								placeholder='Details'
								componentClass='textarea'
								onChange={this.updateData}/>
							<HelpBlock>{errors.details}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup
					controlId='users'
					validationState={this.props.errors.users ? 'error': null}>
					<div>
						<BCheckbox
							inline
							name='teachers'
							checked={item.teachers}
							onChange={this.updateData}>
							<Text>Teachers</Text>
						</BCheckbox>
						<BCheckbox
							inline
							name='students' 
							onChange={this.updateData}
							checked={this.props.item.students}>
							<Text>Students</Text>
						</BCheckbox>
						<BCheckbox
							inline
							name='parents'
							onChange={this.updateData}
							checked={this.props.item.parents}>
							<Text>Parents</Text>
						</BCheckbox>
					</div>
					<HelpBlock>{this.props.errors.users}</HelpBlock>
				</FormGroup>
				<Extendable>
					{
						extended => !extended ? null : (
							<React.Fragment>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='venue'
											validationState={errors.venue ? 'error': null}>
											<ControlLabel><Text>Address</Text></ControlLabel>
											<FormControl
												name='venue'
												value={item.venue}
												onChange={this.updateData}
												placeholder={__('Address')}/>
											<HelpBlock>{errors.venue}</HelpBlock>
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup
											controlId='dresscode'
											validationState={errors.dresscode ? 'error': null}>
											<ControlLabel><Text>Dress Code</Text></ControlLabel>
											<FormControl
												name='dresscode'
												value={item.dresscode}
												onChange={this.updateData}
												placeholder={__('Dress Code')}/>
											<HelpBlock>{errors.dresscode}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<FormGroup
									controlId='instructions'
									validationState={this.props.errors.instructions ? 'error': null}>
									<ControlLabel><Text>Instructions</Text></ControlLabel>
									<FormControl
										rows='4'
										name='instructions'
										componentClass='textarea'
										value={item.instructions}
										onChange={this.updateData}
										placeholder={__('Instructions')}/>
									<HelpBlock>{errors.instructions}</HelpBlock>
								</FormGroup>
								<Row>
									<Col md={6}>
										<FormGroup
											controlId='file'
											validationState={this.props.errors.file ? 'error': null}>
											<ControlLabel><Text>Upload File</Text></ControlLabel>
											<input className='form-control' name='file' type='file' ref={this.fileInput}/>
											<HelpBlock><Text>Max. 5MB allowed.</Text></HelpBlock>
										</FormGroup>
									</Col>	
									{
										item.id && item.file &&
										<Col md={6}>
											<ControlLabel className='invisible'>H</ControlLabel>
											<div>
												<a
													target='_blank'
													className='btn btn-primary'
													href={this.props.session.servicePath + item.file}
													rel='noopener noreferrer'
													title={__('View File')}>
													<Text>Download File</Text>
												</a>
											</div>
										</Col>
									}
								</Row>
							</React.Fragment>
						)
					}
				</Extendable>
				<div className='text-right'>
					<Button
						bsStyle='primary'
						onClick={this.save}
						disabled={this.props.saving}>
						<Text>Submit</Text>
					</Button>
				</div>
			</React.Fragment>
		);
	}
}

class Extendable extends React.PureComponent{

	static propTypes = {
		children: PropTypes.func.isRequired,
	};

	static defaultProps = {
		component: React.Fragment,
	};

	state = {
		extended: false,
	};

	toggle = () => this.setState({extended: !this.state.extended});

	render() {
		let Component = this.props.component,
			extended = this.state.extended;
		return (
			<Component>
				{this.props.children(extended)}
				<Button onClick={this.toggle}>
					<Text>{extended ? 'Show Less' : 'Show More'}</Text>
				</Button>
			</Component>
		);
	}
}