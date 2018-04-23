import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
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
    Well
}  from '@sketchpixy/rubix';

@connect(state => ({
    translations: state.translations,
    lang: state.lang,
    ...state.view.doctor_profile
}))

export default class Specialization extends React.Component {
	constructor(props) {
		super(props);
        
        this.handleDataUpdate = event => {
            let obj;
            this.props.helperData.specialization_tags.map((item) => {
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
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );

        return (
            <div key={'specializations'}>
                <h3>{__('Specializations')} <span className='text-info' style={{fontSize: '12px'}}>({__('Max 3 allowed')})</span></h3>
                <FormGroup controlId="specializations" validationState={this.props.errors.specializations ? 'error': null}>
                    <Select
                        name='specializations'
                        onChange={this.handleDataUpdate}
                        value={''}
                        disabled={this.props.additionalInfo.specializations.length === 3}
                        options={this.props.helperData.specialization_tags}/>
                    <HelpBlock>{this.props.errors.specializations}</HelpBlock>
                </FormGroup>
                <Well>
                    <div className="Select--multi">
                        { this.props.additionalInfo.specializations.length === 0 && <p>{__('No record')}</p> }
                        {
                            this.props.additionalInfo.specializations.map(item => 
                                <div key={'spec-tag-label-'+item.value} className="Select-value tags-close " style={{marginLeft: '0px'}}>
                                    {this.props.basicDetails.is_live != 1 && <span className="Select-value-icon" data-itemName={'specializations'} data-d={JSON.stringify(item)} data-itemValue={item.value} onClick={this.handleRemoveTag}>×</span>}
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