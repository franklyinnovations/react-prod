import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getInputValue
} from '../utils';

import {
	getGender,
	getBloodGroup,
	getResCategory
} from '../utils/options';

import {
	Row,
	Col,
	Text,
	View,
	Alert,
	Button,
	FormGroup,
	ControlLabel,
	Select,
	Datepicker,
	Loading,
	Table,
	Panel,
	HelpBlock,
	Form
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentbulkedit';
import * as actions from '../redux/actions/studentbulkedit';
addView('studentbulkedit', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))

export default class StudentBulkEdit extends React.Component {

	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	handleDataUpdate = event => {
		let name = event.currentTarget.name,
			value = getInputValue(event.currentTarget);
		this.props.dispatch(
			actions.getStudents(this.props, name, value)
		);

	};

	handleFieldUpdate = event => {
		this.props.dispatch({
			type: 'UPDATE_SBE_UPDATE_FIELD_VALUE',
			name: event.currentTarget.name,
			value: getInputValue(event.currentTarget)
		});
	};

	handleCheckbox = event => {
		this.props.dispatch({
			type: 'SELECT_SBE_STUDENT',
			name: event.currentTarget.name,
			value: getInputValue(event.currentTarget)
		});		
	};

	edit = () => {
		let errors = {};
		if(this.props.item.bcsmapId === '' || this.props.item.bcsmapId === null){
			errors.bcsmapId = window.__('This is a required field.');
		}

		if(this.props.item.field.length === 0){
			errors.field = window.__('This is a required field.');
		}
		
		if(Object.keys(errors).length > 0){
			this.props.dispatch({
				type: 'SET_SEB_ERRORS',
				errors
			});
		} else {
			if(this.props.item.data && !this.props.item.data.some(item => item.selected)){
				this.props.dispatch({
					type: 'SET_SEB_ERRORS',
					errors
				});
				vex.dialog.alert(window.__('No one is selected.'));
			} else {
				this.props.dispatch({
					type: 'START_SBE_EDIT'
				});
			}
		}
	};
	
	saveEdit = () => {
		let data = new FormData(document.getElementById('studentbulkeditform'));
		this.props.dispatch(
			actions.save(this.props, data)
		);
	};

	reset = () => {
		this.props.dispatch({
			type: 'RESET_SBE_DATA'
		});
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState === 'EDIT') return this.renderEdit(__);

		return (
			<View>
				<Row key="studentimport-form">
					<Col md={4}>
						<FormGroup
							controlId='bcsmapId'
							validationState={this.props.errors.bcsmapId ? 'error': null}
						>
							<ControlLabel>{__('Class')}</ControlLabel>
							<Select
								className='form-control'
								name="bcsmapId"
								placeholder={__('Class')}
								onChange={this.handleDataUpdate}
								value={this.props.item.bcsmapId}
								options={this.props.item.bcsmaps}
								disabled={this.props.viewState === 'EDIT'? true:false}
							/>
							<HelpBlock>{this.props.errors.bcsmapId}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='fields'
							validationState={this.props.errors.field ? 'error': null}
						>
							<ControlLabel>{__('Select fields to be Edited')}</ControlLabel>
							<Select
								multi
								className='form-control'
								name="field"
								placeholder={__('Select fields to be Edited')}
								onChange={this.handleDataUpdate}
								value={this.props.item.field}
								options={this.props.item.fields}
								isLoading={this.props.item.isLoading}
								disabled={this.props.viewState === 'EDIT'? true:false}
							/>
							<HelpBlock>{this.props.errors.field}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={2}>
						<FormGroup>
							<Button
								style={{marginTop: '24px'}}
								bsStyle='primary'
								onClick={this.edit}
								disabled={this.props.viewState === 'EDIT'? true:false}>
								{__('Edit')}
							</Button>
						</FormGroup>
					</Col>
				</Row>	
				{this.renderList(__)}			
			</View>
		);
	}

	renderList() {
		if (this.props.item.data === null) return null;
		if (this.props.item.isLoading) return <Loading/>;
		return (
			<Panel>
				<Panel.Heading>
					<Text>Student List</Text>
				</Panel.Heading>
				<Panel.Body>
					<Row>
						<Col xs={12}>
							{
								this.props.item.data &&
								<Table condensed striped>
									<thead>
										<tr>
											<th className='tw-5'>
												<input
													checked={this.props.item.check_all || false}
													name='check_all'
													onChange={this.handleCheckbox}
													type="checkbox"/>
											</th>
											<th className='tw-5'><Text>S.No.</Text></th>
											<th className='tw-15'><Text>Enrollment No</Text></th>
											<th className='tw-15'><Text>Student Name</Text></th>
											<th className='tw-15'><Text>Father's Name</Text></th>
											<th className='tw-15'><Text>Mother's Name</Text></th>
											<th className='tw-15'><Text>Mobile</Text></th>
											<th className='tw-15'><Text>Email</Text></th>
										</tr>
									</thead>
									<tbody>
										{
											this.props.item.data.map((item, index) => (
												<tr key={item.id}>
													<td className='tw-5'>
														<input
															checked={item.selected  || false}
															name={index}
															onChange={this.handleCheckbox}
															type='checkbox'
															value={index}/>
													</td>
													<td className='tw-5'>{index+1}</td>
													<td className='tw-15'>{item.student.enrollment_no}</td>
													<td className='tw-15'>{item.student.user.userdetails[0].fullname}</td>
													<td className='tw-15'>{item.student.studentdetails[0].father_name}</td>
													<td className='tw-15'>{item.student.studentdetails[0].mother_name}</td>
													<td className='tw-15'>{item.student.user.mobile}</td>
													<td className='tw-15'>{item.student.user.email}</td>
												</tr>
											))
										}
									</tbody>
								</Table>
							}
							{
								this.props.item.data.length === 0 &&
								<Alert bsStyle='warning'>
									<Text>No record found</Text>
								</Alert>
							}
						</Col>
					</Row>
				</Panel.Body>
			</Panel>		
		);
	}

	renderEdit(__){
		let itemIndex = -1;
		return (
			<View>
				<Panel>
					<Panel.Heading>
						<Text>Bulk Student Edit</Text>
					</Panel.Heading>
					<Panel.Body>
						<Row key='sbe-edit'>
							<Col xs={12}>
								<Form id='studentbulkeditform'>
									<Table condensed striped responsive>
										<thead>
											<tr>
												<th style={{minWidth: '200px'}}>{__('Student Information')}</th>
												{
													this.props.item.field.map((item, index) => (
														<th key={index}>
															{this.props.item.fields.find(field => field.value === item).label}
														</th>
													))
												}
											</tr>
										</thead>
										<tbody>
											{
												this.props.item.data.map((stdata) => {
													stdata.selected && itemIndex++;
													return stdata.selected &&
													<tr key={stdata.id}>
														<td>
															<div>
																{__('Name')}{': '}{stdata.student.user.userdetails[0].fullname}
															</div>
															<div>
																{__('Father Name')}{': '}{stdata.student.studentdetails[0].father_name}
															</div>
															<div>
																{__('Enroll.No')}{': '}{stdata.student.enrollment_no}
															</div>
															{
																stdata.student &&
																<input 
																	type='hidden'
																	name={'student['+itemIndex+'][id]'}
																	value={stdata.student.id}/>
															}
															{
																stdata.student.user.userdetails &&
																<div>
																	<input 
																		type='hidden'
																		name={'userdetails['+itemIndex+'][id]'}
																		value={stdata.student.user.userdetails[0].id}/>
																	<input 
																		type='hidden'
																		name={'userdetails['+itemIndex+'][userId]'}
																		value={stdata.student.user.id}/>
																	<input 
																		type='hidden'
																		name={'userdetails['+itemIndex+'][languageId]'}
																		value={this.props.lang.id}/>
																</div>
															}
															{
																stdata.student.studentdetails &&
																<div>
																	<input 
																		type='hidden'
																		name={'studentdetails['+itemIndex+'][id]'}
																		value={stdata.student.studentdetails[0].id}/>
																	<input 
																		type='hidden'
																		name={'studentdetails['+itemIndex+'][studentId]'}
																		value={stdata.student.id}/>
																	<input 
																		type='hidden'
																		name={'studentdetails['+itemIndex+'][languageId]'}
																		value={this.props.lang.id}/>
																</div>
															}
															{
																stdata.student.user &&
																<input 
																	type='hidden'
																	name={'user['+itemIndex+'][id]'}
																	value={stdata.student.user.id}/>
															}
															{
																stdata &&
																<input 
																	type='hidden'
																	name={'studentrecord['+itemIndex+'][id]'}
																	value={stdata.id}/>
															}
														</td>
														{
															this.props.item.field.map((item, index1) => (
																<td key={index1} style={{minWidth: '200px'}}>
																	{this.renderInput(item, stdata, itemIndex, __)}
																</td>
															))
														}
													</tr>;
												})
											}
										</tbody>
									</Table>
								</Form>
							</Col>
						</Row>
						<Row>
							<Col xs={12} className='text-right' style={{marginTop: '24px'}}>
								<Button
									onClick={this.reset}
									disabled={this.props.saving}
								>
									{__('Cancel')}
								</Button>{' '}
								<Button
									bsStyle='primary'
									onClick={this.saveEdit}
									disabled={this.props.saving}
								>
									{__(this.props.saving ? 'Saving' : 'Submit')}
								</Button>
							</Col>
						</Row>
					</Panel.Body>
				</Panel>	
			</View>
		);
	}

	renderInput(item, stdata, index, __) {
		let field = this.props.item.fields.find(field => field.value === item),
			value = '',
			datafield = field.value.split(':');
		if(datafield[0] === 'studentdetails'){
			value = stdata.student.studentdetails[0][datafield[1]];
		} else if(datafield[0] === 'userdetails'){
			value = stdata.student.user.userdetails[0][datafield[1]];
		} else if(datafield[0] === 'student'){
			value = stdata.student[datafield[1]];
		} else if(datafield[0] === 'user'){
			value = stdata.student.user[datafield[1]];
		} else if(datafield[0] === 'studentrecord') {
			value = stdata[datafield[1]];
		}

		let fvalue = this.props.item.field_value[datafield[0]+'['+index+']['+datafield[1]+']'] !== undefined ? this.props.item.field_value[datafield[0]+'['+index+']['+datafield[1]+']'] : (value || '');

		if(datafield[1] === 'doa' || datafield[1] === 'dob' || datafield[1] === 'date_of_release' || datafield[1] === 'date_of_expiration') {
			return (
				<Datepicker
					placeholder={field.label}
					value={fvalue}
					onChange={this.handleFieldUpdate}
					name={datafield[0]+'['+index+']['+datafield[1]+']'}/>
			);
		} else if(datafield[1] === 'blood_group') {
			return (
				<Select
					className='form-control'
					name={datafield[0]+'['+index+']['+datafield[1]+']'}
					placeholder={__('Please Select Blood Group')}
					onChange={this.handleFieldUpdate}
					value={fvalue}
					options={getBloodGroup(__)}
				/>
			);
		} else if(datafield[1] === 'gender') {
			return (
				<Select
					className='form-control'
					name={datafield[0]+'['+index+']['+datafield[1]+']'}
					placeholder={__('Please Select Gender')}
					onChange={this.handleFieldUpdate}
					value={fvalue}
					options={getGender(__)}
				/>
			);
		} else if(datafield[1] === 'res_category') {
			return (
				<Select
					className='form-control'
					name={datafield[0]+'['+index+']['+datafield[1]+']'}
					placeholder={__('Please Select Category')}
					onChange={this.handleFieldUpdate}
					value={fvalue}
					options={getResCategory(__)}
				/>
			);
		} else if (datafield[1] === 'health_issue_detail') {
			return (
				<React.Fragment>
					<input
						type='hidden'
						value={!fvalue.trim() ? '0' : '1'}
						name={'student['+index+'][is_health_issue]'}/>
					<input 
						name={datafield[0]+'['+index+']['+datafield[1]+']'}
						placeholder={field.label}
						className='form-control'
						value={fvalue}
						onChange={this.handleFieldUpdate}
						type={field.type}/>
				</React.Fragment>
			);
		}else if (datafield[1] === 'allergies_detail') {
			return (
				<React.Fragment>
					<input
						type='hidden'
						value={!fvalue.trim() ? '0' : '1'}
						name={'student['+index+'][is_allergies]'}/>
					<input 
						name={datafield[0]+'['+index+']['+datafield[1]+']'}
						placeholder={field.label}
						className='form-control'
						value={fvalue}
						onChange={this.handleFieldUpdate}
						type={field.type}/>
				</React.Fragment>
			);
		}else if (datafield[1] === 'medicine_detail') {
			return (
				<React.Fragment>
					<input
						type='hidden'
						value={!fvalue.trim() ? '0' : '1'}
						name={'student['+index+'][is_medicine]'}/>
					<input 
						name={datafield[0]+'['+index+']['+datafield[1]+']'}
						placeholder={field.label}
						className='form-control'
						value={fvalue}
						onChange={this.handleFieldUpdate}
						type={field.type}/>
				</React.Fragment>
			);
		}else if (datafield[1] === 'asthma_detail') {
			return (
				<React.Fragment>
					<input
						type='hidden'
						value={!fvalue.trim() ? '0' : '1'}
						name={'student['+index+'][is_asthma]'}/>
					<input 
						name={datafield[0]+'['+index+']['+datafield[1]+']'}
						placeholder={field.label}
						className='form-control'
						value={fvalue}
						onChange={this.handleFieldUpdate}
						type={field.type}/>
				</React.Fragment>
			);
		}else if (datafield[1] === 'disability_detail') {
			return (
				<React.Fragment>
					<input
						type='hidden'
						value={!fvalue.trim() ? '0' : '1'}
						name={'student['+index+'][is_disability]'}/>
					<input 
						name={datafield[0]+'['+index+']['+datafield[1]+']'}
						placeholder={field.label}
						className='form-control'
						value={fvalue}
						onChange={this.handleFieldUpdate}
						type={field.type}/>
				</React.Fragment>
			);
		} else {
			return (
				<input 
					name={datafield[0]+'['+index+']['+datafield[1]+']'}
					placeholder={field.label}
					className='form-control'
					value={fvalue}
					onChange={this.handleFieldUpdate}
					type={field.type}/>
			);
		}
	}
}
