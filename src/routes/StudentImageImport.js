import React from 'react';
import {connect} from 'react-redux';

import {
	View,
	Text,
	Panel,
	Alert,
	Button,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentimageimport';
import * as actions from '../redux/actions/studentimageimport';
addView('studentimageimport', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class StudentImageImport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	upload = () => {
		this.props.dispatch(
			actions.upload(
				this.props,
				new FormData(document.getElementById('sii-form')),
			),
		);
	};

	render() {
		return (
			<View>
				<Panel>
					<Panel.Heading>
						<Panel.Title>Import Student Images</Panel.Title>
					</Panel.Heading>
					<Panel.Body>
						<div className='text-danger'>
							<strong><Text>Note</Text>-</strong>
							<ol>
								<li><Text>Upload zip file containing images of students.</Text></li>
								<li><Text>Name of image file must be enrollment number of student.</Text></li>
								<li><Text>Please upload zip file only.</Text></li>
								<li><Text>File size should be less than 100MB</Text></li>
								<li><Text>Image size should be less than 1MB</Text></li>
							</ol>
						</div>
						<form id='sii-form'>
							<FormGroup>
								<input type='file' name='sii-file'/>
							</FormGroup>
							<Button
								bsStyle='primary'
								onClick={this.upload}
								disabled={this.props.results === null}>
								<Text>Upload</Text>
							</Button>
						</form>
					</Panel.Body>
				</Panel>
				{this.renderResults()}
			</View>
		);
	}

	renderResults() {
		if (this.props.results === null) return <Loading/>;
		if (!this.props.results) return null;
		if (this.props.results.length === 0)
			return (
				<Alert bsStyle='warning'>
					<Text>File is empty.</Text>
				</Alert>
			);
		return this.props.results.map((item, index) => 
			<Alert key={index} bsStyle={item.status ? 'success' : 'danger'}>
				{item.enrollment_no}:&nbsp;&nbsp;{item.message}
			</Alert>
		);
	}
}