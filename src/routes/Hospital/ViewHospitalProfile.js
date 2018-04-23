import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import {imageUrl} from '../../../api/config';
import * as utilsActions from '../../utils';
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

export default class ViewHospitalProfile extends React.Component {
	constructor(props) {
		super(props);
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        let item = this.props.data;
        const daysName = {mon: __("Monday"), tue: __("Tuesday"), wed: __("Wednesday"), thu: __("Thursday"), fri: __("Friday"), sat: __("Saturday"), sun: __("Sunday")};
        return (
            <div className="dr-profile-section" key={'view-hos-profile'}>
                <div className="dr-profile-banner hospital-profile-banner">
                    <div className="row">
                        <a className="claimed-p-btn" href="#" data-item-id={item.data.id} onClick={this.props.handleClaimProfileRequest}>{__('Claim profile')}</a>
                        <div className="col-sm-3">
                            <span className="dr-profile-thumb">
                                <img src={imageUrl+"/"+item.data.hospital_logo} className="img-circle" style={{maxHeight: '250px'}}/>
                            </span>
                        </div>
                        <div className="col-sm-7">
                            <h2>{item.data.hospitaldetails[0].hospital_name}</h2>
                            <p>
                            <i className="fas fa-phone"></i> : <span>+{item.data.contactinformations.map(value => value.type === 'mobile' ? value.value : '')},</span> 
                            <i className="fas fa-phone"></i> : <span>{item.data.contactinformations.map(value => value.type === 'email' ? value.value : '')},</span>  
                            </p>
                            <p><strong>{__('Address')}:</strong> {item.data.hospitaldetails[0].address}</p>
                        </div>
                    </div>   
                </div>
                <div className="col-sm-12 hospital-profile-details"> 
                    <div className="row">
                        <div className="col-md-6">
                            <div className="dr-detail-box">
                                <h3>{__('About Hospital')}</h3>
                                <p>{item.data.hospitaldetails[0].about_hospital}</p>
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
                                                    return <li key={'hos-ser-'+index}>{value.tagdetails[0].title}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>                     
                            </div>
                            <div className="dr-detail-box">
                                <h3>{__('Awards')}</h3>
                                { item.data.hospitalawards.length === 0 && <p>{__('No record.')}</p>}
                                <ul className="dr-detail-list">
                                    {
                                        item.data.hospitalawards.map((value, index) => {
                                            return <li key={'hos-awd-'+index}>{value.hospitalawarddetails[0].award_gratitude_title} - {value.award_year}</li>
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="dr-detail-box">
                                <h3>Specialization</h3>
                                { (item.specialization_tags.data === null || item.specialization_tags.data.tags.length === 0) && <p>{__('No record.')}</p>} 
                                <ul className="dr-detail-list">
                                    {
                                        item.specialization_tags.data 
                                        && item.specialization_tags.data.tags.length > 0
                                        && item.specialization_tags.data.tags.map((value, index) => {
                                            return <li key={'hos-spec-'+index}>{value.tagdetails[0].title}</li>
                                        })
                                    }
                                </ul>
                            </div>               
                        </div>
                        <div className="col-md-6">
                            <div className="dr-detail-box">
                                <h3>{__('Times')}</h3>
                                <ul className="dr-detail-list">
                                    { item.data.shift_24X7 === 1 && __('Open 24x7') }
                                    {
                                        item.data.shift_24X7 === 0 &&
                                        item.data.hospital_timings.map((value, index) => {
                                            return <li key={'hos-tim-'+index}>{value.days.charAt(0).toUpperCase() + value.days.substr(1)} - {value.shift_1_from_time +"-"+ value.shift_1_to_time} {value.shift_2_from_time && ","} {value.shift_2_from_time +"-"+ value.shift_2_to_time}</li>
                                        })      
                                    }
                                </ul>
                            </div>
                            <div className="dr-detail-box">
                                <h3>{__('Photo')}</h3>
                                <ul className="dr-detail-video">
                                    {
                                        item.data.hospitalfiles.length === 0 && <p>{__('No record.')}</p>
                                    }
                                    {
                                        item.data.hospitalfiles.map((value) => {
                                            return value.document_type === "public_photos" ? 
                                            <img key={'hos-doc-'+value.id} src={imageUrl+"/"+value.hospital_files} alt={'Photo'} height={120} width={120}/> : null
                                        })
                                    }
                                </ul>
                            </div> 
                            <div className="dr-detail-box">
                                <h3>{__('Insurance Companies')}</h3>
                                { (item.insurance_comp_tags.data === null || item.insurance_comp_tags.data.tags.length === 0) && <p>{__('No record.')}</p>} 
                                <ul className="dr-detail-list">
                                    { 
                                        item.insurance_comp_tags.data 
                                        && item.insurance_comp_tags.data.tags.length > 0
                                        && item.insurance_comp_tags.data.tags.map((value, index) => {
                                            return <li key={'hos-ins-'+index}>{value.tagdetails[0].title}</li>
                                        })
                                    }
                                </ul>
                            </div>            
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 hospital-profile-details"> 
                    <h2 className="heading-two">{__('Doctors in')} {item.data.hospitaldetails[0].hospital_name}</h2>
                    {
                        item.data.hospital_doctors.length === 0 && <p>{__('No record.')}</p>
                    }
                    {
                        item.data.hospital_doctors.map((value, index) => 
                            <div className="dr-profile-banner dr-in-hospitals" key={'hos-doc-'+index}>
                                <div className="row">
                                    <div className="col-sm-2">
                                        <span className="dr-profile-thumb">
                                            <img src={imageUrl+"/"+value.doctorprofile.doctor_profile_pic} className="img-responsive img-circle" style={{maxHeight: '250px', backgroundColor: '#34bfd2'}}/>
                                        </span>
                                    </div> 
                                    <div className="col-sm-10">
                                        <h2>{value.doctorprofile.salutation} {value.doctorprofile.doctorprofiledetails[0].name}</h2>
                                        <p>{utilsActions.getTotalExperienceOfDoctor(value.doctorprofile.doctorexperiences)} {__('Year(s) exp.')} | {value.doctoreducations && value.doctoreducations.map((ivalue, index) => ivalue.tag.tagdetails[0].title + ((item.data.doctoreducations.length - 1) === index ? '' : ", "))}</p>
                                        <p>
                                            {value.doctorprofile.doctortags.map((ivalue, index) => ivalue.tag.tagdetails[0].title + ((value.doctorprofile.doctortags.length - 1) === index ? '' : ", "))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}