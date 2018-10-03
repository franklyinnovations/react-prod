import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';
import {bcsName, getColumnColor} from '../utils';

import {
	Col,
	Row,
	Icon,
	Text,
	View,
	Label,
	Modal,
	Alert,
	Table,
	Button,
	Loading,
	DateView,
	FormGroup,
	HelpBlock,
	Datepicker,
	FormControl,
	ControlLabel,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentdashboard';
import * as actions from '../redux/actions/studentdashboard';
addView('studentdashboard', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class TeacherDashboard extends React.Component {

	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View className='teacher-dashboard'>
				<Row>
					<Col md={6}>
						<Todo dispatch={this.props.dispatch} __={__} todo={this.props.todo}/>
					</Col>
					<Col md={6}>
						<Classes classes={this.props.classes}/>
					</Col>
					<Col md={4}>
						<Leaves leaves={this.props.leaves}/>
					</Col>
					<Col md={4}>
						<Events events={this.props.events}/>
					</Col>
					<Col md={4}>
						<Circulars circulars={this.props.circulars}/>
					</Col>
					<Col md={6}>
						<Exams exams={this.props.exams}/>
					</Col>
					<Col md={6}>
						<Assignments assignments={this.props.assignments}/>
					</Col>
				</Row>
			</View>
		);
	}

	componentDidMount() {
		this.props.dispatch(actions.loadTodo());
		this.props.dispatch(actions.loadClasses());
		this.props.dispatch(actions.loadLeaves());
		this.props.dispatch(actions.loadEvents());
		this.props.dispatch(actions.loadCirculars());
		this.props.dispatch(actions.loadExams());
		this.props.dispatch(actions.loadAssignments());
	}
}

class Todo extends React.PureComponent {
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	addTodo = () => this.props.dispatch({
		type: 'START_SDB_TODO_ADD',
		data: {
			subject: '',
			message: '',
			date: '',
		},
	});
	updateTodoItem = event => this.props.dispatch({
		type: 'UPDATE_SDB_TODO_ITEM',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	saveTodo = () => this.props.dispatch(actions.saveTodo());
	removeTodo = event => {
		this.props.dispatch(
			actions.removeTodo(
				+event.currentTarget.getAttribute('data-item-id'),
			)
		);
	};

	render() {
		let __ = this.props.__,
			{errors, item, items} = this.props.todo;
		return (
			<React.Fragment>
				<Modal show={!!item} onHide={this.hideDataModal}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Add To Do</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{
							item &&
							<React.Fragment>
								<FormGroup validationState={errors.subject ? 'error' : null}>
									<ControlLabel><Text>Subject</Text></ControlLabel>
									<FormControl
										name='subject'
										value={item.subject}
										placeholder={__('Subject')}
										onChange={this.updateTodoItem}/>
									<HelpBlock>{errors.subject}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={errors.message ? 'error' : null}>
									<ControlLabel><Text>Message</Text></ControlLabel>
									<FormControl
										rows='4'
										name='message'
										value={item.message}
										componentClass='textarea'
										placeholder={__('Message')}
										onChange={this.updateTodoItem}/>
									<HelpBlock>{errors.message}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={errors.date ? 'error' : null}>
									<ControlLabel><Text>Date</Text></ControlLabel>
									<Datepicker
										time
										name='date'
										value={item.date}
										placeholder={__('Date')}
										datepicker={{
											minDate: new Date,
										}}
										onChange={this.updateTodoItem}/>
									<HelpBlock>{errors.date}</HelpBlock>
								</FormGroup>
							</React.Fragment>
						}
						<div className='text-right'>
							<Button onClick={this.saveTodo}>
								<Text>Add</Text>
							</Button>
						</div>
					</Modal.Body>
				</Modal>
				<div className='card'>
					<div className='card-heading'>
						<Text>To Do</Text>
						&nbsp;&nbsp;
						<Icon
							title={__('Add')}
							glyph='fa-plus-square'
							onClick={this.addTodo}
							className='text-primary'/>
						{
							items &&
							<span className='pull-right badge'>
								{items.length}&nbsp;<Text>To Do</Text>
							</span>
						}
					</div>
					{
						items && items.length === 0 &&
						<div className='first-message'>
							<Row className='text-center'>
								<Col mdOffset={3} md={6}>
									<h3><Text>To Do</Text></h3>
									<p>
										<Text>Manage a To Do list for your most important tasks.</Text>
									</p>
								</Col>
							</Row>
							<div className='text-center'>
								<Button bsStyle='primary' onClick={this.addTodo}>
									<Text>Add To Do</Text>
								</Button>
							</div>
						</div>
					}
					{
						!items ? <Loading/> :
						<div className='thumbnail-container'>
							{
								this.props.todo.items.map(item => 
									<div className='todo-item' key={item.id}>
										<div>
											<b>{item.subject}</b>
										</div>
										{item.message && <p>{item.message}</p>}
										<div>
											<Icon bundle='far' glyph='fa-clock'/>
											&nbsp;&nbsp;
											<i>
												<DateView time>{item.date}</DateView>
											</i>
											<Icon
												glyph='fa-trash'
												title={__('Delete')}
												data-item-id={item.id}
												onClick={this.removeTodo}
												className='text-primary pull-right'/>
										</div>
									</div>
								)
							}
						</div>
					}
				</div>
			</React.Fragment>
		);
	}
}

class Classes extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>{'Today\'s Classes'}</Text>
					{
						this.props.classes &&
						<span className='pull-right badge'>
							{this.countClasses()}&nbsp;<Text>Class</Text>
						</span>
					}
				</div>
				{this.renderClasses()}
			</div>
		);
	}

	countClasses() {
		return this.props.classes.reduce(
			(total, item) => total += item.timetableallocations.length, 0
		);
	}

	renderClasses() {
		if (!this.props.classes) return <Loading/>;
		if (this.props.classes.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<div className='thumbnail-container'>
				{
					this.props.classes.map(item =>
						<React.Fragment key={item.id}>
							{
								item.timetableallocations.map(tta =>
									<div key={tta.id} style={{background: getColumnColor(), color: '#fff'}}>
										<div><strong>{bcsName(item.bcsmap)}</strong></div>
										<div>
											<Icon bundle='far' glyph='fa-clock'/>
											&nbsp;&nbsp;
											{tta.time}
										</div>
										<div>
											<Icon glyph='fa-book'/>
											&nbsp;&nbsp;
											{tta.subject.subjectdetails[0].name}
											,&nbsp;
											<Text>Period</Text> {tta.period}
										</div>
										<div>
											<Icon glyph='fa-user'/>
											&nbsp;&nbsp;
											{tta.teacher.user.userdetails[0].fullname}
										</div>
									</div>
								)
							}
						</React.Fragment>
					)
				}
			</div>
		);
	}
}

class Leaves extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>My Upcoming Leaves</Text>
					{
						this.props.leaves &&
						<span className='pull-right badge'>
							{this.props.leaves.length}
							&nbsp;
							<Text>Leave</Text>
						</span>
					}
				</div>
				{this.renderLeaves()}
			</div>
		);
	}

	renderLeaves() {
		if (this.props.leaves === null) return <Loading/>;
		if (this.props.leaves.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<Table striped>
				<thead>
					<tr>
						<td><Text>Start Date</Text></td>
						<td><Text>Duration</Text></td>
						<td><Text>Status</Text></td>
					</tr>
				</thead>
				<tbody>
					{
						this.props.leaves.map((item, index) =>
							<tr key={index}>
								<td>
									<DateView>{item.start_date}</DateView>
								</td>
								<td>
									{item.duration}
									&nbsp;
									<Text>Days</Text>
								</td>
								<td>{Leaves.statusLabel(item.leavestatus)}</td>
							</tr>
						)
					}
				</tbody>
			</Table>
		);
	}

	static statusLabel(status) {
		switch (status) {
			case 0:
				return <Label bsStyle='warning'><Text>Pending</Text></Label>;
			case 1:
				return <Label bsStyle='success'><Text>Approved</Text></Label>;
			case 2:
				return <Label bsStyle='danger'><Text>Cancelled</Text></Label>;
			case 3:
				return <Label bsStyle='danger'><Text>Rejected</Text></Label>;
		}
	}
}

class Events extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>Upcoming Events</Text>
					{
						this.props.events &&
						<span className='pull-right badge'>
							{this.props.events.length}
							&nbsp;
							<Text>Event</Text>
						</span>
					}
				</div>
				{this.renderEvents()}
			</div>
		);
	}

	renderEvents() {
		if (this.props.events === null) return <Loading/>;
		if (this.props.events.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<div className='thumbnail-container'>
				{
					this.props.events.map((item, index) =>
						<div key={index}>
							<div>
								<Icon glyph='fa-bell'/>
								&nbsp;
								&nbsp;
								{item.eventdetails[0].title}
							</div>
							<div>
								<Icon bundle='far' glyph='fa-clock'/>
								&nbsp;
								&nbsp;
								<DateView time>{item.start}</DateView>
							</div>
						</div>
					)
				}
			</div>
		);
	}
}

class Circulars extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>Upcoming Circulars</Text>
					{
						this.props.circulars &&
						<span className='pull-right badge'>
							{this.props.circulars.length}
							&nbsp;
							<Text>Circular</Text>
						</span>
					}
				</div>
				{this.renderCirculars()}
			</div>
		);
	}

	renderCirculars() {
		if (this.props.circulars === null) return <Loading/>;
		if (this.props.circulars.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<div className='thumbnail-container'>
				{
					this.props.circulars.map((item, index) =>
						<div key={index}>
							<div>
								<Icon glyph='fa-bell'/>
								&nbsp;
								&nbsp;
								{item.circulardetails[0].title}
							</div>
							<div>
								<Icon bundle='far' glyph='fa-clock'/>
								&nbsp;
								&nbsp;
								<DateView time>{item.date}</DateView>
							</div>
						</div>
					)
				}
			</div>
		);
	}
}

class Exams extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>Upcoming Exams</Text>
					{
						this.props.exams &&
						<span className='pull-right badge'>
							{this.props.exams.length}
							&nbsp;
							<Text>Exam</Text>
						</span>
					}
				</div>
				{this.renderExams()}
			</div>
		);
	}

	renderExams() {
		if (this.props.exams === null) return <Loading/>;
		if (this.props.exams.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<Table striped>
				<thead>
					<tr>
						<td><Text>Exam Name</Text></td>
						<td><Text>Class</Text></td>
						<td><Text>Date</Text></td>
						<td><Text>Time</Text></td>
						<td><Text>Subject</Text></td>
					</tr>
				</thead>
				<tbody>
					{
						this.props.exams.map((item, index) =>
							<tr key={index}>
								<td>{item.examschedule.examhead.examheaddetails[0].name}</td>
								<td>
									{
										item.examschedule.board.boarddetails[0].alias + '-' 
										+ item.examschedule.class.classesdetails[0].name
									}
								</td>
								<td><DateView>{item.date}</DateView></td>
								<td>{item.start_time} {' - '} {item.end_time}</td>
								<td>{item.subject.subjectdetails[0].name}</td>
							</tr>
						)
					}
				</tbody>
			</Table>
		);
	}
}

class Assignments extends React.PureComponent {
	render() {
		return (
			<div className='card'>
				<div className='card-heading'>
					<Text>Upcoming Assignments</Text>
					{
						this.props.assignments &&
						<span className='pull-right badge'>
							{this.props.assignments.length}
							&nbsp;
							<Text>Assignment</Text>
						</span>
					}
				</div>
				{this.renderAssignments()}
			</div>
		);
	}

	renderAssignments() {
		if (this.props.assignments === null) return <Loading/>;
		if (this.props.assignments.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No record found.</Text>
				</Alert>
			);
		return (
			<Table striped>
				<thead>
					<tr>
						<td><Text>Title</Text></td>
						<td><Text>Subject</Text></td>
						<td><Text>Class</Text></td>
						<td><Text>Date</Text></td>
						<td><Text>Status</Text></td>
					</tr>
				</thead>
				<tbody>
					{
						this.props.assignments.map((item, index) =>
							<tr key={index}>
								<td>
									{item.assignmentdetails[0].title}
								</td>
								<td>{item.subject.subjectdetails[0].name}</td>
								<td>{bcsName(item.bcsmap)}</td>
								<td>
									<DateView>{item.start_date}</DateView>
								</td>
								<td>
									{Assignments.statusLabel(item.assignment_status)}
								</td>
							</tr>
						)
					}
				</tbody>
			</Table>
		);
	}

	static statusLabel(status) {
		switch (status) {
			case 'Draft':
				return <Label bsStyle="primary"><Text>Draft</Text></Label>;
			case 'Published':
				return <Label bsStyle="success"><Text>Published</Text></Label>;
			case 'Canceled':
				return <Label bsStyle="danger"><Text>Cancelled</Text></Label>;
			case 'Completed':
				return <Label bsStyle="warning"><Text>Completed</Text></Label>;
		}
	}
}