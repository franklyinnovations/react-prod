import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import FilterButton from '../components/FilterButton';
import makeTranslater from '../translate';

import {
	getInputValue,
	getStatusLabel,
	getStatusIcon,
	getStatusOptions,
	getStatusTitle,
	renderFilterLabel,
	dialog,
	getDate,
} from '../utils';

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
	Popover,
	Clearfix,
} from '../components';

import url from 'url';

const viewName = 'proxy';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class ProxyClass extends React.Component {
	constructor(props) {
		super(props);
		this.handleDataUpdate = event => {
			this.updateData(
				event.target.name,
				getInputValue(event.target)
			);
		};

		this.handleEdit = event => {
			this.edit(event.target.getAttribute('data-item-id'));
		};
		this.handleState = event => {
			this.changeStatus(
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
				event.target.getAttribute('data-item-status'),
			)
		};

		this.handleDelete = event => {
			let itemId = event.target.getAttribute('data-item-id');
			dialog.confirm({
				message: window.__('Are you absolutely sure to delete the proxy?'),
				callback: confirmed => {
					if(confirmed) {
						this.deleteItem(itemId);
					}
				}
			});
		};

		this.permissions = {};
		if (this.props.session.modules.proxy_classes) {
			this.props.session.modules.proxy_classes.forEach(action => this.permissions[action] = true);
		}

		this.handleFilterUpdate = event => {
			let value, valueLable;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;

			if(event.target.type === 'react-select')
				valueLable = event.target.optionLabel
			else
				valueLable = value
			this.updateFilter(event.target.name, value, event.target.title, valueLable);
		}
		this.handleRemoveFilter = event => this.removeFilter(event.target.getAttribute('data-name'));
	}

	static fetchData(store) {
		return store.dispatch(
			actions.proxy.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible module-container">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col md={12} className='fg-white'>
											<h3>{__('Proxy Manager')}</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{this.permissions.add && this.renderAdd(__)}
									{this.renderList(__)}
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
			<Row key="proxy-list" className='rubix-panel-header'>
				<Col xs={8}>
					<div className='filter-values' style={{top:'auto', padding:'unset'}}>
						{
							this.props.query.queryItems.map(
								item => renderFilterLabel(item, this.handleRemoveFilter)
							)
						}
					</div>
				</Col>
				<Col xs={4} className='text-right'>
					<h3 style={{marginBottom: '10px'}}>
						<FilterButton
							__={__}
							reset={::this.reset}
							overlay={this.renderFilters(__)}
							ref_el={el=> this.filterIcon = el} />
					</h3>
				</Col>
				<Col xs={12}>
					<Table condensed striped className='module-table'>
						<thead>
							<tr>
								<th>{__('S.No.')}</th>
								<th>{__('Class')}</th>
								<th>{__('Period')}</th>
								<th>{__('Teacher')}</th>
								<th>{__('Date')}</th>
								<th>{__('Actions')}</th>
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
		return (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.bcsmap.board.boarddetails[0].alias+' - '+item.bcsmap.class.classesdetails[0].name +' - '+ item.bcsmap.section.sectiondetails[0].name}</td>
				<td>{item.timetableallocation.period}</td>
				<td>{item.teacher.user.userdetails[0].fullname}</td>
				<td>{getDate(item.date)}</td>
				<td>
					{this.permissions.delete &&
							<Icon
								className={'fg-brown'}
								style={{fontSize: 20}}
								glyph={'icon-simple-line-icons-trash'}
								onClick={this.handleDelete}
								data-item-id={item.id}
								title={__('Remove')}
							/>
						}
				</td>
			</tr>
		)
	}


	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={5} className='text-center'>{__('No Result Found')}</td>
			</tr>
		)
	}

	renderAdd(__) {
		return (
			<Row className='module-form'>
				<Col xs={12}>
					<Form>
					<Row>
						<Col md={4}>
						<FormGroup
							controlId='bcsmapId'
							validationState={this.props.errors.bcsmapId ? 'error': null}
						>
							<ControlLabel>{__('Class')}</ControlLabel>
							<Select
								name="bcsmapId"
								className='form-control'
								placeholder={__('Select Class with Section')}
								onChange={this.handleDataUpdate}
								value={this.props.item.bcsmapId}
								options={this.props.helperData.bcsmap}
							/>
							<HelpBlock>{this.props.errors.bcsmapId}</HelpBlock>
						</FormGroup>
						</Col>
						<Col md={4}>
						<FormGroup
							controlId='timetableallocationId'
							validationState={this.props.errors.timetableallocationId ? 'error': null}
						>
							<ControlLabel>{__('Period')}</ControlLabel>
							<Select
								name="timetableallocationId"
								className='form-control'
								placeholder={__('Select Proxy for which Period Needed')}
								onChange={this.handleDataUpdate}
								value={this.props.item.timetableallocationId}
								options={this.props.helperData.period}
								isLoading={this.props.helperData.loadingPeriods}
							/>
							<HelpBlock>{this.props.errors.timetableallocationId}</HelpBlock>
						</FormGroup>
						</Col>
						<Col md={4}>
						<FormGroup
							controlId='teacherId'
							validationState={this.props.errors.teacherId ? 'error': null}
						>
							<ControlLabel>{__('Teacher')}</ControlLabel>
							<Select
								name="teacherId"
								className='form-control'
								placeholder={__('Select Available Teacher')}
								onChange={this.handleDataUpdate}
								value={this.props.item.teacherId}
								options={this.props.helperData.teacher}
								isLoading={this.props.helperData.loadingTeachers}
							/>
							<HelpBlock>{this.props.errors.teacherId}</HelpBlock>
						</FormGroup>
						</Col>
						</Row>
					</Form>
					<Clearfix/>
					<Row>
						<Col xs={12}>
							<div>
								<Button
									bsStyle='success'
									onClick={::this.save}>
									{__('Apply Proxy')}
									</Button>
							</div>
							<br/>
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}

	renderFilters(__) {
		return (
			<Popover
				className='filter-popover'
				id='curriculum-filters'
				title={null}>
					<div>
						<Select
							className='form-control'
							title={__('Class')}
							onChange={this.handleFilterUpdate}
							name='proxy_classes__bcsmapId__eq'
							placeholder={__('Select Class')}
							value={this.props.filter.proxy_classes__bcsmapId__eq || ''}
							options={this.props.helperData.bcsmap}
						/>
					</div>
					<div>
						<FormControl
							onChange={this.handleFilterUpdate}
							title={__('Period')}
							name='timetableallocation__period__eq'
							placeholder={__('Period')}
							value={this.props.filter.timetableallocation__period__eq || ''}
						/>
					</div>
				<div>
					<Button onClick={::this.search}>{__('Search')}</Button>
				</div>
			</Popover>
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

	updateData(name, value) {
		this.props.dispatch(actions.proxy.updateData(name, value));

		if (name === 'bcsmapId') {
			this.props.dispatch(
				actions.proxy.updateAvailablePeriod(
					this.props,
					value
				)
			);
		}

		if (name === 'timetableallocationId') {
			this.props.dispatch(
				actions.proxy.updateAvailableTeacher(
					this.props,
					value
				)
			);
		}
	}

	deleteItem(itemId) {
		this.props.dispatch(
			actions.proxy.deleteItem(
				this.props,
				itemId
			)
		)
	}

	save() {
		this.props.dispatch(actions.proxy.save(this.props, this.props.session.id));
	}

	search() {
		this.props.router.push('/proxy');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_PROXY_CLASS_FILTERS'
		});
		this.props.router.push('/proxy');
	}

	removeFilter(name){
		this.props.dispatch({
			type: 'REMOVE_PROXY_CLASS_FILTERS',
			name
		});
		this.props.router.push('/proxy');
	}

	updateFilter(name, value, label, valueLable) {
		this.props.dispatch({
			type: 'UPDATE_PROXY_CLASS_FILTER',
			name,
			value,
			label,
			valueLable
		});
	}
}

