import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Col, OverlayTrigger, Popover, Row } from '@sketchpixy/rubix';
import ShiftManagement from './ShiftManagement';
import * as Util from '../utils';
import { locale } from 'moment';

export default class EditDurationModal extends React.Component {
	render() {
		let cInfos = [];
	  return (
			<Modal {...this.props} lg >
				
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg"> { `${this.props.currentDurationObj.doctorprofile.doctorprofiledetails[0].name}'s Timings`}</Modal.Title>
				</Modal.Header> 
				
				<ShiftManagement {...this.props} />

				<Modal.Footer />

			</Modal>
	  );
	}
}