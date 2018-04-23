import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
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
    Accordion,
    Tabs,
    Tab,
    Nav,
    NavItem
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang
}))

export default class ViewDoctorProfile extends React.Component {
	constructor(props) {
		super(props);
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        let item = this.props.data;
        return (
            <div className="dr-profile-section" key={'view-doc-profile'}>
                <div className="dr-profile-banner">
                    <a className="claimed-p-btn" href="#" data-item-id={item.data.id} onClick={this.props.handleClaimProfileRequest}>{__('Claim profile')}</a>
                    <span className="dr-profile-thumb">
                        <img src={imageUrl+"/"+item.data.doctor_profile_pic} alt={item.data.doctorprofiledetails[0].name} className="img-circle" />
                    </span>
                    <h2>{item.data.salutation} {item.data.doctorprofiledetails[0].name}</h2>
                    <p>5 years exp. | {item.data.doctoreducations.map((value, index) => value.tag.tagdetails[0].title + ((item.data.doctoreducations.length - 1) === index ? '' : ", "))} <br/>
                        {
                            item.specialization_tags.data && 
                            item.specialization_tags.data.tags.map((value, index) => {
                                return value.tagdetails[0].title + ((item.specialization_tags.data.tags.length - 1) === index ? '' : ", ")
                            })
                        }
                    </p>
                </div>  
                <div className="col-sm-12">
                    <Tabs defaultActiveKey={'dr-info'} id="view-doctror-info-tabs" className="dr-tabs">
                        <Tab eventKey={'dr-info'} title={__("Info")}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="dr-detail-box">
                                        <h3>{__('About Us')}</h3>
                                        <p>{item.data.doctorprofiledetails[0].about_doctor}</p>
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Specialization')}</h3>
                                        { (item.specialization_tags.data === null || item.specialization_tags.data.tags.length === 0) && <p>{__('No record.')}</p>}
                                        <ul className="dr-detail-list">
                                            {
                                                item.specialization_tags.data 
                                                && item.specialization_tags.data.tags.length > 0
                                                && item.specialization_tags.data.tags.map((value, index) => {
                                                    return <li key={'doc-spec-'+index}>{value.tagdetails[0].title}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Registration')}</h3>
                                        { item.data.doctorregistrations.length === 0 && <p>{__('No record.')}</p>}
                                        <ul className="dr-detail-list">
                                            {
                                                item.data.doctorregistrations.map((value, index) => {
                                                    return <li key={'doc-reg-'+index}>{value.council_registration_number} - {value.doctorregistrationdetails[0].council_name}, {value.year_of_registration}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Experience')}</h3>
                                        { item.data.doctorexperiences.length === 0 && <p>{__('No record.')}</p> }
                                        <ul className="dr-detail-list">
                                            {
                                                item.data.doctorexperiences.map((value) => {
                                                    return (
                                                        <li key={'doc-exp-'+value.id}>{value.duration_to +" - "+ value.duration_from} {value.designation + __(' at ')+ value.doctorexperiencedetails[0].clinic_hospital_name}, {value.doctorexperiencedetails[0].city_name}</li>
                                                    )
                                                })   
                                            }
                                        </ul>
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Membership')}</h3>
                                        { (item.membership_tags.data === null || item.membership_tags.data.tags.length === 0) && <p>{__('No record.')}</p>}
                                        <ul className="dr-detail-list">
                                            {
                                                item.membership_tags.data 
                                                && item.membership_tags.data.tags.length > 0
                                                && item.membership_tags.data.tags.map((value, index) => {
                                                    return <li key={'doc-mem-'+index}>{value.tagdetails[0].title}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="dr-detail-box">
                                        <h3>{__('Photo & Videos')}</h3>
                                        { item.data.doctorfiles.length === 0 && <p>{__('No record.')}</p> }
                                        <ul className="dr-detail-video">
                                            {
                                                item.data.doctorfiles.map((value) => {
                                                    return value.document_type === "public_photos" ? 
                                                    <img key={'doc-doc-'+value.id} src={imageUrl+"/"+value.doctor_files} alt={value.original_name} height={120} width={120}/> : null
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Services')}</h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                { (item.service_tags.data === null || item.service_tags.data.tags.length === 0) && <p>{__('No record.')}</p>}
                                                <ul className="dr-detail-list">
                                                    {
                                                        item.service_tags.data 
                                                        && item.service_tags.data.tags.length > 0
                                                        && item.service_tags.data.tags.map((value, index) => {
                                                            return <li key={'doc-ser-'+index}>{value.tagdetails[0].title}</li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>                     
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Education')} </h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                { item.data.doctoreducations.length === 0 && <p>{__('No record.')}</p> }
                                                <ul className="dr-detail-list">
                                                    {
                                                        item.data.doctoreducations.map((value) => {
                                                            return (
                                                                <li key={'doc-edu-'+value.id}>{value.tag.tagdetails[0].title} - {value.doctoreducationdetails[0].college_name}, {value.year_of_passing}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>                     
                                    </div>
                                    <div className="dr-detail-box">
                                        <h3>{__('Awards')}</h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                { item.data.doctorawards.length === 0 && <p>{__('No record.')}</p>}
                                                <ul className="dr-detail-list">
                                                    {
                                                        item.data.doctorawards.map((value, index) => {
                                                            return <li key={'doc-awd-'+index}>{value.doctorawarddetails[0].award_gratitude_title} - {value.award_year}</li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>                     
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey={'dr-practices'} title={__('Practices At')}>
                            {
                                item.data.hospital_doctors.length === 0 && <p className="text-center">{__('No record.')}</p>
                            }
                            {
                                item.data.hospital_doctors.map((value) => 
                                    <div className="dr-profile-banner dr-in-hospitals" key={'doc-hd-'+value.id}>             
                                        <div className="col-sm-3">
                                            <span className="dr-profile-thumb">
                                                <img src={imageUrl+"/"+value.hospital.hospital_logo} alt={value.hospital.hospitaldetails[0].hospital_name} className="img-responsive img-circle" style={{maxHeight: '250px'}} />
                                            </span>
                                        </div> 
                                        <div className="col-sm-9"> 
                                            <h2>{value.hospital.hospitaldetails[0].hospital_name}</h2>
                                            <p><i className="fas fa-map-marker"></i> {value.hospital.hospitaldetails[0].address}</p>
                                            <p><i className="far fa-money-bill-alt"></i> $ {value.consultation_charge}</p>
                                            <p><i className="far fa-clock"></i> {__('Timings')} <br /></p>
                                            <p>
                                            {
                                                value.hospital_doctor_timings.map((time, indx) => {
                                                        return <span key={'doc-ho-tim-'+indx}>{time.days.charAt(0).toUpperCase() + time.days.substr(1)} : {time.shift_1_from_time} - {time.shift_1_to_time}, {time.shift_2_from_time} - {time.shift_2_to_time} <br/></span>;
                                                })
                                            }
                                            </p>
                                        </div>
                                    </div>
                                )
                            }
                        </Tab>
                    </Tabs>
                </div>       
            </div>
        )
    }
}