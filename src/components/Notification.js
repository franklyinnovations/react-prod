import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import actions from '../redux/actions';
import Select from './Select';
import TextEditor from './TextEditor';

export default class SendEmail extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			errors: {},
		};
	}

	closeNotificationModal(){
		this.props.state.dispatch(
			this.props.actions.closeNotificationModal()
		);
		this.setState({errors:{}});
	}

	closeNotificationModal2(){
		this.props.state.dispatch(
			this.props.actions.closeNotificationModal()
		);
		this.setState({errors:{}});
		this.props.state.dispatch(this.props.actions.updateDiscountData('feeDiscountIds', []));
	}

	submitSendEmail(){
		let errors = {};
		if($('#subject').val().trim() === ''){
			errors.subject = this.props.__('This is a required field.');
		}

		if($('#message').val().trim() === ''){
			errors.message = this.props.__('This is a required field.');
		}

		if(Object.keys(errors).length > 0){
			this.setState({
				errors:errors
			});
		}else {
			let data = new FormData(ReactDOM.findDOMNode(this.formemail));
			this.props.state.dispatch(
				this.props.actions.submitSendEmail(this.props.state, data)
			);
		}
	}

	submitDiscountl(){
		let errors = {};
		if(this.props.state.selector.feeDiscountIds.length === 0){
			errors.feeDiscountIds = this.props.__('This is a required field.');
		}
		if(Object.keys(errors).length > 0){
			this.setState({
				errors:errors
			});
		}else {
			let data = new FormData(ReactDOM.findDOMNode(this.formdiscount));
			this.props.state.dispatch(
				this.props.actions.submitDiscount(this.props.state, data)
			);
			this.setState({errors:{}});
			this.props.state.dispatch(this.props.actions.updateDiscountData('feeDiscountIds', []));
		}
	}

	submitSendSMS(){
		let errors = {};
		/*if($('#feeDiscountIds').length && $('#feeDiscountIds').val().trim() === ''){
			errors.messagesms = this.props.__('This is a required field.');
		}*/

		if($('#messagesms').val().trim() === ''){
			errors.messagesms = this.props.__('This is a required field.');
		}

		if(Object.keys(errors).length > 0){
			this.setState({
				errors:errors
			});
		}else {
			let data = new FormData(ReactDOM.findDOMNode(this.formsms));
			this.props.state.dispatch(
				this.props.actions.submitSendSMS(this.props.state, data)
			);
		}
	}

	render() {
		return (
			<div>
				<Modal show={this.props.state.notification.emailModal} onHide={::this.closeNotificationModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{this.props.__('Email Information')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form id='send_email' ref={el => this.formemail = el}>
							<input type='hidden' value={JSON.stringify(this.props.state.notification.selectedIds)} name='ids' />
							<Row>
								<Col md={12}>
									<FormGroup
										controlId='subject'
										validationState={this.state.errors.subject ? 'error': null}>
										<ControlLabel>{this.props.__('Subject')}</ControlLabel>
										<FormControl
											placeholder={this.props.__('Subject')}
											name='subject'
											id='subject'/>
										<HelpBlock>{this.state.errors.subject}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<FormGroup
										controlId='message'
										validationState={this.state.errors.message ? 'error': null}>
										<ControlLabel>{this.props.__('Message')}</ControlLabel>
										<TextEditor name='message' id='message'/>
										<HelpBlock>{this.state.errors.message}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<FormGroup
										controlId='email_attachement'>
										<ControlLabel>{this.props.__('Email Attachement')}</ControlLabel>
										<FormControl name='email_attachement' type='file'/>
									</FormGroup>
								</Col>
							</Row>
						</Form>
					</Modal.Body>
					<Modal.Footer className='text-center'>
						<div className='text-center'>
							<Button
								bsStyle='primary'
								disabled={false}
								onClick={::this.submitSendEmail}>
								{this.props.__('Send')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
				{
					this.props.state.notification.discountModal === true &&
					<Modal show={this.props.state.notification.discountModal} onHide={::this.closeNotificationModal2}>
						<Modal.Header closeButton className="text-center">
							<Modal.Title>{this.props.__('Apply Discount')}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form id='discount' ref={el => this.formdiscount = el}>
								<input type='hidden' value={JSON.stringify(this.props.state.notification.selectedIds)} name='ids' />
								<Row>
									<Col md={12}>
										<FormGroup
											controlId='subject'
											validationState={this.state.errors.feeDiscountIds ? 'error': null}>
											<ControlLabel>{this.props.__('Discount')}</ControlLabel>
											<Select
												multi
												name="feeDiscountIds"
												placeholder={this.props.__('Please Select Discount') }
												onChange={this.props.onChangeEvent}
												value={this.props.state.selector.feeDiscountIds ? this.props.state.selector.feeDiscountIds : []}
												options={this.props.state.selector ? this.props.state.selector.feediscount : []}
												className='form-control'/>
											<HelpBlock>{this.state.errors.feeDiscountIds}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
							</Form>
						</Modal.Body>
						<Modal.Footer className='text-center'>
							<div className='text-center'>
								<Button
									bsStyle='primary'
									disabled={false}
									onClick={::this.submitDiscountl}>
									{this.props.__('Send')}
								</Button>
							</div>
						</Modal.Footer>
					</Modal>
				}	
				<Modal show={this.props.state.notification.smsModal} onHide={::this.closeNotificationModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{this.props.__('SMS Information')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form id='send_sms' ref={el => this.formsms = el}>
							<input
								type='hidden'
								value={JSON.stringify(this.props.state.notification.selectedIds)}
								name='ids'/>
							<Row>
								<Col md={12}>
									<FormGroup
										validationState={this.state.errors.messagesms ? 'error': null}>
										<ControlLabel>{this.props.__('Message')}</ControlLabel>
										<FormControl
											componentClass='textarea'
											rows='4'
											placeholder={this.props.__('Message')}
											name='message'
											id='messagesms'/>
										<HelpBlock>{this.state.errors.messagesms}</HelpBlock>
									</FormGroup>
								</Col>
							</Row>
						</Form>
					</Modal.Body>
					<Modal.Footer className='text-center'>
						<div className='text-center'>
							<Button
								bsStyle='primary'
								disabled={false}
								onClick={::this.submitSendSMS}>
								{this.props.__('Send')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}