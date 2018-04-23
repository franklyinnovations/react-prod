import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Col, OverlayTrigger, Popover, Row, ButtonToolbar, Table } from '@sketchpixy/rubix';
import ShiftManagement from './ShiftDoctorFront';
import * as Util from '../../utils';
import makeTranslater from '../../translate';
import { locale } from 'moment';
var _ = require('lodash');


String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

export default class MyLargeModal extends React.Component {

	renderRow(){
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		if(this.props.currentHospital.hospital_timings !== undefined) { 
			return(
		
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							<th>{__('Day')}</th>
							<th>{__('Shift 1')}</th>
							<th>{__('Shift 2')}</th>
						</tr>
					</thead>
					<tbody>
						{ !_.isEmpty(this.props.currentHospital.hospital_timings) && this.props.currentHospital.hospital_timings.map(function (single, i) {
							return <tr key={i}>
									<td>{ single.days }</td>
									<td>{ single.shift_1_from_time.toHHMMSS() } - { single.shift_1_to_time.toHHMMSS() }</td>
									<td>{ single.shift_2_from_time.toHHMMSS() } - { single.shift_2_to_time.toHHMMSS() }</td>
								</tr>;
							}) 
						}

						{ _.isEmpty(this.props.currentHospital.hospital_timings) && <tr>
									<td colSpan="3" className="text-center">{__('No records')}</td>
								</tr>
						}
					</tbody>
				</Table>
			);
		}
	  }

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		let cInfos = [];
		let timings = {};
	  return (
			<Modal {...this.props} lg >
				
				{ this.props.type === "doctor" && <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg"> { this.props.currentUser.doctorprofiledetail ? this.props.currentUser.doctorprofiledetails[0].name+__("'s Timings") : "" }</Modal.Title>

					{ this.props.currentUser.doctorprofiledetail && <Col xs={7} md={7} lg={7}>
										{ `${this.props.currentUser.doctor_id} | ${this.props.currentUser.email} | ${this.props.currentUser.mobile}` }
										<br/> { `${this.props.currentUser.doctorprofiledetail.address_line_1}, ${this.props.currentUser.citydetail.name}, ${this.props.currentUser.statedetail.name}, ${this.props.currentUser.countrydetail.name}` }
					</Col> }

					{ /*<OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title="Popover bottom"><strong>Get Clinic Timings</strong> Check this info.</Popover>}>
						<Button bsStyle="default">Hover</Button>
					</OverlayTrigger> */ }

				</Modal.Header> }


				{ this.props.type === "hospital" && <Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg"> { this.props.currentHospital.hospitaldetail ? this.props.currentHospital.hospitaldetail.hospital_name+__("'s Timings") : "" }</Modal.Title>

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

					<ButtonToolbar className="pull-right">
                        <OverlayTrigger trigger="click" placement="left" overlay={<Popover id='popover-left-0' title={ this.props.currentHospital.hospitaldetail ? this.props.currentHospital.hospitaldetail.hospital_name+__("'s Timings") : "" }> { this.renderRow(this.props.currentHospital.hospital_timings) }</Popover>}>
                          <Button bsStyle="default">{__('Timings')}!</Button>
                        </OverlayTrigger>
                    </ButtonToolbar>

				</Modal.Header> }
				
				<ShiftManagement {...this.props} />

				<Modal.Footer />

			</Modal>
	  );
	}
}