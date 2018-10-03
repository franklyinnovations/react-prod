import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getInputValue,
	getDate
} from '../utils';

import {
	Row,
	Col,
	Table,
	Text,
	View,
	Button,
	Select,
	Loading,
	Modal,
	Alert,
	Form,
	FormGroup,
	ControlLabel,
	HelpBlock,
	ProgressBar,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentimport';
import * as actions from '../redux/actions/studentimport';
addView('studentimport', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class Studentimport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	uploadXLSX = () => this.props.dispatch(
		actions.uploadXLSX(this.props)
	);

	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: getInputValue(event.currentTarget),
	});

	handleUpdateCols = event => {
		let value = getInputValue(event.currentTarget);
		if(value !=='ignore' && this.props.item.cols.indexOf(value) !== -1){
			vex.dialog.alert(window.__('One Data Field can not be mapped with multiple columns.'));
		} else {
			this.props.dispatch({
				type: 'SI_COL_DATA_UPDATE',
				name: parseInt(event.currentTarget.name),
				value
			});
		}
	};

	discard = () => this.props.dispatch({
		type: 'SI_DISCARD_DATA'
	});

	closeModal = () => this.props.dispatch({
		type: 'SI_CLOSE_RES_MODAL'
	});

	save = () => {
		let checkMapped = true;
		this.props.item.cols.forEach(item => {
			if(!item) checkMapped = false;
		});
		if(!checkMapped) {
			vex.dialog.alert(window.__('Please map the column with data Fields.'));
		} else {
			this.props.dispatch(
				actions.save(
					this.props
				)
			);
		}
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);

		return(
			<React.Fragment>
				<View>
					{this.renderData(__)}
				</View>
			</React.Fragment>
		);
	}

	renderData(__){
		return(
			<React.Fragment>
				<Row>
					<Col xs={12}>
						{this.renderImport(__)}
					</Col>
					{
						this.props.importProgress &&
						<Modal
							show={this.props.importProgress ? true : false}
							bsSize='large'>
							<Modal.Header className='text-center'>
								<Modal.Title><Text>Import Progress</Text></Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Alert bsStyle="warning">
									<strong><Text>Warning</Text>:{' '}</strong> 
									<Text>Please do not close the window during importing data.</Text>
								</Alert>
								<ProgressBar active>
									<ProgressBar
										now={this.props.importProgress.pSuccess}
										label={`${this.props.importProgress.pSuccess}%`}
										key={1}/>
									<ProgressBar
										bsStyle="danger"
										now={this.props.importProgress.pError}
										label={`${this.props.importProgress.pError}%`}
										key={2}/>
								</ProgressBar>
								<div style={{maxHeight:'300px', overflow: 'auto'}}>
									{this.props.importProgress.data.map((item, index) => {
										return (
											item.status ?
											<Alert key={index} bsStyle='success'>
												<strong><Text>DONE</Text></strong>,{' '}
												<Text>enrollment_no</Text>:{' '}<strong>{item.enrollment_no}</strong>
											</Alert>
											:
											<Alert key={index} bsStyle='danger'>
												<strong><Text>ERROR</Text></strong>,{' '}
												<Text>enrollment_no</Text>:{' '}<strong>{item.enrollment_no}</strong>
												<ol>
													{item.errors.map((err, index2) => {
														return (
															<li key={index2}>{__(err.path)}:{' '}{err.message}</li>
														);
													})}
												</ol>
											</Alert>
										);
									})}
								</div>
							</Modal.Body>
							<Modal.Footer>
								<div className='text-center'>
									<Button
										bsStyle='primary'
										onClick={this.closeModal}
										disabled={
											(this.props.importProgress.percentage) !== 100 ? true : false
										}>
										{__((this.props.importProgress.percentage) !== 100 ? 'Importing' : 'DONE')}
									</Button>
								</div>
							</Modal.Footer>
						</Modal>
					}
				</Row>
			</React.Fragment>
		);
	}

	renderImport(__) {
		return (
			<div className='module-form module-padding'>
				<Form>
					<input type="hidden" name="roleId" value={this.props.item.roleId} />
					<Row key="studentimport-form">
						<Col md={4}>
							<FormGroup
								controlId='bcsMapId'
								validationState={this.props.errors.bcsMapId ? 'error': null}
							>
								<ControlLabel>{__('Class')}</ControlLabel>
								<Select
									className='form-control'
									name="bcsMapId"
									placeholder={__('Class')}
									onChange={this.updateData}
									value={this.props.item.bcsMapId}
									options={this.props.item.bcsmaps}
								/>
								<HelpBlock>{this.props.errors.bcsMapId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup
								controlId='academicSessionId'
								validationState={this.props.errors.academicSessionId ? 'error': null}
							>
								<ControlLabel>{__('Academic Session')}</ControlLabel>
								<Select
									className='form-control'
									name="academicSessionId"
									placeholder={__('Academic Session')}
									onChange={this.updateData}
									value={this.props.item.academicSessionId}
									options={this.props.item.academicSessions}
								/>
								<HelpBlock>{this.props.errors.academicSessionId}</HelpBlock>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup
								controlId='languageId'
								validationState={this.props.errors.languageId ? 'error': null}
							>
								<ControlLabel>{__('Language')}</ControlLabel>
								<Select
									className='form-control'
									name="languageId"
									placeholder={__('Language')}
									onChange={this.updateData}
									value={this.props.item.languageId}
									options={this.props.item.languages}
								/>
								<HelpBlock>{this.props.errors.languageId}</HelpBlock>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<div className="text-danger">
								<strong><Text>Note</Text>-</strong>
								<ol>
									<li><Text>Please note that your excel file must have only one sheet and first row must be header row.</Text></li>
									<li><Text>Required Fields are - Enrollment Number, Mother Name, Father Name, Student Name, Mobile, Gender (Male, Female), Date of Birth, Date of Admission, Father Contact, Nationality, Address, Communication Address.</Text></li>
								</ol>
							</div>
						</Col>
					</Row>
					{
						this.props.item.disableSelect ? this.renderMapRecord(__)  :
						<Row>
							<Col xs={12}>
								<div>
									<Button
										bsStyle='primary'
										onClick={this.uploadXLSX}
									>
										<Text>Browse File</Text>
									</Button>{' '}
									<span><Text>Only .xlsx files are allowed to upload</Text></span>
								</div>
								<br/>
							</Col>
						</Row>
					}
				</Form>
			</div>
		);
	}

	renderMapRecord(__){
		return (
			this.props.item.isLoading ? <Loading /> :
			<Row>
				<Col xs={12}>
					<Table condensed striped responsive style={{minHeight: '300px'}}>
						<thead>
							<tr key='si-header'>
								{this.props.item.data[0].map((cell, index) => (
									<th key={index}>{cell}</th>
								))}
							</tr>
							<tr key='selector-row'>
								{this.props.item.data[0].map((cell, index) => (
									<td key={index} style={{minWidth: '200px'}}>
										<Select
											className='form-control'
											name={index.toString()}
											placeholder={__('Select Field')}
											onChange={this.handleUpdateCols}
											value={this.props.item.cols[index]}
											options={this.props.item.fields}
										/>
									</td>
								))}
							</tr>
						</thead>
						<tbody>
							{this.props.item.data.map((row, index) => (
								index !== 0 &&
								<tr key={index}>
									{row.map((cell, index) => (
										<td key={index}>
											{cell instanceof Date ? getDate(cell) : cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
				<Col xs={12} className='text-center'>
					<div style={{marginTop: '10px'}}>
						<Button
							bsStyle='primary'
							onClick={this.save}>
							<Text>Submit</Text>
						</Button>{' '}
						<Button
							bsStyle='default'
							onClick={this.discard}>
							<Text>Discard</Text>
						</Button>
					</div>
				</Col>
			</Row> 
		);
	}
}
