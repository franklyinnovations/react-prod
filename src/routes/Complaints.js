import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/complaints';
import * as actions from '../redux/actions/complaints';
addView('complaints', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Form,
	Text,
	Modal,
	Alert,
	Panel,
	Table,
	Button,
	Select,
	Loading,
	Checkbox,
	HelpBlock,
	DataTable,
	FormGroup,
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
export default class Complaints extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'complaints');
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
	view = event => this.props.dispatch(
		actions.viewData(
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
	changeClass = event => this.props.dispatch(
		actions.changeClass(
			this.props,
			event.currentTarget.value,
		)
	);
	toggleStudent = event => this.props.dispatch({
		type: 'TOGGLE_CLT_STUDENT',
		id: event.currentTarget.value,
		checked: event.currentTarget.checked,
	});
	toggleStudentAll = event => this.props.dispatch({
		type: 'TOGGLE_CLT_STUDENT_ALL',
		checked: event.currentTarget.checked,
	});
	save = () => {
		if (!this.props.meta.students || !this.props.meta.students.some(item => item.selected)) {
			dialog.alert(window.__('Please select at least one student.'));
			return;
		}
		let yesText = dialog.defaultOptions.buttons[0].text,
			noText = dialog.defaultOptions.buttons[1].text;
		dialog.defaultOptions.buttons[0].text = window.__('Yes');
		dialog.defaultOptions.buttons[1].text = window.__('No');
		dialog.confirm({
			message: window.__('Do you want to send notification to Parents?'),
			callback: confirmed => {
				let data = new FormData(document.getElementById('clt-data-form'));
				data.append('send_notification', confirmed ? '1' : '0');
				this.props.dispatch(actions.save(this.props, data));
			},
			noText: window.__('No'),
			yesText: window.__('Yes'),
		});
		dialog.defaultOptions.buttons[0].text = yesText;
		dialog.defaultOptions.buttons[1].text = noText;
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
								{
									this.props.item.id ?
									<Text>View Complaint</Text> :
									<Text>Add Complaint</Text>
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item && (
								this.props.item.id ? this.renderView() :
									this.renderEditForm(__)
							)
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
						<h3><Text>Complaints</Text></h3>
						<div>
							<Text>Register the complaint of the student and notify respective parents for further actions.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Complaint'
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
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					name='complaint__bcsmapId__eq'
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'complaint__bcsmapId__eq', '')} />
				<Select
					title={__('Panel')}
					onChange={this.updateFilter}
					name='complaint__is_penalty__eq'
					placeholder={__('Select Status')}
					options={Complaints.getPenalityStatusOptions(__)}
					value={filterValue(filters, 'complaint__is_penalty__eq', null)}/>
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
							<td className='tw-35'><Text>Class</Text></td>
							<td className='tw-35'><Text>Penalty Status</Text></td>
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
				<td className='tw-35'>{item.bcsmap}</td>
				<td className='tw-35'>
					<Text>{Complaints.getPenalityStatus(item.is_penalty)}</Text>
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

	renderEditForm(__) {
		let {item, errors, meta} = this.props;
		return (
			<Form id='clt-data-form'>
				<FormGroup validationState={errors.bcsmapId ? 'error' : null}>
					<ControlLabel><Text>Class</Text></ControlLabel>
					<Select
						name='bcsmapId'
						value={item.bcsmapId}
						options={meta.bcsmaps}
						onChange={this.changeClass}/>
					<HelpBlock>{errors.bcsmapId}</HelpBlock>
				</FormGroup>
				{meta.students === null && <Loading/>}
				{
					meta.students && (
						meta.students.length === 0 ?
						<Alert bsStyle='warning'><Text>No student found.</Text></Alert> :
						<Table>
							<thead>
								<tr>
									<th>
										<input
											type='checkbox'
											checked={meta.allSelected}
											onChange={this.toggleStudentAll}/>
									</th>
									<th><Text>Student Name</Text></th>
									<th><Text>Father Name</Text></th>
									<th><Text>Mobile</Text></th>
								</tr>
							</thead>
							<tbody>
								{
									meta.students.map(item =>
										<tr key={item.id}>
											<td>
												<input
													type='checkbox'
													name='studentId'
													checked={item.selected}
													value={item.student.id}
													onChange={this.toggleStudent}/>
											</td>
											<td>{item.student.user.userdetails[0].fullname}</td>
											<td>{item.student.studentdetails[0].father_name}</td>
											<td>{item.student.user.mobile}</td>
										</tr>
									)
								}
							</tbody>
						</Table>
					)
				}
				<FormGroup
					controlId='complaint_detail'
					validationState={errors.complaint_detail ? 'error': null}>
					<ControlLabel><Text>Complaint Detail</Text></ControlLabel>
					<FormControl
						rows='5'
						name='complaint_detail'
						componentClass='textarea'
						onChange={this.updateData}
						value={item.complaint_detail}
						placeholder={__('Complaint Detail')}/>
					<HelpBlock>{errors.complaint_detail}</HelpBlock>
				</FormGroup>
				<Checkbox
					name='is_penalty'
					value={item.is_penalty}
					onChange={this.updateData}>
					<ControlLabel><Text>Do you want to apply Penalty?</Text></ControlLabel>
				</Checkbox>
				{
					!!item.is_penalty &&
					<FormGroup
						controlId='fine_amount'
						validationState={errors.fine_amount ? 'error': null}>
						<ControlLabel><Text>Fine Amount</Text></ControlLabel>
						<FormControl
							name='fine_amount'
							value={item.fine_amount}
							onChange={this.updateData}
							placeholder={__('Fine Amount')}/>
						<HelpBlock>{errors.fine_amount}</HelpBlock>
					</FormGroup>
				}
				<FormGroup>
					<ControlLabel><Text>Follow Up Action</Text></ControlLabel>
					<Select
						multi
						name='tagIds'
						value={item.tagIds}
						options={meta.tags}
						onChange={this.updateData}/>
				</FormGroup>
				<FormGroup controlId='image'>
					<ControlLabel>
						<Text>Upload Image or Video upto 5MB as Proof of Complaint</Text>
					</ControlLabel>
					<FormControl type='file' name='image'/>
				</FormGroup>
				<div className='text-right'>
					<Button
						bsStyle='primary'
						onClick={this.save}
						disabled={this.props.saving}>
						<Text>{this.props.saving ? 'Saving' : 'Submit'}</Text>
					</Button>
				</div>
			</Form>
		);
	}

	renderView() {
		let {item} = this.props;
		return (
			<React.Fragment>
				<Panel>
					<Panel.Heading>
						<Panel.Title>
							<Text>Students</Text>
						</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<Table condensed bordered>
							<thead>
								<tr>
									<th><Text>Student Name</Text></th>
									<th><Text>Father Name</Text></th>
									<th><Text>Mobile</Text></th>
								</tr>
							</thead>
							<tbody>
								{
									item.complaintrecords.map(item =>
										<tr key={item.student.id}>
											<td>{item.student.user.userdetails[0].fullname}</td>
											<td>{item.student.studentdetails[0].father_name}</td>
											<td>{item.student.user.mobile}</td>
										</tr>
									)
								}
							</tbody>
						</Table>
					</Panel.Body>
				</Panel>
				<Panel>
					<Panel.Heading>
						<Panel.Title>
							<Text>Complaint Details</Text>
						</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<p>{item.complaint_detail}</p>
						{
							!!item.is_penalty &&
							<p>
								<b><Text>Penalty</Text></b>
								&nbsp;:&nbsp;
								<i>{item.fine_amount}</i>
							</p>
						}
						<p>
							{
								item.image &&
								<a
									target='_blank'
									rel='noopener noreferrer'
									className='btn btn-primary'
									href={this.props.session.servicePath + item.image}>
									<Text>Proof of Complaint</Text>
								</a>
							}
						</p>
						<p>
							{
								item.tags &&
								item.tags.map(tag => (
									<React.Fragment key={tag.id}>
										<span
											className='label label-primary'
											title={tag.tagdetails[0].description}>
											{tag.tagdetails[0].title}
										</span>
										&nbsp;
									</React.Fragment>
								))
							}
						</p>
					</Panel.Body>
				</Panel>
			</React.Fragment>
		);
	}

	static getPenalityStatus(status) {
		switch (status) {
			case 0:
				return 'No';
			case 1:
				return 'Yes';
		}
	}

	static getPenalityStatusOptions(__) {
		return [
			{
				value: '1',
				label: __('Yes')
			},
			{
				value: '0',
				label: __('No')
			},
		];
	}
}

	
