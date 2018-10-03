import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/demorequest';
import * as actions from '../redux/actions/demorequest';
addView('demorequest', reducer);

import {
	View,
	Text,
	Icon,
	Modal,
	Table,
	Loading,
	DataTable,
	Pagination,
	FormControl,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class DemoRequest extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

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

	view = event => this.props.dispatch(
		actions.viewData(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData()}
				</View>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Demo Request</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Table bordered striped condensed>
								<tbody>
									<tr>
										<td><strong><Text>Name</Text></strong></td>
										<td>{this.props.item.first_name + ' ' + this.props.item.last_name}</td>
									</tr>
									<tr>
										<td><strong><Text>School Name</Text></strong></td>
										<td>{this.props.item.school_name}</td>
									</tr>
									<tr>
										<td><strong><Text>Number Of Students</Text></strong></td>
										<td>{this.props.item.number_of_students}</td>
									</tr>
									<tr>
										<td><strong><Text>Email</Text></strong></td>
										<td>{this.props.item.email}</td>
									</tr>
									<tr>
										<td><strong><Text>Mobile</Text></strong></td>
										<td>{this.props.item.mobile}</td>
									</tr>
									<tr>
										<td><strong><Text>Message</Text></strong></td>
										<td>{this.props.item.message}</td>
									</tr>
								</tbody>
							</Table>
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
				<FormControl
					type='text'
					name='demo__first_name'
					onChange={this.updateFilter}
					title={__('Name')}
					placeholder={__('Name')}
					value={filterValue(filters, 'demo__first_name', '')}/>
				<FormControl
					type='text'
					title={__('School Name')}
					name='demo__school_name'
					placeholder={__('School Name')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'demo__school_name', '')}/>	
				<FormControl
					type='text'
					title={__('Number Of Students')}
					name='demo__number_of_students'
					onChange={this.updateFilter}
					placeholder={__('Number Of Students')}
					value={filterValue(filters, 'demo__number_of_students', '')}/>
				<FormControl
					type='text'
					title={__('Email')}
					name='demo__email'
					onChange={this.updateFilter}
					placeholder={__('Email')}
					value={filterValue(filters, 'demo__email', '')}/>
				<FormControl
					type='text'
					title={__('Mobile')}
					name='demo__mobile'
					onChange={this.updateFilter}
					placeholder={__('Mobile')}
					value={filterValue(filters, 'demo__mobile', '')}/>	
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderData() {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-18'><Text>Name</Text></td>
							<td className='tw-18'><Text>School Name</Text></td>
							<td className='tw-18'><Text>Number Of Students</Text></td>
							<td className='tw-18'><Text>Email</Text></td>
							<td className='tw-18'><Text>Mobile</Text></td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows()}
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
				<td className='tw-18'>{item.first_name + ' '+ item.last_name}</td>
				<td className='tw-18'>{item.school_name}</td>
				<td className='tw-18'>{item.number_of_students}</td>
				<td className='tw-18'>{item.email}</td>
				<td className='tw-18'>{item.mobile}</td>
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

