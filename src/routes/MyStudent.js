import React from 'react';
import {connect} from 'react-redux';

import {messenger} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/mystudent';
import * as actions from '../redux/actions/mystudent';
addView('mystudent', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Alert,
	Panel,
	Button,
	Select,
	Loading,
	Clearfix,
	FormGroup,
	FormControl,
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
export default class MyStudent extends React.Component {
	static fetchData(store, params) {
		return store.dispatch(actions.init(store.getState(), params));
	}

	updateSelector = event => this.props.dispatch({
		type: 'UPDATE_MYS_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	loadStudents = () => {
		if (this.props.selector.bcsMapId === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please select a class'),
			});
			return;
		}
		this.props.dispatch(actions.loadStudents(this.props.location.query.date));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				<Panel>
					<Panel.Heading>
						<Panel.Title>
							<Text>My Students</Text>
						</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<Row>
							<Col md={4}>
								<FormGroup>
									<ControlLabel>
										<Text>Class</Text>
									</ControlLabel>
									<Select
										name='bcsMapId'
										onChange={this.updateSelector}
										options={this.props.meta.bcsmaps}
										value={this.props.selector.bcsMapId}/>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup>
									<ControlLabel>
										<Text>Student Name</Text>
									</ControlLabel>
									<FormControl
										name='name'
										onChange={this.updateSelector}
										value={this.props.selector.name}/>
								</FormGroup>
							</Col>
							<Col md={4}>
								<FormGroup>
									<ControlLabel>
										<Text>Enrollment No</Text>
									</ControlLabel>
									<FormControl
										name='enrollment_no'
										onChange={this.updateSelector}
										value={this.props.selector.enrollment_no}/>
								</FormGroup>
							</Col>
						</Row>
						<Button
							bsStyle='primary'
							onClick={this.loadStudents}>
							<Text>View</Text>
						</Button>
					</Panel.Body>
				</Panel>
				{this.props.students !== false && this.renderStudents()}
			</View>
		);
	}

	renderStudents() {
		if (this.props.students === null) return <Loading/>;
		if (this.props.students.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No records found.</Text>
				</Alert>
			);
		return (
			<Row>
				{
					this.props.students.map((item, index) =>
						<React.Fragment key={item.id}>
							<Col md={4}>
								<div className='card'>
									<Col xs={4}>
										<ServiceImage
											width='75'
											height='75'
											className='img-circle'
											src={item.student.user.user_image}/>
									</Col>
									<Col xs={8}>
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
								</div>
							</Col>
							{index % 3 === 2 && <Clearfix/>}
						</React.Fragment>
					)
				}
			</Row>
		);
	}
}