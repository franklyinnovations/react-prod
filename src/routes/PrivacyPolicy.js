import React from 'react';
import { connect } from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';

import makeTranslater from "../translate";

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class PrivacyPolicy extends React.Component {
	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front' className='home-pg'>
				<Header/>
				<Banner inner>
					<h1>{_('Privacy Policy')}</h1>
				</Banner>
				<section className="faq-section cloudy-bg">
					<div className="faq-container">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<p dangerouslySetInnerHTML={{__html: _('This Privacy Policy governs the manner in which {{link}} collects, uses, maintains and discloses information collected from users (each, a "User") of the {{link}} website ("Site") and Pateast mobile apps Android and IOS. This privacy policy applies to the Site and all products and services offered by Pateast under Planet Web Solution.', {
										link: '<a href="https://www.pateast.co/">Pateast.co </a>'
									})}}/>
									<h3>{_("Personal identification information")}</h3>
									<p>{_("We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, phone number. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.")}
									</p>
									<h3>{_("Non-personal identification information")}</h3>
									<p>{_("We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.")}</p>
									<h3>{_("Web browser cookies")}</h3>
									<p>{_("Our Site may use 'cookies' to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.")}</p>
									<h4>{_("How we use collected information")}</h4>
									<h5>{_("Pateast may collect and use Users personal information for the following purposes:")}</h5>
									<h6>{_("To improve customer service")}</h6>
									<p>{_("Information you provide helps us respond to your customer service requests and support needs more efficiently.")}</p>
									<h6>{_("To personalize user experience")}</h6>
									<p>{_("We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.")}</p>
									<h6>{_("To improve our Site")}</h6>
									<p>{_("We may use feedback you provide to improve our products and services.")}</p>
									<h6>{_("To process payments")}</h6>
									<p>{_("We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.")}</p>
									<h6>{_("To send periodic emails")}</h6>
									<p>{_("We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email or User may contact us via our Site.")}</p>
									<h6>{_("How we protect your information")}</h6>
									<p>{_("We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.")}</p>
									<h6>{_("Sharing your personal information")}</h6>
									<p>{_("We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.We may use third party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.")}</p>
									<h6>{_("Third party websites")}</h6>
									<p>{_("Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.")}</p>
									<h6>{_("Changes to this privacy policy")}</h6>
									<p>{_("Planet Web Solution has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.")}</p>
									<h6>{_("Your acceptance of these terms")}</h6>
									<p>{_("By using this Site, you signify your acceptance of this policy and terms of service. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.")}</p>
									<h6>{_("Contacting us")}</h6>
									<p dangerouslySetInnerHTML={{__html: _('If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:{{link}}', {
										link: '<a href="mailto:support@pateast.co"> support@pateast.co</a>'
									})}}/>
									<p>{_("This document was last updated on September 12th 2017.")}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="happy-kids-inner">
						<img src="/imgs/front/happy-kids.png"/>
					</div>
				</section>
				<Footer/>
			</div>
		);
	}
}
