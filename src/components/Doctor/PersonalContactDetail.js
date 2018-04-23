import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import {getSalutation} from '../../utils';
import actions from '../../redux/actions';
import Gmap from '../../components/Common/Gmap';
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
    Image
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class PersonalContactDetail extends React.Component {
	constructor(props) {
		super(props);

        this.handleDataUpdate = event => {
            let value;
            if (event.target.type === 'checkbox')
                value = event.target.checked;
            else
                value = event.target.value;
            this.updateData(event.target.name, value);
        }

        this.handleCountryUpdate = event => {
            let value = event.target.value;
            this.props.dispatch(
                actions.doctor_profile.getStates(
                    this.props, value
                )
            )
            this.updateData(event.target.name, value);

            var index = event.target.selectedIndex;
            var optionElement = event.target.childNodes[index]
            var country_name =  optionElement.getAttribute('data-name');
            this.updateGoogleMapAdressData('country_name', country_name)
        }

        this.handleStateUpdate = event => {
            let value = event.target.value;
            this.props.dispatch(
                actions.doctor_profile.getCities(
                    this.props, value
                )
            )
            this.updateData(event.target.name, value);

            var index = event.target.selectedIndex;
            var optionElement = event.target.childNodes[index]
            var state_name =  optionElement.getAttribute('data-name');
            this.updateGoogleMapAdressData('state_name', state_name)
        }

        this.handleCityUpdate = event => {
            let value = event.target.value;
            this.updateData(event.target.name, value);

            var index = event.target.selectedIndex;
            var optionElement = event.target.childNodes[index]
            var city_name =  optionElement.getAttribute('data-name');
            this.updateGoogleMapAdressData('city_name', city_name)
        }

        this.hendleProfilePicUploadIconClick = () => {
            let getElem = ReactDOM.findDOMNode(this).querySelector('.profile-pic')
            getElem.click();
        }

        this.handleProfilePicChange = event => {
            if (event.target.files && event.target.files[0]) {
                if(-1 === ["image/jpeg", "image/png"].indexOf(event.target.files[0].type)) {
                    Messenger().post({
                        type: 'error',
                        message: window.__('Only images are allowed')
                    });
                    return false;
                }
                let reader = new FileReader();
                reader.onload = (e) => {
                    let getImgElem = ReactDOM.findDOMNode(this).querySelector('.prf-pic-img-preview')
                    getImgElem.src = e.target.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        }

        this.handleAddMoreEmailMobile = event => {
            event.preventDefault();
            this.props.dispatch(
                actions.doctor_profile.addMoreEmailMobile(this.props, event.target.getAttribute('data-type'))
            )
        }

        this.handleContactDataUpdate = event => {
            if(event.target.getAttribute('data-action-type') === "is_primary") {
                let targetName = event.target.name.split("__")[0];
                this.props.dispatch(
                    actions.doctor_profile.updateEmailMobile(
                        this.props, 
                        event.target.getAttribute('data-type'), 
                        event.target.getAttribute('data-index'), 
                        targetName, 
                        1
                    )
                )
            } else {
                this.props.dispatch(
                    actions.doctor_profile.updateEmailMobile(
                        this.props, 
                        event.target.getAttribute('data-type'), 
                        event.target.getAttribute('data-index'), 
                        event.target.name, 
                        event.target.value
                    )
                )
            }
        }

        this.handleRemoveContactEmailMobile = event => {
            this.props.dispatch(
                actions.doctor_profile.removeEmailMobile(
                    this.props, 
                    event.target.getAttribute('data-type'), 
                    event.target.getAttribute('data-index')
                )
            )
        }
    }

  	render() {
        if (this.props.loading) return <Loading/>;
        let content, __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        let salutations = getSalutation(__);

  		return (
            <Form className="personal_info_form">
                <h3>{__('PERSONAL DETAILS')}</h3>
                <Row>
                    <Col md={9} sm={8}>
                        <Row>
                            <Col sm={6}>
                                <FormGroup
                                    controlId='salutation'
                                    validationState={this.props.errors.salutation ? 'error': null}
                                >
                                    <ControlLabel>{__('Title')}</ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        placeholder={__("select")}
                                        name='salutation'
                                        onChange={this.handleDataUpdate}
                                        value={this.props.basicDetails.salutation}
                                    >
                                    {
                                        salutations.map((value, index) =>
                                            <option value={value.value} key={'salutation-'+value.value}>{
                                                value.value
                                            }</option>
                                        )
                                    }
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.salutation}</HelpBlock>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup
                                    controlId='name'
                                    validationState={this.props.errors.name ? 'error': null}
                                >
                                    <ControlLabel>{__('Full Name')} <span className="text-danger">*</span></ControlLabel>
                                    <FormControl
                                        type="text"
                                        name='name'
                                        value={this.props.basicDetails.name}
                                        onChange={this.handleDataUpdate}
                                    >
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.name}</HelpBlock>
                                 </FormGroup>
                            </Col>
                            <Col sm={12}>
                                <FormGroup controlId='inline-radios'>
                                    <Row>
                                        <Col sm={2}><ControlLabel>{__('Gender')} <span className="text-danger">*</span></ControlLabel></Col>
                                        <Col sm={10}>
                                            <div>
                                                <Radio inline value='male' name='gender' className='customRadio' onChange={this.handleDataUpdate}
                                                    checked={'male' === this.props.basicDetails.gender} >
                                                    <span className="icon-holder"></span>
                                                    {__('Male')}
                                                </Radio>
                                                <Radio inline value='female' name='gender' className='customRadio' onChange={this.handleDataUpdate}
                                                     checked={'female' === this.props.basicDetails.gender} >
                                                    <span className="icon-holder"></span>
                                                    {__('Female')}
                                                </Radio>
                                                <Radio inline value='other' name='gender' className='customRadio' onChange={this.handleDataUpdate}
                                                     checked={'other' === this.props.basicDetails.gender} >
                                                    <span className="icon-holder"></span>
                                                    {__('Other')}
                                                </Radio>
                                            </div>
                                        </Col>
                                    </Row>
                                    </FormGroup>
                            </Col>
                            <Col sm={12}>
                                <FormGroup
                                    controlId='about_doctor'
                                    validationState={this.props.errors.about_doctor ? 'error': null}
                                >
                                    <ControlLabel>{__('About Me')} <span className="text-danger">*</span></ControlLabel>
                                    <FormControl
                                        componentClass="textarea"
                                        className="about-me"
                                        placeholder=""
                                        name='about_doctor'
                                        onChange={this.handleDataUpdate}
                                        value={this.props.basicDetails.about_doctor}
                                    >
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.about_doctor}</HelpBlock>
                                </FormGroup> 
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} sm={4}>
                        <FormGroup
                            controlId='profilepic'
                        >
                            <div className="profile-img-wrapper">
                                <ControlLabel>
                                    <div className="profile-img-holder">
                                        <Image src={(this.props.basicDetails.doctor_profile_pic ? imageUrl+'/'+this.props.basicDetails.doctor_profile_pic : '/imgs/noimage.png')} className="img-responsive prf-pic-img-preview"/>
                                    </div>
                                </ControlLabel>
                                <Button bsStyle="link" className="upload-img" onClick={this.hendleProfilePicUploadIconClick}>Upload Profile Picture</Button>
                            </div>
                            <FormControl
                                type="file"
                                name='doctor_profile_pic'
                                className= "hidden profile-pic"
                                onChange={this.handleProfilePicChange}
                            >
                            </FormControl>
                         </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <h3>{__('Contact Details')}</h3>
                    </Col>
                    <Col sm={12}>
                        <Row>
                            <Col xs={6} md={6}>
                                <Row>
                                    <Col sm={12}>
                                        <FormGroup>
                                            <ControlLabel>{__('Email')} </ControlLabel>
                                        </FormGroup>
                                    </Col>
                                    {
                                        this.props.contactInformations.emails.map((item, itemIndex) => 
                                            <div key={'contact-email-'+itemIndex}>
                                            <Col sm={itemIndex === 0 ? 12 : 10}>
                                                <FormGroup
                                                    controlId={'email___'+itemIndex}
                                                    validationState={this.props.errors['email___'+itemIndex] ? 'error': null}
                                                >
                                                    <InputGroup>
                                                        <FormControl
                                                            type='text'
                                                            placeholder={__('Email')}
                                                            value={this.props.contactInformations.emails[itemIndex].value}
                                                            name='value'
                                                            onChange={this.handleContactDataUpdate}
                                                            data-index={itemIndex}
                                                            data-type='emails'
                                                            data-action-type='info'
                                                        />
                                                        <InputGroup.Addon>
                                                            <input type='radio' data-action-type='is_primary' name='is_primary__email' data-type='emails' data-index={itemIndex} onChange={this.handleContactDataUpdate} checked={this.props.contactInformations.emails[itemIndex].is_primary === 1 ? true : false}/>
                                                        </InputGroup.Addon>
                                                    </InputGroup>
                                                    <HelpBlock>{this.props.errors['email___'+itemIndex]}</HelpBlock>
                                                </FormGroup>
                                            </Col>
                                            {
                                                itemIndex != 0 && 
                                                <Col sm={2}>
                                                    <Icon
                                                        className={'fg-deepred'}
                                                        style={{fontSize: 20}}
                                                        glyph={'icon-simple-line-icons-close'}
                                                        data-index={itemIndex}
                                                        title={__('Remove')}
                                                        data-type='emails'
                                                        onClick={this.handleRemoveContactEmailMobile}
                                                    />
                                                </Col>
                                            }
                                            </div>
                                        )
                                    }
                                    { 
                                        this.props.contactInformations.emails.length < 3 && 
                                        <Col sm={12} className='text-right'>
                                            <a href="#" onClick={this.handleAddMoreEmailMobile} data-type="email">+ {__('Add More')}</a>
                                        </Col>
                                    }
                                </Row>
                            </Col>
                            <Col xs={6} md={6}>
                                <Row>
                                    <Col sm={12}>
                                        <FormGroup>
                                            <ControlLabel>{__('Mobile')} <span style={{fontSize: '13px'}}> ({__('Please enter country code as prefix for mobile number')})</span></ControlLabel>
                                        </FormGroup>
                                    </Col>
                                    {
                                        this.props.contactInformations.mobiles.map((item, itemIndex) => 
                                            <div key={'contact-mobile-'+itemIndex}>
                                            <Col sm={itemIndex === 0 ? 12 : 10}>
                                                <FormGroup
                                                    controlId={'mobile___'+itemIndex}
                                                    validationState={this.props.errors['mobile___'+itemIndex] ? 'error': null}
                                                >
                                                    <InputGroup>
                                                        <FormControl
                                                            type='text'
                                                            placeholder={__('Mobile')}
                                                            value={this.props.contactInformations.mobiles[itemIndex].value}
                                                            name='value'
                                                            onChange={this.handleContactDataUpdate}
                                                            data-index={itemIndex}
                                                            data-type='mobiles'
                                                            data-action-type='info'
                                                        />
                                                        <InputGroup.Addon>
                                                            <input type='radio' data-action-type='is_primary' name='is_primary__mobile' data-type='mobiles' data-index={itemIndex} onChange={this.handleContactDataUpdate} checked={this.props.contactInformations.mobiles[itemIndex].is_primary === 1 ? true : false}/>
                                                        </InputGroup.Addon>
                                                    </InputGroup>
                                                    <HelpBlock>{this.props.errors['mobile___'+itemIndex]}</HelpBlock>
                                                </FormGroup>
                                            </Col>
                                            {
                                                itemIndex != 0 && 
                                                <Col sm={2}>
                                                    <Icon
                                                        className={'fg-deepred'}
                                                        style={{fontSize: 20}}
                                                        glyph={'icon-simple-line-icons-close'}
                                                        data-index={itemIndex}
                                                        title={__('Remove')}
                                                        data-type='mobiles'
                                                        onClick={this.handleRemoveContactEmailMobile}
                                                    />
                                                </Col>
                                            }
                                            </div>
                                        )
                                    }
                                    { 
                                        this.props.contactInformations.mobiles.length < 3 && 
                                        <Col sm={12} className='text-right'>
                                            <a href="#" onClick={this.handleAddMoreEmailMobile} data-type="mobile">+ {__('Add More')}</a>
                                        </Col>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}>
                        <Row>
                            <Col sm={12}>
                                <FormGroup
                                    controlId='countryId'
                                    validationState={this.props.errors.countryId ? 'error': null}
                                >
                                    <ControlLabel>{__('Address Information')} <span className="text-danger">*</span></ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        name='countryId'
                                        onChange={this.handleCountryUpdate}
                                        value={this.props.basicDetails.countryId}
                                    >
                                        <option value="">{__('Select Country')}</option>
                                        {
                                            this.props.helperData.countries.map((value, index) =>
                                                <option value={value.id} key={'country-'+value.id} data-name={value.countrydetails[0].name}>{
                                                    value.countrydetails[0].name
                                                }</option>
                                            )
                                        }
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.countryId}</HelpBlock>
                                </FormGroup>
                                <FormGroup
                                    controlId='stateId'
                                    validationState={this.props.errors.stateId ? 'error': null}
                                >
                                    <FormControl
                                        componentClass="select"
                                        name='stateId'
                                        onChange={this.handleStateUpdate}
                                        value={this.props.basicDetails.stateId}
                                    >
                                        <option value="">{__('Select State')}</option>
                                        {
                                            this.props.helperData.states.map((value, index) =>
                                                <option value={value.id} key={'state-'+value.id} data-name={value.statedetails[0].name}>{
                                                    value.statedetails[0].name
                                                }</option>
                                            )
                                        }
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.stateId}</HelpBlock>
                                </FormGroup>
                                <FormGroup
                                    controlId='cityId'
                                    validationState={this.props.errors.cityId ? 'error': null}
                                >
                                    <FormControl
                                        componentClass="select"
                                        name='cityId'
                                        onChange={this.handleCityUpdate}
                                        value={this.props.basicDetails.cityId}
                                    >
                                        <option value="">{__('Select City')}</option>
                                        {
                                            this.props.helperData.cities.map((value, index) =>
                                                <option value={value.id} key={'city-'+value.id} data-name={value.citydetails[0].name}>{
                                                    value.citydetails[0].name
                                                }</option>
                                            )
                                        }
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.cityId}</HelpBlock>
                                </FormGroup>
                                <FormGroup
                                    controlId='address_line_1'
                                    validationState={this.props.errors.address_line_1 ? 'error': null}
                                >
                                    <FormControl
                                        className='user-address'
                                        componentClass="textarea"
                                        placeholder={__('Enter Address')}
                                        name='address_line_1'
                                        onChange={this.handleDataUpdate}
                                        value={this.props.basicDetails.address_line_1}
                                    >
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.address_line_1}</HelpBlock>
                                </FormGroup>
                                <FormGroup
                                    controlId='postal_code'
                                    validationState={this.props.errors.postal_code ? 'error': null}
                                >
                                    <FormControl
                                        type="text"
                                        placeholder={__('Postal code')}
                                        name='postal_code'
                                        onChange={this.handleDataUpdate}
                                        value={this.props.basicDetails.postal_code}
                                    >
                                    </FormControl>
                                    <HelpBlock>{this.props.errors.postal_code}</HelpBlock>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={7}>
                        <Row>
                            <Col sm={12}>
                                <FormGroup
                                    controlId='salutation'
                                >
                                    <ControlLabel>{__('Google Map')}
                                        <small>{ /*(You can drag and drop the marker to the correct location) */}</small>
                                    </ControlLabel>
                                    <Gmap 
                                        //data={this.props} 
                                        address={this.props.basicDetails.address_line_1} 
                                        country_name={this.props.helperData.country_name}
                                        state_name={this.props.helperData.state_name}
                                        city_name={this.props.helperData.city_name}
                                        base={'doctor'}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
    	);
  	}

    updateData(name, value) {
        this.props.dispatch({
            type: 'UPDATE_DATA_VALUE',
            name,
            value
        });
    }

    updateGoogleMapAdressData(slug, value) {
        this.props.dispatch({
            type: 'UPDATE_GMAP_ADDRESS_VALUE',
            slug: slug,
            value: value
        });
    }
};
