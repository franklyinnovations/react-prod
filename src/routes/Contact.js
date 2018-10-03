import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {getDemoOptions} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/contact';
import * as actions from '../redux/actions/contact';
addView('contact', reducer);

import {
	View,
	Text,
	Select,
	Icon,
	Modal,
	Table,
	DateView,
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

export default class Contact extends React.Component {
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
								<Text>Contact Request</Text>
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
										<td><strong><Text>Organization Name</Text></strong></td>
										<td>{this.props.item.organization_name}</td>
									</tr>
									<tr>
										<td><strong><Text>Contact Person Name</Text></strong></td>
										<td>{this.props.item.name}</td>
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
										<td><strong><Text>Try Demo</Text></strong></td>
										<td>{this.props.item.try_demo}</td>
									</tr>
									<tr>
										<td><strong><Text>Query</Text></strong></td>
										<td>{this.props.item.query}</td>
									</tr>
									<tr>
										<td><strong><Text>Country</Text></strong></td>
										<td>{this.props.item.country && this.props.item.country.countrydetails[0].name}</td>
									</tr>
									<tr>
										<td><strong><Text>Skype</Text></strong></td>
										<td>{this.props.item.skypeId}</td>
									</tr>
									<tr>
										<td><strong><Text>Created At</Text></strong></td>
										<td><DateView>{this.props.item.createdAt}</DateView></td>
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
					name='contact__nature_of_interest'
					onChange={this.updateFilter}
					title={__('Nature')}
					placeholder={__('The nature of your interest')}
					value={filterValue(filters, 'contact__nature_of_interest', '')}/>
				<FormControl
					type='text'
					title={__('Organization')}
					name='contact__organization_name'
					onChange={this.updateFilter}
					placeholder={__('Organization Name')}
					value={filterValue(filters, 'contact__organization_name', '')}/>
				<FormControl
					type='text'
					title={__('Person Name')}
					name='contact__name'
					onChange={this.updateFilter}
					placeholder={__('Contact Person Name')}
					value={filterValue(filters, 'contact__name', '')}/>
				<FormControl
					type='text'
					title={__('Email')}
					name='contact__email'
					placeholder={__('Email')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'contact__email', '')}/>
				<FormControl
					type='text'
					title={__('Mobile')}
					name='contact__mobile'
					placeholder={__('Mobile')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'contact__mobile', '')}/>
				<Select
					title={__('Try Demo')}
					onChange={this.updateFilter}
					name='contact__try_demo'
					options={getDemoOptions(__)}
					placeholder={__('Try Demo')}
					value={filterValue(filters, 'contact__try_demo', null)}/>	
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
							<td className='tw-14'><Text>The nature of your interest</Text></td>
							<td className='tw-14'><Text>Organization Name</Text></td>
							<td className='tw-14'><Text>Contact Person Name</Text></td>
							<td className='tw-14'><Text>Email</Text></td>
							<td className='tw-14'><Text>Mobile</Text></td>
							<td className='tw-14'><Text>Try Demo</Text></td>
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
				<td className='tw-14'>{item.nature_of_interest}</td>
				<td className='tw-14'>{item.organization_name}</td>
				<td className='tw-14'>{item.name}</td>
				<td className='tw-14'>{item.email}</td>
				<td className='tw-14'>{item.mobile}</td>
				<td className='tw-14'>
					<Text>{(item.try_demo == 'Yes') ? 'Yes' : 'No'}</Text>
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

