import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../api/config';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import TextEditor from '../components/TextEditor';
import makeTranslater from '../translate';
import {getStatusLabel} from '../utils';

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
	Clearfix,
	Modal,
	BPanel
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'patient';

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
			actions.patient.init(
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
			type: 'UPDATE_PATIENT_MAIL_VALUE',
			name: event.target.name,
			value
		});
	};

	handleState = event => {
		this.props.dispatch(
			actions.patient.changeStatus(
				this.props,
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1'
			)
		)
	};

	handleView = event => {
		this.props.dispatch(
			actions.patient.viewDetails(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		)
	};

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
		this.props.router.push('/admin/patient');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/patient');
	}

	viewList() {
		this.props.dispatch(actions.patient.viewList())
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
		);
		switch(this.props.viewState) {
			case 'VIEW_DATA':
				content = this.renderView(__);
				break;
			default:
				content = this.renderList(__);
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
											<h3>{__("Patient")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
											<h3>
												{this.props.viewState === 'VIEW_DATA' &&
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

	renderList(__) {
		return (
			<Row key="patient-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'5%'}>{__('S No.')}</th>
								<th>{__('Name')}</th>
								<th>{__('City')}</th>
								<th>{__('Province')}</th>
								<th>{__('Phone')}</th>
								<th>{__('Email')}</th>
								<th>{__('Status')}</th>
								<th width={'9%'}>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('userdetail__fullname')}
										value={this.props.filter.userdetail__fullname || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('citydetail__name')}
										value={this.props.filter.citydetail__name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('statedetail__name')}
										value={this.props.filter.statedetail__name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('user__mobile')}
										value={this.props.filter.user__mobile || ''}
										placeholder={__('Mobile') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('user__email')}
										value={this.props.filter.user__email || ''}
										placeholder={__('Email') }
									/>
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('user__is_active')}
										value={this.props.filter.user__is_active || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Active')}</option>
										<option value='0'>{__('Inactive')}</option>
									</FormControl>
								</td>
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
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));

		return (
			<tr key={item.id}>
				<td>{count + ++index}</td>
				<td>{item.user.userdetails[0].fullname}</td>
				<td>{item.city ? item.city.citydetails[0].name:''}</td>
				<td>{item.state ? item.state.statedetails[0].name:''}</td>
				<td>{item.user.mobile}</td>
				<td>{item.user.email}</td>
				<td>{__(getStatusLabel(item.user.is_active, __))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-eye'}
						onClick={this.handleView}
						title={__('View')}
						data-item-id={item.id}
					/>
					<Icon
						className={item.user.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(item.user.is_active)}
						onClick={this.handleState}
						data-item-id={item.user.id}
						data-item-status={item.user.is_active}
						title={__('Status')}
					/>
				</td>
			</tr>
		)
	}

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={9}>{__('No data found')}</td>
			</tr>
		)
	}

	renderView(__) {
		let data = this.props.item,
			allergies = [], chronicDiseases = [], injuries = [], surgeries = [], smoking = '',
			alcohalConsumption = '', activityLevel = '', foodPerference = '', occupation = '';
			if(data.patienttags){
				data.patienttags.map(item => {
					if(item.tagtypeId === 13){
						allergies.push(item.tag.tagdetails[0].title);
					}
					if(item.tagtypeId === 7){
						chronicDiseases.push(item.tag.tagdetails[0].title);
					}
					if(item.tagtypeId === 14){
						injuries.push(item.tag.tagdetails[0].title);
					}
					if(item.tagtypeId === 15){
						surgeries.push(item.tag.tagdetails[0].title);
					}
					if(item.tagtypeId === 20){
						smoking = item.tag.tagdetails[0].title;
					}
					if(item.tagtypeId === 19){
						alcohalConsumption = item.tag.tagdetails[0].title;
					}
					if(item.tagtypeId === 18){
						activityLevel = item.tag.tagdetails[0].title;
					}
					if(item.tagtypeId === 17){
						foodPerference = item.tag.tagdetails[0].title;
					}
					if(item.tagtypeId === 16){
						occupation = item.tag.tagdetails[0].title;
					}
				});
			}
		return (
			<div>
				<BPanel
					className="panel-oc-setting"
					header={__("Personal Details")}>
					<Grid className='patient-detail'>
						<Row>
							<Col md={3} sm={6}>
								{__('Patient ID')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.id}
							</Col>
							<Col md={3} sm={6}>
								{__('Mobile')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.user ? data.user.mobile:''}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('Patient Name')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{(data.user && data.user.userdetails) ? data.user.userdetails[0].fullname:''}
							</Col>
							<Col md={3} sm={6}>
								{__('Email')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.user ? data.user.email:''}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('City')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{(data.city && data.city.citydetails) ? data.city.citydetails[0].name:''}
							</Col>
							<Col md={3} sm={6}>
								{__('Province')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{(data.state && data.state.statedetails) ? data.state.statedetails[0].name:''}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('Gender')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.gender}
							</Col>
							<Col md={3} sm={6}>
								{__('Date of Birth')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.dob ? moment(data.dob).format('YYYY-MM-DD'):''}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('Maritial Status')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.marital_status}
							</Col>
							<Col md={3} sm={6}>
								{__('Blood Group')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.blood_group}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('Height')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{
									data.height_feet ?
									data.height_feet+' '+ __('Feet')+' '+(data.height_inch ? data.height_inch+' '+__('Inch'):''):''
								}
							</Col>
							<Col md={3} sm={6}>
								{__('Emergency Contact')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.emergency_contact}
							</Col>
						</Row>
						<Row>
							<Col md={3} sm={6}>
								{__('Weight')}{': '}
							</Col>
							<Col md={3} sm={6}>
								{data.weight}
							</Col>
							<Col md={3} sm={6}></Col>
							<Col md={3} sm={6}></Col>
						</Row>
					</Grid>
				</BPanel>
				<BPanel
					className="panel-oc-setting"
					header={__("Health information")}>
					<Grid className='patient-detail'>
						<Row>
							<Col md={3}>
								{__('Allergies')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{allergies.join(', ')}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Current Medications')}
							</Col>
							<Col md={9} className='text-right'>
								{data.patientdetails.length > 0 ? data.patientdetails[0].current_medication:''}
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Past Medications')}
							</Col>
							<Col md={9} className='text-right'>
								{data.patientdetails.length > 0 ? data.patientdetails[0].past_medication:''}
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Chronic Diseases')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{chronicDiseases.join(', ')}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Injuries')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{injuries.join(', ')}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Surgeries')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{surgeries.join(', ')}</span>
							</Col>
						</Row>
					</Grid>
				</BPanel>
				<BPanel
					className="panel-oc-setting"
					header={__("Living Standard")}>
					<Grid className='patient-detail'>
						<Row>
							<Col md={3}>
								{__('Smoking')}
							</Col>
							<Col md={9} className='text-right'>
								{smoking}
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Alcohal Consumption')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{alcohalConsumption}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Activity Level')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{activityLevel}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Food Perference')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{foodPerference}</span>
							</Col>
						</Row>
						<Row>
							<Col md={3}>
								{__('Occupation')}
							</Col>
							<Col md={9} className='text-right'>
								<span className='tags'>{occupation}</span>
							</Col>
						</Row>
					</Grid>
				</BPanel>
			</div>
		);
	}
}

