import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import View from './View';
import Text from './Text';
import TextEditor from './TextEditor';
import {dialog} from '../utils';

export default class EmailInput extends React.Component {
	state = {
		errors: {},
		modal: false,
	};

	getForm = el => this.form = el;
	showModal = () => {
		if (this.props.disabled()) {
			dialog.alert('No one is selected');
			return;
		} else {
			if(!this.state.modal) this.setState({modal: true});
		}
	};
	updateMessage = event => this.setState({message: event.target.value});
	hideModal = () => {
		this.setState({errors: {}});
		this.setState({modal: false});
	};
	submit = async () => {
		let errors = {};
		if (this.form.querySelector('#subject').value.trim().length === 0) {
			errors.subject = window.__('This is required field.');
		}

		if (this.form.querySelector('textarea').value.trim().length === 0) {
			errors.message = window.__('This is required field.');
		}

		if (Object.keys(errors).length !== 0) {
			this.setState({errors});
		} else {
			await this.props.onSubmit(new FormData(this.form));
			this.setState({errors: {}});
			this.hideModal();
		}
	};
	cancel = () => {
		this.hideModal();
		this.props.onCancel && this.props.onCancel();
	};

	render() {
		return (
			<React.Fragment>
				<View.Action onClick={this.showModal}>
					<Text>Send Email</Text>
				</View.Action>
				<Modal show={this.state.modal} onHide={this.cancel}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Email Information</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form ref={this.getForm}>
							<Row>
								<Col xs={12}>
									<FormGroup
										controlId='subject'
										validationState={this.state.errors.subject ? 'error': null}>
										<ControlLabel><Text>Subject</Text></ControlLabel>
										<FormControl name='subject' id='subject'/>
										<HelpBlock>{this.state.errors.subject}</HelpBlock>
									</FormGroup>
								</Col>
								<Col xs={12}>
									<FormGroup
										controlId='message'
										validationState={this.state.errors.message ? 'error': null}>
										<ControlLabel><Text>Message</Text></ControlLabel>
										<TextEditor name='message'/>
										<HelpBlock>{this.state.errors.message}</HelpBlock>
									</FormGroup>
								</Col>
								<Col xs={12}>
									<FormGroup controlId='email_attachement'>
										<ControlLabel><Text>Email Attachment</Text></ControlLabel>
										<FormControl name='email_attachement' type='file'/>
									</FormGroup>
								</Col>
							</Row>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle='primary' onClick={this.submit}>
							<Text>Send</Text>
						</Button>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		);
	}
}