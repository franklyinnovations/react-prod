import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import DemoRequest from '../components/DemoRequest';
import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';
import {Modal} from '../components';


import makeTranslater from '../translate';

@connect((state) => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class Home extends React.Component {

	state = {
		videoUrl: null
	};

	showVideo = () => this.setState({
		videoUrl: ({
			ar: 'https://www.youtube.com/embed/efK6-u34CHM?autoplay=1',
		})[this.props.lang.code] || 'https://www.youtube.com/embed/efK6-u34CHM?autoplay=1'
	});

	hideVideo = () => this.setState({videoUrl: null});

	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front' className='home-pg'>
				<Header/>
				<Banner students={true} bottom={true}>
					<div className='container'>
						<div className='row'>
							<div className='col-sm-7'>
								<p>
									{_('An omni-inclusive integrated System for management of Educational Institutions, encompassing all that your School/College needs to get done in a hassle free yet powerfully dynamic way.')} <strong>{_('School Management Software')},</strong> {_('at its best.')}
								</p>
								<div className='stores-btns'>
									<a href="//itunes.apple.com/us/app/pateast/id1278331221?mt=8" target="_blank">
										<i className="fab fa-apple"></i>
										<small>{_('Available on the')}</small>
										{_('App Store')}
									</a>
									<a href="//play.google.com/store/apps/details?id=com.pws.pateast"  target="_blank">
										<i className="fab fa-google-play"></i>
										<small>{_('Available on the')}</small>
										{_('Google Play')}
									</a>
								</div>
							</div>
						</div>
					</div>
				</Banner>
				<section className="sms-section">
					<div className="container-fluid">
						<div className="row">
							<div className="col-sm-12">
								<div className="sms-content text-center">
									<h2>{_('School Management Software')}</h2>
									<p> {_('Pateast School management system helps consistently achieve the School-KPIs, towards building an exceptional Institution Culture & Climate by optimizing your School Systems & processes.')} {_('As an embedded partner, Pateast actually evolves with your Institution’s growing needs.')}</p>
									<p>{_('Since launched, Pateast school management software has helped solve practical challenges faced by School Administration, as well as Teachers, Students, Parents.')} {_('And has been admired for its unconditional & no-restraints approach and Simplicity despite ever-growing features.')}</p>
								</div>
							</div>
						</div>
						<div className="row">
						<div className="col-md-6">  
							<div className="pateast-video-sec-box">
								<div onClick={this.showVideo} className="video-thumbs">
									<img src="/imgs/front/pateast-video_img.jpg" className="img-responsive" alt="img" />
								</div>
								<Modal
									id='pateast-video-pop'
									show={this.state.videoUrl !== null}
									onHide={this.hideVideo}>
									<Modal.Body>
										<button
											className='close'
											onClick={this.hideVideo}>
											&times;
										</button>
										{
											this.state.videoUrl &&
											<iframe
												className="pateast-video-sec"
												id="pateast-video-sec"
												src={this.state.videoUrl}/>
										}
									</Modal.Body>
								</Modal>
							</div>
						</div>
						<div className="col-md-6">
							<div className="sms-box-wrapper">
								<div className="row">
									<div className="col-sm-12">
									<div className="sms-box">
										<div className="icon-holder">
											<img src="/imgs/front/icon-teacher.png" alt="" />
										</div>
										<div className="sms-box-content">
											<h3>{_('I’m a Teacher')}</h3>
											<p>{_('No more overwhelming juggle between Administrative, Teaching, Caregiving tasks.')} {_('Pateast enables me to be at my Teaching best.')}</p>
										</div>
									</div>
									</div>
									<div className="col-sm-12">
									<div className="sms-box">
										<div className="icon-holder">
											<img src="/imgs/front/icon-administrator.png" alt="" />
										</div>
										<div className="sms-box-content">
											<h3>{_('I’m an Administrator')}</h3>
											<p>{_('For my vast responsibilities, Pateast is the quintessential-management & support system that matches & evolves with my complex needs.')}</p>
										</div>
									</div>
									</div>
									<div className="col-sm-12">
									<div className="sms-box">
										<div className="icon-holder">
											<img src="/imgs/front/icon-student.png" alt="" />
										</div>
										<div className="sms-box-content">
											<h3>{_('I’m a Student')}</h3>
											<p>{_('Pateast Student App helps me with its in-built LMS, and I remain updated with my Class-schedule & Assignments.')}</p>
										</div>
									</div>	
									</div>
									<div className="col-sm-12">
									<div className="sms-box">
										<div className="icon-holder">
											<img src="/imgs/front/icon-parent.png" alt="" />
										</div>
										<div className="sms-box-content">
											<h3>{_('I’m a Parent')}</h3>
											<p>{_('Features in my Parents App like Online-PTM, Bus-tracking, Attendance, Online Exams, Fee-management, Chat with Teacher, are truly indispensable.')}</p>
										</div>
									</div>	
									</div>
								</div>
							</div>
						</div>
						</div>
					</div>
				</section>
				<section className="edu-feature-section">
					<div className="pateast-education-section">
						<div className="container">
							<div className="row">
								<div className="col-sm-12">
									<h2 className="heading">
										<span>{_('Pateast')}</span> {_('has everything needed to run your Educational Institution optimally.')}
									</h2>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-1.png"/>
										</div>
										<p>{_('One Stop solution for School & Faculty')}</p>
									</div>
								</div>
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-2.png" />
										</div>
										<p>{_('Empower Students & Parents')}</p>
									</div>
								</div>
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-3.png" />
										</div>
										<p>{_('Active Collaboration with Students/Parents.')}</p>
									</div>
								</div>
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-4.png" />
										</div>
										<p>{_('Student Attendance & Timetable management')}</p>
									</div>
								</div>
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-5.png" />
										</div>
										<p>{_('Real Time GPS based tracking module.')}</p>
									</div>
								</div>
								<div className="col-sm-6 edu-bars">
									<div className="edu-content">
										<div className="icon-holder">
											<img src="/imgs/front/icon-edu-6.png" />
										</div>
										<p>{_('Active collaboration with Teachers to optimize Student’s learning.')}</p>
									</div>
								</div>
							</div>
						</div>
						<span className="home-vector">
							<img src="/imgs/front/home-vector.png" className="img-responsive"/>
						</span>
					</div>
					<div className="feature-section">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<h2 className="heading"><span>{_('School Management')}</span> {_('App Features')}</h2>
								</div>
							</div>
						<div className="timeline-area">
							<div className="row">
								<div className="col-sm-6 timeline-col-1">
									<div className="img-holder">
										<img src="/imgs/front/School-Admin-Benefits.png" className="img-responsive" />
									</div>
								</div>
								<div className="col-sm-6 timeline-col-2">
									<div className="feature-box-blue box-left">
										<h2 className="feature-heading">{_('School Admin Benefits')}</h2>
										<ul className="features-list">
											<li>{_('Admin dashboard with all matrix-points of School.')}</li>
											<li>{_('Role based	Human Resource Management.')}</li>
											<li>{_('Analytics based Custom-Reports.')}</li>
											<li>{_('Fee Structure Configuration & Management.')}</li>
											<li>{_('Customized MarkSheet / ReportCard')}</li>
											<li>{_('Finance / Admissions / Transportation / Student-data Management.')}</li>
											<li>{_('Management & Bulk-Import of Student-data')}</li>
											<li>{_('Instant SMS/Email message to parents.')}</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6 pull-right timeline-col-3">
									<div className="img-holder">
										<img src="/imgs/front/Teacher-Benefits.png" className="img-responsive" />
									</div>
								</div>
								<div className="col-sm-6 timeline-col-4">
									<div className="feature-box-red box-right">
										<h2 className="feature-heading arrow-on-right">{_('Teacher Benefits')}</h2>
										<ul className="features-list">
											<li>{_('Assignments & Online Exams')} </li>
											<li>{_('Class-schedule, Attendance & Leave management')}</li>
											<li>{_('In-Built Learning Management Solution')}</li>
											<li>{_('Online / 1-to-1 PTM (Parents Teacher Meeting)')}</li>
											<li>{_('Teachers Dashboard on Web & Mobile App.')}</li>
											<li>{_('Chat with Admin & Students & Parents.')}</li>
											<li>{_('Students Performance Matrix')}</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6 timeline-col-5">
									<div className="img-holder">
										<img src="/imgs/front/Parents-Benefits.png" className="img-responsive" />
									</div>
								</div>
								<div className="col-sm-6 timeline-col-6">
									<div className="feature-box-yellow box-left">
										<h2 className="feature-heading">{_('Parents Benefits')}</h2>
										<ul className="features-list">
											<li>{_('Check Child\'s Assignments, Attendance, Leaves, Class-schedule.')}</li>
											<li>{_('Parent\'s Mobile App Dashboard with Child\'s complete information in one screen.')}</li>
											<li>{_('Check Child\'s Exam-Schedule, Syllabus, Marks obtained.')}</li>
											<li>{_('Easy access to complete information of multiple children, in Parent App.')}</li>
											<li>{_('App-based Tracking of Child\'s School Bus')}</li>
											<li>{_('Fee-structure management, with Online fee-payment.')}</li>
											<li>{_('Online or 1-to-1 PTM scheduling.')}</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6 pull-right timeline-col-7">
									<div className="img-holder">
										<img src="/imgs/front/Student-Benefits.png" className="img-responsive" />
									</div>
								</div>
								<div className="col-sm-6 timeline-col-8">
									<div className="feature-box-purple box-right">
										<h2 className="feature-heading arrow-on-right">{_('Student Benefits')}</h2>
										<ul className="features-list">
											<li>{_('Enhanced learning through LMS (Learning Management System)')}</li>
											<li>{_('Check self-attendance, and Given/Completed Assignments')}</li>
											<li>{_('In-App Chat-messaging with Teachers and School-Admin.')}</li>
											<li>{_('In-App Student Dashboard with his/her Profile, Assignments, Holidays/Leaves, Attendance, Exams Syllabus/Results, Class-Schedule, Events etc.')} </li>
											<li>{_('Apply for Leave, and check Approval/Rejection status.')}</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-12 text-center">
									<Link to="/sign-up" className="btn btn-rouned btn-primary">{_('Try Free Demo')}</Link>
								</div>
							</div>
						</div>
						</div>
					</div>
				</section>
				<section className="customer-area">
					<div className="container-fluid">
						<div className="row">
							<div className="col-sm-12">
								<h2 className="heading" dangerouslySetInnerHTML={{__html: _("These Customers Love {{html}} Here’s Why:",{
									html: '<span>Pateast</span>'
								})}}/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="customer-slider-wrapper">
									<div className="customer-slider">
										<div className="item">
											<div className="client-img" style={{display: 'none'}}>
												<img src="/imgs/front/customer-img.png"/>
											</div>
											<div className="client-content">
												<i className='fa fa-quote-left'/>
												<p>{_('Pateast has de-stressed and helped align our School\'s processes')}; {_('Now We are able to take better & informed decisions through Custom-Reports powered by Pateast\'s Educational Data Analytics.')}' </p>
												<div className="customer-name">{_('Kidscare School')}</div>
											</div>
										</div>
										<div className="item">
											<div className="client-img" style={{display: 'none'}}>
												<img src="/imgs/front/customer-img.png"/>
											</div>
											<div className="client-content">
												<i className='fa fa-quote-left'/>
												<p>{_('We were using Desktop Software which was not interactive with Teachers/Students/Parents.')} {_('For every data, we had to request to Admin.')} {_('As Principle, now i can access & manage all processes of School Reports on my computer and mobile and anytime.')}</p>
												<div className="customer-name">{_('FlowerKids School')}</div>
											</div>
										</div>
									</div>
								<div className="slider-action">
									<span className="slide-prev"> <i className="fa fa-angle-left"></i> </span>
									<span className="slide-next"> <i className="fa fa-angle-right"></i> </span>
								</div>
								</div>
							</div>
						</div>
					</div>
					<div className="happy-kids">
						<img src="/imgs/front/happy-kids.png"/>
					</div>
				</section>
				<DemoRequest/>
				<Footer/>
			</div>
		);
	}
}
