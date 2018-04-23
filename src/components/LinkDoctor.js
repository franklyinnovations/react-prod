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
import EditDurationModal from '../components/EditDurationModal';
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
        Popover,
        HelpBlock,
        Well,
        Label,
        BPanel,
        Modal,
        OverlayTrigger,
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
  lang: state.lang,
  ...state.view.hospital
}))

class LinkDoctor extends React.Component {

  constructor(props) {
      super(props);

      this.state = { selected_city : [], selected_specialization : [], showModal : false, showDurationModal : false, currentDurationObj : {}, currentUser : {} };
      this.editDurationFunc = this.editDurationFunc.bind(this);
  }
  
  handleDataUpdate = selected_city => {
		this.setState({ selected_city });
  }

  handleSpecializationUpdate = selected_specialization => {
    this.setState({ selected_specialization });
  }

  async componentWillMount(){
    
    const  doctors  = this.props.hospital.doctors_list_all;
    
    let _ref = this;

    //Get specialization_list
    let obj = await utilsActions.serviceTag(this.props, 2);
    let city_list = await utilsActions.getAllCityAtOnce(this.props);
    _.merge(this.props.specialization_list, obj);
    _.merge(this.props.city_list, city_list);
    
    if(doctors){
      doctors.map(function (item, i){
        _ref.props.doctor_list.push({
          value : item.id,
          label : item.doctorprofiledetails[0].name + " (" + item.mobile + ")"
        });
      })
    }
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

    let tagtypeIds = utilsActions.tagtypeIds();
    let specializationTagId = tagtypeIds.SpecializationTagId;
    let specializationTags = [], education = [];
    item.doctortags.map((tagdetails) => {
      if(tagdetails.tagtypeId == specializationTagId) specializationTags.push(tagdetails.tagdetail.title)
    })

    let getTotalExperience = utilsActions.getTotalExperienceOfDoctor(item.doctorexperiences)
    item.doctoreducations.map((conItem) => {
      education.push(conItem.doctoreducationtagdetail.title)
    })

    return(
      <Well key={'spp-'+index}>
        <Row>
          <Col xs={12} md={2} lg={2}>
            <Image src={imageUrl + '/' + item.doctor_profile_pic} circle />
          </Col>
          <Col xs={12} md={7} lg={7}>
            <h4>{`${item.salutation} ${item.doctorprofiledetails[0].name}` }</h4>
            <p>
              {specializationTags.join(" , ")} { specializationTags.length > 0 && " | " }
              { education.join(" , ") } { education.length > 0 && " | " }
              { getTotalExperience > 0 ? getTotalExperience+__(" year(s) exp.") : null }
              { (specializationTags.length > 0 || education.length > 0 || getTotalExperience > 0) && <br/> }
              
              { contactInfo.length > 0 ? contactInfo.join(" | ") : null }<br/>
              {item.doctorprofiledetails[0].address_line_1} | {item.citydetail.name} | {item.statedetail.name} | {item.countrydetail.name}
            </p>
          </Col>
          <Col xs={12} md={3} lg={3}>
            { !_.isEmpty(_ref.props.hospital.hospital_doctors) && _ref.props.hospital.hospital_doctors.map(function (value) {
              if(value.doctorprofileId === item.id){
                show = false;
              }
            }) }

            { show ?
            <Button
                outlined
                bsStyle='lightgreen'
                onClick={ () => this.setState({ showModal : true, currentUser : item}) }
                >
                {__('Add')}
            </Button> : <Button
                outlined
                bsStyle='danger'
                >
                {__('Already Mapped')}
            </Button> }
          </Col>
        </Row>
      </Well>
    );
  }

  editDurationFunc(obj){
    this.setState({ showDurationModal : true, currentDurationObj : obj });
  }

	render(){
    let __ = makeTranslater(
      this.props.translations,
      this.props.lang.code
    );
    const { doctor_list, specialization_list, city_list } = this.props;
    const { selected_city, selected_specialization } = this.state;
    let _ref = this, filtered_doctor_list = this.props.hospital.filtered_doctor_list ? this.props.hospital.filtered_doctor_list.filtered_doctor_list : {};
    let lgClose = () => this.setState({ showModal : false }, function () {
      return _ref.props.dispatch({
        type: 'INIT_ERRORS'
      });
    });

    let lgCloseDuration = () => this.setState({ showDurationModal : false }, function () {
      return _ref.props.dispatch({
        type: 'INIT_ERRORS'
      });
    });
    
    let contactEmail = [], contactMobiles = [];
    if(_ref.props.mappedDoctors.length > 0) {
        _ref.props.mappedDoctors.map((itemss) => {
            itemss.doctorprofile.contactinformations.map((innerItem) => {
                if(innerItem.type === "email") contactEmail.push(innerItem.value)
                if(innerItem.type === "mobile") contactMobiles.push(innerItem.value)
            })
        })
    }

    return (
      <Row>
      { !_.isEmpty(_ref.props.mappedDoctors) && 
        <Col sm={12}>
        <Table striped bordered condensed hover responsive>
          <tbody>
            
            <tr>
              <th className="text-center">
                Doctor Name
              </th>
              <th className="text-center">
                Contact Detail
              </th>
              <th className="text-center">
                Appointment Duration ( In Minutes )
              </th>
              <th className="text-center">
                Consultation Charge
              </th>
              <th className="text-center">
                Timings
              </th>
              <th className="text-center">
                Action
              </th>
            </tr>

            { _ref.props.mappedDoctors.map(function(value, index){
                
                let param = { hospitalId : value.hospitalId, doctorprofileId : value.doctorprofileId };
                let timeHtml = "";
                if(value.available_on_req === 0) { 
                  timeHtml = (
                    <Table striped bordered condensed hover responsive key={index}>
                      <tbody>

                        <tr>
                          <th>
                            {__('Day')}
                          </th>
                          <th>
                            {__('1st shift start time')}
                          </th>
                          <th>
                            {__('1st shift end time')}
                          </th>
                          <th>
                            {__('2nd shift start time')}
                          </th>
                          <th>
                            {__('2nd shift end time')}
                          </th>
                        </tr>

                        {value.hospital_doctor_timings.map(function (dayV, Id2) {
                          return (
                            <tr key={Id2}>
                              <td>
                                {dayV.days}
                              </td>
                              <td>
                                {dayV.shift_1_from_time.toHHMMSS()}
                              </td>
                              <td>
                                {dayV.shift_1_to_time.toHHMMSS()}
                              </td>
                              <td>
                                {dayV.shift_2_from_time.toHHMMSS()}
                              </td>
                              <td>
                                {dayV.shift_2_to_time.toHHMMSS()}
                              </td>
                            </tr>
                          )
                        }) }
                      </tbody>
                    </Table>
                  );
                }
                
                return <tr key={index}>
                          <td className="text-center">
                              { `${value.doctorprofile.salutation} ${value.doctorprofile.doctorprofiledetails[0].name}` }
                          </td>
                          <td className="text-center">
                              {__('Email')} : { _.map(value.doctorprofile.contactinformations, function(o) {
                                          if (o.type === "email") return o.value.trim();
                                        }).join(" | ") 
                                      }<br/>
                              {__('Mobile')} : { _.map(value.doctorprofile.contactinformations, function(o) {
                                          if (o.type === "mobile") return o.value.trim();
                                        }).join(" | ") 
                                      }
                          </td>
                          <td className="text-center">
                            {`${value.appointment_duration} mins`}
                          </td>
                          <td className="text-center">
                            {`${value.consultation_charge}$`}
                          </td>
                          <td className="text-center">
                              { value.available_on_req === 1 ? __("Available on request") : "" }
                              { value.available_on_req === 0 &&  
                              <OverlayTrigger trigger={["click"]} placement="bottom" overlay={<Popover id='popover-bottom-2' title={ value.doctorprofile.doctorprofiledetails[0].name + __(' timings') }>{timeHtml}</Popover>}>
                                <Button bsStyle="default">{__('Check timings')}</Button>
                              </OverlayTrigger> }
                          </td>
                          <td className="text-center">
                              <Icon
                                className={'fg-brown'}
                                style={{fontSize: 20}}
                                glyph={'icon-simple-line-icons-note rubix-icon'}
                                data-id={index}
                                onClick={ () => _ref.editDurationFunc(value) }
                              />
                              <Icon
                                  className={'fg-brown'}
                                  style={{fontSize: 20}}
                                  glyph={'icon-simple-line-icons-trash rubix-icon'}
                                  data-id={index}
                                  onClick={() => _ref.unmap(param)}
                                />
                          </td>
                        </tr>;
              }) }
          </tbody>
        </Table>
        </Col> }
        <Col sm={12}>
      <BPanel header={__('Find Doctor')}>
          <Form>
      		  <Row key="doctors-list">

                <Col xs={6} md={6} lg={6}>
                  <FormGroup
                      controlId='name'
                      >
                      <ControlLabel>{__('Doctor')}</ControlLabel>
                      <FormControl
                          type='text'
                          placeholder={__('Enter Doctor Name')}
                          inputRef={(ref) => {this.doctor_name = ref}}
                          //value={this.props.hospital['hospital_detail[hospital_name]']}
                          name='hospital_detail[hospital_name]'
                          //onChange={this.handleDataUpdate}
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
                          options={ city_list }
                          //simpleValue
                          //clearable={true}
                          removeSelected={true}
                          // name="selected-state"
                          // disabled={this.state.disabled}
                          value={selected_city}
                          onChange={this.handleDataUpdate.bind(this)}
                          // rtl={this.state.rtl}
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
                          inputRef={(ref) => {this.doctor_email = ref}}
                          //onChange={this.handleDataUpdate}
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
                          inputRef={(ref) => {this.doctor_mobile = ref}}
                          />
                  </FormGroup>
                </Col>

                <Col xs={12} md={12} lg={12}>
                  <FormGroup
                      controlId='specialization'
                      >
                      <ControlLabel>{__('Specialization *')}</ControlLabel>

                      <Select
                          multi
                          options={ specialization_list }
                          clearable={true}
                          value={selected_specialization}
                          onChange={this.handleSpecializationUpdate.bind(this)}
                          // rtl={this.state.rtl}
                          openOnClick={false}
                          searchable={true}
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
                      </Button>
                  </div>
                </Col>

              

              <Col xs={12} md={12} lg={12}>
                <br/>
                  { !_.isEmpty(filtered_doctor_list) && filtered_doctor_list.map(this.renderRow, this) }

                  {!_.isEmpty(filtered_doctor_list) && <Pagination
                  data={this.props.hospital.filtered_doctor_list}
                  onSelect={::this.save}
                  />}
              </Col>

              <MyLargeModal { ...this.props } show={this.state.showModal} currentUser={this.state.currentUser} onHide={lgClose} type="doctor"/>
                  { this.state.showDurationModal && <EditDurationModal { ...this.props } currentUser={this.state.currentDurationObj.doctorprofile} show={this.state.showDurationModal} currentDurationObj={this.state.currentDurationObj} onHide={lgCloseDuration} type="doctor"/> }
            </Row>
          </Form>
      </BPanel>
      </Col>
      </Row>
	 );
  }

  unmap(param){
    vex.dialog.open({
      message: window.__("Are you sure to remove this doctor?"),
      buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
      ],
      callback: (status) => {
        if(status) {
          this.props.dispatch(
            actions.hospital.unmapdoc(this.props, param)
          );
        }
      }
    });
  }

  save(page = null){
    
    const { selected_city, selected_specialization } = this.state;
    let data = { name : '', mobile : '', email : '', page : 1 };

    if(this.doctor_name.value){
      data['name'] = this.doctor_name.value;
    }

    if(page !== null){
      data['page'] = page;
    }

    if(this.doctor_mobile.value){
      data['mobile'] = this.doctor_mobile.value;
    }
    if(this.doctor_email.value){
      data['email'] = this.doctor_email.value;
    }

    let cityArr = selected_city.map(function (item){
      return item.value;
    })

    let specializationArr = selected_specialization.map(function (item){
      return item.value;
    })

    data['selected_city'] = cityArr;
    data['selected_specialization'] = specializationArr;
    data['language'] = this.props.lang;
    this.props.dispatch(
     actions.hospital.filterDoctors(data)
    );
  }

}

LinkDoctor.propTypes = {
  doctor_list : PropTypes.array.isRequired,
  //filtered_doctor_list : PropTypes.array.isRequired,
  selected_city : PropTypes.array.isRequired,
  specialization_list : PropTypes.array.isRequired,
  selected_specialization : PropTypes.array.isRequired,
  city_list : PropTypes.array.isRequired,
	label: PropTypes.string,
	searchable: PropTypes.bool.isRequired,
}

LinkDoctor.defaultProps = {
  doctor_list: [],
  //filtered_doctor_list : [],
  city_list: [],
  selected_city: [],
  specialization_list: [],
  selected_specialization: [],
  label : "demo",
  searchable : true
}

export default LinkDoctor
