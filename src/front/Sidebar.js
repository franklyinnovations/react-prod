import React from 'react';

import {
	Sidebar, SidebarNav, SidebarNavItem,
	SidebarControls, SidebarControlBtn,
	LoremIpsum, Grid, Row, Col, FormControl,
	Label, Progress, Icon,
	SidebarDivider
} from '@sketchpixy/rubix';

import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import ServiceImage from '../components/ServiceImage';
import makeTranslater from '../translate';

@withRouter
@connect(state => ({
	session: state.session,
	translations: state.translations,
	lang: state.lang
}))
class ApplicationSidebar extends React.Component {
	constructor(props) {
		super(props);
		//this.menu = this.filterMenu([]);
	}

	handleChange(e) {
		this._nav.search(e.target.value);
	}

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		
		return (
			<div className='hospital-doctor'>
				<Grid>
					<Row>
						<Col xs={12}>
							{/*<FormControl type='text' placeholder='Search...' onChange={::this.handleChange} className='sidebar-search' style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />*/}
							<div className='sidebar-nav-container'>
								{"doctor" === this.props.session.user_type && this.doctorPanels(__) }
								{"hospital" === this.props.session.user_type && this.hospitalPanels(__) }
								{"doctor_clinic_both" === this.props.session.user_type && this.hospitalAndDoctorBothPanels(__) }
							</div>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
	
	filterMenu(menus) {
		let modules = this.props.session.modules,
			result = [];
		for (let i = 0; i < menus.length; i++) {
			let menu = menus[i];
			if (menu.module) {
				if (modules[menu.module])
					result.push(menu);
			} else if (menu.children) {
				menu = {...menu};
				menu.children = this.filterMenu(menu.children);
				if (menu.children.length) result.push(menu);
			}
		}
		return result;
	}

	doctorPanels(__) {
		var isProfileLive = this.props.session.associatedProfileData && this.props.session.associatedProfileData.is_active === 1 && this.props.session.associatedProfileData.is_live === 1;

		var menus = [
			{
				glyph: 'icon-fontello-gauge',
				name: __('Profile'),
				href: '/doctor/profile',
				module: 'dashboard'
			}
		];
		if(isProfileLive) {
			menus.push({ 
				glyph: 'icon-fontello-article-alt-1', 
				name: __('Article'), 
				href: '/doctor/article', 
				module: 'article' 
			}, {
				glyph: 'icon-fontello-question',
				name: __('Online Consultation'),
				href: '/doctor/onlineconsult',
				module: 'onlineconsult'
			})

			menus.push({ 
				glyph: 'icon-simple-line-icons-calendar', 
				name: __('My Schedule'), 
				href: '/doctor/myschedule', 
				module: 'myschedule' 
			})

			menus.push({ 
				glyph: 'icon-outlined-paper-sheet',
				name: __('Feedbacks'),
				href: '/doctor/feedback',
				module: 'feedback'

			})
		}

		return (
			<SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
				{
					menus.map((value, index) =>
						<SidebarNavItem key={value.name} name={value.name} glyph={value.glyph} href={value.href} />
					)
				}
			</SidebarNav>
		);
	}

	hospitalPanels(__) {
		var isProfileLive = this.props.session.associatedProfileData && this.props.session.associatedProfileData.is_active === 1 && this.props.session.associatedProfileData.is_live === 1;
		
		var menus = [
			{
				glyph: 'icon-fontello-gauge',
				name: __('Profile'),
				href: '/hospital/profile',
				module: 'dashboard'
			}
		];

		if(isProfileLive) {
			menus.push(
				{ 
				glyph: 'icon-outlined-paper-sheet', 
				name: __('Feedbacks'), 
				href: '/hospital/feedback', 
				module: 'feedback' 
			},
			{ 
				glyph: 'icon-simple-line-icons-calendar', 
				name: __('Schedule'), 
				href: '/hospital/myschedule', 
				module: 'myschedule' 
			},
			{ 
				glyph: 'icon-outlined-spread', 
				name: __('Careers'),
				children: [
					{
						name: __('Job Posts'),
						href: '/hospital/job-post',
						module: 'jobpost'
					}, {
						name: __('Applications'),
						href: '/hospital/application',
						module: 'application'
					},
				]
			}
		)
		}

		return (
			<SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
				{
					menus.map((value, index) =>
						(value.children && value.children.length > 0) ? 
						<SidebarNavItem
							key={value.name}
							glyph={value.glyph}
							name={<span>{value.name}</span>}>
							<SidebarNav>
								{
									value.children.map((item, index) =>
										<SidebarNavItem key={item.name} name={item.name} href={item.href}/>
									)
								}
							</SidebarNav>
						</SidebarNavItem> :
						<SidebarNavItem key={value.name} name={value.name} glyph={value.glyph} href={value.href} />
					)
				}
			</SidebarNav>
		);
	}

	hospitalAndDoctorBothPanels(__) {
		var isProfileLive = this.props.session.associatedProfileData && this.props.session.associatedProfileData.is_active === 1 && this.props.session.associatedProfileData.is_live === 1;

		var menus = [
			{
				glyph: 'icon-fontello-gauge',
				name: __('Profile'),
				href: '/doh/profile',
				module: 'dashboard'
			}
		];

		if(this.props.session.allHospitalProfiles.length) menus.push({glyph: 'icon-fontello-hospital', name: __('My Clinic'), href: '/doh/my-clinics', module: 'hospitals'});

		if(isProfileLive) {
			menus.push({ 
				glyph: 'icon-fontello-article-alt-1', 
				name: __('Article'), 
				href: '/doh/article', 
				module: 'article' 
			}, {
				glyph: 'icon-outlined-paper-sheet',
				name: __('Feedbacks'),
				href: '/doh/feedback',
				module: 'feedback'
			}, { 
				glyph: 'icon-simple-line-icons-calendar', 
				name: __('My Schedule'), 
				href: '/doh/myschedule',
				module: 'myschedule' 
			}, { 
				glyph: 'icon-simple-line-icons-calendar', 
				name: __('Clinic Schedule'), 
				href: '/doh/clinic-schedule', 
				module: 'clinic-schedule' 
			}, { 
				glyph: 'icon-outlined-spread', 
				name: __('Careers'),
				children: [
					{
						name: __('Job Posts'),
						href: '/doh/job-post',
						module: 'jobpost'
					}, {
						name: __('Applications'),
						href: '/doh/application',
						module: 'application'
					},
				]
			}, {
				glyph: 'icon-fontello-question',
				name: __('Online Consultation'),
				href: '/doh/onlineconsult',
				module: 'onlineconsult'
			})
		}

		return (
			<SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
				{
					menus.map((value, index) =>
						(value.children && value.children.length > 0) ? 
						<SidebarNavItem
							key={value.name}
							glyph={value.glyph}
							name={<span>{value.name}</span>}>
							<SidebarNav>
								{
									value.children.map((item, index) =>
										<SidebarNavItem key={item.name} name={item.name} href={item.href}/>
									)
								}
							</SidebarNav>
						</SidebarNavItem> :
						<SidebarNavItem key={value.name} name={value.name} glyph={value.glyph} href={value.href} />
					)
				}
			</SidebarNav>
		);
	}
}

class DummySidebar extends React.Component {
	render() {
		return (
			<Grid>
				<Row>
					<Col xs={12}>
						<div className='sidebar-header'>DUMMY SIDEBAR</div>
						<LoremIpsum query='1p' />
					</Col>
				</Row>
			</Grid>
		);
	}
}

@connect(state => ({
	session: state.session,
	lang: state.lang,
	translations: state.translations,
}))
export default class SidebarContainer extends React.Component {
	render() {
		return (
			<div id='sidebar'>
				<div id='avatar'>
					<Grid>
						<Row className='fg-white'>
							<Col xs={12} collapseRight>
                      			<img style={{top: 0}} src='/imgs/common/logo1.png' alt='PaTeaSt' width='111' height='28' />
								{/* <ServiceImage
									src={this.props.session.servicePath + this.props.session.userdetails.user_image}
									width='40'
									height='40'
									className='profile-image'
								/> */}
							</Col>
							<Col xs={8} collapseLeft id='avatar-col'>
								<div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>
									{/*this.props.session.userdetails.fullname*/}

								</div>
							</Col>
						</Row>
					</Grid>
				</div>
                                { /*
				<SidebarControls>
					<SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
					<SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={1} />
					<SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={2} />
					<SidebarControlBtn bundle='fontello' glyph='th-list-2' sidebar={3} />
					<SidebarControlBtn bundle='fontello' glyph='bell-5' sidebar={4} />
				</SidebarControls>
                                */ }
				<div id='sidebar-container'>
					<Sidebar sidebar={0}>
						<ApplicationSidebar />
					</Sidebar>
					<Sidebar sidebar={1}>
						<DummySidebar />
					</Sidebar>
					<Sidebar sidebar={2}>
						<DummySidebar />
					</Sidebar>
					<Sidebar sidebar={3}>
						<DummySidebar />
					</Sidebar>
					<Sidebar sidebar={4}>
						<DummySidebar />
					</Sidebar>
				</div>
			</div>
		);
	}
}