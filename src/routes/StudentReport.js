import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	messenger,
} from '../utils';
import {
	getGender,
	getResCategory,
} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentreport';
import * as actions from '../redux/actions/studentreport';
addView('studentreport', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Alert,
	Table,
	Select,
	Button,
	Loading,
	FormGroup,
	FormControl,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class StudentReport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_STR_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value
	});

	load = () => {
		let {bcsMapId} = this.props.selector;
		if (bcsMapId === null)
			return messenger.post({
				type: 'error',
				message: window.__('Please select class'),
			});
		this.props.dispatch(actions.load(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code,
		);
		return (
			<View>
				<Row key='selector'>
					<Col md={6}>
						<ControlLabel><Text>Class</Text></ControlLabel>
						<FormGroup>
							<Select
								name='bcsMapId'
								onChange={this.update}
								options={this.props.meta.bcsmaps}
								value={this.props.selector.bcsMapId}/>
						</FormGroup>
					</Col>
					<Col xs={12} md={6}>
						<ControlLabel><Text>Category</Text></ControlLabel>
						<FormGroup>
							<Select
								name='res_category'
								onChange={this.update}
								options={getResCategory(__)}
								value={this.props.selector.res_category}/>
						</FormGroup>
					</Col>
					<Col xs={12} md={6}>
						<ControlLabel><Text>Gender</Text></ControlLabel>
						<FormGroup>
							<Select
								name='gender'
								onChange={this.update}
								options={getGender(__)}
								value={this.props.selector.gender}/>
						</FormGroup>
					</Col>
					<Col xs={12} md={6}>
						<ControlLabel><Text>Religion</Text></ControlLabel>
						<FormGroup>
							<FormControl
								name='religion'
								onChange={this.update}
								value={this.props.selector.religion}/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup className='hidden-print'>
					<Button
						bsStyle='primary'
						onClick={this.load}>
						<Text>View</Text>
					</Button>
				</FormGroup>
				<Report/>
			</View>
		);
	}
}


@connect(state => ({
	students: state.view.state.students,
}))
class Report extends React.Component {
	render() {
		let {students} = this.props;
		if (students === false) return null;
		if (students === null) return <Loading/>;
		if (students.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>No student found</Text>
				</Alert>
			);
		return (
			<React.Fragment>
				<Row>
					<Col xs={12} className='text-right'>
						<Text options={{num: students.length}}>Total Students: [[num]]</Text>
					</Col>
				</Row>
				<Table bordered condensed responsive striped>
					<tbody>
						<tr key='heading'>
							<td><Text>S.No.</Text></td>
							<td><Text>Enrollment No</Text></td>
							<td><Text>Student Name</Text></td>
							<td><Text>{'Father\'s Name'}</Text></td>
							<td><Text>Category</Text></td>
							<td><Text>Gender</Text></td>
							<td><Text>Religion</Text></td>
						</tr>
						{
							students.map((student, index) => (
								<tr key={student.id}>
									<td>{index + 1}</td>
									<td>{student.enrollment_no}</td>
									<td>{student.user.userdetails[0].fullname}</td>
									<td>{student.studentdetails[0].father_name}</td>
									<td>{student.res_category || '-'}</td>
									<td>{student.gender}</td>
									<td>{student.studentdetails[0].religion || '-'}</td>
								</tr>
							))
						}
					</tbody>
				</Table>
				<Button
					bsStyle='primary'
					onClick={window.print}
					className='hidden-print'>
					<Text>Print</Text>
				</Button>
			</React.Fragment>
		);
	}
}