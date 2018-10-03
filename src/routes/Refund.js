import React from 'react';
import { connect } from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';

import makeTranslater from "../translate";

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class Refund extends React.Component {
	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front' className='home-pg'>
				<Header/>
				<Banner inner>
					<h1>{_('Refund & Cancellation Policy')}</h1>
				</Banner>
				<section className="faq-section cloudy-bg">
					<div className="faq-container">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<h3>{_('Refund & Cancellation Policy')}</h3>
									<p>{_('We believe in satisfying and delighting our customers. Our refund & cancellation policy is made keeping our valuable customers in mind and hence we have easy transparent procedure for it. However, we   wish that you do not need to use the policy as far as possible but we do understand that under unforeseen conditions it is necessary to cancel and refund.')}</p>
									<h3>{_('Transaction Failed')}</h3>
									<p>{_('If amount getting debited from the customer account and Transaction Failed, Payment Processor will refund the entire Fee electronically (as a credit to the relevant credit /debit card /account used for the   transaction), but the bank/card transaction charges are likely to be forfeited.')}</p>
									<h3>{_('Refund on cancellation:')}</h3>
									<ul>
										<li><p>{_('No refund shall be granted on Yearly Membership fee.')}</p></li>
										<li><p>{_('No refund shall be granted on Registration Fee.')}</p></li>
									</ul>
									<p><strong>{_('Note:')}</strong>{_('Pateast offers no guarantees whatsoever for the accuracy or timeliness of the refunds reaching the Customers card/bank accounts. This is on account of the multiplicity of organizations involved in the processing of online transactions, the problems with Internet infrastructure currently available and working days/holidays of financial institutions.')}</p>
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
