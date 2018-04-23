import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import actions from '../redux/actions';
import makeTranslater from '../translate';
import {imageUrl} from '../../api/config';
import {
	Col,
	Row,
	Icon,
	Grid,
	Panel,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Button,
	Table,
	Modal,
	Label,
	FormControl,
} from '@sketchpixy/rubix';
import Loading from '../components/Loading';
import ServiceImage from '../components/ServiceImage';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.appointment,
}))
export default class Appointment extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.appointment.init(store.getState()));
	}

	update = event => this.props.dispatch({
		name: event.target.name,
		value: event.target.value,
		type: event.target.getAttribute('data-action-type'),
	});

	view = event => this.props.dispatch(
		actions.appointment.viewAppointment(
			this.props,
			+(event.target.getAttribute('data-item-id'))
		)
	);
	close = event => this.props.dispatch({
		type: 'CLOSE_APPOINTMENT_VIEW',
	});

	search = () => this.props.router.push('/admin/appointment');
	reset = () => {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/appointment');
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Appointments')}</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									<Row>
										<Col xs={12}>
											<Table>
												<thead>
													<tr>
														<th>{__('S No.')}</th>
														<th>{__('Hospital/Clinic')}</th>
														<th>{__('Doctor Name')}</th>
														<th>{__('Patient Name')}</th>
														<th>{__('Date')}</th>
														<th>{__('Time')}</th>
														<th>{__('Status')}</th>
														<th>{__('Actions')}</th>
													</tr>
													<tr>
														<td></td>
														<td>
															<FormControl
																type='text'
																onChange={this.makeFilter('hospitaldetail__hospital_name')}
																value={this.props.filter.hospitaldetail__hospital_name || ''}
																placeholder={__('Hospital Name')}/>
														</td>
														<td>
															<FormControl
																type='text'
																onChange={this.makeFilter('doctorprofiledetail__name')}
																value={this.props.filter.doctorprofiledetail__name || ''}
																placeholder={__('Doctor Name')}/>
														</td>
														<td>
															<FormControl
																type='text'
																onChange={this.makeFilter('myschedule__patient_name')}
																value={this.props.filter.myschedule__patient_name || ''}
																placeholder={__('Patient Name')}/>
														</td>
														<td></td>
														<td></td>
														<td></td>
														<td>
															<Icon
																className={'fg-darkcyan'}
																style={{fontSize: 20}}
																glyph={'icon-feather-search'}
																onClick={this.search}/>
															<Icon
																className={'fg-brown'}
																style={{fontSize: 20}}
																glyph={'icon-feather-reload'}
																onClick={this.reset}/>
														</td>
													</tr>
												</thead>
												<tbody>
													{this.renderDataRows(__)}
													{this.props.items.length === 0 && Appointment.renderNoDataRow(__)}
												</tbody>
											</Table>
										</Col>
									</Row>
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
				<Modal show={this.props.item !== false} onHide={this.close}>
					<Modal.Body className="chat-modal">
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Grid className="no-padding-modal">
							<Grid className="chat-header">							
								<Row>
									<Col xs={6} collapseRight>
										<Row>
											<Col xs={12} className="chat-header-detail">
											    <div className="chat-icon">
											    	<ServiceImage src={`${imageUrl}/${this.props.item.doctorprofile.doctor_profile_pic}`}/>
											    </div>												
												<div className="chat-title">{this.props.item.doctorprofile.doctorprofiledetails[0].name}</div>
												<div className="chat-city">
													{__('{{specialization}},{{experience}}', {
														specialization: this.props.item.doctorprofile.doctortags[0].tag.tagdetails[0].title,
														experience: this.props.item.doctorprofile.experience,
													})}
												</div>
											</Col>										
										</Row>
									</Col>
									<Col xs={6}>
										<Row>
											<Col xs={12} className="chat-header-detail">
											    <div className="chat-icon">
											     <ServiceImage src={`${imageUrl}/${this.props.item.patient.user.user_image}`}/>
											     </div> 
											    <div className="chat-title">{this.props.item.patient_name}</div>
												<div className="chat-id-phone">
													<Icon glyph='icon-fontello-mobile' style={{padding: 0}}/>
													{' '}
													{this.props.item.patient_mobile}
												</div>	
											</Col>										
										</Row>
									</Col>
								</Row>
							</Grid>
							   <Grid className="chat-problem">
                                   <Row>
									<Col xs={12}>
										<b>{__('Problem')}</b>
									</Col>
									</Row>
								</Grid>
								<Grid className="chat-problem-detail">
								<Row>
									<Col xs={12}>
										<Row>
											<Col xs={2}>
												<ServiceImage src={`${imageUrl}/${this.props.item.hospital.hospital_logo}`}/>
											</Col>
											<Col xs={10}>
												<h2>{this.props.item.hospital.hospitaldetails[0].hospital_name}</h2>
												<h3>{this.props.item.hospital.hospitaldetails[0].address}</h3>												
											</Col>
										</Row>
									</Col>
								</Row>
								</Grid>
								<Grid className="chat-problem">
								  <Row>
									<Col xs={12}>{__('Details')}</Col>									
									</Row>
								</Grid>
								<Grid className="chat-footer">	
								<Row>
								   <Col xs={2}>
									   <h4>{__('Time')}
									   </h4>
									   
									</Col>
									<Col xs={10}>
									 <h4>
									   <span>{moment(this.props.item.date).format('YYYY/MM/DD')}
										{' '}
										{this.props.item.from_time}</span> </h4>
									 </Col>									
									<Col xs={2}>
									   <h4>{__('Status')}</h4>
									   
									</Col>
									<Col xs={10}>
										{Appointment.getStatusIcon(this.props.item, __)} 
									</Col>
								</Row>
								</Grid>
							</Grid>
						}
					</Modal.Body>
				</Modal>
			</Row>
		);
	}

	static renderNoDataRow(__) {
		return (
			<tr className='text-center'>
				<td colSpan='9'>{__('No record found')}</td>
			</tr>
		);
	}

	renderDataRows(__) {
		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return this.props.items.map((item, index) => (
			<tr key={item.id}>
				<td>{count + index + 1}</td>
				<td>{item.hospital.hospitaldetails[0].hospital_name}</td>
				<td>{item.doctorprofile.doctorprofiledetails[0].name}</td>
				<td>{item.patient_name}</td>
				<td>{moment(item.book_date).format('DD/MM/YYYY')}</td>
				<td>{item.from_time}</td>
				<td>{Appointment.getStatusIcon(item, __)}</td>
				<td>
					<Icon
						onClick={this.view}
						data-item-id={item.id}
						glyph='icon-simple-line-icons-eye'
						style={{fontSize: 20}}/>
				</td>
			</tr>
		));
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

	static getStatusIcon(item, __) {
		switch(item.status) {
			case 0:
				return <Label bsStyle='success' style={{height: '20px'}}>{__('Completed')}</Label>;
			case 1:
				return <Label bsStyle='success' style={{height: '20px'}}>{__('Confirmed')}</Label>;
			case 2:
				return <Label bsStyle='warning' style={{height: '20px'}}>{__('Booked')}</Label>;
			case 3:
				return <Label bsStyle='danger'>{item.status_updated_by === item.patientId ? __('Cancelled by patient') : 
				__('Cancelled by doctor')}</Label>;
			case 4:
				return <Label bsStyle='info'>{__('Absent')}</Label>;
		}
	}

}
