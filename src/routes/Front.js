import React from 'react';
import { connect } from 'react-redux';

import actions from '../redux/actions';

import {
	Row,
	Col,
	Grid,
	Panel,
	PanelBody,
	PanelContainer,
} from '@sketchpixy/rubix';

@connect((state) => state)
export default class Home extends React.Component {
	render() {
		return (
			<div>
				<div className="banner-outer">
				  <div className="banner-data wow slideInLeft"  data-wow-duration=".5s">
				    <div className="front-container">
				      <div className="row">
				        <div className="col-md-6 col-sm-7 col-xs-12">
				          <div className="banner-txt-wrap">
				            <div className="banner-top-txt">
				              <p className="wow fadeIn" data-wow-duration="1.2s" data-wow-delay=".5s" >An omni-inclusive integrated System for management of Educational Institutions, encompassing all that your School/College needs to get done in a hassle free yet powerfully dynamic way</p>
				            </div>
				            <div className="app-link">
				              <ul>
				                <li> <a href="#" className="wow bounceIn" data-wow-duration=".8s" data-wow-delay="1s"> <span className="img"> <img src="/imgs/front/mac-icon.png" alt="" /></span> <span className="txt"> <span className="light">Available on the</span> <span className="bold">APP STORE</span> </span> </a> </li>
				                <li> <a href="#" className="wow bounceIn" data-wow-duration=".8s" data-wow-delay="1.5s"> <span className="img"><img src="/imgs/front/google-play.png" alt="" /></span> <span className="txt"> <span className="light">Available on the</span> <span className="bold">Google Play</span> </span> </a> </li>
				              </ul>
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    <div className="bannerphn-img"> <img src="/imgs/front/banner-phone.png" alt="" /> </div>
				  </div>
				</div>
				<div className="msFeatures">
				  <div className="front-container">
				    <h2 className="wow fadeInLeft" data-wow-duration=".8s">All-Inclusive yet Uncomplicated School Management System</h2>
				    <div className="row">
				      <div className="col-md-4 col-sm-4 col-xs-12">
				        <div className="msfeaturesWrap   wow fadeIn" data-wow-duration=".8s" data-wow-delay="1s" >
				          <div className="msfeaicon">
				            <div className="msfeaiconinner transition-effect"> <img src="/imgs/front/one-stop.jpg" alt="" /> </div>
				          </div>
				          <div className="msfeadesc">
				            <div className="msfeadesc-lefticon"> <span><img src="/imgs/front/user.png" alt="" /></span> </div>
				            <div className="msfeadesc-pl">
				              <h3>One Stop solution for School & Faculty</h3>
				              <p>You & your Team’s struggle to manage Activities & Challenges will be history, with all control at one spot.</p>
				            </div>
				          </div>
				        </div>
				      </div>
				      <div className="col-md-4 col-sm-4 col-xs-12">
				        <div className="msfeaturesWrap wow fadeIn" data-wow-duration=".8s" data-wow-delay="1.2s">
				          <div className="msfeaicon">
				            <div className="msfeaiconinner"> <img src="/imgs/front/empower.jpg" alt="" /> </div>
				          </div>
				          <div className="msfeadesc">
				            <div className="msfeadesc-lefticon"> <span><img src="/imgs/front/feature.png" alt="" /></span> </div>
				            <div className="msfeadesc-pl">
				              <h3>Empower Students & Parents</h3>
				              <p>An school ERP so collaborative that Students/Parents feel seamlessly integrated & included.</p>
				            </div>
				          </div>
				        </div>
				      </div>
				      <div className="col-md-4 col-sm-4 col-xs-12">
				        <div className="msfeaturesWrap wow fadeIn" data-wow-duration=".8s" data-wow-delay="1.5s">
				          <div className="msfeaicon">
				            <div className="msfeaiconinner"> <img src="/imgs/front/a-zero.jpg" alt="" /> </div>
				          </div>
				          <div className="msfeadesc">
				            <div className="msfeadesc-lefticon"> <span><img src="/imgs/front/student-licence.png" alt="" /></span> </div>
				            <div className="msfeadesc-pl">
				              <h3>A Zero-Prerequisite Solution</h3>
				              <p>Surprisingly affordable, Cloud based SAAS solution. No Server, No Installation & definitely No Expertise needed.</p>
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
				<div className="school-mgWrap" id="schoolmanagement">
				<div className="gradientbg">
				  <div className="front-container">
				    <div className="row">
				      <div className="col-md-6 col-sm-6 col-xs-12">
				        <div className="school-mgData">
				          <h2 className="wow fadeInLeft" data-wow-duration=".5s">School Management</h2>
				          <h3>PaTeaSt has everything needed to run your Educational Institution optimally.</h3>
				          <p>Transform your school/institution into an well-oiled all-integrated, scalable, flexible Academic powerhouse, by managing all facets with unforeseen ease.</p>
				          <ul>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/01.png" alt="" /></div>
				              <div className="txt">Complete Academic Institution ecosystem management.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/02.png" alt="" /></div>
				              <div className="txt">Achieve complete collaboration between all All Stakeholders.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/03.png" alt="" /></div>
				              <div className="txt">Analytical Reporting for quick yet informed decision-making.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/04.png" alt="" /></div>
				              <div className="txt">Cloud ERP, thus Zero additional Infra Costs.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/05.png" alt="" /></div>
				              <div className="txt">Dynamic Marks/Grades management & Performance Analysis of Students/Teachers.</div>
				              </a></li>
				          </ul>
				          <div className="view-btnWrap"><a href="#" className="view-btn">View More</a></div>
				        </div>
				      </div>
				      <div className="col-md-6 col-sm-6 col-xs-12">
				        <div className="schoolmanagement-img">
				          <img src="imgs/front/school-management-image.jpg" alt=""/>
				        </div>
				      </div>
				    </div>
				  </div>
				 </div>
				</div>
				<div className="school-mgWrap" id="TeachersFaculty">
				<div className="gradientbg">
				  <div className="front-container">
				    <div className="row">
				    <div className="col-md-6 col-sm-6 col-xs-12">
				      <div className="TeachersFaculty-img">
				        <img src="imgs/front/teachers-faculty-image.jpg" alt=""/>
				      </div>
				    </div>
				      <div className="col-md-6 col-sm-6 col-xs-12">
				        <div className="school-mgData">
				          <h2 className="wow fadeInRight" data-wow-duration=".5s">Teachers & Faculty</h2>
				          <p>As Engines of any inspiring Institution, PaTeaSt empowers Teachers to undertake their duties holistically and thus increasingly contribute by minimal time-spend on managing varied tasks related to their Role.</p>
				        <ul>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/01-tnf.png" alt="" /></div>
				              <div className="txt">Student Attendance & Timetable management.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/02-tnf.png" alt="" /></div>
				              <div className="txt">Assign, Prioritize, Track, Approve Assignments.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/03-tnf.png" alt="" /></div>
				              <div className="txt">Active Collaboration with Students/Parents.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/04-tnf.png" alt="" /></div>
				              <div className="txt">Custom as well as Carpet Communication with the Students/Parents/Staff.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/05-tnf.png" alt="" /></div>
				              <div className="txt">Selective Analytics based Reporting.</div>
				              </a></li>

				          </ul>
				          <div className="view-btnWrap"><a href="#" className="view-btn">View More</a></div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>

				</div>
				<div className="school-mgWrap" id="StudentsParents">
				<div className="gradientbg">
				  <div className="front-container">
				    <div className="row">
				      <div className="col-md-6 col-sm-6 col-xs-12">
				        <div className="school-mgData">
				         <h2 className="wow fadeInLeft" data-wow-duration=".5s">Students & Parents</h2>
				          <h3>One Place to Organize and Manage your schools.</h3>
				          <h4>Power your schools with Pateast! It does great things, satisfies Teachers, Students and Parents.</h4>
				          <p>It's simple & easy, works anywhere and all time, on cloud, affordable, flexible, scalable, provides integrated school website, highly secured and much more.</p>
				          <ul>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/01-pns.png" alt="" /></div>
				              <div className="txt">Real Time GPS based tracking module.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/02-pns.png" alt="" /></div>
				              <div className="txt">Students’ Health monitoring.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/03-pns.png" alt="" /></div>
				              <div className="txt">Students’ non-academic activities management</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/04-pns.png" alt="" /></div>
				              <div className="txt">Syllabus management & Exam Schedule tracking.</div>
				              </a></li>
				            <li><a href="#">
				              <div className="img"><img src="/imgs/front/05-pns.png" alt="" /></div>
				              <div className="txt">Active collaboration with Teachers to optimize Student’s learning.</div>
				              </a></li>

				          </ul>
				          <div className="view-btnWrap"><a href="#" className="view-btn">View More</a></div>
				        </div>
				      </div>
				      <div className="col-md-6 col-sm-6 col-xs-12">
				        <div className="StudentsParents-img">
				          <img src="/imgs/front/students-parents-image.jpg" alt=""/>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
				</div>

				<div className="feastures-section">
				  <div className="front-container">
				    <div className="heading-txt">
				      <h2>Our Feature</h2>
				      <p>Unique & scalable features for all the Stakeholders, covering all the possible Daily Activities of any modern Academic Institution.</p>
				    </div>
				    <div className="features-category">
				      <div className="row">
				        <div className="col-md-6 col-sm-6 col-xs-12">
				          <div className="feature-box school-admin-feature-box">
				            <div className="front">
				              <div className="fb-info">
				                <div className="fb-icon">
				                  <img src="/imgs/front/school-admin-icon.png" alt="" />
				                </div>
				                <h5>For School Admin</h5>
				              </div>
				              <img src="/imgs/front/school-admin-bg.jpg" alt="" />
				            </div>
				            <div className="feature-box-detail pinkbg back">
				              <ul>
				                <li><img src="/imgs/front/admin-management.png" alt="" /> Admission Management</li>
				                <li><img src="/imgs/front/staff-management.png" alt="" /> Staff Information Management</li>
				                <li><img src="/imgs/front/fee-management.png" alt="" /> Fee Management and Online Payment</li>
				                <li><img src="/imgs/front/online-chat.png" alt="" /> Online Chat</li>
				                <li><img src="/imgs/front/timetable-management.png" alt="" /> Timetable Management</li>
				                <li><img src="/imgs/front/transport-management.png" alt="" /> Transport Management</li>
				              </ul>
				              <div className="fbd-footer">
				                <span>School Admin</span>
				              </div>
				              <div className="fbd-bg-icon">
				                <img src="/imgs/front/school-admin-bg-icon.png" alt="" />
				              </div>
				            </div>

				          </div>
				        </div>
				        <div className="col-md-6 col-sm-6 col-xs-12">
				          <div className="feature-box teacher-feature-box">
				            <div className="front">
				              <div className="fb-info">
				                <div className="fb-icon">
				                  <img src="/imgs/front/teacher-icon.png" alt="" />
				                </div>
				                <h5>For Teacher</h5>
				              </div>
				              <img src="/imgs/front/teacher-bg.jpg" alt="" />
				            </div>
				            <div className="feature-box-detail pinkbg back">
				              <ul>
				                <li><img src="/imgs/front/assignment-management.png" alt="" /> Assignment Management</li>
				                <li><img src="/imgs/front/attendance-management.png" alt="" /> Attendance Management</li>
				                <li><img src="/imgs/front/exam-result-management.png" alt="" /> Exam & Result Management</li>
				                <li><img src="/imgs/front/online-chat.png" alt="" /> Online Chat</li>
				                <li><img src="/imgs/front/leave-management.png" alt="" /> Student Leave Request Management</li>
				                <li><img src="/imgs/front/analytical-report.png" alt="" /> Analytical Report </li>
				              </ul>
				              <div className="fbd-footer">
				                <span>Teacher</span>
				              </div>
				              <div className="fbd-bg-icon">
				                <img src="/imgs/front/teacher-bg-icon.png" alt="" />
				              </div>
				            </div>

				          </div>
				        </div>
				        <div className="col-md-6 col-sm-6 col-xs-12">
				          <div className="feature-box parent-feature-box">
				            <div className="front">
				              <div className="fb-info">
				                <div className="fb-icon">
				                  <img src="/imgs/front/parent-icon.png" alt="" />
				                </div>
				                <h5>For Parent</h5>
				              </div>
				              <img src="/imgs/front/parent-bg.jpg" alt="" />
				            </div>
				            <div className="feature-box-detail pinkbg back">
				              <ul>
				                <li><img src="/imgs/front/view.png" alt="" /> Assignment View</li>
				                <li><img src="/imgs/front/timetable-management.png" alt="" /> Exam Schedule & Marks</li>
				                <li><img src="/imgs/front/fee-management.png" alt="" /> Online Payment</li>
				                <li><img src="/imgs/front/online-chat.png" alt="" /> Online Chat with Teacher</li>
				                <li><img src="/imgs/front/transport-management.png" alt="" /> Transport onboard/offboard</li>
				                <li><img src="/imgs/front/leave-management.png" alt="" /> Student Leave</li>
				              </ul>
				              <div className="fbd-footer">
				                <span>Parent</span>
				              </div>
				              <div className="fbd-bg-icon">
				                <img src="/imgs/front/parent-bg-icon.png" alt="" />
				              </div>
				            </div>

				          </div>
				        </div>
				        <div className="col-md-6 col-sm-6 col-xs-12">
				          <div className="feature-box student-feature-box">
				            <div className="front">
				              <div className="fb-info">
				                <div className="fb-icon">
				                  <img src="/imgs/front/student-icon.png" alt="" />
				                </div>
				                <h5>For Student</h5>
				              </div>
				              <img src="/imgs/front/student-bg.jpg" alt="" />
				            </div>
				            <div className="feature-box-detail pinkbg back">
				              <ul>
				                <li><img src="/imgs/front/view.png" alt="" /> Assignment View</li>
				                <li><img src="/imgs/front/timetable-management.png" alt="" /> Exam Schedule & Marks</li>
				                <li><img src="/imgs/front/attendance-management.png" alt="" /> Student Attendance</li>
				                <li><img src="/imgs/front/online-chat.png" alt="" /> Online Chat</li>
				                <li><img src="/imgs/front/timetable-management.png" alt="" /> Class Timetable</li>
				                <li><img src="/imgs/front/leave-management.png" alt="" /> Student Leave</li>
				              </ul>
				              <div className="fbd-footer">
				                <span>Student</span>
				              </div>
				              <div className="fbd-bg-icon">
				                <img src="/imgs/front/student-bg-icon.png" alt="" />
				              </div>
				            </div>

				          </div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
				<div className="app-section">
				  <div className="front-container">
				    <div className="row">
				      <div className="col-md-12 col-sm-12 col-xs-12">
				        <div className="app-data">
				          <h2 className="wow fadeInLeft" data-wow-duration=".8s"><span>Get app now download from</span></h2>
				          <div className="app-link wow fadeIn" data-wow-duration=".8s" data-wow-delay=".5s">
				            <ul>
				              <li> <a href="#" className="wow bounceIn blue" data-wow-duration=".8s" data-wow-delay="1s"> <span className="img"> <img src="/imgs/front/mac-iconWh.png" alt="" /></span> <span className="txt"> <span className="light">Available on the</span> <span className="bold">APP STORE</span> </span> </a> </li>
				              <li> <a href="#" className="wow bounceIn pink" data-wow-duration=".8s" data-wow-delay="1.5s"> <span className="img"><img src="/imgs/front/google-playWh.png" alt="" /></span> <span className="txt"> <span className="light">Available on the</span> <span className="bold">Google Play</span> </span> </a> </li>
				            </ul>
				          </div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
}
