import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/dealregister';
import * as actions from '../redux/actions/dealregister';
addView('dealregister', reducer);

import {
	View,
	Text,
	Icon,
	Modal,
	Table,
	Loading,
	DateView,
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
export default class DealRegister extends React.Component {
	
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
								<Text>Deal Registration</Text>
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
										<td><strong><Text>Business Name</Text></strong></td>
										<td>{this.props.item.business_name}</td>
									</tr>
									<tr>
										<td><strong><Text>Business URL</Text></strong></td>
										<td>{this.props.item.business_url}</td>
									</tr>
									<tr>
										<td><strong><Text>Contact Person Name</Text></strong></td>
										<td>{this.props.item.fullname}</td>
									</tr>
									<tr>
										<td><strong><Text>Email</Text></strong></td>
										<td>{this.props.item.email_address}</td>
									</tr>
									<tr>
										<td><strong><Text>Country</Text></strong></td>
										<td>{this.props.item.country && this.props.item.country.countrydetails[0].name}</td>
									</tr>
									<tr>
										<td><strong><Text>State</Text></strong></td>
										<td>{this.props.item.state && this.props.item.state.statedetails[0].name}</td>
									</tr>
									<tr>
										<td><strong><Text>Institution/Organization Name</Text></strong></td>
										<td>{this.props.item.institution}</td>
									</tr>
									<tr>
										<td><strong><Text>Institution/School for which School-ERP</Text></strong></td>
										<td>{this.props.item.institute_erp}</td>
									</tr>
									<tr>
										<td><strong><Text>Count of Students at the Institution/School</Text></strong></td>
										<td>{this.props.item.count_of_students}</td>
									</tr>
									<tr>
										<td><strong><Text>Partner Code</Text></strong></td>
										<td>{this.props.item.partner_code}</td>
									</tr>
									<tr>
										<td><strong><Text>Additional Information</Text></strong></td>
										<td>{this.props.item.additional_info}</td>
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
					name='dealregistration__prospect_name'
					onChange={this.updateFilter}
					title={__('Name')}
					placeholder={__('Name')}
					value={filterValue(filters, 'dealregistration__prospect_name', '')}/>
				<FormControl
					type='text'
					title={__('Email')}
					name='dealregistration__email'
					onChange={this.updateFilter}
					placeholder={__('Email')}
					value={filterValue(filters, 'dealregistration__email', '')}/>
				<FormControl
					type='text'
					title={__('Phone')}
					name='dealregistration__phone'
					onChange={this.updateFilter}
					placeholder={__('Phone')}
					value={filterValue(filters, 'dealregistration__phone', '')}/>
				<FormControl
					type='text'
					title={__('Institute')}
					name='dealregistration__institution'
					placeholder={__('Institute')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'dealregistration__institution', '')}/>	
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
							<td className='tw-22'><Text>{'Prospect\'s Name'}</Text></td>
							<td className='tw-22'><Text>Email</Text></td>
							<td className='tw-22'><Text>Phone</Text></td>
							<td className='tw-22'><Text>Institution Name</Text></td>
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
				<td className='tw-22'>{item.prospect_name}</td>
				<td className='tw-22'>{item.email}</td>
				<td className='tw-22'>{item.phone}</td>
				<td className='tw-22'>{item.institution}</td>
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

