import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../../api/config';
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Select from '../Select';
import RSelect from 'react-select';
import makeTranslater from '../../translate';
import {getStatusLabel,getTagType,serviceTag,specialTag,timeData} from '../../utils';
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
@connect(state => ({
session: state.session,
    location: state.location,
    loading: state.view.loading || false,
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_new_clinic_add
}))

export default class Shift extends React.Component {
    constructor(props) {
        super(props);
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        var days = {
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

        var weekDays = {
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

        this.state = _.extend({copyAll : false, showCopyAllButton : {display:'none', 'font-size' : 10}, showFreezeButton : false}, allTimes, days, weekDays);

        this.changeTiming = event => {
            let value;
            if (event.target.type === 'checkbox')
                value = event.target.checked;
            else
                value = event.target.value;
            this.changeOpenTime(event.target.name, value);
        }

        this.func_is_freeze = event => {
            vex.dialog.open({
                message: window.__("Are you sure you want to freeze Clinic/Hospital timing? <br/> Please Note once timing will freeze it won't be editable, so please verify again before freeze."),
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
                    $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
                ],
                callback: (status) => {
                    if(status) {
                        this.managefreeze('is_freeze', 1);
                    }
                }
            });
        }

        this.unfreeze = event => {
            event.persist()
            let log = event;
        
            vex.dialog.open({
                message: window.__("Are you sure you want to Unfreeze Clinic/Hospital Timing? <br/> Please note Old timing will be available on wikicare untill you Save & freeze with new timing for clinic/Hospital."),
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
                    $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
                ],
                callback: (status) => {
                    if(status) {
                        this.manageunfreeze('is_freeze', 0);
                    } else {
                        log.target.checked = false;
                    }
                }
            });
        }

        this.func_copy_week_days = event => {
            event.preventDefault();
            let value, _ref = this;
            value = true;
            if (value === true) {
                if (this.state.shift_1_from_mon_val !== undefined && this.state.shift_1_to_mon_val !== undefined && this.state.shift_2_from_mon_val !== undefined && this.state.shift_2_to_mon_val !== undefined) {
                    var allTimes = {};
                    _ref.state.weekDays.map(function(value, index) {
                        allTimes[`shift_1_from_${value.key}`] = timeData(0);
                        allTimes[`shift_1_to_${value.key}`] = timeData(0);
                        allTimes[`shift_2_to_${value.key}`] = timeData(0);
                        allTimes[`shift_2_from_${value.key}`] = timeData(0);
                        allTimes[`ref_${value.key}`] = true;
                        allTimes[`showFreezeButton`] = false;
                    });
                    _ref.setState(allTimes, () => {
                        var myVal = {};
                        _ref.state.weekDays.map(function(dayObj, dayIndex) {
                            myVal[`shift_1_from_${dayObj.key}_val`] = _ref.state.shift_1_from_mon_val;
                            myVal[`shift_1_to_${dayObj.key}_val`] = _ref.state.shift_1_to_mon_val;
                            myVal[`shift_2_to_${dayObj.key}_val`] = _ref.state.shift_2_to_mon_val;
                            myVal[`shift_2_from_${dayObj.key}_val`] = _ref.state.shift_2_from_mon_val;
                        });
                        if (!_.isEmpty(myVal)) {
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
                _ref.state.weekDays.map(function(dayObj, dayIndex) {
                    myVal[`shift_1_from_${dayObj.key}_val`] = "";
                    myVal[`shift_1_to_${dayObj.key}_val`] = "";
                    myVal[`shift_2_to_${dayObj.key}_val`] = "";
                    myVal[`shift_2_from_${dayObj.key}_val`] = "";
                    myVal[`ref_${dayObj.key}`] = false;
                });
                if (!_.isEmpty(myVal)) {
                    _ref.setState(myVal);
                }
            }
        }   
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data.basicDetails.show_freeze !== undefined){
            this.setState({showFreezeButton : true});
        }

        if(nextProps.data.basicDetails.is_freeze === 1){
            this.setState({showFreezeButton : false});
        }
    }

    componentWillMount(){
        if(this.props.basicDetails.shift_24X7==1) {
            this.setState({tongleDiv : 'divhide'})
        } else {
            this.setState({tongleDiv : 'divshow'})
        }
        let _ref = this, myVal = {};
        if(this.props.hospitalTimings){
            this.props.hospitalTimings.map(function (value, index) {
                _ref.state.days.map(function(dayObj, dayIndex){
                    if(value.days === dayObj.key){
                        myVal[`id`] = value.id;
                        myVal[`shift_1_from_${dayObj.key}_val`] = value.shift_1_from_key;
                        myVal[`shift_1_to_${dayObj.key}_val`] = value.shift_1_to_key;
                        myVal[`shift_1_to_${dayObj.key}`] = timeData(value.shift_1_to_key);
                        myVal[`shift_2_to_${dayObj.key}_val`] = value.shift_2_to_key;
                        myVal[`shift_2_to_${dayObj.key}`] = timeData(value.shift_2_to_key);
                        myVal[`shift_2_from_${dayObj.key}_val`] = value.shift_2_from_key;
                        myVal[`shift_2_from_${dayObj.key}`] = timeData(value.shift_2_from_key);
                        myVal[`ref_${dayObj.key}`] = true;
                    }
                })
            })
        }
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
        myVal[`showFreezeButton`] = false;
        let _ref = this;
        this.setState(myVal, function () {
            if(_ref.state.shift_1_from_mon_val >= 0 && _ref.state.shift_1_to_mon_val && _ref.state.shift_2_to_mon_val && _ref.state.shift_2_from_mon_val){
                _ref.setState({showCopyAllButton : {display:'', 'font-size' : 10}});
            } else {
                _ref.setState({showCopyAllButton : {display:'none'}});
            }
        });
    }

    removeDays(day, index){
        let _ref = this, myVal = {};
        this.props.hospitalTimings.map(function (data, key) {
            if(data.days === day){
                _ref.props.hospital.hospital_timings.splice(key, 1);
            }
        });
        if( index > -1 ){
            myVal[`shift_1_from_${day}_val`] = "";
            myVal[`shift_1_to_${day}_val`] = "";
            myVal[`shift_2_to_${day}_val`] = "";
            myVal[`shift_2_from_${day}_val`] = "";
            myVal[`showFreezeButton`] = false;

            this.setState(myVal, function () {
                if(_ref.state.shift_1_from_mon_val >= 0 && _ref.state.shift_1_to_mon_val && _ref.state.shift_2_to_mon_val && _ref.state.shift_2_from_mon_val){
                    _ref.setState({showCopyAllButton : {display:'', 'font-size' : 10}});
                } else {
                    _ref.setState({showCopyAllButton : {display:'none'}});
                }
            });
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
        uncheck[`showFreezeButton`] = false;
        this.setState(uncheck)
    }

    render(){
        if(this.props.basicDetails.id == ""){
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
                            <Row>
                                <Col xs={12} md={12} lg={12}>
                                    <FormGroup controlId='shift_24X7'>
                                        <Checkbox
                                            name='shift_24X7'
                                            onChange={this.changeTiming}
                                            checked={this.props.basicDetails.shift_24X7}
                                            disabled={this.props.basicDetails.is_freeze}
                                            >
                                            {__('Hospital Open 24 x 7')}
                                        </Checkbox>
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={12} lg={12}></Col>
                            </Row>
                            <Col className={this.state.tongleDiv}>

                                <Row>

                                    <Col xs={12} md={12} lg={12}>

                                        <Table striped bordered condensed hover responsive>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>{__('Day')}</th>
                                                    <th colSpan={2} >{__('Shift 1')}</th>
                                                    <th colSpan={2}>{__('Shift 2')}</th>
                                                    { this.props.basicDetails.is_freeze === 0 && <th>{__('Action')}</th> }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { _ref.state.days.map((value, index) => 
                                                    <tr key={index}>
                                                        <td>
                                                            <FormGroup>
                                                                <Checkbox
                                                                    inline
                                                                    disabled={this.props.basicDetails.is_freeze === 1 ? true : false}
                                                                    //inputRef={ ref => { this.input = ref } }
                                                                    onChange={ () => _ref.disableRow(value.key, index) }
                                                                    checked={ _ref.state[`ref_${value.key}`] }
                                                                    >
                                                                </Checkbox>
                                                            </FormGroup>
                                                        </td>
                                                        <td>
                                                            { value.title }
                                                            { 
                                                                value.key.toLowerCase() === "mon" && 
                                                                <div>
                                                                    <a 
                                                                        style={_ref.state.showCopyAllButton}
                                                                        onClick={_ref.func_copy_week_days}
                                                                        disabled={_ref.props.basicDetails.is_freeze}
                                                                        href="javascript:void(0)" > {__("Copy to weekdays")} 
                                                                    </a>
                                                                </div>
                                                            }
                                                        </td>
                                                        <td>
                                                            <RSelect
                                                                disabled={_ref.props.basicDetails.is_freeze ? _ref.props.basicDetails.is_freeze : !_ref.state[`ref_${value.key}`]}
                                                                onChange={(event) => _ref.handleChange(event.value, 1, "from", value.key, value.title)}
                                                                value={_ref.state[`shift_1_from_${value.key}_val`]}
                                                                options={_ref.state[`shift_1_from_${value.key}`]}
                                                                placeholder={__("From")}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                disabled={_ref.props.basicDetails.is_freeze ? _ref.props.basicDetails.is_freeze : !_ref.state[`ref_${value.key}`]}
                                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 1, "to", value.key, value.title)}
                                                                value={_ref.state[`shift_1_to_${value.key}_val`]}
                                                                options={_ref.state[`shift_1_to_${value.key}`]}
                                                                placeholder={__("To")}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                disabled={_ref.props.basicDetails.is_freeze ? _ref.props.basicDetails.is_freeze : !_ref.state[`ref_${value.key}`]}
                                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "from", value.key, value.title)}
                                                                value={_ref.state[`shift_2_from_${value.key}_val`]}
                                                                options={_ref.state[`shift_2_from_${value.key}`]}
                                                                placeholder={__("From")}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                disabled={_ref.props.basicDetails.is_freeze ? _ref.props.basicDetails.is_freeze : !_ref.state[`ref_${value.key}`]}
                                                                onChange={(event) => _ref.handleChange(event.target ? event.target.value : event.value, 2, "to", value.key, value.title)}
                                                                value={_ref.state[`shift_2_to_${value.key}_val`]}
                                                                options={_ref.state[`shift_2_to_${value.key}`]}
                                                                placeholder={__("To")}
                                                            />
                                                        </td>
                                                        { 
                                                            _ref.props.basicDetails.is_freeze == 0 && 
                                                            <td className="text-center">
                                                                <Button
                                                                  outlined
                                                                  bsStyle='danger'
                                                                  data-tab-key='additional_info'
                                                                  onClick={() => _ref.removeDays(value.key, index)}>
                                                                {__('Clear')}
                                                                </Button>
                                                            </td>
                                                        }
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Col>
                        </Form>
                    </Col>
                    <Col sm={12}>
                        {
                            this.props.basicDetails.is_freeze === 0 && this.state.showFreezeButton === false &&  
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'clinic-timings-info-form'} data-form-key='insur_comp_info_form' onClick={::this.saveData}>{__('Save')}</Button>
                        }
                        {
                            this.props.basicDetails.is_freeze === 1 && this.state.showFreezeButton === false && 
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key='doc-fee-timings-info-form' onClick={::this.changeTabs }> {__('Next')} </Button>
                        }
                        { this.state.showFreezeButton === true && <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" onClick={ () => _ref.func_is_freeze() }> {__('Freeze & Next')} </Button> }
                        <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={::this.changeTabs}>{__('Previous')}</Button>
                    </Col>
                </Row>
            );
        }
    }

    updateData(name, value) {
        this.props.dispatch({
            type: 'UPDATE_DATA_VALUE',
            value,
            name
        });
    }

    managefreeze(name, value) {
        if(value === true) value = 1;
        if(value === false) value = 0;
        
        this.props.dispatch(
            actions.doctor_new_clinic_add.manage_freeze(
                this.props,
                value
            )
        )

        this.props.dispatch({
            type: 'UPDATE_TAB',
            tabKey: 'doc-fee-timings-info-form'
        });
    }

    manageunfreeze(name, value) {
        this.props.dispatch(
            actions.doctor_new_clinic_add.manage_freeze(
                this.props,
                value,
                'lol'
            )
        )
  
        this.props.dispatch({
            type: 'UPDATE_DATA_VALUE',
            value,
            name
        });
    }

    changeOpenTime(name, value) {
        if(value == true) {
            this.setState({tongleDiv : 'divhide'})
            value=1;
        } else {
            this.setState({tongleDiv : 'divshow'})
            value = 0;
        }
        this.props.dispatch(
            actions.doctor_new_clinic_add.changeOpen24X7(
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

    saveData(event) {
        
        var timeSaveObj = { hospitalId : this.props.basicDetails.id, time : {}}, finalArr = [];
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

        for (var key in timeSaveObj.time) {
            if (timeSaveObj.time.hasOwnProperty(key)) {
                if(timeSaveObj.time[key].shift_1_from_time){
                    finalArr.push({
                        hospitalId : this.props.basicDetails.id,
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

        if(this.props.hospitalTimings){
            finalArr = _.unionBy(finalArr, this.props.hospitalTimings, "days");
        }
        this.props.dispatch(
            actions.doctor_new_clinic_add.saveShifTiming(this.props.data, finalArr, 'doc-fee-timings-info-form')
        );
    }

    changeTabs(event) {
        this.props.data.dispatch({
            type: 'UPDATE_TAB',
            tabKey: event.target.getAttribute('data-tab-key')
        });
    }
}
