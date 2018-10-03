import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../redux/actions/dashboard';

import {
	Col,
	Row,
	Grid,
	Icon,
	Select,
	Loading,
	Clearfix,
	FormGroup,
} from '../components';

import makeTranslater from '../translate';
import {getInputValue} from '../utils';

let C3Chart;

@connect(state => ({
	session: state.session,
	translations: state.translations,
	loading: state.view.loading || false,
	lang: state.lang,
	...state.view.state,
}))
export default class Dashboard extends React.Component {
	static fetchData(store) {
		return store.dispatch(
			actions.init(store.getState())
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code,
		);

		let tiles;
		if (this.props.session.masterId === 1) {
			tiles = null;
		} else {
			switch (this.props.session.user_type) {
				case 'institute':
				case 'admin':
					tiles = (
						<Row className='dashboard-tiles'>
							<Tile
								title={__('TOTAL TEACHERS')}
								value={this.props.info.teachers}
								color='#00B8EB'
								icon='fa-users'/>
							<Tile
								title={__('TOTAL STUDENTS')}
								value={this.props.info.students}
								color='#ffba03'
								icon='fa-user'/>
							<Tile
								title={__('TOTAL CLASSES')}
								value={this.props.info.classes}
								color='#3ac6ac'
								icon={'fa-archive'}/>
							<Tile
								title={__('TOTAL VEHICLE')}
								value={this.props.info.vehicles}
								color='#babeca'
								icon={'fa-bus'}/>
							<Tile
								title={__('ABSENT TEACHERS')}
								value={this.props.info.absentTeachers}
								color='#54b997'
								icon={'fa-users'}/>
							<Tile
								title={__('PRESENT STUDENTS')}
								value={this.props.info.presentStudents}
								color='#ab4f45'
								icon={'fa-users'}/>
							<Tile
								title={__('SUPPORT TICKETS')}
								value={this.props.info.tickets}
								color='#3ac6ac'
								icon={'fa-file'}/>
							<TileFee
								title={__('MONTHLY DUE FEE')}
								value={this.props.info.due_fee}
								color='white'
								backgroundColor="#3ac6ac"/>
							<TileFee
								title={__('FEE COLLECTION')}
								value={this.props.info.pay_fee}
								color='white'
								backgroundColor="#3ac6ac"/>			
						</Row>
					);
					break;
				default:
					tiles = null;
			}
		}
		return (
			<Grid fluid>
				{tiles}
				<Graphs __={__}/>
			</Grid>
		);
	}
}

function Tile({color, icon, value, title}) {
	return (
		<Col xs={12} sm={4} md={6} lg={2} style={{color}}>
			<div>
				<Col xs={4}>
					<Icon
						glyph={icon}
						style={{borderColor: color, backgroundColor: color + '21'}}/>
				</Col>
				<Col xs={8}>
					<div className='tile-value'>{value}</div>
				</Col>
				<Col xs={12}>
					<hr style={{backgroundColor: color}}/>
				</Col>
				<Col xs={12} className='tile-title'>
					{title}
				</Col>
				<Clearfix/>
			</div>
		</Col>
	);
}


function TileFee({color, icon, value, title, backgroundColor}) {
	return (
		<Col xs={12} sm={3} md={3} lg={2} style={{color}}>
			<div style={{backgroundColor:"#3ac6ac",color:"white"}}>
				<Col xs={12}>
					<div className='tile-value' style={{textAlign:"center"}}>{value}</div>
				</Col>
				<Col xs={12}>
					<hr style={{backgroundColor: color}}/>
				</Col>
				<Col xs={12} className='tile-title'>
					{title}
				</Col>
				<Clearfix/>
			</div>
		</Col>
	);
}


@connect(state => ({
	session: state.session,
	lang: state.lang,
	...state.view.state,
}))
class Graphs extends React.Component {

	formatMarksLabel = index => {
		let mark = this.props.graphs.marks.json[index];
		return mark ? mark.name : '';
	};

	formatAttendancesLabel = index => {
		let attendance = this.props.graphs.attendances.json[index];
		return attendance ? attendance.name : '';
	};

	updateAssignments = event => {
		this.props.dispatch(
			actions.updateAssignments(
				this.props,
				event.target.name,
				getInputValue(event.target)
			)
		);
	};

	updateAttendance = event => {
		this.props.dispatch(
			actions.updateAttendance(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	updateMarks = event => {
		this.props.dispatch(
			actions.updateMarks(
				this.props,
				event.target.name,
				getInputValue(event.target),
			)
		);
	};

	componentDidMount() {
		import('react-c3js')
			.then(c3Chart => {
				C3Chart = c3Chart.default;
				return this.props.dispatch(actions.loadGraphs(this.props));
			})
			.then(() => setTimeout(() => window.dispatchEvent(new Event('resize')), 300));
	}

	render() {
		const __ = this.props.__, user_type = this.props.session.user_type;
		if (this.props.session.masterId === 1) return null;
		return (
			<Row className='dashboard-graphs'>
				<Col md={6}>
					<div>
						<h4>{__('Attendance')}</h4>
						<FormGroup>
							<Select
								placeholder={__('Please select class')}
								name='bcsMapIdAttendance'
								value={this.props.helperData.bcsMapIdAttendance}
								options={this.props.helperData.bcsmaps}
								onChange={this.updateAttendance}
								className='form-control'/>
						</FormGroup>
						<FormGroup>
							<Select
								placeholder={__('Please select subject')}
								name='subjectIdAttendance'
								value={this.props.helperData.subjectIdAttendance}
								options={this.props.helperData.subjects}
								onChange={this.updateAttendance}
								className='form-control'/>
						</FormGroup>
						<hr/>
						{
							this.props.graphs.attendances ?
							<C3Chart
								style={{direction: 'ltr'}}
								axis={{
									x: {
										type: 'category',
										show: false,
										tick: {
											format: this.formatAttendancesLabel
										}
									}
								}}
								data={this.props.graphs.attendances}/> :
							<Loading/>
						}
					</div>
				</Col>
				<Col md={6}>
					<div>
						<h4>{__('Class Performance')}</h4>
						<FormGroup>
							<Select
								placeholder={__('Please select class')}
								options={this.props.helperData.bcsmaps}
								onChange={this.updateMarks}
								value={this.props.helperData.bcsMapIdMarks}
								name='bcsMapIdMarks'
								className='form-control'/>
						</FormGroup>
						<FormGroup>
							<Select
								placeholder={__('Please select subject')}
								options={this.props.helperData.subjects}
								onChange={this.updateMarks}
								value={this.props.helperData.subjectIdMarks}
								name='subjectIdMarks'
								className='form-control'/>
						</FormGroup>
						<hr/>
						{
							this.props.graphs.marks ?
							<C3Chart
								style={{direction: 'ltr'}}
								axis={{x: {type: 'category', show: false, tick: {format: this.formatMarksLabel}}}}
								data={this.props.graphs.marks}/> :
							<Loading/>
						}
					</div>
				</Col>
				<Clearfix/>
				<Col md={6}>
					<div>
						<h4>{__('Assignments')}</h4>
						<FormGroup>
							<Select
								placeholder={__('Please select class')}
								value={this.props.helperData.bcsMapIdAssignments}
								options={this.props.helperData.bcsmaps}
								onChange={this.updateAssignments}
								name='bcsMapIdAssignments'
								className='form-control'/>
						</FormGroup>
						<FormGroup>
							<Select
								placeholder={__('Please select subject')}
								options={this.props.helperData.subjects}
								onChange={this.updateAssignments}
								value={this.props.helperData.subjectIdAssignments}
								name='subjectIdAssignments'
								className='form-control'/>
						</FormGroup>
						<hr/>
						{
							this.props.graphs.assignments ?
							<C3Chart
								style={{direction: 'ltr'}}
								data={this.props.graphs.assignments}/> :
							<Loading/>
						}
					</div>
				</Col>
				{
					(user_type === 'institute' || user_type === 'admin') &&
					<Col md={6}>
						<div>
							<h4>{__('Fees')}</h4>
							{
								C3Chart && <C3Chart style={{direction: 'ltr'}} data={{
									json: (parseFloat(this.props.info.due_fee) + parseFloat(this.props.info.pay_fee) === 0) ? {} : {
										'MONTHLY DUE FEE': parseFloat(this.props.info.due_fee),
										'FEE COLLECTION': parseFloat(this.props.info.pay_fee),
									},
									type: 'pie',
									empty: {
										label: {
											text: __('No Record Found'),
										},
									},
									colors: {
										'MONTHLY DUE FEE': '#d9534f',
										'FEE COLLECTION': '#82be5a',
									},
									names: {
										'MONTHLY DUE FEE': __('MONTHLY DUE FEE'),
										'FEE COLLECTION': __('FEE COLLECTION')
									}
								}}/>
							}
						</div>
					</Col>
				}
			</Row>
		);

	}
}
