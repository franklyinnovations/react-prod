import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import Loading from '../components/Loading';
import BannerSimple from '../front/BannerSimple';
import makeTranslater from "../translate";
import actions from '../redux/actions';
import DropIn from 'braintree-web-drop-in-react';
import moment from 'moment';

import {
	Modal
} from '@sketchpixy/rubix';

const viewName = 'subscriptionplan';
@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class SubscriptionExpired extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			doctorPlanType: 1,
			hospitalPlanType: 1,
			bothPlanType: 1
		};
	}

	static fetchData(store) {
		return store.dispatch(
			actions[viewName].init(store.getState())
		);
	}

	handleDoctorTab = event => {
		event.preventDefault();
		this.setState({doctorPlanType: parseInt(event.target.getAttribute('data-type'))});
	};

	handleHospitalTab = event => {
		event.preventDefault();
		this.setState({hospitalPlanType: parseInt(event.target.getAttribute('data-type'))});
	};

	handleBothTab = event => {
		event.preventDefault();
		this.setState({bothPlanType: parseInt(event.target.getAttribute('data-type'))});
	};

	handleBuyNow = event => {
		event.preventDefault();
		this.props.dispatch(
			actions[viewName].showPaymentModal(this.props, parseInt(event.target.getAttribute('data-plan')))
		);
	};

	handleMakePayment = event => this.props.dispatch({
		type: 'SHOW_PAYMENT_DROP_IN'
	});

	handleInstance = instance => this.props.dispatch({
		type: 'SET_PAYMENT_INSTANCE',
		instance
	});

	closePaymentModal() {
		this.props.dispatch({
			type: 'CLOSE_PAYMENT_MODAL'
		});
	}

	async buy() {

		const { nonce } = await this.props.payment.instance.requestPaymentMethod();

		if(nonce){
			this.props.dispatch(
				actions[viewName].makePayment(this.props, nonce)
			);
		}
	}

	render() {

		let plan = {};
		if(this.props.session.id) {
			plan = this.props.items[this.props.session.user_type];
		}

		return (
			<div id="front2">
				<Header />
				{
					!this.props.session.id &&
					<BannerSimple title='Honest, Transparent Pricing.' image='/imgs/home/register-icon.png'/>
				}
				<div className='career-content-sec'>
					<div className='container'>
						<div className='row'>
							<div className='col-sm-12'>
								<h1 className="text-center">Subscription plan</h1>
							</div>
						</div>
						{
							this.props.loading ? <Loading />:
							(
								this.props.session.id &&
								(
									this.props.session.user_type === 'doctor' ||
									this.props.session.user_type === 'hospital' ||
									this.props.session.user_type === 'doctor_clinic_both'
								) ? this.renderPlan(plan):this.renderAllPlan()
							)
						}
					</div>
				</div>
				<Footer />

				{
					this.props.session.id &&
					<Modal backdrop='static' show={this.props.payment.showModal} onHide={::this.closePaymentModal}>
						<Modal.Header closeButton className="text-center">
							<Modal.Title>Subscription</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{
								!this.props.payment.response ?
								<div>
									{	
										this.props.payment.loading ? <Loading /> :
										this.props.payment.DropIn ?
										<div>
											<DropIn
												options={{ authorization: this.props.payment.clientToken}}
												onInstance={this.handleInstance}/>
												{
													this.props.payment.instance ?
													<div className="text-center">
													<button className="btn btn-primary" onClick={this.buy.bind(this)}>Pay Now</button>
													</div>
													: <Loading />
												}
										</div>
										:
										<div>
											<div className="row subscribe-modal-detail">
												<div className="subscribe-modal-head">						   
													<img src="/imgs/home/article-dashboard.png" alt="img" className="img-circle" />
													<h4>{this.props.session.userdetails.fullname}</h4>
													<p>Phone: {this.props.session.mobile}</p>
													<p>Email: {this.props.session.email}</p>
												</div>
												<div className="subscribe-modal-body">
												<div className="col-sm-6">
													<h4>Subscription Plan Details:</h4>
													<p>Subscription{': '}
														{this.props.payment.plan === 1 && 'Monthly Subscription'}
														{this.props.payment.plan === 2 && 'Quarterly Subscription'}
														{this.props.payment.plan === 3 && 'Yearly Subscription'}
													</p>
													<p>Start Date: {moment().format('YYYY-MM-DD')}</p>
													<p>End Date: 
														{this.props.payment.plan === 1 && moment(new Date()).add(30, 'days').format('YYYY-MM-DD')}
														{this.props.payment.plan === 2 && moment(new Date()).add(90, 'days').format('YYYY-MM-DD')}
														{this.props.payment.plan === 3 && moment(new Date()).add(365, 'days').format('YYYY-MM-DD')}
													</p>
												</div>
												<div className="col-sm-6 text-right">
													<h2>
														<span>{this.props.session.currency}</span>
														{this.props.payment.plan === 1 && plan.monthly_amount}
														{this.props.payment.plan === 2 && plan.quaterly_amount}
														{this.props.payment.plan === 3 && plan.yearly_amount}
													</h2>
												</div>
												</div>
												<div className="col-sm-12">
													<div
														className="subscribe-modal-foot text-center">
														<button
															className="btn btn-primary"
															onClick={this.handleMakePayment}>
															Confirm & Pay Now
														</button>
													</div>
												</div>
											</div>
										</div>
									}
								</div>
								:
								<div>
									{
										this.props.payment.response.status ? 
										<div className="text-center">
											<div className='alert alert-success'>
												<strong>Congrats!</strong> Your subscription has been renewed and please enjoy stressfree & happy practice with wikicare.
											</div>
											<a
												href='/login'
												className="btn btn-primary">
												Go To Profile
											</a>
										</div>
										:
										<div className="text-center">
											<div
												className='alert alert-danger '>
												Payment has been failed, please retry and Buy subscription.
											</div>
											<button
												className="btn btn-primary"
												onClick={::this.closePaymentModal}>
												Try Again
											</button>
										</div>
									}
								</div>
							}
						</Modal.Body>
					</Modal>
				}
			</div>
		);
	}

	renderAllPlan(__) {
		return (
			<div className='row'>
				{
					this.props.items.doctor &&
					<div className='col-sm-12 col-md-4'>
						<div className="subscription-box">
							<div className="price-tab-title">{this.props.items.doctor.title}</div>
							<div className="price-tab-boxes">
								<div className="price-tabing">
									<div className="tab-content">
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.doctorPlanType === 1 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor.monthly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.doctorPlanType === 2 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor.quaterly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.doctorPlanType === 3 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor.yearly_amount}</h2>
										</div>
									</div>
									<ul className="nav nav-tabs" role="tablist">
										<li
											role="presentation"
											className={this.state.doctorPlanType === 1 ? 'active':''}>
											<a 
												href="#monthly"
												data-type={1}
												onClick={this.handleDoctorTab}>
												Monthly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.doctorPlanType === 2 ? 'active':''}>
											<a
												href="#quarterly"
												data-type={2}
												onClick={this.handleDoctorTab}>
												Quarterly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.doctorPlanType === 3 ? 'active':''}>
											<a
												href="#yearly"
												data-type={3}
												onClick={this.handleDoctorTab}>
												Yearly
											</a>
										</li>
									</ul>

									<div className="price-tab-detial">
										<h3>First {this.props.items.trial.features} Days trial period will be free for every user.</h3>
										<h4>Features</h4>
										<div dangerouslySetInnerHTML={{__html: this.props.items.doctor.features}} />
										<div className="text-center price-btn">
											<Link to="/login?tab=signup" className="btn">Signup Now</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				}

				{
					this.props.items.hospital &&
					<div className='col-sm-12 col-md-4'>
						<div className="subscription-box">
							<div className="price-tab-title">{this.props.items.hospital.title}</div>
							<div className="price-tab-boxes">
								<div className="price-tabing">
									<div className="tab-content">
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.hospitalPlanType === 1 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.hospital.monthly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.hospitalPlanType === 2 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.hospital.quaterly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.hospitalPlanType === 3 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.hospital.yearly_amount}</h2>
										</div>
									</div>
									<ul className="nav nav-tabs" role="tablist">
										<li
											role="presentation"
											className={this.state.hospitalPlanType === 1 ? 'active':''}>
											<a 
												href="#monthly"
												data-type={1}
												onClick={this.handleHospitalTab}>
												Monthly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.hospitalPlanType === 2 ? 'active':''}>
											<a
												href="#quarterly"
												data-type={2}
												onClick={this.handleHospitalTab}>
												Quarterly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.hospitalPlanType === 3 ? 'active':''}>
											<a
												href="#yearly"
												data-type={3}
												onClick={this.handleHospitalTab}>
												Yearly
											</a>
										</li>
									</ul>

									<div className="price-tab-detial">
										<h3>First {this.props.items.trial.features} Days trial period will be free for every user.</h3>
										<h4>Features</h4>
										<div dangerouslySetInnerHTML={{__html: this.props.items.hospital.features}} />
										<div className="text-center price-btn">
											<Link to="/login?tab=signup" className="btn">Signup Now</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				}

				{
					this.props.items.doctor_clinic_both &&
					<div className='col-sm-12 col-md-4'>
						<div className="subscription-box">
							<div className="price-tab-title">{this.props.items.doctor_clinic_both.title}</div>
							<div className="price-tab-boxes">
								<div className="price-tabing">
									<div className="tab-content">
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.bothPlanType === 1 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor_clinic_both.monthly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.bothPlanType === 2 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor_clinic_both.quaterly_amount}</h2>
										</div>
										<div
											role="tabpanel"
											className={'tab-pane'+(this.state.bothPlanType === 3 ? ' active':'')}>
											<h2><span>$</span>{this.props.items.doctor_clinic_both.yearly_amount}</h2>
										</div>
									</div>
									<ul className="nav nav-tabs" role="tablist">
										<li
											role="presentation"
											className={this.state.bothPlanType === 1 ? 'active':''}>
											<a 
												href="#monthly"
												data-type={1}
												onClick={this.handleBothTab}>
												Monthly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.bothPlanType === 2 ? 'active':''}>
											<a
												href="#quarterly"
												data-type={2}
												onClick={this.handleBothTab}>
												Quarterly
											</a>
										</li>
										<li
											role="presentation"
											className={this.state.bothPlanType === 3 ? 'active':''}>
											<a
												href="#yearly"
												data-type={3}
												onClick={this.handleBothTab}>
												Yearly
											</a>
										</li>
									</ul>

									<div className="price-tab-detial">
										<h3>First {this.props.items.trial.features} Days trial period will be free for every user.</h3>
										<h4>Features</h4>
										<div dangerouslySetInnerHTML={{__html: this.props.items.doctor_clinic_both.features}} />
										<div className="text-center price-btn">
											<Link to="/login?tab=signup" className="btn">Signup Now</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}

	renderPlan(plan) {
		return (
			plan.id ?
			<div className='row'>
				<div className='col-sm-12 col-md-4'>
					<div className="subscription-box">
						<div className="price-tab-title">Monthly</div>
						<div className="price-tab-boxes">
							<div className="price-tabing">
								<div className="tab-content">
									<h2><span>$</span>{plan.monthly_amount}</h2>
								</div>

								<div className="price-tab-detial">
									<h4>Features</h4>
									<div dangerouslySetInnerHTML={{__html: plan.features}} />
									<div className="text-center price-btn">
										<a
											href="#"
											className="btn"
											data-plan={1}
											onClick={this.handleBuyNow}>
											Buy Now
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='col-sm-12 col-md-4'>
					<div className="subscription-box">
						<div className="price-tab-title">Quarterly</div>
						<div className="price-tab-boxes">
							<div className="price-tabing">
								<div className="tab-content">
									<h2><span>$</span>{plan.quaterly_amount}</h2>
								</div>

								<div className="price-tab-detial">
									<h4>Features</h4>
									<div dangerouslySetInnerHTML={{__html: plan.features}} />
									<div className="text-center price-btn">
										<a
											href="#"
											className="btn"
											data-plan={2}
											onClick={this.handleBuyNow}>
											Buy Now
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='col-sm-12 col-md-4'>
					<div className="subscription-box">
						<div className="price-tab-title">Yearly</div>
						<div className="price-tab-boxes">
							<div className="price-tabing">
								<div className="tab-content">
									<h2><span>$</span>{plan.yearly_amount}</h2>
								</div>

								<div className="price-tab-detial">
									<h4>Features</h4>
									<div dangerouslySetInnerHTML={{__html: plan.features}} />
									<div className="text-center price-btn">
										<a
											href="#"
											className="btn"
											data-plan={3}
											onClick={this.handleBuyNow}>
											Buy Now
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			:
			<div className='well'>No Plans</div>
		);
	}
}

