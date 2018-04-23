import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";
import actions from '../redux/actions';

const viewName = 'frontarticle';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class FrontArticle extends React.Component {

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
								<h3>{__('WRITE. TEACH. HEAL.')}</h3>
								<p>{__('Wikicare Health Articles is a medium for doctors and health specialists to inculcate helpful health tips and guidance to millions of patients around the world. Knowledge is the first step towards healing!')}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="create-wiki-profile article-three-boxes">
					<div className="container">
						<div className="row">										
							<div className="col-sm-12">
								<h2>{__('How Wikicare Health Articles can help you?')}</h2>
							</div>	
							<div className="col-sm-4">
								<img src="/imgs/home/article-icon1.png" />
								<h4>{__('Share your professional wisdom')}</h4>
								<p>
									{__('Being an expert in your field, you have an opportunity to impart your knowledge to millions of people around the globe.')}
								</p>
							</div>
							<div className="col-sm-4">	
								<img src="/imgs/home/article-icon2.png" />
								<h4>{__('Motivate Individuals')}</h4>
								<p>
									{__('The content you publish on Wikicare will motivate individuals to make informed decisions that promote a long and healthy lifestyle.')}
								</p>
							</div>
							<div className="col-sm-4">
								<img src="/imgs/home/article-icon3.png" />
								<h4>{__('Teach and Involve')}</h4>
								<p>
									{__('This is an exclusive opportunity for you to teach your patients and involve a larger audience.')}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="article-three-boxes we-understand-sec">
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<h2>
									{__('We understand how busy you are,')}
									<br/>
									{__('so we’ve simplified the article writing process.')}
								</h2>
							</div>	
							<div className="col-sm-6">
								<div className="article-dash-thumb">
								  <img src="/imgs/home/article-dashboard.png" alt="img" />
								</div>
							</div>
							<div className="col-sm-6">	
								<div className="wikicare-app-detail">	
									<p>{__('We feature:')}</p>
									<ul className="wilikare-arrow-bullet">
									 	<li>{__('An instinctive article editor')}</li>
										<li>{__('Quick upload of videos and images related to your articles')}</li>
										<li>{__('Access to many free, high quality stock images')}</li>
										<li>{__('Feedback from the editorial team')}</li>
										<li>{__('Analysis of your article’s performance')}</li>
									</ul>
								</div>
							</div>
						
							<div className="col-sm-12">
								<Link to="" className="btn btn-primary">
									{__('Join your colleagues and health professionals today!')}
								</Link>
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
