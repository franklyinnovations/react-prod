import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';
import {
	getFile,
	bcsName,
	messenger,
	filterValue,
	moduleActions,
	freeFileInput,
	downloadString,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/activitymark';
import * as actions from '../redux/actions/activitymark';
addView('activitymark', reducer);

import {
	Row,
	Col,
	Icon,
	Alert,
	View,
	Text,
	Button,
	Select,
	Loading,
	HelpBlock,
	DataTable,
	FormGroup,
	Clearfix,
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
export default class ActivityMark extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'mark');
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
	viewList = () => this.props.router.push(this.props.router.location);
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => {
		let id = event.currentTarget.getAttribute('data-item-id'),
			index = id.indexOf('-');
		this.props.dispatch(actions.edit(
			this.props,
			id.substring(index + 1),
			id.substring(0, index),
		));
	};
	view = event => {
		let id = event.currentTarget.getAttribute('data-item-id'),
			index = id.indexOf('-');
		this.props.dispatch(actions.viewData(
			this.props,
			id.substring(index + 1),
			id.substring(0, index),
		));
	};
	updateExamSchedule = event => this.props.dispatch(
		actions.updateExamSchedule(
			this.props,
			event.currentTarget.value
		)
	);
	updateSelector = event => this.props.dispatch({
		type: 'UPDATE_ACTIVITY_MARK_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	loadStudents = () => {
		if (!this.props.selector.examSchedule)
			return messenger.post({
				type: 'error',
				message: window.__('Please Select Exam')
			});
		if (!this.props.selector.sectionId)
			return messenger.post({
				type: 'error',
				message: window.__('Please Select Section')
			});
		if (this.props.selector.activities.length === 0)
			return messenger.post({
				type: 'error',
				message: window.__('Please Select Activity')
			});
		this.props.dispatch(actions.loadStudents(this.props));
	};
	updateMark = event => this.props.dispatch({
		type: 'UPDATE_ACTIVITY_MARK',
		value: event.currentTarget.value,
		activity: +event.target.getAttribute('data-activity-id'),
		student: +event.target.getAttribute('data-student-index'),
	});
	save = () => {
		let errors = [], marks = [], cursor = 0;
		this.props.meta.superActivities.forEach(activity => {
			let subActivities = this.props.meta.subActivities[activity.id],
				mark = {activitymarkrecords: []},
				max_marks = this.props.meta.activityschedules[activity.id].max_marks;
			if (this.props.meta.activitymarks[activity.id]) {
				mark.id = this.props.meta.activitymarks[activity.id];
			} else {
				mark.activityScheduleId = this.props.meta.activityschedules[activity.id].id;
				mark.bcsMapId = this.props.selector.selected.bcsMapId;
			}
			marks.push(mark);

			let subActivityMarks = [], subActivityMaxMarks = [];
			if (subActivities) {
				subActivities.forEach(activity => {
					let mark = {activitymarkrecords: []},
						max_marks = this.props.meta.activityschedules[activity.id].max_marks;
					if (this.props.meta.activitymarks[activity.id]) {
						mark.id = this.props.meta.activitymarks[activity.id];
					} else {
						mark.activityScheduleId = this.props.meta.activityschedules[activity.id].id;
						mark.bcsMapId = this.props.selector.selected.bcsMapId;
					}
					subActivityMarks.push(mark);
					subActivityMaxMarks.push(max_marks);
					marks.push(mark);
				});
			}


			this.props.students.forEach(student => {
				let markrecord = {
					obtained_mark: student.marks[activity.id].value
				};
				if (student.marks[activity.id].id) {
					markrecord.id = student.marks[activity.id].id;
				} else {
					markrecord.studentId = student.id;
					markrecord.activityMarkId = mark.id;
				}
				if (subActivities) {
					let total = 0;
					subActivities.forEach((activity, index) => {
						let markrecord = {
							obtained_mark: student.marks[activity.id].value,
						};
						if (student.marks[activity.id].id) {
							markrecord.id = student.marks[activity.id].id;
						} else {
							markrecord.studentId = student.id;
							markrecord.activityMarkId = subActivityMarks[index].id;
						}
						errors[cursor++] = getMarkError(markrecord.obtained_mark, subActivityMaxMarks[index]);
						subActivityMarks[index].activitymarkrecords.push(markrecord);
						total += parseFloat(markrecord.obtained_mark);
					});
					markrecord.obtained_mark = total;
				} else {
					errors[cursor++] = getMarkError(markrecord.obtained_mark, max_marks);
				}
				mark.activitymarkrecords.push(markrecord);
			});
		});


		if (errors.reduce(((sum, error) => sum + error), 0) !== 0) {
			this.props.dispatch({
				type: 'SHOW_AM_ERRORS',
				errors,
			});
		} else {
			this.props.dispatch(actions.save(this.props,marks));
		}
	};

	downloadCSV = async () => {
		let fields = [
			window.__('Name'),
			window.__('Roll No'),
		];
		this.props.meta.superActivities.forEach(superActivity => {
			let subActivities = this.props.meta.subActivities[superActivity.id];
			if (subActivities) {
				let name = superActivity.activitydetails[0].name + ' - ';
				subActivities.forEach(subActivity => {
					fields.push(name + subActivity.activitydetails[0].name);
				});
			} else {
				fields.push(superActivity.activitydetails[0].name);
			}
		});
		let data = this.props.students.map(student => {
			let row = [
				student.user.userdetails[0].fullname,
				student.studentrecord.roll_no,
			];
			this.props.meta.superActivities.forEach(superActivity => {
				let subActivities = this.props.meta.subActivities[superActivity.id];
				if (subActivities) {
					subActivities.forEach(subActivity => {
						row.push(student.marks[subActivity.id].value);
					});
				} else {
					row.push(student.marks[superActivity.id].value);
				}
			});
			return row;
		});
		const csv = (await import('papaparse')).default;
		downloadString(
			csv.unparse({fields, data}),
			'application/csv',
			'student-marks.csv',
			'_black'
		);
	};
	importCSV = async () => {
		let [file] = await getFile();
		if (!file) {
			freeFileInput();
			return;
		}
		if (!/\.csv$/.test(file.name)) {
			messenger.post({
				message: window.__('Only CSV files allowed'),
				type: 'error',
			});
			freeFileInput();
			return;
		}
		this.props.dispatch({type: 'START_AM_CSV_IMPORT'});
		const csv = (await import('papaparse')).default;
		csv.parse(file, {
			complete: data => {
				freeFileInput();
				this.setCSVImportData(data);
			}
		});
	};
	setCSVImportData = ({data: rows}) => {
		let markrecords = [];
		for (let i = 1; i < rows.length; i++) {
			let row = rows[i],
				cursor = 2,
				marks = {};
			this.props.meta.superActivities.forEach(superActivity => {
				let subActivities = this.props.meta.subActivities[superActivity.id];
				if (subActivities) {
					subActivities.forEach(subActivity => {
						marks[subActivity.id] = row[cursor++];
					});
				} else {
					marks[superActivity.id] = row[cursor++];
				}
			});
			markrecords.push(marks);
		}
		this.props.dispatch({
			type: 'SET_AM_CSV_IMPORT_DATA',
			markrecords,
		});
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState === 'LIST') {
			let firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
			if (firstTime) return <View>{this.renderFirstMessage()}</View>;
			return (
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
			);
		}
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.reset} title={__('View List')}>
						<Text>View List</Text>
					</View.Action>
				</View.Actions>
			}>
				{this.renderStudentData(__)}
			</View>
		);	
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Activity Marks</Text></h3>
						<div>
							<Text>To add, update or view marks of the student for each activity. These Marks will be used to generate the Mark-sheet.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Activity Marks'
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
					title={__('Exam Name')}
					placeholder={__('Name')}
					name='examheaddetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'examheaddetail__name', '')} />
				<Select
					title={__('Class')}
					onChange={this.updateFilter}
					placeholder={__('Select Class')}
					name='activitymark__bcsMapId__eq'
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'activitymark__bcsMapId__eq', null)}/>
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
							<td className='tw-35'>
								<Text>Exam Name</Text>
							</td>
							<td className='tw-35'>
								<Text>Class</Text>
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

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-35'>
					{item.activityschedule.examschedule.examhead.examheaddetails[0].name}
				</td>
				<td className='tw-20'>
					{bcsName(item.bcsmap)}
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={
									item.bcsMapId
									+ '-' + item.activityschedule.examscheduleId
									+ '-' + item.bcsmap.board.id
									+ '-' + item.bcsmap.class.id
								}/>
						}
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={
								item.bcsMapId
								+ '-' + item.activityschedule.examscheduleId
								+ '-' + item.bcsmap.board.id
								+ '-' + item.bcsmap.class.id
							}/>
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderStudentData(__) {
		return (
			<React.Fragment>
				<Row>
					<Col md={6}>
						<FormGroup>
							<ControlLabel><Text>Exam</Text></ControlLabel>
							<Select
								name='examSchedule'
								placeholder={__('Select Exam')}
								onChange={this.updateExamSchedule}
								options={this.props.meta.examSchedules}
								value={this.props.selector.examSchedule}
								disabled={this.props.viewState !== 'ADD'}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<ControlLabel><Text>Section</Text></ControlLabel>
							<Select
								name='sectionId'
								onChange={this.updateSelector}
								options={this.props.meta.sections}
								placeholder={__('Select Section')}
								value={this.props.selector.sectionId}
								isLoading={this.props.selector.loading}
								disabled={this.props.viewState !== 'ADD'}/>
						</FormGroup>
					</Col>
					<Col xs={12}>
						<FormGroup>
							<ControlLabel><Text>Activities</Text></ControlLabel>
							<Select
								multi
								name='activities'
								onChange={this.updateSelector}
								options={this.props.meta.activities}
								placeholder={__('Select Activities')}
								value={this.props.selector.activities}
								isLoading={this.props.selector.loading}/>
						</FormGroup>
					</Col>
					<Col xs={12}>
						<Button onClick={this.loadStudents} bsStyle='primary'>
							<Text>Go</Text>
						</Button>
					</Col>
				</Row>
				<hr/>
				{this.props.students === null && <Loading/>}
				{
					!!this.props.students && (
						this.props.students.length === 0 ?
						<Alert bsStyle='warning'>
							<Text>No students found</Text>
						</Alert> :
						this.renderStudents(__)
					)
				}
				{
					this.props.students &&
					<React.Fragment>
						<Button onClick={this.viewList}>
							<Text>Back</Text>
						</Button>
						{' '}
						{
							this.props.viewState !== 'VIEW' &&
							this.props.students.length !== 0 &&
							<Button onClick={this.save} bsStyle='primary'>
								<Text>Submit</Text>
							</Button>
						}
					</React.Fragment>
				}
			</React.Fragment>
		);
	}

	renderStudents(__) {
		let cursor = 0,
			students = this.props.students,
			totalStudents = students.length,
			activityschedules = this.props.meta.activityschedules,
			errors = [
				null,
				__('This is a required field.'),
				__('Invalid marks.'),
				__('Beyond max marks.'),
			];
		return (
			<React.Fragment>
				<div>
					<Button
						bsStyle='primary'
						onClick={this.downloadCSV}>
						<Text>Download</Text>
					</Button>
					{' '}
					{
						this.props.viewState !== 'VIEW' &&
						<Button
							bsStyle='primary'
							onClick={this.importCSV}>
							<Text>Import</Text>
						</Button>
					}
				</div>
				<br/>
				<div
					key='student-table'
					className={'student-marks-table' + (this.props.viewState === 'VIEW' ? ' view' : '')}>
					{
						students.map((student, studentIndex) => (
							<Row key={student.id}>
								<Col md={2} className='student-profileinfo'>
									<div>
										<ServiceImage
											width={60}
											className='img-circle'
											src={student.user.user_image}/>
									</div>
									<div>
										<b>{student.user.userdetails[0].fullname}</b>
									</div>
									<div><Text>Roll No.</Text>&nbsp;{student.studentrecord.roll_no}</div>
								</Col>
								<Col md={10} className='student-marksinfo'>
									<Row>
										{
											this.props.meta.superActivities.map((activity, index) => {
												let subActivities = this.props.meta.subActivities[activity.id];
												let content = (
													<Col md={6}
														className={subActivities ? 'complex' : 'simple'}>
														{
															subActivities ? (
																<Row>
																	<Col md={12} className='subjects-name'>
																		{
																			activity.activitydetails[0].name + 
																				' / ' + activityschedules[activity.id].max_marks
																		}
																	</Col>
																	<Col md={12} className='sub-cat'>
																		{
																			subActivities.map((subActivity, sbaIndex) => (
																				<Row key={subActivity.id} className='sub-cats'>
																					<Col md={6}>
																						{
																							subActivity.activitydetails[0].name+ 
																								' / ' + activityschedules[subActivity.id].max_marks
																						}
																					</Col>
																					<Col md={6}
																						className={this.props.errors[cursor * totalStudents + sbaIndex + subActivities.length * studentIndex] ? 'has-error' : ''}>
																						{
																							this.props.viewState !== 'VIEW' ?
																							<FormControl
																								onChange={this.updateMark}
																								value={student.marks[subActivity.id].value}
																								data-student-index={studentIndex}
																								data-activity-id={subActivity.id}/> :
																							<span>{student.marks[subActivity.id].value}</span>
																						}
																						<HelpBlock>{errors[this.props.errors[cursor * totalStudents + sbaIndex + subActivities.length * studentIndex]]}</HelpBlock>
																					</Col>
																				</Row>
																			))
																		}
																	</Col>
																</Row>
															): (
																<Row>
																	<Col md={6} className='subjects-name'>
																		{
																			activity.activitydetails[0].name + 
																				' / ' + activityschedules[activity.id].max_marks
																		}
																	</Col>
																	<Col md={6} className={this.props.errors[cursor * totalStudents + studentIndex] ? 'has-error' : ''}>
																		{
																			this.props.viewState !== 'VIEW' ?
																			<FormControl
																				onChange={this.updateMark}
																				value={student.marks[activity.id].value}
																				data-student-index={studentIndex}
																				data-activity-id={activity.id}/> :
																			<span>{student.marks[activity.id].value}</span>
																		}
																		<HelpBlock>{errors[this.props.errors[cursor * totalStudents + studentIndex]]}</HelpBlock>
																	</Col>
																</Row>
															)
														}
													</Col>
												);
												cursor = (index + 1 === this.props.meta.superActivities.length) ? 0 : (cursor + (subActivities && subActivities.length ? subActivities.length : 1));
												return (
													<React.Fragment key={activity.id}>
														{content}
														{index % 2 === 1 && <Clearfix/>}
													</React.Fragment>
												);
											})
										}
									</Row>
								</Col>
							</Row>
						))
					}
				</div>
			</React.Fragment>
		);
	}
}

function getMarkError(_mark, max) {
	let mark = _mark;
	if (mark.constructor === String && !(mark.trim()))
		return 1;
	else if (isNaN(mark = Number(mark)) || mark < 0)
		return 2;
	else if (mark > max)
		return 3;
	else
		return 0;
}