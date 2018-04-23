import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import makeTranslater from '../translate';
import {makeApiData} from '../api';
import {imageUrl} from '../../api/config';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../utils';
import ReactStars from 'react-stars';


import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	Label,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	PanelTabContainer,
	Modal,
	ButtonGroup,
	Image,
	BPanel,
	Media
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'feedback';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.feedback
}))

export default class Feedback extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			displayModal: false,
			modalData: null
		}

		this.closeModal = (event) => { this.props.dispatch({ type: 'CLOSE_MODAL', data: null }) }

		this.reject = (event) => { 
			let id = event.target.getAttribute('data-id');
			if("undefined" != typeof id && '' != id) {

				vex.dialog.open({
		  			message: window.__('Are you sure you want to reject ?'),
		  			buttons: [
				        $.extend({}, vex.dialog.buttons.YES, { text: __('Yes') }),
				        $.extend({}, vex.dialog.buttons.NO, { text: __('Cancel') })
				    ],
		  			callback: (status) => {
		  				if(status) {
		  					this.props.dispatch(
								actions.feedback.handleAction(this.props, id, 'reject')
							)
		  				}
		  			}
				});
			}
		}

		this.approve = event => {
			let itemId = event.target.getAttribute('data-id');
			if(itemId)
				this.props.dispatch(actions.feedback.handleAction(this.props, itemId, 'approve'))
		}

		this.handleViewAction = event => {
			event.preventDefault();
			let id = event.target.getAttribute('data-id'), modalData;
			this.props.feedbacks.filter((item) => {if(item.id === parseInt(id)) modalData = item; })

			this.props.dispatch({ type: 'VIEW_MODAL', data: modalData });
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.feedback.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			default:
				content = this.renderList(__);
		}

		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Feedbacks')}</h3>
										</Col>
										<Col xs={8} md={2} style={{paddingTop: '9px'}}>
											
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
				<FeedbackModalView 
					isVisible={this.props.modalAction.displayModal} 
					closeModal={this.closeModal}
					approve={this.approve}
					reject={this.reject}
					disableHandlers={this.props.modalAction.disableHandlers}
					data={this.props.modalAction.data}
				/>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="feedback-list" className="social">
				<Col sm={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'6%'}>{__('S No.')}</th>
								<th>{__('Feedback')}</th>
								<th>{__('Rating')}</th>
								<th>{__('Rating for')}</th>
								<th>{__('Type')}</th>
								<th>{__('Status')}</th>
								<th>{__('Actions')}</th>
							</tr>
						</thead>
						<tbody>
							{this.props.feedbacks.length === 0 && this.getNoDataRow(__)}
							{this.props.feedbacks.map(this.getDataRow, this) }
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{text_truncate(item.feedback, 50)}</td>
				<td>{item.rating}</td>
				<td>
					{(item.doctorProfileId && item.doctorProfileId != '') ? item.doctorprofile.doctorprofiledetails[0].name : null}
					{(item.hospitalId && item.hospitalId != '') ? item.hospital.hospitaldetails[0].hospital_name : null}
				</td>
				<td>
					{item.hospitalId ? __('Hospital') : __('Doctor')}
				</td>
				<td>{::this.getApprovedStatus(item.is_approved)}</td>
				<td>
					{
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-fontello-eye'}
							onClick={this.handleViewAction}
							data-id={item.id}
							title={__('View & Approve')}
						/>
					}
				</td>
			</tr>


			
		);
	}

	getNoDataRow() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		return (
			<tr key={0}>
				<td colSpan={6} className='text-center'>{__('No record found')}</td>
			</tr>
		);
	}

	getApprovedStatus(status) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		switch(status) {
			case 0:
				return <Label bsStyle='info'>{__('Pending')}</Label>;
			case 1:
				return <Label bsStyle='success'>{__('Approved')}</Label>;
			case 2:
				return <Label bsStyle='danger'>{__('Rejected')}</Label>;
		}
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(event) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					[event.target.name]: event.target.value
				}
			})
		);
	}
}


@connect(state => ({
	translations: state.translations,
	lang: state.lang
}))
class FeedbackModalView extends React.Component {
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let data = this.props.data;
		if(data) {
			return (
	  			<Modal show={this.props.isVisible} onHide={this.props.closeModal}>
			        <Modal.Header closeButton>
			          	<Modal.Title>
			          		{__('By')} : {data.patient.user.userdetails[0].fullname} ({data.patient.user.email})
			          	</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			          	<Row>
			          		<Col sm={12}>
			          			{data.feedback}
			          		</Col>
				        </Row>
			        </Modal.Body>
			        {
			        	data.is_approved == 0 && 
			        	<Modal.Footer>
				        	{
				        		this.props.disableHandlers && 
				        		<span>{__('Processing')}...</span>
				        	}
				        	<Button bsStyle='primary' disabled={this.props.disableHandlers} data-id={data.id} onClick={this.props.approve}>{__('Approve')}</Button>
				        	<Button bsStyle='danger' disabled={this.props.disableHandlers} data-id={data.id} onClick={this.props.reject}>{__('Reject')}</Button>
				        </Modal.Footer>
			        }
			    </Modal>	
	  		)
	  	} else {
	  		return (null);
	  	}
  	}
}