import React from 'react';
import {connect} from 'react-redux';

import Clearfix from 'react-bootstrap/lib/Clearfix';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


import {getInputValue} from '../utils';
import makeTranslater from '../translate';
import api, {makeErrors} from '../api';

const initialDemoRequest = {
	first_name: '',
	last_name: '',
	email: '',
	mobile: '',
	school_name: '',
	number_of_students: '',
	message: '',
};

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class DemoRequest extends React.Component {

	state = {
		errors: {},
		item: {...initialDemoRequest},
	};

	update = event => this.setState({
		item: {...this.state.item, [event.target.name]: getInputValue(event.target)}
	});

	submit = async () => {
		let {data} = await api({
			url: '/demo/send',
			data: {
				...this.state.item,
				lang: this.props.lang.code,
			},
		});
		if (data.errors) {
			this.setState({errors: makeErrors(data.errors)});
		} else if (!data.status) {
			this.setState({errors: {}});
		} else {
			this.setState({item: {...initialDemoRequest}, errors: {}});
		}
	};

	constructor(props) {
		super(props);
		this.handleUpdate = event => this.update(
			event.target.getAttribute('data-action-type'),
			event.target.name,
			getInputValue(event.target),
		);
	}

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<section className="request-section">
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<div className="heading-area">
								<h2 className="heading"> {_('REQUEST A LIVE DEMO')} </h2>
								<h3 className="sub-heading"> {_('Please answer a few questions to help us prepare for your demo, and we will contact you very soon.')}' </h3>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="site-form">
								<div className="row">
									<div>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.first_name ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.first_name}
													name='first_name'
													type="text" className="form-control" placeholder={_('First Name')}/>
												<HelpBlock>{this.state.errors.first_name}</HelpBlock>
											</FormGroup>
										</div>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.last_name ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.last_name}
													name='last_name'
													type="text" className="form-control" placeholder={_('Last Name')}/>
												<HelpBlock>{this.state.errors.last_name}</HelpBlock>
											</FormGroup>
										</div>
										<Clearfix/>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.email ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.email}
													name='email'
													type="text" className="form-control" placeholder={_('Email Address')}/>
												<HelpBlock>{this.state.errors.email}</HelpBlock>
											</FormGroup>
										</div>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.mobile ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.mobile}
													name='mobile'
													type="text" className="form-control" placeholder={_('Mobile Number')}/>
												<HelpBlock>{this.state.errors.mobile}</HelpBlock>
											</FormGroup>
										</div>
										<Clearfix/>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.school_name ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.school_name}
													name='school_name'
													type="text" className="form-control" placeholder={_('School Name')}/>
												<HelpBlock>{this.state.errors.school_name}</HelpBlock>
											</FormGroup>
										</div>
										<div className="col-md-6">
											<FormGroup validationState={this.state.errors.number_of_students ? 'error' : null}>
												<input
													onChange={this.update}
													value={this.state.item.number_of_students}
													name='number_of_students'
													type="text" className="form-control" placeholder={_('Number of students')}/>
												<HelpBlock>{this.state.errors.number_of_students}</HelpBlock>
											</FormGroup>
										</div>
										<Clearfix/>
										<div className="col-md-12">
											<FormGroup validationState={this.state.errors.message ? 'error' : null}>
												<textarea
													onChange={this.update}
													value={this.state.item.message}
													name='message'
													className="form-control" placeholder={_('Message')}/>
												<HelpBlock>{this.state.errors.message}</HelpBlock>
											</FormGroup>
										</div>
										<Clearfix/>
										<div className="col-sm-12 text-center">
											<div className="submit-form">
												<input onClick={this.submit} type="submit" className="btn btn-rouned btn-secondary" value={_('Send Request')} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<span className="school-bus"> <img src="/imgs/front/kids-with-bus.png"/> </span>
			</section>
		);
	}
}