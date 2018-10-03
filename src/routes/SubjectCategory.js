import React from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import FilterButton from '../components/FilterButton'

import makeTranslater from '../translate';

import {makeApiData} from '../api';
import {
	getStatusLabel,
	getStatusIcon,
	getStatusTitle,
	getStatusOptions,
	renderFilterLabel,
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
} from '../components';

import url from 'url';

const viewName = 'subjectcategory';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.subjectcategory
}))
export default class SubjectCategory extends React.Component {
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
				event.target.getAttribute('data-item-status')
			)
		};

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

		this.permissions = {};
		if (this.props.session.modules.subjectcategory) {
			this.props.session.modules.subjectcategory.forEach(action => this.permissions[action] = true);
		}

		this.handleRemoveFilter = event => this.removeFilter(event.target.getAttribute('data-name'));
	}

	static fetchData(store) {
		return store.dispatch(
			actions.subjectcategory.init(
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
					<PanelContainer controls={false} className="overflow-visible module-container">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col md={6} className='fg-white'>
											<h3>{__('Sub Subjects')}</h3>
										</Col>
										<Col md={6} className='text-right'>
												{this.props.viewState === 'LIST' &&
													<h3>
														<FilterButton
																__={__}
																reset={::this.reset}
																overlay={this.renderFilters(__)}
																ref_el={el=> this.filterIcon = el} />
														{this.permissions.add &&
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
													</h3>
												}
												{this.props.viewState === 'DATA_FORM' &&
													<h3>
														<Button
															inverse
															outlined
															style={{marginBottom: 5}}
															bsStyle='default'
															onClick={::this.viewList}
														>
															{__('View List')}
														</Button>
													</h3>
												}
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
			<Row key="subjectcategory-list">
				<div className='filter-values'>
					{
						this.props.query.queryItems.map(
							item => renderFilterLabel(item, this.handleRemoveFilter)
						)
					}
				</div>
				<Col xs={12}>
					<Table condensed striped className='module-table'>
						<thead>
							<tr>
								<th>{__('S.No.')}</th>
								<th>{__('Name')}</th>
								<th>{__('Subject')}</th>
								<th>{__('Status')}</th>
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

	renderAdd(__) {
		return (
			<Row className='module-form'>
				<Col xs={12} md={8} lg={6}>
					<Form>
						<FormGroup
							controlId='name'
							validationState={this.props.errors.name ? 'error': null}
						>
							<ControlLabel>{__('Name')}</ControlLabel>
							<FormControl
								autoFocus
								type='text'
								placeholder={__('Name')}
								value={this.props.item.name}
								name='name'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.name}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='subjectId'
							validationState={this.props.errors.subjectId ? 'error': null}
						>
							<ControlLabel>{__('Subject')}</ControlLabel>
							<Select
								title={__('Subject')}
								name="subjectId"
								placeholder={__('Select Subject')}
								onChange={this.handleDataUpdate}
								value={this.props.item.subjectId || ''}
								options={this.props.helperData.subjects}
								className='form-control'
							/>
							<HelpBlock>{this.props.errors.subjectId}</HelpBlock>
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
						<Col md={12}>
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
		return (
			<tr key={item.id}>
				<td>{(this.props.pageInfo.currentPage - 1) * this.props.pageInfo.pageLimit + index + 1}</td>
				<td>{item.subjectcategorydetails[0].name}</td>
				<td>{item.subject.subjectdetails[0].name}</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					{	
						this.permissions.edit &&
						<Icon
							className={'fg-brown'}
							title={__('Edit')}
							style={{fontSize: 20}}
							glyph={'icon-simple-line-icons-note'}
							onClick={this.handleEdit}
							data-item-id={item.id}
						/>
					}
					{
						this.permissions.status &&
						<Icon
							className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
							title={getStatusTitle(item.is_active, __)}
							style={{fontSize: 20}}
							glyph={getStatusIcon(item.is_active)}
							onClick={this.handleState}
							data-item-id={item.id}
							data-item-status={item.is_active}
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

	renderFilters(__) {
		return (
			<Popover
				className='filter-popover'
				id='subjectcategory-filters'
				title={null}>
				<div>
					<FormControl
						type='text'
						title={__('Name') }
						placeholder={__('Name') }
						name='subjectcategorydetail__name'
						onChange={this.handleFilterUpdate}
						value={this.props.filter.subjectcategorydetail__name || ''}
					/>
				</div>
				<div>
					<FormControl
						type='text'
						title={__('Subject Name') }
						placeholder={__('Subject Name') }
						name='subjectdetail__name'
						onChange={this.handleFilterUpdate}
						value={this.props.filter.subjectdetail__name || ''}
					/>
				</div>
				<div>
					<Select
						title={__('Status')}
						name="subjectcategory__is_active"
						placeholder={__('Select Status')}
						onChange={this.handleFilterUpdate}
						value={this.props.filter.subjectcategory__is_active || ''}
						options={getStatusOptions(__)}
						className='form-control'
					/>
				</div>
				<div>
					<Button onClick={::this.search}>{__('Search')}</Button>
				</div>
			</Popover>
		)
	}

	removeFilter(name){
		this.props.dispatch({
			type: 'REMOVE_FILTERS',
			name
		});
		this.props.router.push('/subjectcategory');
	}

	updateFilter(name, value, label, valueLable) {
		this.props.dispatch({
			type: 'UPDATE_FILTER',
			name,
			value,
			label,
			valueLable
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

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	search() {
		$(ReactDOM.findDOMNode(this.filterIcon)).trigger('click');
		this.props.router.push('/subjectcategory');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/subjectcategory');
	}

	startAddNew() {
		this.props.dispatch(actions.subjectcategory.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.subjectcategory.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.subjectcategory.edit(this.props, itemId));
	}

	save() {
		this.props.dispatch(
			actions.subjectcategory.save(this.props, this.props.session.id)
		);
	}

	changeStatus(itemId, status, oldstatus) {
		this.props.dispatch(
			actions.subjectcategory.changeStatus(
				this.props,
				itemId,
				status,
				oldstatus
			)
		)
	}
}