import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	filterValue,
	moduleActions,
	getInputValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/grade';
import * as actions from '../redux/actions/grade';
addView('grade', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Alert,
	Modal,
	Table,
	Button,
	Select,
	Loading,
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
export default class Grade extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'grade');
	startAdd = () => this.props.dispatch(actions.startAdd(this.props));
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);
	save = () => this.props.dispatch(actions.save(this.props));
	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Grades?'),
		});
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
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	addGrade = () => this.props.dispatch(actions.addGrade(this.props));
	removeGrade = () => this.props.dispatch({type: 'REMOVE_ADD_DATA'});

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
					bsSize='large'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Grade Definition</Text> :
									<Text>Add Grade Definition</Text>
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
									validationState={this.props.errors.bcsmaps ? 'error': null}>
									<ControlLabel><Text>Classes</Text></ControlLabel>
									<Select
										multi
										autoFocus
										name='bcsmaps'
										onChange={this.updateData}
										placeholder={__('Classes')}
										value={this.props.item.bcsmaps}
										options={this.props.meta.bcsmaps}/>
									<HelpBlock>{this.props.errors.bcsmaps}</HelpBlock>
								</FormGroup>
								<Table>
									<thead>
										<tr>
											<th className='tw-20'><Text>From Marks (%)</Text></th>
											<th className='tw-20'><Text>To Marks (%)</Text></th>
											<th className='tw-20'><Text>Grade</Text></th>
											<th className='tw-20'><Text>Result</Text></th>
											<th><Text>Actions</Text></th>
										</tr>
										<tr>
											<td className='tw-20 align-top'>
												<FormGroup controlId='start'>
													<FormControl
														disabled
														type='text'
														name='start'
														value={this.props.item.start}/>
													<HelpBlock/>
												</FormGroup>
											</td>
											<td className='tw-20 align-top'>
												<FormGroup
													controlId='end'
													validationState={this.props.errors.end ? 'error': null}>
													<FormControl
														min='0'
														max='100'
														name='end'
														type='number'
														onChange={this.updateData}
														value={this.props.item.end}/>
													<HelpBlock>{this.props.errors.end}</HelpBlock>
												</FormGroup>
											</td>
											<td className='tw-20 align-top'>
												<FormGroup
													controlId='grade'
													validationState={this.props.errors.grade ? 'error': null}>
													<FormControl
														type='text'
														name='grade'
														onChange={this.updateData}
														value={this.props.item.grade}/>
													<HelpBlock>{this.props.errors.grade}</HelpBlock>
												</FormGroup>
											</td>
											<td className='tw-20 align-top'>
												<FormGroup
													controlId='result'
													validationState={this.props.errors.result ? 'error': null}>
													<Select
														name='result'
														onChange={this.updateData}
														value={this.props.item.result}
														options={this.props.meta.tags}/>
													<HelpBlock>{this.props.errors.result}</HelpBlock>
												</FormGroup>
											</td>
											<td className='align-top'>
												<FormGroup>
													<Button title={__('Add')} onClick={this.addGrade}>
														<Icon glyph='fa-plus-circle'/>
													</Button>
													<HelpBlock/>
												</FormGroup>
											</td>
										</tr>
									</thead>
									<tbody>
										{
											this.props.item.data.map((item, index) =>
												<tr key={index}>
													<td className='tw-20'>
														{item.start}
													</td>
													<td className='tw-20'>
														{item.end}
													</td>
													<td className='tw-20'>
														{item.grade}
													</td>
													<td className='tw-20'>
														{item.result}
													</td>
													<td>
														{
															index + 1 === this.props.item.data.length &&
															<Button title={__('Delete')} onClick={this.removeGrade}>
																<Icon glyph='fa-trash'/>
															</Button>
														}
													</td>
												</tr>
											)
										}
									</tbody>
								</Table>
								{
									this.props.errors.data &&
									<Alert bsStyle='danger'>{this.props.errors.data}</Alert>
								}
								<div className='text-right'>
									<Button
										bsStyle='primary'
										onClick={this.save}>
										<Text>Submit</Text>
									</Button>
								</div>
							</React.Fragment>
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
						<h3><Text>Grade Definitions</Text></h3>
						<div>
							<Text>Define the rules for your school Grading system here. Define range of percentage and associate Grade with it.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Grade Definitions'
						onClick={this.startAdd}/>
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
					name='bcsMapId'
					title={__('Class')}
					onChange={this.updateFilter}
					placeholder={__('Select Class')}
					value={filterValue(filters, 'bcsMapId', null)}
					options={this.props.meta.allBcsmaps}/>
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
							<td className='tw-20'>
								<Text>Classes</Text>
							</td>
							<td className='tw-50'>
								<Text>Details</Text>
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

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-30'>
					{item.bcsmaps.map((bcsmap, index) => <div key={index}>{bcsmap}</div>)}
				</td>
				<td className='tw-50'>
					<Table condensed bordered>
						<tbody>
							<tr>
								<th className='tw-25'><Text>From (%)</Text></th>
								<th className='tw-25'><Text>To (%)</Text></th>
								<th className='tw-25'><Text>Grade</Text></th>
								<th className='tw-25'><Text>Result</Text></th>
							</tr>
							{
								item.data.map((grade, index) =>
									<tr key={index}>
										<td className='tw-25'>{grade.start}</td>
										<td className='tw-25'>{grade.end}</td>
										<td className='tw-25'>{grade.grade}</td>
										<td className='tw-25'>{grade.result}</td>
									</tr>		
								)
							}
						</tbody>
					</Table>
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
}