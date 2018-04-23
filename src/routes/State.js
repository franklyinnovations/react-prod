import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';

import makeTranslater from '../translate';

import {makeApiData} from '../api';

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
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'state';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class State extends React.Component {
	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.handleEdit = event => {
			this.edit(event.target.getAttribute('data-item-id'));
		};
		this.handleState = event => {
			this.changeStatus(
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
			)
		};
	}

	static fetchData(store) {
		return store.dispatch(
			actions.state.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__);
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
											<h3>{__('State')}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.startAddNew}
												>
													{__('Add New')}
												</Button>}
												{this.props.viewState === 'DATA_FORM' &&
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

			<Row key="state-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'6%'}>{__('S No.')}</th>
								<th>{__('Name')}</th>
								<th>{__('Alias')}</th>
								<th>{__('Code')}</th>
								<th>{__('Country')}</th>
								<th>{__('Status')}</th>
								<th>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
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
										onChange={this.makeFilter('state__alias')}
										value={this.props.filter.state__alias || ''}
										placeholder={__('Alias') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('state__code')}
										value={this.props.filter.state__code || ''}
										placeholder={__('Code') }
									/>
								</td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('countrydetail__name')}
										value={this.props.filter.countrydetail__name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('state__is_active')}
										value={this.props.filter.state__is_active || ''}
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

	renderAdd(__) {
		return (
			<Row>
				<Col xs={12} md={8} lg={6}>
					<Form>
						<FormGroup
							controlId='name'
							validationState={this.props.errors.name ? 'error': null}
						>
							<ControlLabel>{__('Name')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Name')}
								value={this.props.item.name}
								name='name'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.name}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='alias'
							validationState={this.props.errors.alias ? 'error': null}
						>
							<ControlLabel>{__('Alias')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Alias')}
								value={this.props.item.alias}
								name='alias'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.alias}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='code'
							validationState={this.props.errors.code ? 'error': null}
						>
							<ControlLabel>{__('Code')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Code')}
								value={this.props.item.code}
								name='code'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.code}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='countryId'
							validationState={this.props.errors.countryId ? 'error': null}
						>
							<ControlLabel>{__('Country')}</ControlLabel>
							<Select
								name="countryId"
								placeholder={__('Please Select')}
								onChange={this.handleDataUpdate}
								value={this.props.item.countryId}
								options={this.props.helperData.countries}
							/>
							<HelpBlock>{this.props.errors.countryId}</HelpBlock>
						</FormGroup>
						<FormGroup controlId='is_active'>
							<Checkbox
								name='is_active'
								onChange={this.handleDataUpdate}
								checked={this.props.item.is_active}
								>
								{__('Active')}
							</Checkbox>
						</FormGroup>
					</Form>
					<Row>
						<Col xs={12}>
							<div>
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.viewList}>
									{__('Cancel')}
								</Button>{' '}
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.save}>
									{__('Submit')}
								</Button>
							</div>
							<br/>
						</Col>
					</Row>
				</Col>
			</Row>
		)
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
				<td>{item.statedetails[0].name}</td>
				<td>{item.alias}</td>
				<td>{item.code}</td>
				<td>{item.country.countrydetails[0].name}</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						data-item-status={item.is_active}
					/>
				</td>
			</tr>
		)
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

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={7}>{__('No data found')}</td>
			</tr>
		)
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

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	search() {
		this.props.router.push('/admin/state');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/state');
	}

	startAddNew() {
		this.props.dispatch(actions.state.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.state.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.state.edit(this.props, itemId));
	}

	save() {
		this.props.dispatch(
			actions.state.save(this.props, this.props.session.id)
		);
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.state.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}
}
