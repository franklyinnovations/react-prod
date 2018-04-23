import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import makeTranslater from '../../translate';
import actions from '../../redux/actions';
import {getYears} from '../../utils';
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

export default class Award extends React.Component {
	constructor(props) {
		super(props);
        this.yearValues = getYears();
        this.state = {
            award_gratitude_title: '',
            award_year: ''
        }
        this.handleAwardInputUpdate = event => {
            this.setState({[event.target.name]: event.target.value})
        }
    }

  	render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        return (
            <div>
                <h3>{__('Awards & Gratitudes')}</h3>

                {/* Add Experience info form */}
                <Well>
                    <Row>
                        <Col lg={6} md={6} sm={12}>
                            <FormGroup controlId="award_gratitude_title" validationState={null} >
                                <ControlLabel>{__('Awards / Gratitude Title')}</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder={__('Awards / Gratitude Title')}
                                    value={this.state.award_gratitude_title}
                                    name='award_gratitude_title'
                                    onChange={this.handleAwardInputUpdate}
                                />
                                <HelpBlock>{null}</HelpBlock>
                            </FormGroup>
                        </Col>
                        <Col lg={4} md={4} sm={12}>
                            <FormGroup controlId="award_year" validationState={null} >
                                <ControlLabel>{__('Year')}</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    onChange={this.handleAwardInputUpdate}
                                    name='award_year'
                                    value={this.state.award_year}
                                >
                                    <option value="">{__('Award Year')}</option>
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
                        <Col  lg={2} md={2} sm={12} className='text-right'>
                            <FormGroup>
                                <ControlLabel>&nbsp;</ControlLabel>
                                <Button 
                                    outlined 
                                    bsStyle='lightgreen' 
                                    className="btn btn-primary pull-right" 
                                    onClick={::this.addMoreAwards}>
                                    {__('Add')}
                                </Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Well>

                {
                    this.props.awards.length > 0 && 
                    <Table condensed striped>
                        <thead>
                            <tr>
                                <th>{__('Awards / Gratitude Title')}</th>
                                <th>{__('Year')}</th>
                                <th>{__('Action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.awards.map(this.getDataRow, this)}
                        </tbody>
                    </Table>
                }
            </div>
        )
    }

    getDataRow(item, index) {
        return (
            <tr key={index}>
                <td>{item.award_gratitude_title}</td>
                <td>{item.award_year}</td>
                <td>
                    {
                        item.newAdd && 
                        //this.props.basicDetails.is_live !== 1 && 
                        <Icon
                            className={'fg-deepred'}
                            style={{fontSize: 20}}
                            glyph={'icon-simple-line-icons-close'}
                            onClick={::this.removeAward}
                            data-itemIndex={index}
                            title={__('Remove')}
                        />
                    }
                </td>
            </tr>
        )
    }

    addMoreAwards() { 
        if(!this.state.award_gratitude_title || !this.state.award_year) {
            Messenger().post({ type: 'error', message: window.__('Please fill all fields') });
            return false;
        }
        this.props.dispatch({
            type: 'ADD_MORE_AWARD',
            award_gratitude_title: this.state.award_gratitude_title,
            award_year: this.state.award_year,
            doctorProfileId: this.props.basicDetails.id
        })
        this.setState({award_gratitude_title: '', award_year: ''})
    }
    removeAward(ev) { 
        let getIndex = ev.target.getAttribute('data-itemIndex')
        this.props.dispatch({ type: 'REMOVE_AWARD', index: getIndex }) 
    }
}