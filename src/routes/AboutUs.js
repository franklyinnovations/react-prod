import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import actions from '../redux/actions';
import makeTranslater from "../translate";

const viewName = 'aboutus';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class AboutUs extends React.Component {

	render() {
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id="front2">
				<Header />				
				<div className="page-title-detail-sec">
					<div className="container">
						<div className="row">						
							<div className="col-md-12">
								<h3>{__('Healing humanity')},<br/>{__('One patient at a time!')}
								</h3>
							</div>
						</div>
					</div>
				</div>

				<div className="promote-sec your-home-for-health-sec">
					<div className="container">
						<div className="row">
							<div className="col-sm-12">
								<div className="your-home-for-health">
									<h2>{__('Your partner in personalized healthcare at your fingertips.')}</h2>
									<p>{__('When it comes to accessing comprehensive healthcare, WikiCare is the trusted specialist many people turn towards to commence healing. It is a one-stop platform that connects patients with everything they need to start feeling better and take good care of their loved ones. From diagnosing health concerns, to finding a suitable doctor, to booking appointments for diagnostic tests, obtaining prescription medications, to maintaining health records and even guidance on how to live healthier.')}</p>
									<p>{__('Our team is committed to improving the quality, experience and accessibility of healthcare services. We firmly believe that a healthy individual has a significant impact, both in his/her personal circle and society. Wikicare is your partner in personalized healthcare at your fingertips!')}</p>
									<p>{__('Healthcare professionals may also channel the potential of Wikicare. It is the ultimate stage to build your medical practice, form invaluable associations with other medical professionals and engage intensely with patients.')}  </p>
								</div>
							</div>
						</div>	
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

				<div className="healthcare-technology">
					<div className="container">
						<div className="row">						
							<div className="col-md-12">
								<h3>{__('Making Healthcare Accessible With Technology')}</h3>
							</div>
						</div>
					</div>
				</div>

				<div className="main-content-sec aboutus-two-box">
					<div className="container">
						<div className="row">
							<div className="col-md-6">								
									<h4>{__('Wikicare for Everyone')}</h4>
									<h2>{__('Enhancing Healthcare Access through Technology')}</h2>
									<p>{__('Wikicare’s virtual delivery of online medical care is the first step in helping patients feel better. Through our state-of-the-art platform, you may ask questions for free, seek one-on-one interaction with your doctor, pay fees online and even access our blog for healthy living tips. Through this special virtual platform, patients are put in charge of their medical care.')} </p>								
							</div>
							<div className="col-md-6">								
									<h4>{__('Wikicare for Doctors')}</h4>
									<h2>{__('Helping Doctors practice medicine effectively and effortlessly!')}</h2>
									<p>{__('Our unique platform enables doctors to develop and deliver their medical expertise to patients all over the country. This helps them get ranked by patients they’ve helped and also get recommendations from peers; thereby increasing their popularity and credibility amongst the medical and online community. In addition, Wikicare’s easy-to-use management software enables doctors to manage patient information from multiple clinics. Our Wikicare app helps doctors stay in touch with patients and handle their practice on-the-go!')} </p>								
							</div>
						</div>					
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
