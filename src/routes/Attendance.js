import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/attendance';
import * as actions from '../redux/actions/attendance';
addView('attendance', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Form,
	Text,
	Alert,
	Panel,
	Button,
	Loading,
	Clearfix,
	FormGroup,
	ButtonGroup,
	FormControl,
	ServiceImage,
	ControlLabel,
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
export default class Attendance extends React.Component {

	static fetchData(store, params) {
		return store.dispatch(actions.init(store.getState(), params));
	}

	back = () => this.props.router.push('/student-attendance/attendance');
	selectStudentTag = event => this.props.dispatch({
		type: 'SELECT_ATT_TAGS',
		student: this.props.students[+event.currentTarget.getAttribute('data-item-index')]
	});
	setStudentTag = value => this.props.dispatch({
		type: 'SET_ATT_TAGS',
		value,
	});
	removeStudentTag = event => this.props.dispatch({
		type: 'REMOVE_ATT_TAG',
		value: event.currentTarget.getAttribute('data-item-value'),
		index: +event.currentTarget.getAttribute('data-item-index'),
	});
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	save = async () => {
		await this.props.dispatch(actions.save(
			this.props,
			new FormData(document.getElementById('att-form')),
		));
		this.back();
	};
	updateFilter = event => this.props.dispatch({
		type: 'UPDATE_ATT_FILTER',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	applyFilter = () => this.props.dispatch({
		type: 'APPLY_ATT_FILTER',
		filter: this.props.filter,
	});
	resetFilter = () => this.props.dispatch({
		type: 'RESET_ATT_FILTER',
	});

	markAll = event => {
		this.props.dispatch({
			type: 'UPDATE_ALL_STUDENT_ATT',
			value: event.currentTarget.getAttribute('data-value')
		});
	};

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View actions={
				<View.Actions>
					<View.Action onClick={this.back}>
						<Text>Back</Text>
					</View.Action>
				</View.Actions>
			}>
				{
					this.props.holiday &&
					<Alert bsStyle='warning'>
						<Text>Selected date is holiday</Text>
						&nbsp;:&nbsp;
						{this.props.holiday.holidaydetails[0].name}
					</Alert>
				}
				{this.props.students && this.renderStudents()}
			</View>
		);
	}

	updateStAtt = event => {
		this.props.dispatch({
			type: 'UPDATE_STUDENT_ATT',
			value: event.currentTarget.value,
			itemIndex: event.currentTarget.index
		});
	};

	renderStudents() {
		if (this.props.students.length === 0) {
			return (
				<Alert bsStyle='warning'>
					<Text>No Student Found.</Text>
				</Alert>
			);
		}
		let visibles = 0;
		return (
			<Form id='att-form'>
				<input type='hidden' name='id' value={this.props.attendance.id}/>
				<input type='hidden' name='date' value={this.props.attendance.date}/>
				<input type='hidden' name='period' value={this.props.attendance.period}/>
				<input type='hidden' name='bcsMapId' value={this.props.attendance.bcsMapId}/>
				<input type='hidden' name='subjectId' value={this.props.attendance.subjectId}/>
				<Panel>
					<Panel.Heading>
						<Panel.Title>
							<Text>Search By</Text>
						</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<Row>
							<Col md={3}>
								<FormGroup>
									<ControlLabel>
										<Text>Enrollment No.</Text>
									</ControlLabel>
									<FormControl
										name='enrollment_no'
										onChange={this.updateFilter}
										value={this.props.filter.enrollment_no}/>
								</FormGroup>
							</Col>
							<Col md={3}>
								<FormGroup>
									<ControlLabel>
										<Text>Name</Text>
									</ControlLabel>
									<FormControl
										name='fullname'
										onChange={this.updateFilter}
										value={this.props.filter.fullname}/>
								</FormGroup>
							</Col>
						</Row>
						<Button
							bsStyle='primary'
							onClick={this.applyFilter}>
							<Text>Go</Text>
						</Button>
						&nbsp;&nbsp;
						<Button
							bsStyle='primary'
							onClick={this.resetFilter}>
							<Text>Reset</Text>
						</Button>
					</Panel.Body>
				</Panel>
				<FormGroup>
					<div className='attendance-input text-right'>
						<span
							data-value={1}
							onClick={this.markAll}
							className='active present'>P</span>
						<label className='present'>
							-
							<Text>Present</Text>
						</label>&nbsp;&nbsp;
						<span
							data-value={2}
							onClick={this.markAll}
							className='active late'>
							L
						</span>
						<label className='late'>
							-
							<Text>Late</Text>
						</label>&nbsp;&nbsp;
						<span
							data-value={3}
							onClick={this.markAll}
							className='active absent'>
							A
						</span>
						<label className='late'>
							-
							<Text>Absent</Text>
						</label>&nbsp;&nbsp;
					</div>
				</FormGroup>
				<Row>
					{
						this.props.students.map((item, index) =>
							<React.Fragment key={item.id}>
								<Col md={6} className={item.hide ? 'hide' : (++visibles && '')}>
									{
										item.student.attendancerecord &&
										<React.Fragment>
											<input
												type='hidden'
												value={item.student.attendancerecord.id}
												name={'attendancerecord['+index+'][id]'}/>
											<input
												type='hidden'
												value={item.student.attendancerecord.attendanceId}
												name={'attendancerecord['+index+'][attendanceId]'}/>
										</React.Fragment>	
									}
									<input
										type='hidden'
										value={item.student.id}
										name={'attendancerecord['+index+'][studentId]'}/>
									<input
										type='hidden'
										value={item.tags}
										name={'attendancerecord['+index+'][tags]'}/>
									<input
										type='hidden'
										value={this.props.attendance.subjectId}
										name={'attendancerecord['+index+'][subjectId]'}/>
									<div className='card'>
										<Row>
											<Col md={2}>
												<ServiceImage
													width='75'
													height='75'
													src={item.student.user.user_image}
													className='img img-circle pull-left'/>
											</Col>
											<Col md={6}>
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
											<Col md={4} className='text-right'>
												<FormGroup>
													<Button
														bsStyle='primary'
														data-item-index={index}
														onClick={this.selectStudentTag}>
														<Text>Add Tags</Text>
													</Button>
												</FormGroup>
												<AttendanceInput
													onChange={this.updateStAtt}
													index={index}
													value={item.is_present}
													name={'attendancerecord['+index+'][is_present]'}/>
											</Col>
										</Row>
										<div className='att-tags-container'>
											{
												item.tags && item.tags.split(',').map(item =>
													this.props.tag.map[item] &&
													<ButtonGroup
														key={item}>
														<Button
															title={
																this.props.tag.map[item].tagdetails[0].description
															}>
															{this.props.tag.map[item].tagdetails[0].title}
														</Button>
														<Button
															bsStyle='danger'
															data-item-value={item}
															data-item-index={index}
															onClick={this.removeStudentTag}>
															<Icon glyph='fa-times'/>
														</Button>
													</ButtonGroup>
												)
											}
										</div>
									</div>
								</Col>
								{visibles % 2 === 0 && <Clearfix/>}
							</React.Fragment>
						)
					}
				</Row>
				<Button
					bsStyle='primary'
					onClick={this.save}
					disabled={this.props.saving}>
					<Text>Submit</Text>
				</Button>
				<TagPicker
					tags={this.props.tag.tags}
					onHide={this.hideDataModal}
					onChange={this.setStudentTag}
					selected={this.props.tag.selected}
					show={this.props.tag.student !== false}/>
			</Form>
		);
	}
}

class AttendanceInput extends React.PureComponent {

	state = {value: this.props.defaultValue || this.props.value};

	update = ({value}) => {
		this.setState({value});
		if (this.props.onChange)
			this.props.onChange({currentTarget: {value, index: this.props.index}});
	};

	render() {
		let value = this.state.value;
		return (
			<div className='attendance-input'>
				<AttendanceInputOption
					value={1}
					className='present'
					active={value === 1}
					onSelect={this.update}>
					P
				</AttendanceInputOption>
				<AttendanceInputOption
					value={2}
					className='late'
					active={value === 2}
					onSelect={this.update}>
					L
				</AttendanceInputOption>
				<AttendanceInputOption
					value={3}
					className='absent'
					active={value === 3}
					onSelect={this.update}>
					A
				</AttendanceInputOption>
				<input name={this.props.name} type='hidden' value={this.state.value}/>
			</div>
		);
	}

	componentDidUpdate() {
		if (this.props.value !== undefined && this.props.value !== this.state.value)
			this.setState({value: this.props.value});
	}
}

class AttendanceInputOption extends React.PureComponent {

	select = () => this.props.onSelect(this.props);

	render() {
		return (
			<span
				onClick={this.select}
				className={classnames(
					this.props.active && 'active',
					this.props.className,
				)}>
				{this.props.children}
			</span>
		);
	}
}