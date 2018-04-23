import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import {getSalutation} from '../../utils';
import actions from '../../redux/actions';
import {getYears} from '../../utils';
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
    BPanel,
    Radio,
    Well
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class Experience extends React.Component {
	constructor(props) {
		super(props);
        this.yearValues = getYears();
        this.state = {
            clinic_hospital_name: '',
            designation: '',
            city_name: '',
            duration_from: '',
            duration_to: ''
        }

        this.handleExperienceInputUpdate = event => {
            this.setState({[event.target.name]: event.target.value})
        }
    }

  	render() {
        if (this.props.loading) return <Loading/>;
        let content, __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        
  		return (
            <div key='experience'>
                <h3>{__('Experience')}</h3>

                {/* Add Experience info form */}
                <Well>
                    <Row>
                        <Col sm={6}>
                            <FormGroup controlId="clinic_hospital_name" validationState={null} >
                                <ControlLabel>{__('Clinic / Hospital Name')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('Clinic / Hospital Name')}
                                    value={this.state.clinic_hospital_name}
                                    name='clinic_hospital_name'
                                    onChange={this.handleExperienceInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup controlId="designation" validationState={null} >
                                <ControlLabel>{__('Role / Designation')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('Role / Designation')}
                                    value={this.state.designation}
                                    name='designation'
                                    onChange={this.handleExperienceInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <FormGroup controlId="city_name" validationState={null} >
                                <ControlLabel>{__('City Name')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('City Name')}
                                    value={this.state.city_name}
                                    name='city_name'
                                    onChange={this.handleExperienceInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup controlId="duration_from" validationState={null} >
                                <ControlLabel>{__('Duration From')}</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleExperienceInputUpdate}
                                    name='duration_from'
                                    value={this.state.duration_from}
                                >
                                    <option value="">{__('Select')}</option>
                                    {
                                        this.yearValues.map((value, index) =>
                                            <option value={value} key={'year-'+value}>{
                                                value
                                            }</option>
                                        )
                                    }
                                </FormControl>
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup controlId="duration_to" validationState={null} >
                                <ControlLabel>{__('Duration To')}</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleExperienceInputUpdate}
                                    name='duration_to'
                                    value={this.state.duration_to}
                                >
                                    <option value="">{__('Select')}</option>
                                    {
                                        this.yearValues.map((value, index) =>
                                            <option value={value} key={'year-'+value}>{
                                                value
                                            }</option>
                                        )
                                    }
                                </FormControl>
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className='text-right'>
                            <Button 
                                outlined 
                                bsStyle='lightgreen' 
                                className="btn btn-primary pull-right" 
                                onClick={::this.addMoreExperiences}
                            >{__('Add')}
                            </Button>
                        </Col>
                    </Row>
                </Well>

                {
                    this.props.experiences.length > 0 && 
                    <Table condensed striped>
                        <thead>
                            <tr>
                                <th>{__('Clinic / Hospital Name')}</th>
                                <th>{__('Role / Designation')}</th>
                                <th>{__('City Name')}</th>
                                <th>{__('Duration From')}</th>
                                <th>{__('Duration To')}</th>
                                <th>{__('Action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.experiences.map(this.getDataRow, this)}
                        </tbody>
                    </Table>
                }
            </div>
    	);
  	}

    getDataRow(item, index) {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        return (
            <tr key={index}>
                <td>{item.clinic_hospital_name}</td>
                <td>{item.designation}</td>
                <td>{item.city_name}</td>
                <td>{item.duration_from}</td>
                <td>{item.duration_to}</td>
                <td>
                    {
                        item.newAdd && 
                        //this.props.basicDetails.is_live !== 1 && 
                        <Icon
                            className={'fg-deepred'}
                            style={{fontSize: 20}}
                            glyph={'icon-simple-line-icons-close'}
                            onClick={::this.removeExperience}
                            data-itemIndex={index}
                            title={__('Remove')}
                        />
                    }
                </td>
            </tr>
        )
    }

    addMoreExperiences() { 
        if(!this.state.clinic_hospital_name || !this.state.designation || !this.state.city_name || !this.state.duration_from || !this.state.duration_to) {
            Messenger().post({ type: 'error', message: window.__('Please fill all fields') });
            return false;
        }
        if(this.state.duration_from > this.state.duration_to) {
            Messenger().post({ type: 'error', message: window.__('Duration(from) must be less or equal to Duration(to)') });
            return false;
        }
        
        this.props.dispatch({
            type: 'ADD_MORE_EXPERIENCE',
            clinic_hospital_name: this.state.clinic_hospital_name,
            designation: this.state.designation,
            city_name: this.state.city_name,
            duration_from: this.state.duration_from,
            duration_to: this.state.duration_to,
            doctorProfileId: this.props.basicDetails.id
        })

        this.setState({clinic_hospital_name: '', designation: '', city_name: '', duration_from: '', duration_to: ''})
    }
    removeExperience(ev) { 
        let getIndex = ev.target.getAttribute('data-itemIndex')
        this.props.dispatch({ type: 'REMOVE_EXPERIENCE', index: getIndex }) 
    }
};
