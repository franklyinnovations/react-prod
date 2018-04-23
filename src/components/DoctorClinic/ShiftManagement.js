import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../../api/config';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Select from '../Select';
import RSelect from 'react-select';
import makeTranslater from '../../translate';
import {getStatusLabel,getTagType,serviceTag,specialTag,timeData, timeDropdown} from '../../utils';
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
} from '@sketchpixy/rubix';
import Alert from 'react-s-alert';

var _ = require('lodash');
var moment = require('moment');

var DateTimeField = require('react-bootstrap-datetimepicker');
@connect()

export default class ShiftManagement extends React.Component {
  
  constructor(props) {
      super(props);

      var days =
        {
          days : [
          {key : 'mon', title : __('Monday')},
          {key : 'tue', title : __('Tuesday')},
          {key : 'wed', title : __('Wednesday')},
          {key : 'thu', title : __('Thrusday')},
          {key : 'fri', title : __('Friday')},
          {key : 'sat', title : __('Saturday')},
          {key : 'sun', title : __('Sunday')}
        ]
      };

      var weekDays =
        {
          weekDays : [
          {key : 'tue', title : __('Tuesday')},
          {key : 'wed', title : __('Wednesday')},
          {key : 'thu', title : __('Thrusday')},
          {key : 'fri', title : __('Friday')},
        ]
      };

      var allTimes = { };
      days.days.map(function (value, index) {
        allTimes[`shift_1_from_${value.key}s`] = timeData(0);
        allTimes[`ref_${value.key}s`] = true;
      });

      this.state = _.extend({copyAll : false, available_on_req : false }, allTimes, days, weekDays);

      this.changeTiming = event => {
            let value;
            if (event.target.type === 'checkbox')
              value = event.target.checked;
            else
              value = event.target.value;
            this.changeOpenTime(event.target.name, value);
      }

      this.disableRow = this.disableRow.bind(this);

      this.func_copy_week_days = event => {
        let value, _ref = this;
        if (event.target.type === 'checkbox')
          value = event.target.checked;
        else
          value = event.target.value;
        
        if(value === true){

          if(this.state.shift_1_from_mons_val !== undefined && this.state.shift_1_to_mons_val !== undefined 
            && this.state.shift_2_from_mons_val !== undefined && this.state.shift_2_to_mons_val !== undefined){
              
              var allTimes = {};

              _ref.state.weekDays.map(function (value, index) {
                allTimes[`shift_1_from_${value.key}s`] = timeData(0);
                allTimes[`shift_1_to_${value.key}s`] = timeData(0);
                allTimes[`shift_2_to_${value.key}s`] = timeData(0);
                allTimes[`shift_2_from_${value.key}s`] = timeData(0);
                allTimes[`ref_${value.key}s`] = true;
              });

              _ref.setState(allTimes, () => {
                
                var myVal = {};

                _ref.state.weekDays.map(function(dayObj, dayIndex){
                  myVal[`shift_1_from_${dayObj.key}s_val`] = _ref.state.shift_1_from_mons_val;
                  myVal[`shift_1_to_${dayObj.key}s_val`] = _ref.state.shift_1_to_mons_val;
                  myVal[`shift_2_to_${dayObj.key}s_val`] = _ref.state.shift_2_to_mons_val;
                  myVal[`shift_2_from_${dayObj.key}s_val`] = _ref.state.shift_2_from_mons_val;
                });

                if(!_.isEmpty(myVal)){
                  _ref.setState(myVal);
                }
              });

          } else {
            Messenger().post({
              type: 'error',
              message: "Please enter monday\'s entry first"
            });
            return false;
          }
        } else {
          
          var myVal = {};
          _ref.state.weekDays.map(function(dayObj, dayIndex){
            myVal[`shift_1_from_${dayObj.key}s_val`] = "";
            myVal[`shift_1_to_${dayObj.key}s_val`] = "";
            myVal[`shift_2_to_${dayObj.key}s_val`] = "";
            myVal[`shift_2_from_${dayObj.key}s_val`] = "";
          });

          if(!_.isEmpty(myVal)){
            _ref.setState(myVal);
          }
        }
      }

  }

  componentDidUpdate(){

  }

  componentWillMount(){

    let _ref = this, myVal = {};

    // if(this.props.hospital.hospital_timings){
    //   this.props.hospital.hospital_timings.map(function (value, index) {
    //     _ref.state.days.map(function(dayObj, dayIndex){
    //       if(value.days === dayObj.key){
    //         myVal[`shift_1_from_${dayObj.key}_val`] = value.shift_1_from_key;
    //         myVal[`shift_1_to_${dayObj.key}_val`] = value.shift_1_to_key;
    //         myVal[`shift_1_to_${dayObj.key}`] = timeData(value.shift_1_to_key);
    //         myVal[`shift_2_to_${dayObj.key}_val`] = value.shift_2_to_key;
    //         myVal[`shift_2_to_${dayObj.key}`] = timeData(value.shift_2_to_key);
    //         myVal[`shift_2_from_${dayObj.key}_val`] = value.shift_2_from_key;
    //         myVal[`shift_2_from_${dayObj.key}`] = timeData(value.shift_2_from_key);
    //       }
    //     })
    //   })
    // }

    if(!_.isEmpty(myVal)){
      this.setState(myVal);
    }

  }

  isShowDelete(day){
    let returnVal = false;
    if(this.props.hospitalTimings){
      this.props.hospitalTimings.map(function (value, index) {
        if(value.days === day){
          returnVal = true;
          return;
        }
      })
    }
    return returnVal;
  }

  handleChange = (time, shift, type, daySort, dayTitle) => {

    let myVal = {};
    myVal[`shift_${shift}_${type}_${daySort}s_val`] = time;

    switch (true) {
      case shift === 1 && type === "from":
          myVal[`shift_${shift}_to_${daySort}s`] = timeData( time + 1 );
          break;
      case shift === 1 && type === "to":
          myVal[`shift_${shift}_to_${daySort}s_val`] = time;
          myVal[`shift_2_from_${daySort}s`] = timeData( time + 1 );
          break;
      case shift === 2 && type === "from":
          myVal[`shift_${shift}_to_${daySort}s`] = timeData( time + 1 );
          break;
      case shift === 2 && type === "to":
          myVal[`shift_${shift}_to_${daySort}s_val`] = time;
          break;
      default:

    }
    this.setState(myVal);
  }

  removeDays(day, index){

    let _ref = this, myVal = { selected_appointment_duration : null, consultaion_charge : null };

    this.props.hospitalTimings.map(function (data, key) {
      if(data.days === day){
        _ref.props.hospitalTimings.splice(key, 1);
      }
    });

    if( index > -1 ){
      myVal[`shift_1_from_${day}s_val`] = "";
      myVal[`shift_1_to_${day}s_val`] = "";
      myVal[`shift_2_to_${day}s_val`] = "";
      myVal[`shift_2_from_${day}s_val`] = "";
      this.setState(myVal);
    }
  }

  getTimeLabel(index){
    var arr = timeData(0), time = null;
    arr.map(function(value, key){
      if(value.value === index && !time){
        time = value.seconds;
        return;
      }
    });

    if(time) return time;
  }

  getTimeLabelNew(index){
    var arr = timeDropdown(0), time = null;
    arr.map(function(value, key){
      if(value.value === index && !time){
        time = value.seconds;
        return;
      }
    });

    if(time) return time;
  }

  disableRow(day, index){
    let uncheck = {};
    if(this.state[`ref_${day}s`]){
      this.removeDays(day, index);
    }
    uncheck[`ref_${day}s`] = !this.state[`ref_${day}s`];
    this.setState(uncheck)
  }

	render(){

    let _ref = this;
    
    return (
      <Col xs={12} md={12} lg={12}>

          <FormGroup
              controlId='name'
              validationState={this.props.state.errors.consultation_charge ? 'error': null}
              >
              <ControlLabel>{__('Consultation Charges')}</ControlLabel>
              <FormControl
                  type='text'
                  placeholder={__("Enter Doctor's Consultaion Charges for each visit")}
                  inputRef={(ref) => {this.consultaion_charge = ref}}
                  //value={this.props.hospital['hospital_detail[hospital_name]']}
                  name='consultaion_charge'
                  //onChange={this.handleDataUpdate}
                  />
              <HelpBlock>{this.props.state.errors.consultation_charge}</HelpBlock>
          </FormGroup>

          <FormGroup
              controlId='appointment_duration'
              validationState={this.props.state.errors.appointment_duration ? 'error': null}
              >
              <ControlLabel>{__('Appointment Duration')}</ControlLabel>
              <Select
                  //ref={(ref) => {this.selected_appointment_duration33 = ref}}
                  // disabled={!_ref.state[`ref_${value.key}`]}
                  onChange={(event) => _ref.setState({selected_appointment_duration : event.target ? event.target.value : event.value})}
                  value={ _ref.state.selected_appointment_duration }
                  searchable={false}
                  options={timeDropdown(0)}
                  placeholder={__("Select Doctor's Appointment Duration")}
                  />
              <HelpBlock>{this.props.state.errors.appointment_duration}</HelpBlock>
          </FormGroup>

          <FormGroup>
              <Checkbox
                  inline
                  //inputRef={ ref => { this.input = ref } }
                  onChange={ () => this.setState({available_on_req : !this.state.available_on_req }) }
                  checked={ _ref.state.available_on_req }
                  >

                  {__('Available on request')}

              </Checkbox>
              <Checkbox
                  name='copy_same_on_weekdays'
                  onChange={this.func_copy_week_days}
                  >
                  {__('Copy same time on weekdays')}
              </Checkbox>
          </FormGroup>

          { !this.state.available_on_req && 
          <Table striped bordered condensed hover responsive>
            <tbody>

              <tr>
                <th></th>
                <th>
                  {__('Day')}
                </th>
                <th colSpan={2} >
                  {__('Shift 1')}
                </th>
                <th colSpan={2}>
                  {__('Shift 2')}
                </th>
                <th>
                  {__('Action')}
                </th>
              </tr>
              { _ref.state.days.map(function(value, index){
                  return <tr key={index}>
                            <td>
                              <FormGroup>
                                  <Checkbox
                                      inline
                                      //inputRef={ ref => { this.input = ref } }
                                      onChange={ () => _ref.disableRow(value.key, index) }
                                      checked={ _ref.state[`ref_${value.key}s`] }
                                      >
                                  </Checkbox>
                              </FormGroup>
                            </td>
                            <td>
                                { value.title }
                            </td>
                            <td>
                              <FormGroup validationState={ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_1_from_time) ? "error" : ""}>
                                <RSelect
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.value, 1, "from", value.key, value.title)}
                                    value={_ref.state[`shift_1_from_${value.key}s_val`]}
                                    options={_ref.state[`shift_1_from_${value.key}s`]}
                                    placeholder={__("From")}
                                    />
                                  <HelpBlock>{ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_1_from_time) ? _ref.props.state.errors[value.key].shift_1_from_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_1_to_time) ? "error" : ""}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 1, "to", value.key, value.title)}
                                    value={_ref.state[`shift_1_to_${value.key}s_val`]}
                                    options={_ref.state[`shift_1_to_${value.key}s`]}
                                    placeholder={__("To")}
                                    />
                                <HelpBlock>{ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_1_to_time) ? _ref.props.state.errors[value.key].shift_1_to_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_2_from_time) ? "error" : ""}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "from", value.key, value.title)}
                                    value={_ref.state[`shift_2_from_${value.key}s_val`]}
                                    options={_ref.state[`shift_2_from_${value.key}s`]}
                                    placeholder={__("From")}
                                    />
                                <HelpBlock>{ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_2_from_time) ? _ref.props.state.errors[value.key].shift_2_from_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_2_to_time) ? "error" : ""}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "to", value.key, value.title)}
                                    value={_ref.state[`shift_2_to_${value.key}s_val`]}
                                    options={_ref.state[`shift_2_to_${value.key}s`]}
                                    placeholder={__("To")}
                                    />
                                <HelpBlock>{ ( _ref.props.state.errors[`${value.key}`] !== undefined && _ref.props.state.errors[`${value.key}`].shift_2_to_time) ? _ref.props.state.errors[value.key].shift_2_to_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                                <Button bsStyle="danger" onClick={ () => _ref.removeDays(value.key, index) }> {__('Clear')} </Button>
                            </td>
                          </tr>;
                })}
            </tbody>
              </Table> }

          <Col className="pull-right">
              <Button
                  outlined
                  bsStyle='lightgreen'
                  onClick={this.props.onHide}
                  >
                  {__('Cancel')}
              </Button>{' '}
              <Button
                  outlined
                  bsStyle='lightgreen'
                  onClick={ () => ::_ref.save() }
                >
                  {__('Submit')}
              </Button>
          </Col>
      </Col>
        );
  }

  save(){
    
    let hospitalId = null;
    
    if(this.props.type === "doctor"){
      hospitalId = this.props.state.basicDetails.id;
    }

    if(this.props.type === "hospital"){
      hospitalId = this.props.state.currentHospital.id;
    }
    
    var timeSaveObj = { hospitalId : hospitalId, time : {}}, timers = [], finalArr = {};
    let _ref = this;
    this.state.days.map(function (value, index){

      if(!timeSaveObj['time'][index]){
        timeSaveObj['time'][index] = {};
      }

      timeSaveObj['time'][index]['days'] = value.key;

      if(_ref.state[`shift_1_from_${value.key}s_val`]){
        timeSaveObj['time'][index]['shift_1_from_time'] = _ref.getTimeLabel(_ref.state[`shift_1_from_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_1_from_key'] = _ref.state[`shift_1_from_${value.key}s_val`];
      }

      if(_ref.state[`shift_1_to_${value.key}s_val`]) {
        timeSaveObj['time'][index]['shift_1_to_time'] = _ref.getTimeLabel(_ref.state[`shift_1_to_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_1_to_key'] = _ref.state[`shift_1_to_${value.key}s_val`];
      }

      if(_ref.state[`shift_2_from_${value.key}s_val`]) {
        timeSaveObj['time'][index]['shift_2_from_time'] = _ref.getTimeLabel(_ref.state[`shift_2_from_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_2_from_key'] = _ref.state[`shift_2_from_${value.key}s_val`];
      }

      if(_ref.state[`shift_2_to_${value.key}s_val`]) {
        timeSaveObj['time'][index]['shift_2_to_time'] = _ref.getTimeLabel(_ref.state[`shift_2_to_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_2_to_key'] = _ref.state[`shift_2_to_${value.key}s_val`];
      }
    });

    for (var key in timeSaveObj.time) {
      if (timeSaveObj.time.hasOwnProperty(key)) {
          if(timeSaveObj.time[key].shift_1_from_time){
            timers.push({
              //hospitalId : this.props.hospital.id,
              days : timeSaveObj.time[key].days,
              shift_1_from_time : timeSaveObj.time[key].shift_1_from_time,
              shift_1_from_key : timeSaveObj.time[key].shift_1_from_key,
              shift_1_to_time : timeSaveObj.time[key].shift_1_to_time,
              shift_1_to_key : timeSaveObj.time[key].shift_1_to_key,
              shift_2_from_time : timeSaveObj.time[key].shift_2_from_time,
              shift_2_from_key : timeSaveObj.time[key].shift_2_from_key,
              shift_2_to_time : timeSaveObj.time[key].shift_2_to_time,
              shift_2_to_key : timeSaveObj.time[key].shift_2_to_key,
            })
          }
      }
    }

    timers = _.unionBy(timers, {}, "days");

    finalArr['consultation_charge'] = this.consultaion_charge.value;
    finalArr['appointment_duration'] = _ref.getTimeLabelNew(_ref.state.selected_appointment_duration);
    finalArr['hospitalId'] = hospitalId;
    finalArr['doctorProfileId'] = this.props.type === "doctor" ? this.props.currentUser.id : this.props.state.doctorBasicDetails.id;
    finalArr['available_on_req'] = this.state.available_on_req;
    finalArr['timers'] = timers;

    if(this.props.type === "doctor"){
      this.props.state.dispatch(
        actions.doctor_clinic.addDoctorTime(this.props.state, finalArr)
      );
    } else if(this.props.type === "hospital"){
      this.props.state.dispatch(
        actions.hospital_profile.linkClinicTime(this.props.state, finalArr)
      );
    }

    
  }

  updateData(name, value) {
    this.props.state.dispatch({
      type: 'UPDATE_DATA_VALUE',
              value,
              name
    });
  }

  changeOpenTime(name, value) {
    if(value==true){
      this.setState({tongleDiv : 'divhide'})
      value=1;
    } else {
      this.setState({tongleDiv : 'divshow'})
      value=0;
    }
    this.props.state.dispatch(
      actions.doctor_clinic.changeOpen24X7(
              this.props,
              value
              )
      )
      this.props.state.dispatch({
      type: 'UPDATE_DATA_VALUE',
              value,
              name
    });
  }
}
