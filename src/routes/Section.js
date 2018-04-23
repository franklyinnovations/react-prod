import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

import makeTranslater from '../translate';

import {makeApiData} from '../api';

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

const viewName = 'section';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.section
}))
export default class Section extends React.Component {
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

		this.handleDataUpdate = ::this.handleDataUpdate;
		this.handleEdit = ::this.handleEdit;
		this.handleState = ::this.handleState;
	}

	static fetchData(store) {
		return store.dispatch(
			actions.section.init(
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
				content = this.renderList();
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false}>
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Section')}</h3>
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
			<Row key="section-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Display Order</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
							<tr>
								<th></th>
								<th>
									<FormControl
										type='text'
										onChange={this.makeFilter('sectiondetail__name')}
										value={this.props.filter.sectiondetail__name || ''}
									/>
								</th>
								<th>
									<FormControl
										type='text'
										onChange={this.makeFilter('section__display_order')}
										value={this.props.filter.section__display_order || ''}
									/>
								</th>
								<th>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('section__is_active')}
										value={this.props.filter.section__is_active || ''}
									>
										<option value=''>All</option>
										<option value='1'>Active</option>
										<option value='0'>Inactive</option>
									</FormControl>
								</th>
								<th>
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
								</th>
							</tr>
						</thead>
						<tbody>
						{this.props.sections.map(this.getDataRow, this)}
						{this.props.sections.length === 0 && this.getNoDataRow()}
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
								autoFocus
								type='text'
								placeholder={__('Name')}
								value={this.props.section.name}
								name='name'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.name}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='display_order'
							validationState={this.props.errors.display_order ? 'error': null}
						>
							<ControlLabel>{__('Display Order')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Display Order')}
								value={this.props.section.display_order}
								name='display_order'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.display_order}</HelpBlock>
						</FormGroup>
						<FormGroup controlId='is_active'>
							<Checkbox
								name='is_active'
								onChange={this.handleDataUpdate}
								checked={this.props.section.is_active}
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

	getDataRow(section, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<tr key={section.id}>
				<td>{index+1}</td>
				<td>{section.sectiondetails[0].name}</td>
				<td>{section.display_order}</td>
				<td>{__(this.getStatusText(section.is_active))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						data-item-id={section.id}
					/>
					<Icon
						className={section.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(section.is_active)}
						onClick={this.handleState}
						data-item-id={section.id}
						data-item-status={section.is_active}
					/>
				</td>
			</tr>
		)
	}

	getStatusText(status) {
		switch(status) {
			case 0:
				return 'Inactive';
			case 1:
				return 'Active';
			case -1:
				return 'Updating';
		}
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
				<td colSpan={5}>No data found</td>
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
		this.props.router.push('/section');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/section');
	}

	startAddNew() {
		this.props.dispatch(actions.section.startAdd());
	}

	viewList() {
		this.props.dispatch(actions.section.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.section.edit(this.props, itemId));
	}

	save() {
		this.props.dispatch(
			actions.section.save(this.props, this.props.session.id)
		);
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.section.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}
}

