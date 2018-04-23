import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import {getSalutation} from '../../utils';
import actions from '../../redux/actions';
import {getYears} from '../../utils';
import {imageUrl} from '../../../api/config';
import * as utilsActions from '../../utils';
import Select from '../../components/Select';
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
    session: state.session,
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class Education extends React.Component {
	constructor(props) {
        super(props);
        this.tagtypeIds = utilsActions.tagtypeIds();
        this.yearValues = getYears();
        this.state = {
            tagtypeId: '',
            tagname: '',
            college_name: '',
            year_of_passing: '',
            edu_proof: '',
            edulength: this.props.educations.length
        }
        
        this.handleEducationInputUpdate = event => {
            this.props.dispatch({
                type: 'UPDATE_QUALIFICATION_INPUT', 
                name: event.target.name, 
                value: event.target.value
            })
        }
        this.addNewTag = value => {
            let newTag = value.value;
            if(newTag) this.props.dispatch( actions.doctor_profile.customTagAdd(this.props, newTag, this.tagtypeIds.EducationQualificationTagId) )
        }     

        this.handleChangeImage = event => {
            let index = event.target.getAttribute('data-index');
            let ufile = event.target;
            if (event.target.files && event.target.files[0]) {
                if(-1 === ["image/jpeg", "image/png"].indexOf(event.target.files[0].type)) {
                    let msg = window.__("Only images are allowed");
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
                    this.setState({edu_proof: ufile, ['edu_proof___'+index]: e.target.result})
                };
                reader.readAsDataURL(event.target.files[0]);

                this.reInitializeGalleryView()
            }
        }
    }

    componentDidMount() {
        var links = document.getElementsByClassName('edu-proof-img');
        $('.edu-proof-img').unbind('click').bind('click', function(event) {
            blueimp.Gallery(links, {
                index: $(this).get(0),
                event: event
            });
        }); 
    }

    reInitializeGalleryView() {
        var links = document.getElementsByClassName('edu-proof-img');
        $('.edu-proof-img').unbind('click').bind('click', function(event) {
            blueimp.Gallery(links, {
                index: $(this).get(0),
                event: event
            });
        });
    }

  	render() {
        if (this.props.loading) return <Loading/>;
        let content, __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        let prevLeng = this.state.edulength;

        let allQualifTags = this.props.helperData.qualification_tags.filter((item) => {
            return {label: item.label, value: item.value, tagtypeId: item.tagtypeId}
        });

  		return (
            <div key='education'>
                <h3>{__('Educations')}</h3>
                
                <Well style={{overflow: 'hidden'}}>
                    <Row>
                        <Col xs={6} sm={3}>
                            <FormGroup controlId="tagtypeId" validationState={null} >
                                <ControlLabel>{__('Qualification')}</ControlLabel>
                                <Select
                                    isCreatable={true}
                                    name='tagtypeId'
                                    onChange={this.handleEducationInputUpdate}
                                    value={this.props.qualificationStates.tagtypeId}
                                    onNewOptionClick={this.addNewTag}
                                    isLoading={this.props.qualificationStates.qualificationTagLoading}
                                    options={allQualifTags}
                                    //options={this.props.helperData.qualification_tags.map}
                                />
                                {/*<FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    onChange={this.handleEducationInputUpdate}
                                    name='tagtypeId'
                                    value={this.state.tagtypeId}
                                >
                                    <option value="">{__('Qualification')}</option>
                                    {
                                        this.props.helperData.qualification_tags.map((value, index) =>
                                            <option value={value.value} data-tag-name={value.label} key={'qual-tag-'+value.value}>{
                                                value.label
                                            }</option>
                                        )
                                    }
                                </FormControl>*/}
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={3}>
                            <FormGroup controlId="college_name" validationState={null}>
                                <ControlLabel>{__('College')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('College')}
                                    value={this.props.qualificationStates.college_name}
                                    name='college_name'
                                    onChange={this.handleEducationInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={2}>
                            <FormGroup controlId="year_of_passing" validationState={null}>
                                <ControlLabel>{__('Passing year')}</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleEducationInputUpdate}
                                    name='year_of_passing'
                                    value={this.props.qualificationStates.year_of_passing}
                                >
                                    <option value="">{__('Select year')}</option>
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
                        <Col xs={6} sm={4}>
                            <FormGroup validationState={null}>
                                <ControlLabel>{__('Qualification Proof')}</ControlLabel>
                                <div id="edu-proof-inputs">
                                    <FormControl type="file" name={"edu_proof___"+prevLeng} data-index={prevLeng} className={"edu_proof_file_input"} onChange={this.handleChangeImage}/>
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
                                onClick={::this.addMoreEducations}
                            >{__('Add')}
                            </Button>
                        </Col>
                    </Row>
                </Well>

                {
                    this.props.educations.length > 0 && 
                    <Table condensed striped>
                        <thead>
                            <tr>
                                <th>{__('Qualification')}</th>
                                <th>{__('College')}</th>
                                <th>{__('Passing year')}</th>
                                <th>{__('Qualification Proof')}</th>
                                <th>{__('Action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.educations.map(this.getDataRow, this)}
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

        let allQualifTags = this.props.helperData.qualification_tags;
        for(var i = 0; i < allQualifTags.length; i++) {
            if(allQualifTags[i].value == item.tagtypeId) break;
        }
        return (
            <tr key={index}>
                <td>{allQualifTags[i].label}</td>
                <td>{item.college_name}</td>
                <td>{item.year_of_passing}</td>
                <td>
                    {
                        item.newAdd ? 
                        <div>
                            <Image responsive src={this.state['edu_proof___'+index]} alt={''} style={{width: '60px'}} className={'edu-thumb-'+index}/>
                        </div> :
                        <a className={'edu-proof-img gallery-item-link edu-thumb-link-'+index} href={ imageUrl+'/'+item.edu_proof } title={item.edu_proof_file_name}>
                            <Image responsive src={imageUrl+'/'+item.edu_proof} alt={item.edu_proof_file_name} style={{width: '60px'}} className={'edu-thumb-'+index}/>
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
                            onClick={::this.removeEducation}
                            data-itemIndex={index}
                            title={__('Remove')}
                        />
                    }
                </td>
            </tr>
        )
    }

    addMoreEducations() { 
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        if(!this.props.qualificationStates.tagtypeId || !this.props.qualificationStates.college_name || !this.props.qualificationStates.year_of_passing || !this.state.edu_proof) {
            Messenger().post({ type: 'error', message: __('Please fill all fields') });
            return false;
        }

        let prevLen = this.state.edulength;

        let element = document.getElementsByClassName("edu_proof_file_input");
        for(let i = 0; i < element.length; i++)
            element[i].classList.add("hide")
        
        let input = document.createElement("input")
        input.setAttribute('type',"file");
        input.className = "edu_proof_file_input";
        input.name = 'edu_proof___'+(prevLen+element.length)
        input.setAttribute("data-index", (prevLen+element.length))
        input.addEventListener('change', ::this.handleChangeImage)

        document.getElementById("edu-proof-inputs").appendChild(input)

        this.props.dispatch({
            type: 'ADD_MORE_EDUCATION',
            tagtypeId: this.props.qualificationStates.tagtypeId,
            college_name: this.props.qualificationStates.college_name,
            year_of_passing: this.props.qualificationStates.year_of_passing,
            doctorProfileId: this.props.basicDetails.id
        })

        this.setState({tagtypeId: '', college_name: '', year_of_passing: '', edu_proof: ''})
    }
    
    removeEducation(ev) { 
        let getIndex = ev.target.getAttribute('data-itemIndex')
        var fileInput = document.getElementsByName("edu_proof___"+getIndex);
        if(fileInput[0]) fileInput[0].remove();
        this.setState({edulength: (this.props.educations.length - 1) < 0 ? 0 : (this.props.educations.length - 1)})
        this.props.dispatch({ type: 'REMOVE_EDUCATION', index: getIndex }) 
    }
};

class EducationProofImageView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <PanelContainer controls={false}>
                <Panel style={{background: '#E9F0F5'}}>
                    <PanelHeader>
                        <Grid className='gallery-item'>
                            <Row>
                                <Col xs={12} style={{padding: 12.5}}>
                                    <a className='gallery-1 gallery-item-link' href={this.props.image} title={this.props.title}>
                                        {/*<Thumbnail href="#" alt={this.props.title} src={this.props.image} width='200px' height='150px' />*/}
                                        <Image responsive src={this.props.image} alt={this.props.title} width='200' height='150' style={{height: '150px', width: '200px'}}/>
                                        <div className='black-wrapper text-center'>
                                            <Table style={{height: '100%', width: '100%'}}>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Icon glyph='icon-outlined-magnifier-plus icon-3x' style={{color: 'white', display: 'block'}}/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </a>
                                    <div className='text-center'>
                                        <h4 className='fg-darkgrayishblue75 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h4>
                                        <h6 className='fg-darkgrayishblue75 visible-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h6>
                                        <h5 className='fg-darkgray50 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.subtitle}</h5>
                                        <h6 className='visible-xs' style={{textTransform: 'uppercase'}}><small className='fg-darkgray50'>{this.props.subtitle}</small></h6>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </PanelHeader>
                </Panel>
            </PanelContainer>
        );
    }
}
