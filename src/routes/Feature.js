import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";

const viewName = 'feature';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class Feature extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: 'doctors_features',
		}
	}

	handleTabs = event => {
		event.preventDefault();
		this.setState({
			activeTab: event.target.getAttribute('aria-controls')
		});
	};
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<div id="front2">
				<Header />				
				<div className="page-title-detail-sec featutes-banner-sec">
					<div className="container">
						<div className="row">						
							<div className="col-md-12">
								<h3>{__('Features')}</h3>
								<div className="features-tab-btns">
									 <ul className="nav nav-tabs" role="tablist">
									    <li role="presentation" className={this.state.activeTab==='doctors_features'? 'active':''}>
									    	<a
									    		href="#"
									    		aria-controls="doctors_features"
									    		role="tab"
									    		onClick={this.handleTabs}
									    		data-toggle="tab">
									    		{__('Doctors')}
									    	</a>
									    </li>
									    <li role="presentation" className={this.state.activeTab==='clinic_features'? 'active':''}>
									    	<a
									    		href="#"
									    		aria-controls="clinic_features"
									    		role="tab"
									    		onClick={this.handleTabs}
									    		data-toggle="tab">
									    		{__('Clinic/ Hospitals')}
									    	</a>
									    </li>  
									  </ul>
								</div>
							</div>
						</div>
					</div>
				</div>	
				<div className="tab-content">
						<div
							className={'tab-pane'+(this.state.activeTab==='doctors_features'? ' active':'')}
							role="tabpanel">
							<div className="graphices-sec fetured-list-sec">
								<div className="container">
									<div className="row">
										<div className="col-md-5">
											<img src="/imgs/home/fetured-thumb1.png" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details">
												<h2>{__('Wikicare')} <span>{__('Profile')}</span></h2>
												<p>{__('Your Wikicare profile enables patients to access specialized healthcare services. Use your profile to communicate vital information that matters to patients such as:')}</p>
												<ul className="wilikare-arrow-bullet">
											     	<li>{__('Your areas of expertise')}</li>
													<li>{__('Your qualifications and institution(s) of study')}</li>
													<li>{__('Services offered')}</li>
													<li>{__('Office hours and location')}</li>
													<li>{__('Fees and payment options')}</li>
													<li>{__('Other clinics and hospitals where you practice')}</li>
												</ul>

												<a href="#" className="btn btn-primary">
												{__('Learn More')} <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-5 pull-right">
											<img src="/imgs/home/fetured-thumb2.png" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details"> 
												<h2>{__('Online')} <span>{__('Consultation')}</span> <small>( {__('Free Question Answers, Chat Consult (Paid)')})</small></h2>
												<p>{__('Using our free Q&A feature, patients can seek general guidance for their existing health problems. Patients will be asked to explain their health concern in detail, i.e. duration, location, symptoms, etc.')} </p>
												<p>{__('For paid chat consultations, patients can speak to a doctor according to their convenience. After receiving the payment of consultation fees, patients can seek assistance with just about any health issue from controlling blood pressure, to losing or gaining weight and even managing diabetes.')} </p>
												<a href="#" className="btn btn-primary">
												Learn More <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-5">
											<img src="/imgs/home/fetured-thumb3.png" className="without-width" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details">
												<h2>{__('Schedule')} - <span>{__('Manage Appointments')}</span></h2>
												<p>{__('Using the Wikicare app, you can schedule and manage your appointments with ease. Now you can oversee multiple patient files, organize appointments according to your availability and reach out to patients as required. The Wikicare app also enables you to manage patient files from multiple clinic locations. With the app, doctors can access convenience, flexibility and organization, on the go!')} </p>
												<a href="#" className="btn btn-primary">
												{__('Learn More')} <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-5 pull-right">
											<img src="/imgs/home/fetured-thumb4.png" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details"> 
												<h2>{__('Wikicare')} <span>{__('Health Articles')}</span></h2>
												<p>{__('Wikicare Health Articles bring the latest information on improving and managing health. These are all written by doctors and medical professionals who are experts in their field and also registered with Wikicare. The Wikicare Health Articles cover a variety of topics ranging from making healthy lifestyle choices to managing serious health issues like diabetes and high blood pressure and the latest advancements in medical research.')} </p>
												<a href="#" className="btn btn-primary">
												{__('Learn More')} <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-5">
											<img src="/imgs/home/fetured-thumb5.png" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details">
												<h2>{__('Feedback')} - <span>{__('Manage Feedback from your patients')}</span></h2>
												<p>{__('Patient feedback is key to the growth of your virtual medical practice. It is evidence of your expertise and care. Not only will future patients use these comments to decide whether to contact you or not, but it also builds your credibility amongst the medical fraternity. Many doctors also view feedback as a chance of improving how they deliver patient care.')}</p>
												<a href="#" className="btn btn-primary">
												{__('Learn More')} <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>					
								</div>
							</div>
						</div>
						<div
							className={'tab-pane'+(this.state.activeTab==='clinic_features'? ' active':'')}
							role="tabpanel">
							<div className="graphices-sec fetured-list-sec">
								<div className="container">
									<div className="row">
										<div className="col-md-5">
											<img src="/imgs/home/fetured-thumb3.png" className="without-width" alt="img" />
										</div>
										<div className="col-md-7">
											<div className="graphices-details">
												<h2>{__('Schedule')} - <span>{__('Manage Appointments')}</span></h2>
												<p>{__('Using the Wikicare app, you can schedule and manage your appointments with ease. Now you can oversee multiple patient files, organize appointments according to your availability and reach out to patients as required. The Wikicare app also enables you to manage patient files from multiple clinic locations. With the app, doctors can access convenience, flexibility and organization, on the go!')}</p>
												<a href="#" className="btn btn-primary">
												{__('Learn More')} <i className="fas fa-arrow-right" />
												</a>
											</div>
										</div>
									</div>						
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
