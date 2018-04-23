import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../api/config'
import {connect} from 'react-redux';
import actions from '../redux/actions';
import makeTranslater from '../translate';
import {getStatusLabel} from '../utils';

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
    BPanel
} from '@sketchpixy/rubix';
        
@connect(state => ({
session: state.session,
        location: state.location,
        loading: state.view.loading || false,
        translations: state.translations,
        lang: state.lang,
        ...state.view.signup
}))

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
        return (
            <Form className="signupForm" >
                <Row>
                    <Col xs={12} md={12}>
                        <div className="form-group">
                            <FormControl
                                componentClass="select"
                                placeholder="select"
                                name='roleId'
                                onChange={::this.handleSignUpData}
                                value={this.props.roleId}
                            >
                                <option value="">{__("Role")}</option>
                                <option value="3">{__("Doctor")}</option>
                                <option value="1">{__("Hospital/Clinic Owner")}</option>
                                <option value="4">{__("Doctor and Clinic Owner")}</option>
                                <option value="5">{__("Home Healthcare")}</option>
                                <option value="6">{__("Provider(Nurses/Attendants)")}</option>
                            </FormControl>
                        </div>
                    </Col>
                    <Col xs={12} md={12}>
                        <div className="form-group">
                            <FormControl
                                type='text'
                                className='form-control'
                                name='name'
                                onChange={::this.handleSignUpData}
                                value={this.props.name}
                                placeholder={__("Full Name")}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={12}>
                        <div className="form-group">
                            <FormControl
                                type='text'
                                className='form-control'
                                name='email'
                                onChange={::this.handleSignUpData}
                                value={this.props.email}
                                placeholder={__("Email")}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={12}>
                        <FormGroup
                            controlId='mobile'
                        >
                            <FormControl
                                type='text'
                                className='form-control'
                                name='mobile'
                                onChange={::this.handleSignUpData}
                                value={this.props.mobile}
                                placeholder={__("Mobile")}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} md={12}>
                        <div className="form-group">
                            <FormControl
                                type='password'
                                className='form-control'
                                name='password'
                                onChange={::this.handleSignUpData}
                                value={this.props.password}
                                placeholder={__("Create Password")}
                            />
                        </div>
                    </Col>
                </Row>
                <div className="form-group">
                    <Button type='submit' className="btn orange-btn">{__("Login")}</Button>
                </div>
            </Form>
        );
    }

    handleSignUpData(event) {
        this.props.dispatch(
            actions.signup.updateSignUpData(
                event.target.name,
                event.target.value
            )
        )
    }
}
