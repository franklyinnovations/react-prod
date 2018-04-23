import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../../api/config';

import actions from '../../redux/actions';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import makeTranslater from '../../translate';
import {getJobStatusLabel} from '../../utils';

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	Clearfix
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'clinicjobpost';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class ClinicJobPost extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.clinicjobpost.init(
				store.getState()
			)
		);
	}

	handleDataUpdate = event => {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked;
		else
			value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_CLINIC_JOB_DATA_VALUE',
			name: event.target.name,
			value
		});
	};

	handleEdit = event => {
		this.props.dispatch(
			actions.clinicjobpost.edit(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		);
	};

	handlePublish = event => {
		this.props.dispatch(
			actions.clinicjobpost.jobPublish(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		)
	};

	handleView = event => {
		this.props.dispatch(
			actions.clinicjobpost.viewDetails(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		)
	};

	startAddNew() {
		this.props.dispatch({
			type: 'START_ADD_CLINIC_JOB'
		});
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	search() {
		this.props.router.push('/doh/job-post');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/doh/job-post');
	}

	viewList() {
		this.props.dispatch(actions.clinicjobpost.viewList())
	}

	save() {
		this.props.dispatch(actions.clinicjobpost.save(this.props, 1));
	}

	publish() {
		this.props.dispatch(actions.clinicjobpost.save(this.props, 2));
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-check';
			case 1:
				return 'icon-simple-line-icons-close';
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		),
		clinics = [];
		if(this.props.session.allHospitalProfiles){
			clinics = this.props.session.allHospitalProfiles.map(item => ({
				label: item.hospitaldetails[0].hospital_name,
				value: item.id
			}));
		}
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__, clinics);
				break;
			case 'VIEW_DATA':
				content = this.renderView(__);
				break;
			default:
				content = this.renderList(__, clinics);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__("Job Posts")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
											<h3>
												{
													this.props.viewState === 'LIST' &&
													<Button
														inverse
														outlined
														style={{marginBottom: 5}}
														bsStyle='default'
														onClick={::this.startAddNew}
													>
														{__('Add New')}
													</Button>
												}
												{(this.props.viewState === 'DATA_FORM' || this.props.viewState === 'VIEW_DATA') &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.viewList}
												>
													{__('View List')}
												</Button>}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderList(__, clinics) {
		return (
			<Row key="job-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'5%'}>{__('S No.')}</th>
								<th>{__('Job Id')}</th>
								<th>{__('Job Title')}</th>
								<th>{__('Clinic')}</th>
								<th>{__('No. Of Post')}</th>
								<th>{__('Status')}</th>
								<th className='text-center'>{__('Applied By')}</th>
								<th width={'9%'}>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobdetail__title')}
										value={this.props.filter.jobdetail__title || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<Select
										name="job__hospitalId"
										onChange={this.makeFilter('job__hospitalId')}
										value={this.props.filter.job__hospitalId || ''}
										options={clinics}
									/>
								</td>
								<td />
								<td>
									<Select
										name="job__is_active"
										onChange={this.makeFilter('job__is_active')}
										value={this.props.filter.job__is_active || ''}
										clearable={false}
										options={[{
											value: '',
											label: __('All')
										}, {
											value: '0',
											label: __('Inactive')
										},{
											value: 1,
											label: __('Drafts')
										}, {
											value: 2,
											label: __('Published')
										}]}
									/>
								</td>
								<td></td>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={::this.search}
									/>
									<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={::this.reset}
									/>
								</td>
							</tr>
						</thead>
						<tbody>
						{this.props.items.map(this.getDataRow, this)}
						{this.props.items.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	};

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));

		return (
			<tr key={item.id}>
				<td>{count + ++index}</td>
				<td>{item.id}</td>
				<td>{item.jobdetails[0].title}</td>
				<td>{item.hospital.hospitaldetails[0].hospital_name}</td>
				<td>{item.no_of_post}</td>
				<td>{__(getJobStatusLabel(item.is_active, __))}</td>
				<td className='text-center'>{item.totalapplication}</td>
				<td>
					{
						item.is_active !== 2 &&
						<Icon
							className={'fg-brown'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-note'}
							title={__('Edit')}
							onClick={this.handleEdit}
							data-item-id={item.id}
						/>
					}
					{
						item.is_active === 1 &&
						<Icon
							className={'fg-darkblue'}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-cloud-upload'}
							title={__('Publish')}
							onClick={this.handlePublish}
							data-item-id={item.id}
						/>
					}
					<Icon
						className={'fg-green'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-eye'}
						title={__('Publish')}
						onClick={this.handleView}
						data-item-id={item.id}
					/>
				</td>
			</tr>
		)
	};

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={9}>{__('No data found')}</td>
			</tr>
		)
	};

	renderAdd(__, clinics) {
		return (
			<div>
				<Row>
					<Col md={6}>
						<FormGroup
							controlId='title'
							validationState={this.props.errors.title ? 'error': null}
						>
							<ControlLabel>{__('Title')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Title')}
								value={this.props.item.title}
								name='title'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.title}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='hospitalId'
							validationState={this.props.errors.hospitalId ? 'error': null}
						>
							<ControlLabel>{__('Clinic')}</ControlLabel>
							<Select
								name="hospitalId"
								placeholder={__('Select Clinic')}
								onChange={this.handleDataUpdate}
								value={this.props.item.hospitalId}
								options={clinics}
							/>
							<HelpBlock>{this.props.errors.hospitalId}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<FormGroup
							controlId='designation'
							validationState={this.props.errors.designation ? 'error': null}
						>
							<ControlLabel>{__('Designation')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Designation')}
								value={this.props.item.designation}
								name='designation'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.designation}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='qualification'
							validationState={this.props.errors.qualification ? 'error': null}
						>
							<ControlLabel>{__('Qualification')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Qualification')}
								value={this.props.item.qualification}
								name='qualification'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.qualification}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='description'
							validationState={this.props.errors.description ? 'error': null}
						>
							<ControlLabel>{__('Description')}</ControlLabel>
							<FormControl
								componentClass='textarea'
								rows='5'
								type='text'
								placeholder={__('Description')}
								value={this.props.item.description}
								name='description'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.description}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<FormGroup
							controlId='experience'
							validationState={this.props.errors.experience ? 'error': null}
						>
							<ControlLabel>{__('Experience')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Experience')}
								value={this.props.item.experience}
								name='experience'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.experience}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='no_of_post'
							validationState={this.props.errors.no_of_post ? 'error': null}
						>
							<ControlLabel>{__('No. Of Post')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('No. Of Post')}
								value={this.props.item.no_of_post}
								name='no_of_post'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.no_of_post}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup
							controlId='key_skills'
							validationState={this.props.errors.key_skills ? 'error': null}
						>
							<ControlLabel>{__('Key Skills')}</ControlLabel>
							<FormControl
								componentClass='textarea'
								rows='5'
								type='text'
								placeholder={__('Key Skills')}
								value={this.props.item.key_skills}
								name='key_skills'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.key_skills}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<div className='text-center'>
							<Button
								outlined
								bsStyle='lightgreen'
								onClick={::this.save}>
								{__('Save')}
							</Button>{' '}
							<Button
								outlined
								bsStyle='lightgreen'
								onClick={::this.publish}>
								{__('Publish')}
							</Button>{' '}
							<Button
								outlined
								bsStyle='lightgreen'
								onClick={::this.viewList}>
								{__('Cancel')}
							</Button>
						</div>
						<br/>
					</Col>
				</Row>
			</div>
		)
	};

	renderView(__) {
		return (
			<Row>
				<Col md={12}>
					<Table bordered>
						<tbody>
							<tr>
								<td width='50%'>
									<strong>{__('Job Id')}</strong>: {this.props.item.id}
								</td>
								<td width='50%'>
									<strong>{__('Job Title')}</strong>: {this.props.item.title}
								</td>
							</tr>
							<tr>
								<td width='50%'>
									<strong>{__('Designation')}</strong>: {this.props.item.designation}
								</td>
								<td width='50%'>
									<strong>{__('Qualification')}</strong>: {this.props.item.qualification}
								</td>
							</tr>
							<tr>
								<td width='50%'>
									<strong>{__('Experience')}</strong>: {this.props.item.experience}
								</td>
								<td width='50%'>
									<strong>{__('No. Of Post')}</strong>: {this.props.item.no_of_post}
								</td>
							</tr>
							<tr>
								<td colSpan={2}><strong>{__('Description')}</strong>: {this.props.item.description}</td>
							</tr>
							<tr>
								<td colSpan={2}><strong>{__('Key Skills')}</strong>: {this.props.item.key_skills}</td>
							</tr>
						</tbody>
					</Table>
				</Col>
			</Row>
		);
	}
}

