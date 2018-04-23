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
    lang: state.lang
}))

export default class Membership extends React.Component {
	constructor(props) {
		super(props);
        this.tagtypeIds = utilsActions.tagtypeIds();
        this.handleDataUpdate = event => {
            let obj;
            this.props.state.helperData.insurance_companies_tags.map((item) => {
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
                this.props.state.dispatch({type: 'REMOVE_TAG_LABEL', name: itemName, value: itemValue, obj: obj})
        }
        this.addNewTag = value => {
            let newTag = value.value;
            if(newTag) this.props.state.dispatch( actions.doctor_new_clinic_add.customTagAdd(this.props, newTag, this.tagtypeIds.InsuranceCompaniesTagId) )
        }
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        return (
            <div key={'insurance_companies'}>
                <h3>{__('Insurance Companies')}</h3>
                <FormGroup controlId="insurance_companies">
                    <Select
                        isCreatable={true}
                        name='insurance_companies'
                        onChange={this.handleDataUpdate}
                        value={''}
                        onNewOptionClick={this.addNewTag}
                        isLoading={this.props.state.newTagCreationStates.insuranceTagLoading}
                        options={this.props.state.helperData.insurance_companies_tags}/> 
                    <HelpBlock>{''}</HelpBlock>
                </FormGroup>
                <Well>
                    <div className="Select--multi">
                        { this.props.state.additionalInfo.insurance_companies.length === 0 && <p>{__('No record')}</p> }
                        {
                            this.props.state.additionalInfo.insurance_companies.map(item => 
                                <div key={'spec-tag-label-'+item.value} className="Select-value tags-close " style={{marginLeft: '0px'}}>
                                    {this.props.state.basicDetails.is_live != 1 && <span className="Select-value-icon" data-itemName={'insurance_companies'} data-d={JSON.stringify(item)} data-itemValue={item.value} onClick={this.handleRemoveTag}>×</span>}
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
        this.props.state.dispatch({
            type: 'UPDATE_ADD_INFO_VALUE',
            name,
            value,
            obj
        });
    }
}