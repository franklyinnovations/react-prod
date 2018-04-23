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
			<div>
				<Grid>
					<Row>
						<Col xs={12}>
							<FormControl type='text' placeholder='Search...' onChange={::this.handleChange} className='sidebar-search' style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />
							<div className='sidebar-nav-container'>
								{"admin" === this.props.session.user_type && this.superadminPanels(__) }
							</div>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}

	componentWillReceiveProps() {
		//this.menu = this.filterMenu(menus);
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

	superadminPanels(__) {
		return (
			<SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
				<SidebarNavItem glyph='icon-simple-line-icons-home' name={__('Dashboard')} href='/admin/dashboard' />
				<SidebarNavItem glyph='icon-fontello-hospital' name={<span>{__('Hospitals')}</span>}>
				 	<SidebarNav>
				 		<SidebarNavItem name={__('List')} href='/admin/hospital' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-fontello-user-md' name={<span>{__('Doctors')}</span>}>
				 	<SidebarNav>
				 		<SidebarNavItem name={__('List')} href='/admin/doctors' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-stroke-gap-icons-Users' name={<span>{__('Patient')}</span>}>
					<SidebarNav>
						<SidebarNavItem name={__('List')} href='/admin/patient' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-fontello-article-alt-1' name={__('Appointments')} href='/admin/appointment' />
	            <SidebarNavItem glyph='icon-fontello-article-alt-1' name={<span>{__('Article')}</span>}>
					<SidebarNav>
						<SidebarNavItem name={__('Article list')} href='/admin/articles' />
						<SidebarNavItem name={__('Articles for approval')} href='/admin/articles/pending' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-simple-line-icons-home' name={__('Feedbacks')} href='/admin/feedback' />
				<SidebarNavItem glyph='icon-fontello-question' name={<span>{__('Online Consultation')}</span>}>
					<SidebarNav>
						<SidebarNavItem name={__("Free QA's")} href='/admin/freeqa' />
						<SidebarNavItem name={__("Chat Consult")} href='/admin/chat-consult' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-fontello-money' name={<span>{__('Payment Manager')}</span>}>
					<SidebarNav>
						<SidebarNavItem name={__("Chat Payments")} href='/admin/chatpayment' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-simple-line-icons-home' name={__('Job Posts')} href='/admin/job-post' />
				<SidebarNavItem glyph='icon-fontello-tag-2' name={<span>{__('Tags')}</span>}>
				 	<SidebarNav>
				 		<SidebarNavItem name={__('Tags')} href='/admin/tag' />
				 		<SidebarNavItem name={__('Map Tags')} href='/admin/map-tag' />
				 		<SidebarNavItem name={__('Tags for approval')} href='/admin/tags-for-approval' />
					 </SidebarNav>
				</SidebarNavItem>
				<SidebarNavItem glyph='icon-simple-line-icons-settings' name={<span>{__('Setting')}</span>}>
					<SidebarNav>
						<SidebarNavItem name={__('Role')} href='/admin/role' />
						<SidebarNavItem name={__('Country')} href='/admin/country' />
						<SidebarNavItem name={__('State')} href='/admin/state' />
						<SidebarNavItem name={__('City')} href='/admin/city' />
						<SidebarNavItem name={__('Commission Settings')} href='/admin/commission-setting' />
						<SidebarNavItem name={__('Subscription')} href='/admin/subscription' />
					</SidebarNav>
				</SidebarNavItem>
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