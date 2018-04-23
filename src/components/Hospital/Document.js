import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../../api/config'
import {connect} from 'react-redux';
import actions from '../../redux/actions';
import makeTranslater from '../../translate';
import {getStatusLabel} from '../../utils';
import GalleryView from '../Common/GalleryView';

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
    BPanel,
    Image,
    Thumbnail
} from '@sketchpixy/rubix';
        
@connect(state => ({
session: state.session,
        location: state.location,
        loading: state.view.loading || false,
        translations: state.translations,
        lang: state.lang,
        ...state.view.hospital_profile
}))

export default class Document extends React.Component {
    constructor(props) {
        super(props);

        this.handleDocumentState = event => {
            this.changeDocumentStatus(
                event.target.getAttribute('data-item-id'),
                event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
                event.target.getAttribute('data-item-type')
            );
        };
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
        let resetDocumentForm = false; 
        if(this.props.resetDocumentForm) {
            document.getElementById("imageForm").reset();
            document.getElementById("videoForm").reset();
        }
        return (
            <Row key="doctor-document">
                <Col sm={12}>
                    <h3>{__('Documents')}</h3>
                    <Row>
                        <Form className='imageForm' id='imageForm'>
                            <FormControl
                                type='hidden'
                                name='file_type'
                                value='image'
                            />
                            <Col sm={4}>
                                <FormGroup
                                    controlId='document_type'
                                >
                                    <ControlLabel>{__('Document Type')}</ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        name='document_type'
                                        className="document_type"
                                    >
                                        <option value="">{__('Select')}</option>
                                        <option value="prescription_pad">{__('Prescription Pad')}</option>
                                        <option value="clinic_reg_proof">{__('Clinic Registration Proof')}</option>
                                        <option value="waste_disposal_certificate">{__('Waste Disposal Certificate')}</option>
                                        <option value="tax_receipt">{__('Tax Receipt')}</option>
                                        <option value="public_photos">{__('Clinic Photos for public profile')}</option>
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup controlId={'hospital_files'}>
                                    <ControlLabel>{__('Upload Image')}</ControlLabel>
                                    <FormControl
                                        type='file'
                                        name='hospital_files'
                                        className="doc_file"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <Button
                                    bsStyle="primary"
                                    style={{marginTop: '23px'}}
                                    onClick={::this.saveImage}
                                    >
                                    {__('Upload')}
                                </Button>
                            </Col>
                            <FormControl
                                type='hidden'
                                name='is_active'
                                value='1'
                            />
                        </Form>
                    </Row>
                </Col>
                <Col sm={12}>
                    <Row className='gallery-view'>
                        { this.props.hospitalFiles.images.map(this.getDataRow, this) }
                        { this.props.hospitalFiles.images.length === 0 && this.getNoDataRow(__, "image") }
                    </Row>
                </Col>
                <Col sm={12}>
                    <h3>{__('Videos')}</h3>
                    <Row>
                        <Form className='videoForm' id='videoForm'>
                            <FormControl
                                type='hidden'
                                name='file_type'
                                value='video'
                            />
                            <Col sm={4}>
                                <FormGroup controlId={'hospital_files'}>
                                    <ControlLabel>{__('Upload Video')}</ControlLabel>
                                    <FormControl
                                        type='file'
                                        name='hospital_files'
                                        className='vid_file'
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <Button
                                    bsStyle="primary"
                                    style={{marginTop: '23px'}}
                                    onClick={::this.saveVideo}
                                    >
                                    {__('Upload')}
                                </Button>
                            </Col>
                            <FormControl
                                type='hidden'
                                name='is_active'
                                value='1'
                            />
                        </Form>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={12}>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{__('Video name')}</th>
                                        <th>{__('Status')}</th>
                                        <th>{__('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.props.hospitalFiles.videos.map(this.getDataVideo, this) }
                                    { this.props.hospitalFiles.videos.length === 0 && this.getNoDataRow(__, "video") }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
    
    getNoDataRow(__, type) {
        if(type === 'image') {
            return (
                <p className='text-center'>{__('No images found.')}</p>
            )
        } else {
            return (
                <tr key={0}>
                    <td colSpan={4} className="text-center">{__('No data found')}</td>
                </tr>
            )
        }
    }

    getDataRow(item,index){
        return (
            <Col xs={6} sm={3} collapseRight key={'img'+index}>
                <GalleryView image={imageUrl+'/'+item.hospital_files} title={item.original_name} subtitle={this.getDocumentTypeTitle(item.document_type, __)}/>
            </Col>
        )
    }

    getDataVideo(item,index){
        if(item.file_type == 'video'){
            return (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.original_name}</td>
                    <td>{getStatusLabel(parseInt(item.is_active), __)}</td>
                    <td>
                        <Icon
                            className={item.is_active == 1 ? 'fg-deepred': 'fg-darkgreen'}
                            style={{fontSize: 20}}
                            glyph={this.getStatusIcon(parseInt(item.is_active))}
                            onClick={this.handleDocumentState}
                            data-item-id={item.id}
                            data-item-status={item.is_active}
                            data-item-type={item.file_type}
                        />
                    </td>
                </tr>
            )
        }
    }

    async saveImage() {
        if (!ReactDOM.findDOMNode(this).querySelector('.document_type').value)
            return Messenger().post({
                type: 'error',
                message: __('Please Select Document Type')
            });
        if (!ReactDOM.findDOMNode(this).querySelector('.doc_file').value)
            return Messenger().post({
                type: 'error',
                message: __('Please upload file')
            });

        let data = new FormData(ReactDOM.findDOMNode(this).querySelector('.imageForm'));
        data.append('hospitalId',this.props.basicDetails.id);
        this.props.data.dispatch(
            actions.hospital_profile.saveImage(this.props.data, data)
        );
    }

    async saveVideo() {
        if (!ReactDOM.findDOMNode(this).querySelector('.vid_file').value)
            return Messenger().post({
                type: 'error',
                message: __('Please upload video')
            });
        let data = new FormData(ReactDOM.findDOMNode(this).querySelector('.videoForm'));
        data.append('hospitalId',this.props.basicDetails.id);
        this.props.data.dispatch(
            actions.hospital_profile.saveImage(this.props.data, data)
        );
    }

    getStatusIcon(status) {
        switch (status) {
            case 0:
                return 'icon-simple-line-icons-check';
            case 1:
                return 'icon-simple-line-icons-close';
            case -1:
                return 'icon-fontello-spin4';
        }
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

    changeDocumentStatus(itemId, status, itemType) {
        this.props.data.dispatch(
            actions.hospital_profile.changeDocumentStatus(
                this.props.data,
                itemId,
                status,
                itemType
            )
        )
    }
}