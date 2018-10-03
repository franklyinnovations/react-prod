import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {getInputValue} from '../utils';
import {
	getResCategory,
} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/TransferCertificate';
import * as actions from '../redux/actions/TransferCertificate';
addView('transcertfkt', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Form,
	Modal,
	Table,
	Button,
	Select,
	Loading,
	Clearfix,
	HelpBlock,
	FormGroup,
	Datepicker,
	FormControl,
	ControlLabel,
	ServiceImage,
	SelectCreatable,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class TransferCertificate extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	handleDataUpdate = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch(actions.getStudents(this.props, name, value));

	};

	handleFieldUpdate = event => {
		this.props.dispatch({
			type: 'UPDATE_TC_UPDATE_FIELD_VALUE',
			name: event.currentTarget.name,
			value: getInputValue(event.currentTarget)
		});
	};

	handleCheckbox = event => {
		this.props.dispatch({
			type: 'SELECT_TC_STUDENT',
			name: event.currentTarget.name,
			value: getInputValue(event.currentTarget)
		});
	};

	viewTC = event => this.props.dispatch(
		actions.viewTC(
			this.props,
			'/tc-download',
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	downloadTC = event => this.props.dispatch(
		actions.viewTC(
			this.props,
			'/tc-pdf',
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	showUploadSignatureModal = () => this.props.dispatch(actions.showUploadSignatureModal(this.props));
	hideUploadSignatureModal = () => this.props.dispatch(actions.hideUploadSignatureModal());
	uploadSignature = () => this.props.dispatch(
		actions.uploadSignature(
			this.props,
			new FormData(document.getElementById('signature-form'))
		)
	);

	showStudentDetailModal = event => this.props.dispatch(
		actions.showStudentDetailModal(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	hideStudentDetailModal = () => this.props.dispatch(actions.hideStudentDetailModal());

	edit = () => {
		let errors = {};
		if(this.props.item.bcsmapId === ''){
			errors.bcsmapId = window.__('This is a required field.');
		}

		if(Object.keys(errors).length > 0){
			this.props.dispatch({
				type: 'SET_TC_ERRORS',
				errors
			});
		} else {
			this.props.dispatch({
				type: 'SET_TC_ERRORS',
				errors: {},
			});
			if(this.props.item.data && !this.props.item.data.some(item => item.selected)){
				vex.dialog.alert(window.__('No one is selected.'));
			} else {
				this.props.dispatch(
					actions.getStudentsDetails(this.props)
				);
			}
		}
	};
	
	printTC = url => {
		let errors = {};
		for (let i = this.props.item.data.length - 1; i >= 0; i--) {
			let item = this.props.item.data[i];
			if (!item.releaving_date)
				errors['releaving_date-' + i] = 'This is a required field.';
			else if (!moment(item.releaving_date, this.props.session.userdetails.date_format).isAfter(this.props.item.data[i].student.dob))
				errors['releaving_date-' + i] = 'Relieving date should be greater than date of birth.';
			else if (!moment(item.releaving_date, this.props.session.userdetails.date_format).isAfter(this.props.item.data[i].student.doa))
				errors['releaving_date-' + i] = 'Relieving date should be greater than admission date.';
			if (!item['conduct'])
				errors['conduct-' + i] = 'This is a required field.';
		}

		if (Object.keys(errors).length === 0){
			this.props.dispatch({
				type: 'SET_TC_ERRORS',
				errors:{}
			});
			this.props.dispatch(
				actions.printTC(this.props, url)
			);
		}else{
			this.props.dispatch({
				type: 'SET_TC_ERRORS',
				errors,
			});
		}
	}

	reset = () => {
		this.props.dispatch({
			type: 'RESET_TC_DATA'
		});
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'EDIT':
				content = this.renderEdit(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<React.Fragment>
				<View>
					<Row>
						<Col md={4}>
							<FormGroup
								controlId='bcsmapId'
								validationState={this.props.errors.bcsmapId ? 'error': null}>
								<ControlLabel><Text>Class</Text></ControlLabel>
								<Select
									name='bcsmapId'
									placeholder={__('Class')}
									onChange={this.handleDataUpdate}
									value={this.props.item.bcsmapId}
									options={this.props.item.bcsmaps}
									disabled={this.props.viewState === 'EDIT'}/>
								<HelpBlock>{this.props.errors.bcsmapId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={8}>
							<FormGroup>
								<ControlLabel className='invisible'>H</ControlLabel>
								<div>
									<Button
										bsStyle='primary'
										onClick={this.edit}
										disabled={this.props.viewState === 'EDIT'}>
										<Text>Generate TC</Text>
									</Button>
									&nbsp;&nbsp;
									<Button
										bsStyle='primary'
										onClick={this.showUploadSignatureModal}
										disabled={this.props.viewState === 'EDIT'}>
										<Text>Upload Signature</Text>
									</Button>
								</div>
							</FormGroup>
						</Col>
					</Row>
					{content}
				</View>
				<Modal
					show={this.props.selector.show}
					onHide={this.hideUploadSignatureModal}>
					<Modal.Header closeButton>
						<Modal.Title><Text>Upload Signatures</Text></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form id='signature-form'>
							<input type='hidden' name='id' value={this.props.selector.data.id || ''}/>
							<Row>
								<Col md={6}>
									<FormGroup controlId='prepared_by'>
										<ControlLabel><Text>Prepared By</Text></ControlLabel>
										<FormControl name='prepared_by' type='file'/>
									</FormGroup>
								</Col>
								<Col md={6}>
									{
										this.props.selector.data.id &&
										<ServiceImage
											width='96'
											height='96'
											className='img'
											src={this.props.selector.data.prepared_by}/>
									}
								</Col>
								<Clearfix/>
								<br/>
								<Col md={6}>
									<FormGroup controlId='checked_by'>
										<ControlLabel><Text>Checked By</Text></ControlLabel>
										<FormControl name='checked_by' type='file'/>
									</FormGroup>
								</Col>
								<Col md={6}>
									{
										this.props.selector.data.id &&
										<ServiceImage
											width='96'
											height='96'
											className='img'
											src={this.props.selector.data.checked_by}/>
									}
								</Col>
								<Clearfix/>
								<br/>
								<Col md={6}>
									<FormGroup controlId='principal'>
										<ControlLabel><Text>Principal</Text></ControlLabel>
										<FormControl name='principal' type='file'/>
									</FormGroup>
								</Col>
								<Col md={6}>
									{
										this.props.selector.data.id &&
										<ServiceImage
											width='96'
											height='96'
											className='img'
											src={this.props.selector.data.principal}/>
									}
								</Col>	
							</Row>
						</Form>	
					</Modal.Body>
					<Modal.Footer>
						<Button
							bsStyle='primary'
							onClick={this.uploadSignature}
							disabled={this.props.selector.loading}>
							<Text>Upload</Text>
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					show={this.props.studentdetail.show}
					onHide={this.hideStudentDetailModal}>
					<Modal.Header closeButton>
						<Modal.Title><Text>Student Details</Text></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table bordered>
							<tbody>
								<tr>
									<td>{__('Enrollment Number')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.enrollment_no : ''}</td>
								</tr>
								<tr>
									<td>{__('Roll Number')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentrecord.roll_no : ''}</td>
								</tr>
								<tr>
									<td>{__('Form Number')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.form_no : ''}</td>
								</tr>
								<tr>
									<td>{__('Fee Receipt Number')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.fee_receipt_no : ''}</td>
								</tr>
								<tr>
									<td>{__('Admission Date')}</td>
									<td>{this.props.item.stdata ? moment(this.props.item.stdata.doa).format(this.props.session.userdetails.date_format) : ''}</td>
								</tr>
								<tr>
									<td>{__('Full Name')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.user.userdetails[0].fullname : ''}</td>
								</tr>
								<tr>
									<td>{__('Gender')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.gender : ''}</td>
								</tr>
								<tr>
									<td>{__('Mobile Number')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.user.mobile : ''}</td>
								</tr>
								<tr>
									<td>{__('Email')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.user.email : ''}</td>
								</tr>
								<tr>
									<td>{__('Height')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].height : ''}</td>
								</tr>
								<tr>
									<td>{__('Body Weight')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].weight : ''}</td>
								</tr>
								<tr>
									<td>{__('Birthmark')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].birthmark : ''}</td>
								</tr>
								<tr>
									<td>{__('Blood Group')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.blood_group : ''}</td>
								</tr>
								<tr>
									<td>{__('Date of Birth')}</td>
									<td>{this.props.item.stdata ? moment(this.props.item.stdata.dob).format(this.props.session.userdetails.date_format) : ''}</td>
								</tr>
								<tr>
									<td>{__('Religion')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].religion : ''}</td>
								</tr>
								<tr>
									<td>{__('Nationality')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].nationality : ''}</td>
								</tr>
								<tr>
									<td>{__('Place of Birth')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].birthplace : ''}</td>
								</tr>
								<tr>
									<td>{__('Communication Address')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].address : ''}</td>
								</tr>
								{this.props.item.stdata && !this.props.item.stdata.same_as_comm_add &&
									<tr>
										<td>{__('Permanent Address')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].address_2 : ''}</td>
									</tr>
								}
								<tr>
									<td>{__('Father\'s Name')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].father_name : ''}</td>
								</tr>
								<tr>
									<td>{__('Father\'s Occupation')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].father_occupation : ''}</td>
								</tr>
								<tr>
									<td>{__('Father\'s Email')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.father_email : ''}</td>
								</tr>
								<tr>
									<td>{__('Father\'s Contact')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.father_contact : ''}</td>
								</tr>
								<tr>
									<td>{__('Mother\'s Name')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].mother_name : ''}</td>
								</tr>
								<tr>
									<td>{__('Mother\'s Occupation')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].mother_occupation : ''}</td>
								</tr>
								<tr>
									<td>{__('Mother\'s Email')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.mother_email : ''}</td>
								</tr>
								<tr>
									<td>{__('Mother\'s Contact')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.mother_contact : ''}</td>
								</tr>
								{this.props.item.stdata && this.props.item.stdata.studentdetails[0].guardian_name &&
									<tr>
										<td>{__('Guardian Name')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].guardian_name : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.studentdetails[0].guardian_name &&	
									<tr>
										<td>{__('Guardian Relationship')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].guardian_relationship : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.studentdetails[0].guardian_name &&	
									<tr>
										<td>{__('Guardian Contact')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.guardian_contact : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.studentdetails[0].guardian_name &&	
									<tr>
										<td>{__('Guardian Address')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].guardian_address : ''}</td>
									</tr>
								}
								{this.props.session.userdetails.countryISOCode === 'IN' &&
									<tr>
										<td>{__('Category')}</td>
										<td>
											{this.props.item.stdata && this.props.item.stdata.res_category && getResCategory(__).find(
												item => item.value === this.props.item.stdata.res_category
											).label}
										</td>
									</tr>
								}
								{this.props.session.userdetails.countryISOCode === 'IN' &&
									<tr>
										<td>{__('Aadhar No')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.aadhar : ''}</td>
									</tr>
								}
								<tr>
									<td>{__('Previous Organization Name')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].pre_school_name : ''}</td>
								</tr>
								<tr>
									<td>{__('Previous Organization Address')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].pre_school_address : ''}</td>
								</tr>
								<tr>
									<td>{__('Previous Qualification')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].pre_qualification : ''}</td>
								</tr>
								<tr>
									<td>{__('Number of Brothers')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.no_of_brother : ''}</td>
								</tr>
								<tr>
									<td>{__('Number of Sisters')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.no_of_sister : ''}</td>
								</tr>
								<tr>
									<td>{__('Standard of Living')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].standard_of_living : ''}</td>
								</tr>
								<tr>
									<td>{__('Number of Brother in School')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.no_of_brother_in_school : ''}</td>
								</tr>
								<tr>
									<td>{__('Number of Sister in School')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.no_of_sister_in_school : ''}</td>
								</tr>
								<tr>
									<td>{__('Rank of Student in Family')}</td>
									<td>{this.props.item.stdata ? this.props.item.stdata.rank_in_family : ''}</td>
								</tr>
								{this.props.session.userdetails.countryISOCode === 'OM' &&
									<tr>
										<td>{__('Residency Number')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.residancy_number : ''}</td>
									</tr>
								}
								{this.props.session.userdetails.countryISOCode === 'OM' &&
									<tr>
										<td>{__('RN Issuer')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.rn_issuer : ''}</td>
									</tr>
								}
								{this.props.session.userdetails.countryISOCode === 'OM' &&
									<tr>
										<td>{__('Date of Release')}</td>
										<td>{this.props.item.stdata ? moment(this.props.item.stdata.date_of_release).format(this.props.session.userdetails.date_format) : ''}</td>
									</tr>
								}
								{this.props.session.userdetails.countryISOCode === 'OM' &&
									<tr>
										<td>{__('Date of Expiration')}</td>
										<td>{this.props.item.stdata ? moment(this.props.item.stdata.date_of_expiration).format(this.props.session.userdetails.date_format) : ''}</td>
									</tr>
								}
								{this.props.item.stdata !== undefined && this.props.item.stdata.is_health_issue  === 1 &&
									<tr>
										<td>{__('Health issue details')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].health_issue_detail : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.is_allergies  === 1 &&
									<tr>
										<td>{__('Allergy details')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].allergies_detail : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.is_medicine  === 1 &&
									<tr>
										<td>{__('Medicine details')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].medicine_detail : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.is_asthma  === 1 &&
									<tr>
										<td>{__('Asthma details')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].asthma_detail : ''}</td>
									</tr>
								}
								{this.props.item.stdata && this.props.item.stdata.is_disability  === 1 &&
									<tr>
										<td>{__('Disability details')}</td>
										<td>{this.props.item.stdata ? this.props.item.stdata.studentdetails[0].disability_detail : ''}</td>
									</tr>
								}
								{
									this.props.item.stdata && 
									<tr>
										<td><Text>Profile Image</Text></td>
										<td>
											<ServiceImage
												width='100'
												height='90'
												src={this.props.item.stdata.user.user_image}/>
										</td>
									</tr>
								}
							</tbody>
						</Table>
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderList(__) {
		return (
			this.props.item.isLoading ? <Loading /> :
			this.props.item.data &&
			<Table bordered>
				<thead>
					<tr>
						<th>
							<input
								type='checkbox'
								name='check_all'
								onChange={this.handleCheckbox}
								checked={this.props.item.check_all}/>
						</th>
						<th><Text>S.No.</Text></th>
						<th><Text>Enrollment No.</Text></th>
						<th><Text>Student Name</Text></th>
						<th><Text>Father Name</Text></th>
						<th><Text>Mother Name</Text></th>
						<th><Text>Relieving Date</Text></th>
						<th><Text>Actions</Text></th>
					</tr>
				</thead>
				<tbody>
					{
						this.props.item.data.map((item, index) => (
							<tr key={item.id}>
								<td>
									<input
										name={index}
										type='checkbox'
										checked={item.selected}
										onClick={this.handleCheckbox}/>
								</td>
								<td>{index+1}</td>
								<td>{item.student.enrollment_no}</td>
								<td>{item.student.user.userdetails[0].fullname}</td>
								<td>{item.student.studentdetails[0].father_name}</td>
								<td>{item.student.studentdetails[0].mother_name}</td>
								<td>{item.student.transfercertificate ? moment(item.student.transfercertificate.releaving_date).format(this.props.session.userdetails.date_format) : ''}</td>
								<td className='text-primary'>
									{
										item.student.transfercertificate &&
										<React.Fragment>
											<Icon
												glyph='fa-eye'
												title={__('View')}
												onClick={this.viewTC}
												className='fg-primary'
												data-item-id={item.student.id}/>
											&nbsp;&nbsp;
											<Icon
												glyph='fa-download'
												className='fg-primary'
												title={__('Download')}
												onClick={this.downloadTC}
												data-item-id={item.student.id}/>
											&nbsp;&nbsp;
											<Icon
												glyph='fa-user'
												className='fg-primary'
												title={__('Student Details')}
												data-item-id={item.student.id}
												onClick={this.showStudentDetailModal}/>
										</React.Fragment>
									}
								</td>
							</tr>
						))
					}
					{
						this.props.item.data.length === 0 &&
						<tr key={0}>
							<td colSpan={8} className='text-center'>
								<Text>No Result Found</Text>
							</td>
						</tr>
					}
				</tbody>
			</Table>
		);
	}

	renderEdit(__) {
		return (
			this.props.item.isLoading ? <Loading /> :
			<React.Fragment>
				<div className='student-marks-table'>
					{
						this.props.item.data.map((stdata, index) =>
							<Row key={index}>
								<Col md={2} className='student-profileinfo'>
									<div>
										<ServiceImage
											width={60}
											className='img-circle'
											src={stdata.student.user.user_image}/>
									</div>
									<div>
										<b>{stdata.student.user.userdetails[0].fullname}</b>
									</div>
									<div><Text>Roll No.</Text> {stdata.roll_no}</div>
								</Col>
								<Col mdOffset={2} md={5} className='panel-body'>
									<div><strong><Text>Enrollment No</Text>:</strong>&nbsp;{stdata.student.enrollment_no } </div>
									<div><strong><Text>Father Name</Text>:</strong>&nbsp;{stdata.student.studentdetails[0].father_name } </div>
									<div><strong><Text>Mother Name</Text>:</strong>&nbsp;{stdata.student.studentdetails[0].mother_name } </div>
									<div><strong><Text>Date of Birth</Text>:</strong>&nbsp;{moment(stdata.student.dob).format(this.props.session.userdetails.date_format)} </div>
									<div><strong><Text>Admission Date</Text>:</strong>&nbsp;{moment(stdata.student.doa).format(this.props.session.userdetails.date_format)}</div>
									<div>
										<strong><Text>Total Attendance</Text>:</strong>
										&nbsp;
										{
											(this.props.session.masterId == 164 && stdata.BulkTotalDay !== null) ?
												stdata.BulkPresentDay+'/'+stdata.BulkTotalDay :
												stdata.StudentAttendance+'/'+stdata.totalAttendance
										}
									</div>
								</Col>
								<Col md={5} className='form-horizontal panel-body'>
									<FormGroup 
										controlId={'releaving_date-'+index}
										validationState={this.props.errors['releaving_date-'+index] ? 'error': null}>
										<Col sm={5} componentClass={ControlLabel}><Text>Relieving Date</Text>:</Col>
										<Col sm={7}>
											<Datepicker
												value={stdata.releaving_date}
												name={'releaving_date-'+index}
												onChange={this.handleFieldUpdate}
												placeholder={__('Relieving Date')}/>
											<HelpBlock>{this.props.errors['releaving_date-'+index]}</HelpBlock>
										</Col>
									</FormGroup>
									<FormGroup 
										controlId={'conduct-'+index}
										validationState={this.props.errors['conduct-'+index] ? 'error': null}>
										<Col sm={5} componentClass={ControlLabel}>
											<Text>Conduct & Behaviour</Text>:
										</Col>
										<Col sm={7}>
											<SelectCreatable
												value={stdata.conduct}
												name={'conduct-'+index}
												onChange={this.handleFieldUpdate}
												options={this.props.item.conducts}
												placeholder={__('Conduct & Behaviour')}/>
											<HelpBlock>{this.props.errors['conduct-'+index]}</HelpBlock>	
										</Col>
									</FormGroup>
									<FormGroup 
										controlId={'result-'+index}
										validationState={this.props.errors['result-'+index] ? 'error': null}>
										<Col sm={5} componentClass={ControlLabel}>
											<Text>Result</Text>:
										</Col>
										<Col sm={7}>
											<SelectCreatable
												value={stdata.result}
												name={'result-'+index}
												placeholder={__('Result')}
												onChange={this.handleFieldUpdate}
												options={this.props.item.results}/>
											<HelpBlock>{this.props.errors['result-'+index]}</HelpBlock>	
										</Col>
									</FormGroup>
								</Col>
							</Row>
						)
					}
				</div>
				<Button onClick={this.reset}>
					<Text>Cancel</Text>
				</Button>
				&nbsp;
				<Button
					bsStyle='primary'
					onClick={() => this.printTC('/tc-download')}
					disabled={this.props.saving}>
					<Text>{this.props.saving ? 'Processing' : 'Approve & View'}</Text>
				</Button>
				&nbsp;
				<Button
					bsStyle='primary'
					onClick={() => this.printTC('/tc-pdf')}
					disabled={this.props.saving}>
					<Text>{this.props.saving ? 'Processing' : 'Approve & Download'}</Text>
				</Button>
			</React.Fragment>
		);
	}
}
