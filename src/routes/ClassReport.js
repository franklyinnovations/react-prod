import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	bcsName,
	filterValue,
	moduleActions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/classreport';
import * as actions from '../redux/actions/classreport';
addView('classreport', reducer);

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
	FormGroup,
	DataTable,
	Datepicker,
	Pagination,
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
export default class ClassReport extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'classreport');
	view = event => this.props.dispatch(
		actions.viewReport(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
			+event.currentTarget.value,
		)
	);
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
	updateDate = event => this.props.dispatch({
		type: 'UPDATE_CR_DATE',
		value: event.currentTarget.value,
	});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData(__)}
				</View>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Report</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<div dangerouslySetInnerHTML={this.props.item.content}/>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
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
					options={this.props.meta.bcsmaps}
					value={filterValue(filters, 'bcsMapId', '')} />
				<Select
					name='userId'
					title={__('Teacher')}
					onChange={this.updateFilter}
					options={this.props.meta.users}
					placeholder={__('Select Teacher')}
					value={filterValue(filters, 'userId', '')} />
				<Select
					name='subjectId'
					title={__('Subject')}
					onChange={this.updateFilter}
					placeholder={__('Select Subject')}
					options={this.props.meta.subjects}
					value={filterValue(filters, 'subjectId', '')} />
				<Select
					title={__('Status')}
					name='is_locked'
					onChange={this.updateFilter}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'is_locked', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<React.Fragment>
				<Col md={5}>
					<div className='form-horizontal'>
						<FormGroup>
							<Col className='text-left' componentClass={ControlLabel} md={2}>
								<Text>Date</Text>
							</Col>
							<Col md={7}>
								<Datepicker
									onChange={this.updateDate}
									value={this.props.meta.date}/>
							</Col>
							<Col md={3}>
								<Button onClick={this.search}>
									<Text>Go</Text>
								</Button>
							</Col>
						</FormGroup>
					</div>
				</Col>
				<Col md={7}>
					<Row>
						<View.Actions>
							<View.Action onClick={this.toggleFilters} title={__('Filters')}>
								<Icon glyph='fa-filter'/>
							</View.Action>
							<View.Action onClick={this.reset} title={__('Reset')}>
								<Icon glyph='fa-redo-alt'/>
							</View.Action>
						</View.Actions>
					</Row>
				</Col>
			</React.Fragment>
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
							<td className='tw-21'>
								<Text>Class</Text>
							</td>
							{
								this.props.session.user_type !== 'teacher' &&
								<td className='tw-21'>
									<Text>Teacher</Text>
								</td>
							}
							<td className='tw-21'>
								<Text>Subject</Text>
							</td>
							<td className='tw-21'>
								<Text>Time</Text>
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
						icons={CheckboxIcons}
						value={item.is_locked}
						data-item-id={item.id}
						onChange={this.changeStatus}
						data-item-status={item.is_locked}
						disabled={!this.permissions.status}
						title={getStatusTitle(item.is_locked, __)}/>
				</td>
				<td className='tw-21'>
					{bcsName(item.bcsmap)}
				</td>
				{
					this.props.session.user_type !== 'teacher' &&
					<td className='tw-21'>{item.user.userdetails[0].fullname}</td>
				}
				<td className='tw-21'>
					{item.subject.subjectdetails[0].name}
				</td>
				<td className='tw-21'>
					<Text>{item.time}</Text>
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.id}/>
					</DataTable.Actions>
				</td>
			</tr>
		));
	}
}

function getStatusTitle(status) {
	switch (status) {
		case 0:
			return 'Unlocked';
		case 1:
			return 'Locked';
	}
}

function getStatusOptions(__) {
	return [{
		value: 0,
		label: __('Unlocked')
	},{
		value: 1,
		label: __('Locked')
	}];
}

const CheckboxIcons = [
	{
		glyph: 'fa-lock-open',
		bundle: 'fas',
		text: 'text-info',
	},
	{
		bundle: 'fas',
		glyph: 'fa-lock',
		text: 'text-info',
	},
	{
		bundle: 'fas',
		glyph: 'fa-spinner',
		text: 'text-info',
	},
];