import React from 'react';
import {Link, withRouter} from 'react-router';
import {Text} from '../components';

export function filterMenus (menus, modules, user_type) {
	let result = [];
	for (let i = 0; i < menus.length; i++) {
		let menu = menus[i];
		if (menu.children) {
			let children = menu.children,
				subMenus = [];

			for (let j = 0; j < children.length; j++)
				if (modules[children[j].module] && children[j].user_type.indexOf(user_type) !== -1) {
					if (children[j].action) {
						if (modules[children[j].module].indexOf(children[j].action) !== -1)
							subMenus.push(children[j]);
					} else {
						subMenus.push(children[j]);
					}
				}

			if (subMenus.length !== 0) {
				result.push({
					...menu,
					children: subMenus,
				});
			}
		} else if (modules[menu.module] && menu.user_type.indexOf(user_type) !== -1) {
			if (menu.action) {
				if (modules[menu.module].indexOf(menu.action) !== -1) {
					result.push(menu);	
				}
			} else {
				result.push(menu);
			}
		}
	}
	return result;
}

export const menus = [
	{
		icon: '/imgs/admin/dashboard.png',
		name: 'Dashboard',
		href: '/dashboard',
		module: 'dashboard',
		user_type: ['admin','institute','teacher','student'],
	},
	{
		icon: '/imgs/admin/feed.png',
		name: 'Feed',
		href: '/feed',
		module: 'feed',
		user_type: ['admin','institute','teacher','student'],
	},
	{
		icon: '/imgs/admin/institute.png',
		name: 'Institute',
		href: '/institute/setup',
		module: 'institute',
		user_type: ['admin'],
	},
	{
		icon: '/imgs/admin/my-class.png',
		name: 'My Classes',
		href: '/classes',
		module: 'teacherclasses',
		user_type: ['admin','institute','teacher'],
	},
	{
		icon: '/imgs/admin/my-student.png',
		name: 'My Student',
		href: '/my-student',
		module: 'mystudent',
		user_type: ['admin','institute','teacher'],
	},
	{
		icon: '/imgs/admin/school_setup.png',
		name: 'School Setup',
		href: '/setup',
		children: [
			{
				name: 'Academic Session',
				href: '/academicsession',
				module: 'academicsession',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Curriculum Type',
				href: '/curriculum',
				module: 'board',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Infrastructure',
				href: '/infrastructure',
				module: 'infrastructure',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Classes & Sections',
				href: '/bcsmap',
				module: 'bcsmap',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Subjects & Sub Subjects',
				href: '/subject',
				module: 'subject',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Activities',
				href: '/activity',
				module: 'activity',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Admission Form URL Genrator',
				href: '/admission-form',
				module: 'admissionform',
				user_type: ['admin','institute','teacher'],
			},
		]
	},
	{
		icon: '/imgs/admin/hrm.png',
		name: 'HRM',
		href: '/hrm',
		children: [
			{
				name:'User Roles',
				href: '/role',
				module: 'role',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Admin Users',
				href: '/user',
				module: 'user',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Teachers',
				href: '/teacher',
				module: 'teacher',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Import Teachers',
				href: '/teacher-import',
				module: 'teacher',
				action: 'import',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Leave Types',
				href: '/empleavetype',
				module: 'empleavetype',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Employee Leaves',
				href: '/empleave',
				module: 'empleave',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Employee Attendance',
				href: '/empattendance',
				module: 'empattendance',
				user_type: ['admin','institute','teacher'],
			}
		]
	},
	{
		icon: '/imgs/admin/timetable.png',
		name: 'Timetable',
		href: '/timetable/setup',
		module: 'timetable',
		user_type: ['admin','institute','teacher'],
	},
	{
		icon: '/imgs/admin/account-finance.png',
		name: 'Fees',
		href: '/finances',
		children: [
			{
				name: 'Fee Head',
				href: '/fee-head',
				module: 'feehead',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Fee Penalties',
				href: '/fee-penalty',
				module: 'feepenalty',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Fee Discounts',
				href: '/fee-discount',
				module: 'feediscount',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Fee-Class Mapping',
				href: '/fee',
				module: 'fee',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Fee Submission',
				href: '/fee-submission',
				module: 'feesubmission',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Challan',
				href: '/fee-challan',
				module: 'challan',
				user_type: ['admin','institute','teacher'],
			}
		]
	},
	{
		icon: '/imgs/admin/student-managment.png',
		name: 'Student Management',
		href: '/student',
		children: [
			{
				name: 'Student Admission',
				href: '/admission',
				module: 'student',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Import Students',
				href: '/studentimport',
				module: 'student',
				action: 'importdata',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Import Images',
				href: '/student-image-import',
				module: 'student',
				action: 'importimage',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Bulk Student Edit',
				href: '/studentbulkedit',
				module: 'studentbulkedit',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Transfer To Class',
				href: '/student-transfer',
				module: 'student',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Student Rollover',
				href: '/student-promotion',
				module: 'student',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Applied Leaves & Status',
				href: '/student-leave',
				module: 'studentleave',
				user_type: ['admin','institute','teacher'],
			}
		]
	},
	{
		icon: '/imgs/admin/student_attendance.png',
		name: 'Student Attendance',
		href: '/student-attendance',
		children: [
			{
				icon: '/imgs/admin/Attendance.png',
				name: 'Attendance',
				href: '/attendance',
				module: 'attendance',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Bulk Attendance',
				href: '/bulk-attendance',
				module: 'exambulkattendance',
				user_type: ['admin','institute','teacher'],
			}
		]
	},
	{
		icon: '/imgs/admin/transport.png',
		name: 'Transport',
		href: '/transport',
		children: [
			{
				name: 'Routes Management',
				href: '/transportroute',
				module: 'route',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Drivers-Helpers',
				href: '/transportemp',
				module: 'transportemp',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Vehicle Management',
				href: '/vehicle',
				module: 'vehicle',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Student Mapping',
				href: '/student-route',
				module: 'rvdhsmap',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Breakdown',
				href: '/breakdown',
				module: 'vehiclebreakdown',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Parents Vehicle Passes',
				href: '/parent-vehicle',
				module: 'parentvehicle',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Tracking',
				href: '/tracking',
				module: 'vehicle',
				user_type: ['admin','institute','teacher'],
			},
		]
	},
	{
		icon: '/imgs/admin/examination.png',
		name: 'Exam Settings',
		href: '/exam',
		children: [
			{
				name: 'Exam Groups',
				href: '/head',
				module: 'examhead',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Exam Schedule',
				href: '/schedule',
				module: 'examschedule',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Exam Syllabus',
				href: '/syllabus',
				module: 'syllabus',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Define Grades',
				href: '/grade',
				module: 'grade',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Exam Marks',
				href: '/mark',
				module: 'mark',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Activities Marks',
				href: '/activity-mark',
				module: 'activitymark',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Exam Paper',
				href: '/paper',
				module: 'exam_paper',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Question Bank',
				href: '/questions',
				module: 'question',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Upload Bulk Questions',
				href: '/upload-bulk-questions',
				module: 'question',
				action: 'add',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Question-Paper Mapping',
				href: '/map-paper-with-questions',
				module: 'exam_paper',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Marksheet Builder',
				href: '/marksheet-builder',
				module: 'marksheetbuilder',
				user_type: ['admin','institute','teacher'],
			},
		]
	},
	{
		icon: '/imgs/admin/assignments.png',
		name: 'Assignments',
		href: '/assignment/setup',
		module: 'assignment',
		user_type: ['admin','institute','teacher'],
	},
	{
		icon: '/imgs/admin/lms.png',
		name: 'LMS',
		href: '/lms',
		children: [
			{
				name: 'Chapter Management',
				href: '/chapter',
				module: 'lmschapter',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Study Material',
				href: '/study-material',
				module: 'lmsstudymaterial',
				user_type: ['admin','institute','teacher'],
			}
		]
	},
	{
		icon: '/imgs/admin/genaral-managment.png',
		name: 'General Management',
		href: '/general',
		children: [
			{
				name:'Manage Holidays',
				href: '/holiday',
				module: 'holiday',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Tag Management',
				href: '/tag',
				module: 'tag',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Event Management',
				href: '/event',
				module: 'event',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Circular Management',
				href: '/circular',
				module: 'circular',
				user_type: ['admin','institute','teacher'],
			},
			{
				name:'Complaint Management',
				href: '/complaints',
				module: 'complaints',
				user_type: ['admin','institute','teacher'],
				
			},
		]
	},
	{
		icon: '/imgs/admin/reports.png',
		name: 'Reports',
		href: '/reports',
		children: [
			{
				name: 'Greensheet',
				href: '/greensheet',
				module: 'greensheet',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Teacher Performance',
				href: '/teacher-performance',
				module: 'greensheet',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Teacher Schedule',
				href: '/teacher-schedule',
				module: 'timetable',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Assignment Details',
				href: '/assignment',
				module: 'assignment',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Employee Leaves',
				href: '/emp-leave',
				module: 'empleave',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Student Report',
				href: '/student',
				module: 'student',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Teacher Daily Report',
				href: '/class',
				module: 'classreport',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Mark Sheet',
				href: '/marksheet',
				module: 'marksheet',
				user_type: ['admin','institute','teacher'],
			},
			{
				name: 'Transfer Certificate',
				href: '/transfer-certificate',
				module: 'transcertfkt',
				user_type: ['admin','institute','teacher'],
			},
		]
	},
	{
		icon: '/imgs/admin/support.png',
		name: 'Customer Support',
		href: '/ticket',
		module: 'ticket',
		user_type: ['admin','institute','teacher'],
	},
	{
		icon: '/imgs/admin/settings.png',
		name: 'Settings',
		href: '/settings',
		children: [
			{
				name: 'Countries',
				href: '/country',
				module: 'country',
				user_type: ['admin'],
			},
			{
				name: 'States',
				href: '/state',
				module: 'state',
				user_type: ['admin'],
			},
			{
				name: 'Cities',
				href: '/city',
				module: 'city',
				user_type: ['admin'],
			},
			{
				name: 'Government Identity',
				href: '/govtidentity',
				module: 'govtidentity',
				user_type: ['admin'],
			},
			{
				name: 'Languages',
				href: '/language',
				module: 'language',
				user_type: ['admin'],
			},
			{
				name:'Contact Us',
				href: '/contact',
				module: 'contact',
				user_type: ['admin'],
			},
			{
				name:'Demo Requests',
				href: '/demorequest',
				module: 'demorequest',
				user_type: ['admin'],
			},
			{
				name:'Partner',
				href: '/partner',
				module: 'partner',
				user_type: ['admin'],
			},
			{
				name:'Deal Registration',
				href: '/dealregister',
				module: 'dealregistration',
				user_type: ['admin'],
			},
			{
				name: 'Email Provider',
				href: '/emailprovider',
				module: 'emailprovider',
				user_type: ['admin'],
			}
		]
	},
	{
		icon: '/imgs/admin/my-class.png',
		name: 'Classes',
		href: '/student-classes',
		module: 'studentclasses',
		user_type: ['student'],
	},
	{
		icon: '/imgs/admin/my-class.png',
		name: 'Leaves',
		href: '/student-leave',
		module: 'studentleave',
		user_type: ['student'],
	},
	{
		icon: '/imgs/admin/assignments.png',
		name: 'Assignments',
		href: '/student-assignment',
		module: 'assignment',
		action: 'view',
		user_type: ['student'],
	},
	{
		icon: '/imgs/admin/examination.png',
		name: 'Exams',
		href: '/student-exam',
		children: [
			{
				name: 'Exam Schedule',
				href: '/schedule',
				module: 'examschedule',
				action: 'view',
				user_type: ['student'],
			},
			/*{
				name: 'Exam Syllabus',
				href: '/student-syllabus',
				module: 'syllabus',
				action: 'view',
				user_type: ['student'],
			},
			{
				name: 'Exam Marks',
				href: '/student-mark',
				module: 'mark',
				action: 'view',
				user_type: ['student'],
			},
			{
				name: 'Activities Marks',
				href: '/student-activity-mark',
				module: 'activitymark',
				action: 'view',
				user_type: ['student'],
			},*/
		]
	},
	/*{
		icon: '/imgs/admin/Attendance.png',
		name: 'Attendance',
		href: '/student-attendance',
		module: 'attendance',
		action: 'view',
		user_type: ['student'],
	},
	{
		icon: '/imgs/admin/lms.png',
		name: 'LMS',
		href: '/lms/study-material',
		module: 'lmsstudymaterial',
		action: 'view',
		user_type: ['student'],
	},
	{
		icon: '/imgs/admin/genaral-managment.png',
		name: 'General',
		href: '/general',
		children: [
			{
				name:'Holidays',
				href: '/holiday',
				module: 'holiday',
				action: 'view',
				user_type: ['student'],
			},
			{
				name: 'Events',
				href: '/student-event',
				module: 'event',
				action: 'view',
				user_type: ['student'],
			},
			{
				name: 'Circulars',
				href: '/student-circular',
				module: 'circular',
				action: 'view',
				user_type: ['student'],
			},
			{
				name:'Complaints',
				href: '/student-complaints',
				module: 'complaints',
				action: 'view',
				user_type: ['student'],
			},
		]
	},*/
];

class SidebarLink extends React.Component {
	navigate = event => {
		event.preventDefault();
		event.stopPropagation();
		let menu = this.props.menu;
		this.props.router.push(
			menu.children ? (menu.href + menu.children[0].href) : menu.href
		);
	};

	render() {
		const menu = this.props.menu;
		return (
			<Link
				to={menu.href}
				onClick={this.navigate}
				activeClassName='active'>
				<img src={menu.icon}/>
				<div><Text>{menu.name}</Text></div>
			</Link>
		);
	}
}

@withRouter
export default class Sidebar extends React.Component {

	state = {
		hiddenMenuIndex: 0,
	};

	showMenu = event => $(event.currentTarget).addClass('active');
	hideMenu = event => {
		let target = $(event.currentTarget);
		setTimeout(() => target.removeClass('active'), 300);
	};
	setHiddenMenuIndex = () => {
		let menus = document.getElementById('sidebar').firstElementChild,
			rect = menus.getBoundingClientRect(),
			availableSpace = window.innerHeight - rect.bottom - 40;

		if (availableSpace >= 78 && this.state.hiddenMenuIndex < this.props.menus.length) {
			this.setState({
				hiddenMenuIndex: this.state.hiddenMenuIndex + 1,
			}, this.setHiddenMenuIndex);
		} else if (availableSpace < 0 && this.state.hiddenMenuIndex - 1 > 0) {
			this.setState({
				hiddenMenuIndex: this.state.hiddenMenuIndex - 1
			}, this.setHiddenMenuIndex);
		}
	};


	render () {
		let visibleMenus = [], hiddenMenus = [];

		for (let i = 0; i < this.state.hiddenMenuIndex; i++) {
			let menu = this.props.menus[i];
			visibleMenus.push(
				<SidebarLink key={menu.name} router={this.props.router} menu={menu}/>
			);	
		}

		let visibleMenu = null;

		for (let i = this.state.hiddenMenuIndex; i < this.props.menus.length; i++) {
			let menu = this.props.menus[i];
			if (this.props.router.isActive(menu.href)) visibleMenu = hiddenMenus.length;
			hiddenMenus.push(
				<SidebarLink key={menu.name} menu={menu} router={this.props.router}/>
			);
		}

		if (visibleMenu !== null) 
			visibleMenus.push(hiddenMenus.splice(visibleMenu, 1, visibleMenus.pop()));

		return (
			<div id='sidebar'>
				<div>{visibleMenus}</div>
				{
					hiddenMenus.length !== 0 &&
					<React.Fragment>
						<div tabIndex='1' onBlur={this.hideMenu} onFocus={this.showMenu}>
							<span/><span/><span/>
						</div>
						<div>{hiddenMenus}</div>
					</React.Fragment>
				}
			</div>
		);
	}

	componentDidMount() {
		this.setHiddenMenuIndex();
		$(window).on('resize', this.setHiddenMenuIndex);
	}

	componentWillUnmount() {
		$(window).off('resize', this.setHiddenMenuIndex);	
	}
}

@withRouter
export class SubMenu extends React.Component {
	render() {
		let activeMenu = this.props.menus.find(menu => this.props.router.isActive(menu.href));
		if (!activeMenu || !activeMenu.children) return null;
		return (
			<div id='sub-menu'>
				{
					activeMenu.children.map(menu =>
						<Link
							key={menu.name}
							className='btn btn-default'
							activeClassName='btn-primary'
							to={activeMenu.href + menu.href}>
							<Text>{menu.name}</Text>
						</Link>
					)
				}
			</div>
		);
	}
}
