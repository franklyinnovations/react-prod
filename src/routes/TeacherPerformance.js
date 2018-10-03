import React from 'react';
import {connect} from 'react-redux';

import {
	messenger,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/teacherperformance';
import * as actions from '../redux/actions/teacherperformance';
addView('teacherperformance', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Select,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	lang: state.lang,
	...state.view.state,
}))
export default class TeacherPerformance extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	update = event => this.props.dispatch({
		type: 'UPDATE_TPC_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value
	});

	load = event => {
		if (!this.props.selector.bcsMapId) {
			event.preventDefault();
			messenger.post({
				type: 'error',
				message: window.__('Please select class'),
			});
		}
	};

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				<Row>
					<Col md={6}>
						<FormGroup>
							<ControlLabel><Text>Select class</Text></ControlLabel>
							<Select
								name='bcsMapId'
								onChange={this.update}
								options={this.props.meta.bcsmaps}
								value={this.props.selector.bcsMapId}/>
						</FormGroup>
						<FormGroup>
							<a
								target='_blank'
								onClick={this.load}
								rel='noopener noreferrer'
								className='btn btn-primary'
								href={'/teacher-performance/' + this.props.selector.bcsMapId}>
								<Text>Download</Text>
							</a>
						</FormGroup>
					</Col>
				</Row>
			</View>
		);
	}
}
