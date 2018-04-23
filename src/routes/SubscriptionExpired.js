import React from "react";
import {connect} from 'react-redux';
import { Link, IndexLink } from "react-router";
import Footer from "../front/Footer";
import Banner from "../front/Banner";
import Header from "../front/Header";
import makeTranslater from "../translate";

const viewName = 'subscriptionexpired';
@connect(state => ({
	translations: state.translations,
	lang: state.lang,
	session: state.session,
}))
export default class SubscriptionExpired extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		if(!this.props.session.id){
			//this.props.router.push('/login');
		}
	}

	render() {
		return (
			<div id="front2">
				<Header />				
				<div className='career-content-sec'>
					<div className='container'>				
			           <div className='row'>						    
				           <div className='col-sm-6 col-sm-offset-3'>
						      <div className='sub-expire-box'>
						      	<h2>YOUR WIKICARE TRIAL SUBSCRIPTION HAS EXPIRED</h2>
						      	<p>As your subscription is expired your profile will not be searchable for patients on wikicare. </p>
						      	<p>In order to continue using WIKICARE Profile, you need to purchase a subscription.To Buy One now, please click on <span>Buy Subscription</span> or contact at info@wikicare.com</p>
						      	<ul>
						      		<li>
						      			<Link to='subscription-plans' className='btn'>Buy Subscription</Link>
						      		</li>
						      		<li>
						      			<a href='logout' className='btn'>Logout</a>
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

