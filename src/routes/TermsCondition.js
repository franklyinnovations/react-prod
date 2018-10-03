import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';

import makeTranslater from "../translate";

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))

export default class TermsCondition extends React.Component {
	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front' className='home-pg'>
				<Header/>
				<Banner inner>
					<h1>{_('TERMS & CONDITION')}</h1>
				</Banner>
				<section className="faq-section cloudy-bg">
					<div className="faq-container">
						<div className="container">
							<p dangerouslySetInnerHTML={{__html: _('By using the {{link}} Website or Pateast Mobile Application. ("Service") you are agreeing to be bound by the following terms and conditions ("Terms of Service"). "The Service provider" is Planet Web Solution, a private limited company established under Companies act of 1956 India, location G-267, EPIP, Sitapura Industrial Area, Jaipur, Rajasthan, India.', {
								link: '<a href="https://www.pateast.co/">Pateast.co</a>'
							})}}/>
							<p dangerouslySetInnerHTML={{__html:_('The Service provider reserves the right to update and change the Terms of Service from time to time without notice. Any new features that augment or enhance the current Service, including the release of new Updates, tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to such changes. You can review the most current version of the Terms of Service at any time at: {{link}}',{
								link: '<a href="https://www.pateast.co/terms-condition">terms-of-service.</a>'
							})}}/>
							<p>{_('Violation of any of the terms below will result in the termination of your Account. While service provider prohibits such conduct and Content on the Service, you understand and agree that the service provider cannot be responsible for the Content posted on the Service and you nonetheless may be exposed to such materials. You agree to use the Service at your own risk.')}</p>
							<h3>{_('Basic Terms')}</h3>
							<p>{_('If you do not agree, you should decline this Agreement and immediately stop using the Service. Access to the Service is permitted only to those that fully agree with the terms and conditions of this Terms of Service agreement.')}</p>
							<p>{_('You agree that this Terms of Service Agreement and the relationship between the parties shall be exclusively governed by the laws of Republic of India without regard to conflict of law principles, or international conventions. The exclusive jurisdiction for any dispute resolution is the Jaipur Jurisdiction, which is in state of Rajasthan, India.')}</p>
							<p>{_('You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.')}</p>
							<p>{_('Your login may only be used by one person - a single login shared by multiple people is not permitted. You may create separate logins for as many people as your plan allows.')}</p>
							<p>{_('You are responsible for maintaining the security of your account and password. The service provider cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.')}</p>
							<p dangerouslySetInnerHTML={{__html: _("The Client undertakes to maintain full confidentiality over the Client's passwords related to the Service and the Client's Account. If the Client becomes aware of any unauthorized use of its password or of the Client's Account, the Client must notify the Service Provider immediately at {{link}}",{
								link: '<a href="mailto:support@pateast.co">support@pateast.co</a>'
							})}}/>
							<p>{_('You are responsible for all Content posted and activity that occurs under your account (even when Content is posted by others who have accounts under your account).')}</p>
							<p>{_('You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).')}</p>
							<p>{_('The Client undertakes not to harass, threaten, abuse or harm the Service Provider or other users of the Service in any way.')}</p>
							<h3>{_('Refunds, Upgrading and Downgrading Terms')}</h3>
							<p>{_('The Service is billed in advance on a yearly basis and is non-refundable. There will be no refunds or credits for partial months of service, upgrade/downgrade refunds, or refunds for months unused with an open account.')}</p>
							<p>{_('All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities if not stated otherwise. The Client will be responsible for payment of all such taxes, levies, or duties.')}</p>
							<p>{_('For any upgrade or downgrade in plan level, your credit card that you provided will automatically be charged the new rate on your next billing cycle.')}</p>
							<p>{_('Downgrading your Service may cause the loss of Content, features, or capacity of your Account. The service provider does not accept any liability for such loss.')}</p>
							<h3>{_('Cancellation and Termination')}</h3>
							<p>{_('You are solely responsible for properly cancelling your account. You can contact support@pateast.co to know the cancellation procedure.')}</p>
							<p>{_('All of your Content will be immediately deleted from the Service upon cancellation. This information can not be recovered once your account is cancelled.')}</p>
							<p>{_('If you cancel the Service before the end of your current paid up year, your cancellation will take effect immediately and you will not be charged again.')}</p>
							<p>{_('The service provider, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service for any reason at any time. Such termination of the Service will result in the deactivation or deletion of your Account or your access to your Account, and the forfeiture and relinquishment of all content in your Account. The service provider reserves the right to refuse service to anyone for any reason at any time.')}</p>
							<h3>{_('Modifications terms')}</h3>
							<p>{_('The service provider reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.')}</p>
							<p>{_('Prices of all Services, including but not limited to annual subscription plan fees to the Service, are subject to change upon 30 days notice from us. Such notice may be provided at any time by posting the changes to the Pateast Site (www.pateast.co) or the Service itself.')}</p>
							<p>{_('The service provider shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.')}</p>
							<p>{_("The Client acknowledges and agrees that the form and nature of the Service may change from time to time without prior notice to the Client due to the fact that the Service Provider is constantly innovating and improving the Service. Also, the Client acknowledges and agrees that the Service Provider may stop (permanently or temporarily) providing the Service (or any features within the Service) to the Client at the Service Provider's sole discretion, without prior notice to the Client.")}</p>
							<h3>{_('Content terms')}</h3>
							<p>{_("Service Provider's Content is protected by copyright. The Client many not copy, distribute, modify, rent, lease, loan, sell distribute, create derivative works, reverse engineer, decompile or otherwise attempt to extract the source code of the Service or any part thereof without the copyright owner's respective license.")}</p>
							<p>{_('The Service Provider claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours. However, by setting your pages to be shared publicly, you agree to allow others to view and share your Content.')}</p>
							<p>{_('The Service provider does not pre-screen Content, but service provider and its designee have the right (but not the obligation) in their sole discretion to refuse or remove any Content that is available via the Service.')}</p>
							<p>{_("The Client undertakes not to create, transmit, display or make otherwise available any Content that is unlawful, harmful, threatening, abusive, harassing, tortuous, defamatory, vulgar, obscene, based on race, religion, sexual orientation or health, invasive of another's privacy, or hateful (incl. viruses, worms and any other destructive codes).")}</p>
							<h3>{_('General Conditions')}</h3>
							<p>{_('Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.')}</p>
							<p>{_('Among other things the Service Provider does not represent and warrant to the Client that:')}</p>
							<p>{_("The Client's use of the Service will meet the Client's requirements;")}</p>
							<p>{_("Any information obtained by the Client as a result of the Client's use of the Service will be accurate, correct, reliable and up to date;")}</p>
							<p>{_('Defects in the operation or functionality of the Service will be corrected.')}</p>
							<p>{_('Technical support is available via email.')}</p>
							<p>{_('No warranties (incl. for satisfactory quality, fitness for purpose or conformance with description) apply to the Service except to the extent expressly stipulated in the Agreement.')}</p>
							<p>{_('The Service Provider is not liable for any direct, indirect or consequential damage (incl. loss of profit, loss of data, loss of goodwill or business reputation) of the Client which may be incurred to the Client in relation with the Service, including:')}</p>
							<ul>
								<li>{_('Damage resulting from any changes which the Service Provider may make to the Service.')}</li>
								<li>{_('Damage resulting from any permanent or temporary interruption in the provision of the Service.')}</li>
								<li>{_("Damage resulting from deletion of, corruption of, or failure to store, any Client's Content.")}</li>
								<li>{_("Damage resulting from the Client's failure to provide the Service Provider with accurate account information.")}</li>
								<li>{_("Damage resulting from the Client's failure to keep the Client's password or the details of the Client's Account secure and confidential.")}</li>
							</ul>
							<p>{_("You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service.")}</p>
							<p>{_("You understand that service provider uses third party vendors(SMS, Push Notifications, Email) and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.")}</p>
							<p>{_("You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by Service Provider.")}</p>
							<p>{_("The Client must indemnify the Service Provider, its officers, directors, employees, agents, licensors, suppliers, etc. for any and all claims, liabilities, losses, expenses, damage and costs, including attorney's fees, resulting from the breach of the Agreement, and from the activities on the Client Account.")}</p>
							<p>{_("We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.")}</p>
							<p>{_("The Client agrees that the Service Provider may provide the Client with notices, including those regarding changes to the Agreement, by email, regular mail, or postings on the Service.")}</p>
							<p>{_("You understand that the technical processing and transmission of the Service, including your Content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.")}</p>
							<p>{_('You must not upload, post, host, or transmit unsolicited email, SMSs, Push Notification or "spam" messages.')}</p>
							<p>{_("You must not transmit any worms or viruses or any code of a destructive nature.")}</p>
							<p>{_("Nothing in the Agreement shall exclude or limit the Service Provider's liability for damage which may not be lawfully excluded or limited by the laws of Republic of India.")}</p>
							<p>{_("The failure of service provider to exercise or enforce any right or provision of the Terms of Service shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between you and service provider and govern your use of the Service, superceding any prior agreements between you and service provider (including, but not limited to, any prior versions of the Terms of Service).")}</p>
							<p>{_("The Agreement is governed by the laws of Republic of India.")}</p>
							<p>{_("In case the Agreement has been translated into some other language than English and there are contradictions between the English version and the translation, then the English version shall prevail over the translation.")}</p>
							<p>{_("Any disputes related to the Agreement are to be solved by means of negotiations. If the dispute cannot be solved by means of negotiations, the dispute shall be solved thru Courts in Jaipur Jurisdiction which is in State of Rajasthan, India")}</p>
							<p dangerouslySetInnerHTML={{__html: _('Questions about the Terms of Service should be sent to {{link}}', {
								link: '<a href="mailto:support@pateast.co">support@pateast.co.'
							})}}/>
							<p>{_("This document was last updated on September 12th 2017.")}</p>
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
