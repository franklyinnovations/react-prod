import React from 'react';
import {connect} from 'react-redux';

import * as marksheets from '../marksheets';

import makeTranslater from '../translate';

import {
	dialog,
	bcsName,
	filterValue,
	moduleActions,
	getInputValue,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/marksheetbuilder';
import * as actions from '../redux/actions/marksheetbuilder';
addView('marksheetbuilder', reducer);


import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Alert,
	Modal,
	Button,
	Select,
	Loading,
	Checkbox,
	HelpBlock,
	DataTable,
	FormGroup,
	Pagination,
	FormControl,
	ClickButton,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class MarksheetBuilder extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'marksheetbuilder');
	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	update = event => this.props.dispatch(actions.update(
		event.currentTarget.getAttribute('data-action-type'),
		event.currentTarget.name,
		getInputValue(event.currentTarget),
	));
	save = () => this.props.dispatch(actions.save(this.props));
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	settings = event => this.props.dispatch(
		actions.settings(
			this.props,
			event.currentTarget.getAttribute('data-item-id'),
		)
	);
	remove = event => {
		let itemId = +event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			message: window.__('Are you absolutely sure you want to delete the marksheet template?'),
			callback: confirmed => confirmed &&
				this.props.dispatch(actions.remove(this.props, itemId))
		});
	};
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.getAttribute('data-item-status')
		)
	);
	viewList = () => this.props.router.push(this.props.router.location);
	gotIframe = el => this.iframe = el;
	refreshPreview = () => this.iframe.contentWindow.location.reload();
	updateSettings = event => this.props.dispatch(
		actions.updateSettings(
			event.currentTarget.name,
			getInputValue(event.currentTarget)
		)
	);
	saveSettings = () => {
		let {settings, errors} = marksheets[this.props.editor.template].validateSettings(
			this.props.editor.settings
		);
		if (errors)
			this.props.dispatch(actions.setEditorErrors(errors));
		else
			this.props.dispatch(actions.saveSettings(this.props, settings));
	};

	toggleFilters = () => {
		if (this.props.filters === null) {
			this.props.dispatch({
				type: 'SHOW_FILTERS',
				filters: filtersFromQuery(this.props.query)
			});
		} else {
			this.props.dispatch({
				type: 'HIDE_FILTERS',
			});
		}
	};
	search = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: queryFromFilters(this.props.filters),
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};
	reset = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [],
		});
		this.props.router.push(this.props.router.location);
	};
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState !== 'EDITOR') {
			let firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
			return (
				<React.Fragment>
					{
						firstTime ? <View>{this.renderFirstMessage()}</View> :
						<View
							search={this.props.query}
							filters={this.renderFilters(__)}
							actions={this.renderViewActions(__)}>
							{this.renderData(__)}
						</View>
					}
					<Modal
						onHide={this.hideDataModal}
						show={this.props.item !== false}>
						{
							this.props.item &&
							<Modal.Header closeButton>
								<Modal.Title>
									{
										this.props.item.id ?
										<Text>Edit Marksheet</Text> :
										<Text>Add Marksheet</Text>
									}
								</Modal.Title>
							</Modal.Header>
						}
						<Modal.Body>
							{this.props.item === null && <Loading/>}
							{
								this.props.item &&
								<React.Fragment>
									<FormGroup
										controlId='name'
										validationState={this.props.errors.name ? 'error': null}>
										<ControlLabel><Text>Name</Text></ControlLabel>
										<FormControl
											autoFocus
											type='text'
											name='name'
											onChange={this.update}
											placeholder={__('Name')}
											value={this.props.item.name}
											data-action-type='UPDATE_MSB_DATA'/>
										<HelpBlock>{this.props.errors.name}</HelpBlock>
									</FormGroup>
									<FormGroup
										controlId='bcsmaps'
										validationState={this.props.errors.hasBCSMaps ? 'error': null}>
										<ControlLabel><Text>Class</Text></ControlLabel>
										<Select
											multi
											name='bcsmaps'
											onChange={this.update}
											placeholder={__('Class')}
											value={this.props.item.bcsmaps}
											data-action-type='UPDATE_MSB_DATA'
											options={this.props.meta.bcsmaps}/>
										<HelpBlock>{this.props.errors.hasBCSMaps}</HelpBlock>
									</FormGroup>
									<FormGroup
										controlId='template'
										validationState={this.props.errors.template ? 'error': null}>
										<ControlLabel><Text>Template</Text></ControlLabel>
										<Select
											name='template'
											onChange={this.update}
											placeholder={__('Template')}
											disabled={!!this.props.item.id}
											value={this.props.item.template}
											data-action-type='UPDATE_MSB_DATA'
											options={this.props.meta.templates}/>
										<HelpBlock>{this.props.errors.template}</HelpBlock>
									</FormGroup>
									<Row>
										<Col xs={6}>
											<Checkbox
												name='is_active'
												onChange={this.updateData}
												value={this.props.item.is_active}>
												<ControlLabel><Text>Status</Text></ControlLabel>
											</Checkbox>
										</Col>
										<Col xs={6} className='text-right'>
											<Button
												bsStyle='primary'
												onClick={this.save}
												disabled={this.props.saving}>
												<Text>Submit</Text>
											</Button>
										</Col>
									</Row>
								</React.Fragment>
							}
						</Modal.Body>
					</Modal>
				</React.Fragment>
			);
		}
		return <View>{this.renderEditor()}</View>;
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Marksheet</Text></h3>
						<p>
							<Text>{'Create and Manage your school\'s mark-sheets templates as per your need. A complete customization of the mark-sheet template as per your need.'}</Text>
						</p>
					</Col>
				</Row>
				{
					this.permissions.add ?
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						onClick={this.startAdd}
						btnText='Add Marksheet'/> :
					<Alert bsStyle='danger'>
						<Text>You do not have permission to add new marksheet.</Text>
					</Alert>
				}
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<Select
					name='bcsmapId'
					title={__('Class')}
					onChange={this.updateFilter}
					placeholder={__('Select Class')}
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'bcsmapId', null)}/>
				<Select
					name='is_active'
					title={__('Status')}
					onChange={this.updateFilter}
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'is_active', null)}/>
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAdd}>
						<Text>Add New</Text>
					</View.Action>
				}
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'>
								<Text>Status</Text>
							</td>
							<td className='tw-35'>
								<Text>Classes</Text>
							</td>
							<td className='tw-35'>
								<Text>Name</Text>
							</td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows(__)}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={4}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						data-item-id={item.id}
						value={item.is_active}
						onChange={this.changeStatus}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						title={getStatusTitle(item.is_active, __)}/>
				</td>
				<td className='tw-35'>
					{item.bcsmaps.map(bcsmap => <div key={bcsmap.id}>{bcsName(bcsmap)}</div>)}
				</td>
				<td className='tw-35'>
					{item.name}
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Settings'
								glyph='fa-cogs'
								data-item-id={item.id}
								onClick={this.settings}/>
						}
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}

	renderEditor() {
		let Settings = marksheets[this.props.editor.template];
		return (
			<div id='marksheet-builder'>
				<div>
					<big><Text>Settings</Text></big>
					<br/><br/>
					<Settings updateSettings={this.updateSettings}/>
					<div>
						<Button
							bsStyle='primary'
							onClick={this.saveSettings}
							disabled={this.props.editor.saving}>
							<Text>Save</Text>
						</Button>
						{' '}
						{
							this.props.editor.preview &&
							<Button
								bsStyle='primary'
								onClick={this.refreshPreview}>
								<Text>Preview</Text>
							</Button>
						}
					</div>
				</div>
				<iframe
					ref={this.gotIframe}
					src={
						'/marksheet-download?preview=1&marksheetbuilderId=' +
						this.props.editor.id
					}>
					<Text>Unsupported Browser</Text>
				</iframe>
			</div>
		);
	}
}