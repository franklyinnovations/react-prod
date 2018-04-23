import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import makeTranslater from '../../translate';
import Select from '../../components/Select';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import moment from 'moment';

import {
	Row,
	Col,
	Grid,
	Panel,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Modal,
	ButtonGroup,
	Label,
	DropdownButton,
	MenuItem,
	FormGroup,
	BPanel,
} from '@sketchpixy/rubix';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.clinicschedule,
}))
export default class ClinicSchedule extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.clinicschedule.init(store.getState()))
	}

	state = {
		hospital: this.props.session.allHospitalProfiles
			&& this.props.session.allHospitalProfiles[0],
	};

	activeSchedule = () => this.props.dispatch(
		actions.clinicschedule.activeSchedule(
			this.props,
			this.state.hospital.id
		)
	);

	changeView = url => {
		this.props.dispatch({
			type: 'RESET_FILTERS',
		})
		this.props.router.push(url);
	};

	changeHospital = hospitalId => {
		let hospitals = this.props.session.allHospitalProfiles,
			id = parseInt(hospitalId);
		for (var i = hospitals.length - 1; i >= 0; i--) {
			if (hospitals[i].id === hospitalId) {
				this.setState({hospital: hospitals[i]});
				this.props.dispatch(actions.clinicschedule.init(this.props, id));
				return;
			}
		}
	};


	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		), content;

		if (!this.state.hospital) {
			content = <h4 className='text-center'>{__('No clinics found')}</h4>;
		} else if (this.props.hospital === null) {
			content = <Loading/>;
		} else if (! this.props.hospital.active_schedule) {
			content = this.renderStartSchedule(__);
		} else {
			content = this.renderScheduleList(__);
		}

		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} className='fg-white'>
											<h3>{__('Clinic Schedule')}</h3>
										</Col>
										<Col xs={8} className='text-right'>
											<h3>
												<DropdownButton
													active
													inverse
													outlined
													pullRight
													bsStyle='default'
													onSelect={this.changeHospital}
													title={
														this.state.hospital.hospitaldetails[0].hospital_name.length  > 40 ? 
														this.state.hospital.hospitaldetails[0].hospital_name.substring(0,40)+'...':
														this.state.hospital.hospitaldetails[0].hospital_name
													}
													id='hospital-selection'>
													{
														this.props.session.allHospitalProfiles.map(
															hospital => (
																<MenuItem
																	key={hospital.id}
																	eventKey={hospital.id}>
																	{hospital.hospitaldetails[0].hospital_name}
																</MenuItem>
															)
														)
													}
												</DropdownButton>
												{' '}
												{
													!!this.props.hospital &&
													!!this.props.hospital.active_schedule &&
													<ButtonGroup style={{verticalAlign: 'top'}}>
														<Button
															onClick={() => this.changeView(this.props.location.pathname+'?view=upcoming')}
															className={`btn-inverse btn-outlined btn btn-default ${this.props.location.query.view !== 'completed' ? 'active' : ''}`}>{__('Upcoming')}</Button>
														<Button
															onClick={() => this.changeView(this.props.location.pathname+'?view=completed')}
															className={`btn-inverse btn-outlined btn btn-default ${this.props.location.query.view === 'completed' ? 'active' : ''}`}>{__('Completed')}</Button>
													</ButtonGroup>
												}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderStartSchedule(__) {
		return (
			<Row>
				<Col xs={8} xsOffset={2}>
					<p
						className='text-center'
						style={{fontSize: 18, color: 'black'}}>
						{__('Start practice online with Wikicare and reach patients online by allow booking appointment to Wikicare')}
					</p>
					<p
						className='text-center'
						style={{fontSize: 14, color: 'black'}}>
						{__('Please note once you allow booking apportionment for your clinic patient will book apportionment for your clinic doctor between doctor visiting hours clinic')}
					</p>
				</Col>
				<Col xs={12} collapseRight collapseLeft style={{backgroundColor: '#ccc', margin: '1em 0 2em'}}/>
				<Col xs={8} xsOffset={2}>
					<div
						className='text-center'
						style={{fontSize: 18, color: '#34bfd2'}}>
						{this.props.hospital.hospital_name}
					</div>
					<div
						className='text-center'
						style={{fontSize: 14, color: 'black'}}>
						{this.props.hospital.address}
					</div>
					<div className='text-center'>
						<Button
							bsStyle='primary'
							style={{
								height: '2em',
								fontSize: '1.5em',
								backgroundColor: '#35bfd2',
								border: 'none',
								margin: '2em 0 3em'
							}}
							onClick={this.activeSchedule}>
						{__('Start Schedule')}
					</Button>
					</div>
				</Col>
			</Row>
		);
	}

	renderScheduleList(__) {
		return (
			<Row>
				<Col xs={12}>
					<Row>
						<Col xs={4}>
							<FormGroup controlId="hospital_id">
								<Select
									name='hospital_id'
									placeholder={__('Select Doctor')}
									onChange={this.makeFilter("hospital_id")}
									value={this.props.filter.hospital_id}
									options={this.props.helperData.list}/>
							</FormGroup>
						</Col>
						<Col xs={4}>
							<FormGroup controlId="status_id">
								<Select
								name='status_id'
									placeholder={__('Select Status')}
									onChange={this.makeFilter("status_id")}
									value={this.props.filter.status_id}
									options={
										this.props.location.query.view === 'completed' ?
										[
											{label:__('Completed'),value:'0'},
											{label:__('Absent'),value:'4'},
											{label:__('Canceled'),value:'3'},
										] :
										[
											{label:__('Confirmed'),value:'1'},
											{label:__('Booked'),value:'2'},
										]
								   	}/>
							</FormGroup>
						</Col>
						<Col xs={4}>
							<Icon
								className={'fg-brown'}
								title={__('Edit')}
								style={{fontSize: 30,float:"left"}}
								glyph="glyphicon-search"
								onClick={this.search}/>
						</Col>
					</Row>
					{this.renderDataRows(__)}
					{this.props.items.length === 0 && this.renderNoDataRow(__)}
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={this.changePage}/>
				</Col>
			</Row>
		);
	}

	renderDataRows(__) {
		return this.props.items.map(item => (
			<BPanel key={item.id}>
				<Row>
					<Col sm={2} className='text-center'> 
						<Icon glyph="glyphicon-calendar" style={{fontSize:'60px'}}/>
							<h5 style={{marginTop: '0px'}}>{moment(item.book_date, 'YYYY/MM/DD').format('DD/MM')}</h5>
							<h6 style={{marginTop: '0px'}}>{item.from_time}</h6>
					</Col>
					<Col sm={6}>
						<h5 style={{marginTop: '0px'}}>{__('Patient Name') } : {item.patient_name}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Patient Mobile') } : {item.patient_mobile}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Patient Email') } : {item.patient_email}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Doctor Name') } : {item.doctorprofiledetail ? item.doctorprofiledetail.name : ""}</h5>
						<h5 style={{marginTop: '0px'}}>{__('Status') } : {this.getStatusIcon(item.status)}</h5>
					</Col>
				</Row>
			</BPanel>
		));
	}

	renderNoDataRow(__) {
		return <p className='text-center'>{__('No data found')}</p>
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return <Label bsStyle='success' style={{height: '20px'}}>Completed</Label>;
			case 1:
				return <Label bsStyle='success' style={{height: '20px'}}>Confirmed</Label>;
			case 2:
				return <Label bsStyle='warning' style={{height: '20px'}}>Pending</Label>;
			case 3:
				return <Label bsStyle='danger'>Canceled</Label>;
			case 4:
				return <Label bsStyle='info'>Missing</Label>;
		}
	}
}