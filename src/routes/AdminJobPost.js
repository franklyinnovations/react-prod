import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../api/config';
import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import Datepicker from '../components/Datepicker';
import makeTranslater from '../translate';
import {getJobStatusLabel} from '../utils';

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
	Well
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'adminjobpost';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class AdminJobPost extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.adminjobpost.init(
				store.getState()
			)
		);
	}

	handleStatus = event => {
		this.props.dispatch(
			actions.adminjobpost.handleStatus(
				this.props,
				event.target.getAttribute('data-item-id'),
				parseInt(event.target.getAttribute('data-item-status')),
			)
		)
	};

	handleView = event => {
		this.props.dispatch(
			actions.adminjobpost.viewDetail(
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
		this.props.router.push('/admin/job-post');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/job-post');
	}

	viewList() {
		this.props.dispatch(actions.adminjobpost.viewList())
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-cloud-upload';
			case 2:
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
			case 'VIEW_FORM':
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
											<h3>{__("Job Posts")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
											<h3>
												{this.props.viewState === 'VIEW_FORM' &&
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
			<Row key="job-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'5%'}>{__('S No.')}</th>
								<th>{__('Job Id')}</th>
								<th>{__('Clinic')}</th>
								<th>{__('Job Title')}</th>
								<th>{__('No. Of Posts')}</th>
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
										onChange={this.makeFilter('hospitaldetail__hospital_name')}
										value={this.props.filter.hospitaldetail__hospital_name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobdetail__title')}
										value={this.props.filter.jobdetail__title || ''}
										placeholder={__('Title') }
									/>
								</td>
								<td>
								</td>
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
				<td>{item.hospital.hospitaldetails[0].hospital_name}</td>
				<td>{item.jobdetails[0].title}</td>
				<td>{item.no_of_post}</td>
				<td>{__(getJobStatusLabel(item.is_active, __))}</td>
				<td className='text-center'>{item.totalapplication}</td>
				<td>
					<Icon
						className={'fg-green'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-eye'}
						title={__('View')}
						onClick={this.handleView}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 2 ? 'fg-danger':'fg-darkblue'}
						style={{fontSize: 20}}
						glyph={::this.getStatusIcon(item.is_active)}
						title={item.is_active === 2 ? __('Inactive'):__('Publish')}
						onClick={this.handleStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
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

	renderView(__) {
		let viewData = this.props.viewdetail;
		return (
			<div>
				<Row>
					<Col md={12}>
						<Table bordered>
							<tbody>
								<tr>
									<td width='50%'>
										<strong>{__('Job Id')}</strong>: {viewData.id}
									</td>
									<td width='50%'>
										<strong>{__('Clinic')}</strong>: {viewData.hospital.hospitaldetails[0].hospital_name}
									</td>
								</tr>
								<tr>
									<td width='50%'>
										<strong>{__('Job Title')}</strong>: {viewData.jobdetails[0].title}
									</td>
									<td width='50%'>
										<strong>{__('Applications Received')}</strong>: {viewData.jobapplications.length}
									</td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						{
							viewData.jobapplications.length !== 0 ?
							<Table condensed striped>
								<thead>
									<tr>
										<th width={'5%'}>{__('S No.')}</th>
										<th>{__('Name')}</th>
										<th>{__('Email')}</th>
										<th>{__('Location')}</th>
										<th>{__('Exp.')}</th>
										<th width={'9%'}>{__('Resume')}</th>
									</tr>
								</thead>
								<tbody>
									{
										viewData.jobapplications.map((item, index) => 
											<tr key={item.id}>
												<td>{index+1}</td>
												<td>{item.name}</td>
												<td>{item.email}</td>
												<td>{item.location}</td>
												<td>{item.experience}</td>
												<td>
													{
														item.doc_file && 
														<a href={imageUrl+'/'+item.doc_file} target='_blank'>
															<Icon
																className={'fg-green'}
																style={{fontSize: 20}}
																glyph={'icon-flatline-file'}
																title={__('View')}
															/>
														</a>
													}
												</td>
											</tr>
										)
									}
								</tbody>
							</Table>
							:
							<Well style={{marginTop: '10px'}} className='text-center'>{__('No Applications')}</Well>
						}
					</Col>
				</Row>
			</div>
		);
	}
}

