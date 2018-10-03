import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import makeTranslater from '../translate';

import {
	getInputValue,
	moduleActions,
	dialog,
} from '../utils';

import {
	Row,
	Col,
	Text,
	View,
	Alert,
	Button,
	FormGroup,
	ControlLabel,
	Select,
	FormControl,
	Loading,
	Table,
	Panel,
	ClickButton
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentPromotion';
import * as actions from '../redux/actions/studentPromotion';
addView('studentPromotion', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class StudentPromotion extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'assignment');

	handleUpdate = event => this.props.dispatch(
		actions.update(
			event.currentTarget.getAttribute('data-action-type'),
			event.currentTarget.name,
			getInputValue(event.currentTarget)
		)
	);

	handleStudentSelection = event => this.props.dispatch(
		actions.studentSelection(
			parseInt(event.currentTarget.value),
		)
	);

	loadStudents = () => {
		if (!this.props.selector.bcsMapId)
			return Messenger().post({
				type: 'error',
				message: window.__('Please select class'),
			});
		this.props.dispatch(
			actions.loadStudents(
				this.props,
				this.props.selector.bcsMapId
			)
		);
	};

	promote = () => {
		let {toBcsMapId} = this.props.selector;

		if (!toBcsMapId) {
			return Messenger().post({
				type: 'error',
				message: window.__('Please select class to promote student'),
			});
		}

		let students = this.props.students.reduce((students, item) => {
			if (item.selected && item.visible) {
				students.push(item.student.id);
			}
			return students;
		}, []);

		if (students.length === 0)
			return Messenger().post({
				message: window.__('Please select student to promote'),
				type: 'error',
			});

		dialog.confirm({
			message: window.__('Are you sure to promote selected students in selected class?'),
			callback: value => {
				if (value) {
					this.props.dispatch(
						actions.promote(
							this.props,
							JSON.stringify(students),
						)
					);
				}
			}
		});
	};
	addNextAcademicSession = () => this.props.router.push('/setup/academicsession');

	render() {
		if (this.props.loading) return <Loading/>;
		const __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View>
				{
					this.props.helperData.nextAcademicSession ?
					<React.Fragment>
						{this.renderSelector(__)}
						{this.renderPromotionDetails(__)}
						{this.renderStudents(__)}
					</React.Fragment> :
					<div className='first-message'>
						<Row className='text-center'>
							<Col mdOffset={3} md={6}>
								<h3><Text>Academic Session</Text></h3>
								<div>
									<Text>
										Please add next Academic Session to promote students.
									</Text>
								</div>
								<div>
									<b><Text>For Example</Text></b> - <Text>2018-2019</Text>
								</div>
							</Col>
						</Row>
						{
							this.permissions.add &&
							<ClickButton
								text='Lets Add Now'
								btnText='Add Academic Session'
								glyph='fa-plus'
								side='left'
								onClick={this.addNextAcademicSession}/>
						}
					</div>
				}
			</View>	
		);
	}

	renderSelector(__) {
		return (
			<Row>
				<Col md={3}>
					<FormGroup>
						<ControlLabel><Text>Class</Text></ControlLabel>
						<Select
							name='bcsMapId'
							placeholder={__('Select Class')}
							className='form-control'
							onChange={this.handleUpdate}
							value={this.props.selector.bcsMapId}
							data-action-type='UPDATE_SP_SELECTOR'
							options={this.props.helperData.bcsmaps}/>
					</FormGroup>
				</Col>
				<Col md={3}>
					<FormGroup>
						<ControlLabel><Text>Enrollment Number</Text></ControlLabel>
						<FormControl
							name='enrollment_no'
							placeholder={__('Enrollment Number')}
							data-action-type='UPDATE_SP_SELECTOR'
							onChange={this.handleUpdate}
							value={this.props.selector.enrollment_no}/>
					</FormGroup>
				</Col>
				<Col md={3}>
					<FormGroup>
						<ControlLabel><Text>Student Name</Text></ControlLabel>
						<FormControl
							name='fullname'
							placeholder={__('Student Name')}
							data-action-type='UPDATE_SP_SELECTOR'
							onChange={this.handleUpdate}
							value={this.props.selector.fullname}/>
					</FormGroup>
				</Col>
				<Col md={3}>
					<Button
						onClick={this.loadStudents}
						bsStyle='primary'
						style={{marginTop: 24}}>
						<Text>Go</Text>
					</Button>
				</Col>
			</Row>
		);
	}

	renderPromotionDetails(__) {
		if (!this.props.students || this.props.students.length === 0) return null;
		return (
			<Panel>
				<Panel.Heading>
					{__('Next Session - ' + this.props.helperData.nextAcademicSession.academicsessiondetails[0].name)}
				</Panel.Heading>
				<Panel.Body>
					<Row>
						<Col md={3}>
							<FormGroup>
								<ControlLabel><Text>Class</Text></ControlLabel>
								<Select
									name='toBcsMapId'
									placeholder={__('Select Class')}
									data-action-type='UPDATE_SP_SELECTOR'
									onChange={this.handleUpdate}
									value={this.props.selector.toBcsMapId}
									options={this.props.helperData.toBcsmaps}
									className='form-control'/>
							</FormGroup>
						</Col>
						<Col md={2}>
							<Button
								onClick={this.promote}
								bsStyle='primary'
								style={{marginTop: 24}}>
								<Text>Promote</Text>
							</Button>
						</Col>
					</Row>
				</Panel.Body>
			</Panel>
		);
	}

	renderStudents() {
		if (this.props.students === false) return null;
		if (this.props.students === null) return <Loading/>;
		let count = 0,
			students = this.props.students.map((item, index) => (
				item.visible && ++count &&
				<tr key={item.id}>
					<td className='tw-5'>
						<input
							checked={item.selected}
							onChange={this.handleStudentSelection}
							type='checkbox'
							value={index}/>
					</td>
					<td className='tw-5'>{count}</td>
					<td className='tw-20'>{item.student.enrollment_no}</td>
					<td className='tw-25'>{item.student.user.userdetails[0].fullname}</td>
					<td className='tw-25'>{item.student.studentdetails[0].father_name}</td>
					<td className='tw-20'>{item.student.user.mobile}</td>
				</tr>
			));
		if (count === 0) 
			return (
				<Alert bsStyle='warning'>
					<Text>No record found</Text>
				</Alert>
			);
		return (
			<Panel>
				<Panel.Heading>
					<Text>Student List</Text>
				</Panel.Heading>
				<Panel.Body>
					<Row>
						<Col xs={12}>
							<Table condensed striped>
								<thead>
									<tr>
										<th className='tw-5'>
											<input
												checked={this.props.selector.all}
												onChange={this.handleUpdate}
												data-action-type='SP_CHANGE_ALL_SELECTIONS'
												type="checkbox"/>
										</th>
										<th className='tw-5'><Text>S.No.</Text></th>
										<th className='tw-20'><Text>Enrollment Number</Text></th>
										<th className='tw-25'><Text>Student Name</Text></th>
										<th className='tw-25'><Text>Father's Name</Text></th>
										<th className='tw-20'><Text>Mobile</Text></th>
									</tr>
								</thead>
								<tbody>{students}</tbody>
							</Table>
						</Col>
					</Row>
				</Panel.Body>
			</Panel>	
		);
	}
}