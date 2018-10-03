import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
	Table,
	Icon,
	Text,
	View,
	Button,
	Select,
	Loading,
	Modal,
	ProgressBar,
	Alert,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/teacherimport';
import * as actions from '../redux/actions/teacherimport';
addView('teacherimport', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class TeacherImport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	uploadXLSX = () => this.props.dispatch(
		actions.uploadXLSX()
	);

	handleUpdateCols = event => {
		let value = getInputValue(event.currentTarget);
		if(value !== 'ignore' && this.props.item.cols.indexOf(value) !== -1){
			vex.dialog.alert(window.__('One Data Field can not be mapped with multiple columns.'));
		}else{
			this.props.dispatch({
				type:'TI_COL_DATA_UPDATE',
				name:parseInt(event.currentTarget.name),
				value
			});
		}
	};

	discard = () => this.props.dispatch({
		type: 'TI_DISCARD_DATA'
	});

	save = () => {
		let checkMapped = true;
		this.props.item.cols.forEach(item =>{
			if(!item) checkMapped = false;
		});
		if(!checkMapped){
			vex.dialog.alert(window.__('Please map the column with data Fields.'));
		}else{
			this.props.dispatch(
				actions.save(this.props)
			);
		}

	};

	closeModal = () => this.props.dispatch({
		type: 'TI_CLOSE_RES_MODAL'
	});

	updateSubject = event => {
		this.props.dispatch({
			type: 'UPDATE_SUBJECT',
			index: event.currentTarget.getAttribute('data-index'),
			value: getInputValue(event.currentTarget),
		});
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
						<div className="text-danger">
							<strong><Text>Note</Text>-</strong>
							<ol>
								<li><Text>Please note that your excel file must have only one sheet and first row must be header row.</Text></li>
								<li><Text>Required Fields are - Name, Email, Mobile, Subjects.</Text></li>
							</ol>
						</div>
					</Col>
				</Row>
				{
					this.props.item.disableSelect ? this.renderMapRecord(__) :
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
				{
					this.props.importProgress &&
					<Modal
						show={this.props.importProgress?true:false}
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
									key={1}
								/>
								<ProgressBar
									bsStyle="danger"
									now={this.props.importProgress.pError}
									label={`${this.props.importProgress.pError}%`}
									key={2}
								/>
							</ProgressBar>
							<div style={{maxHeight:'300px', overflow: 'auto'}}>
								{
									this.props.importProgress.data.map((item, index)=>{
										return (
											item.status ?
											<Alert key={index} bsStyle='success'>
												<strong><Text>DONE</Text></strong>,{' '}
												<Text>Name</Text>:{' '}<strong>{item.name}</strong>
											</Alert>
											:
											<Alert key={index} bsStyle='danger'>
												<strong><Text>ERROR</Text></strong>,{' '}
												<Text>Name</Text>:{' '}<strong>{item.name}</strong>
												<ol>
													{
														item.errors.map((err, index2)=>{
															return (
																<li key={index2}>
																	<Text>{err.path}</Text>:{' '}<Text>{err.message}</Text>
																</li>
															);
														})
													}
												</ol>
											</Alert>
										);
									})
								}
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

			</React.Fragment>
		);
	}

	renderMapRecord(__){
		return(
			this.props.item.isLoading ? <Loading/> :
			<Row>
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								{this.props.item.data[0].map((cell, index)=>(
									index !== this.props.item.data[0].length - 1 &&
									<th key={index}>{cell}</th>
								))}
								<th>
									<Text>Map Subjects</Text>
									{' '}
									<Icon className='action-column-heading' glyph='fa-level-down-alt'/>
								</th>
							</tr>
							<tr>
								{this.props.item.data[0].map((cell, index)=>(
									index !== this.props.item.data[0].length - 1 &&
									<td key={index} style={{minWidth:'100px'}}>
										<Select
											className='form-control'
											placeholder={__('Select Field')}
											name={index.toString()}
											value={this.props.item.cols[index]}
											onChange={this.handleUpdateCols}
											options={this.props.item.fields}
										/>
									</td>
								))}
								<td>
								</td>
							</tr>
						</thead>
						<tbody>
							{this.props.item.data.map((row, index)=>(
								index !== 0 &&
								<tr key={index}>
									{row.map((cell, index)=>(
										index !== row.length - 1 &&
										<td key={index}>
											{cell}
										</td>
									))}
									<td className='tw-20'>
										<Select
											multi
											data-index={index}
											placeholder={__('Select Subjects')}
											value={row[row.length - 1]}
											onChange={this.updateSubject}
											options={this.props.meta.subjects}
										/>
									</td>
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
							{__('Submit')}
						</Button>{' '}
						<Button
							bsStyle='default'
							onClick={this.discard}>
							{__('Discard')}
						</Button>
					</div>
				</Col>
			</Row>
		);
	}
}