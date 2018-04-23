import React from 'react';
import {connect} from 'react-redux';
import url from 'url';
import moment from 'moment';
import actions from '../redux/actions';
import makeTranslater from '../translate';
import {imageUrl} from '../../api/config';
import {
	createTimeString,
} from '../utils';
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
	FormControl,
} from '@sketchpixy/rubix';
import Loading from '../components/Loading';
import ServiceImage from '../components/ServiceImage';
import Pagination from '../components/Pagination';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.chatconsult,
}))
export default class ChatConsult extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.chatconsult.init(store.getState()));
	}

	update = event => this.props.dispatch({
		name: event.target.name,
		value: event.target.value,
		type: event.target.getAttribute('data-action-type'),
	});

	viewChatconsult = event => this.props.dispatch(
		actions.chatconsult.viewChatconsult(
			this.props,
			+(event.target.getAttribute('data-item-id'))
		)
	);
	closeChatconsult = event => this.props.dispatch({
		type: 'CLOSE_CHAT_CONSULT_VIEW',
	});
	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};
	search = () => this.props.router.push('/admin/chat-consult');
	reset = () => {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/chat-consult');
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
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
											<h3>{__('Chat consults')}</h3>
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
														<th>{__('Consult ID')}</th>
														<th>{__('Doctor ID')}</th>
														<th>{__('Doctor Name')}</th>
														<th>{__('Patient Name')}</th>
														<th>{__('Charges')}</th>
														<th>{__('Start Date')}</th>
														<th>{__('End Date')}</th>
														<th>{__('Actions')}</th>
													</tr>
													<tr>
														<td/>
														<td/>
														<td/>
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
																onChange={this.makeFilter('chatconsult__name')}
																value={this.props.filter.chatconsult__name || ''}
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
													{this.props.items.length === 0 && ChatConsult.renderNoDataRow(__)}
												</tbody>
											</Table>
										</Col>
										<Col xs={12}>
											<Pagination
												data={this.props.pageInfo}
												onSelect={this.changePage}/>
										</Col>
									</Row>
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
				<Modal show={this.props.item !== false} onHide={this.closeChatconsult}>
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
											      	<ServiceImage
											      		src={`${imageUrl}/${this.props.item.doctorprofile.doctor_profile_pic}`}
											      		style={{height: '74px', width: '74px'}}/>
											</div>
											<div className="chat-title">
											  {this.props.item.doctorprofile.doctorprofiledetails[0].name}
											</div>
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
											        <ServiceImage 
											        	src={`${imageUrl}/${this.props.item.patient.user.user_image}`}
											        	style={{height: '74px', width: '74px'}}/>
											    </div>
											    <div className="chat-title">{this.props.item.name}</div>
												<div className="chat-id-phone">
													<Icon glyph='icon-fontello-mobile' style={{padding: 0}}/>
													{' '}
													{this.props.item.contact}
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
									<Col xs={2}>
										<img src="/imgs/common/question.png" width="50"/>
									</Col>
									<Col xs={10}>
										<h2>{this.props.item.title}</h2>
										<h3>{this.props.item.tag.tagdetails[0].title}</h3>
										<h3>{
											__('{{gender}}, {{age}} year', {
												gender: this.props.item .gender === 0 ? 'Male' : 'Female',
												age: this.props.item.age
											})
										}</h3>
										<p>{this.props.item.description}</p>
									</Col>									
									</Row>
								</Grid>								
								<Grid className="chat-problem">
								  <Row>
									<Col xs={6}>{__('Charges')}</Col>
									<Col className='text-right' xs={6}>
									   <span>{__('Consult ID :')}{this.props.item.id}</span>
									 </Col>
									</Row>
								</Grid>
								<Grid className="chat-footer">	
								<Row>
									<Col xs={12}>
									   <h4>{__('Consult Date:')}
									   <span>{moment(this.props.item.createdAt).format('DD/MM/YYYY')}</span> </h4>
									</Col>
									<Col xs={12}>
									  <h4>
									     {__('Consult Closed Date:')}
								    	 <span>{moment(this.props.item.createdAt).add(7, 'day').format('DD/MM/YYYY')}</span> 
								    	</h4>
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
				<td colSpan='7'>{__('No record found')}</td>
			</tr>
		);
	}

	renderDataRows(__) {
		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return this.props.items.map((item, index) => (
			<tr key={item.id}>
				<td>{count + index + 1}</td>
				<td>{item.id}</td>
				<td>{item.doctorprofile.id}</td>
				<td>{item.doctorprofile.doctorprofiledetails[0].name}</td>
				<td>{item.name}</td>
				<td>250</td>
				<td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
				<td>{moment(item.createdAt).add(1, 'day').format('DD/MM/YYYY')}</td>
				<td>
					<Icon
						onClick={this.viewChatconsult}
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
}
