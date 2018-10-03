import React from 'react';
import {connect} from 'react-redux';

import {messenger} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/greensheet';
import * as actions from '../redux/actions/greensheet';
addView('greensheet', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Alert,
	Chart,
	Button,
	Select,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	lang: state.lang,
	...state.view.state,
}))
export default class Greensheet extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	updateClass = event => this.props.dispatch(
		actions.updateClass(
			this.props,
			event.currentTarget.value,
		)
	);
	updateSubject = event => this.props.dispatch({
		type: 'UPDATE_GST_SUBJECT',
		subject: event.currentTarget.value,
		exams: actions.getExamGraphData(
			this.props.meta.students,
			this.props.meta.subjects[event.currentTarget.value]
		)
	});

	exportExcel = () => {
		if (this.props.meta.marks && this.props.meta.marks.length === 0) {
			messenger.post({
				type: 'error',
				message: window.__('No marks found'),
			});
			return;
		}
		this.props.dispatch(actions.exportExcel(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let loadingMarks = this.props.meta.marks === null,
			marks = this.props.meta.marks;
		return (
			<View>
				<Row>
					<Col md={3}>
						<FormGroup>
							<ControlLabel><Text>Select Class</Text></ControlLabel>
							<Select
								name='bcsMapId'
								clearable={false}
								disabled={loadingMarks}
								onChange={this.updateClass}
								options={this.props.meta.bcsmaps}
								value={this.props.selector.bcsMapId}/>
						</FormGroup>
					</Col>
					{
						!loadingMarks && marks &&
						<React.Fragment>
							<Col md={7} className='text-right'>
								<FormGroup>
									<ControlLabel className='invisible'></ControlLabel>
									<p className='form-control-static'>
										<Text>Class Teacher</Text>
										{' : '}
										{this.props.meta.timetable.teacher.user.userdetails[0].fullname}
									</p>
								</FormGroup>
							</Col>
							<Col md={2} className='text-right'>
								<FormGroup>
									<ControlLabel className='invisible'>H</ControlLabel>
									<div>
										<Button
											bsStyle='primary'
											onClick={this.exportExcel}>
											<Text>Export Excel</Text>
										</Button>
									</div>
								</FormGroup>
							</Col>
						</React.Fragment>
					}
				</Row>
				{loadingMarks && <Loading/>}
				{
					marks && marks.length === 0 &&
					<Alert bsStyle='warning'>
						<Text>No marks found</Text>
					</Alert>
				}
				{
					marks && this.props.meta.students.length === 0 &&
					<Alert bsStyle='warning'>
						<Text>No students found</Text>
					</Alert>
				}
				{
					marks && marks.length !== 0 && this.props.meta.students.length !== 0 &&
					<React.Fragment>
						<Row>
							{
								this.props.chart.grades &&
								<Col md={7}>
									<h4 className='text-primary'><Text>Grade wise Statistics</Text></h4>
									<Chart options={this.props.chart.grades}/>
								</Col>
							}
							{
								this.props.chart.merit &&
								<Col md={5}>
									<h4 className='text-primary'>
										<Text>Class Toppers</Text>
									</h4>
									<Chart options={this.props.chart.merit}/>
								</Col>
							}
						</Row>
						<br/>
						{
							this.props.chart.exams &&
							<React.Fragment>
								<Row>
									<Col md={4}>
										<h4 className='text-primary'>
											<Text>{'Student\'s Marks & Grades Examwise'}</Text>
										</h4>
									</Col>
									<Col md={3}>
										<Select
											clearable={false}
											onChange={this.updateSubject}
											value={this.props.meta.subject}
											options={this.props.meta.subjects}/>
									</Col>
								</Row>
								<Chart options={this.props.chart.exams}/>
							</React.Fragment>
						}
						{
							this.props.chart.attendance &&
							<React.Fragment>
								<h4 className='text-primary'><Text>{'Student\'s Total Attendance'}</Text></h4>
								<Chart options={this.props.chart.attendance}/>
							</React.Fragment>
						}
					</React.Fragment>
				}
			</View>
		);
	}
}
