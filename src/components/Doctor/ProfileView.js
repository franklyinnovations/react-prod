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
    Tab
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class ProfileView extends React.Component {
	constructor(props) {
		super(props);

        this.getTagTitles = tagtypeId => {
            let data = [];

            switch(tagtypeId) {
                case 3:
                    this.props.data.educations.map((item) => {
                        this.props.data.helperData.qualification_tags.filter((innerItem) => {
                            if(item.tagtypeId == innerItem.value) data.push(innerItem.label)
                        })  
                    })
                    break;
                default:
                    return [];
            }
            return data;
        }
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

        /* 3 for qualification tags */
        let qualificationTags = this.getTagTitles(3);
        //qualificationTags = qualificationTags.join(", ")
        let quelifications = this.props.data.educations.map((item) => {
            this.props.data.helperData.qualification_tags.filter((innerItem) => {
                if(item.tagtypeId == innerItem.value) return innerItem.label
            })  
        })
        
        
        let contactEmails = [], contactMobiles = [];
        this.props.data.contactInformations.emails.map((item) => { contactEmails.push(item.value) })
        this.props.data.contactInformations.mobiles.map((item) => { contactMobiles.push(item.value) })

        let specializations = this.props.data.additionalInfo.specializations.map((item) => {return item.label})
        let memberships = this.props.data.additionalInfo.memberships.map((item) => {return item.label})
        let services = this.props.data.additionalInfo.services.map((item) => {return item.label})

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
                    <Image src={(this.props.data.basicDetails.doctor_profile_pic ? imageUrl+'/'+this.props.data.basicDetails.doctor_profile_pic : '/imgs/noimage.png')} thumbnail style={{maxHeight: '192px'}}/>
                </Col>
                <Col md={9} sm={8}>
                    <Row>
                        <Col sm={9}>
                            <h3>{this.props.data.basicDetails.name}</h3>
                            <strong>{quelifications[0]}</strong>
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
                            <p>{__('Contact email')}: {contactEmails.join(" | ")}</p>
                            <p>{__('Contact phone')}: {contactMobiles.join(" | ")}</p>
                        </Col>
                    </Row>
                </Col><br/>
                <Col sm={12}>
                    <Grid style={{marginTop: '15px'}}>
                        <Tabs defaultActiveKey={1} id="doc-info-tab1" className="nav-width">
                            <Tab eventKey={1} title={__('About')}>
                                <p>{this.props.data.basicDetails.about_doctor}</p>
                            </Tab>
                            <Tab eventKey={2} title={__('Photos')}>
                                { 0 === this.props.data.doctorFiles.images.length && <p>{__("No images.")}</p> }
                                <Row>
                                {
                                    this.props.data.doctorFiles.images.map((item, index) => 
                                        <Col xs={6} sm={3} collapseRight key={'img'+index}>
                                            <GalleryView image={imageUrl+'/'+item.doctor_files} title={item.original_name} subtitle={this.getDocumentTypeTitle(item.document_type, __)}/>
                                        </Col>
                                    )
                                }
                                </Row>
                            </Tab>
                            <Tab eventKey={3} title={__('Videos')}>
                                { 0 === this.props.data.doctorFiles.videos.length && <p>{__("No videos.")}</p> }
                                {
                                    this.props.data.doctorFiles.videos.map((item, index) => 
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
                        </Tabs>
                    </Grid>
                </Col>
            </Row>
        )
    }

    getDocumentTypeTitle(value, __) {
        switch (value) {
            case 'identity':
                return __('Identity Proof');
            case 'qualification':
                return __('Qualification Proof');
            case 'public_photos':
                return __('Public Photos');
        }
    }
}