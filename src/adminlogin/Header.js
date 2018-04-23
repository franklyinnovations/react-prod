import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { Link, withRouter } from 'react-router';

import l20n, { Entity } from '@sketchpixy/rubix/lib/L20n';

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
	Col } from '@sketchpixy/rubix';

export default class Header extends React.Component {
	render() {
		return (
			<div>
			<header className="main-header">
				<div className="front-container">
					<div className="row">
						<div className="col-md-3 col-sm-3 col-xs-12">
							<div className="logo"><a href="/"><img src="/imgs/common/logo1.png" alt="logo" /></a></div>
						</div>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<div className="menu f_right">
								<div className="menu-icon"><span></span></div>
								<div className="clearfix"></div>
								<ul className="main-menu">

									<li className="lang-tab"><a href="/setFrontLanaguage/en/1/English/lr" className="active">English</a><a href="/setFrontLanaguage/ar/2/Arabic/rl" className="">العربية</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>
				<div id="stop" className="scrollTop">
					<span><a href=""><i className="fa fa-chevron-up"></i></a></span>
				</div>
			</div>
		);
	}
}
