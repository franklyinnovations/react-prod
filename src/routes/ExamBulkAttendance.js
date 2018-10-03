import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	bcsName,
	messenger,
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/exambulkattendance';
import * as actions from '../redux/actions/exambulkattendance';
addView('exambulkattendance', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Form,
	Text,
	Panel,
	Radio,
	Alert,
	Button,
	Select,
	Loading,
	Clearfix,
	HelpBlock,
	DataTable,
	FormGroup,
	Pagination,
	FormControl,
	ClickButton,
	ControlLabel,
	ServiceImage,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class ExamBulkAttendance extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'exambulkattendance');
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
	viewList = () => this.props.router.push(this.props.router.location);
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
	changeClass = event => this.props.dispatch(
		actions.changeClass(
			this.props,
			event.currentTarget.value,
		)
	);
	loadStudents = () => {
		let __ = window.__;
		if (!this.props.item.bcsmapId)
			return messenger.post({
				type: 'error',
				message: __('Please Select Class')
			});
		if (this.props.item.pattern === '1' && !this.props.item.examheadId)
			return messenger.post({
				type: 'error',
				message: __('Please Select Exam')
			});
		if (this.props.item.pattern === '2' && !this.props.item.month)
			return messenger.post({
				type: 'error',
				message: __('Please Select Month')
			});
		this.props.dispatch(actions.loadStudents(this.props));
	};
	updateEBA = event => this.props.dispatch({
		value: event.currentTarget.value,
		type: 'UPDATE_PRESENT_DAY_EBA_DATA_VALUE',
		name: event.currentTarget.getAttribute('data-name'),
	});
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			new FormData(document.getElementById('eba-form'))
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
		if (this.props.item !== false) return this.renderEditForm(__);
		return (
			firstTime ?
			<View>{this.renderFirstMessage()}</View> : 
			<View
				search={this.props.query}
				filters={this.renderFilters(__)}
				actions={this.renderViewActions(__)}>
				{this.renderData()}
			</View>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Student Bulk Attendance</Text></h3>
						<div>
							<Text>In this part, you will be adding attendance in bulk.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						onClick={this.startAdd}
						btnText='Add Bulk Attendance'/>
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
					options={this.props.meta.bcsmaps1}
					name='exambulkattendance__bcsMapId__eq'
					value={filterValue(filters, 'exambulkattendance__bcsMapId__eq', '')} />
				<FormControl
					type='text'
					title={__('Exam')}
					placeholder={__('Exam')}
					name='examheaddetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'examheaddetail__name', '')} />
				<FormControl
					type='text'
					title={__('Month')}
					placeholder={__('Month')}
					onChange={this.updateFilter}
					name='exambulkattendance__month'
					value={filterValue(filters, 'exambulkattendance__month', '')} />
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
							<td className='tw-35'><Text>Exam/Month</Text></td>
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
				<td className='tw-35'>{bcsName(item.bcsmap)}</td>
				<td className='tw-35'>
					{
						item.pattern == 1 ? item.examhead.examheaddetails[0].name :
							<Text>{item.month}</Text>
					}
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
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderEditForm(__) {
		if (this.props.item === null) return <Loading/>;
		let {item, meta} = this.props; 
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.viewList}>
						<Text>View List</Text>
					</View.Action>
				</View.Actions>
			}>
				{
					!item.editing &&
					<Panel>
						<Panel.Heading><Text>Select Options</Text></Panel.Heading>
						<Panel.Body>
							<Row>
								<Col md={4}>
									<FormGroup>
										<ControlLabel>
											<Text>Pattern</Text>
										</ControlLabel>
										<FormControl.Static>
											<Radio
												inline
												value='2' 
												name='pattern'
												onChange={this.updateData}
												checked={item.pattern === '2'}>
												<Text>Month Wise</Text>
											</Radio>
											<Radio
												inline
												value='1'
												name='pattern'
												onChange={this.updateData}
												checked={item.pattern === '1'}>
												<Text>Exam Wise</Text>
											</Radio>
										</FormControl.Static>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup>
										<ControlLabel>
											<Text>Class</Text>
										</ControlLabel>
										<Select
											name='bcsmapId'
											value={item.bcsmapId}
											options={meta.bcsmaps}
											onChange={this.changeClass}/>
									</FormGroup>
								</Col>
								<Col md={4}>
									{
										item.pattern === '1' ?
										<FormGroup>
											<ControlLabel>
												<Text>Exam</Text>
											</ControlLabel>
											<Select
												name='examheadId'
												value={item.examheadId}
												onChange={this.updateData}
												options={meta.availableExamHeads}
												isLoading={meta.loadingAvailableExamHeads}/> 
										</FormGroup> :
										<FormGroup>
											<ControlLabel>
												<Text>Month</Text>
											</ControlLabel>
											<Select
												name='month'
												labelKey='value'
												value={item.month}
												options={meta.months}
												onChange={this.updateData}/>
										</FormGroup>
									}
								</Col>
								<Col xs={12}>
									<FormGroup>
										<Button
											bsStyle='primary'
											onClick={this.loadStudents}>
											<Text>Go</Text>
										</Button>
									</FormGroup>
								</Col>
							</Row>
						</Panel.Body>		
					</Panel>
				}
				{item.students === null && <Loading/>}
				{item.students && this.renderStudents(item.students, __)}
				{
					item.students && item.students.length !== 0 &&
					<React.Fragment>
						<Button
							onClick={this.viewList}
							disabled={this.props.saving}>
							<Text>Cancel</Text>
						</Button>
						&nbsp;
						<Button
							bsStyle='primary'
							onClick={this.save}
							disabled={this.props.saving}>
							<Text>{this.props.saving ? 'Saving' : 'Submit'}</Text>
						</Button>
					</React.Fragment>
				}
			</View>
		);
	}

	renderStudents(students, __) {
		if (students.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No student found</Text>
				</Alert>
			);
		let {item, errors} = this.props;
		return (
			<Form id='eba-form'>
				<input
					type="hidden"
					name='bcsmapId'
					value={item.bcsmapId ? parseInt(item.bcsmapId.split('-')[0]) : ''}/>
				{
					this.props.item.pattern == '1' ?
					<input
						type='hidden'
						name='examheadId'
						value={item.examheadId}/>:
					<input
						name='month'
						type='hidden'
						value={item.month}/>
				}
				<input
					type='hidden'
					name='pattern'
					value={item.pattern}/>
				<input
					name='id'
					type='hidden'
					value={item.exambulkattendanceId}/>
				<FormGroup
					className='row'
					controlId='total'
					validationState={errors.total ? 'error': null}>
					<Col md={3}>
						<FormControl.Static>
							<Text>Total Attendance of the Session</Text>
						</FormControl.Static>
					</Col>
					<Col md={3}>
						<FormControl
							type='text'
							name='total'
							onChange={this.updateData}
							value={this.props.item.total}
							placeholder={__('Total Attendance of the Session')}/>
						<HelpBlock>{errors.total}</HelpBlock>
					</Col>
				</FormGroup>
				<Row>
					{
						students.map((item, index) =>
							<React.Fragment key={item.id}>
								<Col md={6}>
									<div className='card'>
										<Col xs={3}>
											<ServiceImage
												width='75'
												height='75'
												className='img-circle'
												src={item.student.user.user_image}/>
										</Col>
										<Col xs={6}>
											<div>
												<strong><Text>Enroll</Text>:&nbsp;</strong>
												{item.student.enrollment_no} 
											</div>
											<div>
												<strong><Text>Roll No</Text>:&nbsp;</strong>
												{item.roll_no} 
											</div>
											<div>
												<strong><Text>Student</Text>:&nbsp;</strong>
												{item.student.user.userdetails[0].fullname} 
											</div>
											<div>
												<strong><Text>Father</Text>:&nbsp;</strong>
												{item.student.studentdetails[0].father_name}
											</div>
										</Col>
										<Col xs={3}>
											{
												item.student.exambulkattendancedetails &&
												item.student.exambulkattendancedetails.length !== 0 &&
												<input
													type='hidden'
													name={'exambulkattendance_detail['+index+'][id]'}
													value={item.student.exambulkattendancedetails[0].id}/>
											}
											{
												this.props.item.exambulkattendanceId &&
												<input
													type='hidden'
													value={this.props.item.exambulkattendanceId}
													name={'exambulkattendance_detail['+index+'][exambulkattendanceId]'}/>
											}
											<input
												type="hidden"
												value={item.student.id}
												name={'exambulkattendance_detail['+index+'][studentId]'}/>
											<input
												type='hidden'
												name={'exambulkattendance_detail['+index+'][present_days]'}
												value={this.props.item.ebas_status['ebas_'+ item.student.id]}/>
											<FormGroup
												controlId={'ebas_' + item.student.id}
												validationState={this.props.errors['ebas_'+ item.student.id] ? 'error': null}>
												<FormControl
													type='text'
													onChange={this.updateEBA}
													data-name={'ebas_' + item.student.id}
													value={this.props.item.ebas_status['ebas_'+ item.student.id]}/>
												<HelpBlock>{this.props.errors['ebas_'+ item.student.id]}</HelpBlock>
											</FormGroup>
										</Col>
									</div>
								</Col>
								{index % 2 === 1 && <Clearfix/>}
							</React.Fragment>
						)
					}
				</Row>
			</Form>
		);
	}
}