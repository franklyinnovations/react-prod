import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import actions from '../../redux/actions';
import {getYears} from '../../utils';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import {imageUrl} from '../../../api/config';
import Pagination from '../../components/Pagination';

import BasicDetail from '../../components/DoctorClinic/BasicDetail';
import Award from '../../components/DoctorClinic/Award';
import Membership from '../../components/DoctorClinic/Membership';
import Specialization from '../../components/DoctorClinic/Specialization';
import Service from '../../components/DoctorClinic/Service';
import Document from '../../components/DoctorClinic/Document';
import InsuranceCompanies from '../../components/DoctorClinic/InsuranceCompanies';
import Shift from '../../components/DoctorClinic/Shift';
import DoctorMap from '../../components/DoctorClinic/DoctorMap';

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
    Image,
    Label
}  from '@sketchpixy/rubix';

@connect(state => ({
    session: state.session,
    location: state.location,
    loading: state.view.loading || false,
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_clinic
}))
export default class DoctorClinic extends React.Component {
	constructor(props) {
		super(props);

        this.searchClinicProfile = eve => {
            this.props.dispatch(
                actions.doctor_clinic.searchClinic(this.props)
            )
        }
        this.editProfile = event => {
            let itemId = event.target.getAttribute('data-item-id');
            if(typeof itemId === undefined || itemId == '') return;
            this.props.dispatch(actions.doctor_clinic.edit(this.props, itemId))
        }

        this.handleSelect = eventKey => {
            if(this.props.basicDetails.id == "") return false;
            this.props.dispatch({
                type: 'UPDATE_TAB',
                tabKey: eventKey
            });
        }
    }

     changeTabs = event => {
        let tabKey = event.target.getAttribute('data-tab-key')
        this.props.dispatch({
            type: 'UPDATE_TAB',
            tabKey
        });
    };

    static fetchData(store) {
        return store.dispatch(
            actions.doctor_clinic.init(
                store.getState()
            )
        );
    }

  	render() {
        if (this.props.loading) return <Loading/>;
        let content, __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        switch(this.props.viewState) {
            case 'LIST_VIEW':
                content = this.renderListView(__);
                break;
            case 'EDIT_PROFILE_VIEW':
                content = this.renderEditProfileView(__)
                break;
            case 'SEARCH_VIEW':
                content = this.renderSearchView(__)
                break;
            default:
                content = this.renderProfileView(__);
        }

        return (
            <Row>
                <Col xs={12}>
                    <PanelContainer controls={false} className="overflow-visible">
                        <Panel>
                            <PanelHeader className='bg-green'>
                                <Grid>
                                    <Row>
                                        <Col xs={6} md={9} lg={9} className='fg-white'>
                                            <h3>
                                                { __('My Clinic') }
                                            </h3>
                                        </Col>
                                        <Col xs={6} md={3} lg={3} className="text-right">
                                            <h3>
                                                {
                                                    this.props.session.associatedProfileData && 
                                                    this.props.session.associatedProfileData.id && 
                                                    <Button
                                                        inverse
                                                        outlined
                                                        style={{marginBottom: 5}}
                                                        bsStyle='default'
                                                        onClick={this.searchClinicProfile}
                                                    >
                                                        {__('Add')}
                                                    </Button>
                                                }
                                            </h3>
                                        </Col>
                                    </Row>
                                </Grid>
                            </PanelHeader>
                            <PanelBody>
                                <Grid>
                                    {content}
                                </Grid>
                            </PanelBody>
                        </Panel>
                    </PanelContainer>
                </Col>
            </Row>
        )
    }

    renderListView(__) {

        let pendingClaimedProfile = this.props.hospitals.pendingClaimedProfile != null ? this.props.hospitals.pendingClaimedProfile.hospital : null;
        let pendingClaimedProfileContactInfo = pendingClaimedProfile ? pendingClaimedProfile.contactinformations.map((values) => { return values.value }) : []
        return (
            <div key='hospitals-list'>
                {
                    pendingClaimedProfile != null && 
                    <BPanel key={'hospital-'+this.props.hospitals.data.length}>
                        <Row>
                            <Col md={2} sm={4}>
                                <Image src={(pendingClaimedProfile.hospital_logo ? imageUrl+'/'+pendingClaimedProfile.hospital_logo : '/imgs/noimage.png')} thumbnail style={{maxHeight: '134px'}}/>
                            </Col>
                            <Col md={10} sm={8}>
                                <h3 style={{marginTop: '0px'}}>
                                    {pendingClaimedProfile.hospitaldetails[0].hospital_name}
                                    <span style={{float: 'right'}}>
                                        <Label 
                                            bsStyle="info" 
                                            style={{fontSize: '12px'}}
                                            title={__('This profile has been claimed successfully. Once your claim request will be approved, you will be able to manage the profile.')}
                                        >
                                            {__('Pending')}
                                        </Label>
                                    </span>
                                </h3>
                                <p className="separator-border"></p>
                                <p>{__('Contact details')}: {pendingClaimedProfileContactInfo.join(" | ")}<br/>
                                {__('Address')}: {pendingClaimedProfile.hospitaldetails[0].address}</p>
                            </Col>
                        </Row>
                    </BPanel>
                }
                {this.props.hospitals.data.map(this.getListData, this)}
                {this.props.hospitals.data.length === 0 && this.getNoListRow(__)}
            </div>
        )
    }

    getListData(item, index) {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        let contactInfos = item.contactinformations.map((values) => {
            return values.value;
        })
        return (
            <BPanel key={'hospital-'+index}>
                <Row>
                    <Col md={2} sm={4}>
                        <Image src={(item.hospital_logo ? imageUrl+'/'+item.hospital_logo : '/imgs/noimage.png')} thumbnail style={{maxHeight: '134px'}}/>
                    </Col>
                    <Col md={10} sm={8}>
                        <h3 style={{marginTop: '0px'}}>
                            {item.hospitaldetails[0].hospital_name}
                            <span style={{float: 'right'}}>
                                {
                                    item.is_live === 1 ? 
                                    <Label bsStyle="success" style={{fontSize: '12px'}}>{__('Live')}</Label> : 
                                    (
                                        item.verified_status === 'incomplete-profile' ? 
                                        <Label bsStyle="warning" style={{fontSize: '12px'}}>{__('Incomplete Profile')}</Label> :
                                        null 
                                    )    
                                }
                                { item.is_live === 1 && item.status === 0 && <Label bsStyle="danger" style={{fontSize: '12px'}}>{__('Inactive')}</Label> }
                            </span>
                        </h3>
                        <p className="separator-border"></p>
                        <p>{__('Contact details')}: {contactInfos.join(" | ")}<br/>
                        {__('Address')}: {item.hospitaldetails[0].address}</p>
                        <div style={{float: 'right'}}>
                            <Button
                                outlined bsStyle='lightgreen'
                                style={{marginBottom: 5}}
                                onClick={this.editProfile}
                                data-item-id={item.id}
                            >
                                {__('Edit Profile')}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </BPanel>
        )
    }

    getNoListRow(__) {
        return (
            <p className='text-center'>{__('No record found.')}</p>
        )
    }

    renderProfileView(__) {
        return (
            <p>{__('Coming soon.')}</p>
        )
    }

    renderEditProfileView(__) {
        return (
            <Accordion activeKey={this.props.activeTab}>
                <BPanel header={__('Clinic Details')} eventKey="basic-info-form" onSelect={this.handleSelect}>
                    <BasicDetail state={this.props}/>
                    <Row>
                        <Col sm={12}>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} data-form-key='basic_info_form' onClick={::this.saveData}>{__('SaveNext')}</Button>
                        </Col>
                    </Row>
                </BPanel>
                <BPanel header={__('Specialization & Services')} eventKey="spec-services-info-form" onSelect={this.handleSelect}>
                    <Form className="spec_services_info_form">
                        <Specialization state={this.props}/>
                        <hr/>
                        <Service state={this.props}/>
                    </Form>
                    <Row>
                        <Col sm={12}>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} data-form-key='spec_services_info_form' onClick={::this.saveData}>{__('SaveNext')}</Button>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'basic-info-form'} onClick={this.changeTabs}>{__('Previous')}</Button>
                        </Col>
                    </Row>
                </BPanel>
                <BPanel header={__('Awards & Memberships')} eventKey="awd-mem-info-form" onSelect={this.handleSelect}>
                    <Form className="awd_mem_info_form">
                        <Award state={this.props}/>
                        <hr/>
                        <Membership state={this.props}/>
                    </Form>
                    <Row>
                        <Col sm={12}>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'documents-info-form'} data-form-key='awd_mem_info_form' onClick={::this.saveData}>{__('SaveNext')}</Button>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'spec-services-info-form'} onClick={this.changeTabs}>{__('Previous')}</Button>
                        </Col>
                    </Row>
                </BPanel>
                <BPanel header={__('Clinic Photos/Videos/Certificates/Documents')} eventKey="documents-info-form" onSelect={this.handleSelect}>
                    <Document data={this.props} />
                    <Row>
                        <Col sm={12}>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'insur-comp-info-form'} onClick={this.changeTabs}>{__('Next')}</Button>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={this.changeTabs}>{__('Previous')}</Button>
                        </Col>
                    </Row>
                </BPanel>
                <BPanel header={__('Insurance Companies')} eventKey="insur-comp-info-form" onSelect={this.handleSelect}>
                    <Form className="insur_comp_info_form">
                        <InsuranceCompanies state={this.props}/>
                    </Form>
                    <Row>
                        <Col sm={12}>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'clinic-timings-info-form'} data-form-key='insur_comp_info_form' onClick={::this.saveData}>{__('SaveNext')}</Button>
                            <Button outlined bsStyle='lightgreen' className="btn btn-primary pull-right" data-tab-key={'awd-mem-info-form'} onClick={this.changeTabs}>{__('Previous')}</Button>
                        </Col>
                    </Row>
                </BPanel>
                <BPanel header={__('Clinic Timings')} eventKey="clinic-timings-info-form" onSelect={this.handleSelect}>
                    <Shift
                        data={this.props}
                    />
                </BPanel>
                <BPanel header={__('Doctors (Fee & Timings)')} eventKey="doc-fee-timings-info-form" onSelect={this.handleSelect}>
                    { this.props.basicDetails.is_freeze === 1 && <DoctorMap data={this.props}/> }
                    { this.props.basicDetails.is_freeze === 0 && <h3 className="text-center">{__('Please freeze your time first.')}</h3> }
                </BPanel>
            </Accordion>
        )
    }

    renderSearchView(__) {
        return (
            <DoctorAddClinic state={this.props} />
        )
    }

    saveData(event) {
        const saveActions = {
            basic_info_form: 'saveBasicInfo',
            spec_services_info_form: 'saveSpecServInfo',
            awd_mem_info_form: 'saveAwardMembershipsInfo',
            insur_comp_info_form: 'saveInsuranceCompanies',
        }
        this.props.dispatch(
            actions.doctor_clinic[saveActions[event.target.getAttribute('data-form-key')]](this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.'+event.target.getAttribute('data-form-key'))), event.target.getAttribute('data-tab-key'))
        );
    };

    cancelClaimRequest(event){
        this.props.dispatch(
            actions.doctor_clinic.cancelClaimRequest(this.props, event.target.getAttribute('data-item-id'))
        )
    }
}

class DoctorAddClinic extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            selected_city : [], 
            selected_specialization : [], 
            showModal : false, 
            show : true,
            currentUser : {}, 
            currentHospital : {},
            is_owner: 0
        };

        this.handleClinicClaimRequest = event => {
            this.props.state.dispatch(
                actions.doctor_clinic.sendClaimForClinic(this.props.state, event.target.getAttribute('data-item-id'))
            )
        }
    }

    handleDataUpdate = selected_city => {
        this.setState({ selected_city });
    }

    handleSpecializationUpdate = selected_specialization => {
        this.setState({ selected_specialization });
    }

    handleRadioChange = event => {
        this.setState({is_owner: event.target.value})
        this.props.state.dispatch({
            type: 'HIDE_NEW_PROFILE_CREATION_LINK'
        })
    }

    handleCreateNewClinic = event => {
        event.preventDefault()
        this.props.state.router.push('/doh/add-clinic');
    }

    renderRow(item, index){
        let __ = makeTranslater(
            this.props.state.translations,
            this.props.state.lang.code
        );

        let show = true, _ref = this;
        let contactInfo = []
        if(item.contactinformations != null) {
            item.contactinformations.map((itemm) => {
                contactInfo.push(itemm.value)
            })
        }

        return(
            <Well key={'spp-'+index}>
                <Row>
                    <Col xs={12} md={2} lg={2}>
                        <Image src={(item.hospital_logo ? imageUrl+'/'+item.hospital_logo : '/imgs/noimage.png')} circle />
                    </Col>
                    <Col xs={12} md={7} lg={7}>
                        <h4>{item.hospitaldetail.hospital_name}</h4>
                        <p>
                            { contactInfo.length > 0 ? contactInfo.join(" | ") : null }<br/>
                            { `${item.hospitaldetail.address}` }
                        </p>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        {  !_.isEmpty(_ref.props.state.filter) && !_.isEmpty(_ref.props.state.filter.filtered_hospital_list_obj_front) && _ref.props.state.filter.filtered_hospital_list_obj_front.mapped_hospitals.map(function (value) {
                  
                            if(value === item.id){
                                show = false;
                            }
                        }) }
                
                        { 
                            show ?
                            (
                                this.state.is_owner == 1 ? 
                                <Button
                                    outlined
                                    bsStyle='lightgreen'
                                    data-item-id={item.id}
                                    onClick={this.handleClinicClaimRequest}
                                >{__('Claim this profile')}</Button> : 
                                <Button
                                    outlined
                                    bsStyle='lightgreen'
                                    onClick={ () => this.setState({ showModal : true, currentHospital : item}) }
                                >{__('Add')}</Button>
                            ) : 
                            <Button
                                outlined
                                bsStyle='danger'
                            >{__('Already Mapped')}</Button> 
                        }
                    </Col>
                </Row>
            </Well>
        );
    }

    render(){
        let __ = makeTranslater(
            this.props.state.translations,
            this.props.state.lang.code
        );

        const { all_city_list, all_hospital_list_on_doctor } = this.props.state.helperData;
        const { selected_city } = this.state;
        let _ref = this, 
        filtered_hospital_list = this.props.state.clinicSearch != null && this.props.state.clinicSearch.filtered_hospital_list_obj_front ?  this.props.state.clinicSearch.filtered_hospital_list_obj_front.filtered_hospital_list : null;
        let lgClose = () => this.setState({ showModal : false });


        
        return (
            <Row key='sssssssss'>
                <Col sm={12}>
                    <Form>
                        <Row key="doctors-list">                  
                            <br/>
                            <Col xs={12} md={12} lg={12}>
                                <Row key="doctors-list2" style={this.state.show ? {} : { display: 'none' }}>
                                    <Col sm={12}>
                                        <div>
                                            <Radio 
                                                inline 
                                                value={1}
                                                name='is_owner' 
                                                onChange={this.handleRadioChange}
                                            >{__('I am clinic owner')}
                                            </Radio>
                                            <Radio 
                                                inline 
                                                value={0}
                                                name='is_owner'
                                                onChange={this.handleRadioChange}
                                                defaultChecked={true}
                                            >{__('I am visiting this clinic for consultation')}
                                            </Radio>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='name'
                                        >
                                            <ControlLabel>{__('Hospital')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Hospital Name')}
                                                inputRef={(ref) => {this.hospital_name = ref}}
                                                //value={this.props.hospital['hospital_detail[hospital_name]']}
                                                name='hospital_detail[hospital_name]'
                                                //onChange={this.handleDataUpdate}
                                                />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='city_name'
                                            >
                                            <ControlLabel>{__('City')}</ControlLabel>
                                            <Select
                                                multi
                                                options={ all_city_list }
                                                value={selected_city}
                                                onChange={this.handleDataUpdate.bind(this)}
                                              />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='email_id'
                                            >
                                            <ControlLabel>{__('Email')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Email')}
                                                inputRef={(ref) => {this.hospital_email = ref}}
                                                //onChange={this.handleDataUpdate}
                                                />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <FormGroup
                                            controlId='mobile'
                                            >
                                            <ControlLabel>{__('Mobile')}</ControlLabel>
                                            <FormControl
                                                type='text'
                                                placeholder={__('Enter Mobile')}
                                                inputRef={(ref) => {this.hospital_mobile = ref}}
                                                />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={12} lg={12}>
                                        <br/>
                                        <div>
                                            <Button
                                                outlined
                                                bsStyle='lightgreen'
                                                onClick={ () => ::_ref.save() }
                                            >
                                                {__('Search')}
                                            </Button>&nbsp;&nbsp;
                                            <Button
                                                outlined
                                                bsStyle='lightgreen'
                                                onClick={ () => ::_ref.reset() }
                                            >
                                                {__('Reset')}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={12} lg={12}>
                                <br/>
                                { filtered_hospital_list != null && filtered_hospital_list.map(this.renderRow, this) }
                                
                                {!_.isEmpty(filtered_hospital_list) && <Pagination
                                    data={this.props.state.clinicSearch.filtered_hospital_list_obj_front}
                                    onSelect={::this.save}
                                />}
                            </Col>
                            {
                                filtered_hospital_list != null && this.state.is_owner == 1 && 
                                this.props.state.clinicSearch.show_create_profile_option !== undefined && this.props.state.clinicSearch.show_create_profile_option && 
                                <Col sm={12} className="text-center" style={{marginBottom: '4px'}}>
                                    <Button outlined lg bsStyle='lightgreen' onClick={this.handleCreateNewClinic}>{__('click to create new profile')}</Button>
                                </Col>
                            }
                        </Row>
                    </Form>
                </Col>
            </Row>
        );
    }

    save(page = null){
        const { selected_city } = this.state;
        let data = { name : '', mobile : '', email : '', page : 1 };

        if(this.hospital_name.value){
            data['name'] = this.hospital_name.value;
        }

        if(page !== null){
            data['page'] = page;
        }

        if(this.hospital_mobile.value){
            data['mobile'] = this.hospital_mobile.value;
        }
        if(this.hospital_email.value){
            data['email'] = this.hospital_email.value;
        }

        let cityArr = selected_city.map(function (item){
            return item.value;
        })
        
        data['selected_city'] = cityArr;
        data['language'] = this.props.state.lang;
        data['logged_doctorprofile_id'] = this.props.state.session.associatedProfileData.id;
        if(this.state.is_owner == 1) data['non_claimed_profiles'] = true;

        this.props.state.dispatch(
            actions.doctor_clinic.filterHospitalsFront(this.props.state, data)
        );
    }

    reset() {
        this.hospital_name.value = '', this.hospital_mobile.value = '', this.hospital_email.value = '';
        this.setState({selected_city: []});

        this.props.state.dispatch({
            type: 'RESET_FILTER_FILTER_HOSPITALS_DATA'
        });
    }
}