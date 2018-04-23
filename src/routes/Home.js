import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";
import actions from '../redux/actions';

const viewName = 'home';
@connect(state => ({
	session: state.session,
	location: state.location,
	translations: state.translations,
	lang: state.lang
}))
export default class Home extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name:'',
			mobile: ''
		}
	}

	// static fetchData(store) {
	// 	return store.dispatch(
	// 		actions.home.init(store.getState())
	// 	);
	// }
	
	handleDataUpdate = event => {
		let name = event.target.name,
			value = event.target.value;

		this.setState({
			[name]:value
		});
	};

	redirectSignup = event => {
		if(this.state.mobile && /\s*\d{6,16}\s*/.test(this.state.mobile)){
			this.props.router.push('/login?tab=signup&name='+this.state.name+'&mobile='+this.state.mobile)
		} else {
			vex.dialog.alert('Invalid mobile number.');
		}
	};

	render() {
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id="front2">
				<Header />
				<div className="patient-search-sec">		 
				</div>
				<div className="patient-search-detail-sec">
					<div className="container">
						<div className="row">
							<div className="col-md-6">
								<div className="doctor-banner-detail">
									<h1>{__('Patients are looking for healers like you!')}</h1>
									<p>{__('Millions of patients can benefit from your medical care and expertise. Start your digital practice with a Wikicare Profile.')}
									</p>
									<Link to="/login?tab=signup" className="white-btn">
										{__('Get Started')}
									</Link>
								</div>
							</div>
							<div className="col-md-6">
								<div className="doctor-banner-forms">
									<h2>{__('Let’s take the first step and create your account')}</h2>
									<ul>
										<li>
											<input
												type="text"
												name='name'
												placeholder="Name"
												value={this.state.name}
												onChange={this.handleDataUpdate}/>
										</li>
										<li>
											<input
												type="text"
												name='mobile'
												placeholder="Phone"
												value={this.state.mobile}
												onChange={this.handleDataUpdate}/>
										</li>
										<li>
											<input
												type="submit"
												onClick={this.redirectSignup}
												className="submit"
												value="Submit"/>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="promote-sec">
					<div className="container">
						<div className="row">
							<div className="col-sm-6 col-md-3 promote-box">
								<strong>2558</strong>
								<span>{__('Appointments Booked')}</span>
							</div>
							<div className="col-sm-6 col-md-3 promote-box">
								<strong>780</strong>
								<span>{__('Doctors Signing Up')}</span>
							</div>
							<div className="col-sm-6 col-md-3 promote-box">
								<strong>646</strong>
								<span>{__('Reviews by Patient')}</span>
							</div>
							<div className="col-sm-6 col-md-3 promote-box">
								<strong>3758</strong>
								<span>{__('Total Visit')}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="create-wiki-profile">
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<div className="row">
									<div id="create-profile-ad">
										<div className="col-sm-12">
											<h3>{__('Build your Wikicare profile in 3 quick steps.')}</h3>
										</div>	
										<div className="col-sm-4">
											<img src="/imgs/home/register-icon.png" />
											<h4>{__('Search for your name or register yourself on Wikicare.com.')}</h4>
											<p>
												{__('Enter your personal details such as name, mobile number, clinic/establishment name and email id.')}
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/profile-info-icon.png" />
											<h4>{__('Add Profile Information')}</h4>
											<p>
												{__('Complete your Wikicare profile sections such as ‘About You’, ‘Medical Registration’, ‘Fees’, ‘Timings’, etc.')}
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/help-icon.png" />
											<h4>{__('Help Us Validate your Credentials')}</h4>
											<p>
												{__('Complete our easy online authentication process, join your colleagues online and start practicing virtual medicine!')}
											</p>
										</div>
										<div className="col-sm-12">
											<Link to="/login?tab=signup" className="btn btn-primary">
												{__('CREATE YOUR PROFILE')}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="graphices-sec">
					<div className="container">
						<div className="row">
							<div className="col-md-5">
								<img src="/imgs/home/edit-profile.png" alt="img" />
							</div>
							<div className="col-md-7">
								<div className="graphices-details">  

									<h4>{__('Edit your Wikicare profile-')} </h4>
									<h2>{__('Anywhere & Anytime!')}</h2>
									<ul className="wilikare-list-bullet">
									<li>{__('Quickly modify your professional details')}</li>
									<li>
										{__('Add or update information relevant to patient care such as new services, fees, timings, new location, etc.')}.
									</li>
									<li>{__('Easy accessibility on your mobile phone/device')}</li>
									</ul>
									<a href="#" className="btn btn-primary">
									{__('Learn More')} <i className="fas fa-arrow-right" />
									</a>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="shape-outer">
									<div className="shape-outer">
										<div className="shape-one" />
										<div className="shape-two" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="graphices-sec">
					<div className="container">
						<div className="row">
							<div className="col-md-5 pull-right">
								<img src="/imgs/home/patient.png" />
							</div>
							<div className="col-md-7">
								<div className="graphices-details">
									<h4>{__('Keep Track')}</h4>
									<h2>{__('Patients Feedback')}</h2>
									<ul className="wilikare-list-bullet">
										<li>{__('Learn what patients are saying about your care and expertise')}</li>
										<li>{__('Interact with patients via your Wikicare profile')}</li>
										<li>{__('Let other patients read the stellar feedback left for you')}</li>
										<li>{__('Use comments/suggestions to improve patient care')}{' '}</li>
									</ul>
									<a href="#" className="btn btn-primary">
										{__('Learn More')} <i className="fas fa-arrow-right" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="services-gray-sec articles-section">
					<div className="container">
						<div className="row">
							<div className="col-sm-12 col-md-8 articles-section-top">
								<h2>{__('Wikicare Health Guide')}</h2>
								<h4>{__('Publish lifestyle tips and health advice to inspire and lead millions of people towards complete health recovery.')}</h4>
								<p>
									{__('Wikicare’s stress-free article editor, provides consistent feedback from the editorial team including a detailed breakdown of your articles’ performance. Plus, it’s free!')}
								</p>
								{
									(
										this.props.session.id && 
										(this.props.session.user_type === 'doctor' || this.props.session.user_type === 'doctor_clinic_both')
									) ? 
									<Link to={'/login'} className="btn btn-four">
										{__('Write Articles')} <i className="fas fa-arrow-right" />
									</Link>
									:
									<Link to='#' className="btn btn-four">
										{__('More Articles')} <i className="fas fa-arrow-right" />
									</Link>
								}
							</div>
							<div className="col-sm-12 col-md-4">
								<img
									src="/imgs/home/iphone-x1.png"
									className="pull-right"
									alt="img"/>
							</div>												
						</div>
					</div>
				</div>

				<div className="wikicare-app-sec">
					<div className="container">
					<div className="row">
						<div className="col-md-5">
							<img
								src="/imgs/home/handy-mobile.png"
								className="img-responsive"
								alt="img"
							/>
						</div>
						<div className="col-md-7">
							<div className="wikicare-app-detail">
								<h3>{__('Download')}</h3>
								<h2>{__('Wikicare Doctor App')}<span /></h2>
								<p>
									{__('This powerful application enables you to grow and manage your healthcare practice.')}
								</p>
								<p>
									{__('Wikicare Doctor App enables you to:')}
								</p>
								<ul className="wilikare-arrow-bullet">
									<li>{__('Manage your professional profile using an advanced editor')}</li>
									<li>{__('Sharpen your online presence')}</li>
									<li>{__('Engage in online patient consultation')}</li>
									<li>{__('Facilitates online payments for virtual consultations')}</li>
									<li>{__('View patients records anywhere and anytime')}</li>
									<li>{__('Schedule and manage appointments')}</li>
									<li>{__('Manage patient feedback')}</li>									
								</ul>

								<ul className="wilikare-app-links">
									<li>
										<a href="#">
											<img
												src="/imgs/home/google-btn.png"
												className="img-responsive"
												alt="img"
											/>
										</a>
									</li>
									<li>
										<a href="#">
											<img
												src="/imgs/home/iphone-btn.png"
												className="img-responsive"
												alt="img"
											/>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
