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
import {getExamType} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/mark';
import * as actions from '../redux/actions/mark';
addView('mark', reducer);

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
	Clearfix,
	HelpBlock,
	DataTable,
	FormGroup,
	InputGroup,
	Pagination,
	FormControl,
	ClickButton,
	ControlLabel,
	ServiceImage,
} from '../components';
import TagPicker from '../components/TagPicker';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Mark extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'mark');
	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => this.props.dispatch(actions.edit(
		this.props,
		...(event.currentTarget.getAttribute('data-item-id').split('-'))
	));
	view = event => this.props.dispatch(actions.viewData(
		this.props,
		...(event.currentTarget.getAttribute('data-item-id').split('-'))
	));
	updateSelector = event => {
		switch(event.currentTarget.name) {
			case 'examScheduleId':
				this.props.dispatch(
					actions.updateExamSchedule(
						this.props,
						event.currentTarget.value,
					)
				);
				break;
			case 'sectionId':
				this.props.dispatch(
					actions.updateSection(
						this.props,
						event.currentTarget.value,
					)
				);
				break;
			case 'subjects':
				this.props.dispatch({
					type: 'UPDATE_MRK_SUBJECTS',
					value: event.currentTarget.value,
				});
		}
	};
	loadStudents = () => {
		let __ = window.__;
		if (!this.props.selector.examScheduleId)
			return messenger.post({
				type: 'error',
				message: __('Please Select Exam')
			});
		if (!this.props.selector.sectionId)
			return messenger.post({
				type: 'error',
				message: __('Please Select Section')
			});
		if (this.props.selector.subjects.length === 0)
			return messenger.post({
				type: 'error',
				message: __('Please Select Subject')
			});
		this.props.dispatch(actions.loadStudents(this.props));
	};
	downloadCSV = async () => {
		let __ = window.__;
		let fields = [
				__('Name'),
				__('Roll No'),
			],
			marks = this.props.meta.marks;
		marks.forEach(mark => {
			let escs = mark.examschedulesubjectcategories,
				subject = mark.subject.subjectdetails[0].name + '-' + __(getExamType(mark.exam_type));
			if (escs && escs.length) {
				escs.forEach(esc => {
					fields.push(
						subject
						+ '-'
						+ esc.subjectcategory.subjectcategorydetails[0].name
						+ ' / ' + esc.max_marks
					);
				});
			} else {
				fields.push(subject + '/' + mark.max_mark);
			}
		});

		let students = this.props.students, data = [];

		for (let i = 0; i < students.length; i++) {
			let student = students[i],
				row = [
					student.user.userdetails[0].fullname,
					student.studentrecord.roll_no,
				];
			for (let j = 0; j < marks.length; j++) {
				let mark = marks[j],
					escs = mark.examschedulesubjectcategories,
					markrecord = student.markrecords[j];
				if (escs && escs.length) {
					escs.forEach(esc => {
						row.push(
							markrecord.subjectcategory_marks[
								's' + esc.subjectCategoryId
							]
						);
					});
				} else {
					row.push(markrecord.obtained_mark);
				}
			}
			data.push(row);
		}
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
		this.props.dispatch({type: 'START_MARK_CSV_IMPORT'});
		const csv = (await import('papaparse')).default;
		csv.parse(file, {
			complete: data => {
				freeFileInput();
				this.setCSVImportData(data);
			}
		});
	};
	setCSVImportData = ({data: rows}) => {
		let markrecords = [], marks = this.props.meta.marks;
		for (let i = 1; i < rows.length; i++) {
			let row = rows[i],
				cursor = 2;
			for (let j = 0; j < marks.length; j++) {
				let mark = marks[j],
					escs = mark.examschedulesubjectcategories,
					markrecord = {};
				if (escs && escs.length) {
					markrecord.subjectcategory_marks = {};
					escs.forEach(esc => {
						markrecord.subjectcategory_marks['s' + esc.subjectCategoryId] = row[cursor++];
					});
					markrecord.obtained_mark = sumCategoryMarks(markrecord.subjectcategory_marks);
				} else {
					markrecord = {
						subjectcategory_marks: null,
						obtained_mark: row[cursor++],
					};
				}
				markrecords.push(markrecord);
			}
		}
		this.props.dispatch({
			type: 'SET_CSV_IMPORT_DATA',
			markrecords: markrecords
		});
	};

	showTagPopup = (student, markrecord, value) => {
		this.props.dispatch({
			type: 'MARK_SHOW_TAG_POP',
			student,
			markrecord,
			value,
		});
	};
	hideTagPopup = () => this.props.dispatch({type: 'HIDE_TAG_POPUP'});
	setStudentTag = value => {
		this.props.dispatch({
			type: 'SET_MARK_TAGS',
			student: this.props.tag.student,
			markrecord: this.props.tag.markrecord,
			value,
		});
	};
	removeStudentTag = (student, markrecord, value) => {
		this.props.dispatch({
			type: 'REMOVE_MARK_TAG',
			student,
			markrecord,
			value,
		});
	};
	save = () => {
		let errors = [],
			marks = this.props.meta.marks.map((item, index) => {
				let mark;
				if (item.id) {
					mark = {
						id: item.id,
						markrecords: this.props.students.map(student => {
							let markrecord = student.markrecords[index];
							if (markrecord.subjectcategory_marks) {
								item.examschedulesubjectcategories.forEach(esc => {
									errors.push(
										getMarkError(
											markrecord.subjectcategory_marks['s' + esc.subjectCategoryId],
											esc.max_marks
										)
									);
								});
							} else {
								errors.push(
									getMarkError(
										markrecord.obtained_mark,
										item.max_mark
									)
								);
							}
							return {
								id: markrecord.id,
								markId: item.id,
								studentId: markrecord.studentId,
								tags: markrecord.tags,
								...getDatabaseMark(markrecord),
							};
						})
					};
				} else {
					mark = {
						examScheduleId: this.props.selector.selected.examScheduleId,
						bcsMapId: this.props.selector.selected.bcsMapId,
						academicSessionId: this.props.session.academicSessionId,
						subjectId: item.subjectId,
						exam_type: item.exam_type,
						max_mark: item.max_mark,
						min_passing_mark: item.min_passing_mark,
						markrecords: this.props.students.map(student => {
							let markrecord = student.markrecords[index];
							if (markrecord.subjectcategory_marks) {
								item.examschedulesubjectcategories.forEach(esc => {
									errors.push(
										getMarkError(
											markrecord.subjectcategory_marks['s' + esc.subjectCategoryId],
											esc.max_marks
										)
									);
								});
							} else {
								errors.push(
									getMarkError(
										markrecord.obtained_mark,
										item.max_mark
									)
								);
							}
							return {
								studentId: markrecord.studentId,
								tags: markrecord.tags,
								...getDatabaseMark(markrecord),
							};
						})
					};
				}
				return mark;
			});
		if (errors.reduce(((sum, error) => sum + error), 0) !== 0) {
			this.props.dispatch({
				type: 'SHOW_MARK_ERRORS',
				errors,
			});
		} else {
			this.props.dispatch(actions.save(this.props, marks));
		}
	};
	viewList = () => this.props.router.push(this.props.router.location);

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
						<h3><Text>Exam Marks</Text></h3>
						<div>
							<Text>To add, update or view marks of the student for each exam. These Marks will be used to generate the Mark-sheet.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Exam Marks'
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
					name='mark__bcsMapId__eq'
					onChange={this.updateFilter}
					placeholder={__('Select Class')}
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'mark__bcsMapId__eq', null)}/>
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
					{item.examschedule.examhead.examheaddetails[0].name}
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
								data-item-id={item.examScheduleId + '-' + item.bcsMapId}/>
						}
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.examScheduleId + '-' + item.bcsMapId}/>
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
							<ControlLabel>
								<Text>Exam</Text>
							</ControlLabel>
							<Select
								name='examScheduleId'
								onChange={this.updateSelector}
								data-action-type='UPDATE_MARK_SELECTOR'
								options={this.props.meta.examSchedules}
								value={this.props.selector.examScheduleId}
								disabled={this.props.viewState !== 'ADD_DATA'}
								isLoading={this.props.selector.loadingExamSchedules}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<ControlLabel>
								<Text>Section</Text>
							</ControlLabel>
							<Select
								name='sectionId'
								onChange={this.updateSelector}
								options={this.props.meta.sections}
								value={this.props.selector.sectionId}
								disabled={this.props.viewState !== 'ADD_DATA'}
								isLoading={this.props.selector.loadingSections}/>
						</FormGroup>
					</Col>
					<Col md={12}>
						<FormGroup>
							<ControlLabel>
								<Text>Subjects</Text>
							</ControlLabel>
							<Select
								multi
								name='subjects'
								onChange={this.updateSelector}
								options={this.props.meta.subjects}
								value={this.props.selector.subjects}
								isLoading={this.props.selector.loadingSubjects}/>
						</FormGroup>
					</Col>
					<Col md={12}>
						<Button
							bsStyle='primary'
							onClick={this.loadStudents}>
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
							this.props.viewState !== 'VIEW_DATA' &&
							this.props.students.length !== 0 &&
							<Button onClick={this.save} bsStyle='primary'>
								<Text>Submit</Text>
							</Button>
						}
					</React.Fragment>
				}
				<TagPicker
					__={__}
					tags={this.props.meta.tags}
					show={this.props.tag.student !== null}
					selected={this.props.tag.selected}
					onHide={this.hideTagPopup}
					onChange={this.setStudentTag}/>
			</React.Fragment>
		);
	}

	renderStudents(__) {
		let students = this.props.students,
			ids = this.props.meta.marks.map(mark => mark.subjectId + mark.exam_type),
			marks = this.props.meta.marks,
			totalStudents = students.length,
			cursor = 0,
			errors = [
				null,
				__('This is a required field.'),
				__('Invalid marks.'),
				__('Beyond maximum marks.'),
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
						this.props.viewState !== 'VIEW_DATA' &&
						<Button
							bsStyle='primary'
							onClick={this.importCSV}>
							<Text>Import</Text>
						</Button>
					}
				</div>
				<br/>
				<Alert>
					NOTE-For <strong>ABSENT</strong>,
					please define letter
					<strong> {'A'} </strong> in the marks textbox.
				</Alert>
				<div
					key='student-table'
					className={'student-marks-table' + (this.props.viewState === 'VIEW_DATA' ? ' view' : '')}>
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
											student.markrecords.map((markrecord, index) => {
												let escs = marks[index].examschedulesubjectcategories,
													content = (
														<Col md={6}
															className={escs && escs.length? 'complex' : 'simple'}>
															{
																escs && escs.length ?
																<Row>
																	<Col md={10} className='subjects-name'>
																		{
																			marks[index].subject.subjectdetails[0].name
																			+ ' - '
																			+ __(getExamType(marks[index].exam_type))
																			+ ' / '
																			+ marks[index].max_mark
																		}
																	</Col>
																	<Col md={2}>
																		{
																			this.props.viewState !== 'VIEW_DATA' &&
																			<Icon
																				glyph='fa-tag'
																				title={__('Select Tag')}
																				className={'fg-brown'}
																				onClick={() => this.showTagPopup(
																					studentIndex,
																					index,
																					markrecord.tags
																				)}/>
																		}
																	</Col>
																	<Col md={12} className='sub-cat'>
																		{escs.map((esc, escIndex) => (
																			<Row key={esc.id} className='sub-cats'>
																				<Col md={6}>
																					{
																						esc.subjectcategory.subjectcategorydetails[0].name
																						+ ' / '
																						+ esc.max_marks
																					}
																				</Col>
																				<Col md={6}
																					className={this.props.errors[cursor * totalStudents + escIndex + escs.length * studentIndex] ? 'has-error' : ''}
																					key={esc.id}>
																					<FormGroup>
																						{
																							this.props.viewState !== 'VIEW_DATA'
																								? <FormControl
																									onChange={event => this.updateCategoryMark(
																										studentIndex,
																										index,
																										esc.subjectCategoryId,
																										event.target.value,
																									)}
																									type='text'
																									value={markrecord.subjectcategory_marks['s' + esc.subjectCategoryId]}/>
																								: <span>{markrecord.subjectcategory_marks['s' + esc.subjectCategoryId]}</span>
																						}
																						<HelpBlock>{errors[this.props.errors[cursor * totalStudents + escIndex + escs.length * studentIndex]]}</HelpBlock>
																					</FormGroup>
																				</Col>
																			</Row>
																		))}
																	</Col>
																</Row> :
																<Row>
																	<Col md={6} className='subjects-name'>
																		{
																			marks[index].subject.subjectdetails[0].name
																			+ ' - '
																			+ __(getExamType(marks[index].exam_type))
																			+ ' / '
																			+ marks[index].max_mark
																		}
																	</Col>
																	<Col md={6} className={this.props.errors[cursor * totalStudents + studentIndex] ? 'has-error' : ''}>
																		<FormGroup>
																			<InputGroup>
																				{
																					this.props.viewState !== 'VIEW_DATA'
																						? <FormControl
																							onChange={event => this.updateMark(
																								studentIndex,
																								index,
																								event.target.value
																							)}
																							type='text'
																							value={markrecord.obtained_mark}/>
																						: <span>{markrecord.obtained_mark}</span>

																				}
																				<InputGroup.Addon>
																					{
																						this.props.viewState !== 'VIEW_DATA' &&
																						<Icon
																							glyph='fa-tag'
																							title={__('Select Tag')}
																							onClick={() => this.showTagPopup(
																								studentIndex,
																								index,
																								markrecord.tags
																							)}/>
																					}
																				</InputGroup.Addon>
																			</InputGroup>
																			<HelpBlock>{errors[this.props.errors[cursor * totalStudents + studentIndex]]}</HelpBlock>
																		</FormGroup>
																	</Col>
																</Row>
															}
															<div className='student-subject-tags'>
																{
																	markrecord.tags && markrecord.tags.split(',').map(item => {
																		let tag = this.props.meta.tagMap[item];
																		if (!tag) return;
																		return (
																			<span key={item}>
																				{tag.tagdetails[0].title}
																				{
																					this.props.viewState !== 'VIEW_DATA' &&
																					<Icon
																						glyph='fa-times'
																						className='delete-tag'
																						onClick={() => this.removeStudentTag(
																							studentIndex,
																							index,
																							item
																						)}/>
																				}
																			</span>
																		);
																	})
																}
															</div>
														</Col>
													);
												cursor = (index + 1 === student.markrecords.length) ? 0 : (cursor + (escs && escs.length ? escs.length : 1));
												return (
													<React.Fragment key={ids[index]}>
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

	updateMark(student, markrecord, value) {
		this.props.dispatch({
			type: 'UPDATE_SUBJECT_MARK',
			student,
			markrecord,
			value
		});
	}

	updateCategoryMark(student, markrecord, escId, value) {
		this.props.dispatch({
			type: 'UPDATE_SUBJECT_CATEGORY_MARK',
			student,
			markrecord,
			escId,
			value,
		});
	}
}

function getMarkError(_mark, max) {
	let mark = _mark;
	if (mark.constructor === String && !(mark.trim()))
		return 1;
	else if (mark === 'A')
		return 0;
	else if (isNaN(mark = Number(mark)) || mark < 0)
		return 2;
	else if (mark > max)
		return 3;
	else
		return 0;
}

function sumCategoryMarks(subjectcategory_marks) {
	let sum = 0;
	for(let k in subjectcategory_marks) {
		if (subjectcategory_marks[k] === 'A')
			return null;
		sum += parseFloat(subjectcategory_marks[k]);
	}
	return sum;
}

function getDatabaseMark(markrecord) {
	if (markrecord.subjectcategory_marks) {
		let sum = sumCategoryMarks(markrecord.subjectcategory_marks);
		return {
			obtained_mark: sum,
			subjectcategory_marks: sum === null ? null : JSON.stringify(markrecord.subjectcategory_marks),
		};
	} else if (markrecord === 'A') {
		return {
			obtained_mark: null,
			subjectcategory_marks: null,
		};
	} else {
		return {
			obtained_mark: parseFloat(markrecord.obtained_mark),
			subjectcategory_marks: null,
		};
	}
}
