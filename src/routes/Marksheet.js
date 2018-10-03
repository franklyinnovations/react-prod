import React from 'react';
import {connect} from 'react-redux';


import {
	messenger,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/marksheet';
import * as actions from '../redux/actions/marksheet';
addView('marksheet', reducer);

import {
	Row,
	Col,
	View,
	Text,
	Button,
	Select,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

import * as marksheets from '../marksheets';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Marksheet extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	changeBcsmap = event => this.props.dispatch(
		actions.changeBcsmap(this.props, event.currentTarget.value)
	);

	update = event => this.props.dispatch({
		type: 'UPDATE_MST_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value
	});

	generate = () => {
		let {bcsmapId, marksheetbuilderId} = this.props.selector;
		if (bcsmapId === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please select class'),
			});
			return;
		}
		if (marksheetbuilderId === null) {
			messenger.post({
				type: 'error',
				message: window.__('Please select marksheet'),
			});
			return;
		}
		this.props.dispatch(actions.loadCreator(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let
			Creator = this.props.creator.template && marksheets[this.props.creator.template].creator;
		return (
			<View>
				<Row>
					<Col md={6}>
						<FormGroup>
							<ControlLabel><Text>Class</Text></ControlLabel>
							<Select
								valueKey='id'
								labelKey='name'
								name='bcsmapId'
								onChange={this.changeBcsmap}
								value={this.props.selector.bcsmapId}
								options={this.props.meta.bcsmaps}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<ControlLabel><Text>Mark Sheet</Text></ControlLabel>
							<Select
								valueKey='id'
								labelKey='name'
								onChange={this.update}
								name='marksheetbuilderId'
								isLoading={this.props.meta.isLoading}
								options={this.props.meta.marksheetbuilders}
								value={this.props.selector.marksheetbuilderId}/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<ControlLabel><Text>Students</Text></ControlLabel>
					<Select
						multi
						valueKey='id'
						name='students'
						labelKey='fullname'
						onChange={this.update}
						options={this.props.meta.students}
						value={this.props.selector.students}
						isLoading={this.props.meta.isLoading}/>
				</FormGroup>
				<FormGroup>
					<Button
						bsStyle='primary'
						onClick={this.generate}>
						<Text>Generate</Text>
					</Button>
				</FormGroup>
				{this.props.creator.template === null && <Loading/>}
				{Creator && <Creator/>}
				<hr/>
				{
					this.props.creator.saved &&
					<React.Fragment>
						<a
							target='_blank'
							href={
								'/marksheet-download?bcsmapId=' + this.props.selector.bcsmapId
								+ '&marksheetbuilderId=' + this.props.selector.marksheetbuilderId
								+ '&students=' + this.props.selector.students.join(',')
							}
							className='btn btn-primary'
							onClick={this.download}><Text>View</Text></a>
						&nbsp;
						<a
							target='_blank'
							href={
								'/marksheet-pdf?bcsmapId=' + this.props.selector.bcsmapId
								+ '&marksheetbuilderId=' + this.props.selector.marksheetbuilderId
								+ '&students=' + this.props.selector.students.join(',')
							}
							className='btn btn-primary'
							onClick={this.download}><Text>Download</Text></a>
					</React.Fragment>
				}
			</View>
		);
	}
}
