import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	getStatusOptions,
	getStatusTitle,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
} from '../utils';

import {
	Row,
	Col,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	FormGroup,
	InputGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Modal,
	Loading,
	ClickButton,
	Pagination,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/subject';
import * as actions from '../redux/actions/subject';
addView('subject', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Subject extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = {
		subject: moduleActions(this.props.session.modules, 'subject'),
		subjectcategory: moduleActions(this.props.session.modules, 'subjectcategory'),
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

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

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

	startAdd = () => this.props.dispatch(actions.startAdd());

	hideDataModal = () => this.props.dispatch(actions.hideDataModal());

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				event.currentTarget.getAttribute('data-item-id'),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Subject and its Sub-Subjects?'),
		});
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	editSubjectCategories = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
			parseInt(event.currentTarget.getAttribute('data-item-type')),
		)
	);

	updateSubjectCategory = () => {
		let subName = this.props.item.subName.trim(), error = false;
		if (subName.length === 0) {
			error = window.__('This is required field.');
		} else if (subName.length > 200) {
			error = window.__('Length can not be more than 200.');
		} else if (this.props.item.subItems.find((subItem, index) => subName === subItem.name && index !== this.props.item.subIndex)){
			error = window.__('This is already exist.');
		}
		if (! error) {
			this.props.dispatch({
				type: 'UPDATE_SUBJECT_CATEGORY',
			});
		} else {
			this.props.dispatch({
				type: 'SET_SUBJECT_CATEGORY_ERROR',
				error,
			});
		}
	};

	editSubjectCategory = event => this.props.dispatch({
		type: 'EDIT_SUBJECT_CATEGORY',
		index: parseInt(event.currentTarget.getAttribute('data-item-index'))
	});

	changeSubjectCategoryStatus = event => this.props.dispatch({
		type: 'CHANGE_SUBJECT_CATEGORY_STATUS',
		index: parseInt(event.currentTarget.getAttribute('data-item-index'))
	});

	removeSubjectCategory = event => this.props.dispatch({
		type: 'REMOVE_SUBJECT_CATEGORY',
		index: parseInt(event.currentTarget.getAttribute('data-item-index')),
	});

	save = () => this.props.dispatch(actions.save(this.props));

	next = () => this.props.router.push('/activity');

	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
					this.props.query.length === 0 &&
					this.props.pageInfo.currentPage === 1;
		return (
			<React.Fragment>
				{
					firstTime ?
					<View>{this.renderFirstMessage()}</View> : 
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData(__)}
					</View>
				}
				<Modal
					bsSize={(this.props.item && !this.props.item.partial) ? 'lg' : undefined}
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									(
										this.props.item.partial ? (
											this.props.item.partial === 1 ?
											<Text>Add Sub Subjects</Text> :
											<Text>Edit Sub Subjects</Text> 
										) : (
											this.props.item.id ?
											<Text>Edit Subject & Sub Subject</Text> :
											<Text>Add Subject & Sub Subject</Text>
										)
									)
								}
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Row>
								{
									!this.props.item.partial &&
									<Col md={6}>
										<FormGroup
											controlId='name'
											validationState={this.props.errors.name ? 'error': null}>
											<ControlLabel><Text>Name</Text></ControlLabel>
											<FormControl
												autoFocus
												name='name'
												type='text'
												placeholder={__('Name')}
												value={this.props.item.name}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.name}</HelpBlock>
										</FormGroup>
										<FormGroup
											controlId='alias'
											validationState={this.props.errors.alias ? 'error': null}>
											<ControlLabel><Text>Short Name</Text></ControlLabel>
											<FormControl
												name='alias'
												type='text'
												placeholder={__('Short Name')}
												value={this.props.item.alias}
												onChange={this.updateData}/>
											<HelpBlock>{this.props.errors.alias}</HelpBlock>
										</FormGroup>
										<Checkbox
											name='is_active'
											onChange={this.updateData}
											value={this.props.item.is_active}>
											<ControlLabel><Text>Status</Text></ControlLabel>
										</Checkbox>
									</Col>
								}
								<Col md={this.props.item.partial ? 12 : 6}>
									<ControlLabel><Text>Sub Subjects</Text></ControlLabel>
									<FormGroup validationState={this.props.errors.subName ? 'error': null}>
										<InputGroup>
											<FormControl
												name='subName'
												type='text'
												placeholder={__('Name')}
												value={this.props.item.subName}
												onChange={this.updateData}/>
											<InputGroup.Addon onClick={this.updateSubjectCategory}>
												{
													this.props.item.subIndex === null ?
													<Text>Add</Text> : 
													<Text>UPDATE</Text>
												}
											</InputGroup.Addon>
										</InputGroup>
										<HelpBlock>{this.props.errors.subName}</HelpBlock>
									</FormGroup>
									<table className='table table-condensed table-bordered'>
										<thead className='bg-primary'>
											<tr>
												<th>#</th>
												<th><Text>Sub Subject Name</Text></th>
												<th><Text>Action</Text></th>
											</tr>
										</thead>
										<tbody>
											{
												this.props.item.subItems.map((subItem, index) =>
													<tr
														key={index}
														className={
															index === this.props.item.subIndex ? 'bg-info' : ''
														}>
														<td>{index+1}</td>
														<td>{subItem.name}</td>
														<td className='text-primary'>
															<Icon
																title={__('Edit')}
																glyph='fa-edit'
																data-item-index={index}
																onClick={this.editSubjectCategory}/>
															{' '}
															<Checkbox
																inline
																title={getStatusTitle(subItem.is_active, __)}
																onChange={this.changeSubjectCategoryStatus}
																data-item-index={index}
																value={subItem.is_active}/>
															{' '}
															<Icon
																title={__('Remove')}
																glyph='fa-trash'
																data-item-index={index}
																onClick={this.removeSubjectCategory}/>
														</td>
													</tr>
												)
											}
											{
												this.props.item.subItems.length === 0 &&
												<tr className='text-center'>
													<td colSpan='3'>
														<Text>No records found</Text>
													</td>
												</tr>
											}
										</tbody>
									</table>
								</Col>
								<Col xs={12}>
									<Button
										onClick={this.save}
										bsStyle='primary'>
										<Text>Submit</Text>
									</Button>
								</Col>
							</Row>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Subjects & Sub Subjects</Text></h3>
						<div>
							<Text>In this part of school setup, you will be creating all the running Subjects & their Sub Subjects.</Text>
						</div>
						<div>
							<b><Text>For Example</Text></b> - <Text>Hindi, English, Maths etc.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.subject.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Subjects & Sub Subjects'
						glyph='fa-plus'
						side='left'
						onClick={this.startAdd}/>
				}
			</div>
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
							<td className='tw-32'>
								<Text>Name</Text>
							</td>
							<td className='tw-15'>
								<Text>Short Name</Text>
							</td>
							<td className='tw-35'>
								<Text>Sub Subjects</Text>
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

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.subject.add &&
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

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}

		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						title={getStatusTitle(item.is_active, __)}
						onChange={this.changeStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
						disabled={!this.permissions.subject.status}
						value={item.is_active}/>
				</td>
				<td className='tw-32'>{item.subjectdetails[0].name}</td>
				<td className='tw-15'>{item.subjectdetails[0].alias}</td>
				<td className='tw-35'>
					{item.subjectcategories}
					&nbsp;
					<Icon
						data-item-id={item.id}
						className='text-primary'
						onClick={this.editSubjectCategories}
						data-item-type={item.subjectcategories ? 2 : 1}
						glyph={item.subjectcategories ? 'fa-edit' : 'fa-plus-square'}
						title={item.subjectcategories ? 'Edit Sub Subjects' : 'Add Sub Subjects'}/>
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.subject.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.subject.delete &&
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

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'name', '')} />
				<FormControl
					type='text'
					title={__('Short Name')}
					placeholder={__('Short Name')}
					name='alias'
					onChange={this.updateFilter}
					value={filterValue(filters, 'alias', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}
}