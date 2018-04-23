import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Col, OverlayTrigger, Popover, Row } from '@sketchpixy/rubix';
import ShiftManagement from './ShiftManagement';
import * as Util from '../utils';
import { locale } from 'moment';

export default class MyLargeModal extends React.Component {
	render() {
		let cInfos = [];
	  return (
			<Modal {...this.props} lg >
				
				{ this.props.type === "doctor" && <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg"> { this.props.currentUser.doctorprofiledetail ? `${this.props.currentUser.doctorprofiledetails[0].name}'s Timings` : "" }</Modal.Title>

					{ this.props.currentUser.doctorprofiledetail && <Col xs={7} md={7} lg={7}>
										{ `${this.props.currentUser.doctor_id} | ${this.props.currentUser.email} | ${this.props.currentUser.mobile}` }
										<br/> { `${this.props.currentUser.doctorprofiledetail.address_line_1}, ${this.props.currentUser.citydetail.name}, ${this.props.currentUser.statedetail.name}, ${this.props.currentUser.countrydetail.name}` }
					</Col> }

					{ /*<OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title="Popover bottom"><strong>Get Clinic Timings</strong> Check this info.</Popover>}>
						<Button bsStyle="default">Hover</Button>
					</OverlayTrigger> */ }

				</Modal.Header> }


				{ this.props.type === "hospital" && <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg"> { this.props.currentHospital.hospitaldetail ? `${this.props.currentHospital.hospitaldetail.hospital_name}'s Timings` : "" }</Modal.Title>

					{ this.props.currentHospital.hospitaldetail && <Col xs={7} md={7} lg={7}>
					{
						this.props.currentHospital.contactinformations.map((cinfo) => 
							cInfos.push(cinfo.value)
						)	
					}
					{ cInfos.join(" | ") }
					</Col> }

					{ /*<OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title="Popover bottom"><strong>Get Clinic Timings</strong> Check this info.</Popover>}>
						<Button bsStyle="default">Hover</Button>
					</OverlayTrigger> */ }

				</Modal.Header> }
				
				<ShiftManagement {...this.props} />

				<Modal.Footer />

			</Modal>
	  );
	}
}