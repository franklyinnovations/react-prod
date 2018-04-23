import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import actions from '../../redux/actions';
import {getYears} from '../../utils';
import {imageUrl} from '../../../api/config';
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
    Well,
    Image
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class Registrations extends React.Component {
	constructor(props) {
		super(props);
        this.yearValues = getYears();
        this.state = {
            council_registration_number: '',
            council_name: '',
            year_of_registration: '',
            reg_proof: '',
            reglength: this.props.registrations.length
        }

        this.handleRegistrationInputUpdate = event => {
           this.setState({[event.target.name]: event.target.value})
        }

        this.handleChangeImage = event => {
            let index = event.target.getAttribute('data-index');
            let ufile = event.target;
            if (event.target.files && event.target.files[0]) {
                if(-1 === ["image/jpeg", "image/png"].indexOf(event.target.files[0].type)) {
                    let msg = __("Only images are allowed");
                    Messenger().post({
                        type: 'error',
                        message: msg
                    });
                    return false;
                }

                let fileName = event.target.files[0].name;
                let getUrl = URL.createObjectURL(event.target.files[0])
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({reg_proof: ufile, ['reg_proof___'+index]: e.target.result})
                };
                reader.readAsDataURL(event.target.files[0]);

                this.reInitializeGalleryView()
            }
        }
    }

    componentDidMount() {
        var links = document.getElementsByClassName('reg-proof-img');
        $('.reg-proof-img').unbind('click').bind('click', function(event) {
            blueimp.Gallery(links, {
                index: $(this).get(0),
                event: event
            });
        });
    }

    reInitializeGalleryView() {
        var links = document.getElementsByClassName('reg-proof-img');
        $('.reg-proof-img').unbind('click').bind('click', function(event) {
            blueimp.Gallery(links, {
                index: $(this).get(0),
                event: event
            });
        });
    }

  	render() {
        let content, __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        let prevLeng = this.state.reglength;
        return (
            <div key='registration'>
                <h3>{__('Registrations')}</h3>

                {/* Add Registration info form */}
                <Well>
                    <Row>
                        <Col xs={6} sm={3} style={{paddingRight: '17px', paddingLeft: '17px'}}>
                            <FormGroup controlId="council_registration_number" validationState={null} >
                                <ControlLabel>{__('Registration Number')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('Registration Number')}
                                    value={this.state.council_registration_number}
                                    name='council_registration_number'
                                    onChange={this.handleRegistrationInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={3} style={{paddingRight: '17px', paddingLeft: '0px'}}>
                            <FormGroup controlId="council_name" validationState={null} >
                                <ControlLabel>{__('Council Name')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('Council Name')}
                                    value={this.state.council_name}
                                    name='council_name'
                                    onChange={this.handleRegistrationInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={2} style={{paddingRight: '17px', paddingLeft: '0px'}}>
                            <FormGroup controlId="year_of_registration" validationState={null} >
                                <ControlLabel>{__('Registration Year')}</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleRegistrationInputUpdate}
                                    name='year_of_registration'
                                    value={this.state.year_of_registration}
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
                        <Col xs={6} sm={4} style={{paddingRight: '17px', paddingLeft: '0px'}}>
                            <FormGroup validationState={null}>
                                <ControlLabel>{__('Registration Proof')}</ControlLabel>
                                <div id="reg-proof-inputs">
                                    <FormControl type="file" name={"reg_proof___"+prevLeng} data-index={prevLeng} className={"reg_proof_file_input"} onChange={this.handleChangeImage}/>
                                </div>
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
                                onClick={::this.addMoreRegistrations}
                            >{__('Add')}
                            </Button>
                        </Col>
                    </Row>
                </Well>

                {
                    this.props.registrations.length > 0 && 
                    <Table condensed striped>
                        <thead>
                            <tr>
                                <th>{__('Registration Number')}</th>
                                <th>{__('Council Name')}</th>
                                <th>{__('Registration Year')}</th>
                                <th>{__('Registration Proof')}</th>
                                <th>{__('Action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.registrations.map(this.getDataRow, this)}
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
                <td>{item.council_registration_number}</td>
                <td>{item.council_name}</td>
                <td>{item.year_of_registration}</td>
                <td>
                    {
                        item.newAdd ? 
                        <div>
                            <Image responsive src={this.state['reg_proof___'+index]} alt={''} style={{width: '60px'}} className={'reg-thumb-'+index}/>
                        </div> :
                        <a className={'reg-proof-img gallery-item-link reg-thumb-link-'+index} href={ imageUrl+'/'+item.reg_proof } title={item.reg_proof_file_name}>
                            <Image responsive src={imageUrl+'/'+item.reg_proof} alt={item.reg_proof_file_name} style={{width: '60px'}} className={'reg-thumb-'+index}/>
                        </a>
                    }
                </td>
                <td>
                    {
                        item.newAdd && 
                        //this.props.basicDetails.is_live !== 1 && 
                        <Icon
                            className={'fg-deepred'}
                            style={{fontSize: 20}}
                            glyph={'icon-simple-line-icons-close'}
                            onClick={::this.removeRegistration}
                            data-itemIndex={index}
                            title={__('Remove')}
                        />
                    }
                </td>
            </tr>
        )
    }

    addMoreRegistrations() { 
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        if(!this.state.council_registration_number || !this.state.council_name || !this.state.year_of_registration || !this.state.reg_proof) {
            Messenger().post({ type: 'error', message: __('Please fill all fields') });
            return false;
        }

        let prevLen = this.state.reglength;

        let element = document.getElementsByClassName("reg_proof_file_input");
        for(let i = 0; i < element.length; i++)
            element[i].classList.add("hide")
        
        let input = document.createElement("input")
        input.setAttribute('type',"file");
        input.className = "reg_proof_file_input";
        input.name = 'reg_proof___'+(prevLen+element.length)
        input.setAttribute("data-index", (prevLen+element.length))
        input.addEventListener('change', ::this.handleChangeImage)

        document.getElementById("reg-proof-inputs").appendChild(input)

        this.props.dispatch({
            type: 'ADD_MORE_REGISTRATION',
            council_registration_number: this.state.council_registration_number,
            council_name: this.state.council_name,
            year_of_registration: this.state.year_of_registration,
            doctorProfileId: this.props.basicDetails.id
        })

        this.setState({council_registration_number: '', council_name: '', year_of_registration: '', reg_proof: ''})
    }
    removeRegistration(ev) { 
        let getIndex = ev.target.getAttribute('data-itemIndex')
        var fileInput = document.getElementsByName("reg_proof___"+getIndex);
        if(fileInput[0]) fileInput[0].remove();
        this.setState({reglength: (this.props.registrations.length - 1) < 0 ? 0 : (this.props.registrations.length - 1)})
        this.props.dispatch({ type: 'REMOVE_REGISTRATION', index: getIndex }) 
    }
};
