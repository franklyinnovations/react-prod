import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../../api/config';

import actions from '../../redux/actions';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import Datepicker from '../../components/Datepicker';
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

const viewName = 'clinicapplication';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class ClinicApplication extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.clinicapplication.init(
				store.getState()
			)
		);
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
		this.props.router.push('/doh/application');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/doh/application');
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
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
											<h3>{__("Applications")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
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
			<Row key="application-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'5%'}>{__('S No.')}</th>
								<th>{__('Job Id')}</th>
								<th>{__('Job Title')}</th>
								<th>{__('Name')}</th>
								<th>{__('Email')}</th>
								<th>{__('Location')}</th>
								<th>{__('Exp.')}</th>
								<th width={'8%'}>{__('Resume')}</th>
							</tr>
							<tr>
								<td></td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobapplication__jobId')}
										value={this.props.filter.jobapplication__jobId || ''}
										placeholder={__('Job Id') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobdetail__title')}
										value={this.props.filter.jobdetail__title || ''}
										placeholder={__('Job Title') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobapplication__name')}
										value={this.props.filter.jobapplication__name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobapplication__email')}
										value={this.props.filter.jobapplication__email || ''}
										placeholder={__('Email') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('jobapplication__location')}
										value={this.props.filter.jobapplication__location || ''}
										placeholder={__('Location') }
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
				<td>{item.jobId}</td>
				<td>{item.job.jobdetails[0].title}</td>
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
	};

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={9}>{__('No data found')}</td>
			</tr>
		)
	};
}

