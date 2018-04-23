import React from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import actions from '../redux/actions';
import Loading from '../components/Loading';

import makeTranslater from '../translate';
import Select from '../components/Select';
import * as utilsActions from '../utils';
import {imageUrl} from '../../api/config';
import { getStatusLabel, getStatusIcon, getStatusTitle, getStatusOptions, renderFilterLabel, text_truncate } from '../utils';

import BasicDetail from '../components/DoctorClinicCreation/BasicDetail';
import Award from '../components/DoctorClinicCreation/Award';
import Membership from '../components/DoctorClinicCreation/Membership';
import Specialization from '../components/DoctorClinicCreation/Specialization';
import Service from '../components/DoctorClinicCreation/Service';
import Document from '../components/DoctorClinicCreation/Document';
import InsuranceCompanies from '../components/DoctorClinicCreation/InsuranceCompanies';
import Shift from '../components/DoctorClinicCreation/Shift';
import DoctorMap from '../components/DoctorClinicCreation/DoctorMap';

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
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	Popover,
	Accordion,
	BPanel
}  from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'doctor_new_clinic_add';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor_new_clinic_add
}))
export default class DoctorNewClinicAdd extends React.Component {
	constructor(props) {
		super(props);

		this.handleSelect = eventKey => {
			if(this.props.basicDetails.id == "") return false;
			this.props.dispatch({
	            type: 'UPDATE_TAB',
	            tabKey: event.target.getAttribute('data-tab-key')
	        });
	  	}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor_new_clinic_add.init(
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
		
        content = this.renderAddView(__);
		
        return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={6} md={9} lg={9} className='fg-white'>
											<h3>{__('Add Clinic')}</h3>
										</Col>
										<Col xs={6} md={3} lg={3} className="text-right">
											
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
			</Row>
		)
	}

	renderAddView(__) {
		return (
			<Accordion activeKey={this.props.activeTab}>
            	<BPanel header={__('Clinic Details')} eventKey="basic-info-form" onSelect={this.handleSelect}>
            		<BasicDetail state={this.props}/>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} data-form-key='basic_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Specialization & Services')} eventKey="spec-services-info-form" onSelect={this.handleSelect}>
            		<Form className="spec_services_info_form">
            			<Specialization state={this.props}/>
            			<hr/>
            			<Service state={this.props}/>
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} data-form-key='spec_services_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'basic-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Awards & Memberships')} eventKey="awd-mem-info-form" onSelect={this.handleSelect}>
            		<Form className="awd_mem_info_form">
            			<Award state={this.props} />
            			<hr/>
            			<Membership state={this.props} />
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'documents-info-form'} data-form-key='awd_mem_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Clinic Photos/Videos/Certificates/Documents')} eventKey="documents-info-form" onSelect={this.handleSelect}>
            		<Document state={this.props} />
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'insur-comp-info-form'} onClick={::this.changeTabs}>{__('Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
            	<BPanel header={__('Insurance Companies')} eventKey="insur-comp-info-form" onSelect={this.handleSelect}>
            		<Form className="insur_comp_info_form">
            			<InsuranceCompanies state={this.props} />
            		</Form>
              		<Row>
	                    <Col sm={12}>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'clinic-timings-info-form'} data-form-key='insur_comp_info_form' onClick={::this.saveData}>{__('Save & Next')}</Button>
	                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
	                    </Col>
	                </Row>
            	</BPanel>
                <BPanel header={__('Clinic timings')} eventKey="clinic-timings-info-form" onSelect={this.handleSelect}>
                    <Shift
                        data={this.props}
                    />
                </BPanel>
                <BPanel header={__('Doctors (Fee & Timings)')} eventKey="doc-fee-timings-info-form" onSelect={this.handleSelect}>
                    { this.props.basicDetails.is_freeze === 1 && <DoctorMap data={this.props}/> }
                    { this.props.basicDetails.is_freeze === 0 && <h3 className="text-center">Please freeze your time first.</h3> }
                </BPanel>
          	</Accordion>
		)
	}

	saveData(event) {
		const saveActions = {
			basic_info_form: 'saveBasicInfo',
			spec_services_info_form: 'saveSpecServInfo',
			awd_mem_info_form: 'saveAwardMembershipsInfo',
			insur_comp_info_form: 'saveInsuranceCompanies',
		}
		this.props.dispatch(
			actions.doctor_new_clinic_add[saveActions[event.target.getAttribute('data-form-key')]](this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.'+event.target.getAttribute('data-form-key'))), event.target.getAttribute('data-tab-key'))
		);
    }

    changeTabs(event) {
    	this.props.dispatch({
            type: 'UPDATE_TAB',
            tabKey: event.target.getAttribute('data-tab-key')
        });
    }
}