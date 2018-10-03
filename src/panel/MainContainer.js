import {connect} from 'react-redux';
import React from 'react';
import Header from './Header';
import Sidebar, {SubMenu, filterMenus, menus} from './Sidebar';
import Chat from './Chat';

@connect(state => ({modules: state.session.modules, user_type: state.session.user_type}))
export default class MainContainer extends React.Component {

	menus = filterMenus(menus, this.props.modules, this.props.user_type);

	render() {
		return (
			<div id='container'>
				<Header/>
				<main>
					<Sidebar menus={this.menus}/>
					<div id='body'>
						<SubMenu menus={this.menus}/>
						{this.props.children}
					</div>
				</main>
				<Chat/>
			</div>
		);
	}
}