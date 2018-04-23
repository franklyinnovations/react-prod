import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Loading from '../components/Loading';
import makeTranslater from '../translate';
import {getStatusLabel} from '../utils';
import { Link } from "react-router";

import {
	Row,
	Col,
	Icon,
	Grid,
	Clearfix
} from '@sketchpixy/rubix';

const viewName = 'dashboard';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class AdminPatient extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.dashboard.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Grid>
				<Row className="dashboard-tiles">
					<Tile
						title={__('TOTAL DOCTOR')}
						value={this.props.info.totalDoctors}
						color='#ffba03'
						link={'/admin/doctors'}
						icon={'icon-fontello-user-md'}/>
					<Tile
						title={__('TOTAL CLINIC')}
						value={this.props.info.totalHospital}
						color='#ffba03'
						link={'/admin/hospital'}
						icon={'icon-fontello-hospital'}/>
					<Tile
						title={__('TOTAL PATIENT')}
						value={this.props.info.totalPatient}
						color='#ab4f45'
						link={'/admin/patient'}
						icon={'icon-stroke-gap-icons-Users'}/>
					<Tile
						title={__('TOTAL LIVE DOCTOR')}
						value={this.props.info.totalLiveDoctors}
						color='#54b997'
						link={'/admin/doctors'}
						icon={'icon-fontello-user-md'}/>
					<Tile
						title={__('TOTAL LIVE CLINIC')}
						value={this.props.info.totalLiveHospital}
						color='#54b997'
						link={'/admin/hospital'}
						icon={'icon-fontello-hospital'}/>
					<Tile
						title={__('TOTAL USERS')}
						value={this.props.info.totalUsers}
						color='#00B8EB'
						link={''}
						icon={'icon-fontello-users-1'}/>
				</Row>
			</Grid>
		);
	}
}

function Tile({color, icon, value, title, link}) {
	return (
		<Col xs={12} sm={6} md={4} lg={4} style={{color}}>
			<div>
				<Col xs={4}>
					<Link style={{color: color}} to={link}>
						<Icon glyph={icon} style={{borderColor: color, backgroundColor: color + '21'}}/>
					</Link>
				</Col>
				<Col xs={8}>
					<div className='tile-value'>{value}</div>
				</Col>
				<Col xs={12}>
					<hr style={{backgroundColor: color}}/>
				</Col>
				<Col xs={12} className='tile-title'>
					<Link to={link}>{title}</Link>
				</Col>
				<Clearfix/>
			</div>
		</Col>
	);
}

