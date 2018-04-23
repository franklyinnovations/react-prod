import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../../api/config';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Select from 'react-select';
import makeTranslater from '../../translate';
import * as utilsActions from '../../utils';
import Pagination from '../../components/Pagination';
import MyLargeModal from './Modal';
import PropTypes from 'prop-types';
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
    Well,
    Label,
    BPanel,
    Modal,
    ListGroup,
    ListGroupItem,
    Image,
    Radio,
    OverlayTrigger,
    Popover
} from '@sketchpixy/rubix';
import Alert from 'react-s-alert';

var _ = require('lodash');
var moment = require('moment');
var DateTimeField = require('react-bootstrap-datetimepicker');

@connect(state => ({
session: state.session,
    location: state.location,
    loading: state.view.loading || false,
    translations: state.translations,
    lang: state.lang
}))

class DoctorAddClinicFront extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            selected_city : [], 
            selected_specialization : [], 
            showModal : false, 
            show : false,
            currentUser : {}, 
            currentHospital : {},
            is_owner: 0
        };

        this.handleRadioChange = event => {
            this.setState({is_owner: event.target.value})
            this.props.dispatch({
                type: 'UPDATE_FILTER',
                name: 'show_create_profile_option',
                value: false
            })
        }

        this.handleClinicClaimRequest = event => {
            this.props.dispatch(
                actions.doctor_profile.sendClaimForClinic(this.props, event.target.getAttribute('data-item-id'))
            )
        }

        this.cancelClaimRequest = event => {
            this.props.dispatch(
                actions.doctor_profile.cancelClinicClaimRequest(this.props, event.target.getAttribute('data-item-id'))
            )
        }
    }

    handleDataUpdate = selected_city => {
        this.setState({ selected_city });
    }

    handleSpecializationUpdate = selected_specialization => {
        this.setState({ selected_specialization });
    }

    handleCreateNewClinic = event => {
        event.preventDefault()
        this.props.router.push('/doctor/add-clinic');
    }

    renderRow(item, index){
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        
        let show = true, _ref = this;
        let contactInfo = []
        if(item.contactinformations != null) {
            item.contactinformations.map((itemm) => {
                contactInfo.push(itemm.value)
            })
        }

        return(
            <Well key={'spp-'+index}>
                <Row>
                    <Col xs={12} md={2} lg={2}>
                        <Image src={(item.hospital_logo ? imageUrl+'/'+item.hospital_logo : '/imgs/noimage.png')} circle />
                    </Col>
                    <Col xs={12} md={7} lg={7}>
                        <h4>{item.hospitaldetail.hospital_name}</h4>
                        <p>
                            { contactInfo.length > 0 ? contactInfo.join(" | ") : null }<br/>
                            { `${item.hospitaldetail.address}` }
                        </p>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        {  !_.isEmpty(_ref.props.filter) && !_.isEmpty(_ref.props.filter.filtered_hospital_list_obj_front) && _ref.props.filter.filtered_hospital_list_obj_front.mapped_hospitals.map(function (value) {
                  
                            if(value === item.id){
                                show = false;
                            }
                        }) }
                
                        { 
                            show ?
                            (
                                this.state.is_owner == 1 ?
                                <Button
                                    outlined
                                    bsStyle='lightgreen'
                                    data-item-id={item.id}
                                    onClick={this.handleClinicClaimRequest}
                                >{__('Claim this profile')}</Button> : 
                                <Button
                                    outlined
                                    bsStyle='lightgreen'
                                    onClick={ () => this.setState({ showModal : true, currentHospital : item}) }
                                >{__('Add')}</Button>
                            ) :
                            <Button outlined bsStyle='danger' >{__('Already Mapped')}</Button> 
                        }
                    </Col>
                </Row>
            </Well>
        );
    }

	render(){
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        const { all_city_list, all_hospital_list_on_doctor } = this.props.helperData;
        const { selected_city } = this.state;
        let _ref = this, filtered_hospital_list = !_.isEmpty(this.props.filter) &&  !_.isEmpty(this.props.filter.filtered_hospital_list_obj_front) ?  this.props.filter.filtered_hospital_list_obj_front.filtered_hospital_list : {};
        let lgClose = () => this.setState({ showModal : false });

        let contactEmail = [], contactMobiles = [];
        if(_ref.props.doctor_mapped_clinics.length > 0) {
            _ref.props.doctor_mapped_clinics.map((itemss) => {
                itemss.hospital.contactinformations.map((innerItem) => {
                    if(innerItem.type === "email") contactEmail.push(innerItem.value)
                    if(innerItem.type === "mobile") contactMobiles.push(innerItem.value)
                })
            })
        }
    
        return (
            <Row key='sssssssss'>
                { !_.isEmpty(_ref.props.doctor_mapped_clinics) && <Col sm={12}>
                    <Table striped bordered condensed hover responsive>
                        <tbody>
                            <tr>
                                <th>{__('Hospital Name')}</th>
                                <th>{__('Address')}</th>
                                <th>{__('Type')}</th>
                                <th>{__('Status')}</th>
                            </tr>

                            {_ref.props.doctor_mapped_clinics.map(function(value, index){
                                let timeHtml = "";
                                if(value.available_on_req === 0) { 
                                    timeHtml = (
                                        <Table striped bordered condensed hover responsive key={'timing-info-'+value.hospital.id}>
                                            <tbody>
                                                <tr>
                                                    <th>{__('Day')}</th>
                                                    <th>{__('1st shift start time')}</th>
                                                    <th>{__('1st shift end time')}</th>
                                                    <th>{__('2nd shift start time')}</th>
                                                    <th>{__('2nd shift end time')}</th>
                                                </tr>

                                                {value.hospital_doctor_timings.map(function (dayV) {
                                                    return (
                                                        <tr key={'shift-timing-info-'+value.hospital.id}>
                                                            <td>{dayV.days}</td>
                                                            <td>{dayV.shift_1_from_time.toHHMMSS()}</td>
                                                            <td>{dayV.shift_1_to_time.toHHMMSS()}</td>
                                                            <td>{dayV.shift_2_from_time.toHHMMSS()}</td>
                                                            <td>{dayV.shift_2_to_time.toHHMMSS()}</td>
                                                        </tr>
                                                    )
                                                }) }
                                            </tbody>
                                        </Table>
                                    );
                                }

                                return (
                                    <tr key={index}>
                                        <td>
                                            { value.hospital.hospitaldetails[0].hospital_name }
                                        </td>
                                        <td>
                                            {__('Email')} : {contactEmail.join(" | ")}<br/>
                                            {__('Mobile')} : {contactMobiles.join(" | ")}
                                        </td>
                                        <td>
                                                { value.available_on_req === 1 ? "Available on request" : "" }
                                                { 
                                                    value.available_on_req === 0 &&  
                                                    <OverlayTrigger trigger={["click"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title={__('Timings')}>{timeHtml}</Popover>}>
                                                        <Button bsStyle="default">{__('Check timings')}</Button>
                                                    </OverlayTrigger> 
                                                }
                                            </td>
                                        <td>
                                            {__('Mapped')}
                                        </td>
                                    </tr>
                                );
                            }) }

                            { _.isEmpty(_ref.props.doctor_mapped_clinics) &&
                                <tr key={'oops'}>
                                    <td colSpan="3">
                                        {__("Oops seems like you haven't mapped with any hospital")}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table> 
                </Col> }
                
                { 
                    this.props.pendingClinicClaimedProfile && 
                    <Col xs={12} md={12} lg={12}>
                        <BPanel header={__('Profile has been claimed by you.')} bsStyle="info">
                            <Col sm={2}>
                                <Image style={{maxHeight: '90px'}} src={(this.props.pendingClinicClaimedProfile.hospital_logo ? imageUrl+'/'+this.props.pendingClinicClaimedProfile.hospital_logo : '/imgs/noimage.png')} className="img-responsive" circle/>
                            </Col>
                            <Col sm={10}>
                                <h4>{this.props.pendingClinicClaimedProfile.hospitaldetails[0].hospital_name}</h4>
                                <p>
                                    {this.props.pendingClinicClaimedProfile.hospitaldetails[0].about_hospital}
                                </p>
                                <p><Button outlined bsStyle='lightgreen' data-item-id={this.props.pendingClinicClaimedProfile.id} onClick={this.cancelClaimRequest}>{__('CancelRequest')}</Button></p>
                            </Col>
                        </BPanel><br/>
                    </Col>
                }

                <Col sm={12}>
                    <Form>
                        <Col xs={12} md={12} lg={12}>
                            <Button
                                outlined
                                className="pull-right"
                                bsStyle='lightgreen'
                                onClick={ () => _ref.setState({show : !_ref.state.show}) }
                            >
                                {__('Add New Hospital')}
                            </Button>
                            <br/>
                        </Col>
                        <br/>
          		        <Row key="doctors-list">                  
                            <br/>
                            <Col xs={12} md={12} lg={12}>
                                <Row key="doctors-list2" style={this.state.show ? {} : { display: 'none' }}>
                                    <Col sm={12}>
                                        <div>
                                            <Radio 
                                                inline 
                                                value={1}
                                                name='is_owner' 
                                                onChange={this.handleRadioChange}
                                            >{__('I am clinic owner')}
                                            </Radio>
                                            <Radio 
                                                inline 
                                                value={0}
                                                name='is_owner'
                                                onChange={this.handleRadioChange}
                                                defaultChecked={true}
                                            >{__('I am visiting this clinic for consultation')}
                                            </Radio>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='name'
                                        >
                                            <ControlLabel>{__('Hospital')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Hospital Name')}
                                                inputRef={(ref) => {this.hospital_name = ref}}
                                                name='hospital_detail[hospital_name]'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='city_name'
                                            >
                                            <ControlLabel>{__('City')}</ControlLabel>
                                            <Select
                                                multi
                                                options={ all_city_list }
                                                removeSelected={true}
                                                value={selected_city}
                                                onChange={this.handleDataUpdate.bind(this)}
                                                openOnClick={false}
                                                searchable={true}
                                              />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='email_id'
                                            >
                                            <ControlLabel>{__('Email')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Email')}
                                                inputRef={(ref) => {this.hospital_email = ref}}
                                                />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='mobile'
                                            >
                                            <ControlLabel>{__('Mobile')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Mobile')}
                                                inputRef={(ref) => {this.hospital_mobile = ref}}
                                                />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={12} lg={12}>
                                        <br/>
                                        <div className="text-right">
                                            <Button
                                                outlined
                                                bsStyle='lightgreen'
                                                onClick={ () => ::_ref.save() }
                                            >
                                                {__('Search')}
                                            </Button>&nbsp;&nbsp;
                                            <Button
                                                outlined
                                                bsStyle='lightgreen'
                                                onClick={ () => ::_ref.reset() }
                                            >
                                                {__('Reset')}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={12} lg={12}>
                                <br/>
                                { !_.isEmpty(filtered_hospital_list) && filtered_hospital_list.map(this.renderRow, this) }
                                
                                { filtered_hospital_list.length === 0 && (<p className='text-center'>{__('No record found.')}</p>) }

                                {!_.isEmpty(filtered_hospital_list) && <Pagination
                                    data={this.props.filter.filtered_hospital_list_obj_front}
                                    onSelect={::this.save}
                                />}
                            </Col>
                            
                            {
                                filtered_hospital_list != null && this.state.is_owner == 1 && this.props.filter.show_create_profile_option !== undefined && this.props.filter.show_create_profile_option && 
                                <Col sm={12} className="text-center" style={{marginBottom: '4px'}}>
                                    <Button outlined lg bsStyle='lightgreen' onClick={this.handleCreateNewClinic}>{__('Not listed above, Click to add new clinic')}</Button>
                                </Col>
                            }
                            
                            <MyLargeModal 
                                { ...this.props } 
                                show={this.state.showModal} 
                                currentHospital={this.state.currentHospital} 
                                onHide={lgClose}
                                type="hospital"
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        );
    }

    save(page = null){
        const { selected_city } = this.state;
        let data = { name : '', mobile : '', email : '', page : 1 };

        if(this.hospital_name.value){
            data['name'] = this.hospital_name.value;
        }

        if(page !== null){
            data['page'] = page;
        }

        if(this.hospital_mobile.value){
            data['mobile'] = this.hospital_mobile.value;
        }
        if(this.hospital_email.value){
            data['email'] = this.hospital_email.value;
        }

        let cityArr = selected_city.map(function (item){
            return item.value;
        })

        data['selected_city'] = cityArr;
        data['language'] = this.props.lang;
        data['logged_doctorprofile_id'] = this.props.basicDetails.id;
        if(this.state.is_owner == 1) data['non_claimed_profiles'] = true;

        this.props.dispatch(
            actions.doctor_profile.filterHospitalsFront(this.props, data)
        );
    }

    reset() {
        this.hospital_name.value = '', this.hospital_mobile.value = '', this.hospital_email.value = '';
        this.setState({selected_city: []});

        this.props.dispatch({
            type: 'RESET_FILTER_FILTER_HOSPITALS_DATA'
        });
    }
}

DoctorAddClinicFront.propTypes = {
    doctor_list : PropTypes.array.isRequired,
    selected_city : PropTypes.array.isRequired,
    specialization_list : PropTypes.array.isRequired,
    selected_specialization : PropTypes.array.isRequired,
    city_list : PropTypes.array.isRequired,
	label: PropTypes.string,
	searchable: PropTypes.bool.isRequired,
}

DoctorAddClinicFront.defaultProps = {
    doctor_list: [],
    city_list: [],
    selected_city: [],
    specialization_list: [],
    selected_specialization: [],
    label : "demo",
    searchable : true
}

export default DoctorAddClinicFront
