import React from 'react';
import { connect } from 'react-redux';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';
import DemoRequest from '../components/DemoRequest';

import makeTranslater from "../translate";

@connect(state => ({
	translations: state.translations,
	lang: state.lang,
}))
export default class Features extends React.Component {
	render() {
		let _ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<div id='front'>
				<Header/>
				<Banner inner>
					<h1>{_('PATEAST FEATURES')}</h1>
					<p>
						{_('Unique & scalable features for all the Stakeholders, covering all the possible Daily Activities of any modern Academic Institution.')}
					</p>
				</Banner>
				<section className="benefit-section">
					<div className="benefit-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-sm-12">
									<div className="heading-container">
										<h2 className="heading text-red">{_('School Management')}</h2>
										<h3>{_('Pateast has everything needed to run your Educational Institution optimally.')}</h3>
										<p>{_('Transform your school/institution into an well-oiled all-integrated, scalable, flexible Academic powerhouse, by managing all facets with unforeseen ease.')}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="benefit-container">
							<div className="container-fluid">
								<div className="row">
									<div className="col-md-4 col-sm-6">
										<div className="img-holder holder-red" style={{backgroundImage: 'url(/imgs/front/benefit-img-1.jpg)'}}>
											<span className="mobile-img-holder"> <img src="/imgs/front/banner-mobile.png" alt="" /> </span>
										</div>
									</div>
									<div className="col-md-8 col-sm-6">
										<div className="content">
											<h2>{_('School Management Benefits')}</h2>
											<ul>
												<li>{_('Complete Academic Institution ecosystem management.')}</li>
												<li>{_('Achieve complete collaboration between all All Stakeholders.')}</li>
												<li>{_('Analytical Reporting for quick yet informed decision-making.')}</li>
												<li>{_('Cloud ERP, thus Zero additional Infra Costs.')}</li>
												<li>{_('Dynamic Marks/Grades management & Performance Analysis of Students/Teachers.')}</li>
												<li>{_('Admission Management')}</li>
												<li>{_('Staff Information Management')}</li>
												<li>{_('Fee Management and Online Payment')}</li>
												<li>{_('Online Chat')}</li>
												<li>{_('Timetable Management')}</li>
												<li>{_('Transport Management')}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="benefit-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-sm-12">
									<div className="heading-container">
										<h2 className="heading text-blue">{_('Teachers & Faculty')}</h2>
										<p>{_('As Engines of any inspiring Institution, PaTeaSt empowers Teachers to undertake their duties holistically and thus increasingly contribute by minimal time-spend on managing varied tasks related to their Role.')}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="benefit-container">
							<div className="container-fluid">
								<div className="row">
									<div className="col-md-4 col-sm-6">
										<div className="img-holder holder-blue" style={{backgroundImage: 'url(/imgs/front/benefit-img-2.jpg)'}}>
											<span className="mobile-img-holder"> <img src="/imgs/front/banner-mobile-1.png" alt="" /> </span>
										</div>
									</div>
									<div className="col-md-8 col-sm-6">
										<div className="content">
											<h2>{_('Teachers & Faculty Benefits')}</h2>
											<ul>
												<li>{_('Student Attendance & Timetable management.')}</li>
												<li>{_('Assign, Prioritize, Track, Approve Assignments.')}</li>
												<li>{_('Active Collaboration with Students/Parents.')}</li>
												<li>{_('Custom as well as Carpet Communication with the Students/Parents/Staff.')}</li>
												<li>{_('Selective Analytics based Reporting.')}</li>
												<li>{_('Assignment Management')}</li>
												<li>{_('Attendance Management')}</li>
												<li>{_('Exam & Result Management')}</li>
												<li>{_('Online Chat')}</li>
												<li>{_('Student Leave Request Management')}</li>
												<li>{_('Analytical Report')}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="benefit-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-sm-12">
									<div className="heading-container">
										<h2 className="heading text-purple">{_('Parents')}</h2>
										<h3>{_('One Place to Organize and Manage your schools.')}</h3>
										<p>{_('Power your schools with Pateast! It does great things, satisfies Teachers, Students and Parents.')} {_('Its simple & easy, works anywhere and all time, on cloud, affordable, flexible, scalable, provides integrated school website, highly secured and much more.')}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="benefit-container">
							<div className="container-fluid">
								<div className="row">
									<div className="col-md-4 col-sm-6">
										<div className="img-holder holder-purple" style={{backgroundImage: 'url(/imgs/front/benefit-img-3.jpg)'}}>
											<span className="mobile-img-holder"> <img src="/imgs/front/banner-mobile.png" alt="" /> </span>
										</div>
									</div>
									<div className="col-md-8 col-sm-6">
										<div className="content">
											<h2>{_('Parents Benefits')}</h2>
											<ul>
												<li>{_('Real Time GPS based tracking module.')}</li>
												<li>{_('Student’s Health monitoring.')}</li>
												<li>{_('Student’s non-academic activities management')}</li>
												<li>{_('Syllabus management & Exam Schedule tracking.')}</li>
												<li>{_('Active collaboration with Teachers to optimize Student’s learning.')}</li>
												<li>{_('Assignment View')}</li>
												<li>{_('Exam Schedule & Marks')}</li>
												<li>{_('Online Payment')}</li>
												<li>{_('Online Chat with Teacher')}</li>
												<li>{_('Transport onboard/offboard')}</li>
												<li>{_('Student Leave')}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="benefit-wrapper">
						<div className="container">
							<div className="row">
								<div className="col-sm-12">
									<div className="heading-container">
										<h2 className="heading text-yellow">{_('Students')}</h2>
										<h3>{_('One Place to Organize and Manage your schools.')}</h3>
										<p>{_("Power your schools with Pateast! It does great things, satisfies Teachers, Students and Parents.")} {_('Its simple & easy, works anywhere and all time, on cloud, affordable, flexible, scalable, provides integrated school website, highly secured and much more.')}</p>
									</div>
								</div>
							</div>
						</div>

						<div className="benefit-container">
							<div className="container-fluid">
								<div className="row">
									<div className="col-md-4 col-sm-6">
										<div className="img-holder holder-yellow" style={{backgroundImage: 'url(/imgs/front/benefit-img-2.jpg)'}}>
											<span className="mobile-img-holder"> <img src="/imgs/front/banner-mobile.png" alt="" /> </span>
										</div>
									</div>
									<div className="col-md-8 col-sm-6">
										<div className="content">
											<h2>{_('Students Benefits')}</h2>
											<ul>
												<li>{_('Real Time GPS based tracking module.')}</li>
												<li>{_('Student’s Health monitoring.')}</li>
												<li>{_('Student’s non-academic activities management')}</li>
												<li>{_('Syllabus management & Exam Schedule tracking.')}</li>
												<li>{_('Active collaboration with Teachers to optimize Student’s learning.')}</li>
												<li>{_('Assignment View')}</li>
												<li>{_('Exam Schedule & Marks')}</li>
												<li>{_('Student Attendance')}</li>
												<li>{_('Online Chat')}</li>
												<li>{_('Class Timetable')}</li>
												<li>{_('Student Leave')}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<DemoRequest/>
				<Footer/>
			</div>
		);
	}
}
