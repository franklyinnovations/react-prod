import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../api/config';
import {connect} from 'react-redux';
import actions from '../redux/actions';
import Select from 'react-select';
import makeTranslater from '../translate';
import * as utilsActions from '../utils';
import Pagination from './Pagination';
import MyLargeModal from '../components/Modal';
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
    OverlayTrigger,
    Popover,
    Modal,
    ListGroup,
    ListGroupItem,
    Image
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

class DoctorAddClinic extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected_city : [], selected_specialization : [], showModal : false, currentUser : {}, currentHospital : {} };
    }
  
    handleDataUpdate = selected_city => {
		this.setState({ selected_city });
    }

    handleSpecializationUpdate = selected_specialization => {
        this.setState({ selected_specialization });
    }
  
    renderRow(item, index){
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
                        { !_.isEmpty(_ref.props.filter) && !_.isEmpty(_ref.props.filter.filtered_hospital_list_obj) && _ref.props.filter.filtered_hospital_list_obj.mapped_hospitals.map(function (value) {
                            if(value === item.id){
                                show = false;
                            }
                        }) }

                        { show ?
                            <Button
                                outlined
                                bsStyle='lightgreen'
                                onClick={ () => this.setState({ showModal : true, currentHospital : item}) }
                                >
                                    {__('Add')}
                            </Button> : 
                            <Button
                                outlined
                                bsStyle='danger'
                            >
                                {__('Already Mapped')}
                            </Button> 
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
        let _ref = this, filtered_hospital_list = this.props.filter.filtered_hospital_list_obj ? this.props.filter.filtered_hospital_list_obj.filtered_hospital_list : {};
        let lgClose = () => this.setState({ showModal : false });
        let contactEmail = [], contactMobiles = [];
    
        return (
            <Row key='pppppp'>
                <Col sm={12}>
                    {  !_.isEmpty(_ref.props.mappedHospitals) && 
                        <Table striped bordered condensed hover responsive>
                            <tbody>                
                                <tr>
                                    <th>{__('Hospital Name')}</th>
                                    <th>{__('Contact Details')}</th>
                                    <th>{__('Type')}</th>
                                    <th>{__('Status')}</th>
                                </tr>

                                { _ref.props.mappedHospitals.map(function(value, index){
                                    let timeHtml = "";
                                    if(value.available_on_req === 0) { 
                                        timeHtml = (
                                            <Table striped bordered condensed hover responsive>
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
                                                            <tr>
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
                                        <tr>
                                            <td>{ value.hospital.hospitaldetails[0].hospital_name }</td>
                                            <td>{__('Email')} : {_.map(value.hospital.contactinformations, function(o) {
                                                    if (o.type === "email") return o.value.trim();
                                                }).join(" | ")}<br/>
                                                {__('Mobile')} : {_.map(value.hospital.contactinformations, function(o) {
                                                    if (o.type === "mobile") return o.value.trim();
                                                }).join(" | ")}
                                            </td>
                                            <td>
                                                { value.available_on_req === 1 ? __("Available on request") : "" }
                                                { 
                                                    value.available_on_req === 0 &&  
                                                    <OverlayTrigger trigger={["click"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title={ __('Timings') }>{timeHtml}</Popover>}>
                                                        <Button bsStyle="default">{__('Check timings')}</Button>
                                                    </OverlayTrigger> 
                                                }
                                            </td>
                                            <td>{ __('Mapped') }</td>
                                        </tr>
                                    );
                                }) }
                            </tbody>
                        </Table>  
                    }
                </Col>
                <Col sm={12}>
                    <BPanel header={__('Find Hospital')}>
                        <Form>
      		                <Row key="doctors-list">
                                <Col xs={12} md={12} lg={12}>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup controlId='name'>
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
                                        <FormGroup controlId='city_name'>
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
                                        <FormGroup controlId='email_id'>
                                            <ControlLabel>{__('Email')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Email')}
                                                inputRef={(ref) => {this.hospital_email = ref}}
                                                //onChange={this.handleDataUpdate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup controlId='mobile'>
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
                                        <div>
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
                                </Col>
                                <Col xs={12} md={12} lg={12}>
                                    <br/>
                                    { !_.isEmpty(filtered_hospital_list) && filtered_hospital_list.map(this.renderRow, this) }
                                    {
                                        !_.isEmpty(filtered_hospital_list) && 
                                        <Pagination data={this.props.filter.filtered_hospital_list_obj} onSelect={::this.save}/>
                                    }
                                </Col>
                                <MyLargeModal 
                                    { ...this.props } 
                                    show={this.state.showModal} 
                                    currentHospital={this.state.currentHospital} 
                                    onHide={lgClose}
                                    type="hospital"
                                />
                            </Row>
                        </Form>
                    </BPanel>
                </Col>
            </Row>
	   );
    }

    save(page = null){
        const { selected_city } = this.state;
        let data = { name : '', mobile : '', email : '', page : 1 };

        if(this.hospital_name.value){ data['name'] = this.hospital_name.value }
        if(page !== null){ data['page'] = page }
        if(this.hospital_mobile.value){ data['mobile'] = this.hospital_mobile.value }
        if(this.hospital_email.value){ data['email'] = this.hospital_email.value }

        let cityArr = selected_city.map(function (item){
            return item.value;
        })

        data['selected_city'] = cityArr;
        data['language'] = this.props.lang;
        data['logged_doctorprofile_id'] = this.props.doctorBasicDetails.id;
        
        this.props.dispatch(
            actions.doctor.filterHospitals(data)
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

DoctorAddClinic.propTypes = {
    doctor_list : PropTypes.array.isRequired,
    selected_city : PropTypes.array.isRequired,
    specialization_list : PropTypes.array.isRequired,
    selected_specialization : PropTypes.array.isRequired,
    city_list : PropTypes.array.isRequired,
    label: PropTypes.string,
    searchable: PropTypes.bool.isRequired,
}

DoctorAddClinic.defaultProps = {
    doctor_list: [],
    city_list: [],
    selected_city: [],
    specialization_list: [],
    selected_specialization: [],
    label : "demo",
    searchable : true
}

export default DoctorAddClinic
