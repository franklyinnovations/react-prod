import React from 'react';
import {connect} from 'react-redux';
import {IndexLink, Link} from 'react-router';
import {
	Icon,
	Image,
	MenuItem,
	FormControl,
	Dropdown,
} from '../components';
import makeTranslater from '../translate';

@connect(state => ({
	session: state.session,
	lang: state.lang,
	translations: state.translations,
}))
export default class Header extends React.Component {
	render () {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<header id='header'>
				<div className='pull-left'>
					<span id='menu-btn' onClick={toggleSidebar}>
						<i className='fa fa-bars' to='/'/>
					</span>
					<IndexLink to='/' id='logo'>
						<img src='/imgs/admin/logo.png'/>
					</IndexLink>
					<Link to='/profile' id='profile-name'>
						{this.props.session.userdetails.fullname}
					</Link>
				</div>
				<div className='pull-right'>
					{
						this.props.session.masterId !== 1 &&
						this.props.session.selectedSession &&
						<span id='session-name'>
							{__('Session')}: {this.props.session.selectedSession.academicsessiondetails[0].name}
						</span>
					}	
					{
						this.props.session.modules.chat &&
						<span id='chat-btn' onClick={toggleChat}>
							<i className='fa fa-comments'/>
						</span>
					}
					<Dropdown id="settings-btn" componentClass='span' pullRight onToggle={toggleSetting}>
						<Image bsRole='toggle' src='/imgs/admin/settings.png'/>
						<Dropdown.Menu>
							{
								this.props.session.languages.length > 1 &&
								<MenuItem key='lang-header' header>
									{__('Change Language')}
								</MenuItem>
							}
							{
								this.props.session.languages.length > 1 &&
								<MenuItem disabled>
									<FormControl
										componentClass='select'
										value={this.props.lang.id}
										onChange={changeLanguage}
										style={{margin: '8px 0'}}>
										{this.props.session.languages.map(renderLanguage)}
									</FormControl>
								</MenuItem>
							}
							{
								this.props.session.userdetails.academicSessions.length > 1 &&
								<MenuItem key='session-header' header>
									{__('Change Academic Session')}
								</MenuItem>
							}
							{
								this.props.session.userdetails.academicSessions.length > 1 &&
								<MenuItem disabled>
									<FormControl
										componentClass="select"
										onChange={changeSession}
										name='sessionId'
										value={this.props.session.selectedSession.id}
										style={{margin: '8px 0'}}>
										{
											this.props.session.userdetails.academicSessions.map(
												renderSession
											)
										}
									</FormControl>
								</MenuItem>
							}
							<MenuItem componentClass='div'>
								<Link to='/profile' className='btn pull-left'>{__('Profile')}</Link>
								<a onClick={logout} href='/logout' className='btn pull-right'>
									{__('Logout')}
								</a>
							</MenuItem>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</header>
		);
	}
}

function renderLanguage(language) {
	return (
		<option
			key={language.id}
			value={language.id}
			data-value={'/' + language.id + '/' + language.direction + '/' + language.code}>
			{language.name}
		</option>
	)
}

function renderSession(session) {
	return (
		<option key={session.id} value={session.id}>
			{session.academicsessiondetails[0].name}
		</option>
	);
}

function toggleSidebar() {
	$('#sidebar').toggleClass('open');
}

function changeLanguage(event) {
	window.location.href = '/setLanguage' + $(event.target).find(':selected').attr('data-value');
}

function changeSession(event) {
	window.location.href = `/setAcademicSession/${event.target.value}`;
}

function toggleChat() {
	$('#chat').toggleClass('open');
}

function toggleSetting() {
	$('#chat').removeClass('open');
}

function logout() {
	window.location.href = '/logout';
}
