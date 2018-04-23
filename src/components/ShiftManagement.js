import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../api/config';
import {connect} from 'react-redux';
import actions from '../redux/actions';
import Select from '../components/Select';
import RSelect from 'react-select';
import makeTranslater from '../translate';
import {getStatusLabel,getTagType,serviceTag,specialTag,timeData, timeDropdown} from '../utils';
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
        allTimes[`ref_${value.key}s`] = false;
      });

      this.state = _.extend({copyAll : false, available_on_req : false, makeDisable : false, showCopyAllButtons : {display:'none'}, showFreezeButton : false  }, allTimes, days, weekDays);

      this.changeTiming = event => {
            let value;
            if (event.target.type === 'checkbox')
            value = event.target.checked;
            else
            value = event.target.value;
            this.changeOpenTime(event.target.name, value);
      }

      this.disableRow = this.disableRow.bind(this);
      this.resetAllDaysArr = this.resetAllDaysArr.bind(this);
      
      this.func_copy_week_days_doc_scr = event => {
        event.preventDefault();
        let value, _ref = this;
       
        value = true;
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
            myVal[`ref_${dayObj.key}s`] = false;
          });

          if(!_.isEmpty(myVal)){
            _ref.setState(myVal);
          }
        }
      }
  }

  componentWillMount(){

    let _ref = this, myVal = {};
    
    if(this.props.currentDurationObj !== undefined){

      var arr = timeDropdown(0), time = null;
      
      arr.map(function(value, key){
        if(value.seconds === _ref.props.currentDurationObj.appointment_duration && !time){
          time = value.value;
          return;
        }
      });

      myVal.selected_appointment_duration = time;
      myVal.available_on_req = this.props.currentDurationObj.available_on_req;
      myVal.consultaion_charge = this.props.currentDurationObj.consultation_charge;

      if(this.props.currentDurationObj.hospital_doctor_timings){
          this.props.currentDurationObj.hospital_doctor_timings.map(function (value, index) {
            _ref.state.days.map(function(dayObj, dayIndex){
              if(value.days === dayObj.key){
                myVal[`ref_${dayObj.key}s`] = true;
                myVal[`id_${dayObj.key}`] = value.id;
                myVal[`shift_1_from_${dayObj.key}s_val`] = value.shift_1_from_key;
                myVal[`shift_1_to_${dayObj.key}s_val`] = value.shift_1_to_key;
                myVal[`shift_1_to_${dayObj.key}s`] = timeData(value.shift_1_to_key);
                myVal[`shift_2_to_${dayObj.key}s_val`] = value.shift_2_to_key;
                myVal[`shift_2_to_${dayObj.key}s`] = timeData(value.shift_2_to_key);
                myVal[`shift_2_from_${dayObj.key}s_val`] = value.shift_2_from_key;
                myVal[`shift_2_from_${dayObj.key}s`] = timeData(value.shift_2_from_key);
              }
            });
          });
        }
    }

    if(!_.isEmpty(myVal)){
      this.setState(myVal);
    }

  }

  isShowDelete(day){
    let returnVal = false;
    if(this.props.hospital.hospital_timings){
      this.props.hospital.hospital_timings.map(function (value, index) {
        if(value.days === day){
          returnVal = true;
          return;
        }
      });
    }
    return returnVal;
  }

  handleChange = (time, shift, type, daySort, dayTitle) => {

    let myVal = {};
    myVal[`shift_${shift}_${type}_${daySort}s_val`] = time;

    // console.log(timeData(++time));
    
    let d = 0;
    switch (true) {
      case shift === 1 && type === "from":
          d = parseInt(time) + 1;
          myVal[`shift_${shift}_to_${daySort}s`] = timeData( d );
          break;
      case shift === 1 && type === "to":
          d = parseInt(time) + 1;
          myVal[`shift_${shift}_to_${daySort}s_val`] = time;
          myVal[`shift_2_from_${daySort}s`] = timeData( d );
          break;
      case shift === 2 && type === "from":
          d = parseInt(time) + 1;
          myVal[`shift_${shift}_to_${daySort}s`] = timeData( d );
          break;
      case shift === 2 && type === "to":
          myVal[`shift_${shift}_to_${daySort}s_val`] = time;
          break;
      default:
    }

    let _ref = this;
    
    this.setState(myVal, function () {

        if(_ref.state.shift_1_from_mons_val >= 0 && _ref.state.shift_1_to_mons_val && _ref.state.shift_2_to_mons_val && _ref.state.shift_2_from_mons_val){
            _ref.setState({showCopyAllButtons : { display:'', 'font-size' : 10}});
        } else {
            _ref.setState({showCopyAllButtons : {display:'none'}});
        }
    });

  }

  removeDays(day, index){
    
    let _ref = this, myVal = {};

    if( index > -1 ){
      myVal[`shift_1_from_${day}s_val`] = "";
      myVal[`shift_1_to_${day}s_val`] = "";
      myVal[`shift_2_to_${day}s_val`] = "";
      myVal[`shift_2_from_${day}s_val`] = "";
      this.setState(myVal);
    }
  }

  resetAllDaysArr(){
    let _ref = this, myVal = {};
    
    if(!this.state.available_on_req){
      this.state.days.map(function (item) {
        myVal[`shift_1_from_${item.key}s_val`] = "";
        myVal[`shift_1_to_${item.key}s_val`] = "";
        myVal[`shift_2_to_${item.key}s_val`] = "";
        myVal[`shift_2_from_${item.key}s_val`] = "";
      })
      
      this.setState(myVal);

      this.props.dispatch({
        type: 'INIT_ERRORS'
      });

    }
  }

  getTimeLabel(index){
    var arr = timeData(0), time = null;
    arr.map(function(value, key){
      if(value.value === parseInt(index) && !time){
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
              validationState={this.props.errors.consultation_charge ? 'error': null}
              >
              <ControlLabel>{__('Consultation Charges')}</ControlLabel>
              <FormControl
                  type='number'
                  placeholder={__("Enter Doctor's Consultaion Charges for each visit")}
                  inputRef={(ref) => {this.consultaion_charge = ref}}
                  value={ _ref.state.consultaion_charge }
                  name='consultaion_charge'
                  onChange={(event) => _ref.setState({consultaion_charge : event.target ? event.target.value : event.value})}
                  />
              <HelpBlock>{this.props.errors.consultation_charge}</HelpBlock>
          </FormGroup>

          <FormGroup
              controlId='appointment_duration'
              validationState={this.props.errors.appointment_duration ? 'error': null}
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
              <HelpBlock>{this.props.errors.appointment_duration}</HelpBlock>
          </FormGroup>

          <FormGroup 
            controlId='available_on_reqaa'
            validationState={this.props.errors.timers ? 'error': null}
            >
              <Checkbox
                  inline
                  //inputRef={ ref => { this.input = ref } }
                  onChange={ () => this.setState({ available_on_req : !this.state.available_on_req }, function () {
                    _ref.resetAllDaysArr();
                  }) }
                  checked={ _ref.state.available_on_req }
                  >

                  {__('Available on request')}

              </Checkbox>

              { this.props.errors.timers && <HelpBlock>{this.props.errors.timers}</HelpBlock> }

          </FormGroup>

          { !this.state.available_on_req && 
          <Table striped bordered condensed hover responsive>
            <tbody>

              <tr>
                <th></th>
                <th className="text-center">
                  Day
                </th>
                <th colSpan={2} className="text-center">
                  Shift 1
                </th>
                <th colSpan={2} className="text-center">
                  Shift 2
                </th>
                <th className="text-center">
                  Action
                </th>
              </tr>
              { _ref.state.days.map(function(value, index){
                  return <tr key={index}>
                            <td className="text-center">
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
                            <td className="text-center">
                                { value.title }
                                { value.key.toLowerCase() === "mon" && <div><a 
                                    style={_ref.state.showCopyAllButtons}
                                    onClick={_ref.func_copy_week_days_doc_scr}
                                    href="javascript:void(0)" > {__("Copy to weekdays")} </a></div>}
                            </td>
                            <td>
                              <FormGroup validationState={ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_1_from_time) ? "error" : null}>
                                <RSelect
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.value, 1, "from", value.key, value.title)}
                                    value={_ref.state[`shift_1_from_${value.key}s_val`]}
                                    options={_ref.state[`shift_1_from_${value.key}s`]}
                                    placeholder={__("From")}
                                    />
                                  <HelpBlock>{ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_1_from_time) ? _ref.props.errors[value.key].shift_1_from_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_1_to_time) ? "error" : null}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 1, "to", value.key, value.title)}
                                    value={_ref.state[`shift_1_to_${value.key}s_val`]}
                                    options={_ref.state[`shift_1_to_${value.key}s`]}
                                    placeholder={__("To")}
                                    />
                                <HelpBlock>{ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_1_to_time) ? _ref.props.errors[value.key].shift_1_to_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_2_from_time) ? "error" : null}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "from", value.key, value.title)}
                                    value={_ref.state[`shift_2_from_${value.key}s_val`]}
                                    options={_ref.state[`shift_2_from_${value.key}s`]}
                                    placeholder={__("From")}
                                    />
                                <HelpBlock>{ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_2_from_time) ? _ref.props.errors[value.key].shift_2_from_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td>
                              <FormGroup validationState={ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_2_to_time) ? "error" : null}>
                                <Select
                                    disabled={!_ref.state[`ref_${value.key}s`]}
                                    onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "to", value.key, value.title)}
                                    value={_ref.state[`shift_2_to_${value.key}s_val`]}
                                    options={_ref.state[`shift_2_to_${value.key}s`]}
                                    placeholder={__("To")}
                                    />
                                <HelpBlock>{ ( _ref.props.errors[`${value.key}`] !== undefined && _ref.props.errors[`${value.key}`].shift_2_to_time) ? _ref.props.errors[value.key].shift_2_to_time : ""}</HelpBlock>
                              </FormGroup>
                            </td>

                            <td className="text-center">
                              <Icon
                                  className={'fg-brown'}
                                  style={{fontSize: 20}}
                                  glyph={'icon-simple-line-icons-close'}
                                  data-id={index}
                                  onClick={() => _ref.removeDays(value.key, index)}
                                />
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

              { this.props.currentDurationObj !== undefined && <Button
                  outlined
                  bsStyle='lightgreen'
                  disabled={_ref.state.makeDisable}
                  onClick={ () => ::_ref.save() }
                > {__('Update')} </Button> }

              { this.props.currentDurationObj === undefined && <Button
                outlined
                bsStyle='lightgreen'
                disabled={_ref.state.makeDisable}
                onClick={ () => ::_ref.save() }
              > {__('Submit')} </Button> }
          </Col>
      </Col>
        );
  }

  save(){
    
    let hospitalId = null;
    let isError = false;

    if(this.props.type === "doctor"){
      hospitalId = this.props.hospital.id;
    }

    if(this.props.type === "hospital"){
      hospitalId = this.props.currentHospital.id;
    }
    
    var timeSaveObj = { hospitalId : hospitalId, time : {}}, timers = [], finalArr = {};
    let _ref = this;
    
    

    this.state.days.map(function (value, index){

      if(!timeSaveObj['time'][index]){
        timeSaveObj['time'][index] = {};
      }

      if(_ref.state[`ref_${value.key}s`] && (
        _ref.state[`shift_1_from_${value.key}s_val`] < 0 ||
        !_ref.state[`shift_1_to_${value.key}s_val`] ||
        !_ref.state[`shift_2_from_${value.key}s_val`] ||
        !_ref.state[`shift_2_to_${value.key}s_val`]
      )) {
        isError = true;
        return false;
      }
      
      timeSaveObj['time'][index]['days'] = value.key;
      timeSaveObj['time'][index]['id'] = _ref.state[`id_${value.key}`];

      if(_ref.state[`shift_1_from_${value.key}s_val`] >= 0){
        timeSaveObj['time'][index]['shift_1_from_time'] = _ref.getTimeLabel(_ref.state[`shift_1_from_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_1_from_key'] = _ref.state[`shift_1_from_${value.key}s_val`];
      }

      if(_ref.state[`shift_1_to_${value.key}s_val`] >= 0) {
        timeSaveObj['time'][index]['shift_1_to_time'] = _ref.getTimeLabel(_ref.state[`shift_1_to_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_1_to_key'] = _ref.state[`shift_1_to_${value.key}s_val`];
      }

      if(_ref.state[`shift_2_from_${value.key}s_val`] >= 0) {
        timeSaveObj['time'][index]['shift_2_from_time'] = _ref.getTimeLabel(_ref.state[`shift_2_from_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_2_from_key'] = _ref.state[`shift_2_from_${value.key}s_val`];
      }

      if(_ref.state[`shift_2_to_${value.key}s_val`] >= 0) {
        timeSaveObj['time'][index]['shift_2_to_time'] = _ref.getTimeLabel(_ref.state[`shift_2_to_${value.key}s_val`]);
        timeSaveObj['time'][index]['shift_2_to_key'] = _ref.state[`shift_2_to_${value.key}s_val`];
      }
    });

    
    if(!isError) { 
      for (var key in timeSaveObj.time) {
        if (timeSaveObj.time.hasOwnProperty(key)) {
            if(timeSaveObj.time[key].shift_1_from_time){
              timers.push({
                //hospitalId : this.props.hospital.id,
                days : timeSaveObj.time[key].days,
                id : timeSaveObj.time[key].id,
                shift_1_from_time : timeSaveObj.time[key].shift_1_from_time,
                shift_1_from_key : timeSaveObj.time[key].shift_1_from_key,
                shift_1_to_time : timeSaveObj.time[key].shift_1_to_time,
                shift_1_to_key : timeSaveObj.time[key].shift_1_to_key,
                shift_2_from_time : timeSaveObj.time[key].shift_2_from_time,
                shift_2_from_key : timeSaveObj.time[key].shift_2_from_key,
                shift_2_to_time : timeSaveObj.time[key].shift_2_to_time,
                shift_2_to_key : timeSaveObj.time[key].shift_2_to_key,
              });
            }
        }
      }

      timers = _.unionBy(timers, {}, "days");

      finalArr['consultation_charge'] = this.consultaion_charge.value;
      finalArr['appointment_duration'] = _ref.getTimeLabelNew(_ref.state.selected_appointment_duration);
      finalArr['hospitalId'] = hospitalId;
      finalArr['doctorProfileId'] = this.props.type === "doctor" ? this.props.currentUser.id : this.props.doctorBasicDetails.id;
      finalArr['available_on_req'] = this.state.available_on_req;
      finalArr['timers'] = timers;

      if(this.props.currentDurationObj !== undefined){
        finalArr['id'] = this.props.currentDurationObj.id;
      }
      
      // _ref.setState({makeDisable : true});

      if(this.props.type === "doctor"){
        this.props.dispatch(
          actions.hospital.addDoctorTime(this.props, finalArr)
        );
      } else if(this.props.type === "hospital"){
        this.props.dispatch(
          actions.doctor.linkClinicTime(this.props, finalArr)
        );
      }
    } else {
      alert(window.__("Please complete each row first."));
      return false;
    }
  }

  updateData(name, value) {
    this.props.dispatch({
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
    this.props.dispatch(
      actions.hospital.changeOpen24X7(
              this.props,
              value
              )
      )
      this.props.dispatch({
      type: 'UPDATE_DATA_VALUE',
              value,
              name
    });
  }
}
