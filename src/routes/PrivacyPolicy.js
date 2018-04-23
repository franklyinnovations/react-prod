import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";
import actions from '../redux/actions';

const viewName = 'privacypolicy';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class PrivacyPolicy extends React.Component {

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
								<h3 className="no-margin">Privacy Policy</h3>							   
							</div>
						</div>
					</div>
				</div>
				<div className="privary-content">
					<div className="container">
						<div className="row">										
							<div className="col-sm-12">
								<p>Wikicare technologies private limited (“us”, “we”, or “Wikicare”, which also includes its affiliates) is the author and publisher of the internet resource www.Wikicare.com (“website”) on the world wide web as well as the software and applications provided by Wikicare, including but not limited to the mobile application ‘Wikicare’, and the software and applications of the brand names ‘Wikicare ray’, ‘Wikicare tab’, ‘Wikicare reach’, ‘hello’, and ‘health account’ (together with the website, referred to as the “services”). </p>
								<p>This privacy policy ("privacy policy") explains how we collect, use, share, disclose and protect personal information about the users of the services, including the practitioners (as defined in the terms of use, which may be accessed via the following weblink https://Wikicare.com/privacy (the “terms of use”)), the end-users (as defined in the terms of use), and the visitors of website (jointly and severally referred to as “you” or “users” in this privacy policy). We created this privacy policy to demonstrate our commitment to the protection of your privacy and your personal information. Your use of and access to the services is subject to this privacy policy and our terms of use. Any capitalized term used but not defined in this privacy policy shall have the meaning attributed to it in our terms of use. </p>
								<p>By using the services or by otherwise giving us your information, you will be deemed to have read, understood and agreed to the practices and policies outlined in this privacy policy and agree to be bound by the privacy policy. You hereby consent to our collection, use and sharing, disclosure of your information as described in this privacy policy. We reserve the right to change, modify, add or delete portions of the terms of this privacy policy, at our sole discretion, at any time. If you do not agree with this privacy policy at any time, do not use any of the services or give us any of your information. If you use the services on behalf of someone else (such as your child) or an entity (such as your employer), you represent that you are authorised by such individual or entity to (i) accept this privacy policy on such individual’s or entity’s behalf, and (ii) consent on behalf of such individual or entity to our collection, use and disclosure of such individual’s or entity’s information as described in this privacy policy. </p>

								<div className="price-tab-detial">
									<h3>1.WHY THIS PRIVACY POLICY?</h3>
									<h4>This Privacy Policy is published in compliance with, inter alia:</h4>
									<ul>
										<li>Section 43A of the Information Technology Act, 2000;</li>
										<li>Regulation 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011 (the “SPI Rules”);</li>
										<li>Regulation 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011.</li>
									</ul>
									<h4>This Privacy Policy is published in compliance with, inter alia:</h4>
									<ul>
										<li>Section 43A of the Information Technology Act, 2000;</li>
										<li>Regulation 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011 (the “SPI Rules”);</li>
										<li>Regulation 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011.</li>
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
