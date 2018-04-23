import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import Select from '../../components/Select';
import GalleryView from '../Common/GalleryView';
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
    Image,
    Label,
    Tabs,
    Tab,
    Alert
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.hospital_profile
}))

export default class ProfileView extends React.Component {
	constructor(props) {
		super(props);
    }

    componentDidMount() {
        var links = document.getElementsByClassName('gallery-1');
        $('.gallery-1').unbind('click').bind('click', function(event) {
            blueimp.Gallery(links, {
                index: $(this).get(0),
                event: event
            });
        });
    }

  	render() {
        let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

        let contactEmails = [], contactMobiles = [];
        this.props.data.contactInformations.emails.map((item) => { contactEmails.push(item.value) })
        this.props.data.contactInformations.mobiles.map((item) => { contactMobiles.push(item.value) })
        
        let specializations = this.props.data.additionalInfo.specializations.map((item) => {return item.label})
        let memberships = this.props.data.additionalInfo.memberships.map((item) => {return item.label})
        let services = this.props.data.additionalInfo.services.map((item) => {return item.label})
        let insurance_companies = this.props.data.additionalInfo.insurance_companies.map((item) => {return item.label})

        return (
            <Row>
                <Col sm={12}>
                    {
                        0 === this.props.data.basicDetails.is_active && 1 === this.props.data.basicDetails.is_live &&  
                        <Alert danger>
                            <span>{__('Your profile has been deactivated by Wikicare Admin')}</span>
                        </Alert>
                    }
                </Col>
                <Col md={3} sm={4}>
                    <Image src={(this.props.data.basicDetails.hospital_logo ? imageUrl+'/'+this.props.data.basicDetails.hospital_logo : '/imgs/noimage.png')} thumbnail style={{maxHeight: '192px'}}/>
                </Col>
                <Col md={9} sm={8}>
                    <Row>
                        <Col sm={9}>
                            <h3>{this.props.data.basicDetails['hospital_detail[hospital_name]']}</h3>
                            <p className="separator-border">{specializations.join(", ")}</p>
                        </Col>
                        <Col sm={3}>
                            { 
                                (
                                    1 === this.props.data.basicDetails.is_live && 
                                    "verified" === this.props.data.basicDetails.verified_status && 
                                    1 === this.props.data.basicDetails.is_complete && 
                                    1 === this.props.data.basicDetails.is_active && 
                                    ("approved" === this.props.data.basicDetails.claim_status || "user-created" === this.props.data.basicDetails.claim_status) 
                                ) ? 
                                    <Label bsStyle="success">{__('Live')}</Label> : 
                                null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <p>Contact details: {contactEmails.join(" | ")} | {contactMobiles.join(" | ")}</p>
                            <p>Address: {this.props.data.basicDetails['hospital_detail[address]']}</p>
                        </Col>
                    </Row>
                </Col><br/>
                <Col sm={12}>
                    <Grid style={{marginTop: '15px'}}>
                        <Tabs defaultActiveKey={1} id="doc-info-tab1" className="nav-width">
                            <Tab eventKey={1} title={__('About')}>
                                <p>{this.props.data.basicDetails['hospital_detail[about_hospital]']}</p>
                            </Tab>
                            <Tab eventKey={2} title={__('Photos')}>
                                { 0 === this.props.data.hospitalFiles.images.length && <p>No images.</p> }
                                <Row>
                                {
                                    this.props.data.hospitalFiles.images.map((item, index) => 
                                        <Col xs={6} sm={3} collapseRight key={'img'+index}>
                                            <GalleryView image={imageUrl+'/'+item.hospital_files} title={item.original_name} subtitle={this.getDocumentTypeTitle(item.document_type, __)}/>
                                        </Col>
                                    )
                                }
                                </Row>
                            </Tab>
                            <Tab eventKey={3} title={__('Videos')}>
                                { 0 === this.props.data.hospitalFiles.videos.length && <p>No videos.</p> }
                                {
                                    this.props.data.hospitalFiles.videos.map((item, index) => 
                                        <Image key={'videos-'+index} src={'/imgs/noimage.png'} thumbnail style={{maxHeight: '142px'}}/>
                                    )
                                }
                            </Tab>
                        </Tabs>
                    </Grid>
                </Col>
                <Col sm={12} style={{marginTop: '10px'}}>
                    <Grid>
                        <Tabs defaultActiveKey={4} id="doc-info-tab1">
                            <Tab eventKey={4} title={__('Services')}>
                                <ul>
                                    { 0 === services.length && <p>No record.</p> }
                                    {
                                        services.map((item, index) => 
                                            <li style={{listStyle: 'inside'}} key={"service-"+index}>{item}</li>
                                        )
                                    }
                                </ul>
                            </Tab>
                            <Tab eventKey={5} title={__('Awards & Memberships')}>
                                <Row>
                                    <Col sm={6}>
                                        <h3>{__('Awards')}</h3>
                                        <ul>
                                            {
                                                0 < this.props.data.awards.length && this.props.data.awards[0].award_gratitude_title === "" && 
                                                <p>No awards.</p>
                                            }
                                            {
                                                0 < this.props.data.awards.length && this.props.data.awards[0].award_gratitude_title != "" && 
                                                this.props.data.awards.map((item, index) => 
                                                    <li key={"award-"+index}>{item.award_gratitude_title}</li>
                                                )
                                            }
                                        </ul>
                                    </Col>
                                    <Col sm={6}>
                                        <h3>{__('Memberships')}</h3>
                                        <ul>
                                            { 0 === memberships.length && <p>No record.</p>}
                                            {
                                                memberships.map((item, index) => 
                                                    <li key={"membership-"+index}>{item}</li>
                                                )
                                            }
                                        </ul>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey={6} title={__('Insurance Companies')}>
                                <Row>
                                    <Col sm={12}>
                                        <ul>
                                            { 0 === insurance_companies.length && <p>No record.</p>}
                                            {
                                                insurance_companies.map((item, index) => 
                                                    <li style={{listStyle: 'inside'}} key={"insurance-companies-"+index}>{item}</li>
                                                )
                                            }
                                        </ul>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Grid>
                </Col>
            </Row>
        )
    }

    getDocumentTypeTitle(value, __) {
        switch (value) {
            case 'prescription_pad':
                return __('Prescription Pad');
            case 'clinic_reg_proof':
                return __('Clinic Registration Proof');
            case 'waste_disposal_certificate':
                return __('Waste Disposal Certificate');
            case 'tax_receipt':
                return __('Tax Receipt');
            case 'public_photos':
                return __('Clinic Photos for public profile');
        }
    }
}