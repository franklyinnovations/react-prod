import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../../api/config';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Select from '../../components/Select';
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
        Label
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

export default class ShiftDoctorFront extends React.Component {
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

      var allTimes = {};
      days.days.map(function (value, index) {
        allTimes[`shift_1_from_${value.key}`] = timeData(0);
        allTimes[`ref_${value.key}`] = true;
      });

      this.state = _.extend({copyAll : false}, allTimes, days, weekDays);

      this.changeTiming = event => {
            let value;
            if (event.target.type === 'checkbox')
            value = event.target.checked;
            else
            value = event.target.value;
            this.changeOpenTime(event.target.name, value);
      }

      this.func_copy_week_days = event => {
        let value, _ref = this;
        if (event.target.type === 'checkbox')
            value = event.target.checked;
        else
            value = event.target.value;
        
        if(value === true){

            if(this.state.shift_1_from_mon_val !== undefined && this.state.shift_1_to_mon_val !== undefined 
            && this.state.shift_2_from_mon_val !== undefined && this.state.shift_2_to_mon_val !== undefined){
                
                var allTimes = {};

                _ref.state.weekDays.map(function (value, index) {
                allTimes[`shift_1_from_${value.key}`] = timeData(0);
                allTimes[`shift_1_to_${value.key}`] = timeData(0);
                allTimes[`shift_2_to_${value.key}`] = timeData(0);
                allTimes[`shift_2_from_${value.key}`] = timeData(0);
                allTimes[`ref_${value.key}`] = true;
                });

                _ref.setState(allTimes, () => {
                
                var myVal = {};

                _ref.state.weekDays.map(function(dayObj, dayIndex){
                    myVal[`shift_1_from_${dayObj.key}_val`] = _ref.state.shift_1_from_mon_val;
                    myVal[`shift_1_to_${dayObj.key}_val`] = _ref.state.shift_1_to_mon_val;
                    myVal[`shift_2_to_${dayObj.key}_val`] = _ref.state.shift_2_to_mon_val;
                    myVal[`shift_2_from_${dayObj.key}_val`] = _ref.state.shift_2_from_mon_val;
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
            myVal[`shift_1_from_${dayObj.key}_val`] = "";
            myVal[`shift_1_to_${dayObj.key}_val`] = "";
            myVal[`shift_2_to_${dayObj.key}_val`] = "";
            myVal[`shift_2_from_${dayObj.key}_val`] = "";
            });

            if(!_.isEmpty(myVal)){
                _ref.setState(myVal);
            }
        }
    }

      this.handleCopyAll = event => {
            if(!(this.state.copyAll)){

            }
            // let value;
            // if (event.target.type === 'checkbox')
            // value = event.target.checked;
            // else
            // value = event.target.value;
            // this.changeOpenTime(event.target.name, value);
      }

      this.disableRow = this.disableRow.bind(this);
  }

  componentDidUpdate(){

  }

  componentWillMount(){

    if(this.props.hospital !== undefined && this.props.hospital.shift_24X7==1) {
      this.setState({tongleDiv : 'divhide'})
    } else {
      this.setState({tongleDiv : 'divshow'})
    }

    let _ref = this, myVal = {};

    // if(this.props.hospital !== undefined && this.props.hospital.hospital_timings){
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
    if(this.props.hospital !== undefined && this.props.hospital.hospital_timings){
      this.props.hospital.hospital_timings.map(function (value, index) {
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
    myVal[`shift_${shift}_${type}_${daySort}_val`] = time;

    switch (true) {
      case shift === 1 && type === "from":
          myVal[`shift_${shift}_to_${daySort}`] = timeData( time + 1 );
          break;
      case shift === 1 && type === "to":
          myVal[`shift_${shift}_to_${daySort}_val`] = time;
          myVal[`shift_2_from_${daySort}`] = timeData( time + 1 );
          break;
      case shift === 2 && type === "from":
          myVal[`shift_${shift}_to_${daySort}`] = timeData( time + 1 );
          break;
      case shift === 2 && type === "to":
          myVal[`shift_${shift}_to_${daySort}_val`] = time;
          break;
      default:

    }
    this.setState(myVal);
  }

  removeDays(day, index){

    let _ref = this, myVal = {};

    // this.props.hospital.hospital_timings.map(function (data, key) {
    //   if(data.days === day){
    //     _ref.props.hospital.hospital_timings.splice(key, 1);
    //   }
    // });

    if( index > -1 ){
      myVal[`shift_1_from_${day}_val`] = "";
      myVal[`shift_1_to_${day}_val`] = "";
      myVal[`shift_2_to_${day}_val`] = "";
      myVal[`shift_2_from_${day}_val`] = "";
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

  disableRow(day, index){
    let uncheck = {};
    if(this.state[`ref_${day}`]){
      this.removeDays(day, index);
    }
    uncheck[`ref_${day}`] = !this.state[`ref_${day}`];
    this.setState(uncheck)
  }

	render(){
    
    if(false){
      // if(this.props.data.hospital.id == ""){
      return (
          <Row key="hospitalfile-list">
            <Col xs={12}>
            </Col>
          </Row>
        );
    } else {

      let _ref = this;

      return (
        <Row key="additionalinformation-list">
          <Col xs={12} md={12} lg={12}>
              <Form className='imageForm'>

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
                                //value={this.props.hospital['hospital_detail[hospital_name]']}
                                name='consultaion_charge'
                                //onChange={this.handleDataUpdate}
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
                                placeholder="Select Doctor's Appointment Duration"
                                />
                            <HelpBlock>{this.props.errors.appointment_duration}</HelpBlock>
                        </FormGroup>

                        <FormGroup controlId='shift_24X7'>
                            <Checkbox
                                name='shift_24X7'
                                onChange={this.changeTiming}
                                //checked={this.props.hospital.shift_24X7}
                                >
                                {__('Available on request')}
                            </Checkbox>
                            <Checkbox
                                name='copy_same_on_weekdays'
                                onChange={this.func_copy_week_days}
                                //checked={this.props.hospital.copy_week_days}
                                disabled={this.props.basicDetails.is_freeze === 1 ? true : false}
                                >
                                {`Copy same time on weekdays`}
                            </Checkbox>
                        </FormGroup>
                    </Col>

                   

                    <Col xs={12} md={12} lg={12}></Col>
                  <Col >

                   
                  <Col xs={12} md={12} lg={12} className={this.state.tongleDiv}>
                        <Table striped bordered condensed hover responsive>
                          <tbody>

                            <tr>
                              <th></th>
                              <th>
                                Day
                              </th>
                              <th colSpan={2} >
                                Shift 1
                              </th>
                              <th colSpan={2}>
                                Shift 2
                              </th>
                              <th>
                                Action
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
                                                    checked={ _ref.state[`ref_${value.key}`] }
                                                    >
                                                </Checkbox>
                                            </FormGroup>
                                          </td>
                                          <td>
                                            { value.title }
                                          </td>
                                          <td>
                                            <RSelect
                                                disabled={!_ref.state[`ref_${value.key}`]}
                                                onChange={(event) => _ref.handleChange(event.value, 1, "from", value.key, value.title)}
                                                value={_ref.state[`shift_1_from_${value.key}_val`]}
                                                options={_ref.state[`shift_1_from_${value.key}`]}
                                                placeholder="From"
                                                />
                                          </td>
                                          <td>
                                            <Select
                                                disabled={!_ref.state[`ref_${value.key}`]}
                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 1, "to", value.key, value.title)}
                                                value={_ref.state[`shift_1_to_${value.key}_val`]}
                                                options={_ref.state[`shift_1_to_${value.key}`]}
                                                placeholder="To"
                                                />
                                          </td>
                                          <td>
                                            <Select
                                                disabled={!_ref.state[`ref_${value.key}`]}
                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "from", value.key, value.title)}
                                                value={_ref.state[`shift_2_from_${value.key}_val`]}
                                                options={_ref.state[`shift_2_from_${value.key}`]}
                                                placeholder="From"
                                                />
                                          </td>
                                          <td>
                                            <Select
                                                disabled={!_ref.state[`ref_${value.key}`]}
                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "to", value.key, value.title)}
                                                value={_ref.state[`shift_2_to_${value.key}_val`]}
                                                options={_ref.state[`shift_2_to_${value.key}`]}
                                                placeholder="To"
                                                />
                                          </td>
                                          <td>
                                          <Icon
                                              className={'fg-brown'}
                                              style={{fontSize: 20}}
                                              glyph={'icon-simple-line-icons-close'}
                                              data-id={index}
                                              onClick={() => _ref.removeDays(value.key, index)}
                                            />
                                            {/* <Button bsStyle="danger" onClick={ () => _ref.removeDays(value.key, index) }> {__('Clear')} </Button> */}
                                          </td>
                                        </tr>;
                              })}
                          </tbody>
                        </Table>

                       
                  </Col>
                  </Col>
              </Form>
          </Col>

          <Col xs={12}>
            <Col xs={12}>
                            <div>
                                <Button
                                    outlined
                                    className="btn btn-primary pull-right"
                                    bsStyle='lightgreen'
                                    onClick={this.props.onHide }
                                    >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    outlined
                                    className="btn btn-primary pull-right"
                                    bsStyle='lightgreen'
                                    onClick={ () => ::_ref.save() }
                                  >
                                    {__('Submit')}
                                </Button>
                            </div>
                          <br/>
                        </Col>
          </Col>
        </Row>
      );

    }
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

save(){
  
  var timeSaveObj = { time : {}}, finalArr = [], df = {};
  let _ref = this;
  this.state.days.map(function (value, index){

    if(!timeSaveObj['time'][index]){
      timeSaveObj['time'][index] = {};
    }

    timeSaveObj['time'][index]['days'] = value.key;

    if(_ref.state[`shift_1_from_${value.key}_val`]){
      timeSaveObj['time'][index]['shift_1_from_time'] = _ref.getTimeLabel(_ref.state[`shift_1_from_${value.key}_val`]);
      timeSaveObj['time'][index]['shift_1_from_key'] = _ref.state[`shift_1_from_${value.key}_val`];
    }

    if(_ref.state[`shift_1_to_${value.key}_val`]) {
      timeSaveObj['time'][index]['shift_1_to_time'] = _ref.getTimeLabel(_ref.state[`shift_1_to_${value.key}_val`]);
      timeSaveObj['time'][index]['shift_1_to_key'] = _ref.state[`shift_1_to_${value.key}_val`];
    }

    if(_ref.state[`shift_2_from_${value.key}_val`]) {
      timeSaveObj['time'][index]['shift_2_from_time'] = _ref.getTimeLabel(_ref.state[`shift_2_from_${value.key}_val`]);
      timeSaveObj['time'][index]['shift_2_from_key'] = _ref.state[`shift_2_from_${value.key}_val`];
    }

    if(_ref.state[`shift_2_to_${value.key}_val`]) {
      timeSaveObj['time'][index]['shift_2_to_time'] = _ref.getTimeLabel(_ref.state[`shift_2_to_${value.key}_val`]);
      timeSaveObj['time'][index]['shift_2_to_key'] = _ref.state[`shift_2_to_${value.key}_val`];
    }
  });

  // console.log(this.props.currentHospital);
  

  for (var key in timeSaveObj.time) {
    if (timeSaveObj.time.hasOwnProperty(key)) {
        if(timeSaveObj.time[key].shift_1_from_time){
          finalArr.push({
            hospitalId : this.props.currentHospital.id,
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

  // if(this.props.hospital.hospital_timings){
  //   finalArr = _.unionBy(finalArr, this.props.hospital.hospital_timings, "days");
  // }

  df['consultation_charge'] = this.consultaion_charge.value;
  df['appointment_duration'] = _ref.getTimeLabelNew(_ref.state.selected_appointment_duration);
  df['hospitalId'] = this.props.currentHospital.id;
  df['doctorProfileId'] = this.props.basicDetails.id;
  df['available_on_req'] = this.state.available_on_req;
  df['timers'] = finalArr;
  
  this.props.dispatch(
      actions.doctor_profile.addDoctorTime(this.props, df)
  );
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
	}else{
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
