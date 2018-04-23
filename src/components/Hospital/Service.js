import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import Select from '../../components/Select';
import actions from '../../redux/actions';
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
    session: state.session,
    translations: state.translations,
    lang: state.lang,
    ...state.view.hospital_profile
}))

export default class Service extends React.Component {
	constructor(props) {
		super(props);
        this.tagtypeIds = utilsActions.tagtypeIds();
        this.handleDataUpdate = event => {
            let obj;
            this.props.helperData.service_tags.map((item) => {
                if(event.target.value == item.value)
                    obj = item;
            })
            this.updateData(event.target.name, event.target.value, obj);
        }
        this.handleRemoveTag = event => {
            let itemName = event.target.getAttribute('data-itemName'),
                itemValue = event.target.getAttribute('data-itemValue'),
                obj = JSON.parse(event.target.getAttribute('data-d'));
            if(itemName && itemValue)
                this.props.dispatch({type: 'REMOVE_TAG_LABEL', name: itemName, value: itemValue, obj: obj})
        }
        this.addNewTag = value => {
            let newTag = value.value;
            if(newTag) this.props.dispatch( actions.hospital_profile.customTagAdd(this.props, newTag, this.tagtypeIds.ServiceTagId) )
        }
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        return (
            <div key={'services'}>
                <h3>{__('Services')}</h3>
                <FormGroup controlId="services" validationState={this.props.errors.services ? 'error': null}>
                    <ControlLabel>{__('Services')}</ControlLabel>
                    <Select
                        isCreatable={true}
                        name='services'
                        onChange={this.handleDataUpdate}
                        value={''}
                        onNewOptionClick={this.addNewTag}
                        isLoading={this.props.newTagCreationStates.serviceTagLoading}
                        options={this.props.helperData.service_tags}/>
                    <HelpBlock>{this.props.errors.services}</HelpBlock>
                </FormGroup>
                <Well>
                    <div className="Select--multi">
                        { this.props.additionalInfo.services.length === 0 && <p>{__('No record')}</p> }
                        {
                            this.props.additionalInfo.services.map(item => 
                                <div key={'spec-tag-label-'+item.value} className="Select-value tags-close " style={{marginLeft: '0px'}}>
                                    {this.props.basicDetails.is_live != 1 && <span className="Select-value-icon" data-itemName={'services'} data-d={JSON.stringify(item)} data-itemValue={item.value} onClick={this.handleRemoveTag}>×</span>}
                                    <span className="Select-value-label">{item.label}
                                      <span className="Select-aria-only">&nbsp;</span>
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </Well>
            </div>
        )
    }
    
    updateData(name, value, obj) {
        this.props.dispatch({
            type: 'UPDATE_ADD_INFO_VALUE',
            name,
            value,
            obj
        });
    }
}