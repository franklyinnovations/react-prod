import React from 'react';
import { connect } from 'react-redux';

import {
	Tab,
	Text,
	Tabs,
	Panel,
	PanelGroup
} from '../components';

import Header, {Banner} from '../front/Header';
import Footer from '../front/Footer';

import makeTranslater from '../translate';

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
					<h1>{_('Frequently Asked Questions')}</h1>
				</Banner>
				<section className="faq-section cloudy-bg">
					<div className='faq-container'>
						<div className="container">
							<div className="row">
								<div className='col-md-12'>
									<Tabs id='faq-tabs' bsStyle='pills' justified className='faq-tabs'>
										<Tab eventKey={1} title={_('For School Admin')}>
											<PanelGroup accordion id="schoolAdminAccordion">
												<Panel eventKey='1'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 1. What is PATEAST?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Pateast is a institute management ERP available online that helps institutes centralise and streamline their operation. It speeds up tasks and gives all staff, students and parents access to lots of data and functionality, and is totally secure.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='2'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 2. How do you protect our data?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Protecting your data is our top priority. We use modern advanced security measures in both our technology and development environments. Our security measures are based on globally recognised security standards and fully audited by external auditors on regular basis.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='3'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 3. How can I use Pateast?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Pateast is a web application accessible through any browser. you can access it from any web enabled computer.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='4'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 4. What kind of software programs do I require to run Pateast?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>All you need is a latest web browser of Explorer (IE), Mozilla Firefox or Google Chrome.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='5'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 5. Do you offer support to clients?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Our technical support can assist you with any technical problems you may face. Support is provided by phone as well as live chat or Skype. This is absolutely free of charge.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='6'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 6. Can teachers view confidential information?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>We are having Role based system, you can configure it as per your Requirements and can manage permissions to view and edit details.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='7'>
													<Panel.Heading>
														<Panel.Title>
															<Panel.Toggle>
																<Text>Q 7. How do I get started?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You can sign up for a free 30 day trial. You will be able to configure your trial and import your data to test out the whole system.</Text>
													</Panel.Body>
												</Panel>
											</PanelGroup>
										</Tab>
										<Tab eventKey={2} title={_('For Teacher')}>
											<PanelGroup accordion id="teacherAccordion">
												<Panel eventKey='1'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 1. Can I login on both web and mobile app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, Teacher can login in both web application and mobile app with provided credentials from institute admin.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='2'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 2. How can I see my classes and students?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You can see “My classes” on dashboard and in Menu options in application. In this section you can see all associated class list and students.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='3'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 3. How can I create Assignment and share with students?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You can create assignments from both web and mobile app for particular class & shared will class students. A notification will be sent to class students about new assignment. They can access from dashboard.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='4'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 4. How can I take my class attendance?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Teacher can take students attendance from web and mobile app. Teacher will be able to select class name and can view students list & can mark Present, Absent, and Late.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='5'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 5. Can I see my classes schedule on mobile app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, you can see your daily class schedule according to week days.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='6'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 6. How to add exam information (Exam syllabus and Marks) for students?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You can add Exam information only from web application. User can select Exam Name, class, subject and can add Exam syllabus and From Add Marks Page, can upload Marks.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='7'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 7. Can I communicate with students and Parents?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, You can communicate with class students and parents from message module via mobile app.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='8'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 8. How can I apply for Leave and view leave status?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You can access “My Leaves” from both web and mobile app. From “Apply Leave” page/screen, you will be able to submit leave application. From “My Leaves” screen you can see Leave status like as approved, pending, cancelled etc.</Text>
													</Panel.Body>
												</Panel>
											</PanelGroup>
										</Tab>
										<Tab eventKey={3} title={_('For Parent')}>
											<PanelGroup accordion id="forParent">
												<Panel eventKey='1'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 1. How can I install Pateast Mobile app in my Mobile Phone?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>If you have android mobile phone then you can download “Pateast” from Play store and can install in your device. If you have iPhone the you can download “Pateast” from Apple store and can install in your device.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='2'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 2. Can I see my 2 childrens school data in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, You can see your multiple children's school data but those institutes should be associated with Pateast. You can select your child Name and can view complete information of school and academic Reports.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='3'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 3. Can I see my child school Holiday’s list in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, On dashboard, there is a option “Holidays”. On tapping you can see list of Holidays of selected.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='4'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 4. How can I see my child class schedule in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Dashboard, You will be able to see Selected Today’s class schedule with class timing, subject Name, and Teacher Name. From Menu “Class Schedule”, you can check date wise class schedule.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='5'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 5. How can I check my child assignments?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Dashboard, You can see “next assignment due” with assignment name & due date. On menu screen, there is a Option “Assignments”, on tapping you can see assignment list. You can see your child submitted assignment Remarks.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='6'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 6. How can I check Schedule of PTM (Parents -Teacher Meeting) and confirm appointment?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Menu screen, You can see option “PTM”. User can see PTM Details Like as Date and Time schedules. You can confirm your appointment with class & subject teachers.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='7'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 7. Can I track my child school bus in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, You can see live tracking of your child school bus on Google map in app. And you will also get notification about pickup and drop at school and your stop.</Text>
													</Panel.Body>
												</Panel>
											</PanelGroup>
										</Tab>
										<Tab eventKey={4} title={_('For Student')}>
											<PanelGroup accordion id="studentAccordion">
												<Panel eventKey='1'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 1. How can I install Pateast Mobile app in my Mobile Phone?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>If you have android mobile phone then you can download “Pateast” from Play store and can install in your device. If you have iPhone the you can download “Pateast” from Apple store and can install in your device.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='2'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 2. How can I Login in Mobile app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>You have to select User Type “Student” and enter your “user Name” and “Password” provided by your institute admin. After successful Login, you will be able to access dashboard and other mobile app Features.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='3'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 3. How can I check my Today’s class schedule?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Dashboard, You will be able to see Today’s class schedule with class timing, subject Name, and Teacher Name. From Menu “Class Schedule”, you can check date wise class schedule.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='4'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 4. How can I check my attendance Report?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>In Menu screen, there is a Option “Attendance”. On tapping you can see your current month attendance Report like as Total Days, Present, Absent and Leave.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='5'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 5. Can I see my school Holiday’s list in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, On dashboard, there is a option “Holidays”. On tapping you can see list of Holiday’s.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='6'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 6. How can I check my subject assignments?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Dashboard, You can see “next assignment due” with assignment name & due date. on Menu screen, there is a Option “Assignments”, on tapping you can see assignment list. You can see your submitted assignment Remarks.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='7'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 7. How can I check my Exam Schedule?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Menu screen, we have given option “Exam Schedule”, on tapping you will be able to view your upcoming exam schedule.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='8'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 8. How can I apply for Leave?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>On Menu screen, we have given option “My Leave”, on tapping you can see all applied Leaves like as Pending, approved, Rejected, and Cancel. There is a button “Apply Leave”, on tapping you can submit leave application with start date & end.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='9'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 9. Can I send message to teacher from app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, we have given chat feature in app. There is a option “Messages” in menu screen, on tapping you can send message to your subject teacher or can chat with him.</Text>
													</Panel.Body>
												</Panel>
												<Panel eventKey='10'>
													<Panel.Heading>
														<Panel.Title componentClass='h4'>
															<Panel.Toggle>
																<Text>Q 10. Can I check my exam marks in app?</Text>
															</Panel.Toggle>
														</Panel.Title>
													</Panel.Heading>
													<Panel.Body collapsible>
														<Text>Yes, we have given option “Exam marks” on menu screen. On tapping you can select Exam Name and can see the all subject marks.</Text>
													</Panel.Body>
												</Panel>
											</PanelGroup>
										</Tab>
									</Tabs>
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
