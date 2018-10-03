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
import {dialog} from '../utils';

export default class SMSInput extends React.Component {

	state = {
		errors: {},
		message: '',
		modal: false,
	};

	getForm = el => this.form = el;
	showModal = () => {
		if (this.props.disabled()) {
			dialog.alert('No one is selected');
			return;
		} else if (!this.state.modal) {
			this.setState({modal: true});
		}
	};
	updateMessage = event => this.setState({message: event.target.value});
	hideModal = () => this.setState({message: '', errors: {}, modal: false});
	
	submit = async () => {
		if (this.state.message.trim().length === 0) {
			this.setState({errors: {message: window.__('This is required field.')}});
		} else {
			await this.props.onSubmit(new FormData(this.form));
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
					<Text>Send SMS</Text>
				</View.Action>
				<Modal show={this.state.modal} onHide={this.cancel}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>SMS Information</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form ref={this.getForm}>
							<Row>
								<Col md={12}>
									<FormGroup
										controlId='message'
										validationState={this.state.errors.message ? 'error': null}>
										<ControlLabel><Text>Message</Text></ControlLabel>
										<FormControl
											rows='4'
											onChange={this.updateMessage}
											value={this.state.message}
											componentClass='textarea'
											name='message'/>
										<HelpBlock>{this.state.errors.message}</HelpBlock>
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