import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import actions from '../redux/actions';
import { Link, withRouter } from 'react-router';
import makeTranslater from '../translate';

import {connect} from 'react-redux';

import {
	Label,
	SidebarBtn,
	Dispatcher,
	NavDropdown,
	NavDropdownHover,
	Navbar,
	Nav,
	NavItem,
	MenuItem,
	Badge,
	Button,
	Icon,
	Grid,
	Row,
	Radio,
	FormControl,
	FormGroup,
	ControlLabel,
	Col } from '@sketchpixy/rubix';

@connect(state => ({
	session: state.session
}))
class Brand extends React.Component {
	render() {
		return (
			<Navbar.Header >
				<div className="profile-info">
					<span style={{
						top: 23,
						fontSize: 16,
						lineHeight: 1,
						position: 'relative'
					}}>
						{this.props.session.user_type !== "admin" ? this.props.session.userdetails.fullname : null}
					</span>
				</div>
			</Navbar.Header>
		);
	}
}

@withRouter
@connect(state => ({
	session: state.session,
	lang: state.lang
}))
class HeaderNavigation extends React.Component {
	openAccountSettings = () => {
		switch (this.props.session.user_type) {
			case 'doctor':
				this.props.router.push('/doctor/account');
				break;
			case 'hospital':
				this.props.router.push('/hospital/account');
				break;
			case 'admin':
				this.props.router.push('/admin/account');
				break;
			case 'doctor_clinic_both':
				this.props.router.push('/doctor/account');
		}
	};

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Nav pullRight>
				{
					this.props.session.user_type == 'hospital' && this.props.session.allHospitalProfiles!= null && this.props.session.allHospitalProfiles.length > 1 &&
					<NavItem>
						<Grid>
							<Row>
								<Col xs={12}>
									<span style={{fontSize: '20px'}}>{__('Switch Clinic')} &nbsp;</span>
									<FormControl
										componentClass="select"
										onChange={::this.handleHospitalProfileChange}
										name='hospitalId'
										value={this.props.session.associatedProfileData.id}
										style={{width: '200px', display: 'inline'}}
									>
										{this.props.session.allHospitalProfiles.map(this.createHospitalMenuItem, this)}
									</FormControl>
								</Col>
							</Row>
						</Grid>
					</NavItem>
				}
				<Nav>
					<NavDropdownHover
						id="lang-selection"
						noCaret
						title={this.props.lang.code}
						className='header-menu'
						onSelect={::this.handleLangChange}>
						<MenuItem key='flag-header' header>Please select language</MenuItem>
						{this.props.session.languages.map(this.createLanguageMenuItem, this)}
					</NavDropdownHover>
					<NavDropdownHover
						noCaret
						className='logout'
						id="settings"
						title={<Icon glyph='icon-fontello-cog-5' style={{color: 'white'}}/>}>
						<MenuItem className='text-right' onSelect={this.openAccountSettings}>{__('Account Settings')}</MenuItem>
						<MenuItem className='text-right' href='/logout'>{__('Logout')}</MenuItem>
					</NavDropdownHover>
				</Nav>
			</Nav>
		);
	}

	handleLangChange(language) {
		window.location.href = '/setLanguage/' + language.id 
			+ '/' + language.direction 
			+ '/' + language.code;
	}

	createLanguageMenuItem(language) {
		return (
			<MenuItem
				key={language.id}
				eventKey={language}
				active={this.props.lang.id === language.id}>
				<Grid>
					<Row>
						<Col xs={12}>
							{language.name}
						</Col>
					</Row>
				</Grid>
			</MenuItem>
		)
	}

	handleHospitalProfileChange(event) {
		window.location.href = `/setHospital/${event.target.value}`;
	}
	createHospitalMenuItem(hospitalProfile) {
		return (
			<option key={hospitalProfile.id} value={hospitalProfile.id}>
				{hospitalProfile.hospitaldetails[0].hospital_name}
			</option>
		);
	}
}

export default class Header extends React.Component {
	render() {
		return (
			<Grid id='navbar' {...this.props}>
				<Row>
					<Col xs={12}>
						<Navbar fixedTop fluid id='rubix-nav-header'>
							<Row>
								<Col xs={3} visible='xs'>
									<SidebarBtn />
								</Col>
								<Col xs={6} sm={4}>
									<Brand />
								</Col>
								<Col xs={3} sm={8} collapseRight className='text-right'>
									<HeaderNavigation />
								</Col>
							</Row>
						</Navbar>
					</Col>
				</Row>
			</Grid>
		);
	}
}
