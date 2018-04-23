import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";
import actions from '../redux/actions';

const viewName = 'onlineconsult';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class OnlineConsult extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name:'',
			mobile: ''
		}
	}
	
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
				<div className="page-title-detail-sec article-title-detail-sec">
					<div className="container">
						<div className="row">						
							<div className="col-md-12">
								<h3>Consult online and grow your practice</h3>
							    <p>Start your own virtual practice. Connect with more patients and maximise your earnings.</p>
							</div>
						</div>
					</div>
				</div>
				<div className="create-wiki-profile article-three-boxes">
					<div className="container">
						<div className="row">										
										<div className="col-sm-12">
											<h2>{__('Reach new patients and maximise your earnings')}</h2>
										</div>	
										<div className="col-sm-12 col-md-6 online-text">
											<img src="/imgs/home/article-icon1.png" />
											<p>
												{__('Millions of patients ask health queries on Wikicare. Get discovered by these patients by answering their questions within 24 hours.')}
											</p>
										</div>
										<div className="col-sm-12 col-md-6 online-text">	
											<img src="/imgs/home/article-icon2.png" />
											<p>
												{__('Sign up for paid consultations and chat with patients using the Wikicare app - share images and documents with them and upload prescriptions to solve their medical problem.')}
											</p>
										</div>	
										<div className="col-sm-12">
											<Link to="" className="btn btn-primary">
												{__('Download the Wikicare app to get started')}
											</Link>
										</div>																		
						
						</div>
					</div>
				</div>

				<div className="article-three-boxes we-understand-sec">
					<div className="container">
						<div className="row">										
										<div className="col-sm-12">
											<h2>
												{__('Keep your clinic’s patients engaged')}
												<br/>
												<span>Wow your patients by letting them follow-up with you online</span>
											</h2>
										</div>	
										<div className="col-sm-4">

											<img src="/imgs/home/online-icon3.png" />
											<h4>
												{__('Increase patient retention')}
											</h4>
											<p>
												{__('Engage with patients after their appointments.')}
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/online-icon4.png" />
											<h4>
												{__('Control follow-ups efficiently')}
											</h4>
											<p>
												{__('Chat with patients without sharing your personal number. Define your free follow-up duration and more.')}
											</p>
										</div>
										<div className="col-sm-4">
											<img src="/imgs/home/online-icon5.png" />
											<h4>
												{__('Monetise follow-ups')}
											</h4>
											<p>
												{__('Maximise earnings by monetising repeat follow-up interactions.')}
											</p>
										</div>			
						
						</div>
					</div>
				</div>

				<div className="wikicare-app-sec">
					<div className="container">
						<div className="row online-simple-steps">										
										<div className="col-sm-12">
											<h2>
												{__('Get started in 3 simple steps')}
											</h2>
										</div>	
										<div className="col-sm-4">
											<img src="/imgs/home/online-icon6.png" />
											<h4>
												{__('Download the app')}
											</h4>
											<p>
												{__('Download the Wikicare app and go to the consult section. ')}
											</p>
										</div>
										<div className="col-sm-4"> 
											<img src="/imgs/home/online-icon7.png" />
											<h4>
												{__('Complete verification process')}
											</h4>
											<p>
												{__(' Upload your registration and latest degree certificate, and a government-issued ID proof.')}
											</p>
										</div>	
										<div className="col-sm-4">
											<img src="/imgs/home/online-icon8.png" />
											<h4>
												{__('Enter your bank details')}
											</h4>
											<p>
												{__(' Add your bank details to receive payments from patients directly, for online consultations. ')}
											</p>
										</div>			
						
						</div>
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
