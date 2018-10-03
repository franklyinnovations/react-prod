import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/tag';
import * as actions from '../redux/actions/tag';
addView('tag', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
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
export default class Tag extends React.Component{
	static fetchData(store){
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'tag');
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

	startAdd = () => this.props.dispatch({
		type: 'START_ADD_TAG',
		data: {
			title: '',
			type: null,
			description: '',
			is_active: 1,
		},
	});
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	save = () => this.props.dispatch(actions.save(this.props));
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
			+event.currentTarget.getAttribute('data-item-status'),
		)
	);

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
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								{
									this.props.item.id ?
									<Text>Edit Tag</Text> :
									<Text>Add Tag</Text>
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
									controlId='title'
									validationState={this.props.errors.title ? 'error': null}>
									<ControlLabel><Text>Title</Text></ControlLabel>
									<FormControl
										autoFocus
										name='title'
										type='text'
										placeholder={__('Title')}
										onChange={this.updateData}
										value={this.props.item.title}/>
									<HelpBlock>{this.props.errors.title}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='type'
									validationState={this.props.errors.type ? 'error': null}>
									<ControlLabel><Text>Type</Text></ControlLabel>
									<Select
										name='type'
										placeholder={__('Type')}
										onChange={this.updateData}
										value={this.props.item.type}
										disabled={!!this.props.item.id}
										options={Tag.getTagTypeOptions(__)}/>
									<HelpBlock>{this.props.errors.type}</HelpBlock>
								</FormGroup>
								<FormGroup
									controlId='description'
									validationState={this.props.errors.description ? 'error': null}>
									<ControlLabel><Text>Description</Text></ControlLabel>
									<FormControl
										name='description'
										componentClass='textarea'
										onChange={this.updateData}
										placeholder={__('Description')}
										value={this.props.item.description}
										options={Tag.getTagTypeOptions(__)}/>
									<HelpBlock>{this.props.errors.description}</HelpBlock>
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

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Tags</Text></h3>
						<div>
							<Text>Add tap-able strings for various categories like attendance, exams, result etc. to give more specific feedback.</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						btnText='Add Tag'
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
				<FormControl
					type='text'
					title={__('Title')}
					placeholder={__('Title')}
					name='tagdetail__title'
					onChange={this.updateFilter}
					value={filterValue(filters, 'tagdetail__title', '')} />
				<Select
					title={__('Type')}
					name='tag__type__eq'
					onChange={this.updateFilter}
					placeholder={__('Select Type')}
					options={Tag.getTagTypeOptions(__)}
					value={filterValue(filters, 'tag__type__eq', null)}/>
				<Select
					title={__('Status')}
					name='tag__is_active__eq'
					onChange={this.updateFilter}
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'tag__is_active__eq', null)}/>
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
								<Text>Title</Text>
							</td>
							<td className='tw-20'>
								<Text>Type</Text>
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
						disabled={!this.permissions.status}
						value={item.is_active}/>
				</td>
				<td className='tw-35'>
					{item.tagdetails[0].title}
				</td>
				<td className='tw-20'>
					<Text>{Tag.getTagType(item.type)}</Text>
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

	static getTagType(tagType){
		switch(tagType) {
			case 0:
				return 'Attendance';
			case 1:
				return 'Exam';
			case 2:
				return 'Leave';
			case 3:
				return 'Assignment';
			case 4:
				return 'Complaint';
			case 5:
				return 'Conduct';
			case 6:
				return 'Remarks';
			case 7:
				return 'Result';
			case 8:
				return 'Timetable';			
		}
	}

	static getTagTypeOptions(__) {
		return [
			{
				value: '3',
				label: __('Assignment')
			},
			{
				value: '0',
				label: __('Attendance')
			},
			{
				value: '1',
				label: __('Exam')
			},
			{
				value: '2',
				label: __('Leave')
			},
			{
				value: '4',
				label: __('Complaint')
			},
			{
				value: '5',
				label: __('Conduct')
			},
			{
				value: '6',
				label: __('Remarks')
			},
			{
				value: '7',
				label: __('Result')
			},
			{
				value: '8',
				label: __('Timetable')
			}
		];
	}
}