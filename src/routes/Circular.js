import React from 'react';
import {connect} from 'react-redux';
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
import reducer from '../redux/reducers/circular';
import * as actions from '../redux/actions/circular';
addView('circular', reducer);

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
	Clearfix,
	BCheckbox,
	HelpBlock,
	DataTable,
	FormGroup,
	TextEditor,
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
export default class circulars extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'circular');
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

	fileInput = React.createRef();
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
	updateData = event => {
		let value = getInputValue(event.currentTarget);
		if (event.currentTarget.name === 'bcsmaps' && value.length > 1) {
			if (value[value.length - 1] === 0)
				value = [0];
			else if (value[0] === 0)
				value = [value[1]];
		}
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name: event.currentTarget.name,
			value,
		});
	};
	save = () => this.props.dispatch(actions.save(this.props, this.fileInput.current.files[0]));
	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this circular?'),
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
									<Text>Edit Circular</Text> :
									<Text>Add Circular</Text>
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
						<h3><Text>Circulars</Text></h3>
						<div>
							<Text>Schedule and manage circulars in your school.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						btnText='Add Circular'
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
					name='circulardetail__title'
					placeholder={__('Title')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'circulardetail__title', '')} />
				<FormControl
					type='text'
					name='circular__number'
					title={__('Circular No.')}
					onChange={this.updateFilter}
					placeholder={__('Circular No.')}
					value={filterValue(filters, 'circular__number', '')} />
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
							<td className='tw-30'>
								<Text>Circular Title</Text>
							</td>
							<td className='tw-30'>
								<Text>Circular No.</Text>
							</td>
							<td className='tw-30'>
								<Text>Date</Text>
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
				<td className='tw-30'>
					{item.circulardetails[0].title}
				</td>
				<td className='tw-30'>
					{item.number}
				</td>
				<td className='tw-30'>
					<DateView>{item.date}</DateView>
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
				item.date, this.props.session.userdetails.date_format
			).isBefore(moment().startOf('day'));
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
					</Col>
					<Clearfix/>
					<Col md={6}>
						<FormGroup
							controlId='number'
							validationState={errors.number ? 'error': null}>
							<ControlLabel><Text>Circular No.</Text></ControlLabel>
							<FormControl
								name='number'
								value={item.number}
								onChange={this.updateData}
								placeholder={__('Circular No.')}/>
							<HelpBlock>{errors.number}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='date'
							validationState={errors.date ? 'error': null}>
							<ControlLabel><Text>Date</Text></ControlLabel>
							<Datepicker
								name='date'
								value={item.date}
								disabled={started}
								onChange={this.updateData}
								placeholder={__('Date')}
								datepicker={{
									//minDate: !started && new Date,
									minDate: !started && moment().startOf('day'),
								}}/>
							<HelpBlock>{this.props.errors.date}</HelpBlock>	
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
				<FormGroup
					controlId='details'
					validationState={errors.details ? 'error': null}>
					<ControlLabel><Text>Description</Text></ControlLabel>
					<TextEditor
						rows='4'
						name='details'
						id='circular-details'
						onChange={this.updateData}
						defaultValue={item.details}
						placeholder={__('Description')}/>
					<HelpBlock>{errors.details}</HelpBlock>
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